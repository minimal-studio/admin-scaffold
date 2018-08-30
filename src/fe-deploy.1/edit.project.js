import React, { Component } from 'react';
import { FormGenerator} from 'ukelli-ui';
import { editProject, getHostList } from './fetchData';

export default class EditProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scp_list: [],
      btnTxt: '保存',
      error: ''
    };
    this.obj = Object.assign({}, props.rawData);
    this.parseData();
  }

  componentDidMount() {
    getHostList().then(res => {
      const obj = {};
      res.data.forEach(item => {
        obj[item.Host] = item.Host;
        return obj;
      });
      this.setState({
        scp_list: obj
      });
    });
  }

  parseData = () => {
    const { rawData } = this.props;
    const ck = rawData;
    var ks = Object.keys(ck.assets);
    var unique = {};
    var names = [];
    var unique_scp = {};
    ks.forEach(idx => {
      var asset = ck.assets[idx];
      if (asset.scp_dir && asset.scp_target_dir) {
        unique_scp = {
          scp_dir: asset.scp_dir,
          scp_target_dir: asset.scp_target_dir
        };
      }
      var filename = asset.name;
      if (!unique[filename]) {
        if (!asset.hasOwnProperty('name')) {
          asset = ck.name;
        }
        unique[filename] = asset;
        names.push(asset.name);
      }
    });
    this.unique = unique;
    this.formOptions = Object.keys(unique).map(k => {
      const item = unique[k];
      const type = 'input';
      return [
        {
          ref: 'name',
          type,
          title: '项目名称',
          defaultValue: item.name
        },
        {
          ref: 'old_name',
          type: 'hidden',
          title: '项目名称',
          defaultValue: item.name
        },
        {
          ref: 'save_path',
          type,
          title: '存储路径',
          defaultValue: this.obj.save_path
        },
        {
          ref: 'unzip_path',
          type,
          title: '解压路径',
          defaultValue: item.unzip_path
        },
        {
          ref: 'scp_host',
          type: 'select',
          title: 'scp 主机',
          values: this.state.scp_list,
          defaultValue: this.obj.scp_host
        },
        {
          ref: 'scp_dir',
          type,
          title: 'scp 目录',
          defaultValue:
            this.obj.scp_host && this.obj.scp_dir ? this.obj.scp_dir : ''
        },
        {
          ref: 'scp_target_dir',
          type,
          title: 'scp 目标目录',
          defaultValue: this.obj.scp_target_dir
        }
      ];
    });
  };

  add = e => {
    e.preventDefault();
    if (this.submiting) return;
    const obj = Object.assign({}, this.obj);
    this.formOptions.forEach((item, index) => {
      const cur_value = this.refs[`formHelper${index}`].value;
      const {
        name,
        old_name,
        save_path,
        scp_dir,
        scp_host,
        scp_target_dir,
        unzip_path
      } = cur_value;
      if (obj.name == old_name) {
        obj.name = name;
        obj.save_path = save_path;
        obj.scp_dir = scp_dir;
        obj.scp_host = scp_host;
        obj.scp_target_dir = scp_target_dir;
        obj.unzip_path = unzip_path;
      }

      Object.keys(obj.assets).forEach(k => {
        const asset = obj.assets[k];
        if (asset.name == old_name) {
          asset.name = name;
          asset.scp_dir = scp_dir;
          asset.scp_host = scp_host;
          asset.scp_target_dir = scp_target_dir;
          asset.unzip_path = unzip_path;
        }
      });
    });
    this.setState({
      btnTxt: '正在保存',
      error: ''
    });
    this.submiting = true;
    editProject(obj.id, obj)
      .then(res => {
        this.props.handleSuccess();
        return 1;
      })
      .catch(e => {
        this.submiting = false;
        this.setState({
          btnTxt: '保存',
          error: '保存失败：' + (e.join ? e.join(';') : e + '')
        });
      });
  };

  render() {
    return (
      <div className="horizontal-form">
        <form
          style={{ marginLeft: 10, marginRight: 10 }}
          onSubmit={this.add}
          ref={c => (this._form = c)}>
          {this.formOptions.map((option, index) => {
            option[4].values = this.state.scp_list;
            return (
              <FormGenerator
                key={index}
                formOptions={option}
                ref={'formHelper' + index}
              />
            );
          })}
          <div className="form-group">
            <label className="control-label" />
            <button type="submit" className="btn flat theme">
              {this.state.btnTxt}
            </button>
          </div>
        </form>
        <div className="text-center" style={{ color: 'red' }}>
          {this.state.error ? this.state.error : ''}
        </div>
      </div>
    );
  }
}
