# Copyright (C) 2013 Kristoffer Gronlund <kgronlund@suse.com>
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public
# License as published by the Free Software Foundation; either
# version 2 of the License, or (at your option) any later version.
#
# This software is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public
# License along with this library; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
#
'''
Holds user-configurable options.
'''

import os
import re
import ConfigParser
import userdir


_SYSTEMWIDE = '/etc/crm/crmsh.conf'
_PERUSER = os.getenv("CRM_CONFIG_FILE") or os.path.join(userdir.CONFIG_HOME, 'crm.conf')


# opt_ classes
# members: default, completions, validate()

class opt_program(object):
    def __init__(self, envvar, proglist):
        self.default = ''
        if envvar and os.getenv(envvar):
            self.default = os.getenv(envvar)
        else:
            for prog in proglist:
                if self._is_program(prog):
                    self.default = prog
                    break
        self.completions = proglist

    def _is_program(self, prog):
        """Is this program available?"""
        for p in os.getenv("PATH").split(os.pathsep):
            filename = os.path.join(p, prog)
            if os.path.isfile(filename) and os.access(filename, os.X_OK):
                return True
        return False

    def validate(self, prog):
        if not self._is_program(prog):
            raise ValueError("%s does not exist or is not a program" % prog)

    def get(self, value):
        if value.startswith('$'):
            return os.getenv(value[1:])
        elif value.startswith('\\$'):
            return value[1:]
        return value


class opt_string(object):
    def __init__(self, value):
        self.default = value
        self.completions = ()

    def validate(self, val):
        return True

    def get(self, value):
        return value


class opt_choice(object):
    def __init__(self, dflt, choices):
        self.default = dflt
        self.completions = choices

    def validate(self, val):
        if val not in self.completions:
            raise ValueError("%s not in %s" % (val, ', '.join(self.completions)))

    def get(self, value):
        return value


class opt_multichoice(object):
    def __init__(self, dflt, choices):
        self.default = dflt
        self.completions = choices

    def validate(self, val):
        vals = [x.strip() for x in val.split(',')]
        for otype in vals:
            if not otype in self.completions:
                raise ValueError("%s not in %s" % (val, ', '.join(self.completions)))

    def get(self, value):
        return value


class opt_boolean(object):
    def __init__(self, dflt):
        self.default = dflt
        self.completions = ('yes', 'true', 'on', 'no', 'false', 'off')

    def validate(self, val):
        if val is True:
            val = 'true'
        elif val is False:
            val = 'false'
        if val not in self.completions:
            raise ValueError("Not a boolean: %s" % (val))

    def get(self, value):
        return value.lower() in ('yes', 'true', 'on')


class opt_dir(object):
    opts = {
        'datadir': ('/usr/share', '/usr/local/share', '/opt'),
        'cachedir': ('/var/cache', '/opt/cache'),
        'libdir': ('/usr/lib64', '/usr/libexec', '/usr/lib',
                   '/usr/local/lib64', '/usr/local/libexec', '/usr/local/lib'),
        'varlib': ('/var/lib', '/opt/var/lib')
    }

    def __init__(self, path):
        self.default = ''
        self.completions = []
        m = re.match(r'\%\(([^\)]+)\)s(.+)', path)
        if m:
            t = m.group(1)
            for dd in self.opts[t]:
                if os.path.isdir(path % {t: dd}):
                    self.default = path % {t: dd}

    def validate(self, val):
        if not os.path.isdir(val):
            raise ValueError("Directory not found: " % (val))

    def get(self, value):
        return value


class opt_color(object):
    def __init__(self, val):
        self.default = val
        self.completions = ('black', 'blue', 'green', 'cyan',
                            'red', 'magenta', 'yellow', 'white',
                            'bold', 'blink', 'dim', 'reverse',
                            'underline', 'normal')

    def validate(self, val):
        for v in val.split(' '):
            if v not in self.completions:
                raise ValueError('Invalid color ' + val)

    def get(self, value):
        return [s.rstrip(',') for s in value.split(' ')] or ['normal']


DEFAULTS = {
    'core': {
        'editor': opt_program('$EDITOR', ('vim', 'vi', 'emacs', 'nano')),
        'pager': opt_program('$PAGER', ('less', 'more', 'pg')),
        'user': opt_string(''),
        'skill_level': opt_choice('expert', ('operator', 'administrator', 'expert')),
        'sort_elements': opt_boolean('yes'),
        'check_frequency': opt_choice('always', ('always', 'on-verify', 'never')),
        'check_mode': opt_choice('strict', ('strict', 'relaxed')),
        'wait': opt_boolean('no'),
        'add_quotes': opt_boolean('yes'),
        'manage_children': opt_choice('ask', ('ask', 'never', 'always')),
        'force': opt_boolean('no'),
        'debug': opt_boolean('no'),
        'ptest': opt_program('', ('ptest', 'crm_simulate')),
        'dotty': opt_program('', ('dotty',)),
        'dot': opt_program('', ('dot',))
    },
    'path': {
        'sharedir': opt_dir('%(datadir)s/crmsh'),
        'cache': opt_dir('%(cachedir)s/crm'),
        'crm_config': opt_dir('%(varlib)s/pacemaker/cib'),
        'crm_daemon_dir': opt_dir('%(libdir)s/pacemaker'),
        'crm_daemon_user': opt_string('hacluster'),
        'ocf_root': opt_dir('%(libdir)s/ocf'),
        'crm_dtd_dir': opt_dir('%(datadir)s/pacemaker'),
        'pe_state_dir': opt_dir('%(varlib)s/pacemaker/pengine'),
        'heartbeat_dir': opt_dir('%(varlib)s/heartbeat'),
        'hb_delnode': opt_program('', ('%(datadir)s/heartbeat/hb_delnode',)),
        'nagios_plugins': opt_dir('%(libdir)s/nagios/plugins')
    },
    'color': {
        'style': opt_multichoice('color', ('plain', 'color', 'uppercase')),
        'error': opt_color('red bold'),
        'ok': opt_color('green bold'),
        'warn': opt_color('yellow bold'),
        'info': opt_color('cyan'),
        'help_keyword': opt_color('blue bold underline'),
        'help_header': opt_color('normal bold'),
        'help_topic': opt_color('yellow bold'),
        'help_block': opt_color('cyan'),
        'keyword': opt_color('yellow'),
        'identifier': opt_color('normal'),
        'attr_name': opt_color('cyan'),
        'attr_value': opt_color('red'),
        'resource_reference': opt_color('green'),
        'id_reference': opt_color('green'),
        'score': opt_color('magenta'),
        'ticket': opt_color('magenta'),
    }
}

