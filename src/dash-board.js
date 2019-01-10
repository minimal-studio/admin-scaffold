import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TipPanel } from './ui-refs';

const desc = `const DashBoard = () => {
  return (
    <div>Your dashboard</div>
  )
}
<ManagerAPP DashBoard={DashBoard}/>
`;

export default class DashBoard extends React.PureComponent {
  static propTypes = {
    CustomerComponent: PropTypes.any,
    loadPlugin: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { loadPlugin, CustomerComponent } = this.props;
    return (
      <div className="card-content">
        {
          CustomerComponent ? loadPlugin(CustomerComponent) : (
            <TipPanel title="DashBoard 使用说明"
              texts={[
                '当所有页面关闭后，会出现这个页面',
                '主要作用为展示页面数据，并且不会有空白的页面出现',
                '在最顶层传入 DashBoard 即可，以下为代码示例',
                (
                  <pre key="desc">{desc}</pre>
                )
              ]}/>
          )
        }
      </div>
    );
  }
}