import {defineGlobalObj} from 'basic-helper';

let adminWebTemplate = {
  versionUrl: '/js/version.txt',
  $request: {},
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
defineGlobalObj('$AWT', adminWebTemplate);
