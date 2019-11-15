import { setUIConfig } from "@deer-ui/core/utils/config";

// import { initFields } from '../lib/fields';
import { SetFloatLen } from "@mini-code/base-func";

import { $request } from "@dashboard/services/req-filter";
import FrontEndNameMappers from "./key-mappers";
import { iconMapper, iconPrefix } from "./icon-mapper";

import "./listener";

/** 统一设置数字格式化的浮点位数 */
SetFloatLen(4);

function SetGateUrl(selectedGate) {
  /**
   * 统一修改 gate url 的接口
   */
  const gateUrl = selectedGate;

  /**
   * 设置完线路，需要把 $request 和 PollingEntity 对象中的请求地址也修改才能生效
   */
  $request.setConfig({
    baseUrl: gateUrl
  });
}

(function init() {
  SetGateUrl(window.ManagerURL);
}());

export function getKeyMap(key) {
  const keyMapper = Object.assign({}, window.KEY_MAPPERS);
  return key === "all" ? keyMapper : keyMapper[key] || key || "";
}

export function getImage(imageMapperKey, extendPath) {
  if (!imageMapperKey) return console.log("Wrong parameters");
  let result = window.$Config.IMAGE_MAPPER[imageMapperKey] || "";
  if (extendPath) result = `${result.replace(/\/$/, "")}/${extendPath}`;
  return result;
}

const commonFuncs = {
  getImage,
  getKeyMap,
  $request,
  isMobile: /Android|iOS/.test(window.navigator.userAgent)
};

setUIConfig(
  Object.assign({}, commonFuncs, {
    iconMapper,
    iconPrefix
  })
);

/**
 * 为了已经被定义的不被覆盖，保证全局变量的唯一性与不可更改性
 * 例如
 * window.$request = null，这是不起作用的
 */
Object.defineProperties(window, {
  $R: {
    value: $request,
    writable: false
  },
  $request: {
    value: $request,
    writable: false
  }
});

Object.assign(window, {
  KEY_MAPPERS: Object.assign({}, window.KEY_MAPPERS, FrontEndNameMappers)
});

// initFields();
