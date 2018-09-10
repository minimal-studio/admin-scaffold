/**
 * 基础的报表 Helper Action 组件, 包含所有 condition 的 mapper ,
 * 具体用法参考其他报表
 * @Alex
 */

import React, {Component, PureComponent} from 'react';
import ActionBasic from './action-basic.js';

import {getConditionOptionsMapper, getAsyncConditions, conditionOptionsMapper} from '../lib/condition-mapper';

export default class ActionReportBasic extends ActionBasic {
  getConditionOptionsMapper = getConditionOptionsMapper;
  getAsyncConditions = getAsyncConditions;
  constructor(props) {
    super(props);

    this.dateRange = $GH.GetDefaultDateInfo(0, 0);
    this.conditionOptionsMapper = Object.assign({}, conditionOptionsMapper, {
      datetimeRange: {
        type: 'datetimeRange',
        refs: ['StartTime', 'EndTime'],
        // needTime: false,
        range: this.dateRange
      },
      dateRange: {
        type: 'datetimeRange',
        refs: ['StartDate', 'EndDate'],
        // needTime: false,
        range: this.dateRange
      }
    });
  }
  IEDateParseHook(dateStringInRange) {
    return $GH.DateParseHook(dateStringInRange);
  }
  getActionBtn() {
    return '-';
  }
  sendData(options) {
    const {
      method, conditionData = {}, data = {}, nextPaging = this.state.pagingInfo,
    } = options;

    const {StartTime, EndTime} = conditionData || data;
    let StartDate = null, EndDate = null;
    let postData = Object.assign({}, options, {
      method,
      data: Object.assign({}, conditionData, data, {
        StartTime: StartTime ? this.IEDateParseHook(StartTime) : undefined,
        EndTime: EndTime ? this.IEDateParseHook(EndTime) : undefined,
        StartDate,
        EndDate,
        Paging: Object.assign({}, nextPaging, {
          AllCount: -1
        })
      })
    });

    this._sendData(postData);
  }
}
