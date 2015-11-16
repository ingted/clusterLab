/* include/config.h.  Generated from config.h.in by configure.  */
/* include/config.h.in.  Generated from configure.ac by autoheader.  */

/* Define if building universal (internal helper macro) */
/* #undef AC_APPLE_UNIVERSAL_BUILD */

/* Set if CLOCK_T is adequate by itself for the "indefinite future" (>= 100
   years) */
#define CLOCK_T_IS_LONG_ENOUGH 1

/* big-endian */
/* #undef CONFIG_BIG_ENDIAN */

/* little-endian */
#define CONFIG_LITTLE_ENDIAN 1

/* Build version */
#define GLUE_BUILD_VERSION "56f40ec5d37e default tip"

/* Location for daemons */
#define GLUE_DAEMON_DIR "/usr/lib/heartbeat"

/* Group to run daemons as */
#define GLUE_DAEMON_GROUP "haclient"

/* User to run daemons as */
#define GLUE_DAEMON_USER "hacluster"

/* Location for scripts */
#define GLUE_SHARED_DIR "/usr/share/cluster-glue"

/* Where to keep state files and sockets */
#define GLUE_STATE_DIR "/usr/var/run"

/* Current version of the glue library */
#define GLUE_VERSION "1.0.12"

/* Define to 1 if you have the `alphasort' function. */
#define HAVE_ALPHASORT 1

/* Define to 1 if you have the <arpa/inet.h> header file. */
#define HAVE_ARPA_INET_H 1

/* Define to 1 if you have the <asm/types.h> header file. */
#define HAVE_ASM_TYPES_H 1

/* Define to 1 if you have the <assert.h> header file. */
#define HAVE_ASSERT_H 1

/* Define to 1 if you have the <auth-client.h> header file. */
#define HAVE_AUTH_CLIENT_H 1

/* Define to 1 if you have the <bzlib.h> header file. */
#define HAVE_BZLIB_H 1

/* Define to 1 if you have the <ctype.h> header file. */
#define HAVE_CTYPE_H 1

/* Define to 1 if you have the <curl/curl.h> header file. */
#define HAVE_CURL_CURL_H 1

/* Define to 1 if you have the `daemon' function. */
#define HAVE_DAEMON 1

/* Have getopt function */
#define HAVE_DECL_GETOPT 1

/* Define to 1 if you have the declaration of `tzname', and to 0 if you don't.
   */
/* #undef HAVE_DECL_TZNAME */

/* Define to 1 if you have the <dirent.h> header file. */
#define HAVE_DIRENT_H 1

/* Define to 1 if you have the <dlfcn.h> header file. */
#define HAVE_DLFCN_H 1

/* Define to 1 if you have the <errno.h> header file. */
#define HAVE_ERRNO_H 1

/* Define to 1 if you have the <fcntl.h> header file. */
#define HAVE_FCNTL_H 1

/* Define to 1 if you have the `getopt' function. */
#define HAVE_GETOPT 1

/* Define to 1 if you have the <getopt.h> header file. */
#define HAVE_GETOPT_H 1

/* Define to 1 if you have the `getpeereid' function. */
/* #undef HAVE_GETPEEREID */

/* Define to 1 if you have the `getpeerucred' function. */
/* #undef HAVE_GETPEERUCRED */

/* Define to 1 if you have the <glib.h> header file. */
#define HAVE_GLIB_H 1

/* Define to 1 if you have the <grp.h> header file. */
#define HAVE_GRP_H 1

/* Define to 1 if you have the `g_log_set_default_handler' function. */
#define HAVE_G_LOG_SET_DEFAULT_HANDLER 1

/* Define to 1 if you have the `inet_pton' function. */
#define HAVE_INET_PTON 1

/* Define to 1 if you have the <inttypes.h> header file. */
#define HAVE_INTTYPES_H 1

/* Define to 1 if you have the `bz2' library (-lbz2). */
#define HAVE_LIBBZ2 1

