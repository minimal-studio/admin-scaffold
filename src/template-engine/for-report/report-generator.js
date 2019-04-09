/**
 * 表格渲染模版
 */

import React, {Component, PureComponent} from 'react';
import { UUID, IsFunc } from 'basic-helper';

import { Notify } from '../../ui-refs';
import ReportTemplate from './records-template';

/**
 * 用于记录所有页面的按钮
 */
// let __btns = {};
// window.GetRegisteBtn = () => __btns;

const renameTip = (before, after) => {
  console.warn(`请把 ${before} 改名为 ${after}`);
};

function getRecordBtns(...args) {
  const { actionBtnConfig, recordActionBtns } = this;
  if(actionBtnConfig) renameTip('actionBtnConfig', 'recordActionBtns');
  const _recordActionBtns = recordActionBtns || actionBtnConfig;
  if(!_recordActionBtns) return '-';
  let res = [];
  _recordActionBtns.forEach((config, idx) => {
    const { text, action, id, color = 'blue', enable } = config;
    /** 用于控制权限 */
    const isActive = this.powerFilterForBtn(id);
    const isEnabled = IsFunc(enable) ? enable(...args) : true;
    if(isActive && isEnabled) {
      // if(!__btns[Action.name][id]) __btns[Action.name][id] = config;
      res.push(
        <span className={"link-btn mr5 t_" + color} key={text} onClick={e => {
          action(...args);
        }}>
          {this.props.gm(text)}
        </span>
      );
    }
  });
  return res;
}

/** 
 * GeneralReportRender 接受 3 个参数
 * 
 * @param {class} Action 具体业务 action
 * @param {object} [passProps={}] 传给模版引擎的 props
 * @param {class} [TemplatEngin=ReportTemplate] 自定义的模版引擎
 * @return {class} 返回用于 react 的类
 */
export function GeneralReportRender(Action, passProps = {}, TemplatEngin = ReportTemplate) {
  // console.log(Action.name)
  // __btns[Action.name] = {};
  return class C extends Action {
    /** 用于记录所有的按钮 */
    powerFilterForBtn = (btnId) => {
      const { powerMapper } = this.props;
      if(!powerMapper) return true;
      const pageNameMatch = window.location.hash.match(/#\/([a-zA-Z]+)/);
      const pageName = pageNameMatch ? pageNameMatch[1] : '';
      return powerMapper.indexOf(`${pageName}_${btnId}`) > -1;
    }
    reportBtnFilter = () => {
      const { reportActionBtns } = this;
      if(!Array.isArray(reportActionBtns) || reportActionBtns.length === 0) return;
      let res = [];
      for (const btn of reportActionBtns) {
        const id = btn.id;
        if(!id) {
          console.warn('每个按钮需要设置 id，用于记录该按钮在对应页面的功能');
          continue;
        }
        // __btns[Action.name][id] = true;
        if(this.powerFilterForBtn(btn.id)) res.push(btn);
      }
      return res;
    }
    getActionBtn = (...args) => {
      renameTip('getActionBtn', 'getRecordBtns');
      getRecordBtns.apply(this, args);
    }
    getRecordBtns = getRecordBtns.bind(this)

    showDesc = ({title = '消息提示', msg, type = 'error'}) => {
      if(!msg) return;
      Notify({
        config: {
          title: title,
          type: type,
          text: msg,
          id: UUID()
        }
      });
    }
    saveReport = e => this.ReportRef = e;
    render() {
      const scopeProps = Object.assign({}, {
        keyMapper: this.keyMapper,
        conditionOptions: this.conditionOptions,
        needCount: this.needCount,
        onChangeCondition: this.onChangeCondition,
        actionBtns: this.reportBtnFilter(),
        onQueryData: this.queryData.bind(this)
      });
      const props = Object.assign({}, 
        passProps,
        this.templateOptions,
        this.state,
        this.props
      );
      return (
        <TemplatEngin
          {...scopeProps}
          {...props}

          ref={this.saveReport} />
      );
    }
  };
}
