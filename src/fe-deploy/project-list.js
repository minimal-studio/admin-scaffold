import React, { Component } from 'react';
import {
  Loading, TableBody, Notify, ShowGlobalModal, Button,
  ConditionGenerator, CloseGlobalModal, TipPanel
} from 'ukelli-ui';
import { GenerteID } from 'basic-helper';

import { getProjects } from './apis';
import ProjectManager from './project-manager';
import CreateProjectHelper from './create-project';
import ApprovePanel from './approve-panel';

const CompleteManual = () => {
  return (
    <div>
      <TipPanel title="功能介绍、名词解释, 「开发(Dev)须知」" type="warm" texts={[
        '创建「项目 Project」',
        '在「项目」中上传「资源 Asset」',
        '「项目」允许编辑, 但是「项目编号」是唯一标识, 用作部署标记, 不可更改',
        '「项目」允许删除, 删除会清理已上传的所有资源, 除了审计记录',
        '「资源列表」列出所有已上传的资源',
        '「资源列表」可以「发布、回滚、下载、删除」对应资源',
        '「项目创建者」对自己创建的项目有绝对控制权, 为自身项目负责, 其他人可以申请作为「协作者」加入到项目',
        '「操作审计」用于记录项目的所有操作, 由系统自动产生, 不可删除',
      ]}/>
      <TipPanel title="关于创建者与协作者机制, 「开发(Dev)运维(Ops)须知」" type="success" texts={[
        '「项目创建者」对自身创建的项目有绝对控制权, 可以允许其他人的协作申请, 让协作者加入',
        '「协作者」有一定的限制, 只能做「项目创建者」允许的操作, 同时不允许删除项目'
      ]}/>
      <TipPanel title="发布机制, 「开发(Dev)运维(Ops)须知」" type="error" texts={[
        '资源格式: 统一使用 zip 的压缩格式, 「部署服务器」需要有 unzip 功能',
        '部署路径: 根据「项目编码 projCode」标记 web server 的运行路径的部署目录, 例如 web-server/assets/public/[projCode]',
        '部署地址: 静态资源在端口 28101, 所以发布后的静态地址为 ip:28101/pb/[projCode]/xx || ip:28101/public/[projCode]/xx',
      ]}/>
      <TipPanel title="中转站发布机制以及 SCP 路径说明, 「运维(Ops)须知」" type="normal" texts={[
        '中转服务: 部署 uke-web-server 到一台中转服务器上, 在该服务器上配置对应的目标服务器 ssh 配置, 配置路径为 ~/.ssh/config',
        'scp 机制: 从中转服务器 scp 资源压缩包 -> 目标服务器(存放压缩包路径为 /var/front-end-zip/), 在目标服务器进行 unzip 解压到部署路径(例如 /var/www/deploy/[projCode]/)',
        'SSH 配置说明: 根据 Host 字段获取 scp 目标名，Host 后可以用 # 写中文名词(只用于显示)，格式严格验证，例如 Host demoHost #测试地址',
      ]}/>
      <TipPanel title="关于 webhook 机制「开发(Dev)须知」" type="warm" texts={[
        '资源发布成功后，可以触发指定的 webhook，具体 webhook 的功能由对应的服务提供，uke-web-server 有提供对应的 webhook 机制',
        'webhook 可以触发 telegram 机器人，或者发送邮件'
      ]}/>
    </div>
  );
};

