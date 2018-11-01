/**
 * 表格渲染模版
 */

import React, {Component, PureComponent} from 'react';
import { Notify } from 'ukelli-ui';
import { GenerteID } from 'basic-helper';

import ReportLayoutRender from './records-template';

export function GeneralReportRender(Action, passProps = {}) {
  return class C extends Action {
    getActionBtn(item) {
      const {actionBtnConfig} = this;
      if(!actionBtnConfig) return '-';
      return actionBtnConfig.map((config, idx) => {
        const {text, action} = config;
        return (
          <span className="link-btn mr5" key={text + idx} onClick={e => {
            action(item);
          }}>
            {this.props.gm(text)}
          </span>
        );
      });
    }

    showDesc({title = '消息提示', msg, type = 'error'}) {
      if(!msg) return;
      Notify({
        config: {
          title: title,
          type: type,
          text: msg,
          id: GenerteID()
        }
      });
    }
    render() {
      return (
        <ReportLayoutRender
          keyMapper={this.keyMapper}
          conditionOptions={this.conditionOptions}
          needCount={this.needCount}
          actionBtns={this.actionBtns}
          ref={e => this.ReportRef = e}

          {...passProps}
          {...this.templateOptions}
          {...this.state}
          {...this.props}
          onQueryData={this.queryData.bind(this)}/>
      );
    }
  };
}
