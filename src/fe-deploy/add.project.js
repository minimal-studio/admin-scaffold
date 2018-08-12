import React, { Component } from 'react';
import { FormGenerator, Popover, Modal, TipPanel } from 'ukelli-ui';
import { getData, createProject, getHostList } from './fetchData';

let _id = 0;
export default class AddFEProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      btnTxt: '保存',
      scp_list: [],
      successModal: false,

      arr: [],
      old_arr: this.returnOldArr()
    };
  }

  componentDidMount() {
    this.refs.formHelper.refs.name && this.refs.formHelper.refs.name.focus();

    getHostList().then(res => {
      this.scp_list = res.data;
      this.setState({
        scp_list: res.data.map(item => item.Host)
      });
    });
  }

  add = e => {
    e.preventDefault();
    if (this.submiting) return;
    const {notify} = this.props;
    this.setState({ btnTxt: '正在保存...' });
    const {
      name,
      save_path,
      unzip_path,
      scp_host,
      scp_dir,
      scp_target_dir,
      is_old
    } = this.refs.formHelper.value;
    let error_msgs = [];
    this.state.arr.forEach(item => {
      if (error_msgs.length > 0) return;
      const cur_form = this.refs[`formHelper-${item.id}`].value;
      if (!cur_form.name) {
        error_msgs.push('新添加环境项目名称必须填写');
      } else if (!cur_form.unzip_path) {
        error_msgs.push('新添加环境解压路径必须填写');
      } else if (
        !(
          (!cur_form.scp_host &&
            !cur_form.scp_dir &&
            !cur_form.scp_target_dir) ||
          !!(cur_form.scp_host && cur_form.scp_dir && cur_form.scp_target_dir)
        )
      ) {
        error_msgs.push(
          '新添加环境: scp_host, scp_dir, scp_target_dir 必须填写'
        );
      } else {
      }
    });

    if (error_msgs.length > 0) {
      this.setState({ btnTxt: '保存', error: error_msgs.join('') });
      return;
    }

    this.submiting = true;
    const scpHost = is_old
      ? scp_host ? scp_host : ''
      : this.scp_list && this.scp_list[scp_host]
        ? this.scp_list[scp_host].Host
        : '';
    createProject(
      this.props.id || null,
      name,
      save_path,
      unzip_path,
      this._zip,
      this._desc.value,
      scpHost,
      scp_dir ? scp_dir : '',
      scp_target_dir ? scp_target_dir : ''
    )
      .then(res => {
        const uploaded = res.data.filename;
        let new_arr = this.state.arr;
        if (this.state.old_arr) {
          new_arr = this.state.old_arr.concat(new_arr);
        }

        return new_arr.reduce((cur, item) => {
          return cur.then(() => {
            const current_post = this.refs[`formHelper-${item.id}`].value;
            return createProject(
              res.data.id || null,
              current_post.name,
              save_path,
              current_post.unzip_path,
              uploaded,
              this._desc.value,
              item.is_old
                ? current_post.scp_host ? current_post.scp_host : ''
                : this.scp_list && this.scp_list[current_post.scp_host]
                  ? this.scp_list[current_post.scp_host].Host
                  : '',
              current_post.scp_dir && current_post.scp_target_dir
                ? current_post.scp_dir
                : '',
              current_post.scp_dir && current_post.scp_target_dir
                ? current_post.scp_target_dir
                : '',
              uploaded
            );
          });
        }, Promise.resolve());
      })
      .then(res => {
        this.handleSuccess();
        return 1;
      })
      .catch(e => {
        this.submiting = false;
        this.setState({
          btnTxt: '保存',
          // error: '新环境添加失败：' + (e.join ? e.join(';') : e + '')
        });
        notify('新环境添加失败：' + (e.join ? e.join(';') : e + ''), false)
      });
  };

  addExternal = () => {
    const { isAddAsset, name, savePath, unzipPath } = this.props;
    const { error, btnTxt, scp_list, arr, old_arr } = this.state;
    const type = 'input';
    _id++;
    this.setState({
      arr: [
        ...arr,
        {
          id: _id,
          arr: [
            {
              ref: 'name',
              type,
              title: '项目名称',
              required: true
            },
            {
              ref: 'unzip_path',
              type,
              title: '解压路径',
              required: true
            },
            {
              ref: 'scp_host',
              type: 'radio',
              title: 'scp 主机',
              values: scp_list,
              required: false
            },
            {
              ref: 'scp_dir',
              type,
              title: 'scp 路径',
              required: false
            },
            {
              ref: 'scp_target_dir',
              type,
              title: 'scp 目标路径',
              required: false
            }
          ]
        }
      ]
    });
  };

  returnOldArr = () => {
    let { list, name } = this.props;

    list = !list ? [] : list.filter(item => item.name != name);
    let type = 'text';
    return list.map(item => {
      _id++;
      return {
        id: _id,
        is_old: true,
        arr: [
          {
            ref: 'name',
            type,
            title: '项目名称',
            defaultValue: item.name
          },
          {
            ref: 'unzip_path',
            type,
            title: '解压路径',
            defaultValue: item.unzip_path
          },
          {
            ref: 'scp_host',
            type: 'hidden',
            title: 'scp 主机',
            defaultValue: item.scp_host
          },
          {
            ref: 'scp_dir',
            type: 'hidden',
            title: 'scp 路径',
            defaultValue:
              item.scp_dir && item.scp_target_dir ? item.scp_dir : ''
          },
          {
            ref: 'scp_target_dir',
            type: 'hidden',
            title: 'scp 目标路径',
            defaultValue:
              item.scp_dir && item.scp_target_dir ? item.scp_target_dir : ''
          }
        ]
      };
    });
  };

  delEnv = id => {
    this.setState({
      arr: this.state.arr.filter((item, idx) => id != item.id)
    });
  };

  handleSuccess = () => {
    this.props.handleClose();
    this.props.handleSuccess();
  };

  render() {
    const { error, btnTxt, scp_list, arr, old_arr } = this.state;
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
    const type = isAddAsset ? 'text' : 'input';
    const formOptions = isAddAsset
      ? [
          {
            ref: 'name',
            type,
            title: '项目名称',
            defaultValue: name
          },
          {
            ref: 'save_path',
            type,
            title: '存储路径',
            defaultValue: savePath
          },
          {
            ref: 'unzip_path',
            type,
            title: '解压路径',
            defaultValue: unzipPath
          },
          {
            ref: 'scp_host',
            type: 'hidden',
            title: 'scp 主机',
            defaultValue: scpHost
          },
          {
            ref: 'scp_dir',
            type: 'hidden',
            title: 'scp 目录',
            defaultValue: scpHost && scpDir ? scpDir : ''
          },
          {
            ref: 'scp_target_dir',
            type: 'hidden',
            title: 'scp 目标目录',
            defaultValue: scpTargetDir
          },
          {
            ref: 'is_old',
            type: 'hidden',
            title: 'true',
            defaultValue: 'true'
          }
        ]
      : [
          {
            ref: 'name',
            type,
            title: '项目名称',
            required: true
          },
          {
            ref: 'save_path',
            type,
            title: '存储路径',
            required: true
          },
          {
            ref: 'unzip_path',
            type,
            title: '解压路径',
            required: true
          },
          {
            ref: 'scp_host',
            type: 'select',
            title: 'scp 主机',
            values: scp_list,
            required: false
          },
          {
            ref: 'scp_dir',
            type,
            title: 'scp 路径',
            required: false
          },
          {
            ref: 'scp_target_dir',
            type,
            title: 'scp 目标路径',
            required: false
          }
        ];
    return (
      <div style={{ position: 'relative' }}>
        <TipPanel
          title="温馨提示"
          texts={[
            '存储路径/解压路径/scp路径都是相对路径，相对于程序运行目录, 保存的是绝对路径',
            '解压路径如果不知道怎么填，可以填写 assets/public， 要访问这个资源的话，通过迅游或者华城的域名, https://xx.com/public/你的资源路径 访问你上传的资源',
            '由于 assets/public 是暴露出来的，请不要上传比如源码/秘钥等私密安全文件'
          ]}
        />
        <form
          style={{ marginLeft: 10, marginRight: 10 }}
          onSubmit={this.add}
          ref={c => (this._form = c)}>
          <FormGenerator formOptions={formOptions} ref="formHelper">
            <div className="form-group input">
              <label className="control-label">
                <span className="form-tip">
                  <span className="highlight">*</span>
                </span>{' '}
                项目文件(.zip)
              </label>
              <div className="normal">
                <div className="input-con">
                  <input
                    type="file"
                    accept="application/zip"
                    name="zip"
                    ref={c => (this._zip = c)}
                  />
                </div>
              </div>
            </div>
            <div className="form-group input">
              <label className="control-label">更新日志</label>
              <div className="normal">
                <div className="input-con">
                  <textarea
                    ref={c => (this._desc = c)}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            {
              old_arr.map((item, index) => {
                return (
                  <div key={item.id}>
                    <hr />
                    <FormGenerator
                      formOptions={item.arr}
                      ref={'formHelper-' + item.id}
                    />
                  </div>
                );
              })
            }
            {
              arr.map((item, index) => {
                return (
                  <div key={item.id} style={{ position: 'relative' }}>
                    <span
                      className="close-btn"
                      onClick={() => {
                        this.delEnv(item.id);
                      }}>
                      x
                    </span>
                    <hr />
                    FormGenerator
                      formOptions={item.arr}
                      ref={'formHelper-' + item.id}
                    />
                  </div>
                );
              })
            }
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="control-label" />
              <button type="submit" className="btn flat theme">
                {btnTxt}
              </button>
              <button
                type="button"
                className="btn flat ml10 light-p"
                onClick={this.addExternal}>
                添加新环境
              </button>
            </div>
          </FormGenerator>
        </form>
      </div>
    );
  }
}
