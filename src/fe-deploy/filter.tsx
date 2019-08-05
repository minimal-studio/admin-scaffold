
const versionFilter = (version) => {
  return `v${(`${version}`).split('').join('.')}`;
};

export {
  versionFilter
};
