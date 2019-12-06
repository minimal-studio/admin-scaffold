import React from 'react';
import { Table } from '@deer-ui/core';


const visitorDataRows = [
  {
    id: 1,
    username: 'alex',
    age: 100,
    property: '100000',
    add: 'cn',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
    status: 'normal',
  },
  {
    id: 2,
    username: 'chili',
    age: 102,
    property: '200000',
    add: 'cn',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
    status: 'normal',
  },
  {
    id: 3,
    username: 'dove',
    property: '300000',
    age: 50,
    add: 'cn',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
    status: 'normal',
  },
  {
    id: 4,
    username: 'susam',
    property: '400000',
    age: 20,
    add: 'uk',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
    status: 'normal',
  },
  {
    id: 5,
    username: 'susam',
    property: '400000',
    age: 20,
    add: 'uk',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
    status: 'normal',
  },
  {
    id: 6,
    username: 'susam',
    property: '400000',
    age: 20,
    add: 'cn',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
    status: 'normal',
  },
  {
    id: 7,
    username: 'susam',
    property: '400000',
    age: 20,
    add: 'cn',
    obj: {
      account: 123,
    },
    birth: new Date('1999-01-01'),
    status: 'exception',
  },
];

const columns = [
  {
    key: 'username',
    T: true
  },
  {
    key: 'age',
    selectable: false,
    title: () => (
      <span>Age</span>
    ),
  },
  {
    key: 'property',
    selectable: false,
    money: true,
    // tips: [
    //   '超过 10 块钱的富人',
    //   '超过 20 块钱的巨富',
    //   '超过 40 块钱的富可敌国',
    // ],
  },
  // {
  //   key: 'obj',
  //   filter: (_, item) => _.account
  // },
  {
    key: 'add',
    labels: {
      cn: 'red'
    }
  },
  {
    key: 'status',
    title: {
      type: 'selector',
      values: {
        normal: '正常',
        abnormal: '异常',
      },
      onChange: (val) => {
        console.log(val);
      }
    },
    labels: {
      normal: 'success',
      exception: 'error',
    }
  },
  // action,
];

export default () => {
  return (
    <Table
      height={205}
      rowKey={(record) => record.id}
      dataRows={visitorDataRows}
      columns={columns}
    />
  );
};
