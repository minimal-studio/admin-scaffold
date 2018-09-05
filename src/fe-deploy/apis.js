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

let jsonHeader = {
  "Content-Type": "application/json"
};

let uploadHeader = {
  "Content-Type": "application/x-www-form-urlencoded",
  // "Content-Type": "multipart/form-data;boundary=----WebKitFormBoundaryyrV7KO0BoCBuDbTL"
};

async function parseToJson(fetchRes) {
  let res = null;
  try {
    res = await fetchRes.json();
  } catch(e) {
    console.log(e)
  }
  return res;
}

export function setFEDeployConfig({username, apiUrl}) {
  setDefaultUser(username);
  setApiUrl(apiUrl);
}

export function setDefaultUser(username) {
  defaultUsername = username;
}

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
}

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

export async function delAsset({projId, assetId, username = defaultUsername}) {
  let postData = {assetId, projId, username};
  return await $R.request(delAssetUrl, postData);
}

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

export async function createProject(projConfig) {
  return await $R.request(projectUrl, projConfig);
}

export async function updatePropject(projConfig) {
  return await $R.request(projectUrl, projConfig, null, 'PUT');
}

export async function delPropject({projId, username = defaultUsername}) {
  return await $R.request(delProjectUrl, {projId, username});
}

export async function release({assetId, projId, username = defaultUsername}) {
  let postData = {assetId, projId, username};
  return await $R.request(releaseUrl, postData);
}

export async function rollback({prevAssetId, assetId, projId, rollbackMark, username = defaultUsername}) {
  let postData = {assetId, projId, rollbackMark, username, prevAssetId};
  return await $R.request(rollbackUrl, postData);
}

export async function uploadFile(assetData) {
  return parseToJson(await fetch(uploadUrl, {
    method: 'POST',
    body: assetData,
    // headers: uploadHeader,
  }));
}

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