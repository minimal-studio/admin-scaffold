import React from "react";

import { FormLayout, Loading } from "@deer-ui/core";

export default function FormRender(FormAction) {
  return class F extends FormAction {
    render() {
      const { querying = false } = this.props;
      return (
        <Loading loading={querying}>
          {querying ? null : (
            <FormLayout {...this.props} {...this.state} {...this} />
          )}
        </Loading>
      );
    }
  };
}