/* Define to 1 if you have the `c' library (-lc). */
#define HAVE_LIBC 1

/* Define to 1 if you have the `dl' library (-ldl). */
#define HAVE_LIBDL 1

/* Define to 1 if you have the `gnugetopt' library (-lgnugetopt). */
/* #undef HAVE_LIBGNUGETOPT */

/* Define to 1 if you have the `intl' library (-lintl). */
/* #undef HAVE_LIBINTL */

/* Libnet 1.0 API */
/* #undef HAVE_LIBNET_1_0_API */

/* Libnet 1.1 API */
/* #undef HAVE_LIBNET_1_1_API */

/* Define to 1 if you have the <libnet.h> header file. */
/* #undef HAVE_LIBNET_H */

/* Define to 1 if you have the `nsl' library (-lnsl). */
/* #undef HAVE_LIBNSL */

/* Define to 1 if you have the `posix4' library (-lposix4). */
/* #undef HAVE_LIBPOSIX4 */

/* Define to 1 if you have the `rt' library (-lrt). */
#define HAVE_LIBRT 1

/* Define to 1 if you have the `socket' library (-lsocket). */
/* #undef HAVE_LIBSOCKET */

/* Define to 1 if you have the <libutil.h> header file. */
/* #undef HAVE_LIBUTIL_H */

/* Define to 1 if you have the `uuid' library (-luuid). */
#define HAVE_LIBUUID 1

/* Define to 1 if you have the `xml2' library (-lxml2). */
#define HAVE_LIBXML2 1

/* Define to 1 if you have the <libxml/xpath.h> header file. */
#define HAVE_LIBXML_XPATH_H 1

/* Define to 1 if you have the `z' library (-lz). */
#define HAVE_LIBZ 1

/* Define to 1 if you have the <limits.h> header file. */
#define HAVE_LIMITS_H 1

/* Define to 1 if you have the <linux/errqueue.h> header file. */
#define HAVE_LINUX_ERRQUEUE_H 1

/* Define to 1 if you have the <malloc.h> header file. */
#define HAVE_MALLOC_H 1

/* Define to 1 if you have the <memory.h> header file. */
#define HAVE_MEMORY_H 1

/* Define to 1 if you have the <netdb.h> header file. */
#define HAVE_NETDB_H 1

/* Define to 1 if you have the <netinet/icmp6.h> header file. */
#define HAVE_NETINET_ICMP6_H 1

/* Define to 1 if you have the <netinet/in.h> header file. */
#define HAVE_NETINET_IN_H 1

/* Define to 1 if you have the <netinet/ip.h> header file. */
#define HAVE_NETINET_IP_H 1

/* Define to 1 if you have the <net-snmp/net-snmp-config.h> header file. */
#define HAVE_NET_SNMP_NET_SNMP_CONFIG_H 1

/* Define to 1 if the system has the type `nfds_t'. */
#define HAVE_NFDS_T 1

/* Define to 1 if you have the `NoSuchFunctionName' function. */
/* #undef HAVE_NOSUCHFUNCTIONNAME */

/* Define to 1 if you have the <openhpi/SaHpi.h> header file. */
/* #undef HAVE_OPENHPI_SAHPI_H */

/* */
#define HAVE_POSIX_SIGNALS 1

/* Define to 1 if you have the `pstat' function. */
/* #undef HAVE_PSTAT */

/* Define to 1 if you have the <pthread.h> header file. */
#define HAVE_PTHREAD_H 1

/* Define to 1 if you have the <pwd.h> header file. */
#define HAVE_PWD_H 1

/* Define to 1 if you have the `scandir' function. */
#define HAVE_SCANDIR 1

/* Define to 1 if you have the `setenv' function. */
#define HAVE_SETENV 1

/* */
/* #undef HAVE_SETPROCTITLE */

/* Define to 1 if you have the <sgtty.h> header file. */
#define HAVE_SGTTY_H 1

/* Define to 1 if you have the <signal.h> header file. */
#define HAVE_SIGNAL_H 1

