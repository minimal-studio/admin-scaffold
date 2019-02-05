import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon, DropdownWrapper } from './ui-refs';

export default class Foooter extends React.PureComponent {
  static propTypes = {
  }
  state = {};
  render() {
    const { children } = this.props;
    return (
      <div className="footer-container">
        {children}
      </div>
    )
  }
}
