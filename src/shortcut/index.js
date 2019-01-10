import React, { Component } from 'react';
import { Table } from '../ui-refs';
import records from './data';

const keyMapper = [
  {
    key: 'shortcut',
    title: '快捷键'
  },
  {
    key: 'desc',
    title: '描述'
  }
];

export default () => {
  return <Table keyMapper={keyMapper} records={records} />;
};
