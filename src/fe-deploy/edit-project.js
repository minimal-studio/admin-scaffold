import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormLayout} from 'ukelli-ui';
import { updatePropject, delPropject } from './apis';

export default class EditProject extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    onUpdated: PropTypes.func,
  }
  constructor(props) {
    super(props);

    const { project, username } = props;
    
    this.formOptions = [
      {
        type: 'input',
        required: true,
        ref: 'projName',
        defaultValue: project.projName,
        title: '项目名称'
      },
      {
        type: 'input',
        required: true,
        ref: 'projCode',
        defaultValue: project.projCode,
        title: '项目代号'
      },
      {
        type: 'hidden',
        ref: 'projId',
        defaultValue: project.id
      },
      {
        type: 'hidden',
        ref: 'username',
        defaultValue: username
      },
      {
        type: 'input',
        ref: 'projDesc',
        defaultValue: project.projDesc,
        title: '项目介绍'
      },
      {
        type: 'input',
        ref: 'webhook',
        title: 'web hook',
        defaultValue: project.webhook,
        desc: '开发人员填写'
      },
    ];
  }

  updateProject = (nextProject) => {
    updatePropject(nextProject);
  }

  deleteProject = async () => {
    const { username, project } = this.props;
    let delRes = await delPropject({
      username,
      projId: project.id
    });
    console.log(delRes)
  }

  btnConfig = [
    {
      text: '更新',
      action: (formRef) => {
        let {isPass} = formRef.checkForm();
        if(isPass) {
          this.updateProject(formRef.value);
        }
      }
    },
  ]

  render() {
    const deleteBtn = (
      <div className="text-center">
        <hr/>
        <p>
          <span className="btn red flat" onClick={e => this.deleteProject()}>删除该项目</span>
        </p>
        <p className="form-tip">不可恢复, 同时删除相关的所有资源</p>
      </div>
    )
    return (
      <div>
        <FormLayout
          formOptions={this.formOptions}
          childrenAfterForm={deleteBtn}
          btnConfig={this.btnConfig}/>
      </div>
    );
  }
}
