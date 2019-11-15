import { FormRender } from "./template-engine";

import HomePage from "./home-page";
import { TestForm, TestFormBasic } from "./test-form";
import TestReport from "./test-report";
import ReportAsync from "./test-report-async";
import FormAsync from "./test-form-async";

const FormWithTMPL = FormRender(TestFormBasic);

const FormWithTMPL2 = FormWithTMPL;

export {
  TestReport,
  TestForm,
  FormWithTMPL,
  FormWithTMPL2,
  FormAsync,
  ReportAsync,
  HomePage
};
