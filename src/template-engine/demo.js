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
    records: [],
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

    this.keyMapper = [
      ...keyFieldsForReport,
      {
        key: 'action',
        fixed: 'right',
        filter: (...args) => this.getRecordBtns(...args)
      }
    ];
  }
  recordActionBtns = [
    {
      text: '详情',
      id: 'detail',
      enable: () => {
        // 返回是否
        return true;
      },
      action: (...args) => {
        this.showDetail(...args);
      }
    },
    {
      text: '单行显示',
      id: 'test',
      enable: (str, item, mapper, idx) => {
        return idx % 2 === 0;
      },
      action: (...args) => {
        this.showDetail(...args);
      }
    },
  ]
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
}

const TestReport = GeneralReportRender(TestReportClass);

export default TestReport;
