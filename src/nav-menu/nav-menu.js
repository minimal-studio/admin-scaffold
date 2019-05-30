import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Storage from 'basic-helper/storage';
import { DebounceClass, Call } from 'basic-helper';
import { ToolTip, Icon, PureIcon } from '../ui-refs';

import { storageHelper } from '../config';

import { Link } from '../router-multiple';
import SearchBox from './search';

let delayExec = new DebounceClass();

const MENU_ACTIVE_STORAGE = 'MENU_ACTIVE_STORAGE';

function getScreenHeight() {
  return document.documentElement.clientHeight;
}

function getElementLeft(element) {
  if(!element) return;
  var actualLeft = element.offsetLeft;
  var current = element.offsetParent;
  while (current !== null) {
    actualLeft += (current.offsetLeft + current.clientLeft);
    current = current.offsetParent;
  }
  return actualLeft;
}

function getElementTop(element) {
  if(!element) return;
  var actualTop = element.offsetTop;
  var current = element.offsetParent;
  while (current !== null) {
    actualTop += (current.offsetTop + current.clientTop);
    current = current.offsetParent;
  }
  return actualTop;
}

const iconComFilter = ({ icon, pureIcon }, props, other) => {
  if(!icon && !pureIcon) return other;
  let I = pureIcon ? PureIcon : Icon;
  return <I {...props} n={pureIcon ? pureIcon : icon} />;
};

const MENU_CODE_MAPPER = 'MENU_CODE_MAPPER';

let menuCodeMapper = storageHelper.get(MENU_CODE_MAPPER, true) || {};

const MenuItem = (props) => {
  const { icon = 'bars', pureIcon, title, $T } = props;
  return (
    <div className="layout a-i-c">
      {iconComFilter({ icon, pureIcon }, {classNames: ['item-icon mr10']})}
      <span>{$T(title)}</span>
      <span className="flex" />
      <Icon n="angle-right" classNames={['direct']}/>
    </div>
  );
};

/**
 * 左菜单控件
 * 支持无限嵌套结构，支持“树”模式，支持“悬浮”模式
 * menuData 结构
 * {
 *   title: '',
 *   code: '',
 *   icon: '',
 *   child: [
 *     // 递归此结构, 避免和 react 的 children 冲突，故为 child
 *     {
 *       title: '',
 *       code: '',
 *       icon: '',
 *       child: []
 *     }
 *   ]
 * }
 */
export default class NavMenu extends Component {
  static propTypes = {
    onDidMount: PropTypes.func,
    menuMappers: PropTypes.shape({
      child: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.string,
    }),
    /* 是否悬浮模式的菜单模式 */
    flowMode: PropTypes.bool,
    $T: PropTypes.func,
    changeLang: PropTypes.func,
    logout: PropTypes.func,
    // lang: PropTypes.any,
    // i18nConfig: PropTypes.object,
    menuData: PropTypes.any.isRequired,
    onClickMenu: PropTypes.func
  };
  flowModeKey = 'IS_FLOW_MODA';
  constructor(props) {
    super(props);
    let showMenuMapper = Storage.getItem(MENU_ACTIVE_STORAGE) || '';
    try {
      showMenuMapper = JSON.parse(showMenuMapper);
    } catch (e) {
      showMenuMapper = {};
    }
    const storageMode = storageHelper.get(this.flowModeKey);
    const { defaultFlowMode = false, menuData } = props;

    window.MENU_DATA = menuData;

    this.state = {
      showMenuMapper,
      flowMenuConfig: {
        activeItem: {},
        activeIdx: '',
        isShow: false,
        offset: {
          top: 0,
          left: 0
        }
      },
      flowMode: storageMode ? (!!+storageMode) : defaultFlowMode
    };
  }
  componentDidMount() {
    Call(this.props.onDidMount, menuCodeMapper);
  }

