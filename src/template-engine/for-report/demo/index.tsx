/**
 * 这个是设置更多操作的示例
 * 1. 通过继承 Action 的获取业务数据的接口
 * 2. 如果需要更多操作，可以通过定义 getRecordBtns 来生成操作按钮
 * 3. 这里都是编写 page 的业务逻辑的，更专注于模版
 */

import React from 'react';

import { ShowModal, CloseModal, DescHelper } from 'ukelli-ui';
import { HOCReportRender } from '..';
import { getTestData, keyFieldsForReport, conditionData } from '../../report-data';
import ActionAgent from '../../../action-agent';
import * as paginHelper from '../../../utils/pagination-helper'

class TestReportClass extends ActionAgent {
  state = {
    records: [],
    propsForTable: {
      rowKey: record => record.ID
    },
    infoMapper: paginHelper.getPaginMapper(),
    pagingInfo: paginHelper.getDefPagin(),
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

    this.recordActionBtns = [
      {
        text: 'sasd',
        id: 'strin',
        action: () => {

        }
      }
    ];


    this.templateOptions = {
      needCheck: true,
      checkedOverlay: (
        <div>
          <span className="btn theme">批量操作逻辑</span>
        </div>
      )
    };
  }

  // recordActionBtns = [
  //   {
  //     text: '详情',
  //     id: 'detail',
  //     enable: () => {
  //       // 返回是否
  //       return true;
  //     },
  //     action: (...args) => {
  //       this.showDetail(...args);
  //     }
  //   },
  //   {
  //     text: '单行显示',
  //     id: 'test',
  //     enable: (str, item, mapper, idx) => {
  //       return idx % 2 === 0;
  //     },
  //     action: (...args) => {
  //       this.showDetail(...args);
  //     }
  //   },
  // ]

  reportActionBtns = [
    {
      text: '测试按钮',
      id: 'testing',
      action: () => {
        console.log('for test');
      }
    }
  ]

  // 与 HOCReportRender 模版对接的查询接口
  queryData = async (reportData) => {
    const postData = {};
    const agentOptions = {
      actingRef: 'querying',
      after: (res) => {
        return {
          records: res.data,
          pagingInfo: {
            ...this.state.pagingInfo,
            ...res.paging
          }
        };
      },
    };
    await this.reqAgent(getTestData, agentOptions)(postData);
  }

  showDetail(item) {
    const ModalId = ShowModal({
      title: '详情',
      width: 700,
      children: (
        <DescHelper keyMapper={this.keyMapper} record={item} />
      )
    });
  }
}

const TestReport = HOCReportRender(TestReportClass);

export default TestReport;
