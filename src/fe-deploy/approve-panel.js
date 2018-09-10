import React, { Component } from 'react';

import { FormLayout } from 'ukelli-ui';
import { CallFunc } from 'basic-helper';
// import FormBasic from '../actions-basic/action-form-basic';
import { approveToJoinInProject } from './apis';

const activeMapper = {
  0: '否',
  1: '是',
}

export default class ApprovePanel extends Component {
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
      action: async formRef => {
        let { projId, applicant, notify, onUpdated } = this.props;
        let approveRes = await approveToJoinInProject({projId, applicant, ...formRef.value})
        notify('审核', !approveRes.err, approveRes.err);
        CallFunc(onUpdated)();
      }
    }
  ]
  render() {
    return (
      <div className="approve-panel">
        <FormLayout
          formOptions={this.formOptions}
          btnConfig={this.btnConfig}/>
      </div>
    )
  }
}