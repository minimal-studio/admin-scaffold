import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGenerator, FormLayout, Tabs, Tab, TipPanel } from 'ukelli-ui';

import CreateAsset from './create-asset';
import AssetsManager from './assets-manager';
import { createProject } from './apis';
import { CallFunc } from 'basic-helper/basic';

export default class CreateProject extends Component {
  static propTypes = {
    onCreatedProject: PropTypes.func,
  }
  formOptions = [
    {
      type: 'input',
      required: true,
      ref: 'projName',
      title: '项目名称'
    },
    {
      type: 'input',
      required: true,
      ref: 'projCode',
      title: '项目代号'
    },
    {
      type: 'input',
      ref: 'projDesc',
      title: '项目介绍'
    },
    {
      type: 'input',
      ref: 'webhook',
      title: 'web hook',
      desc: '开发人员填写'
    },
  ];

  state = {
    activeIdx: 0
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.refs.formHelper.refs.name && this.refs.formHelper.refs.name.focus();
  }

  onCreateProj = (formValue) => {
    const { username, notify, onCreatedProject } = this.props;
    formValue.username = username;
    // console.log(formValue)
    createProject(formValue).then((res) => {
      // console.log(res)
      const { err, projId } = res;
      if(!err) {
        // 创建项目成功后，跳转到第二步，上传资源
        this.setState({
          activeIdx: 1,
          prevProjId: projId
        });

        CallFunc(onCreatedProject)();
      } else {
        notify('创建项目', false, err)
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
    const { activeIdx, prevProjId } = this.state;
    return (
      <div>
        <TipPanel
          title="使用说明"
          texts={[
            '新建项目，只需要填写项目名称',
            'web hook 是项目资源发布成功后触发的，与 GitHub 的 web hook 类似，用于回调通知',
          ]}
        />
        <Tabs activeTabIdx={activeIdx} stepMode={true}>
          <Tab label="1. 创建项目">
            <FormLayout 
              formOptions={this.formOptions} 
              btnConfig={this.btnConfig}
              ref="formHelper"/>
          </Tab>
          <Tab label="2. 上传资源文件">
            <CreateAsset {...this.props} 
              projId={prevProjId} 
              onSuccess={assetData => this.onCreatedAsset(assetData)}/>
          </Tab>
          <Tab label="3. 资源管理">
            <AssetsManager {...this.props} projId={prevProjId}/>
          </Tab>
        </Tabs>
        <form
          style={{ marginLeft: 10, marginRight: 10 }}
          onSubmit={this.add}
          ref={c => (this._form = c)}>
        </form>
      </div>
    );
  }
}
