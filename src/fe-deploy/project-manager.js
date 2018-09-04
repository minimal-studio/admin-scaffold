/**
 * 项目管理
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'ukelli-ui';

import CreateAsset from './create-asset';
import AssetManager from './assets-manager';
import EditProject from './edit-project';
import AuditLog from './audit-log';

class ProjectManager extends Component {
  static propTypes = {
    getProject: PropTypes.func.isRequired,
    queryProject: PropTypes.func.isRequired,
  }
  onCreatedAsset() {
    this.tabRef._onChangeTab(0);
  }
  onUpdateProject() {
    this.props.queryProject();
  }
  render() {
    const targetProject = this.props.getProject();
    return (
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
    );
  }
}

export default ProjectManager;
