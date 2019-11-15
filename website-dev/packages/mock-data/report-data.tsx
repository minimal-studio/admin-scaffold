import React from "react";
import { ShowModal } from "@deer-ui/core";
import { SetFloatLen, SetBasicUnit } from "@mini-code/base-func";

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

const getTestData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          ID: 1,
          Username: "Name1",
          Address: "gd",
          Income: "10000000000",
          Phone: "1333333333",
          Status: "在家",
          Weight: 58
        },
        {
          ID: 2,
          Username: "Name2",
          Address: "hk",
          Income: "20000000000",
          Phone: "1333333334",
          Status: "在外",
          Weight: 58
        },
        {
          ID: 3,
          Username: "Name3",
          Address: "moc",
          Income: "30000000000",
          Phone: "1333333335",
          Status: "在内",
          Weight: 58
        },
        {
          ID: 4,
          Username: "Name4",
          Address: "ab",
          Income: "40000000000",
          Phone: "1333333336",
          Status: "没有",
          Weight: 78
        }
      ]);
    }, 1000);
  });
};

const keyFieldsForReport = [
  "username_for_user",
  {
    key: "Address",
    labels: {
      gd: "red",
      hk: "green",
      moc: "orange"
    },
    namesMapper: {
      gd: "广东",
      hk: "香港",
      moc: "澳门"
    }
  },
  {
    key: "Status",
    title: {
      type: "selector",
      values: {
        0: "在家",
        1: "在外",
        2: "在内"
      },
      onChange: (val) => {
        ShowModal({
          title: "改变的值",
          children: <div>{JSON.stringify(val)}</div>
        });
      }
    }
  },
  {
    key: "Income",
    money: true,
    onSort: (mapper, isDesc) => {
      // alert('进行了排序');
      console.log(mapper, isDesc);
      return !isDesc;
    }
  },
  "Phone",
  "Nickname",
  "Gender",
  "Expenditure",
  "EducationLevel",
  "Jobs",
  "Hobby",
  "Placeholder1",
  "Placeholder2",
  "Placeholder3",
  "Placeholder4",
  "Placeholder5",
  "Placeholder6",
  "Placeholder7",
  {
    key: "Weight",
    filter: (str, item, mapper, idx) => {
      // 这里是过滤每一条 Weight 字段的 filter 函数
      return `${str}kg`;
    }
  }
];

export { getTestData, keyFieldsForReport };
