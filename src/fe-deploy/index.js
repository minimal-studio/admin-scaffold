/**
 * 组件名   前端资源管理发布
 * 作者     @Jeremy
 * 开始日期  2017-10-06
 * 修改日期  2017-??-??
 * 预定完成日期  2017-10-10
 */

import React, { Component, PropTypes } from 'react';
import ProjectList from './project-list';
import {setApiUrl} from './apis';

const FEDEPLOY = (props) => (
  <div className="card-content">
    <ProjectList {...props}/>
  </div>
)

export default FEDEPLOY;
export {
  setApiUrl
}