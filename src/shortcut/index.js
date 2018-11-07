import React, { Component } from 'react';
import { Table } from 'ukelli-ui';
import records from './data';

export default class Shortcut extends Component {
  constructor(props) {
    super(props);

    this.keyMapper = [
      {
        key: 'shortcut',
        title: '快捷键'
      },
      {
        key: 'desc',
        title: '描述'
      }
    ];
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return <Table keyMapper={this.keyMapper} records={records} />;
  }
}
