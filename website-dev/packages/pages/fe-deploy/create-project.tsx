import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Loading, FormLayout, Tabs, Tab, Alert, Steps, GlobalPopover, Radio
} from '@deer-ui/core';

import { Call } from '@mini-code/base-func';
import CreateAsset from './create-asset';
import AssetsManager from './assets-manager';
import { createProject, getSShConfig } from './apis';
import wrapProjectFormOptions from './project-form';
import ActionAgent from "../action-agent";

export default class CreateProject extends ActionAgent {
  static propTypes = {
    onCreatedProject: PropTypes.func,
  }

  state = {
    ...this.state,
    activeIdx: 0,
    querying: true,
    createdProj: {},
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initData();
  }

  async initData() {
    this.formOptions = await wrapProjectFormOptions();
    const hostConfigRes = (await getSShConfig() || {}).data;
    // let hostConfigData = {};
    // hostConfigRes.forEach(item => hostConfigData[item.sshHost] = item);
    this.setState({
      sshConfig: hostConfigRes,
      querying: false
    });
  }

  onCreateProj = async (formValue, actingRef) => {
    const { notify, onCreatedProject } = this.props;
    const agentOptions = {
      actingRef,
      after: (res) => {
        const { err } = res;
        if (!err) {
          Call(onCreatedProject);
        } else {
          notify('创建项目', false, err);
        }
        return err ? {} : {
          activeIdx: 1,
          createdProj: res.data || {}
        };
      }
    };
    await this.reqAgent(createProject, agentOptions)(formValue);
  }
  // async getSSHConfig() {
  //   let hostConfigRes = await getSShConfig();
  //   // console.log(hostConfigRes)

  // }
  onCreatedAsset(assetData) {
    this.setState({
      activeIdx: 2,
      prevAssetData: assetData
    });
  }

  formBtns = [
    {
      action: (formRef, actingRef) => {
        const checkRes = formRef.checkForm();
        if (checkRes.isPass) this.onCreateProj(formRef.value, actingRef);
      },
      actingRef: 'creating',
      text: '新增',
    }
  ]

  render() {
    const {
      activeIdx, createdProj, querying, sshConfig
    } = this.state;
    return (
      <div>
        <Alert
          title="使用说明"
          texts={[
            '新建项目，只需要填写项目名称',
            'web hook 是项目资源发布成功后触发的，与 GitHub 的 web hook 类似，用于回调通知',
          ]}/>
        <Loading loading={querying}>
          <div>
            <Steps activeIdx={activeIdx} className="p10">
              <Steps.Step title="创建项目"></Steps.Step>
              <Steps.Step title="上传资源文件"></Steps.Step>
              <Steps.Step title="资源管理"></Steps.Step>
            </Steps>
            <Tabs activeTabIdx={activeIdx}>
              <Tab label="创建项目">
                <FormLayout
                  formOptions={this.formOptions}
                  ref={(e) => {
                    if (!e) return;
                    this.formRef = e.formHelper;
                  }}
                  onChange={(values, ref, val) => {
                    let targetDOM = '';
                    if (ref !== 'scpTargetHost') return;
                    try {
                      targetDOM = this.formRef._refs.scpTargetDir.iconInput;
                    } catch (e) {
                      console.log(e);
                    }
                    const targetValues = [...sshConfig].filter(item => item.sshHost === val);
                    const ideaTip = {};
                    for (const item of targetValues) {
                      ideaTip[item.deployPath] = `${item.desc}~${item.deployPath}`;
                    }
                    const hasIdea = targetValues.length > 0;
                    if (hasIdea) {
                      GlobalPopover.show({
                        elem: targetDOM,
                        props: {
                          style: {
                            zIndex: 1111,
                            width: 400,
                          }
                        },
                        children: (
                          <div className="p10">
                            <h4>部署路径建议</h4>
                            <div className="p10">
                              <Radio values={ideaTip}
                                onChange={val => this.selectedDeploy = val} />
                            </div>
                            <span className="btn theme"
                              onClick={(e) => {
                                GlobalPopover.close();
                                this.formRef.changeValues({
                                  scpTargetDir: this.selectedDeploy
                                });
                              }}>
                              确定
                            </span>
                          </div>
                        )
                      });
                    }
                    // let targetPath = '';
                    // if(sshConfig[val]) {
                    //   targetPath = sshConfig[val].deployPath || '';
                    // }
                    // this.formRef.changeValues({
                    //   scpTargetDir: targetPath
                    // });
                  }}
                  formBtns={this.formBtns}/>
              </Tab>
              <Tab label="上传资源文件">
                <CreateAsset {...this.props}
                  projId={createdProj.id}
                  onSuccess={assetData => this.onCreatedAsset(assetData)}/>
              </Tab>
              <Tab label="资源管理">
                <AssetsManager
                  releasable
                  getProject={e => createdProj}
                  {...this.props} projId={createdProj.id}/>
              </Tab>
            </Tabs>
            <hr/>
            <div className="p10 text-center">
              <span className="btn red " onClick={e => this.props.close()}>关闭</span>
            </div>
          </div>
        </Loading>
      </div>
    );
  }
}
