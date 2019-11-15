import { getSSHHost, getSShConfig } from './apis';

const wrapProjectFormOptions = async (project = {}) => {
  const hostRes = await getSSHHost();
  const hostConfigRes = await getSShConfig();
  console.log(hostRes, hostConfigRes);
  // let hostList = hostRes.data || [];
  const hostMapper = hostRes.mapper || {};
  // let targetHostList = {};
  // hostList.forEach(item => targetHostList[item] = item);

  const formOptions = [
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
      ref: 'scpTargetDir',
      title: 'SSH 的部署目录',
      desc: '请咨询 SA 对应的目录',
      defaultValue: project.scpTargetDir,
    },
    {
      type: 'input',
      ref: 'scpSourceDir',
      title: '资源目录',
      desc: '请查看打包配置',
      defaultValue: project.scpSourceDir,
    },
    {
      type: 'radio',
      ref: 'pushMode',
      title: '发布方式',
      values: {
        'push-files': '推送解压后的文件(慢, 但是安全)',
        'push-zip': '推送压缩资源到目标服务器再解压(快, 但需要目标服务器支持)',
      },
      defaultValue: project.pushMode || 'push-files',
    },
    {
      type: 'hidden',
      ref: 'projId',
      defaultValue: project.id
    },
  ];

  return formOptions;
};

export default wrapProjectFormOptions;
