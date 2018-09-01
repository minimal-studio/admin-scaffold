import React, { Component } from 'react';
import {
  TableBody, ShowGlobalModal, CloseGlobalModal
} from 'ukelli-ui';
import { getAssets, getProjects, release } from './apis';

const versionFilter = (version) => {
  return `v${(version + '').split('').join('.')}`;
}

class AssetsManager extends Component {
  keyMapper = [
    {
      key: 'version',
      title: '版本',
      filter: (str) => {
        return versionFilter(str);
      }
    },
    {
      key: 'desc',
      title: '更新日志'
    },
    {
      key: 'createdDate',
      title: '日期',
      datetime: true
    },
    {
      key: 'rollbackMark',
      title: '回滚原因',
      filter: (str) => {
        return str ? str : '-';
      }
    },
    {
      key: 'action',
      title: '操作',
      filter: (str, item, keyMap, idx) => {
        let { id, belongto, isRollback } = item;
        let { currProject } = this.state;
        let { releaseRef } = currProject;
        let { notify, userInfo } = this.props;
        let { username } = userInfo;
        let isReleased = releaseRef == id;
        let canRollback = isReleased;
        let releasText = canRollback ? '回滚' : '发布';
        return (
          <React.Fragment>
            <span
              className="btn theme flat"
              onClick={() => {
                let ModalId = ShowGlobalModal({
                  title: releasText,
                  confirmText: !canRollback ? (
                    <div className="text-center">
                      <h3>确定发布 {versionFilter(item.version)} ?</h3>
                      <span>日志: {item.desc}</span>
                    </div>
                  ) : (
                    <textarea 
                      style={{
                        height: 200,
                        width: '100%'
                      }}
                      className="form-control" placeholder="回滚原因" ref={e => this._note = e}></textarea>
                  ),
                  type: 'confirm',
                  width: 340,
                  onConfirm: async (isRelease) => {
                    if(!isRelease) return;
                    let isSuccess;
                    try {
                      let releaseRes = await release({
                        assetId: id,
                        projId: belongto,
                        username,
                      });
                      isSuccess = !releaseRes.err;
                      CloseGlobalModal(ModalId);
                      this.onReleased();
                    } catch(e) {
                      isSuccess = false;
                    }
                    notify(releasText, isSuccess);
                  }
                });
              }}>
              {releasText}
            </span>
            <span
              className="link-btn theme warn ml10"
              onClick={() => {
                let ModalId = ShowGlobalModal({
                  title: '删除',
                  type: 'confirm',
                  confirmText: (
                    <h3 className="text-center">确定删除 {versionFilter(item.version)} ?</h3>
                  ),
                  width: 340,
                  onConfirm: async (isDel) => {
                    if(!isDel) return;
                    let delRes = await deleteAsset(record.id, item.id);
                    let isSuccess = delRes.status == 'ok';
                    if(isSuccess) {
                      CloseGlobalModal(ModalId);
                      this.onReleased();
                    }
                    notify('删除', isSuccess);
                  }
                });
              }}>
              删除
            </span>
          </React.Fragment>
        )
      }
    }
  ]
  
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      loading: true,
      currProject: {}
    }
  }

  componentDidMount() {
    this.queryData();
  }

  async queryData() {
    const { userInfo, projId } = this.props;
    const { username } = userInfo;
    const assetRecord = (await getAssets(username, projId)).data || [];
    const projectData = (await getProjects({username, projId})).data || [];
    this.setState({
      records: assetRecord,
      currProject: projectData,
      loading: false
    });
  }

  onReleased = () => {
    this.setState({
      loading: true
    });
    this.queryData();
  }

  objToArr(obj) {
    let res = [];
    Object.keys(obj).forEach(id => res.push(obj[id]));
    res = res.sort((prevItem, nextItem) => nextItem.version - prevItem.version);
    return res;
  }

  render() {
    const {records} = this.state;
    return (
      <TableBody keyMapper={this.keyMapper} records={records} needCount={false} />
    );
  }
}

export default AssetsManager;
