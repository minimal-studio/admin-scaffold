import { $R } from "../req-filter";

const routes = {
  test: "dyr/test",
  testForm: "dyr/test-form"
};

export async function getTestData() {
  return await $R.get(routes.test);
}

export async function testSubmit() {
  return await $R.post(routes.testForm, {});
}

export { routes };
