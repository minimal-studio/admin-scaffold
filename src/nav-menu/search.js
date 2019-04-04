/* eslint-disable react/sort-comp */

import React, { Component } from 'react';
import Mousetrap from 'mousetrap';
import PropTypes from 'prop-types';
import { Call } from 'basic-helper';
import { ClickAway, ToolTip } from '../ui-refs';

import { Link } from '../router-multiple';

const ESC_KEY = 27;

const ShortcutTipDesc = () => {
  return (
    <div style={{maxWidth: 240}}>
      快捷键：alt + s
      <br />
      小贴士：输入首字母快速查找; 比如
      <strong>账号管理</strong> 
      （<strong style={{color: '#449cea'}}>z</strong>hang<strong style={{color: '#449cea'}}>h</strong>ao
      <strong style={{color: '#449cea'}}>g</strong>uan<strong style={{color: '#449cea'}}>l</strong>i），输入 
      <strong style={{color: '#449cea'}}>zhgl</strong>（或者zhg）
    </div>
  );
};

export default class SearchBox extends Component {
  static propTypes = {
    onChangeMenu: PropTypes.func,
    onToggleNav: PropTypes.func,
    showMenu: PropTypes.bool,
    codeMapper: PropTypes.object,
  };
  constructor(props) {
    super(props);

    this.state = {
      searchMap: '',
      isShow: false,
    };
  }

  componentDidMount() {
    Mousetrap.bind(['alt+s'], e => {
      this.show();
      if (!this.props.showMenu) {
        // this.shouldBeHidden = true;
        this.props.onToggleNav(true);
      }
      return false;
    });
  }

  componentWillUnmount() {
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

  handleEsc = e => {
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
      <ClickAway onClickAway={e => {
        this.hide();
        // this.shouldBeHidden = false;
      }}>
        <React.Fragment>
          <ToolTip 
            position="bottom"
            title={(
              <ShortcutTipDesc />
            )}
            classNames={['_action-btn']}
            className="p10"
            onClick={() => this.show()}
            n="search"/>
          <div
            className={'search-container' + (isShow ? ' show-content' : '')}>
            <input
              ref={c => this._input = c}
              type="text"
              placeholder="搜索菜单，首字母组合更快哦"
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
                    code => {
                      let item = codeMapper[code] || '';
                      return item.indexOf(searchMap) != -1 || code.indexOf(searchMap.toUpperCase()) != -1;
                    }
                  )
                  .map((code, idx) => {
                    return (
                      <Link
                        className="result-item"
                        key={code}
                        to={code}
                        onClick={e => {
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
