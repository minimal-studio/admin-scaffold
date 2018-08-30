import React, { Component } from 'react';
import { TableBody } from 'ukelli-ui';
import { toVersion, formatTime } from './apis';

/* 发布日志 */
class PublishLog extends Component {
  render() {
    const { publishLog } = this.props;
    const keyMapper = [
      {
        key: '0',
        title: '日期'
      },
      {
        key: '1',
        title: '名称'
      },
      {
        key: '2',
        title: '版本'
      },
      {
        key: '3',
        title: '发布者'
      }
    ];
    return (
      <div style={{ paddingTop: 20, paddingBottom: 30 }}>
        <div style={{ padding: '0 20px' }}>
          <TableBody
            keyMapper={keyMapper}
            records={this.arrToArr(publishLog)}
            needCount={false}
          />
        </div>
      </div>
    );
  }

  arrToArr = publishLog => {
    var c = publishLog
      .slice(0, 30)
      .reverse()
      .map(k => [
        $GH.DateFormat(k.date) + ' ' + formatTime(k.date),
        k.env || this.props.name,
        toVersion(k.version),
        k.who
      ]);
    return c;
  };
}

export default PublishLog;
