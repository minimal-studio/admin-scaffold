/* api */
import futch from './futch';

let {
  PubToken,
  FEManagerURL,
  getAdmin
} = window;

getAdmin = getAdmin || function() {return '请指定 window.getAdmin'};


const api = /___fe___/.test(FEManagerURL)
  ? FEManagerURL
  : '/fe/___fe___/';
// const api = 'http://127.0.0.1:60000/'
const prefix = 'Basic',
  b4 = 'VHVzZXI6OXN0cmVldA==';
const headers = {
  headers: {
    AuthToken: PubToken ? PubToken : 'pub=token',
    authorization: `${prefix} ${b4}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};
const api_entry = {
  data: `${api}data`,
  create_project: `${api}create`,
  publish: `${api}publish`,
  del_project: `${api}delete_project`,
  del_asset: `${api}delete_asset`,
  host_list: `${api}host_list`,
  scp: `${api}scp`,
  delete_history: `${api}delete_history`,
  edit_project: `${api}edit_project`
};

function json(res) {
  const data = JSON.parse(res);
  if (data.status == 'failed') {
    throw new Error(data.data.join ? data.data.join('') : data.data);
  }
  return data;
}

// 清除历史记录
export function deleteHistory(project_id) {
  const payload = {
    project_id
  };
  return futch(
    api_entry.delete_history,
    {
      method: 'POST',
      headers: headers.headers,
      body: encodeURL(payload)
    },
    e => {
      // console.log(e)
    }
  ).then(json);
}

// 编辑项目
export function editProject(project_id, raw_data) {
  const payload = {
    project_id,
    raw_data: JSON.stringify(raw_data)
  };
  return futch(
    api_entry.edit_project,
    {
      method: 'POST',
      headers: headers.headers,
      body: encodeURL(payload)
    },
    e => {
      // console.log(e)
    }
  ).then(json);
}

// 返回数据
export function getData() {
  return fetch(api_entry.data + `?${Date.now()}`, headers)
    .then(res => res.text())
    .then(json);
}

// 添加项目
// name, desc, path, html_path
export function createProject(
  id,
  name,
  save_path,
  unzip_path,
  zip,
  desc,
  scp_host,
  scp_dir,
  scp_target_dir,
  uploaded
) {
  const payload = {
    admin: '',
    id,
    name,
    save_path,
    unzip_path,
    update_comment: desc,
    scp_host,
    scp_dir,
    scp_target_dir,
    uploaded
  };

  const formData = new FormData();
  !uploaded && formData.append('zip', zip.files[0]);
  Object.keys(payload).forEach(k => {
    formData.append(k, payload[k]);
  });

  return futch(
    api_entry.create_project,
    {
      method: 'POST',
      headers: { AuthToken: headers.headers.AuthToken },
      body: formData
    },
    e => {
      // console.log(e)
    }
  ).then(json);
}

export function publish(project_id, asset_id, rollback_note, env) {
  const payload = {
    admin: getAdmin(),
    project_id,
    asset_id,
    rollback_note,
    env
  };
  return fetch(api_entry.publish, {
    method: 'POST',
    headers: headers.headers,
    body: encodeURL(payload)
  })
    .then(res => res.text())
    .then(json);
}

export function deleteProject(project_id) {
  const payload = {
    admin: '',
    project_id
  };
  return fetch(api_entry.del_project, {
    method: 'POST',
    headers: headers.headers,
    body: encodeURL(payload)
  })
    .then(res => res.text())
    .then(json);
}

export function deleteAsset(project_id, asset_id) {
  const payload = {
    admin: '',
    project_id,
    asset_id
  };

  return fetch(api_entry.del_asset, {
    method: 'POST',
    headers: headers.headers,
    body: encodeURL(payload)
  })
    .then(res => res.text())
    .then(json);
}

export function setAssetCursor(asset_id, project_id, version) {
  const payload = {
    admin: '',
    asset_id,
    project_id,
    version
  };
  return fetch(api_entry.publish, {
    method: 'POST',
    headers: headers.headers,
    body: encodeURL(payload)
  })
    .then(res => res.text())
    .then(json);
}

// get ssh list
export function getHostList() {
  return fetch(api_entry.host_list, {
    method: 'POST',
    headers: headers.headers
  })
    .then(res => res.text())
    .then(json);
}

// scp
export function scp(project_id, asset_id) {
  const payload = {
    admin: '',
    project_id,
    asset_id
  };
  return fetch(api_entry.scp, {
    method: 'POST',
    headers: headers.headers,
    body: encodeURL(payload)
  })
    .then(res => res.text())
    .then(json);
}

export function toVersion(num) {
  var str = '00' + (100 + num);
  return (
    'v' +
    str
      .slice(str.length - 3, str.length)
      .split('')
      .join('.')
  );
}

function encodeURL(obj) {
  var arr = [];
  for (let k in obj) {
    arr.push(`${k}=${obj[k]}`);
  }

  return arr.join('&');
}

export function formatTime(ts) {
  var d = new Date(ts);
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map(o2t).join(':');
}

function o2t(input) {
  return (input + '').length >= 2 ? input : '0' + input;
}
