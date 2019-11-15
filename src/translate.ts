const LANG_MAPPER = {};
let CURR_LANG_MAPPER = {};

export const $T = (key) => {
  return key === 'all' ? CURR_LANG_MAPPER : CURR_LANG_MAPPER[key] || key || '';
};

export const setLangMapper = (nextMapper) => {
  Object.assign(LANG_MAPPER, nextMapper);
};

export const setLang = (lang) => {
  CURR_LANG_MAPPER = LANG_MAPPER[lang] || {};
};
