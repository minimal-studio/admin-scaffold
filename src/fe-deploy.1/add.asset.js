import React, { Component } from 'react';
import { FormGenerator, Popover, TipPanel } from 'ukelli-ui';
import { getData } from './fetchData';

export default class AddAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: ''
    };
  }

  componentDidMount() {
    this.refs.formHelper.refs.file_path.focus();
  }

  add = e => {
    e.preventDefault();
    const { name, path, html_path, desc } = this.refs.formHelper.value;
  };

  refetch() {
    // return fetch()
  }

  render() {
    const { error } = this.state;
    const formOptions = [
      {
        ref: 'file_path',
        type: 'input',
        title: '资源路径',
        required: true
      },
      {
        ref: 'html_path',
        type: 'file',
        title: '上传资源',
        required: true
      },
      {
        ref: 'desc',
        type: 'textarea',
        title: '更新记录',
        required: true
      }
    ];
    return (
      <div>
        <form
          className="horizontal-form"
          style={{ marginLeft: 10, marginRight: 10 }}
          onSubmit={this.add}
          ref={c => (this._form = c)}
        >
          <FormGenerator formOptions={formOptions} ref="formHelper">
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="control-label" />
              <button type="submit" className="btn flat theme">
                保存
              </button>
              <Popover
                relativeElem={{ offsetTop: 0, offsetLeft: 230 }}
                open={error.length > 0}
                className="item-popover"
                onRequestClose={() => {
                  this.setState({ error: '' });
                }}
                position={'right'}
              >
                <span
                  style={{ display: 'inline-block', color: 'red', padding: 6 }}
                >
                  {error}
                </span>
              </Popover>
            </div>
          </FormGenerator>
        </form>
      </div>
    );
  }
}
