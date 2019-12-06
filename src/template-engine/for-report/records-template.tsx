/* eslint-disable consistent-return */
/**
 * @author Alex
 */

import React, { Component, PureComponent } from 'react';

import {
  GetFloatLen, ToggleBasicFloatLen, HasValue, DebounceClass, Call
} from '@mini-code/base-func';

import { getScreenInfo } from '../../utils/dom';
import {
  Pagination, TableCard,
  Loading, Button, Toast,
  Table, ConditionGenerator,
  getElementOffset, DropdownMenu, Switch
} from '../../ui-refs';
import {
  ReportTemplateProps, GetQueryDataResult, ReportTemplateState
} from './types';

const delayExec = new DebounceClass();

const offsetBottom = 40;

const autoRefreshOptions = {
  0: '关闭',
  2: '自动',
  15: '15秒',
  30: '30秒',
  45: '45秒',
  60: '60秒',
};

export default class ReportTemplate<
  P extends ReportTemplateProps = ReportTemplateProps
> extends Component<P | ReportTemplateProps, ReportTemplateState> {
  static defaultProps = {
    autoQuery: false,
    defaultExpandCon: false,
    didMountQuery: true,
    needAutoRefresh: false,
    needClearBtn: true,
    hideFloatable: true,
    needCount: false,
    calculateHeight: true,
    querying: true,
    isMobile: false,
    needCheck: false,
    loadingCondition: false,
    showCondition: true,
    needPaging: true,
    template: 'Table',
    conditionOptions: [],
    $T: (str) => str,
    resDesc: '',
  }

  defaultPagin = {};

  audioMask = true;

  refreshTime = 15;

  templateDOM;

  refreshTimer;

  soundUrl;

  soundType;

  soundRef

  toast

  conditionHelper

  didMountQueried

  tableContainerRef

  __unmount

  __setHeight

  _tableRef

  checkedItems

  constructor(props) {
    super(props);

    this.state = {
      displayFloat: GetFloatLen() !== 0,
      tableHeight: props.height || 200,
      expandCon: props.defaultExpandCon
    };

    const { soundUrl } = props;
    if (soundUrl) this.setSoundUrl(soundUrl);
  }

  getDataRows = () => {
    return this.props.dataRows || this.props.records || [];
  }

  componentDidMount() {
    this.defaultPagin = this.props.pagingInfo;
    this.setAutoRefreshTimer();
  }

  componentDidUpdate() {
    this.setTableContainerHeight();
  }

  componentWillUnmount() {
    this.restoreBasicFloatLen();
    this.__unmount = true;
    this.didMountQueried = false;
    this.clearAutoRefreshTimer();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { needAutoRefresh = false, dataRows, records } = this.props;
    if (needAutoRefresh && this.audioMask && (nextProps.dataRows != dataRows || nextProps.records != records)) {
      this.soundRef.play();
    }
    return true;
  }

  setSoundUrl = (nextUrl) => {
    this.soundUrl = nextUrl;
    const soundSplit = nextUrl.split('.');
    this.soundType = soundSplit[soundSplit.length - 1];
  }

  setAutoRefreshTimer = () => {
    if (!this.props.needAutoRefresh) return;
    if (this.refreshTime === 0) {
      this.clearAutoRefreshTimer();
    } else {
      this.clearAutoRefreshTimer();
      this.refreshTimer = setTimeout(() => {
        this.handleQueryData(null, this.setAutoRefreshTimer);
      }, this.refreshTime * 1000);
    }
  }

  clearAutoRefreshTimer = () => {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  changeRefreshTime = (nextTime) => {
    this.refreshTime = nextTime;
    this.setAutoRefreshTimer();
  }

  clearCheckeds = () => {
    this._tableRef.clearCheckeds();
  }

  handleRes = ({ resDesc, hasErr }) => {
    hasErr && this.toast.show(resDesc, hasErr ? 'error' : 'success');
  }

  whenMountedQuery = (data) => {
    if (this.didMountQueried) return;
    delayExec.exec(() => {
      this.handleQueryData(data);
      this.didMountQueried = true;
    }, 100);
  }

  refreshData = () => {
    this.props.onQueryData(this.getQueryData());
  }

  /**
   * 获取查询条件
   * @param {object} conditionData 查询条件
   * @param {object} nextPagin 下一个分页数据
   * @param {boolean} [merge=true] 是否把 conditionData 合并到 this.conditionHelper.value 之中
   * @memberof ReportTemplate
   */
  getQueryData = (conditionData?, nextPagin?, merge = true): GetQueryDataResult => {
    const _conditionData = merge
      ? Object.assign({}, this.conditionHelper.value, conditionData)
      : conditionData || this.conditionHelper.value;
    return {
      nextPagin: nextPagin || this.props.pagingInfo,
      conditionData: _conditionData,
      selectedItems: this.checkedItems
    };
  }

  setTableContainerHeight = () => {
    const tableContainer = this.tableContainerRef;
    if (this.__setHeight || !tableContainer) return;
    delayExec.exec(() => {
      if (this.__unmount) return;
      const tableContainerOffsetTop = getElementOffset(tableContainer).offsetTop;
      /** 高度调整策略，如果该页面被隐藏，则在下一次 update 的时候更新此高度，保证高度的正确性 */
      if (tableContainerOffsetTop === 0) {
        this.__setHeight = false;
        return;
      }

      const tableContainerHeight = getScreenInfo().screenHeight - tableContainerOffsetTop - offsetBottom;
      this.setState({
        tableHeight: tableContainerHeight
      });
      this.__setHeight = true;
    }, 100);
  }

  restoreBasicFloatLen = () => {
    if (GetFloatLen() == 0) {
      ToggleBasicFloatLen();
    }
  }

  /**
   * 小数点开关
   * 在管理中心的时候可以用，但是关闭管理中心后必须设置回去
   */
  toggleFloat = () => {
    const isDisplay = ToggleBasicFloatLen();
    this.setState({
      displayFloat: isDisplay
    });
  }

  handleQueryData = (val?, callback?) => {
    const data = Object.assign({}, this.getQueryData(val, this.defaultPagin), {
      onGetResInfo: this.handleRes, callback
    });
    this.props.onQueryData(data);
  }

  handleChangeCondition = (val, ref) => {
    const { autoQuery, onChangeCondition } = this.props;

    delayExec.exec(() => {
      Call(onChangeCondition, val, ref);
    }, 200);

    if (!autoQuery || !HasValue(val[ref])) return;

    delayExec.exec(() => {
      this.handleQueryData(val);
      Call(onChangeCondition, val, ref);
    }, 200);
  }

  saveConditionRef = (e) => {
    if (e) {
      this.conditionHelper = e;
      if (this.props.didMountQuery) this.whenMountedQuery(e.value);
    }
  }

  handlePagin = (nextPagin) => {
    this.props.onQueryData({
      nextPagin,
      conditionData: this.conditionHelper.value,
    });
  }

  toggleCondition = (isExpand) => {
    this.setState({
      expandCon: isExpand
    });
    this.__setHeight = false;
    setTimeout(() => this.setTableContainerHeight(), 200);
  }

  saveWarnRef = (e) => { this.soundRef = e; }

  saveToast = (toast) => { this.toast = toast; }

  renderAutoRefresh = () => {
    return (
      <span className="mr10 layout a-i-c">
        <span className="mr10" />
        <DropdownMenu
          needCancel={false}
          position="right"
          defaultValue={this.refreshTime}
          values={autoRefreshOptions}
          onChange={this.changeRefreshTime}
        />
        <span className="ms10">声音</span>
        <Switch
          onChange={(val) => {
            this.audioMask = val;
            if (!this.soundUrl) return console.warn('请先通过 ReportTemplateRef.setSoundUrl 设置声音的 url');
            if (!val) this.soundRef.pause();
          }}
          defaultChecked={this.audioMask}
        />
        <audio id="soundRef" ref={this.saveWarnRef}>
          {
            this.soundUrl && <source src={this.soundUrl} type={`audio/${this.soundType}`} />
          }
        </audio>
      </span>
    );
  }

  renderActionBtns = (actionBtns) => {
    return actionBtns.map((btn) => {
      const { text, action, color = 'default' } = btn;
      return (
        <Button
          key={text}
          text={this.props.$T(text)}
          color={color}
          className="mr10"
          onClick={action}
        />
      );
    });
  }

  renderToggleBtn = () => {
    const { $T } = this.props;
    const { expandCon } = this.state;
    return (
      <Button
        icon={expandCon ? "chevron-up" : "chevron-down"}
        color="default"
        className="mr10"
        onClick={(e) => this.toggleCondition(!expandCon)}
      >
        {$T('扩展搜索')}
      </Button>
    );
  }

  renderFuncBtns = () => {
    const {
      querying, actionBtns,
      conditionOptions, $T, hideFloatable,
      needClearBtn, needAutoRefresh
    } = this.props;
    const hasConditionOptions = conditionOptions.length > 0;
    const { displayFloat } = this.state;

    return (
      <div className="action-area layout">
        <Button
          text={$T('查询')}
          type="submit"
          className="mr10"
          loading={querying}
          onClick={(e) => {
            this.handleQueryData();
          }}
        />
        {
          needClearBtn && hasConditionOptions && (
            <Button
              text={$T('清空')}
              color="red"
              className="mr10"
              onClick={(e) => {
                this.conditionHelper.clearValue();
              }}
            />
          )
        }
        {
          !hideFloatable && (
            <Button
              text={$T(displayFloat ? '隐藏小数点' : '显示小数点')}
              color="default"
              className="mr10"
              onClick={(e) => this.toggleFloat()}
            />
          )
        }
        {
          actionBtns && this.renderActionBtns(actionBtns)
        }
        <span className="flex"></span>
        {
          this.renderToggleBtn()
        }
        {
          needAutoRefresh && this.renderAutoRefresh()
        }
      </div>
    );
  }

  render() {
    const {
      pagingInfo, querying, children, template,
      needCount, showCondition, needCheck, whenCheckAction, checkedOverlay,
      needPaging, loadingCondition, height, actionBtns, infoMapper,
      conditionOptions, $T, keyMapper, columns, hideFloatable, calculateHeight,
      sortIgnores, needInnerSort, needClearBtn, needAutoRefresh, propsForTable
    } = this.props;
    const dataRows = this.getDataRows();

    const _columns = columns || keyMapper;

    const hasConditionOptions = conditionOptions.length > 0;
    const { displayFloat, tableHeight, expandCon } = this.state;

    const _tableH = height || tableHeight;

    switch (template) {
      case 'TableCard':
        this.templateDOM = (
          <>
            <Loading loading={!!querying} inrow />
            <TableCard columns={_columns} dataRows={dataRows}/>
          </>
        );
        break;
      case 'Table':
      default:
        const _propsForTable = {
          ...propsForTable,
          needCheck,
          columns: _columns,
          whenCheckAction,
          checkedOverlay,
          sortIgnores,
          needInnerSort,
          needCount,
          dataRows,
          height: _tableH,
        };
        this.templateDOM = (
          <div className="table-container" ref={(e) => {
            if (!calculateHeight || height || !e || dataRows.length === 0) return;
            this.tableContainerRef = e;
            this.setTableContainerHeight();
          }}
          >
            <div className="table-scroll">
              <Loading loading={!!querying} inrow />
              <Table
                {..._propsForTable}
                onChange={(emitVal, config) => {
                  switch (config.type) {
                    case 'selector':
                      // 为 selector 修改 conditionHelper 的值，做缓存
                      this.conditionHelper.changeValues(emitVal);
                      break;
                  }
                }}
                ref={(e) => { this._tableRef = e; }}
                onCheck={(nextItems) => {
                  this.checkedItems = nextItems;
                }}
              />
            </div>
          </div>
        );
        break;
    }
    if (!this.templateDOM) {
      return (
        <span>{$T('没有对应的模板')}</span>
      );
    }
    const pagingDOM = needPaging && pagingInfo && (
      <Pagination
        pagingInfo={pagingInfo}
        infoMapper={infoMapper}
        onPagin={this.handlePagin}
      />
    );
    const conditionHelper = !loadingCondition && (
      <ConditionGenerator
        style={{
          height: expandCon ? 'auto' : 48
        }}
        ref={this.saveConditionRef}
        onChange={this.handleChangeCondition}
        conditionConfig={conditionOptions}
        onSubmit={(e) => {
          console.log(e);
          this.handleQueryData();
        }}
      />
    );
    // const actionArea = ;

    return (
      <div className="report-table-layout">
        <Toast ref={this.saveToast}/>
        <div
          className={`report-fix-con ${(showCondition ? '' : ' hide')} ${expandCon ? 'expand' : 'collapse'}`}
        >
          {conditionHelper}
          {this.renderFuncBtns()}
          {children}
        </div>
        <div>
          {pagingDOM}
        </div>
        {this.templateDOM}
      </div>
    );
  }
}
