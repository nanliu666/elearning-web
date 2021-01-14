<template>
  <div
    id="requiredSchedule"
    class="requiredSchedule Menu fill"
  >
    <!-- 必修课安排 页面 -->
    <page-header>
      <template slot="title">
        必修课程安排
      </template>
      <template slot="rightMenu">
        <el-button
          type="primary"
          size="medium"
          @click="jumpEdit"
        >
          新建课程安排
        </el-button>
      </template>
    </page-header>
    <basic-container
      block
      class="basicContainer clearfix"
    >
      <el-tabs v-model="activeTab">
        <el-tab-pane
          label="已发布"
          name="published"
        >
        </el-tab-pane>
        <el-tab-pane
          label="草稿"
          name="draft"
        >
        </el-tab-pane>
      </el-tabs>

      <div
        v-show="activeTab === 'published'"
        class="content published"
      >
        <div class="left-container">
          <!-- <leftColumn
            :search="true"
            :current-node-key="currentNodeKey"
            :more-menu="['edit', 'add', 'delete', 'move']"
            @node-click="nodeClick"
            @refreshTree="getCategoryData"
          ></leftColumn> -->

          <my-column
            :column-interface="columnInterface"
            @treeClick="treeClick"
          ></my-column>
        </div>
        <div class="divider"></div>
        <common-table
          ref="table"
          class="commonTable"
          :columns="published.columnsVisible | columnsFilter"
          :config="published.tableConfig"
          :data="published.tableData"
          :loading="published.tableLoading"
          :page="published.page"
          @current-page-change="handlePublishedPageChange"
          @page-size-change="handlePublishedPageSizeChange"
        >
          <template #topMenu>
            <div class="operations">
              <SearchPopover
                ref="searchPopover"
                :popover-options="published.searchPopoverConfig.popoverOptions"
                :require-options="published.searchPopoverConfig.requireOptions"
                @submit="handlePublishedSearch"
              />
              <div class="operations-right">
                <div
                  class="refresh-container"
                  @click="refreshPublished"
                >
                  <i class="el-icon-refresh-right" />
                  <span>刷新</span>
                </div>
                <el-popover
                  placement="bottom"
                  width="40"
                  trigger="click"
                >
                  <i
                    slot="reference"
                    style="cursor: pointer;"
                    class="el-icon-setting"
                  />
                  <!-- 设置表格列可见性 -->
                  <div class="operations__column--visible">
                    <el-checkbox-group v-model="published.columnsVisible">
                      <el-checkbox
                        v-for="item of published.tableColumns"
                        :key="item.prop"
                        :label="item.prop"
                        class="operations__column--item"
                      >
                        {{ item.label }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-popover>
              </div>
            </div>
          </template>
          <template
            slot="multiSelectMenu"
            slot-scope="{ selection }"
          >
            <el-button
              type="text"
              size="medium"
              icon="el-icon-delete"
              @click="handleDelete(selection)"
            >
              批量删除
            </el-button>
          </template>
          <template #handler="{row}">
            <el-button
              type="text"
              size="medium"
              :disabled="[2, 3].includes(row.status)"
              @click="jumpEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="medium"
              :disabled="[2].includes(row.status)"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
            <el-button
              type="text"
              size="medium"
              :disabled="[1, 2].includes(row.status)"
              @click="jumpUserList(row)"
            >
              查看完成率
            </el-button>
          </template>
        </common-table>
      </div>

      <div
        v-show="activeTab === 'draft'"
        class="content"
      >
        <common-table
          ref="draftTable"
          class="draftTable"
          :columns="draft.columnsVisible | columnsFilter"
          :config="draft.tableConfig"
          :data="draft.tableData"
          :loading="draft.tableLoading"
          :page="draft.page"
          @current-page-change="handleDraftPageChange"
          @page-size-change="handleDraftPageSizeChange"
        >
          <template #topMenu>
            <div class="operations">
              <SearchPopover
                ref="searchPopover"
                :require-options="draft.searchPopoverConfig.requireOptions"
                @submit="handleDraftSearch"
              />
              <div class="operations-right">
                <div
                  class="refresh-container"
                  @click="loadDraftData"
                >
                  <i class="el-icon-refresh-right" />
                  <span>刷新</span>
                </div>
                <el-popover
                  placement="bottom"
                  width="40"
                  trigger="click"
                >
                  <i
                    slot="reference"
                    style="cursor: pointer;"
                    class="el-icon-setting"
                  />
                  <!-- 设置表格列可见性 -->
                  <div class="operations__column--visible">
                    <el-checkbox-group v-model="draft.columnsVisible">
                      <el-checkbox
                        v-for="item of draft.tableColumns"
                        :key="item.prop"
                        :label="item.prop"
                        class="operations__column--item"
                      >
                        {{ item.label }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-popover>
              </div>
            </div>
          </template>
          <template
            slot="multiSelectMenu"
            slot-scope="{ selection }"
          >
            <el-button
              type="text"
              size="medium"
              icon="el-icon-delete"
              @click="handleDelete(selection)"
            >
              批量删除
            </el-button>
          </template>
          <template #handler="{row}">
            <el-button
              type="text"
              @click="jumpEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </common-table>
      </div>
    </basic-container>
  </div>
</template>

<script>
import SearchPopover from '@/components/searchPopOver/index'
// import leftColumn from '@/components/leftColumn'
import {
  getlearnPlanList,
  getCatalogs,
  deletePlan,
  addCatalog,
  delCatalogs,
  updateCatalogs,
  moveCatalogs
} from '@/api/learnPlan'

// 表格属性
const TABLE_COLUMNS = [
  {
    label: '编号',
    width: 180,
    prop: 'coursePlanNo'
  },
  {
    label: '名称',
    prop: 'coursePlanName',
    width: 300
  },
  {
    label: '分类',
    prop: 'categoryName',
    minWidth: 100
  },
  {
    label: '包含课程',
    formatter: (row) => _.map(row.courseList, 'courseName').join(','),
    prop: 'courseList',
    minWidth: 100
  },
  {
    label: '课程时间',
    prop: 'time',
    formatter: (row) => row.startTime + '~' + row.endTime,
    minWidth: 100
  }
]
const TABLE_CONFIG = {
  enablePagination: true,
  height: 'calc(100% - 94px)',
  enableMultiSelect: true,
  rowKey: 'id',
  showHandler: true,
  handlerColumn: { label: '操作', minWidth: 200, fixed: 'right' }
}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '课程名称搜索', 'suffix-icon': 'el-icon-search' },
    data: '',
    field: 'coursePlanName',
    label: '',
    type: 'input'
  }
]
let SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    type: 'input',
    field: 'coursePlanNo',
    label: '课程编号',
    data: ''
  },
  // {
  //   type: 'input',
  //   field: 'coursePlanName',
  //   label: '课程安排名称',
  //   data: ''
  // },
  {
    type: 'select',
    field: 'status',
    label: '状态',
    data: '',
    options: [
      { value: 1, label: '未开始' },
      { value: 2, label: '进行中' },
      { value: 3, label: '已结束' }
    ]
  },
  {
    data: '',
    label: '时间选择',
    type: 'dataPicker',
    field: 'startTime,endTime',
    config: { type: 'daterange', 'value-format': 'yyyy-MM-dd HH:mm:ss' }
  },
  {
    type: 'input',
    field: 'sponsor',
    label: '主办单位',
    data: ''
  }
]
let SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
export default {
  name: 'CoursePlanList',
  components: {
    SearchPopover,
    // leftColumn,
    MyColumn: () => import('./components/MyColumn')
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      // 左侧栏接口
      columnInterface: {
        listTeacherCategory: getCatalogs, //查询列表
        addCatalog: addCatalog, //新增分组/分类
        deleteTeacherCatalog: delCatalogs, //删除分组/分类
        move: moveCatalogs, //移动
        editTeacherCatalog: updateCatalogs //编辑
      },
      data: [],
      currentNodeKey: '', // 默认选中的节点key
      activeTab: 'published',
      moveKnowledgeRow: {},

      published: {
        searchPopoverConfig: SEARCH_POPOVER_CONFIG,
        tableColumns: TABLE_COLUMNS,
        tableConfig: TABLE_CONFIG,
        tableData: [],
        tableLoading: false,
        queryInfo: {
          sponsor: '',
          type: 0,
          courseCatalogName: '',
          startTime: '',
          coursePlanName: '',
          coursePlanNo: '',
          id: ''
        },
        columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
        page: {
          currentPage: 1,
          size: 10,
          total: 0
        }
      },
      draft: {
        searchPopoverConfig: {
          requireOptions: [
            {
              config: { placeholder: '课程名称搜索', 'suffix-icon': 'el-icon-search' },
              data: '',
              field: 'name',
              label: '',
              type: 'input'
            }
          ]
        },
        tableColumns: TABLE_COLUMNS,
        tableConfig: TABLE_CONFIG,
        tableData: [],
        tableLoading: false,
        queryInfo: {
          type: 1
        },
        columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
        page: {
          currentPage: 1,
          size: 10,
          total: 0
        }
      }
    }
  },
  activated() {
    this.refreshPublished()
    this.loadDraftData()
  },
  created() {},
  methods: {
    // 点击左侧档返回数据
    treeClick(id) {
      this.published.queryInfo.categoryId = id
      this.loadPublishedData()
    },
    jumpUserList(row) {
      // 查看完成率
      this.$router.push({ path: '/learnPlan/CourseUserList', query: { planId: row.id } })
    },
    jumpEdit(row) {
      this.$router.push({
        path: '/learnPlan/edit',
        query: { id: row.id }
      })
    },
    refreshPublished() {
      this.loadPublishedData()
    },

    handleDelete(selection) {
      if (Array.isArray(selection)) {
        if (_.some(selection, { status: 2 })) {
          this.$alert(
            '你选择的课程安排中包含正在进行中的，不能进行删除操作，是否忽略继续删除其它课程安排？',
            {
              confirmButtonText: '知道了',
              callback: () => {
                this.deletePlanFn(selection)
              }
            }
          )
          return
        }
        this.deletePlanFn(selection)
      } else {
        if (selection.status === 2) {
          this.$alert('选中的课程安排正在进行中，无法进行删除操作。', {
            confirmButtonText: '关闭',
            callback: () => {}
          })
        }
        this.deletePlanFn([selection])
      }
    },
    deletePlanFn(arr) {
      // 删除学习计划
      deletePlan({ ids: _.map(arr, 'id').join(',') })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadPublishedData()
        })
        .catch()
    },

    handlePublishedPageChange(param) {
      this.published.queryInfo.pageNo = param
      this.loadPublishedData()
    },
    handleDraftPageChange(param) {
      this.draft.queryInfo.pageNo = param
      this.loadDraftData()
    },
    handlePublishedPageSizeChange(param) {
      this.published.queryInfo.pageSize = param
      this.loadPublishedData()
    },
    handleDraftPageSizeChange(param) {
      this.draft.queryInfo.pageSize = param
      this.loadDraftData()
    },
    /**
     * 搜索
     */
    handlePublishedSearch(searchParams) {
      this.published.queryInfo = _.assign(this.published.queryInfo, searchParams)
      this.published.page.currentPage = 1
      this.loadPublishedData()
    },
    handleDraftSearch(searchParams) {
      this.draft.queryInfo = _.assign(this.draft.queryInfo, searchParams)
      this.draft.page.currentPage = 1
      this.loadPublishedData()
    },
    // 跳去详情
    jumpDetail({ id }) {
      this.$router.push({
        path: '/repository/knowledgeDetail',
        query: { id }
      })
    },

    async loadDraftData() {
      const draft = this.draft
      if (draft.tableLoading) return
      draft.tableLoading = true
      try {
        let { totalNum, data } = await getlearnPlanList({
          ...draft.queryInfo,
          pageNo: draft.page.currentPage,
          pageSize: draft.page.size
        })
        draft.tableData = data
        draft.page.total = totalNum
      } catch (error) {
        // window.console.log(error)
      } finally {
        draft.tableLoading = false
      }
    },
    // 加载表格数据
    async loadPublishedData() {
      const published = this.published
      if (published.tableLoading) return
      published.tableLoading = true
      try {
        let { totalNum, data } = await getlearnPlanList({
          ...published.queryInfo,
          pageNo: published.page.currentPage,
          pageSize: published.page.size
        })
        published.tableData = data
        published.page.total = totalNum
      } catch (error) {
        // window.console.log(error)
      } finally {
        published.tableLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.requiredSchedule {
  .startBtn {
    cursor: pointer;
    color: #01aafc;
  }
  .basicContainer {
    position: relative;
    .content {
      // padding: 24px;
      height: calc(100% - 34px);
      overflow: auto;
      position: relative;
      &.published {
        display: flex;
        flex-wrap: nowrap;
        .left-container {
          height: 100%;
          width: 300px;
        }
        .divider {
          position: absolute;
          left: 316px;
          top: 0;
          height: 100%;
          width: 1px;
          background: #ebeced;
        }
        .commonTable {
          // width: ;
          margin-left: 33px;
          height: 100%;
          width: calc(100% - 33px - 300px);
        }
      }
    }
  }
  /deep/ .operations {
    .topMenu_right {
      float: right;
    }
  }
}
.clearfix:after {
  content: '';
  display: block;
  clear: both;
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
    &::before {
      position: absolute;
      content: '';
      top: 3px;
      right: 0px;
      width: 0.5px;
      height: 80%;
      background-color: #a0a8ae;
    }
  }
}
</style>
<style lang="sass" scoped>
$color_icon: #A0A8AE
.status-span
    padding: 4px;
    border-radius: 2px;
/deep/.basic-container--block
  height: calc(100% - 92px)
  min-height: calc(100% - 92px)
  .el-card
    height: 100%
  .el-card__body
    height: 100%
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
