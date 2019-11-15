import React, { Component } from "react";

import { FormLayout, Loading } from "@deer-ui/core";
import { Services } from "@dashboard/services";

const demoGetFormFromRemote = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve({
      value1: "哈哈",
      value2: "呵呵",
      value3: "嘻嘻"
    });
  }, 1000);
});

/**
 * 说明
 * submiting 是否提交中
 * querying  如果需要异步获取表单条件的，需要用 Loading 包装一层，并且 !querying 的时候渲染 FormLayout
 */
export default class TestFormAsync extends Services {
  state = {
    ...this.state,
    querying: true
  };

  componentDidMount() {
    this.getFormOptions();
  }

  getFormOptions() {
    const agentOptions = {
      actingRef: "querying",
      after: (remoteData) => {
        const options = [
          "时间输入",
          "hideDemo",
          "dateRangeDemo",
          "dateRangeDemo2",
          "选择器",
          "radioDemo",
          "checkboxDemo",
          "radioMultipleDemo",
          "selectorDemo",
          "switchDemo",
          "输入控制",
          "inputDemo",
          "inputRangeDemo",
          "refuDemo",
          "inputSelectorDemo",
          "textDemo",
          "自定义组件",
          "customerFormDemo",
          "customerFormDemo2"
        ];
        const merge = {
          selectDemo: {
            values: remoteData
          }
        };
        const formOptions = this.getForms(options, merge);
        return {
          formOptions
        };
      }
    };

    // 使用 reqAgent 管理页面请求状态
    this.reqAgent(demoGetFormFromRemote, agentOptions)();
  }

  btnConfig = [
    {
      action: async (formRef, actingRef) => {
        if (!this.checkForm(formRef)) return;

        const postData = {
          ...formRef.value
        };
        const agentOptions = {
          actingRef
        };
        await this.reqAgent(this.apis.testSubmit, agentOptions)(postData);
      },
      text: "按钮1",
      actingRef: "acting1",
      className: "theme"
    },
    {
      action: async (formRef, actingRef) => {
        if (!this.checkForm(formRef)) return;

        const postData = {
          ...formRef.value
        };
        const agentOptions = {
          actingRef
        };
        await this.reqAgent(this.apis.testSubmit, agentOptions)(postData);
      },
      text: "按钮2",
      actingRef: "acting2",
      className: "red"
    }
  ];

  render() {
    const { querying } = this.state;

    return (
      <div className="card mb10">
        {/* 如果是异步获取表单初始化数据，需要 Loading */}
        <Loading loading={querying}>
          {querying ? null : (
            <FormLayout
              tipInfo={{
                title: "如果是异步获取表单初始化数据，需要 Loading",
                type: "success"
              }}
              {...this.state}
              btnConfig={this.btnConfig}/>
          )}
        </Loading>
      </div>
    );
  }
}
