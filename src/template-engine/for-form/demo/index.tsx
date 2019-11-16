import React, {
  Component
} from 'react';

import {
  FormLayout,
  Loading
} from '@deer-ui/core';
import ActionAgent from '../../../action-agent';

/**
 * 说明
 * submiting 是否提交中
 * querying  如果需要异步获取表单条件的，需要用 Loading 包装一层，并且 !querying 的时候渲染 FormLayout
 */
export class TestFormBasic extends ActionAgent {
  state = {
    ...this.state
  }

  constructor(props) {
    super(props);

    this.formOptions = [
      "时间输入",
      {
        ref: 'input',
        type: 'input',
        title: '输入'
      },
      {
        refs: ["startDate", "endDate"],
        type: "datetimeRange",
        title: "日期1",
        tips: "123",
        defaultValue: []
      }, {
        refs: ["startDate2", "endDate2"],
        type: "datetimeRange",
        title: "日期2",
        tips: "123",
        defaultValue: []
      }, "选择器", {
        ref: "ref1",
        type: "radio",
        title: "单选控件",
        values: {
          val1: "单选类型1",
          val2: "单选类型2",
          val3: "单选类型3",
          val4: "单选类型4"
        }
      }, {
        ref: "ref_checkbox",
        type: "checkbox",
        title: "checkbox控件",
        values: {
          value1: "value1",
          value2: "value2",
          value3: "value3"
        }
      }, {
        ref: "ref22",
        type: "radio",
        title: "多选控件",
        isMultiple: true,
        values: {
          value1: "value1",
          value2: "value2",
          value3: "value3"
        }
      }, {
        ref: "ref2",
        type: "select",
        title: "选择控件",
        values: {
          value1: "value1",
          value2: "value2",
          value3: "value3"
        }
      }, {
        ref: "switch",
        type: "switch",
        title: "开关",
        defaultValue: true
      }, "输入控制", {
        ref: "ref3",
        type: "input",
        inputType: "number",
        required: true,
        title: "选择控件",
        values: {
          value1: "value1",
          value2: "value2",
          value3: "value3"
        }
      }, {
        refs: ["s", "e"],
        type: "input-range",
        title: "范围",
        range: [0, 10]
      }, {
        refu: {
          refuValue1: "选择1",
          refuValue2: "选择2",
          refuValue3: "选择3"
        },
        type: "input-selector",
        tips: "输入选择器, 等于多个输入框",
        title: "输入选择器1"
      }, {
        ref: "MainRef",
        refForS: "RefForSelector",
        type: "input-selector-s",
        defaultValueForS: 1,
        defaultValue: "123123",
        isNum: true,
        values: {
          1: "选择1",
          2: "选择2",
          3: "选择3"
        },
        tips: "输入选择器, 分开输入和选择器两个标记",
        title: "输入选择器2"
      }, {
        ref: "textarea",
        type: "textarea",
        title: "文本"
      }, "自定义组件", {
        ref: "customer1",
        type: "customForm",
        title: "自定义组件1",
        getCustomFormControl: () => (
          <div>自定义Form</div>
        )
      }
    ];
  }

  formBtns = [{
    action: async (formRef, actingRef) => {
      if (!this.checkForm(formRef)) return;

      const postData = {
        ...formRef.value,
      };
      const agentOptions = {
        actingRef
      };
      await this.reqAgent(this.apis.testSubmit, agentOptions)(postData);
    },
    text: '按钮1',
    actingRef: 'acting1',
    className: 'theme'
  },
  {
    action: async (formRef, actingRef) => {
      if (!this.checkForm(formRef)) return;

      const postData = {
        ...formRef.value,
      };
      const agentOptions = {
        actingRef
      };
      await this.reqAgent(this.apis.testSubmit, agentOptions)(postData);
    },
    text: '按钮2',
    actingRef: 'acting2',
    className: 'red'
  },
  ];

  render() {
    const {
      querying = false
    } = this.state;

    return (<div className = "card" > {
      /* 如果是已经定义好的数据，则不需要 Loading */ } <
      FormLayout tipInfo = {
        {
          title: '如果是已经定义好的数据，则不需要 Loading',
          type: 'success'
        }
      } {
      ...this.state
      }
      formOptions = {
        this.formOptions
      }
      formBtns = {
        this.formBtns
      }
      /> </div>
    );
  }
}
