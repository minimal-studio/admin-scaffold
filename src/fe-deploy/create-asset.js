import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormLayout } from 'ukelli-ui';
import { uploadFile } from './apis';

export default class CreateAsset extends Component {
  static propTypes = {
    project: PropTypes.object,
    projId: PropTypes.string,
    onSuccess: PropTypes.func.isRequired,
  };

  state = {
    
  };

  constructor(props) {
    super(props);

    const { project, projId } = props;
    console.log(project)

    this.formOptions = [
      {
        ref: 'projId',
        type: 'hidden',
        defaultValue: projId
      },
      project ? {
        ref: 'isCallHook',
        type: 'radio',
        defaultValue: project.webhook ? '1' : '0',
        title: '触发 webhook',
        values: {
          '0': '否',
          '1': '是',
        }
      } : null,
      {
        ref: 'desc',
        type: 'textarea',
        title: '版本说明',
        required: true
      }
    ];
  }

  btnConfig = [
    {
      action: async (formRef) => {
        const { username, onSuccess } = this.props;
        const payload = {
          founder: username,
          ...formRef.value,
        };
        const formData = new FormData();
        formData.append('assetZip', this._zip.files[0]);
        Object.keys(payload).forEach(e => formData.append(e, payload[e]));
        let res = await uploadFile(formData);
        let isSuccess = false;
        if(!res.err && !!res.data) {
          onSuccess(res.data);
          isSuccess = true;
        }
        this.props.notify('上传', isSuccess)
      },
      text: '新增',
    }
  ];

  render() {
    return (
      <FormLayout formOptions={this.formOptions} 
        btnConfig={this.btnConfig}
        childrenBeforeBtn={(
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="control-label"/>
            <input
              type="file"
              accept="application/zip"
              name="zip"
              ref={c => (this._zip = c)}
            />
          </div>
        )}
        ref="formHelper"/>
    );
  }
}
