/**
 * 与 orion web server 通讯的 api 接口
 */

import { wrapReqHashUrl } from 'orion-request';

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
  return await parseToJson(await fetch(url));
}

export async function delAsset({projId, assetId, username = defaultUsername}) {
  let postData = {assetId, projId, username};
  return await parseToJson(await fetch(delAssetUrl, {
    headers: jsonHeader,
    method: 'POST',
    body: JSON.stringify(postData)
  }));
}

export async function release({assetId, projId, username = defaultUsername}) {
  let postData = {assetId, projId, username};
  return await parseToJson(await fetch(releaseUrl, {
    method: 'POST',
    headers: jsonHeader,
    body: JSON.stringify(postData)
  }));
}

export async function rollback({prevAssetId, assetId, projId, rollbackMark, username = defaultUsername}) {
  let postData = {assetId, projId, rollbackMark, username, prevAssetId};
  return await parseToJson(await fetch(rollbackUrl, {
    method: 'POST',
    headers: jsonHeader,
    body: JSON.stringify(postData)
  }));
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
  return await parseToJson(await fetch(url));
}

export async function createProject(projConfig) {
  return parseToJson(await fetch(projectUrl, {
    method: 'POST',
    body: JSON.stringify(projConfig),
    headers: jsonHeader,
  }));
}

export async function updatePropject(projConfig) {
  return parseToJson(await fetch(projectUrl, {
    method: 'PUT',
    body: JSON.stringify(projConfig),
    headers: jsonHeader,
  }));
}

export async function delPropject({projId, username = defaultUsername}) {
  return parseToJson(await fetch(delProjectUrl, {
    method: 'POST',
    body: JSON.stringify({projId, username}),
    headers: jsonHeader,
  }));
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
  return await parseToJson(await fetch(url));
}