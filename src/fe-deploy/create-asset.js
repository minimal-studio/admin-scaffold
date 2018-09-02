import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormGenerator, FormLayout, Popover, TipPanel } from 'ukelli-ui';
import { uploadFile } from './apis';

export default class CreateAsset extends Component {
  static propTypes = {
    projId: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
  };
  formOptions = [
    {
      ref: 'projId',
      type: 'hidden',
      defaultValue: this.props.projId
    },
    {
      ref: 'desc',
      type: 'textarea',
      title: '版本说明',
      required: true
    }
  ];

  state = {
    
  };

  constructor(props) {
    super(props);
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
