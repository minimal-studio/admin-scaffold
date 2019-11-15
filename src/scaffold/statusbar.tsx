import React from 'react';
import { $T } from '@deer-ui/core/utils';
import {
  DefaultStatusbar, TabForNavBar,
} from '../plugins';
import { StatusbarConfigItem } from '../plugins/statusbar';
import { showShortcut, ShortcutDesc } from '../shortcut';
import SearchBox, { SearchBoxProps } from '../search';
import { ToolTip } from '../ui-refs';

export interface StatusbarProps {
  /** 导航栏的配置 */
  onToggleNav?: SearchBoxProps['onToggleNav'];
  statusbarConfig?: StatusbarConfigItem[];
  title: string;
}

const StatusbarLayout: React.SFC<StatusbarProps> = (props) => {
  const {
    Statusbar, logout, statusbarConfig, toggleFloat, title
  } = props;
  return (
    <div className="admin-status-bar" id="statusBar">
      <div className="action-group">
        <SearchBox
          ref={(e) => { this._seatchBox = e; }}
          onClickMenu={onClickMenu}
          onToggleNav={onToggleNav}
          codeMapper={menuCodeMapper}
          showMenu={show}/>
        <ToolTip
          position="right"
          title={$T('切换到') + $T(!flowMode ? '悬浮' : '传统') + $T('模式')}
          classNames={['_action-btn']}
          className="p10"
          onClick={() => this.changeMenuUIMode(!flowMode)}
          n={flowMode ? "bars" : "bolt"}/>
        <span className="flex" />
        <ToolTip
          onClick={() => onToggleNav(!show)}
          position="right"
          title={`${$T(show ? "收起" : "展开")}${$T('菜单')}（${$T('快捷键')}：alt + alt）`}
          n={!show ? "greater-than" : "less-than"}/>
      </div>
      <div className="title">
        {title}
      </div>
      <hr />
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
