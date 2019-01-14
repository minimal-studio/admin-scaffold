import React from 'react';
import AdminWebScaffold from './layout';
import { Link } from './router-multiple';

const ManagerAPP = (props) => {
  console.warn('ManagerAPP 要废弃了，请使用 AdminWebScaffold 代替');
  return (
    <AdminWebScaffold {...props} />
  );
};
const AdminWevScaffold = (props) => {
  console.warn('AdminWevScaffold 名字错了，请改为 AdminWebScaffold');
  return (
    <AdminWebScaffold {...props} />
  );
};

export * from './config';

export {
  AdminWevScaffold, ManagerAPP, AdminWebScaffold,
  Link
};
