## v0.13.8

- 调整功能图标，使用 ToolTip
- 调整版本组件的样式

## v0.13.5

- 优化菜单是否激活的判定
- 优化样式

## v0.13.2

- 升级 UI 库
- 修复一些引用问题

## v0.13.0

- 新增表格模版高阶组件的引用，业务组件可以通过 this.ReportRef 引用
- 表格组件提供一个删除所有已选择项的接口，通过 this.clearCheckeds() 调用
- 修复 report 的已选项引用错误问题，现在可以通过 this.checkedItems 引用
- 使用最新 UI 库 2.6.1 和 basic-helper 1.4.4