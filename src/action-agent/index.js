/**
 * 基础 Action 组件, 主要实现了请求方式, 包含表单验证的方式
 * @Alex
 */

import React, {Component, PureComponent} from 'react';

import { Call, CallFunc, IsFunc, DebounceClass } from 'basic-helper';
import { getUrlParams } from 'uke-request';

import * as paginHelper from '../utils/pagination-helper';

class ActionAgent extends Component {
  getUrlParams = getUrlParams;
  paginHelper = paginHelper;
  routerParams = getUrlParams();
  componentWillUnmount() {
    this.__unmount = true;
  }
  /**
   * 请求过程的 state 状态代理
   * @param {reqFunc} asyncFunc 业务 API
   * @param {agentOptions} object 此方法的配置项
   * @return {async function} 返回传入的第一个参数的包装方法，在此过程插入一些生命周期函数
   */
  reqAgent = (reqFunc, agentOptions = {}) => {
    if(!IsFunc(reqFunc)) return console.warn('should pass func at arguments[0]');
    // if(!actingRef) return console.warn('need pass actingRef');

    const {
      id = 'reqAction',
      before,
      after,
      resFilter,
      actingRef,
    } = agentOptions;

    this.stateSetter(this._before(Call(before), actingRef));

    return async (...args) => {
      let res = {};
      try {
        res = await reqFunc(...args);
      } catch(e) {
        console.log(e);
        res.err = e;
      }
      this.stateSetter(
        Object.assign({},
          {
            [actingRef]: false
          },
          this._after(res),
          this._checkRes(res) ? await CallFunc(after)(res) : {}
        )
      );
      this.resStatus(res, id);
      return IsFunc(resFilter) ? resFilter(res) : res;
    };
  }
  _before(params, actingRef) {
    return Object.assign({}, {
      [actingRef]: true,
    }, params);
  }
  _after(res) {
    return { };
  }
  /**
   * 在调用 after 之前执行的 checker 函数
   * @param {response} res 系统传入的 res 对象
   * @return {boolean}
   */
  _checkRes(res) {
    return true;
  }
  resStatus(res) {

  }
  delayExec(...args) {
    if(!this._delayExec) this._delayExec = new DebounceClass();
    return this._delayExec.exec(...args);
  }
  stateSetter(state) {
    if(!this.__unmount && this.setState) this.setState(state);
  }
}

export default ActionAgent;
