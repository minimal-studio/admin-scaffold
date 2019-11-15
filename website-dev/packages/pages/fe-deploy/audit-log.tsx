/**
 * 发布日志
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Loading } from '@deer-ui/core';
import ActionAgent from "../action-agent";

import { getAudit } from './apis';

class AuditLog extends ActionAgent {
  static propTypes = {
    projId: PropTypes.string
  }

  columns = [
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
    const auditRes = await this.reqAgent(getAudit, {
      actingRef: 'loading',
      after: ({ data }) => ({
        records: data
      })
    })(this.props.projId);
  }

  render() {
    const { records, loading } = this.state;
    return (
      <div className="p10">
        <Loading loading={loading} inrow>
          <Table
            columns={this.columns}
            records={records}
            needCount={false}/>
        </Loading>
      </div>
    );
  }
}

export default AuditLog;
