/**
 * 组件名   前端资源管理发布
 * 作者     @Alex
 * 开始日期  2018-08-03
 * 修改日期  2018-08-03
 */

import React from 'react';
import ProjectList from './project-list';
import { setFEDeployConfig, setApiUrl, setDefaultUser } from './apis';

const FEDEPLOY = ({username}) => (
  <div className="card-content" style={{minHeight: 400}}>
    <ProjectList username={username}/>
  </div>
);

export default FEDEPLOY;

export {
  setFEDeployConfig, setApiUrl, setDefaultUser
};