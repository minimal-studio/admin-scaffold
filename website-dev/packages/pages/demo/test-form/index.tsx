/* eslint-disable max-classes-per-file */
import React, { Component } from "react";

import { FormLayout, Loading, Button } from "@deer-ui/core";
import { Services } from "@dashboard/services";

/**
 * 说明
 * submiting 是否提交中
 * querying  如果需要异步获取表单条件的，需要用 Loading 包装一层，并且 !querying 的时候渲染 FormLayout
 */
export class TestFormBasic extends Services {
  state = {
    ...this.state
  };

  constructor(props) {
    super(props);

    this.formOptions = this.getForms([
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
    ]);

    this.formBtns = [
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
        color: "theme"
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
        color: "red"
      }
    ];
  }
}

export class TestForm extends TestFormBasic {
  state = {
    ...this.state,
    layout: 'horizontal'
  }

  render() {
    const { querying = false, layout } = this.state;

    return (
      <div className="card">
        <div className="p20">
          {/* 如果是已经定义好的数据，则不需要 Loading */}
          <Button onClick={(e) => {
            this.setState({
              layout: layout === 'horizontal' ? 'vertical' : 'horizontal'
            });
          }}
          >
          切换至{layout === 'horizontal' ? '垂直' : '水平'}布局
          </Button>
          <FormLayout
            tipInfo={{
              title: "如果是已经定义好的数据，则不需要 Loading",
              type: "success"
            }}
            layout={layout}
            {...this.state}
            formOptions={this.formOptions}
            formBtns={this.formBtns}
          />
        </div>
      </div>
    );
  }
}
