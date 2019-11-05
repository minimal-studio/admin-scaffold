import { TableProps } from '@deer-ui/core/table';
import { ConditionGeneratorProps } from '@deer-ui/core/form-generator/condition-generator';
import { PaginationProps } from '@deer-ui/core/pagination/pagination';
import { ButtonProps } from '@deer-ui/core/utils/props';
import { Color } from '@deer-ui/core/utils';
import { RecordItem, Column } from '@deer-ui/core/table/column-filter';
import { $TFunc } from '../../../props';

export interface TemplateOptions {
  /** 此接口将要废弃，请使用 checkedOverlay */
  whenCheckAction?: ReportTemplateProps['checkedOverlay'];
  checkedOverlay?: ReportTemplateProps['checkedOverlay'];
  needCheck?: ReportTemplateProps['needCheck'];
}

export interface RecordActionBtn {
  text: string;
  action: (contentResult: any, record: RecordItem, column: Column, rowIdx: number, ...other) => void;
  id?: string;
  color?: Color;
  enable?: boolean | ((params) => boolean);
}

export interface ReportActionBtn {
  text: string;
  action: (params) => void;
  id: string;
  color?: Color;
  enable?: boolean | ((params) => boolean);
}

export interface PowerMapper {
  [btnID: string]: any;
}
export interface ReportActionBtnItem {
  id?: string;
  action: (clickEvent: any) => void;
  text: string;
  color?: ButtonProps['color'];
}

export interface GetQueryDataResult {
  nextPagin: PaginationProps['pagingInfo'];
  conditionData: {};
  selectedItems?: {};
}

export interface ReportTemplateState {
  displayFloat: boolean;
  tableHeight: number | string;
  expandCon: boolean;
}

export interface ReportTemplateProps {
  // Props for Table
  // ---------------------
  /** 将要废弃，需要改名为 columns */
  keyMapper: TableProps['columns'];
  /** Ukelli UI 的表格渲染组件需要的配置 */
  columns: TableProps['columns'];
  /** 表格的高度 */
  height?: TableProps['height'];
  /** 是否需要表格统计 */
  needCount?: TableProps['needCount'];
  /** 请使用 dataRows */
  records: TableProps['records'];
  /** 表格渲染记录数据 */
  dataRows: TableProps['dataRows'];
  /** 忽略的排序字段 */
  sortIgnores: TableProps['sortIgnores'];
  /** 是否需要表格排序 */
  needInnerSort?: TableProps['needInnerSort'];
  /** 当有表格的细项被选中后出现的 DOM */
  whenCheckAction?: TableProps['checkedOverlay'];
  /** 当有表格的细项被选中后出现的 DOM */
  checkedOverlay?: TableProps['checkedOverlay'];
  /** 传入 Table 的 props */
  propsForTable?: TableProps;
  // ---------------------
  // Props for Table end

  // Props for Report Template Engin
  // ---------------------
  /** 查询数据接口 */
  onQueryData: (data: GetQueryDataResult) => void;
  /** getKeyMapper 获取 i18n */
  $T: $TFunc;
  /** children */
  children?: any;
  /** 数据渲染组件 */
  template?: 'Table' | 'CardTable';
  /** 在查询条件的按钮们 */
  actionBtns?: ReportActionBtn[];
  /** 当查询条件改变时 */
  onChangeCondition?: ConditionGeneratorProps['onChange'];
  /** 数据查询的返回描述 */
  resDesc?: string;
  /** 声音的 url */
  soundUrl?: string;
  /** 数据是否查询中 */
  querying?: boolean;
  /** 是否默认展开查询条件 */
  defaultExpandCon?: boolean;
  /** 是否显示查询条件 */
  showCondition?: boolean;
  /** 是否正在获取查询条件 */
  loadingCondition?: boolean;
  /** 是否自动计算并填充表格的高度 */
  calculateHeight?: boolean;
  /** 是否需要分页 */
  needPaging?: boolean;
  /** 是否需要清除按钮 */
  needClearBtn?: boolean;
  /** 是否需要自动刷新数据 */
  needAutoRefresh?: boolean;
  /** 是否需要隐藏小数点按钮 */
  hideFloatable?: boolean;
  /** 是否需要表格的选择器 */
  needCheck?: boolean;
  /** 是否改变查询条件后自动执行查询 */
  autoQuery?: boolean;
  /** 是否移动端 */
  isMobile?: boolean;
  /** 是否需要页面加载完后自动触发一次查询条件 */
  didMountQuery?: boolean;
  // ---------------------
  // Props for Report Template Engin end

  // Props for Condition
  // ---------------------
  /** Ukelli UI 查询生成器需要的配置 */
  conditionOptions: ConditionGeneratorProps['conditionConfig'];
  // ---------------------
  // Props for Condition end

  // Props for Pagination
  // ---------------------
  /** 由于不确定远端分页数据具体字段，所以有分页数据的字段映射 */
  infoMapper: PaginationProps['infoMapper'];
  /** 分页数据 */
  pagingInfo: PaginationProps['pagingInfo'];
  // ---------------------
  // Props for Paginationend
}
