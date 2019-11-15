import { IsFunc } from "@mini-code/base-func";

const defaultRetrueObj = false;

const resolveParams = params => {
  const hasParams = params && params.length > 0;
  if (!hasParams) return console.log("need params");

  const isArray = Array.isArray(params);
  const names = isArray ? params : [params];

  return names;
};

const getFromMapper = (mapper, params, merger, options = {}) => {
  const { returnObj = defaultRetrueObj } = options;
  const names = resolveParams(params);
  if (!names) return;

  const result = returnObj ? {} : [];

  for (const name of names) {
    const currMapper = mapper[name];
    let res = name;
    if (currMapper) {
      res = IsFunc(currMapper)
        ? currMapper()
        : Object.assign({}, currMapper, merger ? merger[name] || {} : {});
    }
    returnObj ? (result[name] = res) : result.push(res);
  }
  return result;
};

const getFromMapperSync = async (mapper, params, merger, options = {}) => {
  const { returnObj = defaultRetrueObj } = options;
  const names = resolveParams(params);
  if (!names) return;

  const result = returnObj ? {} : [];

  for (const name of names) {
    const currMapper = mapper[name];
    let res = name;
    if (currMapper) {
      res = IsFunc(currMapper)
        ? await currMapper()
        : Object.assign({}, currMapper, merger ? merger[name] || {} : {});
    }
    returnObj ? (result[name] = res) : result.push(res);
  }
  return result;
};

export { getFromMapper, getFromMapperSync };
