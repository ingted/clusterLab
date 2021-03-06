# Copyright (C) 2014 Kristoffer Gronlund <kgronlund@suse.com>
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


import cibconfig
from lxml import etree
from nose.tools import eq_
import xmlutil

factory = cibconfig.cib_factory


def setup_func():
    "set up test fixtures"
    import idmgmt
    idmgmt.clear()


def test_bug41660_1():
    xml = """<primitive id="bug41660" class="ocf" provider="pacemaker" type="Dummy"> \
    <meta_attributes id="bug41660-meta"> \
    <nvpair id="bug41660-meta-target-role" name="target-role" value="Stopped"/> \
    </meta_attributes> \
    </primitive>
"""
    data = etree.fromstring(xml)
    obj = factory.create_from_node(data)
    print etree.tostring(obj.node)
    data = obj.repr_cli(format=-1)
    print data
    exp = 'primitive bug41660 ocf:pacemaker:Dummy meta target-role=Stopped'
    assert data == exp
    assert obj.cli_use_validate()

    commit_holder = factory.commit
    try:
        factory.commit = lambda *args: True
        from ui_resource import set_deep_meta_attr
        set_deep_meta_attr("bug41660", "target-role", "Started")
        eq_(['Started'],
            obj.node.xpath('.//nvpair[@name="target-role"]/@value'))
    finally:
        factory.commit = commit_holder


def test_bug41660_2():
    xml = """
<clone id="libvirtd-clone">
 <primitive class="lsb" id="libvirtd" type="libvirtd">
  <operations>
   <op id="libvirtd-monitor-interval-15" interval="15" name="monitor" start-delay="15" timeout="15"/>
   <op id="libvirtd-start-interval-0" interval="0" name="start" on-fail="restart" timeout="15"/>
   <op id="libvirtd-stop-interval-0" interval="0" name="stop" on-fail="ignore" timeout="15"/>
  </operations>
  <meta_attributes id="libvirtd-meta_attributes"/>
 </primitive>
 <meta_attributes id="libvirtd-clone-meta">
  <nvpair id="libvirtd-interleave" name="interleave" value="true"/>
  <nvpair id="libvirtd-ordered" name="ordered" value="true"/>
  <nvpair id="libvirtd-clone-meta-target-role" name="target-role" value="Stopped"/>
 </meta_attributes>
</clone>
"""
    data = etree.fromstring(xml)
    obj = factory.create_from_node(data)
    assert obj is not None
    #data = obj.repr_cli(format=-1)
    #print data
    #exp = 'clone libvirtd-clone libvirtd meta interleave=true ordered=true target-role=Stopped'
    #assert data == exp
    #assert obj.cli_use_validate()

    print etree.tostring(obj.node)

    commit_holder = factory.commit
    try:
        factory.commit = lambda *args: True
        from ui_resource import set_deep_meta_attr
        print "PRE", etree.tostring(obj.node)
        set_deep_meta_attr("libvirtd-clone", "target-role", "Started")
        print "POST", etree.tostring(obj.node)
        eq_(['Started'],
            obj.node.xpath('.//nvpair[@name="target-role"]/@value'))
    finally:
        factory.commit = commit_holder


def test_bug41660_3():
    xml = """
<clone id="libvirtd-clone">
 <primitive class="lsb" id="libvirtd" type="libvirtd">
  <operations>
   <op id="libvirtd-monitor-interval-15" interval="15" name="monitor" start-delay="15" timeout="15"/>
   <op id="libvirtd-start-interval-0" interval="0" name="start" on-fail="restart" timeout="15"/>
   <op id="libvirtd-stop-interval-0" interval="0" name="stop" on-fail="ignore" timeout="15"/>
  </operations>
  <meta_attributes id="libvirtd-meta_attributes"/>
 </primitive>
 <meta_attributes id="libvirtd-clone-meta_attributes">
 <nvpair id="libvirtd-clone-meta_attributes-target-role" name="target-role" value="Stopped"/>
 </meta_attributes>
</clone>
"""
    data = etree.fromstring(xml)
    obj = factory.create_from_node(data)
    assert obj is not None
    data = obj.repr_cli(format=-1)
    print data
    exp = 'clone libvirtd-clone libvirtd meta target-role=Stopped'
    assert data == exp
    assert obj.cli_use_validate()

    commit_holder = factory.commit
    try:
        factory.commit = lambda *args: True
        from ui_resource import set_deep_meta_attr
        set_deep_meta_attr("libvirtd-clone", "target-role", "Started")
        eq_(['Started'],
            obj.node.xpath('.//nvpair[@name="target-role"]/@value'))
    finally:
        factory.commit = commit_holder


