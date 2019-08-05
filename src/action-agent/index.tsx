/**
 * 基础 Action 组件, 主要实现了请求方式, 包含表单验证的方式
 */

import React, { Component, PureComponent } from 'react';

import {
  Call, CallFunc, IsFunc, DebounceClass
} from 'basic-helper';
import { getUrlParams } from 'uke-request/url-resolve';
import { Children } from 'ukelli-ui/core/utils';
import { FormLayoutProps } from 'ukelli-ui/core/form-generator/form-layout';
import * as paginHelper from '../utils/pagination-helper';
import {
  ReportTemplateProps, ReportActionBtnItem, TemplateOptions,
  ReportActionBtn, PowerMapper
} from '../template-engine/for-report/types';

export interface AgentOptions {
  id?: string;
  /** 在请求发起前设置组件的 state */
  before?: () => {};
  /** 在请求发起后设置组件的 state */
  after?: (response) => {};
  resFilter?;
  actingRef?: string;
}

export interface ReqAgentReturn {
  err?: any;
}

export interface ReqAgentAPI extends Function {}

class ActionAgent extends Component {
  T

  btnConfig!: FormLayoutProps['btnConfig']

  formOptions!: FormLayoutProps['formOptions']

  templateOptions!: TemplateOptions

  keyMapper!: ReportTemplateProps['keyMapper']

  conditionOptions!: ReportTemplateProps['conditionOptions']

  recordActionBtns!: ReportActionBtnItem[]

  reportActionBtns!: ReportActionBtn[]

  powerMapper!: PowerMapper

  getUrlParams = getUrlParams;

  paginHelper = paginHelper;

  routerParams = getUrlParams();

  agents = [];

  __unmount

  _delayExec

  getRecordBtns!: (...args) => Children

  componentWillUnmount() {
    this.__unmount = true;
    // setTimeout(() => {
    //   console.log(this.reqInstance);
    // }, 100);
  }

  /**
   * 请求过程的 state 状态代理
   * @param {reqFunc} asyncFunc 业务 API
   * @param {agentOptions} object 此方法的配置项
   * @return {async function} 返回传入的第一个参数的包装方法，在此过程插入一些生命周期函数
   */
  reqAgent<APIRetrue = {}>(
    reqFunc: ReqAgentAPI, agentOptions: AgentOptions
  ) {
    if (!IsFunc(reqFunc)) {
      const errMsg = 'should pass func at arguments[0]';
      throw Error(errMsg);
    }
    const {
      id = 'reqAction',
      actingRef = 'loading',
      before,
      after,
      resFilter,
    } = agentOptions;

    this.stateSetter(this._before(Call(before), actingRef));

    return (...args): Promise<APIRetrue> => {
      return new Promise(async (resolve, reject) => {
        let res: ReqAgentReturn = {};
        try {
          res = await reqFunc(...args);
        } catch (e) {
          console.log(e);
          res.err = e;
        }
        this.stateSetter(
          Object.assign({},
            {
              [actingRef]: false
            },
            this._after(res),
            this._checkRes(res) ? await CallFunc(after)(res) : {})
        );
        this.resStatus(res, id);
        const result = IsFunc(resFilter) ? resFilter(res) : res;
        resolve(result);
      });
    };
  }

  _before = (params, actingRef) => {
    return Object.assign({}, {
      [actingRef]: true,
    }, params);
  }

  _after = (res) => {
    return { };
  }

  /**
   * 在调用 after 之前执行的 checker 函数
   * @param {response} res 系统传入的 res 对象
   * @return {boolean}
   */
  _checkRes = (res) => {
    return true;
  }

  resStatus = (res, id) => {

  }

  delayExec(...args) {
    if (!this._delayExec) this._delayExec = new DebounceClass();
    return this._delayExec.exec(...args);
  }

  stateSetter(state) {
    if (!this.__unmount && this.setState) this.setState(state);
  }
}

export default ActionAgent;
