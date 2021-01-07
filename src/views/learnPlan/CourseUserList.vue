<template>
  <div
    id="requiredScheduleDetail"
    class="requiredSchedule Menu fill"
  >
    <!-- 必修课安排 详情页面 -->
    <page-header>
      <template slot="title">
        <span class="header_title">必修课程安排</span>学员完成率
      </template>
    </page-header>
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
          </div>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import SearchPopover from '@/components/searchPopOver/index'
import { queryPercentageComplete } from '@/api/learnPlan'

// 表格属性
const TABLE_COLUMNS = [
  {
    label: '姓名',
    width: 180,
    prop: 'name'
  },
  {
    label: '手机',
    prop: 'text',
    width: 300
  },
  {
    label: '部门名称',
    prop: 'awardAgency',
    minWidth: 100
  },
  {
    label: '课程名称',
    slot: true,
    prop: 'name1',
    minWidth: 100
  },
  {
    label: '完成率',
    slot: true,
    prop: 'name2',
    minWidth: 100
  }
]
const TABLE_CONFIG = {
  enablePagination: true,
  enableMultiSelect: true,
  rowKey: 'id',
  treeProps: { hasChildren: 'hasChildren', children: 'children' }
}
// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '输入学员姓名搜索', 'suffix-icon': 'el-icon-search' },
    data: '',
    field: 'participantName',
    label: '',
    type: 'input'
  }
]
let SELECT_GROUP = JSON.parse(window.sessionStorage.requiredScheduleDetail).courseList || []
SELECT_GROUP = SELECT_GROUP.map((item) => {
  item.value = item.id
  item.label = item.courseName
  return item
})
let SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    type: 'input',
    field: 'phonenum',
    label: '手机',
    data: ''
    // config: { optionLabel: 'name', optionValue: 'id' }
  },
  {
    type: 'select',
    field: 'courseId',
    label: '课程',
    data: '',
    options: SELECT_GROUP
  },
  {
    type: 'numInterval',
    field: 'totalPrecentMin,totalPrecentMax',
    label: '完成率 （%）',
    data: { min: '', max: '' }
    // config: { optionLabel: 'name', optionValue: 'id' }
  }
]
let SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}

export default {
  name: 'CourseUserList',
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
      formData: {
        catalogId: ''
      },

      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      // 请求参数
      queryInfo: {
        courseName: '', // 课程名字
        phonenum: '', // 电话号码
        totalPrecentMax: '', // 最大完成值
        totalPrecentMin: '' // 最小完成值
        // courseCatalogId: ''
      },
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false
    }
  },
  computed: {
    courseId() {
      return this.$route.query.courseId
    }
  },
  activated() {
    // this.initSearchData()
    this.refreshTableData()
  },
  methods: {
    /**
     * 处理页码改变
     */
    handleCurrentPageChange(param) {
      this.page.pageNo = param
      this.loadTableData()
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.loadTableData()
    },
    /**
     * 搜索
     */
    handleSearch(searchParams) {
      this.queryInfo = _.assign(this.queryInfo, searchParams)
      this.loadTableData()
    },
    // 跳去详情
    jumpDetail({ id }) {
      this.$router.push({
        path: '/repository/knowledgeDetail',
        query: { id }
      })
    },
    // 刷新列表数据
    // 加载表格数据
    async loadTableData() {
      if (this.tableLoading) return
      this.tableLoading = true
      try {
        this.queryInfo.courseName = this.queryInfo.courseId == 0 ? '停用' : '启用'
        let queryData = JSON.parse(JSON.stringify(this.queryInfo))
        let { totalNum, data } = await queryPercentageComplete(queryData)
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
</style>
<style lang="sass" scoped>
$color_icon: #A0A8AE
.status-span
    padding: 4px;
    border-radius: 2px;
.basic-container--block
  height: calc(100% - 92px)
  min-height: calc(100% - 92px)
.title
  color: $primaryColor
  cursor: pointer
.operations
  align-items: center
  display: flex
  justify-content: space-between
  &__column--item
    height: 25px
  &__column--visible
    height: 200px
    overflow: scroll
  &__btns
    align-items: center
    display: flex
    height: 24px
    justify-content: flex-start
  &__btns--item
    margin: 0
    margin-right: 4px
    padding: 0
    height: 24px
    width: 24px
    line-height: 24px
    &:last-child
      margin: 0
    // margin-bottom: 8px
    // margin-right: 8px
  .iconfont
    color: $color_icon
    font-weight: bold
    font-size: 16px

.Menu
  // 添加一个分隔号 "｜"
  .table__handler
    display: flex
    justify-content: flex-end
    > .el-button--text
      text-align: center
      padding: 0 8px
      margin-left: 0px
      position: relative
      &:not(:last-child)::after
        background-color: #e3e7e9
        content: ''
        height: 10px
        position: absolute
        right: 0
        top: 50%
        transform: translateY(-50%)
        width: 1px
</style>
