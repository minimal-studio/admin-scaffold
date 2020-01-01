/* eslint-disable default-case */
import React, { Component } from 'react';
import { DropdownWrapperProps } from '@deer-ui/core/dropdown-wrapper';

import { Icon, PureIcon, DropdownWrapper } from '../ui-refs';

interface DisplayDOMProps {
  onClick?;
  pureIcon?;
  icon?;
  title?;
  className?;
  children?;
}

const DisplayDOM = ({
  onClick,
  pureIcon,
  icon,
  title,
  className = 'item',
  children
}: DisplayDOMProps) => {
  const I = pureIcon ? <PureIcon n={pureIcon} /> : <Icon n={icon} />;
  return (
    <span onClick={onClick} className={className}>
      {I}
      {
        title && <span className="ml5">{title}</span>
      }
      {children}
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
              con = <DisplayDOM>{component}</DisplayDOM>;
              break;
            case typeof overlay === 'function':
              con = (
                <DropdownWrapper position="right"
                  overlay={(options) => overlay({
                    ...otherProps,
                    ...options,
                  })}
                >
                  <DisplayDOM
                    onClick={action}
                    title={title}
                    icon={icon}
                    pureIcon={pureIcon}
                  />
                </DropdownWrapper>
              );
              break;
            case !!action:
              con = (
                <DisplayDOM
                  onClick={action}
                  title={title}
                  icon={icon}
                  pureIcon={pureIcon}
                />
              );
              break;
          }
          return (
            <React.Fragment key={`${icon}_${title}`}>
              {con}
            </React.Fragment>
          );
        })
      }
    </div>
  );
};

export default Statusbar;