_parser = None


def _stringify(val):
    if val is True:
        return 'true'
    elif val is False:
        return 'false'
    elif isinstance(val, basestring):
        return val
    else:
        return str(val)


class _Configuration(object):
    def __init__(self):
        self._defaults = None
        self._systemwide = None
        self._user = None

    def load(self):
        self._defaults = ConfigParser.SafeConfigParser()
        for section, keys in DEFAULTS.iteritems():
            self._defaults.add_section(section)
            for key, opt in keys.iteritems():
                self._defaults.set(section, key, opt.default)

        if os.path.isfile(_SYSTEMWIDE):
            self._systemwide = ConfigParser.SafeConfigParser()
            self._systemwide.read([_SYSTEMWIDE])
        if os.path.isfile(_PERUSER):
            self._user = ConfigParser.SafeConfigParser()
            self._user.read([_PERUSER])

    def save(self):
        if self._user:
            if not os.path.isdir(os.path.dirname(_PERUSER)):
                os.makedirs(os.path.dirname(_PERUSER))
            fp = open(_PERUSER, 'w')
            self._user.write(fp)
            fp.close()

    def get_impl(self, section, name):
        if self._user and self._user.has_option(section, name):
            return self._user.get(section, name) or ''
        if self._systemwide and self._systemwide.has_option(section, name):
            return self._systemwide.get(section, name) or ''
        return self._defaults.get(section, name) or ''

    def get(self, section, name, raw=False):
        if raw:
            return self.get_impl(section, name)
        return DEFAULTS[section][name].get(self.get_impl(section, name))

    def set(self, section, name, value):
        if section not in ('core', 'path', 'color'):
            raise ValueError("Setting invalid section " + str(section))
        if not self._defaults.has_option(section, name):
            raise ValueError("Setting invalid option %s.%s" % (section, name))
        DEFAULTS[section][name].validate(value)
        if self._user is None:
            self._user = ConfigParser.SafeConfigParser()
        if not self._user.has_section(section):
            self._user.add_section(section)
        self._user.set(section, name, _stringify(value))

    def items(self, section):
        return [(k, self.get(section, k)) for k, _ in self._defaults.items(section)]

    def configured_keys(self, section):
        ret = []
        if self._systemwide and self._systemwide.has_section(section):
            ret += self._systemwide.options(section)
        if self._user and self._user.has_section(section):
            ret += self._user.options(section)
        return list(set(ret))

    def reset(self):
        '''reset to what is on disk'''
        self._user = ConfigParser.SafeConfigParser()
        self._user.read([_PERUSER])


_configuration = _Configuration()


class _Section(object):
    def __init__(self, section):
        object.__setattr__(self, 'section', section)

    def __getattr__(self, name):
        return _configuration.get(self.section, name)

    def __setattr__(self, name, value):
        _configuration.set(self.section, name, value)

    def items(self):
        return _configuration.items(self.section)


def load():
    _configuration.load()

    os.environ["OCF_ROOT"] = _configuration.get('path', 'ocf_root')


def save():
    '''
    Only save options that are not default
    '''
    _configuration.save()


def set_option(section, option, value):
    _configuration.set(section, option, value)


def get_option(section, option, raw=False):
    '''
    Return the given option.
    If raw is True, return the configured value.
    Example: for a boolean, returns "yes", not True
    '''
    return _configuration.get(section, option, raw=raw)


def get_all_options():
    '''Returns a list of all configurable options'''
    ret = []
    for sname, section in DEFAULTS.iteritems():
        ret += ['%s.%s' % (sname, option) for option in section.keys()]
    return sorted(ret)


def get_configured_options():
    '''Returns a list of all options that have a non-default value'''
    ret = []
    for sname in DEFAULTS.keys():
        for key in _configuration.configured_keys(sname):
            ret.append('%s.%s' % (sname, key))
    return ret


def complete(section, option):
    s = DEFAULTS.get(section)
    if not s:
        return []
    o = s.get(option)
    if not o:
        return []
    return o.completions


def has_user_config():
    return os.path.isfile(_PERUSER)


def reset():
    _configuration.reset()


load()
core = _Section('core')
path = _Section('path')
color = _Section('color')


def load_version():
    version, build = 'dev', 'unknown'
    versioninfo_file = os.path.join(path.sharedir, 'version')
    if os.path.isfile(versioninfo_file):
        v = open(versioninfo_file).xreadlines()
        try:
            version = v.next().strip() or version
            build = v.next().strip() or build
        except StopIteration:
            pass
    return version, build

VERSION, BUILD_VERSION = load_version()
CRM_VERSION = "%s (Build %s)" % (VERSION, BUILD_VERSION)
