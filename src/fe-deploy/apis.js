/* api */
import futch from './futch';

let apiUrl = '';
let projectUrl = '';
let assetUrl = '';

let jsonHeader = {
  "Content-Type": "application/json"
};

export function setApiUrl(url) {
  apiUrl = url;
  apiUrl = apiUrl.replace(/\/$/, '');
  projectUrl = apiUrl + '/project';
  assetUrl = apiUrl + '/asset';
}

export async function getProjects(username) {
  return await (await fetch(projectUrl + '/' + username)).json();
}

export async function createProject(projConfig) {
  return (await fetch(projectUrl, {
    method: 'POST',
    body: JSON.stringify(projConfig),
    headers: jsonHeader,
  })).json();
}