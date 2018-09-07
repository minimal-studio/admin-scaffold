/**
 * 组件名    通用报表布局
 * 作者      Alex
 * 日期      2018-07-30
 */

import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { GetFloatLen, ToggleBasicFloatLen, HasValue, DebounceClass } from 'basic-helper';
import {
  PagingBtn, RecordItemsHelper,
  Loading, Button, Toast,
  TableBody, ConditionGenerator
} from 'ukelli-ui';

const delayExec = new DebounceClass();

export default class ReportTemplate extends Component {
  static propTypes = {
    onQueryData: PropTypes.func.isRequired,
    showCondition: PropTypes.bool,
    loadingCondition: PropTypes.bool,
    needPaging: PropTypes.bool,
    needCheck: PropTypes.bool,
    autoQuery: PropTypes.bool,
    didMountQuery: PropTypes.bool,
    needCount: PropTypes.bool,
  
    keyMapper: PropTypes.array.isRequired,
    conditionOptions: PropTypes.array,
  
    records: PropTypes.array.isRequired,
    pagingInfo: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    template: PropTypes.string,
    hasErr: PropTypes.bool,
    resDesc: PropTypes.string
  };
  static defaultProps = {
    autoQuery: false,
    didMountQuery: true,
    needCount: false,
    showCondition: true,
    needPaging: true,
  }
  constructor(props) {
    super(props);

    this.state = {
      checkedItems: {},
      displayFloat: GetFloatLen() != 0
    };
  }

  componentWillUnmount() {
    this.restoreBasicFloatLen();
  }

  restoreBasicFloatLen() {
    if(GetFloatLen() == 0) {
      ToggleBasicFloatLen();
    }
  }

  toggleFloat() {
    /**
     * 在管理中心的时候可以用，但是关闭管理中心后必须设置回去
     */
    let isDisplay = ToggleBasicFloatLen();
    this.setState({
      displayFloat: isDisplay
    });
  }

  // componentWillReceiveProps(nextProps) {
  //   if((this.props.loading !== nextProps.loading && nextProps.hasErr && !nextProps.loading) || this.props.hasErr !== nextProps.hasErr) {
  //     this.toast.show(nextProps.resDesc, nextProps.hasErr ? 'error' : 'success');
  //   }
  // }

  getQueryData(conditionData) {
    return {
      nextPaging: $MN.DefaultPaging,
      conditionData: conditionData || this.conditionHelper.value
    }
  }

  toggleSelectItem(item, idx) {
    let nextCheckedItems = this.state.checkedItems;
    if(nextCheckedItems[idx]) {
      delete nextCheckedItems[idx];
    } else {
      nextCheckedItems[idx] = item;
    }
    this.selectItems(nextCheckedItems);
  }

  toggleAllItems(allCheck) {
    let nextCheckedItems = this.state.checkedItems;
    if(!allCheck) {
      nextCheckedItems = {};
    } else {
      this.props.records.forEach((item, idx) => nextCheckedItems[idx] = item);
    }
    this.selectItems(nextCheckedItems);
  }

  selectItems(nextState) {
    this.setState({
      checkedItems: nextState
    });
  }

  checkTableFilter() {
    const {
      keyMapper = [], needCheck = false
    } = this.props;

    let checkExtend = {
      key: 'checkbox',
      filter: (str, item, mapper, idx) => {
        // console.log()
        let checked = !!this.state.checkedItems[idx];
        return (
          <input type="checkbox" checked={checked} onClick={e => this.toggleSelectItem(item, idx)}/>
        )
      }
    }

    let result = needCheck ? [checkExtend, ...keyMapper] : keyMapper;

    return result;
  }

  whenMountedQuery = (data) => {
    if(this.didMountQueried) return;
    delayExec.exec(() => {
      this.handleQueryData(data);
    }, 100);
    this.didMountQueried = true;
  }

  handleQueryData(val) {
    this.props.onQueryData(Object.assign({}, this.getQueryData(val), {
      onGetResInfo: this.handleRes
    }));
  }

  handleRes = ({resDesc, hasErr}) => {
    hasErr && this.toast.show(resDesc, hasErr ? 'error' : 'success');
  }

  render() {
    const {
      records = [], pagingInfo = {}, loading = '', children, template = 'table',
      needCount, autoQuery, showCondition,
      needPaging, loadingCondition = false,
      conditionOptions, isMobile, gm,
      onQueryData
    } = this.props;

    const {checkedItems, displayFloat} = this.state;

    const keyMapper = this.checkTableFilter();
    const isAllCheck = Object.keys(checkedItems).length == records.length;

    let _thumbKeyMapper = !isMobile ? keyMapper : keyMapper.filter(item => {
      const itemKey = item.key;
      return !/Remark|Time|OrderId|Id|Date|Config/.test(itemKey)
             && !item.datetime
             && !item.date;
    });

    let templateDOM = null;
    switch (template) {
      case 'table':
        templateDOM = (
          <div className="table-container" ref="renderContent">
            <div className="table-scroll">
              <Loading loading={loading} inrow={true}>
                <TableBody
                  onCheckAll={e => this.toggleAllItems(e)}
                  allCheck={isAllCheck}
                  keyMapper={_thumbKeyMapper}
                  records={records}
                  needCount={needCount}/>
              </Loading>
            </div>
          </div>
        )
        break;
      case 'RecordItemsHelper':
        templateDOM = (
          <Loading loading={loading} inrow={true}>
            <RecordItemsHelper keyMapper={keyMapper} records={records}/>
          </Loading>
        )
    }
    if(!templateDOM) return (
      <span>{gm('没有对应的模板')}</span>
    );
    const pagingDOM = needPaging ? (
      <PagingBtn
        pagingInfo={pagingInfo}
        onPagin={nextPaging => {
          onQueryData({
            nextPaging,
            conditionData: this.conditionHelper.value
          });
      }}/>
    ) : null;
    const conditionHelper = loadingCondition ? null : (
      <ConditionGenerator
        ref={conditionHelper => {
          if(conditionHelper) {
            this.conditionHelper = conditionHelper;
            this.whenMountedQuery(conditionHelper.value);
          }
        }}
        onChange={(val, ref) => {
          if(!autoQuery || !HasValue(val[ref])) return;

          delayExec.exec(() => {
            this.handleQueryData(val);
          }, 200);
        }}
        conditionConfig={conditionOptions || []}
        className={showCondition ? undefined : 'hide'}>
      </ConditionGenerator>
    );
    const actionArea = (
      <div className="action-area">
        <Button
          text={gm("查询")}
          loading={loading}
          onClick={e => this.handleQueryData()}/>
        <Button
          text={gm(displayFloat ? '隐藏小数点' : '显示小数点')}
          className="default ml10"
          onClick={e => this.toggleFloat()}/>
      </div>
    )

    return (
      <div className="report-table-layout">
        <Toast ref={toast => this.toast = toast}/>
        <div className="report-fix-con" ref="fixReportCon">
          {conditionHelper}
          {actionArea}
          {children}
        </div>
        {templateDOM}
        {pagingDOM}
      </div>
    )
  }
}