def test_comments():
    xml = """<cib epoch="25" num_updates="1" admin_epoch="0" validate-with="pacemaker-1.2" cib-last-written="Thu Mar  6 15:53:49 2014" update-origin="beta1" update-client="cibadmin" update-user="root" crm_feature_set="3.0.8" have-quorum="1" dc-uuid="1">
  <configuration>
    <crm_config>
      <cluster_property_set id="cib-bootstrap-options">
        <nvpair id="cib-bootstrap-options-dc-version" name="dc-version" value="1.1.11-3.3-3ca8c3b"/>
        <nvpair id="cib-bootstrap-options-cluster-infrastructure" name="cluster-infrastructure" value="corosync"/>
        <!--# COMMENT TEXT 1 -->
      </cluster_property_set>
    </crm_config>
    <nodes>
      <node uname="beta1" id="1">
        <!--# COMMENT TEXT 2 -->
      </node>
    </nodes>
    <resources/>
    <constraints/>
    <rsc_defaults>
      <meta_attributes id="rsc-options">
        <nvpair name="resource-stickiness" value="1" id="rsc-options-resource-stickiness"/>
        <!--# COMMENT TEXT 3 -->
      </meta_attributes>
    </rsc_defaults>
  </configuration>
  <status>
    <node_state id="1" uname="beta1" in_ccm="true" crmd="online" crm-debug-origin="do_state_transition" join="member" expected="member">
      <lrm id="1">
        <lrm_resources/>
      </lrm>
      <transient_attributes id="1">
        <instance_attributes id="status-1">
          <nvpair id="status-1-shutdown" name="shutdown" value="0"/>
          <nvpair id="status-1-probe_complete" name="probe_complete" value="true"/>
        </instance_attributes>
      </transient_attributes>
    </node_state>
  </status>
</cib>"""
    elems = etree.fromstring(xml)
    xmlutil.sanitize_cib(elems)
    assert etree.tostring(elems).count("COMMENT TEXT") == 3


def test_eq1():
    xml1 = """<cluster_property_set id="cib-bootstrap-options">
    <nvpair id="cib-bootstrap-options-stonith-enabled" name="stonith-enabled" value="true"></nvpair>
    <nvpair id="cib-bootstrap-options-stonith-timeout" name="stonith-timeout" value="180"></nvpair>
    <nvpair id="cib-bootstrap-options-symmetric-cluster" name="symmetric-cluster" value="false"></nvpair>
    <nvpair id="cib-bootstrap-options-no-quorum-policy" name="no-quorum-policy" value="freeze"></nvpair>
    <nvpair id="cib-bootstrap-options-batch-limit" name="batch-limit" value="20"></nvpair>
    <nvpair id="cib-bootstrap-options-dc-version" name="dc-version" value="1.1.10-c1a326d"></nvpair>
    <nvpair id="cib-bootstrap-options-cluster-infrastructure" name="cluster-infrastructure" value="corosync"></nvpair>
    <nvpair id="cib-bootstrap-options-last-lrm-refresh" name="last-lrm-refresh" value="1391433789"></nvpair>
    <nvpair id="cib-bootstrap-options-is-managed-default" name="is-managed-default" value="true"></nvpair>
  </cluster_property_set>
  """
    xml2 = """<cluster_property_set id="cib-bootstrap-options">
    <nvpair id="cib-bootstrap-options-stonith-enabled" name="stonith-enabled" value="true"></nvpair>
    <nvpair id="cib-bootstrap-options-stonith-timeout" name="stonith-timeout" value="180"></nvpair>
    <nvpair id="cib-bootstrap-options-symmetric-cluster" name="symmetric-cluster" value="false"></nvpair>
    <nvpair id="cib-bootstrap-options-no-quorum-policy" name="no-quorum-policy" value="freeze"></nvpair>
    <nvpair id="cib-bootstrap-options-batch-limit" name="batch-limit" value="20"></nvpair>
    <nvpair id="cib-bootstrap-options-dc-version" name="dc-version" value="1.1.10-c1a326d"></nvpair>
    <nvpair id="cib-bootstrap-options-cluster-infrastructure" name="cluster-infrastructure" value="corosync"></nvpair>
    <nvpair id="cib-bootstrap-options-last-lrm-refresh" name="last-lrm-refresh" value="1391433789"></nvpair>
    <nvpair id="cib-bootstrap-options-is-managed-default" name="is-managed-default" value="true"></nvpair>
  </cluster_property_set>
    """
    e1 = etree.fromstring(xml1)
    e2 = etree.fromstring(xml2)
    assert xmlutil.xml_equals(e1, e2, show=True)


