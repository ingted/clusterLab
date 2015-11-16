/* include/glue_config.h.  Generated from glue_config.h.in by configure.  */
/* include/config.h.in.  Generated from configure.in by autoheader.  */

/* Location for daemons */
#define GLUE_DAEMON_DIR "/usr/lib/heartbeat"

/* Group to run daemons as */
#define GLUE_DAEMON_GROUP "haclient"

/* User to run daemons as */
#define GLUE_DAEMON_USER "hacluster"

/* Where to keep state files and sockets */
#define GLUE_STATE_DIR "/usr/var/run"

/* Location of shared data */
#define GLUE_SHARED_DIR "/usr/share/cluster-glue"

/* User to run daemons as */
#define HA_CCMUSER "hacluster"

/* Group to run daemons as */
#define HA_APIGROUP "haclient"

/* Location for daemons */
#define HA_LIBHBDIR "/usr/lib/heartbeat"

/* top directory of area to drop core files in */
#define HA_COREDIR "/usr/var/lib/heartbeat/cores"

/* top directory for LRM related files */
#define LRM_VARLIBDIR "/usr/var/lib/heartbeat/lrm"

/* CIB secrets */
#define LRM_CIBSECRETS "/usr/var/lib/heartbeat/lrm/secrets"

/* Logging Daemon IPC socket name */
#define HA_LOGDAEMON_IPC "/usr/var/lib/heartbeat/log_daemon"

/* Default logging facility */
#define HA_LOG_FACILITY LOG_DAEMON

/* Default plugin search path */
#define PILS_BASE_PLUGINDIR "/usr/lib/heartbeat/plugins"

/* Where to find plugins */
#define HA_PLUGIN_DIR "/usr/lib/heartbeat/plugins"

/* Location of system configuration files */
#define HA_SYSCONFDIR "/usr/etc"

/* Web site base URL */
#define HA_URLBASE "http://linux-ha.org/wiki/"

/* Whatever this used to mean */
#define HA_VARLIBHBDIR "/usr/var/lib/heartbeat"

#define HA_VARLIBDIR "/usr/var/lib/heartbeat"

/* System lock directory */
#define HA_VARLOCKDIR "/usr/var/lock"

/* Where Heartbeat keeps state files and sockets - old name */
#define HA_VARRUNDIR "/usr/var/run"

/* Location for v1 Heartbeat RAs */
#define HB_RA_DIR "/usr/etc/ha.d/resource.d/"

/* Where to find LRM plugins */
#define LRM_PLUGIN_DIR "/usr/lib/heartbeat/plugins/RAExec"

/* Location for LSB RAs */
#define LSB_RA_DIR "/etc/init.d"

/* Location for OCF RAs */
#define OCF_RA_DIR "/usr/lib/ocf/resource.d/"

/* OCF root directory - specified by the OCF standard */
#define OCF_ROOT_DIR "/usr/lib/ocf"

/* Compiling for Darwin platform */
/* #undef ON_DARWIN */

/* Compiling for Linux platform */
#define ON_LINUX 1

/* Current glue version */
#define GLUE_VERSION "1.0.12"

/* Build version */
#define GLUE_BUILD_VERSION "56f40ec5d37e default tip"

/* Location of non-pluing stonith scripts */
#define STONITH_EXT_PLUGINDIR "/usr/lib/stonith/plugins/external"

/* Location of RHCS stonith scripts */
#define STONITH_RHCS_PLUGINDIR "/usr/lib/stonith/plugins/rhcs"

/* Location of stonith plugins */
#define STONITH_MODULES "/usr/lib/stonith/plugins"

/* Stonith plugin domain */
#define ST_TEXTDOMAIN "stonith"

#define HA_HBCONF_DIR "/usr/etc/ha.d/"
