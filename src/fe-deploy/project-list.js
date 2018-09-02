import React, { Component, PropTypes } from 'react';
import { Loading, TableBody, Notify, ShowGlobalModal, ConditionGenerator, CloseGlobalModal } from 'ukelli-ui';
import {GenerteID} from 'basic-helper';

import { getProjects } from './apis';
import ProjectManager from './project-manager';
import CreateProjectHelper from './create-project';

export default class Records extends Component {
  keyMapper = [
    {
      key: 'projName',
      title: '项目名',
      filter: (str, item, _, idx) => {
        const {projName, id} = item;
        return (
          <span className="link-btn" onClick={() => {
            ShowGlobalModal({
              title: projName + ' 版本管理',
              width: 1000,
              // draggable: true,
              showFuncBtn: false,
              children: (
                <ProjectManager
                  {...this.props}
                  targetProject={item}
                  notify={this.notify}
                />
              )
            })
          }}>{str}</span>
        )
      }
    },
    {
      key: 'projCode',
      title: '项目编码'
    },
    {
      key: 'founder',
      title: '创建人'
    },
    {
      key: 'createdDate',
      title: '创建日期',
      datetime: true
    },
    // {
    //   key: 'version',
    //   title: '当前版本'
    // },
  ];

  conditionOptions = [
    {
      type: 'radio',
      ref: 'range',
      defaultValue: 'me',
      title: '项目',
      values: {
        'me': '我的',
        'join': '我参与的',
        'all': '全部',
      }
    },
    {
      refu: {
        'projName': '项目名',
        'projCode': '项目编码',
        'founder': '创建者',
      },
      type: 'input-selector',
    },
  ];

  state = {
    records: [],
  };

  notify = (title, isSuccess) => {
    const normalType = typeof isSuccess == 'undefined';
    Notify({
      config: {
        id: GenerteID(),
        type: normalType ? 'normal' : isSuccess ? 'success' : 'error',
        title: normalType ? title : title + (isSuccess ? '成功' : '失败'),
      }
    })
  }

  pathFilter = (str) => {
    let defaultPath = '/assets';
    let [start, end] = str.split(defaultPath);
    return end ? '~' + defaultPath + end : start;
  }

  getAssetsRecord = (idx) => {
    return this.state.records[idx];
  }

  componentDidMount() {
    this.queryData();
  }

  handleSearch = e => {
    this.setState({
      searchValue: e.target.value
    });
  };

  async queryData() {
    const {username} = this.props;
    const {range} = this.conditionRef.value;
    let res = await getProjects({username, range});
    let records = this.projRecordSearch(res.data);
    this.setState({ records });
    return records;
  };

  delProject = id => {
    if (this.submiting) return;
    this.submiting = true;
  };

  create() {
    let ModalId = ShowGlobalModal({
      title: '新增项目',
      width: 600,
      showFuncBtn: false,
      children: (
        <CreateProjectHelper
          {...this.props}
          notify={this.notify}
          handleSuccess={() => {
            // CloseGlobalModal(ModalId);
            this.queryData();
          }}
        />
      )
    })
  }

  /**
   * 根据 input-selector 的输入来过滤结果
   */
  projRecordSearch(records) {
    const {founder, projCode, projName} = this.conditionRef.value;
    const filterArr = {founder, projCode, projName};
    let nextRecords = [...records];
    if(!!founder || !!projCode || !!projName) {
      nextRecords = nextRecords.filter(item => {
        let isActive = false;
        Object.keys(filterArr).forEach((filterName) => {
          let searchProj = filterArr[filterName];
          if(!searchProj) return;
          isActive = item[filterName].indexOf(searchProj) != -1;
        });
        return isActive;
      });
    }
    return nextRecords;
  }

  render() {
    const { records } = this.state;

    return (
      <Loading loading={!records} inrow={true}>
        <div className="project-list p10">
          <ConditionGenerator
            ref={e => this.conditionRef = e}
            conditionConfig={this.conditionOptions}>
            <button className="btn theme flat" onClick={e => this.queryData()}>查询</button>
          </ConditionGenerator>
          <div className="action-group">
            <button
              className="btn theme flat mr10"
              onClick={() => this.create()}>
              新增项目
            </button>
          </div>
          <TableBody
            keyMapper={this.keyMapper}
            records={records}
            needCount={false}
          />
        </div>
      </Loading>
    );
  }
}
