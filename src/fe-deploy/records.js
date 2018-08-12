import React, { Component, PropTypes } from 'react';
import {Modal, Loading, TableBody, Notify} from 'ukelli-ui';

import { getData, createProject, deleteProject, toVersion } from './fetchData';
import AssetsManager from './assets.manager';
import AddProject from './add.project';
import EditProject from './edit.project';
import { ShowGlobalModal, CloseGlobalModal } from 'ukelli-ui';

export default class Records extends Component {
  keyMapper = [
    {
      key: 'projName',
      title: '项目',
      filter: (str, item, _, idx) => {
        const {projName, id} = item;
        return (
          <span className="link-btn" onClick={() => {
            ShowGlobalModal({
              title: projName + ' 版本管理',
              width: 1000,
              draggable: true,
              showFuncBtn: false,
              children: (
                <AssetsManager
                  notify={this.notify}
                  record={item}
                  getRecord={() => this.getAssetsRecord(idx)}
                  getData={this.syncData.bind(this)}
                />
              )
            })
          }}>{str}</span>
        )
      }
    },
    {
      key: 'action',
      title: '操作',
      filter: (str, item, _, idx) => {
        const {projName, id} = item;
        return (
          <React.Fragment>
            {/* <span
              className="btn theme flat mr10"
              onClick={}>
              版本管理
            </span> */}
            <span
              className="btn theme flat mr10"
              onClick={() => {
                let ModalId = 'edit' + idx;
                ShowGlobalModal({
                  title: '编辑 ' + projName,
                  showFuncBtn: false,
                  id: ModalId,
                  draggable: true,
                  width: 1000,
                  children: (
                    <EditProject
                      notify={this.notify}
                      rawData={item}
                      handleSuccess={() => {
                        CloseGlobalModal(ModalId);
                        this.syncData();
                      }}
                    />
                  )
                })
              }}>
              编辑
            </span>
            <span
              className="link-btn theme warn"
              onClick={() => {
                let ModalId = ShowGlobalModal({
                  title: '删除 ' + projName,
                  showFuncBtn: false,
                  width: 500,
                  children: (
                    <div className="text-center" style={{ paddingBottom: 10 }}>
                      <div style={{ padding: 20, height: 130 }}>
                        之前上传的版本记录也将会删除，请检查。
                      </div>
                      <span className="btn flat warn" onClick={e => this.delProject(id, () => {
                        CloseGlobalModal(ModalId);
                      })}>
                        确定删除
                      </span>
                    </div>
                  )
                })
              }}>
              删除
            </span>
          </React.Fragment>
        )
      }
    },
    {
      key: 'save_path',
      title: '存储路径',
      filter: (...args) => this.pathFilter(...args)
    },
    {
      key: 'unzip_path',
      title: '解压路径',
      filter: (...args) => this.pathFilter(...args)
    },
    {
      key: 'scp_dir',
      title: 'scp路径',
      filter: (...args) => this.pathFilter(...args)
    },
    {
      key: 'scp_target_dir',
      title: 'scp目标路径',
      filter: (...args) => this.pathFilter(...args)
    },
    {
      key: 'version',
      title: '当前版本'
    },
  ];

  constructor(props) {
    super(props);

    this.state = {
      addModal: false,
      records: [],
      error_msg: '',
      del_error_msg: '',
      searchValue: ''
    };

    this.obj = '';
  }

  notify = (title, isSuccess) => {
    const normalType = typeof isSuccess == 'undefined';
    Notify({
      config: {
        id: $GH.GenerteID(),
        type: normalType ? 'normal' : isSuccess ? 'success' : 'error',
        title: normalType ? title : title + (isSuccess ? '成功' : '失败'),
      }
    })
  }

  pathFilter = (str) => {
    let defaultPath = '/assets';
    let [start, end] = str.split(defaultPath);
    return end ? '~' + defaultPath + end : start;
  }

  getAssetsRecord = (idx) => {
    return this.state.records[idx];
  }

  componentDidMount() {
    this.syncData();
  }

  handleSearch = e => {
    this.setState({
      searchValue: e.target.value
    });
  };

  render() {
    const {
      error_msg,
      del_error_msg,
      records,
      searchValue
    } = this.state;

    if (records == 'error') return (<div>{error_msg}</div>);

    return (
      <Loading loading={!records} inrow={true}>
        <div className="m10">
          <div className="text-left" style={{marginBottom: 10 }}>
            <button
              className="btn theme flat mr10"
              onClick={() => {
                let ModalId = ShowGlobalModal({
                  title: '新增项目',
                  width: '40%',
                  showFuncBtn: false,
                  children: (
                    <AddProject
                      handleClose={() => {}}
                      notify={this.notify}
                      handleSuccess={() => {
                        CloseGlobalModal(ModalId);
                        this.syncData();
                      }}
                    />
                  )
                })
              }}>
              新增项目
            </button>
            <input
              type="text"
              className="form-control input-sm"
              placeholder="搜索项目名称"
              onChange={this.handleSearch}
            />
          </div>
          <TableBody
            keyMapper={this.keyMapper}
            records={searchValue.length > 0 ? records.filter(item => item[0].projName.indexOf(searchValue) > -1) : records}
            needCount={false}
          />
          <div className="text-center" style={{ color: 'red' }}>
            {del_error_msg}
          </div>
        </div>
      </Loading>
    );
  }

  returnBtns = id => {
    return [
      <span
        key="btn1"
        className="btn theme flat mr10"
        onClick={() => {
          this.openProjectModal(id);
        }}>
        版本管理
      </span>,
      <span
        key="btn-del"
        className="btn theme flat mr10"
        onClick={() => {
          this.openEditModal(id);
        }}>
        编辑
      </span>,
      <span
        key="btn2"
        className="link-btn theme warn"
        onClick={() => {
          this.openModal(id);
        }}>
        删除
      </span>
    ];
  };

  async syncData() {
    let res = await getData();
    this.obj = res.data;

    let records = Object.keys(res.data).map(k => {
      let ck = res.data[k];
      let ks = Object.keys(ck.assets);
      let unique = {};
      let names = [];
      let unique_scp = {};
      ks.forEach(idx => {
        let asset = ck.assets[idx];
        if (asset.scp_dir && asset.scp_target_dir) {
          unique_scp = {
            scp_dir: asset.scp_dir,
            scp_target_dir: asset.scp_target_dir
          };
        }
        let filename = asset.name;
        if (!unique[filename]) {
          if (!asset.hasOwnProperty('name')) {
            asset = ck.name;
          }
          unique[filename] = true;
          names.push(asset.name);
        }
      });
      let projName = names.length < 1 ? ck.name : names.join(' - ');
      unique = null;
      return {
        ...ck,
        projName,
        action: '',
        scp_dir: unique_scp.scp_dir,
        scp_target_dir: unique_scp.scp_target_dir,
        version: ck.current ? toVersion(ck.assets[ck.current].version) : '默认版本'
      };
    });

    this.setState({ records });
    return res.data;
  };

  delProject = (id, cb) => {
    if (this.submiting) return;
    this.submiting = true;
    deleteProject(id)
      .then(res => {
        this.submiting = false;
        this.syncData();
        cb();
      })
      .catch(e => {
        this.submiting = false;
        this.setState(
          {
            del_error_msg: JSON.stringify(e),
          },
        );
      });
  };
}
