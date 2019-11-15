/**
 * 与 web server 通讯的 api 接口
 */

import { RequestClass, urlParamsToQuery } from '@mini-code/request';

const $R = new RequestClass();

let apiUrl = '';
let defaultUsername = '';

const APIs = {
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
  sshConfig: '/ssh-config',
};

/**
 * 处理 fetch 回调
 */
async function parseToJson(fetchRes) {
  let res = null;
  try {
    res = await fetchRes.json();
  } catch (e) {
    console.log(e);
  }
  return res;
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
 * 设置 F-E-Deployment 模块的配置
 */
export function setFEDeployConfig({ username, apiUrl }) {
  setDefaultUser(username);
  setApiUrl(apiUrl);
}

/**
 * 获取资源
 */
export async function getAssets(projId, user = defaultUsername) {
  const getConfig = {
    // url: APIs.asset,
    params: {
      user,
      projId
    }
  };
  return await $R.get(APIs.asset, getConfig);
}

/**
 * 获取 ssh 的配置
 * @param {void}
 * @return {data}
 */
export async function getSShConfig() {
  return await $R.get(APIs.sshConfig);
}

/**
 * 新增 ssh config
 * @param {void}
 * @return {data}
 */
export async function addSShConfig(data) {
  return await $R.post(APIs.sshConfig, data);
}

/**
 * 更新 ssh config
 * @param {void}
 * @return {data}
 */
export async function updateSShConfig(data) {
  return await $R.put(APIs.sshConfig, data);
}

/**
 * 删除 ssh config
 * @param {void}
 * @return {data}
 */
export async function delSShConfig(data) {
  return await $R.del(APIs.sshConfig, data);
}

/**
 * 删除资源
 */
export async function delAsset({ username = defaultUsername, ...other }) {
  const postData = { ...other, username };
  return await $R.del(APIs.asset, postData);
}

/**
 * 获取项目列表
 */
export async function getProjects(options) {
  const { projId, range, user = defaultUsername } = options;
  const getConfig = {
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
export async function createProject({ username = defaultUsername, ...other }) {
  const postData = { ...other, username };
  return await $R.post(APIs.project, postData);
}

/**
 * 更新项目
 */
export async function updatePropject({ username = defaultUsername, ...other }) {
  const postData = { ...other, username };
  return await $R.put(APIs.project, postData);
}

/**
 * 删除项目
 */
export async function delPropject({ username = defaultUsername, ...other }) {
  return await $R.del(APIs.project, { ...other, username });
}

/**
 * 发布
 */
export async function release({ username = defaultUsername, ...other }) {
  const postData = { ...other, username };
  return await $R.post(APIs.release, postData);
}

/**
 * 回滚
 */
export async function rollback({ username = defaultUsername, ...other }) {
  const postData = { ...other, username };
  return await $R.post(APIs.rollback, postData);
}

/**
 * 申请加入协作
 */
export async function applyToJoinInProject({ projId, username = defaultUsername }) {
  const postData = { username, projId };
  return await $R.post(APIs.joinIn, postData);
}

/**
 * 申请加入协作
 */
export async function approveToJoinInProject({ username = defaultUsername, ...other }) {
  const postData = { username, ...other };
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
  const getConfig = {
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
  const url = APIs.getHostList;
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
//   return await fetch(apiUrl + urlParamsToQuery(config));
// }
export function downloadAsset(assetId) {
  const config = {
    url: APIs.download,
    params: {
      assetId
    },
    toBase64: false,
  };
  return apiUrl + urlParamsToQuery(config);
  // return await fetch(apiUrl + urlParamsToQuery(config));
}
