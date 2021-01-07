<template>
  <el-dialog
    title="课程列表"
    :visible.sync="visible"
    :append-to-body="true"
  >
    <common-table
      ref="table"
      :columns="tableColumns"
      :config="tableConfig"
      :data="tableData"
      :loading="tableLoading"
      :page-config="tablePageConfig"
      :page="page"
      @current-page-change="handleCurrentPageChange"
      @page-size-change="handlePageSizeChange"
    >
      <template #topMenu>
        <SearchPopover
          ref="searchPopover"
          :require-options="searchPopoverConfig.requireOptions"
          @submit="handleSearch"
        />
      </template>
    </common-table>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getCatalog } from '@/api/course/course'
import { getCourseList } from '@/api/learnPlan'
import SearchPopover from '@/components/searchPopOver/index'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '课程名称',
    width: 180,
    prop: 'courseName'
  },
  {
    label: '讲师',
    prop: 'teacherName',
    width: 200
  },
  {
    label: '所在类目',
    prop: 'catalogName',
    minWidth: 150
  }
]
const TABLE_CONFIG = {
  enablePagination: true,
  enableMultiSelect: true,
  rowKey: 'id',
  showHandler: false
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '课程名称搜索', 'suffix-icon': 'el-icon-search' },
    data: '',
    field: 'courseName',
    label: '',
    type: 'input'
  },
  {
    type: 'treeSelect',
    field: 'catalogId',
    label: '课程分类',
    data: '',
    config: {
      selectParams: {
        placeholder: '请选择分类',
        multiple: false
      },
      treeParams: {
        data: [],
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        filterable: false,
        props: {
          children: 'children',
          label: 'name',
          disabled: 'disabled',
          value: 'id'
        }
      }
    }
  }
]
let SEARCH_POPOVER_CONFIG = {
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
export default {
  name: 'CourseSelectDialog',
  components: {
    SearchPopover
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false,
      tablePageConfig: TABLE_PAGE_CONFIG,
      queryInfo: {
        // 课程列表的请求参数
        catalogId: '',
        courseName: ''
      },
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      }
    }
  },
  methods: {
    /**
     * 处理页码改变
     */
    handleCurrentPageChange(param) {
      this.queryInfo.pageNo = param
      this.getCourseData()
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.queryInfo.pageSize = param
      this.getCourseData()
    },
    handleSearch(params) {
      this.queryInfo = _.assign(this.queryInfo, params)
      this.page.currentPage = 1
      this.getCourseData()
    },
    getCourseData() {
      getCourseList({ ...this.queryInfo, pageNo: this.page.currentPage, pageSize: this.page.size })
        .then((res) => {
          this.page.total = res.totalNum
          this.tableData = res.data
        })
        .catch((err) => {
          window.console.log(err)
        })
    },
    loadCategoryData() {
      getCatalog().then((res) => {
        this.searchPopoverConfig.requireOptions[1].config.treeParams.data = res
      })
    },
    handleSubmit() {
      this.$emit('submit', this.$refs.table.selection)
      this.handleClose()
    },
    handleClose() {
      this.$refs.table.clearSelection()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
