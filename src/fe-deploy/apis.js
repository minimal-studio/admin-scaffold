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

async function parseToJson(fetchRes) {
  let res = null;
  try {
    res = await fetchRes.json();
  } catch(e) {
    console.log(e)
  }
  return res;
}

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
  return await parseToJson(await fetch(url));
}

export async function release({assetId, projId, username}) {
  let postData = {assetId, projId, username};
  return await parseToJson(await fetch(releaseUrl, {
    method: 'POST',
    headers: jsonHeader,
    body: JSON.stringify(postData)
  }));
}

export async function getProjects(options) {
  let {username, projId, range} = options;
  let url = wrapReqHashUrl({
    url: projectUrl,
    params: {
      user: username,
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

export async function delPropject({projId, username}) {
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