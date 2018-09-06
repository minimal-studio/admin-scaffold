/**
 * 项目管理
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, TipPanel } from 'ukelli-ui';

import CreateAsset from './create-asset';
import AssetManager from './assets-manager';
import EditProject from './edit-project';
import AuditLog from './audit-log';

import { applyToJoinInProject } from './apis';

class ProjectManager extends Component {
  static propTypes = {
    getProject: PropTypes.func.isRequired,
    queryProject: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);

    this.authFilter();
  }
  onCreatedAsset() {
    this.tabRef._onChangeTab(0);
  }
  onUpdateProject() {
    this.props.queryProject();
  }
  authFilter() {
    const { username } = this.props;
    const { collaborators, founder } = this.props.getProject();
    this.canOperate = username == founder || collaborators.hasOwnProperty(username);
  }
  async applyToJoin(projId) {
    const { username } = this.props;
    let applyRes = await applyToJoinInProject({projId, username});
    console.log(applyRes)
  }
  render() {
    const targetProject = this.props.getProject();

    const container = this.canOperate ? (
      <div className="project-manager p10">
        <Tabs ref={e => this.tabRef = e}>
          <Tab label="资源列表">
            <AssetManager {...this.props} projId={targetProject.id}/>
          </Tab>
          <Tab label="上传新资源">
            <CreateAsset {...this.props} project={targetProject} projId={targetProject.id} onSuccess={e => this.onCreatedAsset()}/>
          </Tab>
          <Tab label="项目编辑">
            <EditProject {...this.props} project={targetProject} onUpdated={e => this.onUpdateProject()}/>
          </Tab>
          <Tab label="操作记录">
            <AuditLog {...this.props} projId={targetProject.id}/>
          </Tab>
        </Tabs>
      </div>
    ) : (
      <div>
        <TipPanel title="你暂时还不是该项目的协作者，可以通过申请进行项目协作"/>
        <div className="text-center">
          <span className="btn flat theme" onClick={e => this.applyToJoin(targetProject.id)}>申请加入协作</span>
        </div>
      </div>
    );

    return container;
  }
}

export default ProjectManager;
