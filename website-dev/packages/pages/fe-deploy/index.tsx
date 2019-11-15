/**
 * 组件名   前端资源管理发布
 * 作者     @Alex
 * 开始日期  2018-08-03
 * 修改日期  2018-08-03
 */

import React from 'react';
import PropTypes from 'prop-types';

import ProjectList from './project-list';
import DeployManager from './deploy-config-manager';
import { setFEDeployConfig, setApiUrl, setDefaultUser } from './apis';

const FEDEPLOY = ({ username, onNavigate }) => (
  <div className="card-content" style={{ minHeight: 400 }}>
    <ProjectList username={username} onNavigate={onNavigate} />
  </div>
);

FEDEPLOY.propTypes = {
  username: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default FEDEPLOY;

export {
  setFEDeployConfig, setApiUrl, setDefaultUser, DeployManager
};
