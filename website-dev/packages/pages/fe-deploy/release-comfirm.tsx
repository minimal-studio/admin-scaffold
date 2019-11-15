import React, { Component } from 'react';
import {
  Notify, FormLayout
} from '@deer-ui/core';
import { Call } from '@mini-code/base-func';

import { release, rollback } from './apis';
import { versionFilter } from './filter';
import ActionAgent from "../action-agent";

const getReleaseFormOptions = (project, asset, canRollback = false) => {
  const { webhook, scpTargetHost } = project;
  const formOptions = [
    webhook ? {
      ref: 'isCallHook',
      type: 'radio',
      defaultValue: webhook ? 1 : 0,
      isNum: true,
      title: '触发 webhook',
      desc: `web hook ${webhook}`,
      values: {
        0: '否',
        1: '是',
      }
    } : null,
    scpTargetHost ? {
      ref: 'isExecScp',
      type: 'radio',
      defaultValue: scpTargetHost ? 1 : 0,
      isNum: true,
      title: '触发 SCP',
      desc: `scp target ${scpTargetHost}`,
      values: {
        0: '否',
        1: '是',
      }
    } : null,
  ].concat(!canRollback ? [
    {
      ref: 'note',
      type: 'text',
      defaultValue: asset.desc,
      title: '更新内容',
    },
  ] : [
    {
      ref: 'rollbackNote',
      type: 'textarea',
      title: '回滚原因',
    }
  ]);
  return formOptions;
};

export default class ReleaseComfirm extends ActionAgent {
  state = {
    releasing: false
  }

  constructor(props) {
    super(props);

    const {
      project, asset, canRollback, username
    } = props;
    const { id, belongto } = asset;
    const { releaseRef } = project;

    this.formOptions = getReleaseFormOptions(project, asset, canRollback);

    this.formBtns = [
      {
        action: async (formRef, actingRef) => {
          let isSuccess;
          let releaseRes = {};
          const formValue = formRef.value;

          if (formValue.isExecScp) {
            Notify({
              config: {
                title: 'SCP 同步中，完成后系统会在通知大家的.',
                id: '1'
              }
            });
          }

          if (canRollback) {
            releaseRes = await this.reqAgent(rollback, {
              actingRef
            })({
              ...formValue,
              assetId: id,
              prevAssetId: releaseRef,
              projId: belongto,
              username,
            });
          } else {
            releaseRes = await this.reqAgent(release, {
              actingRef
            })({
              ...formValue,
              assetId: id,
              projId: belongto,
              username,
            });
          }
          isSuccess = !!releaseRes && !releaseRes.err;
          Call(this.props.onReleased, isSuccess);
        },
        actingRef: 'releasing',
        text: '发布'
      },
      {
        action: () => {
          Call(this.props.onCancel);
        },
        text: '取消',
        className: 'default'
      },
    ];
  }

  render() {
    const { asset } = this.props;
    return (
      <div className="text-center">
        <h3>确定发布 {versionFilter(asset.version)} ?</h3>
        <FormLayout
          {...this.state}
          formOptions={this.formOptions}
          formBtns={this.formBtns}/>
      </div>
    );
  }
}
