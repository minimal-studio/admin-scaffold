/* eslint-disable default-case */
import React, { Component } from 'react';
import { DropdownWrapperProps } from '@deer-ui/core/dropdown-wrapper';

import { Icon, PureIcon, DropdownWrapper } from '../ui-refs';

const DisplayDOM = ({
  onClick, pureIcon, icon, title
}) => {
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

export interface StatusbarConfigItem {
  title: string;
  icon?: string;
  pureIcon?: string;
  overlay: DropdownWrapperProps['overlay'];
  component: JSX.Element;
  action: Function;
}

export interface StatsbarProps {
  statusbarConfig: StatusbarConfigItem[];
}

const Statusbar: React.SFC<StatsbarProps> = (props) => {
  const { statusbarConfig, ...otherProps } = props;
  return (
    <div className="status-container">
      {
        statusbarConfig.map((item) => {
          const {
            title, icon, pureIcon, overlay, component, action
          } = item;
          let con;
          switch (true) {
            case !!component:
              con = component;
              break;
            case !!overlay:
              con = (
                <DropdownWrapper position="right"
                  overlay={options => overlay({
                    ...otherProps,
                    ...options,
                  })}>
                  <DisplayDOM title={title} icon={icon} pureIcon={pureIcon} />
                </DropdownWrapper>
              );
              break;
            case !!action:
              con = <DisplayDOM title={title} icon={icon} pureIcon={pureIcon} />;
              break;
          }
          return (
            <span className="item" onClick={action} key={`${icon}_${title}`}>
              {con}
            </span>
          );
        })
      }
    </div>
  );
};

export default Statusbar;
