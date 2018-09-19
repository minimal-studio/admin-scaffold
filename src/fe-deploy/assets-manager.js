import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TableBody, ShowGlobalModal, CloseGlobalModal, FormLayout
} from 'ukelli-ui';
import { getAssets, getProjects, release, rollback, delAsset } from './apis';
import ReleaseComfirm from './release-comfirm';
import { versionFilter } from './filter';

let prevRecords = [];

class AssetsManager extends Component {
  static propTypes = {
    notify: PropTypes.func,
    getProject: PropTypes.func.isRequired,
    username: PropTypes.string,
    releasable: PropTypes.bool
  }
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
      title: '上传日期',
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
        let { notify, username, releasable } = this.props;
        if(!releasable) return '-';
        let { id, belongto, isRollback, isReleased } = item;
        let { currProject } = this.state;
        let { releaseRef } = currProject;
        let isCurrReleased = isReleased && releaseRef == id;
        let canRollback = isReleased && !isCurrReleased;
        let releasText = '发布';
        let options = {
          releasText, canRollback, item,
        }
        switch (true) {
          case isCurrReleased:
            releasText = '已发布';
            break;
          case canRollback:
            releasText = '回滚';
            break;
          case isRollback:
            releasText = '已回滚';
            break;
        }
        return (
          <React.Fragment>
            <button
              className="btn theme flat"
              disabled={isRollback}
              onClick={() => {
                this.comfirmRelease(options);
              }}>
              {releasText}
            </button>
            <button
              className="red btn ml10"
              onClick={() => {
                let ModalId = ShowGlobalModal({
                  title: '删除',
                  type: 'confirm',
                  confirmText: (
                    <div className="text-center">
                      <h3>确定删除 {versionFilter(item.version)} ?</h3>
                      <h5>系统将会把资源文件也删除，不可恢复.</h5>
                    </div>
                  ),
                  width: 340,
                  onConfirm: async (isDel) => {
                    if(!isDel) return;
                    let delRes = await delAsset({assetId: id, projId: belongto});
                    let isSuccess = !delRes.err;
                    if(isSuccess) {
                      CloseGlobalModal(ModalId);
                      this.onReleased();
                    }
                    notify('删除', isSuccess);
                  }
                });
              }}>
              删除
            </button>
          </React.Fragment>
        )
      }
    }
  ]
  
  constructor(props) {
    super(props);
    this.state = {
      records: prevRecords,
      loading: true,
      currProject: {}
    }
  }

  componentDidMount() {
    this.queryData();
  }

  comfirmRelease = (options) => {
    const { notify, username, getProject } = this.props;
    const { releasText, canRollback, item } = options;
    const project = getProject();
    let ModalId = ShowGlobalModal({
      title: releasText,
      showFuncBtn: false,
      children: (
        <ReleaseComfirm
          canRollback={canRollback}
          onCancel={e => CloseGlobalModal(ModalId)}
          onReleased={isSuccess => {
            CloseGlobalModal(ModalId);
            this.props.notify(releasText, isSuccess);
          }}
          {...this.props} asset={item} project={project}/>
      )
      // !canRollback ? (
        
      // ) : (
      //   <textarea 
      //     style={{
      //       height: 200,
      //       width: '100%'
      //     }}
      //     className="form-control" placeholder="回滚原因" ref={e => this.rollbackNote = e}></textarea>
      // )
      ,
      // type: 'confirm',
      width: 560,
      // onConfirm: async (isSure) => {
      //   if(!isSure) return;
      //   let isSuccess;
      //   let releaseRes;
      //   try {
      //     if(canRollback) {
      //       releaseRes = await rollback({
      //         assetId: id,
      //         prevAssetId: releaseRef,
      //         projId: belongto,
      //         username,
      //         rollbackMark: (this.rollbackNote.value || '').trim(),
      //       });
      //     } else {
      //       releaseRes = await release({
      //         assetId: id,
      //         projId: belongto,
      //         username,
      //       });
      //     }
      //     isSuccess = !releaseRes.err;
      //     CloseGlobalModal(ModalId);
      //     this.onReleased();
      //   } catch(e) {
      //     isSuccess = false;
      //   }
      //   notify(releasText, isSuccess);
      // }
    });
  }

  async queryData() {
    const { projId } = this.props;
    const assetRecord = (await getAssets(projId)).data || [];
    const projectData = (await getProjects({projId})).data || [];
    prevRecords = assetRecord;
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
    const { records } = this.state;
    return (
      <TableBody keyMapper={this.keyMapper} records={records} needCount={false} />
    );
  }
}

export default AssetsManager;
