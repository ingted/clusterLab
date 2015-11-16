# Modified pssh
# Copyright (c) 2011, Dejan Muhamedagic
# Copyright (c) 2009, Andrew McNabb
# Copyright (c) 2003-2008, Brent N. Chun

"""Parallel ssh to the set of nodes in hosts.txt.

For each node, this essentially does an "ssh host -l user prog [arg0] [arg1]
...". The -o option can be used to store stdout from each remote node in a
directory.  Each output file in that directory will be named by the
corresponding remote node's hostname or IP address.
"""

import os
import sys
import glob
import re

parent, bindir = os.path.split(os.path.dirname(os.path.abspath(sys.argv[0])))
if os.path.exists(os.path.join(parent, 'psshlib')):
    sys.path.insert(0, parent)

from psshlib.manager import Manager, FatalError
from psshlib.task import Task
from psshlib.cli import common_parser, common_defaults

from msg import common_err, common_debug, common_warn


_DEFAULT_TIMEOUT = 60
_EC_LOGROT = 120


def option_parser():
    '''
    Create commandline option parser.
    '''
    parser = common_parser()
    parser.usage = "%prog [OPTIONS] command [...]"
    parser.epilog = "Example: pssh -h hosts.txt -l irb2 -o /tmp/foo uptime"

    parser.add_option('-i', '--inline', dest='inline', action='store_true',
                      help='inline aggregated output for each server')
    parser.add_option('-I', '--send-input', dest='send_input',
                      action='store_true',
                      help='read from standard input and send as input to ssh')
    parser.add_option('-P', '--print', dest='print_out', action='store_true',
                      help='print output as we get it')

    return parser


def parse_args(myargs, t=_DEFAULT_TIMEOUT):
    '''
    Parse the given commandline arguments.
    '''
    parser = option_parser()
    defaults = common_defaults(timeout=t)
    parser.set_defaults(**defaults)
    opts, args = parser.parse_args(myargs)
    return opts, args


def get_output(dir, host):
    '''
    Looks for the output returned by the given host.
    This is somewhat problematic, since it is possible that
    different hosts can have similar hostnames. For example naming
    hosts "host.1" and "host.2" will confuse this code.
    '''
    l = []
    for fname in ["%s/%s" % (dir, host)] + glob.glob("%s/%s.[0-9]*" % (dir, host)):
        try:
            if os.path.isfile(fname):
                l += open(fname).readlines()
        except:
            continue
    return l


def show_output(dir, hosts, desc):
    '''
    Display output from hosts. See get_output for caveats.
    '''
    for host in hosts:
        out_l = get_output(dir, host)
        if out_l:
            print "%s %s:" % (host, desc)
            print ''.join(out_l)


def do_pssh(l, opts):
    '''
    Adapted from psshlib. Perform command across list of hosts.
    l = [(host, command), ...]
    '''
    if opts.outdir and not os.path.exists(opts.outdir):
        os.makedirs(opts.outdir)
    if opts.errdir and not os.path.exists(opts.errdir):
        os.makedirs(opts.errdir)
    if opts.send_input:
        stdin = sys.stdin.read()
    else:
        stdin = None
    manager = Manager(opts)
    user = ""
    port = ""
    hosts = []
    for host, cmdline in l:
        cmd = ['ssh', host,
               '-o', 'PasswordAuthentication=no',
               '-o', 'SendEnv=PSSH_NODENUM',
               '-o', 'StrictHostKeyChecking=no']
        if opts.options:
            for opt in opts.options:
                cmd += ['-o', opt]
        if user:
            cmd += ['-l', user]
        if port:
            cmd += ['-p', port]
        if opts.extra:
            cmd.extend(opts.extra)
        if cmdline:
            cmd.append(cmdline)
        hosts.append(host)
        t = Task(host, port, user, cmd, opts, stdin)
        manager.add_task(t)
    try:
        return manager.run()  # returns a list of exit codes
    except FatalError:
        common_err("pssh to nodes failed")
        show_output(opts.errdir, hosts, "stderr")
        return False


def examine_outcome(l, opts, statuses):
    '''
    A custom function to show stderr in case there were issues.
    Not suited for callers who want better control of output or
    per-host processing.
    '''
    hosts = [x[0] for x in l]
    if min(statuses) < 0:
        # At least one process was killed.
        common_err("ssh process was killed")
        show_output(opts.errdir, hosts, "stderr")
        return False
    # The any builtin was introduced in Python 2.5 (so we can't use it yet):
    #elif any(x==255 for x in statuses):
    for status in statuses:
        if status == 255:
            common_warn("ssh processes failed")
            show_output(opts.errdir, hosts, "stderr")
            return False
    for status in statuses:
        if status not in (0, _EC_LOGROT):
            common_warn("some ssh processes failed")
            show_output(opts.errdir, hosts, "stderr")
            return False
    return True


def next_loglines(a, outdir, errdir):
    '''
    pssh to nodes to collect new logs.
    '''
    l = []
    for node, rptlog, logfile, nextpos in a:
        common_debug("updating %s from %s (pos %d)" %
                     (logfile, node, nextpos))
        cmdline = "perl -e 'exit(%d) if (stat(\"%s\"))[7]<%d' && tail -c +%d %s" % (
            _EC_LOGROT, logfile, nextpos-1, nextpos, logfile)
        myopts = ["-q", "-o", outdir, "-e", errdir]
        opts, args = parse_args(myopts)
        l.append([node, cmdline])
    statuses = do_pssh(l, opts)
    if statuses:
        return examine_outcome(l, opts, statuses)
    else:
        return False


def next_peinputs(node_pe_l, outdir, errdir):
    '''
    pssh to nodes to collect new logs.
    '''
    l = []
    for node, pe_l in node_pe_l:
        r = re.search("(.*)/pengine/", pe_l[0])
        if not r:
            common_err("strange, %s doesn't contain string pengine" % pe_l[0])
            continue
        dir = "/%s" % r.group(1)
        red_pe_l = [x.replace("%s/" % r.group(1), "") for x in pe_l]
        common_debug("getting new PE inputs %s from %s" % (red_pe_l, node))
        cmdline = "tar -C %s -cf - %s" % (dir, ' '.join(red_pe_l))
        myopts = ["-q", "-o", outdir, "-e", errdir]
        opts, args = parse_args(myopts)
        l.append([node, cmdline])
    if not l:
        # is this a failure?
        return True
    statuses = do_pssh(l, opts)
    if statuses:
        return examine_outcome(l, opts, statuses)
    else:
        return False


def do_pssh_cmd(cmd, node_l, outdir, errdir, timeout=20000):
    '''
    pssh to nodes and run cmd.
    '''
    l = []
    for node in node_l:
        l.append([node, cmd])
    if not l:
        return True
    myopts = ["-q", "-o", outdir, "-e", errdir]
    opts, args = parse_args(myopts, t=str(int(timeout/1000)))
    return do_pssh(l, opts)

# vim:ts=4:sw=4:et:
