## v0.13.0

- 新增表格模版高阶组件的引用，业务组件可以通过 this.ReportRef 引用
- 表格组件提供一个删除所有已选择项的接口，通过 this.clearCheckeds() 调用
- 修复 report 的已选项引用错误问题，现在可以通过 this.checkedItems 引用
- 使用最新 UI 库 2.6.1 和 basic-helper 1.4.4