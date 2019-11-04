import React, { Component } from 'react';
import { TableColumns } from '@dear-ui/core/table';
import { Table, Menus, ShowModal } from '../ui-refs';
import dataRows from './data';

const columns: TableColumns = [
  {
    key: 'shortcut',
    title: '快捷键'
  },
  {
    key: 'desc',
    title: '描述'
  }
];

const ShortcutHelp = () => {
  return <Table columns={columns} dataRows={dataRows} />;
};

const showShortcut = () => {
  ShowModal({
    children: <ShortcutHelp />,
    title: '键盘快捷键说明',
    width: 640
  });
};

const ShortcutDesc = () => {
  return (
    <Menus
      data={[
        {
          text: '快捷键说明',
          action: () => showShortcut()
        },
      ]} />
  );
};

export {
  showShortcut, ShortcutDesc
};

export default ShortcutHelp;
