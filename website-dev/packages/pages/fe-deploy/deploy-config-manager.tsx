import React, { Component } from 'react';
import {
  Loading, Table, Notify, ShowModal, Button, Tabs, Tab,
  ConditionGenerator, CloseGlobalModal, Alert, FormLayout
} from '@deer-ui/core';
import { GenerteID } from '@mini-code/base-func';
import ActionAgent from "../action-agent";
import {
  getSShConfig, addSShConfig, updateSShConfig, delSShConfig
} from './apis';
import RecordRender from '../template-engine/for-report/records-template';
import WrapDeployForms from './deploy-forms';
import { TableRecords } from '@deer-ui/core/core/record-render/table-body';

const ConfigFac = (api, title) => class C extends ActionAgent {
  state = {
    ...this.state,
    ready: false,
    formOptions: []
  }

  formBtns = [
    {
      text: title,
      actingRef: 'adding',
      action: (formRef, actingRef) => {
        const isSuccess = this.reqAgent(api, {
          actingRef
        })(formRef.value);
        if (isSuccess) this.props.onSuccessed();
      }
    }
  ]

  componentDidMount() {
    this.getFormOptions();
  }

  async getFormOptions() {
    const formOptions = await WrapDeployForms(this.props.target);
    this.setState({
      formOptions,
      ready: true,
    });
  }

  render() {
    const { ready, formOptions } = this.state;
    return (
      <Loading loading={!ready}>
        <FormLayout
          formBtns={this.formBtns}
          formOptions={formOptions} />
      </Loading>
    );
  }
};

const EditConfig = ConfigFac(updateSShConfig, '编辑');
const AddConfig = ConfigFac(addSShConfig, '新增');

export default class DeployConfigManager extends ActionAgent {
  state = {
    ...this.state,
    records: [],
    querying: true
  }

  columns: TableRecords = [
    {
      key: 'sshHost',
      title: 'SSH Host',
    },
    // {
    //   key: 'alias',
    //   title: '别名',
    // },
    {
      key: 'deployPath',
      title: '部署路径',
    },
    {
      key: 'desc',
      title: '用途',
    },
    {
      key: 'action',
      title: '操作',
      filter: (_, item) => {
        return (
          <React.Fragment>
            <span className="link-btn mr10" onClick={(e) => {
              const ModalId = ShowModal({
                showFuncBtn: false,
                title: '编辑',
                children: (
                  <EditConfig target={item} onSuccessed={(e) => {
                    this.queryData();
                    CloseGlobalModal(ModalId);
                  }} />
                )
              });
            }}>
              编辑
            </span>
            <span className="link-btn" onClick={(e) => {
              const ModalId = ShowModal({
                title: '删除',
                type: 'confirm',
                width: 300,
                confirmText: '确定删除？',
                onConfirm: async (isSure) => {
                  if (!isSure) return;
                  const { err } = await delSShConfig(item);
                  !err && CloseGlobalModal(ModalId);
                  this.queryData();
                }
              });
            }}>
              删除
            </span>
          </React.Fragment>
        );
      }
    },
  ]

  actionsBtns = [
    {
      action: () => {
        const ModalId = ShowModal({
          showFuncBtn: false,
          title: '新增配置',
          children: (
            <AddConfig onSuccessed={(e) => {
              this.queryData();
              CloseGlobalModal(ModalId);
            }} />
          )
        });
      },
      text: '新增配置',
      color: 'green'
    }
  ]

  queryData = () => {
    this.reqAgent(getSShConfig, {
      actingRef: 'querying',
      after: (resData) => {
        return {
          records: resData.data || []
        };
      }
    })();
  }

  // componentDidMount() {
  //   this.queryData();
  // }
  render() {
    const { querying, records } = this.state;
    return (
      <div className="card-content">
        <Alert title="使用说明"
          needToolTip
          n="angle-up"
          defaultShow={false}
          texts={[
            '为了更好的管理发布机器和部署路径',
            '统一在 ~/.ssh/config 中配置',
            '系统会分析 Host 后面第一个注释 #xx 作为 ssh 描述',
            '将会在新增前端资源时使用该配置',
          ]} />
        <RecordRender
          height="60vh"
          onQueryData={this.queryData}
          querying={querying}
          actionBtns={this.actionsBtns}
          hideFloatable
          columns={this.columns}
          records={records}/>
        {/* <Tabs>
          <Tab label="新增配置">
            <FormLayout
              formOptions={this.formOptions} />
          </Tab>
          <Tab label="配置列表">
            <FormLayout
              formOptions={this.formOptions} />
          </Tab>
        </Tabs> */}
      </div>
    );
  }
}
