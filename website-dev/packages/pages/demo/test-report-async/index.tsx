/**
 * 这个是设置更多操作的示例
 * 1. 通过继承 Action 的获取业务数据的接口
 * 2. 如果需要更多操作，可以通过定义 getRecordBtns 来生成操作按钮
 * 3. 这里都是编写 page 的业务逻辑的，更专注于模版
 */

import React from "react";

import { ShowModal, CloseModal, TableRow } from "@deer-ui/core";
import { Services } from "@dashboard/services";
import { HOCReportRender } from "@dashboard/template-engine";
import { getTestData, keyFieldsForReport } from "@dashboard/mock-data/report-data";

const demoGetFormFromRemote = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve({
      value1: "哈哈",
      value2: "呵呵",
      value3: "嘻嘻"
    });
  }, 1000);
});

class TestReportClass extends Services {
  state = {
    ...this.state,
    loadingCondition: true
  };

  constructor(props) {
    super(props);

    this.columns = [
      ...this.getFields({
        names: keyFieldsForReport
      }),
      {
        key: "action",
        filter: (str, ...other) => this.getRecordBtns(...other)
      }
    ];
  }

  componentDidMount() {
    // this.getFormOptions1();
    this.getFormOptions2();
  }

  getFormOptions1 = async () => {
    await this.reqAgent(demoGetFormFromRemote, {
      actingRef: "loadingCondition",
      after: (remoteData) => {
        const options = [
          "hideDemo",
          "dateRangeDemo",
          "dateRangeDemo2",
          "radioDemo",
          "checkboxDemo",
          "selectorDemo",
          "inputDemo",
          "customerFormDemo",
          "customerFormDemo2",
          "inputRangeDemo",
          "refuDemo",
          "inputSelectorDemo",
          "switchDemo",
          "datetimeRange",
          "asyncCon"
        ];
        const merge = {
          selectDemo: {
            values: remoteData
          }
        };
        const conditionOptions = this.getConditions(options, merge);
        return {
          conditionOptions
        };
      }
    })();
  };

  getFormOptions2 = async () => {
    const options = [
      "hideDemo",
      "dateRangeDemo",
      "dateRangeDemo2",
      "radioDemo",
      "checkboxDemo",
      "selectorDemo",
      "inputDemo",
      "customerFormDemo",
      "customerFormDemo2",
      "inputRangeDemo",
      "refuDemo",
      "inputSelectorDemo",
      "switchDemo",
      "datetimeRange",
      "asyncCon"
    ];
    const conditionOptions = await this.getConditionsSync(options);
    this.setState({
      conditionOptions,
      loadingCondition: false
    });
  };

  // 与 HOCReportRender 模版对接的查询接口
  queryData = async (reportData) => {
    const postData = this.reportDataFilter(reportData);
    const agentOptions = {
      actingRef: "querying",
      id: "queryData",
      after: (res) => ({
        records: res
      })
    };
    const res = await this.reqAgent(getTestData, agentOptions)(postData);
  };

  showDetail(item) {
    const ModalId = ShowModal({
      title: "详情",
      width: 700,
      children: <TableRow columns={this.columns} record={item} />
    });
  }

  // 与 HOCReportRender 模版对接的按钮接口
  recordActionBtns = [
    {
      text: "详情",
      id: "detail",
      action: (...args) => {
        this.showDetail(...args);
      }
    }
  ];
}

const TestReportAsync = HOCReportRender(TestReportClass);

export default TestReportAsync;
