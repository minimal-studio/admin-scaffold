import React from 'react';
import AdminWevScaffold from './layout';
import { Link } from './router-multiple';

const ManagerAPP = (props) => {
  console.warn('ManagerAPP 要废弃了，请使用 AdminWevScaffold 代替');
  return (
    <AdminWevScaffold {...props} />
  );
};

export * from './config';

export {
  AdminWevScaffold, ManagerAPP,
  Link
};
