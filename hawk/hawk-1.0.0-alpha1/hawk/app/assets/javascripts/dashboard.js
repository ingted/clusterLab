// Copyright (c) 2009-2015 Tim Serong <tserong@suse.com>
// See COPYING for license.

// https://<host>:7630/cib/mini.json

var dashboardAddCluster = (function() {

    var GETTEXT = {
        error: function() {
            return __('Error');
        },
        err_unexpected: function(msg) {
            return __('Unexpected server error: _MSG_').replace('_MSG_', msg);
        },
        err_conn_failed: function() {
            return __('Connection to server failed (server down or network error - will retry every 15 seconds).');
        },
        err_conn_timeout: function() {
            return __('Connection to server timed out - will retry every 15 seconds.');
        },
        err_conn_aborted: function() {
            return __('Connection to server aborted - will retry every 15 seconds.');
        },
        err_denied: function() {
            return __('Permission denied');
        },
        err_failed_op: function(op, node, rc, reason) {
            return __('%{op} failed on _NODE_} (rc=_RC_, reason=_REASON_)').replace('_OP_', op).replace('_NODE_', node).replace('_RC_', rc).replace('_REASON_', reason);
        }
    };


    var newClusterId = (function() {
        var id=0;
        return function() {
            if (arguments[0] === 0)
                id = 0;
            return "dashboard_cluster_" + id++;
        }
    })();

    function indicator(clusterId, state) {
        var tag = $('#' + clusterId + ' .panel-heading .panel-title #refresh');
        if (state == "ok") {
            tag.html('<i class="fa fa-check"></i>');
        } else if (state == "refresh") {
            tag.html('<i class="fa fa-refresh fa-spin"></i>');
        } else if (state == "error") {
            tag.html('<i class="fa fa-exclamation-triangle"></i>');
        }
    }

    function status_class_for(status) {
        if (status == "ok") {
            return "circle-success";
        } else if (status == "errors") {
            return "circle-danger";
        } else {
            return "circle-warning";
        }
    }

    function status_icon_for(status) {
        if (status == "ok") {
            return '<i class="fa fa-smile-o fa-2x text"></i>';
        } else if (status == "errors") {
            return '<i class="fa fa-frown-o fa-2x text"></i>';
        } else if (status == "maintenance") {
            return '<i class="fa fa-wrench fa-2x text"></i>';
        } else {
            return '<i class="fa fa-question fa-2x text"></i>';
        }
    }

    function plural(word, count) {
        if (count > 1) {
            return word + "s";
        } else {
            return word;
        }
    }

    function displayClusterStatus(clusterId, cib) {
        if (cib.meta.status == "ok") {
            indicator(clusterId, "ok");
        } else {
            indicator(clusterId, "error");
        }

        var tag = $('#' + clusterId + ' div.panel-body');

        if (cib.meta.status == "maintenance") {
            $('#' + clusterId).removeClass('panel-danger').addClass('panel-warning');
        } else if (cib.meta.status == "errors") {
            $('#' + clusterId).removeClass('panel-warning').addClass('panel-danger');
        } else {
            $('#' + clusterId).removeClass('panel-warning panel-danger');
        }

        var circle = '<div class="text-center"><div class="circle circle-large ' +
                 status_class_for(cib.meta.status) + '">' +
            status_icon_for(cib.meta.status) + '</div></div>';

        var text = "";

        if (cib.errors.length > 0) {
            text += '<div class="row">';
            text += '<div class="col-md-12">';
            cib.errors.forEach(function(err) {
                text += "<div class=\"alert alert-danger\">" + err.msg + "</div>";
            });
            text += '</div>';
            text += '</div>';
        }
        
        text += '<div class="row">';
        text += '<div class="col-md-2">';
        text += circle;
        text += '</div>';
        text += '<div class="col-md-10">';
        text += '<table class="table table-condensed">';

        $.each(cib.tickets, function(idx, obj) {
            $.each(obj, function(ticket, state) {
                text += '<tr><td>Ticket ' + ticket + ' is <tt>' + state + '</tt></tr>';
            });
        });

        $.each(cib.node_states, function(state, count) {
            if (count > 0)
                text += '<tr><td>' + count + ' ' + state + ' ' + plural('node', count) + '</td></tr>';
        });

        $.each(cib.resource_states, function(state, count) {
            if (count > 0)
                text += '<tr><td>' + count + ' ' + state + ' ' + plural('resource', count) + '</td></tr>';
        });

        $.each(cib.ticket_states, function(state, count) {
            if (count > 0)
                text += '<tr><td>' + count + ' ' + state + ' ' + plural('ticket', count) + '</td></tr>';
        });

        text += '</table>';
        text += '</div>';
        text += '</div>';

        tag.html(text);
    }

    function clusterConnectionError(clusterId, clusterInfo, xhr, status, error, cb) {
        var msg = "";
        if (xhr.readyState > 1) {
            if (xhr.status == 403) {
                msg = __('Permission denied.');
            } else {
                var json = json_from_request(xhr);
                if (json && json.errors) {
                    msg = json.errors.join(", ");
                } else if (xhr.status >= 10000) {
                    msg = GETTEXT.err_conn_failed();
                } else {
                    msg = GETTEXT.err_unexpected(xhr.status + " " + xhr.statusText);
                }
            }
        } else if (status == "error") {
            msg = __("Error connecting to server.");
        } else if (status == "timeout") {
            msg = __("Connection to server timed out.");
        } else if (status == "abort") {
            msg = __("Connection to server was aborted.");
        } else if (status == "parsererror") {
            msg = __("Server returned invalid data.");
        } else if (error) {
            msg = error;
        } else {
            msg = __("Unknown error connecting to server.");
        }

        indicator(clusterId, "error");
        $('#' + clusterId).removeClass('panel-warning').addClass('panel-danger');
        var tag = $('#' + clusterId + ' div.panel-body');

        var text = '<div class="alert alert-danger">';
        text += msg;
        text += "</div>";

        text += '<button type="button" class="btn btn-primary" aria-label="Cancel">' + __('Cancel') + '</button>';

        tag.html(text);

        var next = window.setTimeout(cb, 15000);

        tag.find('.btn-primary').click(function() {
            window.clearTimeout(next);
            tag.html(basicCreateBody(clusterId, clusterInfo));

            if (clusterInfo.host == null) {
                clusterRefresh(clusterId, clusterInfo);
            } else {
                tag.find(".btn-success").click(function() {
                    startRemoteConnect(clusterId, clusterInfo, tag);
                });
            }
        });

    }

    function json_from_request(request) {
        try {
            return $.parseJSON(request.responseText);
        } catch (e) {
            // This'll happen if the JSON is malformed somehow
            return null;
        }
    }

    function baseUrl(clusterInfo) {
        if (clusterInfo.host == null) {
            return "";
        } else {
            var transport = clusterInfo.https ? "https" : "http";
            return transport + "://" + clusterInfo.host + ":" + clusterInfo.port;
        }
    }

    function clusterRefresh(clusterId, clusterInfo) {
        indicator(clusterId, "refresh");

        $.ajax({ url: baseUrl(clusterInfo) + "/cib/mini.json",
                 dataType: 'json',
                 data: { _method: 'show' },
                 timeout: 90000,
                 cross_domain_hack: clusterInfo.host != null,
                 success: function(data) {
                     displayClusterStatus(clusterId, data);
                     window.setTimeout(function() { clusterRefresh(clusterId, clusterInfo); }, clusterInfo.interval*1000);
                 },
                 error: function(xhr, status, error) {
                     clusterConnectionError(clusterId, clusterInfo, xhr, status, error, function() {
                         clusterRefresh(clusterId, clusterInfo);
                     });
                 }
               });
    }

    function startRemoteConnect(clusterId, clusterInfo, bodytag) {
        indicator(clusterId, "refresh");

        var username = escape(bodytag.find("input[name=username]").val());
        var password = escape(bodytag.find("input[name=password]").val());

        $.ajax({ url: baseUrl(clusterInfo) + "/login.json",
                 timeout: 30000,
                 dataType: "json",
                 contentType: 'application/json',
                 data: JSON.stringify({"session": {"username": username, "password": password } }),
                 type: "POST",
                 cross_domain_hack: true,
                 success: function(data) {
                     clusterRefresh(clusterId, clusterInfo);
                 },
                 error: function(xhr, status, error) {
                     clusterConnectionError(clusterId, clusterInfo, xhr, status, error, function() {
                         startRemoteConnect(clusterId, clusterInfo, bodytag);
                     });
                 }
               });
    }

    function basicCreateBody(clusterId, data) {
        var s_hostname = __('Hostname');
        var s_username = __('Username');
        var s_password = __('Password');
        var s_connect = __('Connect');
        var v_username = $('body').data('user');
        var content = '';
        if (data.host != null) {
            content = '<form class="form-horizontal" role="form" onsubmit="return false;">' +
                '<div class="input-group dashboard-login">' +
                '<span class="input-group-addon"><i class="fa fa-server"></i></span>' +
                '<input type="text" class="form-control" name="host" id="host" readonly="readonly" value="' + data.host + '">' +
                '</div>' +
                '<div class="input-group dashboard-login">' +
                '<span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>' +
                '<input type="text" class="form-control" name="username" id="username" placeholder="' + s_username + '" value="' + v_username + '">' +
                '</div>' +
                '<div class="input-group dashboard-login">' +
                '<span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>' +
                '<input type="password" class="form-control" name="password" id="password" placeholder="' + s_password + '">' +
                '</div>' +
                '<div class="form-group">' +
                '<div class="col-sm-12 controls">' +
                '<button type="submit" class="btn btn-success">' +
                s_connect +
                '</button>' +
                '</div>' +
                '</div>' +
                '</form>';
        }
        return content;
    }

    return function(data) {
        var clusterId = newClusterId();
        var title = data.name || __("Local Status");

        var content = basicCreateBody(clusterId, data);

        var text = '<div class="col-md-6">' +
            '<div id="' +
            clusterId +
            '" class="panel panel-default">' +
            '<div class="panel-heading">' +
            '<h3 class="panel-title">' +
            '<span id="refresh"></span> ' +
            '<a href="' + baseUrl(data) + '/">' + title + '</a>';
        if (data.host != null) {
            var s_remove = __('Remove cluster _NAME_ from dashboard?').replace('_NAME_', data.name);
            text = text +
                '<form action="/dashboard/remove" method="post" accept-charset="UTF-8" data-remote="true" class="pull-right">' +
                '<input type="hidden" name="name" value="' + escape(data.name) + '">' +
                '<button type="submit" class="close" onclick="' +
                "return confirm('" + s_remove + "');" +
                '" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                '</form>';
        }
        text = text +
            '</h3>' +
            '</div>' +
            '<div class="panel-body">' +
            content +
            '</div>' +
            '</div>' +
            '</div>';
        $("#clusters").append(text);

        if (data.host == null) {
            clusterRefresh(clusterId, data);
        } else {
            var close = $("#" + clusterId).find(".panel-title form");
            close.on("ajax:success", function(e, data) {
                $("#" + clusterId).remove();
                $.growl({ message: __('Cluster removed successfully.')}, {type: 'success'});
            });
            close.on("ajax:error", function(e, xhr, status, error) {
                $.growl({ message: __('Failed to remove cluster.')}, {type: 'danger'});
            });
            var body = $("#" + clusterId).find(".panel-body");
            body.find(".btn-success").click(function() {
                startRemoteConnect(clusterId, data, body);
            });
        }
    };
})();

