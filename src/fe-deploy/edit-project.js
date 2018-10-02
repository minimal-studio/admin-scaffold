import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormLayout, Loading, ShowGlobalModal } from 'ukelli-ui';

import { updatePropject, delPropject } from './apis';
import wrapProjectFormOptions from './project-form';

export default class EditProject extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    onUpdated: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  }
  static defaultProps = {
    onUpdated: () => {}
  }
  state = {
    querying: true
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
  ];

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initData();
  }

  async initData() {
    const { getProject } = this.props;
    const project = getProject();
    this.formOptions = await wrapProjectFormOptions(project);

    this.setState({
      querying: false
    });
  }

  updateProject = async (nextProject) => {
    let updateRes = await updatePropject(nextProject);
    let resErr = updateRes.err;
    this.props.notify('更新项目', !resErr, resErr);
    if(!resErr) {
      this.props.onUpdated();
    }
  }

  deleteProject = async () => {
    const { username, project, onClose, queryProject } = this.props;

    ShowGlobalModal({
      title: '确定删除项目？',
      type: 'confirm',
      width: 300,
      confirmText: '一旦删除，不可恢复, 同时删除相关的所有资源.',
      onConfirm: async isSure => {
        if(!isSure) return;

        let delRes = await delPropject({
          username,
          projId: project.id
        });

        this.props.notify('删除', !delRes.err, delRes.err);

        if(!delRes.err) {
          onClose();
          queryProject();
        }
      }
    });
  }

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
    );
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
