/**
 * 组件名   前端资源管理发布
 * 作者     @Jeremy
 * 开始日期  2017-10-06
 * 修改日期  2017-??-??
 * 预定完成日期  2017-10-10
 */

import React from 'react';
import ProjectList from './project-list';
import { setFEDeployConfig, setApiUrl, setDefaultUser } from './apis';

const FEDEPLOY = ({userInfo}) => (
  <div className="card-content" style={{minHeight: 400}}>
    <ProjectList username={userInfo.username}/>
  </div>
)

export default FEDEPLOY;
export {
  setFEDeployConfig, setApiUrl, setDefaultUser
}