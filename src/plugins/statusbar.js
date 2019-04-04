import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon, PureIcon, DropdownWrapper } from '../ui-refs';

const DisplayDOM = ({ onClick, pureIcon, icon, title }) => {
  const I = pureIcon ? <PureIcon n={pureIcon} /> : <Icon n={icon} />;
  return (
    <span onClick={onClick}>
      {I}
      {
        title && <span className="ml5">{title}</span>
      }
    </span>
  );
};

const Statusbar = (props) => {
  const { statusbarConfig, ...otherProps } = props;
  return (
    <div className="status-container">
      {
        statusbarConfig.map((item) => {
          const { title, icon, pureIcon, children, component, action } = item;
          let con;
          switch (true) {
          case !!component:
            con = component;
            break;
          case !!children:
            con = (
              <DropdownWrapper position="right" menuWrapper={() => (
                <DisplayDOM title={title} icon={icon} pureIcon={pureIcon} />
              )}>
                {(options) => children({
                  ...otherProps,
                  ...options,
                })}
              </DropdownWrapper>
            );
            break;
          case !!action:
            con = <DisplayDOM title={title} icon={icon} pureIcon={pureIcon} />;
            break;
          }
          return (
            <span className="item" onClick={action} key={icon + '_' + title}>
              {con}
            </span>
          );
        })
      }
    </div>
  );
};

Statusbar.propTypes = {
  statusbarConfig: PropTypes.arrayOf(
    PropTypes.shape({
      /** 显示的 title */
      title: PropTypes.string,
      /** icon */
      icon: PropTypes.string,
      /** PureIcon */
      pureIcon: PropTypes.string,
      /** 传入 DropdownWrapper 的 children */
      children: PropTypes.func,
      /** 如果有 component，则直接替换 DropdownWrapper */
      component: PropTypes.any,
      /** 如果有 action，则直接显示内容，并且触发 action */
      action: PropTypes.any,
    })
  )
};

export default Statusbar;