import React from 'react';

import { FormLayout, Loading } from '../../ui-refs';

export default function FormRender(FormAction) {
  return class F extends FormAction {
    render() {
      const { querying = false } = this.props;
      return (
        <Loading loading={querying}>
          {
            !querying && (
              <FormLayout {...this.props} {...this.state} {...this}/>
            )
          }
        </Loading>
      );
    }
  };
}