def test_pcs_interop_1():
    """
    pcs<>crmsh interop bug
    """

    xml = """<clone id="dummies">
        <meta_attributes id="dummies-meta">
          <nvpair name="globally-unique" value="false" id="dummies-meta-globally-unique"/>
        </meta_attributes>
        <meta_attributes id="dummies-meta_attributes">
          <nvpair id="dummies-meta_attributes-target-role" name="target-role" value="Stopped"/>
        </meta_attributes>
        <primitive id="dummy-1" class="ocf" provider="heartbeat" type="Dummy"/>
      </clone>"""
    elem = etree.fromstring(xml)
    from ui_resource import set_deep_meta_attr_node

    assert len(elem.xpath(".//meta_attributes/nvpair[@name='target-role']")) == 1

    print "BEFORE:", etree.tostring(elem)

    set_deep_meta_attr_node(elem, 'target-role', 'Stopped')

    print "AFTER:", etree.tostring(elem)

    assert len(elem.xpath(".//meta_attributes/nvpair[@name='target-role']")) == 1


def test_bnc878128():
    """
    L3: "crm configure show" displays XML information instead of typical crm output.
    """
    xml = """<rsc_location id="cli-prefer-dummy-resource" rsc="dummy-resource"
role="Started">
  <rule id="cli-prefer-rule-dummy-resource" score="INFINITY">
    <expression id="cli-prefer-expr-dummy-resource" attribute="#uname"
operation="eq" value="x64-4"/>
    <date_expression id="cli-prefer-lifetime-end-dummy-resource" operation="lt"
end="2014-05-17 17:56:11Z"/>
  </rule>
</rsc_location>"""
    data = etree.fromstring(xml)
    obj = factory.create_from_node(data)
    assert obj is not None
    data = obj.repr_cli(format=-1)
    print "OUTPUT:", data
    exp = 'location cli-prefer-dummy-resource dummy-resource role=Started rule #uname eq x64-4 and date lt "2014-05-17 17:56:11Z"'
    assert data == exp
    assert obj.cli_use_validate()


def test_bnc878112():
    """
    crm configure group can hijack a cloned primitive (and then crash)
    """
    obj1 = factory.create_object('primitive', 'p1', 'Dummy')
    assert obj1 is not None
    obj2 = factory.create_object('group', 'g1', 'p1')
    assert obj2 is not None
    obj3 = factory.create_object('group', 'g2', 'p1')
    print obj3
    assert obj3 is False


def test_copy_nvpairs():
    from cibconfig import copy_nvpairs

    to = etree.fromstring('''
    <node>
    <nvpair name="stonith-enabled" value="true"/>
    </node>
    ''')
    copy_nvpairs(to, etree.fromstring('''
    <node>
    <nvpair name="stonith-enabled" value="false"/>
    </node>
    '''))

    eq_(['stonith-enabled'], to.xpath('./nvpair/@name'))
    eq_(['false'], to.xpath('./nvpair/@value'))

    copy_nvpairs(to, etree.fromstring('''
    <node>
    <nvpair name="stonith-enabled" value="true"/>
    </node>
    '''))

    eq_(['stonith-enabled'], to.xpath('./nvpair/@name'))
    eq_(['true'], to.xpath('./nvpair/@value'))

