import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormLayout } from '@deer-ui/core';
import { uploadFile } from './apis';
import ActionAgent from "../action-agent";

export default class CreateAsset extends ActionAgent {
  static propTypes = {
    project: PropTypes.object,
    projId: PropTypes.string,
    onSuccess: PropTypes.func.isRequired,
  };

  state = {
    uploading: false,
  };

  constructor(props) {
    super(props);

    const { projId, username } = props;

    this.formOptions = [
      {
        ref: 'projId',
        type: 'hidden',
        defaultValue: projId
      },
      {
        ref: 'username',
        type: 'hidden',
        defaultValue: username
      },
      {
        ref: 'desc',
        type: 'textarea',
        title: '版本说明',
        required: true
      }
    ];
  }

  // uploadFile = function* (formData) {
  //   yield this.setState({
  //     uploading: true
  //   });
  //   yield uploadFile(formData);
  //   yield this.setState({
  //     uploading: false
  //   });
  // }

  formBtns = [
    {
      actingRef: 'uploading',
      action: async (formRef, actingRef) => {
        const { username, onSuccess } = this.props;
        const payload = {
          founder: username,
          ...formRef.value,
        };
        const formData = new FormData();
        formData.append('assetZip', this._zip.files[0]);
        Object.keys(payload).forEach(e => formData.append(e, payload[e]));

        // let res = [...this.uploadFile(formData)];
        // console.log(object)

        // this.setState({
        //   uploading: true
        // });

        const res = await this.reqAgent(uploadFile, {
          actingRef
        })(formData);

        // this.setState({
        //   uploading: false
        // });

        let isSuccess = false;
        if (!res) return;
        if (!res.err && !!res.data) {
          onSuccess(res.data);
          isSuccess = true;
        }
        this.props.notify('上传', isSuccess, res.err);
      },
      text: '上传资源',
    }
  ];

  render() {
    return (
      <FormLayout formOptions={this.formOptions}
        {...this.state}
        formBtns={this.formBtns}
        childrenBeforeBtn={(
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="control-label"/>
            <input
              type="file"
              accept="application/zip"
              name="zip"
              ref={c => (this._zip = c)}/>
          </div>
        )}
        ref={e => this.formHelper = e}/>
    );
  }
}