export default class Records extends Component {
  keyMapper = [
    {
      key: 'projName',
      title: '项目名',
      filter: (str, item, _, idx) => {
        return (
          <span className="link-btn" onClick={() => {
            this.showProjectDetail(item, idx, 'edit');
          }}>
            {str}
          </span>
        );
      }
    },
    {
      key: 'actions',
      title: '操作',
      filter: (_, item, __, idx) => {
        return (
          <div>
            <span className="link-btn mr10" onClick={e => this.showProjectDetail(item, idx, 'asset-list')}>资源列表</span>
            <span className="link-btn mr10" onClick={e => this.showProjectDetail(item, idx, 'upload')}>上传新资源</span>
            {/* <span className="link-btn" onClick={e => this.showProjectDetail(item, idx, 'edit')}>编辑项目</span><br/> */}
          </div>
        );
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
      filter: (collaboratorsObj) => {
        let collaborators = Object.keys(collaboratorsObj);
        let hasCollaborators = collaborators.length > 0;
        let collaboratorsDOM = hasCollaborators ? collaborators.join(',') : '-';
        return collaboratorsDOM;
      }
    },
    {
      key: 'collaboratorApplies',
      title: '申请协作者',
      filter: (applicants = [], item) => {
        let applicantDOM = applicants.map((applicant, idx) => {
          return (
            <p key={applicant + idx}>
              <span className="link-btn" onClick={e => {
                let ModalId = ShowGlobalModal({
                  title: `同意 ${applicant} 加入协作`,
                  width: 500,
                  showFuncBtn: false,
                  children: (
                    <ApprovePanel 
                      {...this.passProps()}
                      projId={item.id}
                      applicant={applicant}
                      onUpdated={e => {
                        this.queryData();
                        CloseGlobalModal(ModalId);
                      }}/>
                  )
                });
              }}>
                {applicant}
              </span>
            </p>
          );
        });
        return applicantDOM;
      }
    },
    {
      key: 'createdDate',
      title: '创建日期',
      datetime: true
    },
    // {
    //   key: 'host',
    //   title: '地址',
    //   filter: (str, item) => {
    //     let { host, projCode }
    //     return 
    //   }
    // },
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

  componentDidMount() {
    this.queryData();
  }

  getProject = (idx) => {
    return this.state.records[idx];
  }

  delProject = id => {
    if (this.submiting) return;
    this.submiting = true;
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

  handleSearch = e => {
    this.setState({
      searchValue: e.target.value
    });
  };

  getAssetsRecord = (idx) => {
    return this.state.records[idx];
  }

  pathFilter = (str) => {
    let defaultPath = '/assets';
    let [start, end] = str.split(defaultPath);
    return end ? '~' + defaultPath + end : start;
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
    });
  }

  showProjectDetail(targetItem, idx, type = 'edit') {
    const { projName } = targetItem;
    let ModalId = ShowGlobalModal({
      title: '项目 ' + projName + ' 管理',
      width: 900,
      // draggable: true,
      showFuncBtn: false,
      children: (
        <ProjectManager
          {...this.passProps()}
          defaultTab={type}
          onApplied={e => CloseGlobalModal(ModalId)}
          onClose={e => CloseGlobalModal(ModalId)}
          getProject={e => this.getProject(idx)}/>
      )
    });
  }

  passProps() {
    return {
      ...this.props,
      notify: this.notify,
      queryProject: this.queryData,
    };
  }

  create() {
    let ModalId = ShowGlobalModal({
      title: '创建项目',
      width: 900,
      showFuncBtn: false,
      children: (
        <CreateProjectHelper
          {...this.props}
          notify={this.notify}
          onCreatedProject={() => {
            this.queryData();
          }}/>
      )
    });
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
        <Loading loading={querying} inrow>
          <div className="project-list p10">
            <ConditionGenerator
              ref={e => this.conditionRef = e}
              conditionConfig={this.conditionOptions}>
              <Button icon="feather" className="btn theme flat" onClick={e => this.queryData()} text="查询"/>
            </ConditionGenerator>
            <div className="action-group">
              <Button
                text="创建项目"
                icon="plus"
                className="mr10"
                onClick={() => this.create()}/>
              <span 
                className="btn red"
                onClick={e => ShowGlobalModal({
                  width: 800,
                  title: '发布系统的使用手册',
                  children: <CompleteManual/>
                })}>
                查看使用手册
              </span>
            </div>
            <TableBody
              keyMapper={this.keyMapper}
              records={records}
              needCount={false}/>
          </div>
        </Loading>
      </div>
    );
  }
}
