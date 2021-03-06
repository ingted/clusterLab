PCSD_EXEC_LOCATION = '/usr/lib/pcsd/'
PCSD_VAR_LOCATION = '/var/lib/pcsd/'

CRT_FILE = PCSD_VAR_LOCATION + 'pcsd.crt'
KEY_FILE = PCSD_VAR_LOCATION + 'pcsd.key'
COOKIE_FILE = PCSD_VAR_LOCATION + 'pcsd.cookiesecret'

OCF_ROOT = "/usr/lib/ocf"
HEARTBEAT_AGENTS_DIR = "/usr/lib/ocf/resource.d/heartbeat/"
PACEMAKER_AGENTS_DIR = "/usr/lib/ocf/resource.d/pacemaker/"
PENGINE = "/usr/libexec/pacemaker/pengine"
CRM_NODE = "/usr/sbin/crm_node"
CRM_ATTRIBUTE = "/usr/sbin/crm_attribute"
COROSYNC_BINARIES = "/usr/sbin/"
CMAN_TOOL = "/usr/sbin/cman_tool"
PACEMAKERD = "/usr/sbin/pacemakerd"
CIBADMIN = "/usr/sbin/cibadmin"

SUPERUSER = 'hacluster'
$user_pass_file = "pcs_users.conf"
