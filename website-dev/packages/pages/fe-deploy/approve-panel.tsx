import React, { Component } from 'react';

import { FormLayout } from '@deer-ui/core/core/form-generator';
import { Call } from '@mini-code/base-func';
import { approveToJoinInProject } from './apis';
import ActionAgent from "../action-agent";

const activeMapper = {
  0: '否',
  1: '是',
};

export default class ApprovePanel extends ActionAgent {
  constructor(props) {
    super(props);

    this.formOptions = [
      {
        type: 'radio',
        ref: 'updatable',
        defaultValue: 1,
        title: '可否更新项目',
        values: activeMapper,
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

    this.formBtns = [
      {
        text: '审核',
        actingRef: 'updating',
        action: async (formRef, actingRef) => {
          const {
            projId, applicant, notify, onUpdated
          } = this.props;
          const agentAPI = this.reqAgent<{err: boolean}>(approveToJoinInProject, {
            actingRef
          });
          const approveRes = await agentAPI({ projId, applicant, ...formRef.value });
          notify('审核', !approveRes.err, approveRes.err);
          Call(onUpdated);
        }
      }
    ];
  }

  render() {
    return (
      <div className="approve-panel">
        <FormLayout
          {...this.state}
          formOptions={this.formOptions}
          formBtns={this.formBtns}/>
      </div>
    );
  }
}
