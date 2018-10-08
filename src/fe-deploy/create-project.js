import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loading, FormLayout, Tabs, Tab, TipPanel } from 'ukelli-ui';

import { Call } from 'basic-helper';
import CreateAsset from './create-asset';
import AssetsManager from './assets-manager';
import { createProject } from './apis';
import wrapProjectFormOptions from './project-form';

export default class CreateProject extends Component {
  static propTypes = {
    onCreatedProject: PropTypes.func,
  }

  state = {
    activeIdx: 0,
    querying: true,
    createdProj: {},
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initData();
    // this.refs.formHelper.refs.name && this.refs.formHelper.refs.name.focus();
  }

  async initData() {
    this.formOptions = await wrapProjectFormOptions();

    this.setState({
      querying: false
    });
  }

  onCreateProj = (formValue) => {
    const { username, notify, onCreatedProject } = this.props;
    formValue.username = username;
    // console.log(formValue)
    createProject(formValue).then((res) => {
      // console.log(res)
      const { err, data } = res;
      if(!err) {
        // 创建项目成功后，跳转到第二步，上传资源
        this.setState({
          activeIdx: 1,
          createdProj: data
        });

        Call(onCreatedProject);
      } else {
        notify('创建项目', false, err);
      }
    });
  }
  onCreatedAsset(assetData) {
    this.setState({
      activeIdx: 2,
      prevAssetData: assetData
    });
  }

  btnConfig = [
    {
      action: (formRef) => {
        // console.log(formRef)
        let checkRes = formRef.checkForm();
        // console.log()
        if(checkRes.isPass) this.onCreateProj(formRef.value);
      },
      text: '新增',
    }
  ]

  render() {
    const { activeIdx, createdProj, querying } = this.state;
    return (
      <div>
        <TipPanel
          title="使用说明"
          texts={[
            '新建项目，只需要填写项目名称',
            'web hook 是项目资源发布成功后触发的，与 GitHub 的 web hook 类似，用于回调通知',
          ]}
        />
        <Loading loading={querying} inrow={false}>
          {
            querying ? null : (
              <Tabs activeTabIdx={activeIdx} stepMode={true}>
                <Tab label="1. 创建项目">
                  <FormLayout 
                    formOptions={this.formOptions} 
                    btnConfig={this.btnConfig}
                    ref="formHelper"/>
                </Tab>
                <Tab label="2. 上传资源文件">
                  <CreateAsset {...this.props} 
                    projId={createdProj.id} 
                    onSuccess={assetData => this.onCreatedAsset(assetData)}/>
                </Tab>
                <Tab label="3. 资源管理">
                  <AssetsManager
                    releasable={true}
                    getProject={e => createdProj}
                    {...this.props} projId={createdProj.id}/>
                </Tab>
              </Tabs>
            )
          }
        </Loading>
      </div>
    );
  }
}
