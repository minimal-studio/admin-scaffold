import React from 'react';
import { RequestClass } from '@mini-code/request';
import ActionAgent from '..';

const $R = new RequestClass<{
  header: {};
  data: {};
}>();

export const TestApi = () => $R.post('/test', {
  data: {}
});

export default class ActionAgentPage extends ActionAgent {
  api = () => {
    return TestApi();
  }

  componentDidMount = async () => {
    const postData = {
      username: 'bee'
    };
    const reqInstance = this.reqAgent(this.api, {
      before: () => ({}),
      after: (res) => {
        console.log('return an object to merge this.state');
        return {};
      },
      actingRef: 'testing',
    });
    const resData = await reqInstance(postData);
    console.log(resData);
  }

  render() {
    const { text } = this.props;
    return (
      <div>Page of ActionAgent's demo</div>
    );
  }
}
