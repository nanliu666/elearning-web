<template>
  <div
    id="elective"
    class="fill"
  >
    <page-header title="线上选修管理" />
    <!-- 选修课安排 详情页面 -->
    <basic-container block>
      <common-table
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page-config="tablePageConfig"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #topMenu>
          <div class="operations">
            <SearchPopover
              ref="searchPopover"
              :popover-options="searchPopoverConfig.popoverOptions"
              :require-options="searchPopoverConfig.requireOptions"
              @submit="handleSearch"
            />
            <div class="operations-right">
              <div
                class="refresh-container"
                @click="loadTableData"
              >
                <i class="el-icon-refresh-right" />
                <span>刷新</span>
              </div>
            </div>
          </div>
        </template>
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            v-p="DELETE_ELECTIVE"
            type="text"
            size="medium"
            icon="el-icon-delete"
            @click="handleDelete(selection)"
          >
            批量删除
          </el-button>
        </template>
        <template #oparetion="{row}">
          <el-button
            v-p="VIEW_ELECTIVE"
            type="text"
            size="medium"
            @click="jumpDetail(row)"
          >
            查看
          </el-button>
          <el-button
            v-p="DELETE_ELECTIVE"
            type="text"
            size="medium"
            @click="handleDelete([row])"
          >
            删除
          </el-button>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import SearchPopover from '@/components/searchPopOver/index'
import { queryLog, delLog } from '@/api/learnPlan'

