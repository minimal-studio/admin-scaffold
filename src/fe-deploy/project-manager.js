/**
 * 项目管理
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, TipPanel } from 'ukelli-ui';
import { Call } from 'basic-helper';

import CreateAsset from './create-asset';
import AssetManager from './assets-manager';
import EditProject from './edit-project';
import AuditLog from './audit-log';

import { applyToJoinInProject } from './apis';

class ProjectManager extends Component {
  static propTypes = {
    getProject: PropTypes.func.isRequired,
    queryProject: PropTypes.func.isRequired,
    defaultTab: PropTypes.string,
  }
  static defaultProps = {
    defaultTab: '0'
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
    let collaboratorConfig = collaborators[username] || {};

    this.isFounder = username === founder;
    this.updatable = this.isFounder || collaboratorConfig.updatable;
    this.deletable = this.isFounder || collaboratorConfig.deletable;
    this.releasable = this.isFounder || collaboratorConfig.releasable;
    this.canOperate = this.isFounder || collaborators.hasOwnProperty(username);
  }
  async applyToJoin(projId) {
    const { username, notify, onApplied } = this.props;
    let applyRes = await applyToJoinInProject({projId, username});
    let isSuccess = !applyRes.err;
    if(isSuccess) {
      Call(onApplied);
    }
    notify('申请', isSuccess, applyRes.err);
  }
  render() {
    const targetProject = this.props.getProject() || {};
    const { defaultTab } = this.props;
    const projId = targetProject.id;
    const _defaultTab = {
      'edit': 2,
      'asset-list': 0,
      'upload': 1,
    };

    const container = this.canOperate ? (
      <div className="project-manager p10">
        <Tabs ref={e => this.tabRef = e} defaultTab={_defaultTab[defaultTab]}>
          <Tab label="资源列表">
            <AssetManager releasable={this.releasable} {...this.props} projId={projId}/>
          </Tab>
          <Tab label="上传新资源">
            <CreateAsset {...this.props} project={targetProject} projId={projId} onSuccess={e => this.onCreatedAsset()}/>
          </Tab>
          {
            this.updatable ? (
              <Tab label="项目编辑">
                <EditProject {...this.props} project={targetProject} onUpdated={e => this.onUpdateProject()}/>
              </Tab>
            ) : null
          }
          {
            this.isFounder ? (
              <Tab label="操作记录">
                <AuditLog {...this.props} projId={projId}/>
              </Tab>
            ) : null
          }
        </Tabs>
      </div>
    ) : (
      <div>
        <TipPanel title="你暂时还不是该项目的协作者，可以通过申请进行项目协作"/>
        <div className="text-center">
          <span className="btn flat theme" onClick={e => this.applyToJoin(projId)}>申请加入协作</span>
        </div>
      </div>
    );

    return container;
  }
}

export default ProjectManager;
