import {defineGlobalScope} from 'basic-helper';

export const storageHelper = {
  get(name, parseToObj) {
    let res = window.localStorage.getItem(name);
    if(!parseToObj) return res;
    try {
      res = JSON.parse(res);
    } catch(e) {
      console.log(e)
    }
    return res;
  },
  set(name, item, toString) {
    window.localStorage.setItem(name, toString ? JSON.stringify(item) : item);
  }
}

let adminWebTemplate = {
  versionUrl: '/js/version.txt',
  $request: {},
  storageHelper
}

export function setAdminWebTemplateConfig(config) {
  Object.assign(adminWebTemplate, config);
  return adminWebTemplate;
}

export function getAdminWebTemplateConfig(name) {
  let _adminWebTemplate = Object.assign({}, adminWebTemplate);
  return name ? (_adminWebTemplate[name] || false) : _adminWebTemplate;
}

// $3THG third game
defineGlobalScope('$AWT', adminWebTemplate);
