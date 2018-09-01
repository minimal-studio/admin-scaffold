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

const versionFilter = (version) => {
  return `v${(version + '').split('').join('.')}`;
}

class ProjectManager extends Component {
  static propTypes = {
    targetProject: PropTypes.object.isRequired
  }
  onCreatedAsset() {
    this.tabRef._onChangeTab(0);
  }
  onUpdateProject() {

  }
  render() {
    const {targetProject} = this.props;
    return (
      <div className="project-manager p10">
        <Tabs ref={e => this.tabRef = e}>
          <Tab label="资源列表">
            <AssetManager {...this.props} projId={targetProject.id}/>
          </Tab>
          <Tab label="上传新资源">
            <CreateAsset {...this.props} projId={targetProject.id} onSuccess={e => this.onCreatedAsset()}/>
          </Tab>
          <Tab label="项目编辑">
            <EditProject {...this.props} project={targetProject} onUpdate={e => this.onUpdateProject()}/>
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
