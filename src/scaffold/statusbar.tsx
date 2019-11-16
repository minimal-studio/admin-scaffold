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
  showNavMenu: boolean;
  logout: () => void;
  toggleFloat: () => void;
  title?: string;
}

const StatusbarLayout: React.SFC<StatusbarProps> = (props) => {
  const {
    Statusbar, logout, statusbarConfig, toggleFloat, title,
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
        Statusbar && this.loadPlugin(Statusbar, {
          onLogout: logout,
          showShortcut,
          displayFloat,
          $T,
          toggleFloat,
        })
      }
      <DefaultStatusbar {...props} statusbarConfig={statusbarConfig} />
    </div>
  );
};

export default StatusbarLayout;
