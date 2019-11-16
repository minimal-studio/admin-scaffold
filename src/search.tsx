/* eslint-disable react/sort-comp */

import React, { Component } from 'react';
import Mousetrap from 'mousetrap';
import { Call } from '@mini-code/base-func';
import { $T } from '@deer-ui/core/utils';

import {
  ClickAway, ToolTip, DropdownWrapper, Icon
} from './ui-refs';
import { Link } from './router-multiple';

export interface SearchBoxProps {
  onChangeMenu?: (route: string) => void;
  onToggleNav?: (nextShow?: boolean) => void;
  // showMenu: boolean;
  codeMapper: {};
}

const ESC_KEY = 27;

const ShortcutTipDesc = ({ $T }) => {
  return (
    <div>
      <div>{$T('菜单搜索')}</div>
      {$T('快捷键')}：alt + s
    </div>
  );
};

export default class SearchBox extends Component<SearchBoxProps> {
  constructor(props) {
    super(props);

    this.state = {
      searchMap: '',
      isShow: false,
    };
  }

  componentDidMount() {
    Mousetrap.bind(['alt+s'], (e) => {
      this.show();
      // if (!this.props.showMenu) {
      //   // this.shouldBeHidden = true;
      //   this.props.onToggleNav(true);
      // }
      return false;
    });
  }

  componentWillUnmount = () => {
    Mousetrap.unbind(['alt+s']);
  }

  setSearchCon(isShow) {
    this.setState({
      isShow,
      searchMap: isShow ? this.state.searchMap : ''
    });
  }

  searchMenu(val) {
    this.setState({
      searchMap: val
    });
  }

  show() {
    this.setSearchCon(true);
  }

  hide() {
    this.setSearchCon(false);
  }

  render() {
    const { searchMap } = this.state;
    const { codeMapper, onChangeMenu } = this.props;
    const allCode = Object.keys(codeMapper) || [];
    return (
      <DropdownWrapper
        overlay={({ hide }) => {
          return (
            <div
              className="search-container"
            >
              <input
                ref={(c) => {
                  if (c) c.focus();
                }}
                type="text"
                placeholder="菜单搜索"
                className="form-control input-sm"
                value={searchMap}
                onChange={(e) => this.searchMenu(e.target.value)}
                onKeyUp={(e) => {
                  if (e.keyCode === ESC_KEY) {
                    hide();
                  }
                }}
              />
              <div className="all-content __menus">
                {
                  allCode
                    .filter(
                      (code) => {
                        const item = codeMapper[code] || '';
                        return item.indexOf(searchMap) != -1 || code.indexOf(searchMap.toUpperCase()) != -1;
                      }
                    )
                    .map((code, idx) => {
                      return (
                        <Link
                          className="menu-item"
                          key={code}
                          to={code}
                          onClick={(e) => {
                            Call(onChangeMenu, code);
                            hide();
                          }}
                        >
                          {codeMapper[code]}
                        </Link>
                      );
                    })
                }
              </div>
            </div>
          );
        }}
      >
        <Icon
          n="search"
          classNames={['_action-btn']}
        />
        {/* <ToolTip
          position="right"
          title={(
            <ShortcutTipDesc $T={$T} />
          )}
          classNames={['_action-btn']}
          className="p10"
          n="search"
        /> */}
      </DropdownWrapper>
    );
  }
}
