/* eslint-disable react/sort-comp */

import React, { Component } from 'react';
import Mousetrap from 'mousetrap';
import { Call } from '@mini-code/base-func';
import { ClickAway, ToolTip } from '../ui-refs';

import { Link } from '../router-multiple';

export interface SearchBoxProps {
  onChangeMenu: (route: string) => void;
  onToggleNav: (nextShow: boolean) => void;
  $T?: (srcStr: string) => string;
  showMenu: boolean;
  codeMapper: {};
}

const ESC_KEY = 27;

// const Highlight = ({ children, color = 'red' }) => (
//   <strong className={`t_${color}`}>{children}</strong>
// );

const ShortcutTipDesc = ({ $T }) => {
  return (
    <div style={{ width: 240 }}>
      <h5>{$T('菜单搜索')}</h5>
      {$T('快捷键')}：alt + s
      {/* <br />
      {$T('输入菜单名首字母快速查找')}
      <br/>
      {$T('例如')}<strong>{$T('账号管理')}</strong>
      <Highlight>Z</Highlight>hang
      <Highlight>H</Highlight>ao
      <Highlight>G</Highlight>uan
      <Highlight>L</Highlight>i */}
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
      if (!this.props.showMenu) {
        // this.shouldBeHidden = true;
        this.props.onToggleNav(true);
      }
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
    this._input.focus();
  }

  hide() {
    this.setSearchCon(false);
  }

  handleEsc = (e) => {
    if (e.keyCode === ESC_KEY) {
      // this._input.blur();
      this.hide();
      if (this.shouldBeHidden) {
        // this.shouldBeHidden = false;
        this.props.onToggleNav(false);
      }
    }
  }

  render() {
    const { searchMap, isShow } = this.state;
    const { codeMapper, onChangeMenu } = this.props;
    const allCode = Object.keys(codeMapper) || [];
    return (
      <ClickAway onClickAway={(e) => {
        this.hide();
        // this.shouldBeHidden = false;
      }}>
        <React.Fragment>
          <ToolTip
            position="bottom"
            title={(
              <ShortcutTipDesc $T={this.props.$T} />
            )}
            classNames={['_action-btn']}
            className="p10"
            onClick={() => this.show()}
            n="search"/>
          <div
            className={`search-container${isShow ? ' show-content' : ''}`}>
            <input
              ref={(c) => { this._input = c; }}
              type="text"
              placeholder="菜单搜索"
              className="form-control input-sm"
              value={searchMap}
              onChange={e => this.searchMenu(e.target.value)}
              // onFocus={e => this.setSearchCon(true)}
              // onBlur={e => {
              //   setTimeout(() => {
              //     this.setSearchCon(false);
              //   }, 100);
              // }}
              onKeyUp={this.handleEsc} />
            <div className="hide-content">
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
                        className="result-item"
                        key={code}
                        to={code}
                        onClick={(e) => {
                          Call(onChangeMenu, code);
                          this.hide();
                        }}>
                        {codeMapper[code]}
                      </Link>
                    );
                  })
              }
            </div>
          </div>
        </React.Fragment>
      </ClickAway>
    );
  }
}
