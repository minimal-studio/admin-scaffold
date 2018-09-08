/**
 * 与 uke web server 通讯的 api 接口
 */

import { wrapReqHashUrl, RequestClass } from 'uke-request';

let $R = new RequestClass();

let apiUrl = '';
let defaultUsername = '';

let projectUrl = '';
let delProjectUrl = '';
let assetUrl = '';
let delAssetUrl = '';
let releaseUrl = '';
let uploadUrl = '';
let auditUrl = '';
let rollbackUrl = '';
let joinInUrl = '';

let jsonHeader = {
  "Content-Type": "application/json"
};

let uploadHeader = {
  "Content-Type": "application/x-www-form-urlencoded",
  // "Content-Type": "multipart/form-data;boundary=----WebKitFormBoundaryyrV7KO0BoCBuDbTL"
};

/**
 * 处理 fetch 回调
 */
async function parseToJson(fetchRes) {
  let res = null;
  try {
    res = await fetchRes.json();
  } catch(e) {
    console.log(e)
  }
  return res;
}

/**
 * 设置 F-E-Deployment 模块的配置
 */
export function setFEDeployConfig({username, apiUrl}) {
  setDefaultUser(username);
  setApiUrl(apiUrl);
}

/**
 * 设置默认的操作者的用户名
 */
export function setDefaultUser(username) {
  defaultUsername = username;
}

/**
 * 设置 APIs 的地址
 */
export function setApiUrl(url) {
  apiUrl = url;
  apiUrl = apiUrl.replace(/\/$/, '');
  projectUrl = apiUrl + '/project';
  delProjectUrl = apiUrl + '/del-project';
  delAssetUrl = apiUrl + '/del-asset';
  assetUrl = apiUrl + '/assets';
  uploadUrl = apiUrl + '/upload';
  releaseUrl = apiUrl + '/release';
  auditUrl = apiUrl + '/audit';
  rollbackUrl = apiUrl + '/rollback';
  joinInUrl = apiUrl + '/join';
}

/**
 * 获取资源
 */
export async function getAssets(projId, user = defaultUsername) {
  let url = wrapReqHashUrl({
    url: assetUrl,
    params: {
      user,
      projId: projId
    },
    toBase64: false,
  });
  return await $R.get(url);
}

/**
 * 删除资源
 */
export async function delAsset({projId, assetId, username = defaultUsername}) {
  let postData = {assetId, projId, username};
  return await $R.request(delAssetUrl, postData);
}

/**
 * 获取项目列表
 */
export async function getProjects(options) {
  let {projId, range, user = defaultUsername} = options;
  let url = wrapReqHashUrl({
    url: projectUrl,
    params: {
      user,
      projId,
      range
    },
    toBase64: false,
  });
  return await $R.get(url);
}

/**
 * 创建项目
 */
export async function createProject({projName, projCode, projDesc, webhook, username = defaultUsername}) {
  let postData = {projName, projCode, projDesc, webhook, username};
  return await $R.request(projectUrl, postData);
}

/**
 * 更新项目
 */
export async function updatePropject({projName, projCode, projDesc, webhook, username = defaultUsername}) {
  let postData = {projName, projCode, projDesc, webhook, username};
  return await $R.request(projectUrl, postData, null, 'PUT');
}

/**
 * 删除项目
 */
export async function delPropject({projId, username = defaultUsername}) {
  return await $R.request(delProjectUrl, {projId, username});
}

/**
 * 发布
 */
export async function release({assetId, projId, username = defaultUsername}) {
  let postData = {assetId, projId, username};
  return await $R.request(releaseUrl, postData);
}

/**
 * 回滚
 */
export async function rollback({prevAssetId, assetId, projId, rollbackMark, username = defaultUsername}) {
  let postData = {assetId, projId, rollbackMark, username, prevAssetId};
  return await $R.request(rollbackUrl, postData);
}

/**
 * 申请加入协作
 */
export async function applyToJoinInProject({projId, username = defaultUsername}) {
  let postData = {username, projId};
  return await $R.request(joinInUrl, postData);
}

/**
 * 上传资源文件
 */
export async function uploadFile(assetData) {
  return parseToJson(await fetch(uploadUrl, {
    method: 'POST',
    body: assetData,
    // headers: uploadHeader,
  }));
}

/**
 * 获取审计日志
 */
export async function getAudit(projId) {
  let url = wrapReqHashUrl({
    url: auditUrl,
    params: {
      projId
    },
    toBase64: false,
  });
  return await $R.get(url);
}