/**
 * 发布日志
 */

import React, { Component } from 'react';
import { TableBody, Loading } from 'ukelli-ui';
import { getAudit } from './apis';

class AuditLog extends Component {
  keyMapper = [
    {
      key: 'operator',
      title: '操作者'
    },
    {
      key: 'date',
      title: '操作时间',
      datetime: true
    },
    {
      key: 'version',
      title: '版本'
    },
    {
      key: 'type',
      title: '发布类型',
      namesMapper: {
        rollback: '回滚',
        release: '资源发布',
        createProj: '创建项目',
        systemDeleteAsset: '系统自动清理',
        deleteAsset: '删除项目',
        createAsset: '上传资源'
      }
    },
    {
      key: 'note',
      title: '发布内容'
    }
  ];
  state = {
    loading: true,
    records: []
  };
  componentDidMount() {
    this.queryData();
  }
  async queryData() {
    let auditRes = (await getAudit(this.props.projId)).data || {};
    this.setState({
      records: auditRes,
      loading: false,
    });
  }
  render() {
    const { records, loading } = this.state;
    return (
      <div className="p10">
        <Loading loading={loading} inrow={true}>
          <TableBody
            keyMapper={this.keyMapper}
            records={records}
            needCount={false}
          />
        </Loading>
      </div>
    );
  }
}

export default AuditLog;
