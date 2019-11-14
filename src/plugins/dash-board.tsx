import React, { Component } from 'react';

import { Alert } from '../ui-refs';

// static propTypes = {
//   CustomerComponent: PropTypes.any,
//   loadPlugin: PropTypes.func,
// }

export default class DashBoard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { loadPlugin, CustomerComponent, ...other } = this.props;
    return CustomerComponent ? loadPlugin(CustomerComponent, other) : (
      <div className="card-content">
        <Alert title="DashBoard 使用说明"
          texts={[
            '当所有页面关闭后，会出现这个页面',
            '主要作用为展示业务数据的概览',
          ]}/>
      </div>
    );
  }
}
