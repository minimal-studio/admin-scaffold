import React, { Component } from 'react';
import {
  TableBody, ShowGlobalModal, CloseGlobalModal
} from 'ukelli-ui';
import AddAsset from './add.project';
import PublishLog from './publish.log';
import { publish, deleteAsset, scp } from './fetchData';

const versionFilter = (version) => {
  return `v${(version + '').split('').join('.')}`;
}

/* 版本记录管理 */
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
      key: 'update_comment',
      title: ' 更新日志'
    },
    {
      key: 'ts',
      title: '日期',
      datetime: true
    },
    {
      key: 'rollback_note',
      title: '回滚原因',
      filter: (str) => {
        return str ? str : '-';
      }
    },
    {
      key: 'action',
      title: '操作',
      filter: (str, item, keyMap, idx) => {
        const record = this.props.getRecord();
        const {notify} = this.props;
        const {current} = record;
        const {records} = this.state;
        let hadRollback = item.rollback_note;
        let canRollback = item.version < records[0].version;
        let isReleased = current == item.id;
        let releasText = (!isReleased && canRollback) ? '回滚' : isReleased ? '已发布' : '发布';
        return (
          <React.Fragment>
            {
              !hadRollback ? (
                <span
                  className="btn theme flat"
                  onClick={() => {
                    let ModalId = ShowGlobalModal({
                      title: releasText,
                      confirmText: !canRollback ? (
                        <h3 className="text-center">确定发布 {versionFilter(item.version)} ?</h3>
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
                          let publishRes = await publish(
                            record.id,
                            item.id,
                            this._note ? this._note.value.trim() : '',
                            item.name
                          );
                          if (item.scp_dir && item.scp_host) {
                            notify('正在 scp 同步');
                            try {
                              let scpRes = await scp(record.id, item.id);
                              notify('scp 同步', true);
                            } catch (e) {
                              notify('scp 同步不成功，服务器出问题了:（' + e.toString());
                            }
                          }
                          CloseGlobalModal(ModalId);
                          isSuccess = true;
                          this.handleSuccess();
                        } catch(e) {
                          isSuccess = false;
                        }
                        notify(releasText, isSuccess);
                      }
                    });
                  }}>
                  {releasText}
                </span>
              ) : (
                <span className="btn red" disabled>已回滚</span>
              )
            }
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
                      this.handleSuccess();
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
    const record = props.getRecord();
    this.state = {
      records: this.objToArr(record.assets)
    }
  }

  handleSuccess = async () => {
    const {getData, getRecord} = this.props;
    await getData();
    this.setState({
      records: this.objToArr(getRecord().assets)
    });
  }

  objToArr(obj) {
    let res = [];
    Object.keys(obj).forEach(id => res.push(obj[id]));
    res = res.sort((prevItem, nextItem) => nextItem.version - prevItem.version);
    return res;
  }

  render() {
    const record = this.props.getRecord();
    const {notify} = this.props;
    const {records} = this.state;
    return (
      <div>
        <div className="p10">
          <button
            className="btn theme flat"
            onClick={() => {
              let ModalId = ShowGlobalModal({
                title: '上传新版',
                width: 600,
                showFuncBtn: false,
                children: (
                  <AddAsset
                    isAddAsset={true}
                    list={[]}
                    notify={notify}
                    handleSuccess={this.handleSuccess}
                    handleClose={() => {
                      // this.setState({ addModal: false });
                      CloseGlobalModal(ModalId);
                    }}
                    id={record.id}
                    name={record.name || '-'}
                    savePath={record.save_path}
                    unzipPath={record.unzip_path}
                    scpHost={record.scp_host}
                    scpDir={record.scp_dir}
                    scpTargetDir={record.scp_target_dir}
                  />
                )
              })
            }}>
            上传新版
          </button>
          {
            record.publish_history && record.publish_history.length > 0 ? (
              <button
                className="btn-link theme flat"
                onClick={() => ShowGlobalModal({
                  title: '发布日志',
                  width: 600,
                  children: (
                    <PublishLog publishLog={record.publish_history} name={record.name} />
                  )
                })}>
                查看日志
              </button>
            ) : null
          }
        </div>
        <TableBody keyMapper={this.keyMapper} records={records} needCount={false} />
      </div>
    );
  }
}

export default AssetsManager;
