import React, { Component } from 'react';
import { FormGenerator, FormLayout, Tabs, Tab, TipPanel } from 'ukelli-ui';
import { createProject } from './apis';

export default class AddFEProject extends Component {
  formOptions = [
    {
      type: 'input',
      required: true,
      ref: 'projName',
      defaultValue: $GH.GenerteID(),
      title: '项目名称'
    },
    {
      type: 'input',
      ref: 'hook',
      title: 'web hook'
    },
    {
      type: 'customForm',
      getCustomFormControl: () => {
        return (
          <input
            type="file"
            accept="application/zip"
            name="zip"
            ref={e => (this._zip = e)}
          />
        )
      }
    }
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

  handleSuccess = () => {
    this.props.handleSuccess();
  };

  onCreateProj = (formValue) => {
    const {username} = this.props.userInfo;
    formValue.username = username;
    // console.log(formValue)
    createProject(formValue).then((res) => {
      // console.log(res)
      const { err } = res;
      if(!err) {
        // 创建项目成功后，跳转到第二步，上传资源
        this.setState({
          activeIdx: 1,
        });
      }
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
    const {
      isAddAsset,
      list,
      name,
      savePath,
      unzipPath,
      scpHost,
      scpTargetDir,
      scpDir
    } = this.props;
    const {activeIdx} = this.state;
    return (
      <div style={{ position: 'relative' }}>
        <TipPanel
          title="使用说明"
          texts={[
            '新建项目，只需要填写项目名称',
            'web hook 是项目资源发布成功后触发的，与 github 的 web hook 类似，用于回调通知',
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
            <span>上传资源文件</span>
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
