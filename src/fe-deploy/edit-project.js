import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CallFunc } from 'basic-helper';
import { FormLayout, Loading } from 'ukelli-ui';

import { updatePropject, delPropject } from './apis';
import wrapProjectFormOptions from './project-form';

export default class EditProject extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    onUpdated: PropTypes.func,
  }
  state = {
    querying: true
  }
  constructor(props) {
    super(props);
  }

  async initData() {
    const { getProject, username } = this.props;
    const project = getProject();
    this.formOptions = await wrapProjectFormOptions(project);

    this.setState({
      querying: false
    });
  }

  componentDidMount() {
    this.initData();
  }

  updateProject = async (nextProject) => {
    let updateRes = await updatePropject(nextProject);
    let resErr = updateRes.err;
    this.props.notify('更新项目', !resErr, resErr);
    if(!resErr) {
      CallFunc(this.props.onUpdated)();
    }
  }

  deleteProject = async () => {
    const { username, project } = this.props;
    let delRes = await delPropject({
      username,
      projId: project.id
    });
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
    const { querying } = this.state;
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
      <Loading loading={querying}>
        {
          querying ? null : (
            <FormLayout
              formOptions={this.formOptions}
              childrenAfterForm={deleteBtn}
              btnConfig={this.btnConfig}/>
          )
        }
      </Loading>
    );
  }
}
