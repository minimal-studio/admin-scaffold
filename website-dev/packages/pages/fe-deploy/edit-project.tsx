import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormLayout, Loading, ShowModal, Button
} from '@deer-ui/core';

import { updatePropject, delPropject } from './apis';
import wrapProjectFormOptions from './project-form';
import ActionAgent from "../action-agent";

export default class EditProject extends ActionAgent {
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
    ...this.state,
    querying: true
  }

  formBtns = [
    {
      text: '更新',
      actingRef: 'updating',
      action: (formRef, actingRef) => {
        const { isPass } = formRef.checkForm();
        if (isPass) {
          this.updateProject(formRef.value, actingRef);
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

  updateProject = async (nextProject, actingRef) => {
    const postData = nextProject;
    const agentOptions = {
      actingRef,
    };
    const updateRes = await this.reqAgent(updatePropject, agentOptions)(postData);
    const resErr = updateRes.err;
    this.props.notify('更新项目', !resErr, resErr);
    if (!resErr) {
      this.props.onUpdated();
    }
  }

  deleteProject = async (actingRef) => {
    const {
      username, project, onClose, queryProject
    } = this.props;

    ShowModal({
      title: '确定删除项目？',
      type: 'confirm',
      width: 300,
      confirmText: '一旦删除，不可恢复, 同时删除相关的所有资源.',
      onConfirm: async (isSure) => {
        if (!isSure) return;

        const delRes = await this.reqAgent(delPropject, {
          actingRef
        })({
          username,
          projId: project.id
        });

        this.props.notify('删除', !delRes.err, delRes.err);

        if (!delRes.err) {
          onClose();
          queryProject();
        }
      }
    });
  }

  render() {
    const { querying, deleting, updating } = this.state;
    const deleteBtn = (
      <div className="text-center">
        <hr/>
        <p>
          <Button
            text="删除该项目"
            className="btn red flat"
            disabled={deleting}
            onClick={e => this.deleteProject('deleting')}/>
        </p>
        <p className="form-tip">不可恢复, 同时删除相关的所有资源</p>
      </div>
    );
    return (
      <Loading loading={querying}>
        <FormLayout
          formOptions={this.formOptions}
          updating={updating}
          childrenAfterForm={deleteBtn}
          formBtns={this.formBtns}/>
      </Loading>
    );
  }
}
