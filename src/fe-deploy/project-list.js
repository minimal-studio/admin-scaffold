import React, { Component, PropTypes } from 'react';
import { Loading, TableBody, Notify, ShowGlobalModal, ConditionGenerator, CloseGlobalModal, TipPanel } from 'ukelli-ui';
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
              title: '项目 ' + projName + ' 管理',
              width: 900,
              // draggable: true,
              showFuncBtn: false,
              children: (
                <ProjectManager
                  {...this.props}
                  queryProject={this.queryData}
                  getProject={e => this.getProject(idx)}
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
      key: 'collaborators',
      title: '协作者',
      filter: (str, item) => {
        let collaborators = Object.keys(item.collaborators);
        let has = collaborators.length > 0;
        return has ? collaborators.join(',') : '-';
      }
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
    querying: true
  };

  getProject = (idx) => {
    return this.state.records[idx];
  }

  notify = (title, isSuccess, text) => {
    const normalType = typeof isSuccess == 'undefined';
    Notify({
      config: {
        id: GenerteID(),
        type: normalType ? 'normal' : isSuccess ? 'success' : 'error',
        title: normalType ? title : title + (isSuccess ? '成功' : '失败'),
        text
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

  queryData = async () => {
    this.setState({
      querying: true
    });
    const {range} = this.conditionRef.value;
    let res = await getProjects({range});
    let records = this.projRecordSearch(res.data);
    this.setState({
      records,
      querying: false
    });
    return records;
  };

  delProject = id => {
    if (this.submiting) return;
    this.submiting = true;
  };

  create() {
    let ModalId = ShowGlobalModal({
      title: '新增项目',
      width: 900,
      showFuncBtn: false,
      children: (
        <CreateProjectHelper
          {...this.props}
          notify={this.notify}
          onCreatedProject={() => {
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
    if(!records) return [];
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
    const { records, querying } = this.state;

    return (
      <div>
        <TipPanel title="使用说明" texts={[
          '项目发布后的路由为: host:28101/public/projectName',
          '根据实际情况来绑定域名',
          '项目创建人对自身创建的项目有绝对控制权',
          '如果需要与其他人协作，协作者可以申请加入到具体项目中'
        ]}/>
        <Loading loading={querying} inrow={true}>
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
      </div>
    );
  }
}