/* Define to 1 if you have the <stdarg.h> header file. */
#define HAVE_STDARG_H 1

/* Define to 1 if you have the <stddef.h> header file. */
#define HAVE_STDDEF_H 1

/* Define to 1 if you have the <stdint.h> header file. */
#define HAVE_STDINT_H 1

/* Define to 1 if you have the <stdio.h> header file. */
#define HAVE_STDIO_H 1

/* Define to 1 if you have the <stdlib.h> header file. */
#define HAVE_STDLIB_H 1

/* Define to 1 if you have the `strerror' function. */
#define HAVE_STRERROR 1

/* Define to 1 if cpp supports the ANSI # stringizing operator. */
#define HAVE_STRINGIZE 1

/* Define to 1 if you have the <strings.h> header file. */
#define HAVE_STRINGS_H 1

/* Define to 1 if you have the <string.h> header file. */
#define HAVE_STRING_H 1

/* Define to 1 if you have the `strlcat' function. */
/* #undef HAVE_STRLCAT */

/* Define to 1 if you have the `strlcpy' function. */
/* #undef HAVE_STRLCPY */

/* Define to 1 if you have the `strndup' function. */
#define HAVE_STRNDUP 1

/* Define to 1 if you have the `strnlen' function. */
#define HAVE_STRNLEN 1

/* Define to 1 if you have the <stropts.h> header file. */
#define HAVE_STROPTS_H 1

/* Define to 1 if `tm_gmtoff' is a member of `struct tm'. */
#define HAVE_STRUCT_TM_TM_GMTOFF 1

/* Define to 1 if `tm_zone' is a member of `struct tm'. */
#define HAVE_STRUCT_TM_TM_ZONE 1

/* */
#define HAVE_SYSLOG_FACILITYNAMES 1

/* Define to 1 if you have the <sys/cred.h> header file. */
/* #undef HAVE_SYS_CRED_H */

/* Define to 1 if you have the <sys/dir.h> header file. */
#define HAVE_SYS_DIR_H 1

/* Define to 1 if you have the <sys/filio.h> header file. */
/* #undef HAVE_SYS_FILIO_H */

/* Define to 1 if you have the <sys/ioctl.h> header file. */
#define HAVE_SYS_IOCTL_H 1

/* Define to 1 if you have the <sys/param.h> header file. */
#define HAVE_SYS_PARAM_H 1

/* Define to 1 if you have the <sys/poll.h> header file. */
#define HAVE_SYS_POLL_H 1

/* Define to 1 if you have the <sys/pstat.h> header file. */
/* #undef HAVE_SYS_PSTAT_H */

/* Define to 1 if you have the <sys/reboot.h> header file. */
#define HAVE_SYS_REBOOT_H 1

/* Define to 1 if you have the <sys/resource.h> header file. */
#define HAVE_SYS_RESOURCE_H 1

/* Define to 1 if you have the <sys/select.h> header file. */
#define HAVE_SYS_SELECT_H 1

/* Define to 1 if you have the <sys/socket.h> header file. */
#define HAVE_SYS_SOCKET_H 1

/* Define to 1 if you have the <sys/sockio.h> header file. */
/* #undef HAVE_SYS_SOCKIO_H */

/* Define to 1 if you have the <sys/stat.h> header file. */
#define HAVE_SYS_STAT_H 1

/* Define to 1 if you have the <sys/syslimits.h> header file. */
/* #undef HAVE_SYS_SYSLIMITS_H */

/* Define to 1 if you have the <sys/termios.h> header file. */
#define HAVE_SYS_TERMIOS_H 1

/* Define to 1 if you have the <sys/timeb.h> header file. */
#define HAVE_SYS_TIMEB_H 1

/* Define to 1 if you have the <sys/time.h> header file. */
#define HAVE_SYS_TIME_H 1

/* Define to 1 if you have the <sys/types.h> header file. */
#define HAVE_SYS_TYPES_H 1

