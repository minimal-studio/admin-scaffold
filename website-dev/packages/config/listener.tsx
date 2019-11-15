import { EventEmitter } from "@mini-code/base-func";
// import { setFEDeployConfig } from '@deer-ui/admin-scaffold/fe-deploy';
import { initFields } from "@dashboard/services/fields";

EventEmitter.on("LOGIN_SUCCESS", ({ userInfo }) => {
  // setFEDeployConfig({
  //   username: userInfo.username,
  //   apiUrl: window.F_E_DeploymentUrl
  // });
  initFields();
});
