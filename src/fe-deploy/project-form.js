import { getSSHHost } from './apis';

const wrapProjectFormOptions = async (project = {}) => {
  let hostRes = await getSSHHost();
  // let hostList = hostRes.data || [];
  let hostMapper = hostRes.mapper || {};
  // let targetHostList = {};
  // hostList.forEach(item => targetHostList[item] = item);

  let formOptions = [
    {
      type: 'input',
      required: true,
      ref: 'projName',
      title: '项目名称',
      defaultValue: project.projName,
      desc: '项目显示名称'
    },
    !project.projCode ? {
      type: 'input',
      required: true,
      ref: 'projCode',
      title: '项目代号',
      desc: '确定后不可修改'
    } : {
      type: 'text',
      ref: 'projCode',
      title: '项目代号',
      defaultValue: project.projCode,
    },
    {
      type: 'input',
      ref: 'projDesc',
      title: '项目介绍',
      defaultValue: project.projDesc,
    },
    {
      type: 'input',
      ref: 'host',
      title: '项目域名',
      defaultValue: project.host,
    },
    {
      type: 'input',
      ref: 'webhook',
      title: 'web hook',
      desc: '开发人员填写',
      defaultValue: project.webhook,
    },
    {
      type: 'select',
      ref: 'scpTargetHost',
      title: 'SCP Host',
      position: 'top',
      values: hostMapper,
      desc: '请咨询 SA',
      defaultValue: project.scpTargetHost,
    },
    {
      type: 'input',
      ref: 'scpSourceDir',
      title: '资源目录',
      desc: '请查看打包配置',
      defaultValue: project.scpSourceDir,
    },
    {
      type: 'input',
      ref: 'scpTargetDir',
      title: 'SCP 目标目录',
      desc: '请咨询 SA 对应的目录',
      defaultValue: project.scpTargetDir,
    },
    {
      type: 'hidden',
      ref: 'projId',
      defaultValue: project.id
    },
  ];

  return formOptions;
}

export default wrapProjectFormOptions;