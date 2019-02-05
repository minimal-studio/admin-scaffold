import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon, DropdownWrapper } from './ui-refs';

export default class Statusbar extends Component {
  static propTypes = {
    statusbarConfig: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        icon: PropTypes.string,
        children: PropTypes.func,
      })
    )
  }
  state = {};
  render() {
    const { statusbarConfig, ...otherProps } = this.props;
    return (
      <div className="status-container">
        {
          statusbarConfig.map((item) => {
            const { title, icon, children } = item;
            return (
              <span className="item" key={icon + title}>
                <DropdownWrapper position="right" menuWrapper={() => (
                  <React.Fragment>
                    <Icon n={icon} />
                    {
                      title && <span className="ml5">{title}</span>
                    }
                  </React.Fragment>
                )}>
                  {(options) => children({
                    ...otherProps,
                    ...options,
                  })}
                </DropdownWrapper>
              </span>
            )
          })
        }
      </div>
    )
  }
}