var dashboardSetupAddClusterForm = function() {
    $('form').find('span.toggleable').on('click', function (e) {
        if ($(this).hasClass('collapsed')) {
            $(this)
                .removeClass('collapsed')
                .parents('fieldset')
                .find('.content')
                .slideDown();

            $(this)
                .find('i')
                .removeClass('fa-chevron-down')
                .addClass('fa-chevron-up');
        } else {
            $(this)
                .addClass('collapsed')
                .parents('fieldset')
                .find('.content')
                .slideUp();

            $(this)
                .find('i')
                .removeClass('fa-chevron-up')
                .addClass('fa-chevron-down');
        }
    });
    $('form').on("ajax:success", function(e, data, status, xhr) {
        $('#modal').modal('hide');
        $('.modal-content').html('');
        dashboardAddCluster(data);
        $.growl({ message: __('Cluster added successfully.')}, {type: 'success'});
    }).on("ajax:error", function(e, xhr, status, error) {
        $(e.data).render_form_errors( $.parseJSON(xhr.responseText) );
    });

    (function($) {

        $.fn.render_form_errors = function(errors){

            this.clear_previous_errors();

            // show error messages in input form-group help-block
            var text = "";
            $.each(errors, function(field, messages) {
                text += "<div class=\"alert alert-danger\">";
                text += field + ': ' + messages.join(', ');
                text += "</div>";
            });

            $('form').find('.form-errors').html(text);

        };

        $.fn.clear_previous_errors = function(){
            $('form').find('.form-errors').html('');
        }
    }(jQuery));
};

