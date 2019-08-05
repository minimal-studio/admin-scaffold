import { getSSHHost, getSShConfig } from './apis';

const wrapFormOptions = async (project = {}) => {
  const hostRes = await getSSHHost();
  // let hostList = hostRes.data || [];
  const hostMapper = hostRes.mapper || {};
  // let targetHostList = {};
  // hostList.forEach(item => targetHostList[item] = item);

  const formOptions = [
    {
      type: 'select',
      required: true,
      ref: 'sshHost',
      title: 'SCP Host',
      values: hostMapper,
      desc: 'ssh 的配置',
      defaultValue: project.sshHost,
    },
    {
      type: 'input',
      required: true,
      ref: 'desc',
      title: '用途',
      defaultValue: project.desc,
      desc: '这条记录的用途'
    },
    {
      type: 'hidden',
      ref: 'id',
      defaultValue: project.id,
    },
    {
      type: 'input',
      required: true,
      ref: 'deployPath',
      title: '部署路径',
      desc: '在已选择的目标机器中部署的路径',
      defaultValue: project.deployPath,
    },
  ];
  console.log(formOptions);

  return formOptions;
};

export default wrapFormOptions;
