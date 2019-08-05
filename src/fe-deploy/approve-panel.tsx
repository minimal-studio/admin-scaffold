import React, { Component } from 'react';

import { FormLayout } from 'ukelli-ui/core/form-generator';
import { Call } from 'basic-helper';
import { approveToJoinInProject } from './apis';
import ActionAgent from "../action-agent";

const activeMapper = {
  0: '否',
  1: '是',
};

export default class ApprovePanel extends ActionAgent {
  formOptions = [
    {
      type: 'radio',
      ref: 'updatable',
      defaultValue: 1,
      title: '可否更新项目',
      values: activeMapper
    },
    {
      type: 'radio',
      ref: 'deletable',
      defaultValue: 1,
      title: '可否删除项目',
      values: activeMapper
    },
    {
      type: 'radio',
      ref: 'releasable',
      defaultValue: 1,
      title: '可否发布项目',
      values: activeMapper
    },
  ];

  btnConfig = [
    {
      text: '审核',
      actingRef: 'updating',
      action: async (formRef, actingRef) => {
        const {
          projId, applicant, notify, onUpdated
        } = this.props;
        const approveRes = await this.reqAgent(approveToJoinInProject, {
          actingRef
        })({ projId, applicant, ...formRef.value });
        notify('审核', !approveRes.err, approveRes.err);
        Call(onUpdated);
      }
    }
  ]

  render() {
    return (
      <div className="approve-panel">
        <FormLayout
          {...this.state}
          formOptions={this.formOptions}
          btnConfig={this.btnConfig}/>
      </div>
    );
  }
}