  getNormalMenuChildren = initDataList => {
    if (!initDataList || !Array.isArray(initDataList)) return;
    // if(!initDataList || !Array.isArray(initDataList)) return console.error(initDataList, 'initDataList 参数错误');
    const { onClickMenu, $T } = this.props;
    const { showMenuMapper, flowMode } = this.state;
    let allSet = [];
    let foldIdx = 0;
    const recursive = (dataList) => {
      let currDOMSets = [];
      dataList.forEach((item, currItemIdx) => {
        if(!item) return;
        let _item = this.menuItemFilter(item);
        let { child, title, code } = _item;
        let key = code + title;
        let to = this.wrapLink(_item);

        let hasChildren = child && child.length > 0;
        let isFold = !code || hasChildren;

        let currFoldIdx = foldIdx;

        ++foldIdx;
        let isActive = showMenuMapper.hasOwnProperty(currFoldIdx);
        let dom = null;
        if (isFold) {
          let childDOM = null;
          if (hasChildren) {
            childDOM = recursive.call(this, child);
          }
          dom = (
            <div
              key={foldIdx}
              className={
                'fold fold-' +
                currFoldIdx +
                (flowMode ? '' : isActive ? ' active' : ' hide-fold')
              }>
              <div
                className="fold-title"
                onClick={e => {
                  !flowMode && this.toggleFold(e, currFoldIdx);
                }}>
                <MenuItem {..._item} $T={$T}/>
              </div>
              <div className="children">{childDOM}</div>
            </div>
          );
        } else {
          dom = this.getMenuLinkerDOM({
            ..._item,
            key,
            to,
            onClick: onClickMenu,
            menuText: title
          });
        }
        currDOMSets.push(dom);
      });
      return currDOMSets;
    };
    allSet = recursive.call(this, initDataList);
    return allSet;
  };
  hideFlowMenu = () => {
    delayExec.exec(() => {
      this.setFlowMenu({
        isShow: false
      });
    }, 200);
  }
  getMenuLinkerDOM = (options) => {
    const { code, key, to, onClick, menuText, icon, pureIcon } = options;
    const { $T } = this.props;
    menuCodeMapper[code] = menuText;
    storageHelper.set(MENU_CODE_MAPPER, menuCodeMapper, true);
    return (
      <Link
        key={key}
        className="menu"
        to={to}
        onClick={() => Call(onClick, key, code)}>
        {
          iconComFilter(options, {classNames: ['mr10']}, (
            <span className="menu-tip">-</span>
          ))
        }
        {$T(menuText)}
      </Link>
    );
  };
  getFlowModeDOM = initDataList => {
    const { flowMenuConfig } = this.state;
    const { $T, onClickMenu } = this.props;
    const { offset, activeItem = {}, activeIdx, isShow } = flowMenuConfig;

    const flowMenuDOM = (
      <div
        className={"flow-menu-container" + (isShow ? ' show' : '')}
        onMouseEnter={() => delayExec.cancel()}
        onMouseLeave={() => this.hideFlowMenu()}
        style={{
          left: offset.left
        }}
        ref={flowMenuContainer => {
          if (flowMenuContainer) {
            this.flowMenuContainer = flowMenuContainer;

            let flowContainerHeight = flowMenuContainer.offsetHeight;
            let flowContainerScrollTop = this.navMenuDOM ? this.navMenuDOM.scrollTop : 0;
            let expectedOffsetTop = offset.top - flowContainerScrollTop;
            let parentHeight = offset.height;
            let offsetBottom = expectedOffsetTop + flowContainerHeight;

            let overBottom = getScreenHeight() - offsetBottom;
            let finalOffsetTop = expectedOffsetTop;
            let flowMenuOffsetTopPx = parentHeight == flowContainerHeight ? 0 : parentHeight;

            if (overBottom < 0) {
              /**
               * 如果高度超过了底部
               */
              finalOffsetTop = expectedOffsetTop + overBottom;
            }
            flowMenuContainer.style.top = (finalOffsetTop - flowMenuOffsetTopPx) + 'px';
          }
        }}>
        {this.getNormalMenuChildren(activeItem.child)}
      </div>
    );

    const allSet = initDataList.map((item, idx) => {
      if(!item) return;
      let _item = this.menuItemFilter(item);
      let { child, title, code } = _item;
      let to = this.wrapLink(_item);
      let isFold = !code || (child && child.length > 0);
      let key = code + title;
      let isHovering = activeIdx == idx;
      return isFold ? (
        <div
          key={idx}
          onMouseEnter={(e) => {
            delayExec.cancel();
            const target = e.target;
            if (e.currentTarget !== target) return;
            this.setFlowMenu({
              targetElem: target,
              activeItem: _item,
              idx
            });
          }}
          onMouseLeave={() => {
            this.hideFlowMenu();
          }}
          className={'fold' + (isHovering ? ' hover' : '')}>
          <MenuItem {..._item} $T={$T}/>
        </div>
      ) : (
        this.getMenuLinkerDOM({
          ..._item,
          key,
          to,
          onClick: onClickMenu,
          menuText: title
        })
      );
    });

    return (
      <div className="nav-menu-tree">
        {allSet}
        {flowMenuDOM}
      </div>
    );
  };
  menuItemFilter = (item) => {
    const { menuMappers } = this.props;
    const { child, code, title, icon } = menuMappers;
    return {
      ...item,
      child: item[child],
      code: item[code],
      title: item[title],
      icon: item[icon],
    };
  }
  showSearch = () => {

  }
  wrapLink = ({path, code}) => {
    return path ? code + '?' + path : code;
  }
  changeMenuUIMode = (isFlowMode) => {
    this.setState({
      flowMode: isFlowMode
    });
    storageHelper.set(this.flowModeKey, isFlowMode ? '1' : '0');
  }
  toggleFold = (e, idx, isShow) => {
    e.stopPropagation();
    const { showMenuMapper } = this.state;
    let nextState = Object.assign({}, showMenuMapper);

    if (typeof isShow != 'undefined') {
      isShow ? (nextState[idx] = true) : delete nextState[idx];
    } else {
      if (nextState.hasOwnProperty(idx)) {
        delete nextState[idx];
      } else {
        nextState[idx] = true;
      }
    }

    Storage.setItem(MENU_ACTIVE_STORAGE, JSON.stringify(nextState));
    this.setState({
      showMenuMapper: nextState
    });
  }
  setFlowMenu = (options) => {
    const { flowMenuConfig } = this.state;
    const { targetElem, activeItem, isShow = true, idx } = options;
    let nextOffset = flowMenuConfig.offset;

    if (targetElem) {
      let { offsetWidth, offsetHeight } = targetElem;
      nextOffset = {
        top: getElementTop(targetElem),
        left: getElementLeft(targetElem) + offsetWidth,
        height: offsetHeight
      };
    }
    this.setState({
      flowMenuConfig: {
        offset: nextOffset,
        activeIdx: idx,
        activeItem,
        isShow
      }
    });
  }
  render() {
    const {
      menuData,
      onClickMenu,
      onToggleNav,
      title = 'UKE-Dashboard',
      // username,
      // logout,
      $T,
      show
    } = this.props;

    const { flowMode } = this.state;

    const menuTree = flowMode ? (
      this.getFlowModeDOM(menuData)
    ) : (
      <div className="nav-menu-tree">
        {this.getNormalMenuChildren(menuData)}
      </div>
    );

    const renderRes = (
      <div className={'nav-menu-wrapper ' + (show ? 'show' : 'collapse')}>
        <div
          ref={navMenuDOM => {
            if(navMenuDOM) this.navMenuDOM = navMenuDOM;
          }}
          className={
            'nav-menu-response ' +
            (flowMode ? 'flow-mode ' : 'tree-mode ')
          }>
          <div className="menu-header">
            <h4 className="title">
              {title}
            </h4>
            <hr />
            <div className="action-group">
              <SearchBox
                ref={e => this._seatchBox = e}
                $T={$T}
                onClickMenu={onClickMenu}
                onToggleNav={onToggleNav}
                codeMapper={menuCodeMapper}
                showMenu={show}/>
              <ToolTip 
                position="bottom"
                title={$T('切换到') + $T(!flowMode ? '悬浮' : '传统') + $T('模式')}
                classNames={['_action-btn']}
                className="p10"
                onClick={() => this.changeMenuUIMode(!flowMode)}
                n={flowMode ? "bars" : "bolt"}/>
              <span className="flex" />
              <ToolTip
                onClick={() => onToggleNav(!show)}
                title={`${$T(show ? "收起" : "展开")}${$T('菜单')}（${$T('快捷键')}：alt + alt）'`}
                n={!show ? "greater-than" : "less-than"}/>
            </div>
          </div>
          {menuTree}
        </div>
      </div>
    );

    return renderRes;
  }
}
