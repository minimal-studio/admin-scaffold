const defaultPagin = {
  active: true,
  total: 0,
  idx: 0,
  size: 10
};

/**
 * 用于包装具体业务接口的分页字段
 */
const paginTransfer = {
  active: 'active',
  total: 'total',
  idx: 'idx',
  size: 'size'
};

export function getDefPagin() {
  return {...defaultPagin};
}

export function getPaginMapper() {
  return {...paginTransfer};
}

export function setDefPagin(nextState) {
  return Object.assign(defaultPagin, nextState);
}

export function setPaginMapper(nextState) {
  return Object.assign(paginTransfer, nextState);
}

export function paginHelper(config = defaultPagin) {
  const { active, total, idx, size } = config;

  return {
    active,
    total,
    idx,
    size
  };
}