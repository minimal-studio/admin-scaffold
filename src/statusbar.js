import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon, DropdownWrapper } from './ui-refs';

const DisplayDOM = ({ icon, title }) => (
  <React.Fragment>
    <Icon n={icon} />
    {
      title && <span className="ml5">{title}</span>
    }
  </React.Fragment>
);

const Statusbar = (props) => {
  const { statusbarConfig, ...otherProps } = props;
  return (
    <div className="status-container">
      {
        statusbarConfig.map((item) => {
          const { title, icon, children, component } = item;
          return (
            <span className="item" key={icon + title}>
              {
                component ? component : (
                  <DropdownWrapper position="right" menuWrapper={() => (
                    <DisplayDOM title={title} icon={icon} />
                  )}>
                    {(options) => children({
                      ...otherProps,
                      ...options,
                    })}
                  </DropdownWrapper>
                )
              }
            </span>
          )
        })
      }
    </div>
  )
}

Statusbar.propTypes = {
  statusbarConfig: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      icon: PropTypes.string,
      children: PropTypes.func,
    })
  )
}

export default Statusbar;