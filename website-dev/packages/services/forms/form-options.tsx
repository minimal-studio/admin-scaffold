/**
 * 根据具体的业务制定所有的表单配置
 */
import React from "react";

const CustomerCom = ({ onChange }) => {
  // onChange 由 FormGenerator 提供
  return <div onClick={e => onChange("vvvvv")}>自定义组件</div>;
};

/**
 * 根据具体业务的名字命名，在外层通过 getForms(['name']) 获取对应配置
 */
const Conditions = {
  hideDemo: {
    type: "hidden",
    value: "hiddenID",
    ref: "hiddenID"
  },
  dateRangeDemo: {
    refs: ["startDate", "endDate"],
    type: "datetimeRange",
    title: "日期1",
    tips: "123",
    defaultValue: []
  },
  dateRangeDemo2: {
    refs: ["startDate2", "endDate2"],
    type: "datetimeRange",
    title: "日期2",
    tips: "123",
    defaultValue: []
  },
  radioDemo: {
    ref: "ref1",
    type: "radio",
    title: "单选控件",
    values: {
      val1: "单选类型1",
      val2: "单选类型2",
      val3: "单选类型3",
      val4: "单选类型4"
    }
  },
  checkboxDemo: {
    ref: "ref_checkbox",
    type: "checkbox",
    title: "checkbox控件",
    values: {
      value1: "value1",
      value2: "value2",
      value3: "value3"
    }
  },
  radioMultipleDemo: {
    ref: "ref22",
    type: "radio",
    title: "多选控件",
    isMultiple: true,
    values: {
      value1: "value1",
      value2: "value2",
      value3: "value3"
    }
  },
  selectorDemo: {
    ref: "ref2",
    type: "select",
    title: "选择控件",
    values: {
      value1: "value1",
      value2: "value2",
      value3: "value3"
    }
  },
  inputDemo: {
    ref: "ref3",
    type: "input",
    inputType: "number",
    required: true,
    title: "输入",
    values: {
      value1: "value1",
      value2: "value2",
      value3: "value3"
    }
  },
  customerFormDemo: {
    ref: "customer1",
    type: "customForm",
    getCustomFormControl: () => (
      <div>customForm</div>
    ),
    title: "自定义组件1",
  ,
  customerFormDemo2: {
    ref: "customer2",
    type: "customForm",
    getCustomFormControl: () => CustomerCom,
    title: "自定义组件2",
    values: {
      value1: "value1",
      value2: "value2",
      value3: "value3"
    }
  },
  inputRangeDemo: {
    refs: ["s", "e"],
    type: "input-range",
    title: "范围",
    range: [0, 10]
  },
  refuDemo: {
    refu: {
      refuValue1: "选择1",
      refuValue2: "选择2",
      refuValue3: "选择3"
    },
    type: "input-selector",
    tips: "输入选择器, 等于多个输入框",
    title: "输入选择器1"
  },
  inputSelectorDemo: {
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
  },
  switchDemo: {
    ref: "switch",
    type: "switch",
    title: "开关",
    defaultValue: true
  },
  textDemo: {
    ref: "textarea",
    type: "textarea",
    title: "文本"
  }
};

export default Conditions;
