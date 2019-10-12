/* eslint-disable no-continue */
/**
 * 表格渲染模版
 */

import { Subtract } from 'utility-types';
import React, { Component, PureComponent } from 'react';
import { UUID, IsFunc } from 'basic-helper';

import { NotifyConfig } from 'ukelli-ui/core/notification/notification';
import { Notify } from '../../ui-refs';
import ReportTemplate from './records-template';
import { ReportTemplateProps } from './types';

/**
 * 用于记录所有页面的按钮
 */
// let __btns = {};
// window.GetRegisteBtn = () => __btns;

const renameTip = (before, after) => {
  console.warn(`请把 ${before} 改名为 ${after}`);
};

export interface TemplateOptions extends ReportTemplateProps {}

/**
 * HOCReportRender 接受 3 个参数
 *
 * @param {class} Action 具体业务 action
 * @param {object} [passProps={}] 传给模版引擎的 props
 * @param {class} [TemplatEngin=ReportTemplate] 自定义的模版引擎
 * @return {class} 返回用于 react 的类
 */
function HOCReportRender<P extends ReportTemplateProps>(
  Action: React.ComponentClass<P>,
  passProps = {},
  TemplatEngin = ReportTemplate
) {
  if (!Action) return null;
  // console.log(Action.name)
  // __btns[Action.name] = {};
  return class C extends Action {
    ReportRef;

    actionBtnConfig

    recordActionBtns
    
    reportActionBtns

    getRecordBtns = (...args) => {
      const { actionBtnConfig, recordActionBtns } = this;
      if (actionBtnConfig) renameTip('actionBtnConfig', 'recordActionBtns');
      const _recordActionBtns = recordActionBtns || actionBtnConfig;
      if (!_recordActionBtns) return '-';
      const res: any[] = [];
      _recordActionBtns.forEach((config, idx) => {
        const {
          text, action, id, color = 'blue', enable
        } = config;
        /** 用于控制权限 */
        const isActive = this.powerFilterForBtn(id);
        const isEnabled = IsFunc(enable) ? enable(...args) : true;
        if (isActive && isEnabled) {
          // if(!__btns[Action.name][id]) __btns[Action.name][id] = config;
          res.push(
            <span className={`link-btn mr5 t_${color}`} key={text} onClick={(e) => {
              action(...args);
            }}>
              {this.props.$T(text)}
            </span>
          );
        }
      });
      return res;
    }

    /** 用于记录所有的按钮 */
    powerFilterForBtn = (btnId) => {
      const { powerMapper, pageName } = this.props;
      if (!powerMapper || !pageName) return true;
      return powerMapper.indexOf(`${pageName}_${btnId}`) > -1;
    }

    reportBtnFilter = () => {
      const { reportActionBtns } = this;
      if (!Array.isArray(reportActionBtns) || reportActionBtns.length === 0) return null;
      const res: any[] = [];
      for (const btn of reportActionBtns) {
        const { id } = btn;
        if (!id) {
          console.warn('每个按钮需要设置 id，用于记录该按钮在对应页面的功能');
          continue;
        }
        // __btns[Action.name][id] = true;
        if (this.powerFilterForBtn(btn.id)) res.push(btn);
      }
      return res;
    }

    getActionBtn = (...args) => {
      renameTip('getActionBtn', 'getRecordBtns');
      this.getRecordBtns(...args);
    }

    showDesc = (showOptions: NotifyConfig) => {
      const { title = '消息提示', text, type = 'error' } = showOptions;
      if (!text) return;
      Notify({
        config: {
          title,
          type,
          text,
          id: UUID()
        }
      });
    }

    saveReport = (e) => { this.ReportRef = e; };

    render() {
      const scopeProps = Object.assign({}, {
        columns: this.columns,
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
        this.props);
      return (
        <TemplatEngin
          {...scopeProps}
          {...props}

          ref={this.saveReport} />
      );
    }
  };
}

function GeneralReportRender(...args) {
  renameTip('GeneralReportRender', 'HOCReportRender');
  HOCReportRender(...args);
}

export {
  GeneralReportRender, HOCReportRender
};
