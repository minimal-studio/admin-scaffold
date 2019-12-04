import createStore from "unistore";
import { Call, EventEmitter } from "@mini-code/base-func";

import NAV_MENU_CONFIG from "@dashboard/pages/routers";
import * as AUTH_APIS from "./apis";

export interface AuthActions {
  autoLogin: () => void;
  login: (form, callback) => void;
  logout: () => void;
}
export interface AuthStore {
  userInfo: {};
  menuStore: {};
  username: string;
  loginResDesc: string;
  autoLoging: boolean;
  logging: boolean;
  logouting: boolean;
  isLogin: boolean;
  token: string;
}

export function getPrevLoginToken() {
  const res = getPrevLoginData();
  return res ? res.token : null;
}

const defaultAuthStore: AuthStore = {
  userInfo: {},
  username: "",
  loginResDesc: "",
  autoLoging: !!getPrevLoginToken(),
  logging: false,
  logouting: false,
  isLogin: process.env.NODE_ENV === 'development',
  token: "",
  menuStore: NAV_MENU_CONFIG
};
const authStore = createStore(defaultAuthStore);

function onLoginSuccess(store, resData) {
  const userInfo = resData;
  const { username } = resData;
  userInfo.username = username;
  // let menuStore = (userInfo.Menus || {}).Child;
  const { token } = resData;
  // delete userInfo['Menus'];

  store.setState({
    logging: false,
    autoLoging: false,
    isLogin: true,
    token,
    username,
    userInfo
    // menuStore
  });

  EventEmitter.emit("LOGIN_SUCCESS", { userInfo, loginRes: resData });
  localStorage.setItem("PREV_LOGIN_DATA", JSON.stringify(resData));
}

function clearPrevLoginData() {
  localStorage.clear();
}

function getPrevLoginData(): AuthStore | undefined {
  const res = localStorage.getItem("PREV_LOGIN_DATA");
  let result;
  if (res) {
    try {
      result = JSON.parse(res);
    } catch (e) {
      console.log(e);
    }
  }
  return result;
}

const authActions = (store) => ({
  async autoLogin() {
    const token = getPrevLoginToken();
    if (!token) return;
    const loginRes = await AUTH_APIS.login({
      token
    });
    const isLogin = loginRes.code == 0;
    if (isLogin) {
      onLoginSuccess(
        store,
        Object.assign({}, getPrevLoginData(), loginRes.data)
      );
    }
    // if (prevLoginData) {
    //   onLoginSuccess(store, prevLoginData);
    // }
  },
  async login(state, form, callback) {
    store.setState({
      logging: true
    });
    const loginRes = await AUTH_APIS.login(form);
    const isLogin = loginRes.code == 0;
    if (isLogin) {
      Call(callback, form);
      onLoginSuccess(store, Object.assign({}, loginRes.data, form));
    } else {
      store.setState({
        logging: false,
        loginResDesc: loginRes.message
      });
    }
  },
  async logout() {
    store.setState({
      logouting: true
    });
    await AUTH_APIS.logout();
    store.setState(defaultAuthStore);
    clearPrevLoginData();
  }
});

export { authStore, authActions };
