/**
 * 与 uke web server 通讯的 api 接口
 */

import { RequestClass, wrapReqHashUrl } from 'uke-request';

let $R = new RequestClass();

let apiUrl = '';
let defaultUsername = '';

let APIs = {
  project: '/project',
  asset: '/assets',
  upload: '/upload',
  release: '/release',
  download: '/download-asset',
  audit: '/audit',
  rollback: '/rollback',
  joinIn: '/join',
  approveIn: '/approve',
  getHostList: '/ssh-host',
};

/**
 * 处理 fetch 回调
 */
async function parseToJson(fetchRes) {
  let res = null;
  try {
    res = await fetchRes.json();
  } catch(e) {
    console.log(e);
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
  $R.setConfig({
    baseUrl: apiUrl
  });
}

/**
 * 获取资源
 */
export async function getAssets(projId, user = defaultUsername) {
  let getConfig = {
    url: APIs.asset,
    params: {
      user,
      projId: projId
    }
  };
  return await $R.get(getConfig);
}

/**
 * 删除资源
 */
export async function delAsset({username = defaultUsername, ...other}) {
  let postData = {...other, username};
  return await $R.del(APIs.asset, postData);
}

/**
 * 获取项目列表
 */
export async function getProjects(options) {
  let {projId, range, user = defaultUsername} = options;
  let getConfig = {
    url: APIs.project,
    params: {
      user,
      projId,
      range
    },
  };
  return await $R.get(getConfig);
}

/**
 * 创建项目
 */
export async function createProject({username = defaultUsername, ...other}) {
  let postData = {...other, username};
  return await $R.post(APIs.project, postData);
}

/**
 * 更新项目
 */
export async function updatePropject({username = defaultUsername, ...other}) {
  let postData = {...other, username};
  return await $R.put(APIs.project, postData);
}

/**
 * 删除项目
 */
export async function delPropject({username = defaultUsername, ...other}) {
  return await $R.del(APIs.project, {...other, username});
}

/**
 * 发布
 */
export async function release({username = defaultUsername, ...other}) {
  let postData = {...other, username};
  return await $R.post(APIs.release, postData);
}

/**
 * 回滚
 */
export async function rollback({username = defaultUsername, ...other}) {
  let postData = {...other, username};
  return await $R.post(APIs.rollback, postData);
}

/**
 * 申请加入协作
 */
export async function applyToJoinInProject({projId, username = defaultUsername}) {
  let postData = {username, projId};
  return await $R.post(APIs.joinIn, postData);
}

/**
 * 申请加入协作
 */
export async function approveToJoinInProject({username = defaultUsername, ...other}) {
  let postData = {username, ...other};
  return await $R.post(APIs.approveIn, postData);
}

/**
 * 上传资源文件
 */
export async function uploadFile(assetData) {
  return parseToJson(await $R.upload(APIs.upload, assetData));
}

/**
 * 获取审计日志
 */
export async function getAudit(projId) {
  let getConfig = {
    url: APIs.audit,
    params: {
      projId
    }
  };
  return await $R.get(getConfig);
}

/**
 * 获取审计日志
 */
export async function getSSHHost() {
  let url = APIs.getHostList;
  return await $R.get(url);
}

/**
 * 下载链接
 */
// export async function downloadAsset(assetId) {
//   let config = {
//     url: APIs.download,
//     params: {
//       assetId
//     },
//     toBase64: false,
//   };
//   return await fetch(apiUrl + wrapReqHashUrl(config));
// }
export function downloadAsset(assetId) {
  let config = {
    url: APIs.download,
    params: {
      assetId
    },
    toBase64: false,
  };
  return apiUrl + wrapReqHashUrl(config);
  // return await fetch(apiUrl + wrapReqHashUrl(config));
}