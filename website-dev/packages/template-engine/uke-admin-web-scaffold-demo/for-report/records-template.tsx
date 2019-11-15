/**
 * 组件名    通用报表布局
 * 作者      Alex
 * 日期      2018-07-30
 */

import React, { Component, PureComponent } from "react";

import {
  GetFloatLen,
  ToggleBasicFloatLen,
  HasValue,
  DebounceClass
} from "@mini-code/base-func";
import {
  PagingBtn,
  RecordItemsHelper,
  Loading,
  Button,
  Toast,
  TableBody,
  ConditionGenerator
} from "@deer-ui/core";

import TemplateClass from "@deer-ui/admin-scaffold/template-engine/for-report/records-template";

const delayExec = new DebounceClass();

export default class ReportTemplate extends TemplateClass {
  constructor(props) {
    super(props);

    this.state = {
      checkedItems: {},
      displayFloat: GetFloatLen() != 0,
      tableHeight: props.height || 200
    };
  }

  render() {
    const {
      records = [],
      pagingInfo = {},
      querying = true,
      children,
      template,
      needCount,
      autoQuery,
      showCondition,
      needCheck,
      whenCheckAction,
      checkedOverlay,
      needPaging,
      loadingCondition,
      height,
      conditionOptions,
      isMobile,
      gm,
      columns,
      onQueryData
    } = this.props;

    const { checkedItems, displayFloat, tableHeight } = this.state;

    // let _thumbKeyMapper = !isMobile ? columns : columns.filter(item => {
    //   const itemKey = item.key;
    //   return !/Remark|Time|OrderId|Id|Date|Config/.test(itemKey)
    //          && !item.datetime
    //          && !item.date;
    // });

    let templateDOM;
    const _tableH = height || tableHeight;

    switch (template) {
      case "Table":
        templateDOM = (
          <div className="table-container" ref={e => (this.renderContent = e)}>
            <div className="table-scroll">
              <Loading loading={querying} inrow>
                <TableBody
                  height={_tableH}
                  columns={columns}
                  needCheck={needCheck}
                  whenCheckAction={whenCheckAction}
                  checkedOverlay={checkedOverlay}
                  onCheck={nextItems => {
                    this.checkedItems = nextItems;
                  }}
                  records={records}
                  needCount={needCount}
                />
              </Loading>
            </div>
          </div>
        );
        break;
      case "CardTable":
        templateDOM = (
          <Loading loading={querying} inrow>
            <RecordItemsHelper columns={columns} records={records} />
          </Loading>
        );
    }
    if (!templateDOM) {
      return <span>{gm("没有对应的模板")}</span>;
    }
    const pagingDOM = needPaging ? (
      <PagingBtn
        pagingInfo={pagingInfo}
        onPagin={nextPagin => {
          onQueryData({
            nextPagin,
            conditionData: this.conditionHelper.value
          });
        }}
      />
    ) : null;
    const conditionHelper = loadingCondition ? null : (
      <ConditionGenerator
        ref={conditionHelper => {
          if (conditionHelper) {
            this.conditionHelper = conditionHelper;
            this.whenMountedQuery(conditionHelper.value);
          }
        }}
        onChange={(val, ref) => {
          if (!autoQuery || !HasValue(val[ref])) return;

          delayExec.exec(() => {
            this.handleQueryData(val);
          }, 200);
        }}
        conditionConfig={conditionOptions || []}
        className={showCondition ? undefined : "hide"}
      />
    );
    const actionArea = (
      <div className="action-area">
        <Button
          text={gm("查询")}
          loading={querying}
          onClick={e => this.handleQueryData()}
        />
        <Button
          text={gm(displayFloat ? "隐藏小数点" : "显示小数点")}
          className="default ml10"
          onClick={e => this.toggleFloat()}
        />
      </div>
    );

    return (
      <div className="report-table-layout">
        <Toast ref={toast => (this.toast = toast)} />
        <div
          className="report-fix-con"
          ref={e => {
            this.fixGroup = e;
            if (this.__setHeight) return;
            setTimeout(() => {
              this.setTableContainerHeight(e);
            }, 300);
            this.__setHeight = true;
          }}
        >
          {conditionHelper}
          {actionArea}
          {children}
        </div>
        <div>{pagingDOM}</div>
        {templateDOM}
      </div>
    );
  }
}