/* Define to 1 if you have the <sys/ucred.h> header file. */
/* #undef HAVE_SYS_UCRED_H */

/* Define to 1 if you have the <sys/uio.h> header file. */
#define HAVE_SYS_UIO_H 1

/* Define to 1 if you have the <sys/un.h> header file. */
#define HAVE_SYS_UN_H 1

/* Define to 1 if you have the <sys/utsname.h> header file. */
#define HAVE_SYS_UTSNAME_H 1

/* Define to 1 if you have the <sys/wait.h> header file. */
#define HAVE_SYS_WAIT_H 1

/* Define to 1 if you have the <termios.h> header file. */
#define HAVE_TERMIOS_H 1

/* Define to 1 if you have the <time.h> header file. */
#define HAVE_TIME_H 1

/* Define to 1 if your `struct tm' has `tm_zone'. Deprecated, use
   `HAVE_STRUCT_TM_TM_ZONE' instead. */
#define HAVE_TM_ZONE 1

/* Define to 1 if you don't have `tm_zone' but do have the external array
   `tzname'. */
/* #undef HAVE_TZNAME */

/* Define to 1 if you have the <ucd-snmp/snmp.h> header file. */
/* #undef HAVE_UCD_SNMP_SNMP_H */

/* Define to 1 if you have the <ucred.h> header file. */
/* #undef HAVE_UCRED_H */

/* Define to 1 if you have the <unistd.h> header file. */
#define HAVE_UNISTD_H 1

/* Define to 1 if you have the `unsetenv' function. */
#define HAVE_UNSETENV 1

/* Define to 1 if you have the <vacmclient_api.h> header file. */
/* #undef HAVE_VACMCLIENT_API_H */

/* Define to 1 if you have the <winsock.h> header file. */
/* #undef HAVE_WINSOCK_H */

/* Define to 1 if you have the <xti.h> header file. */
/* #undef HAVE_XTI_H */

/* Define to 1 if you have the <zlib.h> header file. */
#define HAVE_ZLIB_H 1

/* */
#define HAVE___PROGNAME 1

/* Group to run daemons as */
#define HA_APIGROUP "haclient"

/* User to run daemons as */
#define HA_CCMUSER "hacluster"

/* top directory of area to drop core files in */
#define HA_COREDIR "/usr/var/lib/heartbeat/cores"

/* Location for v1 Heartbeat configuration */
#define HA_HBCONF_DIR "/usr/etc/ha.d/"

/* Location for daemons */
#define HA_LIBHBDIR "/usr/lib/heartbeat"

/* Logging Daemon IPC socket name */
#define HA_LOGDAEMON_IPC "/usr/var/lib/heartbeat/log_daemon"

/* Default logging facility */
#define HA_LOG_FACILITY LOG_DAEMON

/* Where to find plugins */
#define HA_PLUGIN_DIR "/usr/lib/heartbeat/plugins"

/* Location of system configuration files */
#define HA_SYSCONFDIR "/usr/etc"

/* Web site base URL */
#define HA_URLBASE "http://linux-ha.org/wiki/"

/* Whatever this used to mean */
#define HA_VARLIBDIR "/usr/var/lib/heartbeat"

/* Whatever this used to mean */
#define HA_VARLIBHBDIR "/usr/var/lib/heartbeat"

/* System lock directory */
#define HA_VARLOCKDIR "/usr/var/lock"

/* Where Heartbeat keeps state files and sockets - old name */
#define HA_VARRUNDIR "/usr/var/run"

/* Location for v1 Heartbeat RAs */
#define HB_RA_DIR "/usr/etc/ha.d/resource.d/"

/* option for ifconfig command */
#define IFCONFIG_A_OPT "-a"

/* CIB secrets location */
#define LRM_CIBSECRETS "/usr/var/lib/heartbeat/lrm/secrets"

/* Where to find LRM plugins */
#define LRM_PLUGIN_DIR "/usr/lib/heartbeat/plugins/RAExec"

