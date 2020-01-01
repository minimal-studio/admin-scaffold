import React, { Component } from 'react';
import { TableColumns } from '@deer-ui/core/table';
import {
  Table, Menus, ShowModal, Button
} from '../ui-refs';
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
    <Button
      color="default"
      onClick={(e) => {
        showShortcut();
      }}
    >
      快捷键说明
    </Button>
  );
  // return (
  //   <Menus
  //     data={[
  //       {
  //         text: '快捷键说明',
  //         action: () => showShortcut()
  //       },
  //     ]} />
  // );
};

export {
  showShortcut, ShortcutDesc
};

export default ShortcutHelp;
