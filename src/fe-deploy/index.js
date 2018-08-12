/**
 * 组件名   前端资源管理发布
 * 作者     @Jeremy
 * 开始日期  2017-10-06
 * 修改日期  2017-??-??
 * 预定完成日期  2017-10-10
 */

import React, { Component, PropTypes } from 'react';
import Records from './records';

export default class FEDEPLOY extends Component {
  render() {
    return (
      <div className="card-content">
        <Records />
      </div>
    );
  }
}