/* LRM directory */
#define LRM_VARLIBDIR "/usr/var/lib/heartbeat/lrm"

/* Location for LSB RAs */
#define LSB_RA_DIR "/etc/init.d"

/* Define to the sub-directory in which libtool stores uninstalled libraries.
   */
#define LT_OBJDIR ".libs/"

/* Location for OCF RAs */
#define OCF_RA_DIR "/usr/lib/ocf/resource.d/"

/* OCF root directory - specified by the OCF standard */
#define OCF_ROOT_DIR "/usr/lib/ocf"

/* Compiling for Darwin platform */
/* #undef ON_DARWIN */

/* Compiling for Linux platform */
#define ON_LINUX 1

/* Name of package */
#define PACKAGE "cluster-glue"

/* Define to the address where bug reports for this package should be sent. */
#define PACKAGE_BUGREPORT "linux-ha-dev@lists.linux-ha.org"

/* Define to the full name of this package. */
#define PACKAGE_NAME "cluster-glue"

/* Define to the full name and version of this package. */
#define PACKAGE_STRING "cluster-glue 1.0.12"

/* Define to the one symbol short name of this package. */
#define PACKAGE_TARNAME "cluster-glue"

/* Define to the home page for this package. */
#define PACKAGE_URL ""

/* Define to the version of this package. */
#define PACKAGE_VERSION "1.0.12"

/* mechanism to pretty-print ps output: setproctitle-equivalent */
#define PF_ARGV_TYPE PF_ARGV_WRITEABLE

/* Default plugin search path */
#define PILS_BASE_PLUGINDIR "/usr/lib/heartbeat/plugins"

/* path to the poweroff command */
#define POWEROFF_CMD "/sbin/poweroff"

/* poweroff options */
#define POWEROFF_OPTIONS "-nf"

/* path to the reboot command */
#define REBOOT "/sbin/reboot"

/* number of arguments for reboot system call */
#define REBOOT_ARGS 1

/* reboot options */
#define REBOOT_OPTIONS "-nf"

/* The size of `char', as computed by sizeof. */
#define SIZEOF_CHAR 1

/* The size of `clock_t', as computed by sizeof. */
#define SIZEOF_CLOCK_T 8

/* The size of `int', as computed by sizeof. */
#define SIZEOF_INT 4

/* The size of `long', as computed by sizeof. */
#define SIZEOF_LONG 8

/* The size of `long long', as computed by sizeof. */
#define SIZEOF_LONG_LONG 8

/* The size of `short', as computed by sizeof. */
#define SIZEOF_SHORT 2

/* Define to 1 if you have the ANSI C header files. */
#define STDC_HEADERS 1

/* Location of non-plugin stonith scripts */
#define STONITH_EXT_PLUGINDIR "/usr/lib/stonith/plugins/external"

/* Location of stonith plugins */
#define STONITH_MODULES "/usr/lib/stonith/plugins"

/* Location of RHCS fence scripts */
#define STONITH_RHCS_PLUGINDIR "/usr/lib/stonith/plugins/rhcs"

/* Stonith plugin domain */
#define ST_TEXTDOMAIN "stonith"

/* Define to 1 if your <sys/time.h> declares `struct tm'. */
/* #undef TM_IN_SYS_TIME */

/* Correct printf format for logging uint64_t */
#define U64T "%lu"

/* Valgrind command */
#define VALGRIND_BIN "/usr/bin/valgrind"

/* Version number of package */
#define VERSION "1.0.12"

/* Define WORDS_BIGENDIAN to 1 if your processor stores words with the most
   significant byte first (like Motorola and SPARC, unlike Intel). */
#if defined AC_APPLE_UNIVERSAL_BUILD
# if defined __BIG_ENDIAN__
#  define WORDS_BIGENDIAN 1
# endif
#else
# ifndef WORDS_BIGENDIAN
/* #  undef WORDS_BIGENDIAN */
# endif
#endif

/* Define to `unsigned int' if <sys/types.h> does not define. */
/* #undef size_t */
