/**
 * 这个是设置更多操作的示例
 * 1. 通过继承 Action 的获取业务数据的接口
 * 2. 如果需要更多操作，可以通过定义 getActionBtn 来生成操作按钮
 * 3. 这里都是编写 page 的业务逻辑的，更专注于模版
 */

import React from 'react';

import { ShowModal, CloseModal, DescHelper } from 'ukelli-ui';
import { GeneralReportRender } from '.';
import { getTestData, keyFieldsForReport, conditionData } from './report-data';
import ActionAgent from '../action-agent';

class TestReportClass extends ActionAgent {
  state = {
    propsForTable: {
      rowKey: record => record.ID
    }
  }
  templateOptions = {
    needCheck: true,
    whenCheckAction: (
      <div>
        <span className="btn theme">批量操作逻辑</span>
      </div>
    )
  }
  constructor(props) {
    super(props);

    this.conditionOptions = conditionData;

    this.keyMapper = keyFieldsForReport;
  }
  reportActionBtns = [
    {
      text: 'ForTest',
      id: 'testing',
      action: () => {
        console.log('for test');
      }
    }
  ]
  // 与 GeneralReportRender 模版对接的查询接口
  queryData = async (reportData) => {
    const postData = {};
    const agentOptions = {
      actingRef: 'querying',
      after: (res) => {
        return {
          records: res
        };
      },
    };
    await this.reqAgent(getTestData, agentOptions)(postData);
  }
  showDetail(item) {
    let ModalId = ShowModal({
      title: '详情',
      width: 700,
      children: (
        <DescHelper keyMapper={this.keyMapper} record={item} />
      )
    });
  }
  // 与 GeneralReportRender 模版对接的按钮接口
  actionBtnConfig = [
    {
      text: '详情',
      id: 'detail',
      action: (...args) => {
        this.showDetail(...args);
      }
    }
  ];
}

const TestReport = GeneralReportRender(TestReportClass);

export default TestReport;
