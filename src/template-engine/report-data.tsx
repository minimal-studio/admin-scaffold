import React from 'react';
import {
  ShowModal,
} from '@deer-ui/core';
import {
  SetFloatLen,
  SetBasicUnit
} from '@mini-code/base-func';
import { TableKeyMapper } from '@deer-ui/core/table';

/** 设置金钱的浮动小数位数 */
SetFloatLen(2);

/**
 * 设置金额的基准单位，默认为毫 10000
 * 1 元
 * 10 角
 * 100 分
 * 1000 厘
 * 10000 毫
 */
SetBasicUnit(100);

const conditionData = [{
  type: "hidden",
  value: "hiddenID",
  ref: "hiddenID"
}, {
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
}, {
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
  ref: "ref2",
  type: "select",
  title: "选择控件",
  values: {
    value1: "value1",
    value2: "value2",
    value3: "value3"
  }
}, {
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
  ref: "customer1",
  type: "customForm",
  title: "自定义组件1",
  getCustomFormControl: () => (
    <div>自定义Form</div>
  )
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
  ref: "switch",
  type: "switch",
  title: "开关",
  defaultValue: true
}];

const getTestData = () => {
  return new Promise((resolve) => {
    const resData = [{
      ID: 1,
      Username: 'Name1',
      Address: 'gd',
      Income: '10000000000',
      Phone: '1333333333',
      Status: '在家',
      Weight: 58,
    },
    {
      ID: 2,
      Username: 'Name2',
      Address: 'hk',
      Income: '20000000000',
      Phone: '1333333334',
      Status: '在外',
      Weight: 58,
    },
    {
      ID: 3,
      Username: 'Name3',
      Address: 'moc',
      Income: '30000000000',
      Phone: '1333333335',
      Status: '在内',
      Weight: 58,
    },
    {
      ID: 4,
      Username: 'Name4',
      Address: 'ab',
      Income: '40000000000',
      Phone: '1333333336',
      Status: '没有',
      Weight: 78,
    }];
    const resPagin = {
      pIdx: 0,
      total: 100,
    };
    setTimeout(() => {
      resolve({
        data: resData,
        paging: resPagin
      });
    }, 1000);
  });
};

const keyFieldsForReport: TableKeyMapper = [
  {
    key: 'Address',
    labels: {
      gd: 'red',
      hk: 'green',
      moc: 'orange',
    },
    namesMapper: {
      gd: '广东',
      hk: '香港',
      moc: '澳门',
    },
  },
  {
    key: 'Status',
    title: {
      type: 'selector',
      values: {
        0: '在家',
        1: '在外',
        2: '在内',
      },
      onChange: (val) => {
        ShowModal({
          title: '改变的值',
          children: (
            <div>
              {
                JSON.stringify(val)
              }
            </div>
          )
        });
      }
    }
  },
  {
    key: 'Income',
    money: true,
    onSort: (mapper, isDesc) => {
      // alert('进行了排序');
      console.log(mapper, isDesc);
      return !isDesc;
    }
  },
  { key: 'Phone' },
  { key: 'Nickname' },
  { key: 'Gender' },
  { key: 'Expenditure' },
  { key: 'EducationLevel' },
  { key: 'Jobs' },
  { key: 'Hobby' },
  { key: 'Placeholder1' },
  { key: 'Placeholder2' },
  { key: 'Placeholder3' },
  { key: 'Placeholder4' },
  { key: 'Placeholder5' },
  { key: 'Placeholder6' },
  { key: 'Placeholder7' },
  {
    key: 'Weight',
    filter: (str, item, mapper, idx) => {
      // 这里是过滤每一条 Weight 字段的 filter 函数
      return `${str}kg`;
    }
  }
];

export {
  getTestData,
  keyFieldsForReport,
  conditionData
};
