<template>
  <div class="Menu fill">
    <page-header
      title="课程报表详情"
      show-back
    />

    <basic-container block>
      <common-table
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page-config="tablePageConfig"
        :page="queryInfo"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #topMenu>
          <div class="operations">
            <!-- <SearchPopover
              ref="searchPopover"
              :popover-options="searchPopoverConfig.popoverOptions"
              :require-options="searchPopoverConfig.requireOptions"
              @submit="handleSearch"
            /> -->
            <div class="courseNameTitle">
              课程名： {{ $route.query.courseName }}
            </div>
            <div class="operations-right">
              <div>
                <el-button
                  size="mini"
                  @click="exportFn"
                >
                  导出
                </el-button>
              </div>
              <!-- <div class="refresh-container" @click="loadTableData">
                <i class="el-icon-refresh-right" />
                <span>刷新</span>
              </div> -->
              <!-- <el-popover placement="bottom" width="40" trigger="click">
                <i slot="reference" style="cursor: pointer;" class="el-icon-setting" />
                <div class="operations__column--visible">
                  <el-checkbox-group v-model="columnsVisible">
                    <el-checkbox
                      v-for="item of tableColumns"
                      :key="item.prop"
                      :disabled="item.prop === 'resName'"
                      :label="item.prop"
                      class="operations__column--item"
                    >
                      {{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-popover> -->
            </div>
          </div>
        </template>

        <template #courseTime="{row}">
          {{ parseInt(row.courseTime) || 0 }}
        </template>

        <!-- <template slot="name" slot-scope="{ row }">
          <div class="ellipsis title" @click="jumpDetail(row)">
            {{ row.name }}
          </div>
        </template> -->
        <template #handler="{row}">
          <el-button
            type="text"
            @click="jumpDetail(row)"
          >
            详情
          </el-button>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import { queryCourseCountStudentList } from '@/api/courseForm'
import { getOrgTreeSimple } from '@/api/org/org'
import { getStore } from '@/util/store.js'

// 表格属性
const TABLE_COLUMNS = [
  {
    label: '序号',
    width: 70,
    type: 'index'
  },
  {
    label: '姓名',
    prop: 'name'
  },
  {
    label: '部门',
    prop: 'orgName'
  },
  {
    label: '岗位',
    prop: 'positionName'
  },
  {
    label: '课程总时长',
    slot: true,
    prop: 'courseTime'
  },
  {
    label: '学习次数',
    prop: 'studyTimes',
    slot: true
  },
  {
    label: '学习时长',
    prop: 'period',
    slot: true
  }
]
const TABLE_CONFIG = {
  enablePagination: true,
  showHandler: true,
  //   enableMultiSelect: true,
  // showIndexColumn: true,
  rowKey: 'id'
  //   treeProps: { hasChildren: 'hasChildren', children: 'children' }
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '输入课程名称搜索', 'suffix-icon': 'el-icon-search' },
    data: '',
    field: 'name',
    label: '',
    type: 'input'
  }
]
let SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    type: 'dataPicker',
    label: '日期范围',
    data: '',
    field: 'startTime,endTime',
    config: {
      type: 'daterange'
      //   'range-separator': '至',
      //   'value-format': 'yyyy-MM-dd HH:mm:ss'
    }
  },
  {
    type: 'treeSelect',
    field: 'orgId',
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
  }
]
let SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
const FORM_COLUMNS = []
export default {
  // components: {
  //   SearchPopover
  // },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      moveKnowledgeRow: {},
      formColumns: FORM_COLUMNS,
      formData: {
        catalogId: ''
      },
      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      // 请求参数
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        courseId: ''
      },
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false,
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },

  activated() {
    this.refreshTableData()
    this.loadOrgData()
  },
  created() {
    this.refreshTableData()
    this.loadOrgData()
  },
  methods: {
    // 导出
    exportFn() {
      this.queryInfo.courseId = this.$route.query.courseId
      let url = `api/manage/v1/web/coursecenter/queryCourseCountStudentListExcelExport?courseId=${this.queryInfo.courseId}&pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`
      this.repDownload(url)
    },
    repDownload(url) {
      // 下载
      let token = getStore({ name: 'token' })
      let x = new XMLHttpRequest()
      x.open('GET', url, true)
      x.setRequestHeader('accessToken', `bearer  ${token}`)
      x.responseType = 'blob'
      x.onprogress = function() {}
      x.onload = () => {
        let url = window.URL.createObjectURL(x.response)
        let a = document.createElement('a')
        a.href = url
        a.download = '导出文件.xlsx' //可以填写默认的下载名称
        a.click()
        this.isLoading = false
      }

      x.send()
    },

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
      this.queryInfo = _.assign(this.queryInfo, { pageNo: param })
      this.loadTableData()
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.queryInfo = _.assign(this.queryInfo, { pageSize: param })
      this.loadTableData()
    },

    // 跳去详情
    jumpDetail(row) {
      console.log(row)
      this.$router.push({
        path: '/report/courseFormDraftIn',
        query: {
          userId: row.userId,
          courseId: this.$route.query.courseId,
          courseName: this.$route.query.courseName,
          name: row.name
        }
      })
    },
    // 刷新列表数据
    refreshTableData() {
      //  因为只加载了最外层的数据，children仍然是旧的，清空数据
      this.tableData = []
      this.loadTableData()
    },
    // 加载表格数据
    async loadTableData() {
      if (this.tableLoading) return
      this.tableLoading = true
      try {
        this.queryInfo.courseId = this.$route.query.courseId
        let { totalNum, data } = await queryCourseCountStudentList(this.queryInfo)
        this.tableData = data
        this.queryInfo.total = totalNum
      } catch (error) {
        window.console.log(error)
      } finally {
        this.tableLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.handle__button {
  display: flex;
  justify-content: space-between;
  .top__button {
    width: 30px;
  }
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
/deep/.el-card {
  border: none;
}
.courseNameTitle {
  font-size: 16px;
  font-weight: bold;
  color: #777;
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