import { getOrgTreeSimple } from '../../api/org/org'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '课程编号',
    width: 180,
    prop: 'courseId'
  },
  {
    label: '课程名称',
    prop: 'courseName',
    width: 300
  },
  {
    label: '用户编号',
    prop: 'workNo',
    minWidth: 100
  },
  {
    label: '用户名称',
    prop: 'userName',
    minWidth: 100
  },
  {
    label: '组织架构',
    prop: 'department',
    minWidth: 100
  },
  {
    label: '操作',
    slot: true,
    // fixed: 'right',
    prop: 'oparetion',
    minWidth: 100
  }
]
const TABLE_CONFIG = {
  enablePagination: true,

  enableMultiSelect: true,
  rowKey: 'id'
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '输入课程名称搜索', 'suffix-icon': 'el-icon-search' },
    data: '',
    field: 'courseName',
    label: '',
    type: 'input'
  }
]
let SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    type: 'input',
    field: 'userName',
    label: '用户姓名',
    data: ''
  },
  {
    type: 'treeSelect',
    field: 'departmentId',
    label: '组织名称',
    data: '',
    config: {
      selectParams: {
        placeholder: '请输入内容',
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
          label: 'orgName',
          disabled: 'disabled',
          value: 'orgId'
        }
      }
    }
  },
  {
    type: 'input',
    field: 'phonenum',
    label: '手机号',
    data: ''
  }
]
let SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
import { VIEW_ELECTIVE, EDIT_REQUDELETE_ELECTIVEIRED, DELETE_ELECTIVE } from '@/const/privileges'
import { mapGetters } from 'vuex'
export default {
  name: 'ElectivePlanList',
  components: {
    SearchPopover
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      preview: {},
      moveKnowledgeRow: {},
      formData: {
        catalogId: ''
      },
      dialogTableVisible: false,
      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      // 请求参数
      queryInfo: {},
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false,
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },
  computed: {
    VIEW_ELECTIVE: () => VIEW_ELECTIVE,
    DELETE_ELECTIVE: () => DELETE_ELECTIVE,
    EDIT_REQUDELETE_ELECTIVEIRED: () => EDIT_REQUDELETE_ELECTIVEIRED,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([VIEW_ELECTIVE, EDIT_REQUDELETE_ELECTIVEIRED])
      },
      deep: true
    }
  },
  activated() {
    // this.initSearchData()
    this.loadTableData()
  },
  created() {
    this.loadOrgData()
  },
  methods: {
    loadOrgData() {
      getOrgTreeSimple({ parentOrgId: 0 }).then(
        (res) =>
          (this.searchPopoverConfig.popoverOptions[1].config.treeParams.data = _.concat(
            [
              {
                orgName: '全部',
                orgId: ''
              }
            ],
            res
          ))
      )
    },
    /**
     * 处理页码改变
     */
    handleCurrentPageChange(param) {
      this.page.currentPage = param
      this.loadTableData()
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.page.size = param
      this.loadTableData()
    },
    /**
     * 搜索
     */
    handleSearch(searchParams) {
      this.queryInfo = _.assign(this.queryInfo, searchParams)
      this.page.currentPage = 1
      this.loadTableData()
    },
    // 跳去详情
    jumpDetail(row) {
      this.$router.push({
        path: '/course/detail',
        query: { id: row.courseId }
      })
    },
    handleDelete(selection) {
      this.$confirm('确定要删除选中的选修课程吗？', {
        showCancelButton: true,
        callback: (action) => {
          if (action !== 'cancel') {
            this.deleteFn(selection)
          }
        }
      })
    },
    deleteFn(selection) {
      delLog({ ids: _.map(selection, 'id').join(',') })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$refs.table.clearSelection()
          this.loadTableData()
        })
        .catch()
    },
    // 加载表格数据
    async loadTableData() {
      if (this.tableLoading) return
      this.tableLoading = true
      try {
        let { totalNum, data } = await queryLog({
          ...this.queryInfo,
          pageNo: this.page.currentPage,
          pageSize: this.page.size
        })
        this.tableData = data
        this.page.total = totalNum
      } catch (error) {
        // window.console.log(error)
      } finally {
        this.tableLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
}
.elective {
  padding-top: 20px;
}
.preview_right_box {
  position: relative;
  border: 1px solid #d9dbdc;
  margin-top: 15px;
  width: 100%;
  height: 100%;
  .bgimg {
    width: 100%;
    height: 100%;
    z-index: -1;
    background-repeat: no-repeat;
  }
  .name {
    position: absolute;
    top: 22%;
    left: 50%;
    font-size: 30px;
    font-weight: 700;
    transform: translateX(-50%);
  }
  .text {
    position: absolute;
    top: 58%;
    left: 50%;
    font-size: 12px;
    font-weight: 700;
    transform: translateX(-50%);
    color: #8b8a8a;
    width: 50%;
    height: 28%;
    text-align: center;
  }
  .logo {
    position: absolute;
    top: 75.6%;
    left: 50%;
    transform: translateX(-50%);
    width: 40px !important;
    height: 40px !important;
  }
  .studentName {
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 22px;
    font-weight: 500;
  }
  .serial {
    position: absolute;
    right: 6%;
    bottom: 6%;
    color: #8b8a8a;
    font-size: 8px;
  }
}
.header_title {
  font-size: 22px;
  color: rgba(0, 11, 21, 0.45);
  line-height: 34px;
  vertical-align: middle;
  &::after {
    content: '/';
    display: inline-block;
    margin: 0 5px;
  }
}
.preview {
  z-index: 999;
  width: 422px;
  height: 441px;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 2px 12px 0;
  border: 1px solid #ccc;
  margin: -12px;
  padding: 20px;
  .previewTitle {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: rgba(0, 11, 21, 0.85);
    letter-spacing: 0;
    line-height: 28px;
    font-weight: 900;
    display: flex;
    justify-content: space-between;
    height: 40px;
    border-bottom: 1px solid #ebeced;
  }
  .previewContent {
    width: 374px;
    height: 280px;
    overflow: hidden;
    margin-top: 15px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .previewBtn {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
.top-button {
  width: 40px;
}
.operations {
  display: flex;
  justify-content: space-between;
}
.operations-right {
  i {
    margin-left: 12px;
    font-size: 18px;
    color: #a0a8ae;
    cursor: pointer;
  }
  display: flex;
  align-items: center;
  .refresh-container {
    position: relative;
    display: flex;
    align-items: center;
    color: #a0a8ae;
    padding: 0 10px;
    cursor: pointer;
    span {
      padding-left: 6px;
    }
    // &::before {
    //   position: absolute;
    //   content: '';
    //   top: 3px;
    //   right: 0px;
    //   width: 0.5px;
    //   height: 80%;
    //   background-color: #a0a8ae;
    // }
  }
}
</style>
