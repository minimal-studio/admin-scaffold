import React, { Component } from 'react';
import { Table, Menus, ShowModal } from '../ui-refs';
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

const ShortcutHelp = () => {
  return <Table keyMapper={keyMapper} records={records} />;
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
