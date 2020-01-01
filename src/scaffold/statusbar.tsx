import React from 'react';
import { $T } from '@deer-ui/core/utils';
import {
  DefaultStatusbar, TabForNavBar,
} from '../plugins';
import { StatusbarConfigItem } from '../plugins/statusbar';
import { showShortcut, ShortcutDesc } from '../shortcut';
import SearchBox, { SearchBoxProps } from '../search';
import { ToolTip, Icon } from '../ui-refs';

export interface StatusbarProps {
  /** 导航栏的配置 */
  onToggleNav: SearchBoxProps['onToggleNav'];
  statusbarConfig?: StatusbarConfigItem[];
  menuCodeMapper: {};
  StatusbarPlugin: JSX.Element;
  showNavMenu: boolean;
  loadPlugin: (Com: JSX.Element) => JSX.Element;
  logout: () => void;
  toggleFloat: () => void;
  title?: string;
}

const StatusbarLayout: React.SFC<StatusbarProps> = (props) => {
  const {
    StatusbarPlugin, logout, statusbarConfig, toggleFloat, title, loadPlugin,
    menuCodeMapper, onToggleNav, showNavMenu
  } = props;
  return (
    <div className="admin-status-bar" id="statusBar">
      <div className="action-group">
        <Icon
          n={showNavMenu ? "bars" : "align-left"}
          onClick={() => onToggleNav()}
          classNames={['_action-btn']}
        />
      </div>
      <SearchBox
        codeMapper={menuCodeMapper}
      />
      <div className="title">
        {title}
      </div>
      <span className="flex" />
      {
        StatusbarPlugin && loadPlugin(StatusbarPlugin)
      }
      <DefaultStatusbar
        {...props}
        statusbarConfig={statusbarConfig}
      />
    </div>
  );
};

export default StatusbarLayout;
