import React, { Component } from 'react';
import {
  Notify, FormLayout
} from 'ukelli-ui';
import { CallFunc } from 'basic-helper';

import { release, rollback } from './apis';
import { versionFilter } from './filter';

const getReleaseFormOptions = (project, asset, canRollback = false) => {
  const { webhook, scpTargetHost } = project;
  let formOptions = [
    webhook ? {
      ref: 'isCallHook',
      type: 'radio',
      defaultValue: webhook ? 1 : 0,
      isNum: true,
      title: '触发 webhook',
      desc: 'web hook ' + webhook,
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
      desc: 'scp target ' + scpTargetHost,
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

export default class ReleaseComfirm extends Component {
  state = {
    releasing: false
  }
  constructor(props) {
    super(props);

    const { project, asset, canRollback, username } = props;
    let { id, belongto } = asset;
    let { releaseRef } = project;

    this.formOptions = getReleaseFormOptions(project, asset, canRollback);

    this.btnConfig = [
      {
        action: async (formRef) => {
          this.setState({
            releasing: true
          });
          let isSuccess;
          let releaseRes = {};
          let formValue = formRef.value;

          if(formValue.isExecScp) Notify({config: {
            title: 'SCP 同步中，这需要花点时间，请稍后',
            id: '1'
          }});

          if(canRollback) {
            releaseRes = await rollback({
              ...formValue,
              assetId: id,
              prevAssetId: releaseRef,
              projId: belongto,
              username,
            });
          } else {
            releaseRes = await release({
              ...formValue,
              assetId: id,
              projId: belongto,
              username,
            });
          }
          isSuccess = !!releaseRes && !releaseRes.err;
          this.setState({
            releasing: false
          });
          CallFunc(this.props.onReleased)(isSuccess);
        },
        actingRef: 'releasing',
        text: '发布'
      },
      {
        action: () => {
          CallFunc(this.props.onCancel)();
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
          btnConfig={this.btnConfig}/>
      </div>
    );
  }
}
