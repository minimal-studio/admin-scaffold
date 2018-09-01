/**
 * 与 orion web server 通讯的 api 接口
 */

import { wrapReqHashUrl } from 'orion-request';

let apiUrl = '';
let projectUrl = '';
let delProjectUrl = '';
let assetUrl = '';
let releaseUrl = '';
let uploadUrl = '';
let auditUrl = '';

let jsonHeader = {
  "Content-Type": "application/json"
};

let uploadHeader = {
  "Content-Type": "application/x-www-form-urlencoded",
  // "Content-Type": "multipart/form-data;boundary=----WebKitFormBoundaryyrV7KO0BoCBuDbTL"
};

export function setApiUrl(url) {
  apiUrl = url;
  apiUrl = apiUrl.replace(/\/$/, '');
  projectUrl = apiUrl + '/project';
  delProjectUrl = apiUrl + '/del-project';
  assetUrl = apiUrl + '/assets';
  uploadUrl = apiUrl + '/upload';
  releaseUrl = apiUrl + '/release';
  auditUrl = apiUrl + '/audit';
}

export async function getAssets(username, projId) {
  let url = wrapReqHashUrl({
    url: assetUrl,
    params: {
      user: username,
      projId: projId
    },
    toBase64: false,
  });
  return await (await fetch(url)).json();
}

export async function release({assetId, projId, username}) {
  let postData = {assetId, projId, username};
  return await (await fetch(releaseUrl, {
    method: 'POST',
    headers: jsonHeader,
    body: JSON.stringify(postData)
  })).json();
}

export async function getProjects({username, projId, range}) {
  let url = wrapReqHashUrl({
    url: projectUrl,
    params: {
      user: username,
      projId,
      range
    },
    toBase64: false,
  });
  return await (await fetch(url)).json();
}

export async function createProject(projConfig) {
  return (await fetch(projectUrl, {
    method: 'POST',
    body: JSON.stringify(projConfig),
    headers: jsonHeader,
  })).json();
}

export async function updatePropject(projConfig) {
  return (await fetch(projectUrl, {
    method: 'PUT',
    body: JSON.stringify(projConfig),
    headers: jsonHeader,
  })).json();
}

export async function delPropject({projId, username}) {
  return (await fetch(delProjectUrl, {
    method: 'POST',
    body: JSON.stringify({projId, username}),
    headers: jsonHeader,
  })).json();
}

export async function uploadFile(assetData) {
  return (await fetch(uploadUrl, {
    method: 'POST',
    body: assetData,
    // headers: uploadHeader,
  })).json();
}

export async function getAudit(projId) {
  let url = wrapReqHashUrl({
    url: auditUrl,
    params: {
      projId
    },
    toBase64: false,
  });
  return (await fetch(url)).json();
}