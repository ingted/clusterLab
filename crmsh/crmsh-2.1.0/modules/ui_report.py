# Copyright (C) 2008-2011 Dejan Muhamedagic <dmuhamedagic@suse.de>
# Copyright (C) 2013 Kristoffer Gronlund <kgronlund@suse.com>
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public
# License as published by the Free Software Foundation; either
# version 2.1 of the License, or (at your option) any later version.
#
# This software is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public
# License along with this library; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
#

import os
import utils
import config
import options
import subprocess
from signal import signal, SIGPIPE, SIG_DFL


def create_report(context, args):
    toolopts = [os.path.join(config.path.sharedir, 'hb_report'),
                'hb_report',
                'crm_report']
    extcmd = None
    for tool in toolopts:
        if utils.is_program(tool):
            extcmd = tool
            break
    if not extcmd:
        context.fatal_error("No reporting tool found")
    cmd = [extcmd] + list(args)
    if options.regression_tests:
        print ".EXT", cmd
    return subprocess.call(cmd, shell=False, preexec_fn=lambda: signal(SIGPIPE, SIG_DFL))
