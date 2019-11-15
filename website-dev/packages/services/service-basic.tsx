/* eslint-disable default-case */
/**
 * Author: Alex
 * Desc: 继承于 ActionAgent，基础 Services，提供请求的状态管理机制
 * 提供 reqAgent 机制，管理请求的生命周期，管理对应的接口的状态
 */

import React, { Component, PureComponent } from "react";

import {
  Call,
  ToBasicUnitMoney,
  DebounceClass,
  IsEmail,
  IsPhoneNumber,
  HasValue,
  EventEmitter
} from "@mini-code/base-func";
import { getUrlParams } from "@mini-code/request";
import ActionAgent from "@deer-ui/admin-scaffold/action-agent";
import { Notify, ShowModal, CloseModal } from "@deer-ui/core";

import * as APIs from "./apis";
import * as paginHelper from "../utils/pagination-helper";
import { Conditions, Forms } from "./forms";
import { getFromMapper, getFromMapperSync } from "./forms/utils";
import { getFields, setFields, getFieldsConfig } from "./fields";

window.addEventListener("error", e => {
  Notify({
    config: {
      title: "未处理异常错误",
      text: e.message,
      timer: 0
    }
  });
});

export default class Services extends ActionAgent {
  apis = APIs;

  getFields = getFields;

  setFields = setFields;

  getFieldsConfig = getFieldsConfig;

  paginHelper = paginHelper;

  /** 用于注册 conditions */
  conditions = Conditions;

  /** 用于注册 forms */
  forms = Forms;

  /** 原生的 getFormOptions 的方法，调用方式 this.getFromMapper(this.[conditions | forms][, ...]) */
  getFromMapper = getFromMapper;

  getFromMapperSync = getFromMapperSync;

  showDesc!: Function;

  // reportData 的默认数据
  reportData = {
    conditionData: {},
    nextPagin: paginHelper.getDefPagin()
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      hasErr: false,
      resDesc: "",
      resData: {},
      records: [],
      infoMapper: paginHelper.getPaginMapper(),
      pagingInfo: paginHelper.getDefPagin(),
      propsForTable: {
        /** 统一设置 action 为固定右边的列 */
        fixedRightKeys: ["action"],
        /** 返回 record.ID 作为 Table 的 row 的 key，提高 Table 的渲染性能 */
        rowKey: record => record.ID
      }
    };
  }

  saveRef = ref => e => (this[ref] = e);

  showResDesc(desc, message) {
    if (desc == "success") {
      desc = "成功";
    }
    (this.toast || this.FormRef.toast).show(
      desc,
      message == "success" ? "success" : "error"
    );
  }

  /**
   * 通过 url 的参数传递说明
   * 解析目标 https://hostname?[ref1]=[value1]&&[...]
   * 会解析为 {
   *   [refs]: [value1]
   *   ...
   * } 并且作为 conditionOptions 或者 formOptions 的 defaultValue merge 到最终结果之中
   *
   * @param {*} options
   */
  paramsFilter = val => {
    let res = decodeURIComponent(val);
    switch (true) {
      case HasValue(+val):
        res = +val;
        break;
      case res.indexOf(",") !== -1:
        res = res.split(",");
        res.forEach((item, idx) => (res[idx] = this.paramsFilter(item)));
        break;
    }
    return res;
  };

  conditionFilterFromUrl(options, needMerge = true, _params?) {
    const conditionOptions = [...options];
    let params = _params;
    if (!_params) params = getUrlParams();
    if (Object.keys(params).length > 0 && needMerge) {
      conditionOptions.forEach((item, idx) => {
        const { ref, refForS, refs } = item;
        if (refForS && params[refForS]) {
          conditionOptions[idx].defaultValueForS = this.paramsFilter(
            params[refForS]
          );
        }
        if (ref && params[ref]) {
          conditionOptions[idx].defaultValue = this.paramsFilter(params[ref]);
        }
        if (refs && params[refs[0]]) {
          conditionOptions[idx].range = [
            this.paramsFilter(params[refs[0]]),
            this.paramsFilter(params[refs[1]])
          ];
        }
      });
    }

    return conditionOptions;
  }

  async getConditionsSync(...args) {
    const conditionOptions = await getFromMapperSync(this.conditions, ...args);
    return this.conditionFilterFromUrl(conditionOptions);
  }

  /**
   * 获取查询条件
   *
   * @param {Array} options 需要获取的查询条件的名字们
   * @param {Object} merge 需要合并到结果集的对象
   * @returns {Array}
   * @memberof Services
   */
  getConditions(...args) {
    const conditionOptions = getFromMapper(this.conditions, ...args);
    return this.conditionFilterFromUrl(conditionOptions);
  }

  async getFormsSync(...args) {
    const conditionOptions = await getFromMapperSync(this.forms, ...args);
    return this.conditionFilterFromUrl(conditionOptions);
  }

  getForms(...args) {
    const conditionOptions = getFromMapper(this.forms, ...args);
    return this.conditionFilterFromUrl(conditionOptions, false);
  }

  componentDidCatch = (error, info) => {
    Notify({
      config: {
        title: "程序异常提示",
        timer: -1,
        text: (
          <div>
            <p>
              error:
              {error}
            </p>
            <p>
              info:
              {info}
            </p>
          </div>
        )
      }
    });
  };

  /**
   * 重写 ActionAgent 的 resStatus 接口
   * 调用顺序为接口 return 前
   * @param {object} res 远端返回的数据
   */
  resStatus = res => {
    this.showDesc &&
      this.showDesc({
        title: "消息提示",
        msg: res.err,
        type: res.err ? "error" : "success"
      });
  };

  /**
   * 重写 ActionAgent 的接口
   * 调用顺序为接口返回数据后， setState 前
   * @param {object} res 远端返回的数据
   */
  _after = res => ({});

  checkForm = formRef => {
    const checkRes = formRef.checkForm();
    if (!checkRes.isPass) {
      return this.stateSetter({
        hasErr: true,
        resDesc: checkRes.desc
      });
    }
    return checkRes.isPass;
  };

  reportDataFilter = ({ conditionData, nextPagin }) => {
    /**
     * 这里需要根据业务字段配置对应的
     */
    return {
      data: conditionData,
      pagin: nextPagin
    };
  };
}