/*
  (function($) {
  $.widget("ui.cluster", {
  options: {
  name: "",
  cluster: {}
  },
  _create: function() {
  var e = this.element;
  e.addClass("cluster ui-corner-all");
  e.append($(
  '<div style="float: right;"><button type="button" style="border: none; background: none; font-size: 0.7em; margin-right: -0.5em;">__('Remove')</button></div>' +
  '<h1 class="clickable"></h1>' +
  '<h2 class="geo-label" style="display: none;"><span class="clickable geo-ip"></span><span class="ui-icon ui-icon-info geo-info" style="float: right;"></span></h2>' +
  '<div class="spinner" style="text-align: center;"><img src="/assets/spinner-32x32.gif" alt="" /></div>' +
  '<div class="cluster-login" style="display: none;">' +
  '<form onsubmit="return false;">' +
  '<table>' +
  '<tr>' +
  '<td colspan="2"><div class="flash-warning login-warning ui-corner-all" style="width: auto;"></div></td>' +
  '</tr>' +
  '<tr>' +
  '<td>__('Username:')</td>' +
  '<td><%=raw escape_javascript text_field_tag 'username', params[:username], :class => 'loginfield', :id => nil %></td>' +
  '</tr>' +
  '<tr>' +
  '<td>__('Password:')</td>' +
  '<td><%=raw escape_javascript password_field_tag 'password', nil, :class => 'loginfield', :id => nil %></td>' +
  '</tr>' +
  '<tr>' +
  '<td colspan="2" style="text-align: right;"><%=raw escape_javascript submit_tag(_('Log In')) %></td>' +
  '</tr>' +
  '</table>' +
  '</form>' +
  '</div>' +
  '<div class="cluster-status clickable" style="display: none;">' +
  '<h2 class="mon-warning flash-warning ui-corner-all" style="display: none;"></h2>' +
  '<h2 class="cluster-error ui-state-error ui-corner-all" style="display: none;"><span style="float: left;" class="ui-icon ui-icon-alert"></span><%=h escape_javascript _("Cluster has errors - click for details") %></h2>' +
  '<div class="summary ticketsum">' +
  '<h2>' + GETTEXT.tickets() + '</h2>' +
  '<table cellpadding="0" cellspacing="0" style="white-space: nowrap;">' +
  '<tr class="ticketsum-granted rs-active"><td><span style="float: left;" class="ui-icon ui-icon-check"></span>' + GETTEXT.ticket_granted() + ':</td><td class="ar"></td></tr>' +
  '<tr class="ticketsum-revoked rs-inactive"><td><span style="float: left;" class="ui-icon ui-icon-cancel"></span>' + GETTEXT.ticket_revoked() + ':</td><td class="ar"></td></tr>' +
  '</table>' +
  '</div>' +
  '<div class="summary nodesum">' +
  '<h2 class="nodesum-label"></h2>' +
  '<table cellpadding="0" cellspacing="0">' +
  '<tr class="nodesum-pending ns-transient" style="display: none;"><td><span style="float: left;" class="ui-icon ui-icon-refresh"></span>' + GETTEXT.node_state_pending() + ':</td><td class="ar"></td></tr>' +
  '<tr class="nodesum-online ns-active" style="display: none;"><td><span style="float: left;" class="ui-icon ui-icon-play"></span>' + GETTEXT.node_state_online() + ':</td><td class="ar"></td></tr>' +
  '<tr class="nodesum-standby ns-inactive" style="display: none;"><td><span style="float: left;" class="ui-icon ui-icon-pause"></span>' + GETTEXT.node_state_standby() + ':</td><td class="ar"></td></tr>' +
  '<tr class="nodesum-offline ns-inactive" style="display: none;"><td><span style="float: left;" class="ui-icon ui-icon-stop"></span>' + GETTEXT.node_state_offline() + ':</td><td class="ar"></td></tr>' +
  '<tr class="nodesum-unclean ns-error" style="display: none;"><td><span style="float: left;" class="ui-icon ui-icon-notice"></span>' + GETTEXT.node_state_unclean() + ':</td><td class="ar"></td></tr>' +
  "</table>" +
  "</div>" +
  '<div class="summary ressum">' +
  '<h2 class="ressum-label"></span></h2>' +
  '<table cellpadding="0" cellspacing="0">' +
  '<tr class="ressum-pending rs-transient" style="display: none;"><td><span style="float: left;" class="ui-icon ui-icon-refresh"></span>' + GETTEXT.resource_state_pending() + ':</td><td class="ar"></td></tr>' +
  '<tr class="ressum-started rs-active" style="display: none;"><td><span style="float: left;" class="ui-icon ui-icon-play"></span>' + GETTEXT.resource_state_started() + ':</td><td class="ar"></td></tr>' +
  '<tr class="ressum-failed rs-error" style="display: none;"><td><span style="float: left;" class="ui-icon ui-icon-notice"></span>' + GETTEXT.resource_state_failed() + ':</td><td class="ar"></td></tr>' +
  '<tr class="ressum-master rs-master" style="display: none;"><td><span style="float: left;" class="ui-icon ui-icon-play"></span>' + GETTEXT.resource_state_master() + ':</td><td class="ar"></td></tr>' +
  '<tr class="ressum-slave rs-slave" style="display: none;"><td><span style="float: left;" class="ui-icon ui-icon-play"></span>' + GETTEXT.resource_state_slave() + ':</td><td class="ar"></td></tr>' +
  '<tr class="ressum-stopped rs-inactive" style="display: none;"><td><span style="float: left;" class="ui-icon ui-icon-stop"></span>' + GETTEXT.resource_state_stopped() + ':</td><td class="ar"></td></tr>' +
  "</table>" +
  "</div>" +
  "</div>"));
  },
  _init: function() {
  var self = this;
  var e = self.element;
  self.req = null;
  self.deleted = false;
  self.cur_epoch = "";
  e.find("h1").html(escape_html(self.options.name));
  e.find(".clickable").click(function() {
  window.open("https://" + self.options.cluster.mon_node + ":7630/",
  "_hawk_" +self.options.name.replace(/[^A-Za-z0-9_]/g, ""));
  return false;
  });
  e.find("button").button({
  text: false,
  icons: {
  primary: "ui-icon-close"
  }
  }).click(function() {
  // TODO(must): prompt for cluster removal
  var p = self.element.parent();
  self.element.remove();
  if (p.hasClass("geoset") && p.children().length == 0) {
  p.remove();
  }
  save_clusters();
  });
  e.find("input[type=submit]").click(function() {
  self._abort_req();
  self.req = $.ajax({ url: "https://" + self.options.cluster.mon_node + ":7630/session",
  timeout: 30000,
  data: "format=json" +
  "&username=" + escape(e.find("input[name=username]").val()) +
  "&password=" + escape(e.find("input[name=password]").val()),
  dataType: "json", // necessary?
  type: "POST",
  cross_domain_hack: true,
  success: function(data) {
  self.element.find(".cluster-login").hide();
  self.element.find(".spinner").show();
  self._update_cib();
  },
  error: function(request) {
  var err;
  if (request.readyState > 1) {
  var json = json_from_request(request);
  if (json && json.errors) {
  err = json.errors.join(", ");
  } else {
  if (request.status >= 10000) {
  err = GETTEXT.err_conn_failed();
  } else {
  err = GETTEXT.err_unexpected(request.status + " " + request.statusText);
  }
  }
  } else {
  err = "<%=h escape_javascript _("Timeout: Please try again") %>";
  }
  self.element.find(".login-warning").html(err);
  }
  });
  });
  self._redraw();
  self._update_cib();
  },
  _abort_req: function() {
  if (this.req && this.req.abort) { this.req.abort(); }
  },
  _do_update: function() {
  var self = this;
  self._abort_req();
  self.req = $.ajax({ url: "https://" + self.options.cluster.mon_node + ":7630/monitor?" + self.cur_epoch,
  timeout: 90000,
  dataType: "json",   // necessary?
  type: "GET",
  cache: false,
  cross_domain_hack: true,    // needed to get proper headers
  success: function(data) {
  if (self.deleted) return;
  // Note: success fires on broken request (e.g.: SSL cert or CORS problem)
  if (data) {
  self.element.find(".mon-warning").hide();
  if (data.cur_epoch != self.cur_epoch) {
  self._update_cib();
  } else {
  self._do_update(data.cur_epoch);
  }
  } else {
  self._cycle_mon_node();
  }
  },
  error: function(request) {
  if (self.deleted) return;
  self._cycle_mon_node();
  }
  });
  },
  _update_cib: function() {
  var self = this;
  self._abort_req();
  self.req = $.ajax({ url: "https://" + self.options.cluster.mon_node + ":7630/cib/live",
  timeout: 90000,
  data: "format=json&mini=true",
  dataType: "json",   // necessary?
  type: "GET",
  cross_domain_hack: true,    // needed to get proper headers
  success: function(data) {
  if (self.deleted) return;
  // Note: success fires on broken request (e.g.: SSL cert or CORS problem)
  self.cur_epoch = "";
  if (data) {
  self.element.find(".mon-warning").hide();
  self.element.find(".spinner").hide();
  self.element.find(".cluster-status").show();
  var mn = self.options.cluster.mon_node;               // Keep this or it'll be clobbered later
  // !! might not have cib.meta
  self.options.cluster = data;
  if ($.inArray(mn, self.options.cluster.node_list) >= 0) {
  self.options.cluster.mon_node = mn;
  } else {
  // If mon_node isn't actually a cluster node (e.g.: we originally
  // connected via floating IP), use a real node as mon_node.
  self.options.cluster.mon_node = self.options.cluster.node_list[0];
  }
  // Arguably should only bother saving if node list has changed
  save_clusters();
  self._redraw();
  self.cur_epoch = data.meta.epoch;
  self._do_update();
  } else {
  self._cycle_mon_node();
  }
  },
  error: function(request) {
  if (self.deleted) return;
  var err;
  if (request.readyState > 1) {
  if (request.status == 403) {
  self.element.find(".cluster-status").hide();
  self.element.find(".spinner").hide();
  self.element.find(".cluster-login").show();
  self.element.find(".login-warning").html("<%=h escape_javascript _('Permission denied. Please log in to %{node}') % { :node => '_NODE_' } %>".replace('_NODE_', self.options.cluster.mon_node));
  return;
  } else {
  var json = json_from_request(request);
  if (json && json.errors) {
  err = json.errors.join(", ");
  } else {
  if (request.status >= 10000) {
  err = GETTEXT.err_conn_failed();
  } else {
  err = GETTEXT.err_unexpected(request.status + " " + request.statusText);
  }
  }
  }
  }
  self._cycle_mon_node(err);
  }
  });
  },
  _redraw: function() {
  var self = this;
  var e = self.element;
  if (self.options.cluster.errors && self.options.cluster.errors.length > 0) {
  e.find(".cluster-error").show();
  } else {
  e.find(".cluster-error").hide();
  }
  if (!self.options.cluster.nodes_label || !self.options.cluster.node_states ||
  !self.options.cluster.resources_label || !self.options.cluster.resource_states ||
  !self.options.cluster.ticket_states) {
  // If we have no CIB yet, we'll still show the cluster name
  e.find(".geo-label").hide();
  e.find(".ticketsum").hide();
  e.find(".nodesum").hide();
  e.find(".ressum").hide();
  return;
  }
  if (self.options.cluster.booth) {
  if (self.options.cluster.booth.me) {
  e.find(".geo-ip").html("<%=h escape_javascript _("Geo Site %{ip}") % { :ip => '_IP_' } %>".replace('_IP_', self.options.cluster.booth.me));
  var info = [];
  $.each(self.options.cluster.booth.sites, function() {
  info.push("<%=h escape_javascript _("Site: %{ip}") % { :ip => '_IP_' } %>".replace('_IP_', this.toString()));
  });
  $.each(self.options.cluster.booth.arbitrators, function() {
  info.push("<%=h escape_javascript _("Arbitrator: %{ip}") % { :ip => '_IP_' } %>".replace('_IP_', this.toString()));
  });
  if (info.length) {
  e.find(".geo-info").attr("title", info.join("\n")).show();
  } else {
  e.find(".geo-info").hide();
  }
  e.find(".geo-label").show();
  }
  if (self.options.cluster.booth.sites && self.options.cluster.booth.me && !e.parent().hasClass("geoset")) {
  var p = null;
  $(".geoset").each(function() {
  if (array_match($(this).data("sites"), self.options.cluster.booth.sites)) {
  p = $(this);
  return false;
  }
  });
  if (!p) {
  p = $('<div class="geoset ui-corner-all"/>');
  p.data("sites", self.options.cluster.booth.sites);
  $("#clusters").append(p);
  }
  e.appendTo(p);
  };
  } else {
  e.find(".geo-label").hide();
  }
  var nsl = e.find(".nodesum-label");
  nsl.html(escape_html(self.options.cluster.nodes_label));
  nsl.attr("title", self.options.cluster.node_list.join(", "));
  self._redraw_counters(self.options.cluster.node_states, ".nodesum-");
  e.find(".nodesum").show();
  e.find(".ressum-label").html(escape_html(self.options.cluster.resources_label));
  self._redraw_counters(self.options.cluster.resource_states, ".ressum-");
  e.find(".ressum").show();
  self._redraw_counters(self.options.cluster.ticket_states, ".ticketsum-");
  if (self.options.cluster.ticket_states.granted > 0 || self.options.cluster.ticket_states.revoked > 0) {
  e.find(".ticketsum").show();
  } else {
  e.find(".ticketsum").hide();
  }
  },
  _redraw_counters: function(hash, prefix) {
  var e = this.element;
  $.each(hash, function(k, v) {
  var r = e.find(prefix + k);
  r.children(":last").text(v);
  if (parseInt(v)) {
  r.show();
  } else {
  r.hide();
  }
  });
  },
  _cycle_mon_node: function(err) {
  var self = this;
  var w = self.element.find(".mon-warning");
  w.html(err ? err : "<%=h escape_javascript _("Can't contact Hawk on %{node}. Retrying every 5 seconds.") % { :node => '_NODE_' } %>".replace('_NODE_', self.options.cluster.mon_node));
  w.show();
  var nl = self.options.cluster.node_list;
  if (nl && nl.length) {
  var dot = self.options.cluster.mon_node.indexOf(".");
  var nn = self.options.cluster.node_list[0];
  if (dot >=0 && nn.indexOf(".") == -1) {
  nn += self.options.cluster.mon_node.substr(dot);    // FQDN, if present
  }
  for (var i = nl.length - 1; i >= 0; i--) {
  var nf = nl[i];
  if (dot >=0 && nf.indexOf(".") == -1) {
  nf += self.options.cluster.mon_node.substr(dot);  // FQDN, if present
  }
  if (nf == self.options.cluster.mon_node) {
  self.options.cluster.mon_node = nn;
  break;
  } else {
  nn = nf;
  }
  }
  }
  setTimeout(function() { self._update_cib(); }, 5000);
  },
  destroy: function() {
  this.deleted = true;
  this._abort_req();
  $.Widget.prototype.destroy.apply(this, arguments);
  }
  });
  })(jQuery);

  var adding_cluster = false;

  // TODO(should): Stick this somewhere generic
  function array_match(a, b) {
  return ($(a).not(b).length == 0 && $(b).not(a).length == 0);
  }

  function cluster_exists(n) {
  var exists = false;
  $(".cluster").each(function() {
  if ($(this).data("cluster").options.name == n) {
  exists = true;
  return false;
  }
  });
  return exists;
  }

  function host_present(h) {
  var present = false;
  $(".cluster").each(function() {
  if ($.inArray(h, $(this).data("cluster").options.cluster.node_list) >= 0) {
  present = $(this).data("cluster").options.name;
  return false;
  }
  });
  return present;
  }

  function save_clusters() {
  // Only want to save minimal info; name, node_list and mon_node
  var s = {};
  $(".cluster").each(function() {
  var o = $(this).data("cluster").options;
  s[o.name] = { node_list: o.cluster.node_list, mon_node: o.cluster.mon_node };
  });
  $.cookie("hawk-dashboard", JSON.stringify(s), { expires: 3650 });
  }

  function new_cluster(n, c) {
  $("#clusters").append($("<div/>").cluster({name: n, cluster: c}));
  save_clusters();
  }

  function add_cluster() {
  var html = '<form onsubmit="return false;"><table>' +
  '<tr><th><%=h escape_javascript _('Cluster Name:') %></th><td><input type="text" id="new-cluster-name" /></td></tr>' +
  '<tr><th><%=h escape_javascript _('Host Name:') %></th><td><input type="text" id="new-cluster-host" /></td></tr>' +
  '<tr><td colspan="2" style="font-size: 80%"><%=h escape_javascript _("(Specify any host name in the cluster.  Other nodes will be found automatically)") %></td></tr>' +
  '</table><form>';

  $("#dialog").html(html);
  $("#dialog").dialog("option", {
  title:    "<%=h escape_javascript _('Add Cluster') %>",
  buttons:  {
  "<%=h escape_javascript _('OK') %>": function() {
  var self = this;

  // Flag prevents double-hit ENTER key from triggering duplicate add
  if (adding_cluster) return;

  var cn = $.trim($("#new-cluster-name").val());
  var hn = $.trim($("#new-cluster-host").val());
  // TODO(must): hostname must be valid (no weird/specical characters)
  if (!cn || !hn) {
  // TODO(should): Error message
  return;
  }

  if (cluster_exists(cn)) {
  alert("<%=h escape_javascript _('A cluster with that name already exists') %>");
  return;
  }

  var existing = host_present(hn);
  if (existing) {
  alert("<%=h escape_javascript _('The host %{h} is already present in cluster %{c}') % { :h => '_HOST_', :c => '_CLUSTER_' } %>".replace('_HOST_', hn).replace('_CLUSTER_', existing));
  return;
  }

  // now ajax to the host specified and:
  // - no connection - host not found error / can't connect
  // - if permission denied, request login
  // - if ok, add cluster
  // what about https cert verification?

  // internet explorer is an evil pain

  // Disable buttons for request duration
  $(self).dialog().parent().find(".ui-dialog-buttonpane button").attr("disabled", "disabled");
  adding_cluster = true;

  var req = $.ajax({ url: "https://" + hn + ":7630/session/new",
  timeout: 20000,
  data: "format=json",
  dataType: "json",   // necessary?
  type: "GET",
  cross_domain_hack: true,    // needed to get proper headers
  success: function(data, status, xhr) {
  if (xhr && xhr.status == 200) {
  new_cluster(cn, { node_list: [ hn ], mon_node: hn });
  $(self).dialog("close");
  } else {
  // apparently I can't differentiate a broken/illegal CORS
  // request from other types of failure.  FFS.
  alert("<%=h escape_javascript _('Unable to connect to %{host}. Try opening %{url} in your web browser to ensure Hawk is accessible.') % { :host => '_HOST_', :url => '_URL_' } %>".replace('_HOST_', hn).replace('_URL_', "https://" + hn + ":7630/"));
  }
  adding_cluster = false;
  $(self).dialog().parent().find(".ui-dialog-buttonpane button").removeAttr("disabled");
  },
  error: function(request) {
  if (request.readyState > 1) {
  var json = json_from_request(request);
  if (json && json.errors) {
  alert(json.errors.join(", "));
  } else {
  if (request.status >= 10000) {
  alert("<%=h escape_javascript _('Unable to connect to %{host}. Try opening %{url} in your web browser to ensure Hawk is accessible.') % { :host => '_HOST_', :url => '_URL_' } %>".replace('_HOST_', hn).replace('_URL_', "https://" + hn + ":7630/"));
  } else {
  alert(GETTEXT.err_unexpected(request.status + " " + request.statusText));
  }
  }
  } else {
  alert("<%=h escape_javascript _("Timeout: Please try again") %>");
  }
  adding_cluster = false;
  $(self).dialog().parent().find(".ui-dialog-buttonpane button").removeAttr("disabled");
  }
  });
  },
  "<%=h escape_javascript _('Cancel') %>": function() {
  $(this).dialog("close");
  }
  },
  open: function() {
  var self = this;
  $(self).find("form").keypress(function(e) {
  if (e.keyCode == 13) {
  // Allow enter to submit dialog
  $(self).parent().find('.ui-dialog-buttonpane button:first').click();
  return false;
  }
  });
  }
  });
  $("#dialog").dialog("open");
  }

  $(function() {
  if ($.cookie("hawk-dashboard")) {
  $.each(JSON.parse($.cookie("hawk-dashboard")), function(n) {
  new_cluster(n, this);
  });
  }
  if ($(".cluster").length == 0) {
  add_cluster();
  }
  });
*/
