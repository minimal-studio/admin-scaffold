/**
 * 表格渲染模版
 */

import React, { Component, PureComponent } from "react";

import ReportLayoutRender from "./records-template";

export function HOCReportRender(Action, passProps = {}) {
  return class C extends Action {
    getRecordBtns(item) {
      const { recordActionBtns } = this;
      if (!recordActionBtns) return "-";
      return recordActionBtns.map((config, idx) => {
        const { text, action } = config;
        return (
          <span
            className="link-btn mr5"
            key={text + idx}
            onClick={e => {
              action(item);
            }}
          >
            {this.props.gm(text)}
          </span>
        );
      });
    }

    render() {
      return (
        <ReportLayoutRender
          columns={this.columns}
          conditionOptions={this.conditionOptions}
          needCount={this.needCount}
          {...passProps}
          {...this.templateOptions}
          {...this.state}
          {...this.props}
          onQueryData={this.queryData.bind(this)}
        />
      );
    }
  };
}
