<template>
  <div class="Menu fill">
    <page-header title="课程报表" />

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
            <SearchPopover
              ref="searchPopover"
              :popover-options="searchPopoverConfig.popoverOptions"
              :require-options="searchPopoverConfig.requireOptions"
              @submit="handleSearch"
            />
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
          {{ formatSeconds(row.courseTime) || '0秒' }}
        </template>

        <template #period="{row}">
          {{ formatSeconds(row.period) || '0秒' }}
        </template>
        <template #credit="{row}">
          {{ row.credit == '0.0' ? 0 : row.credit }}
        </template>
        <template #scope="{row}">
          {{ row.scope == '0.0' ? 0 : row.scope }}
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
import { queryCourseCountList } from '@/api/courseForm'
import SearchPopover from '@/components/searchPopOver/index'
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
    label: '课程名称',
    minWidth: 150,
    prop: 'name'
  },
  {
    label: '课时',
    prop: 'courseTime',
    slot: true,
    maxWidth: 100
  },
  {
    label: '积分',
    prop: 'credit',
    minWidth: 100,
    slot: true
  },
  {
    label: '讲师',
    slot: true,
    prop: 'teacherName',
    minWidth: 100
  },
  {
    label: '学习中人数',
    prop: 'count',
    slot: true,
    minWidth: 100
  },
  {
    label: '已完成人数',
    prop: 'passCount',
    slot: true,
    minWidth: 100
  },
  {
    label: '学习总时长',
    prop: 'period',
    slot: true,
    minWidth: 100
  },
  {
    label: '课程评分',
    prop: 'scope',
    slot: true,
    minWidth: 100
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
    field: 'courseName',
    label: '',
    type: 'input'
  }
]
let SEARCH_POPOVER_POPOVER_OPTIONS = [
  // {
  //   type: 'dataPicker',
  //   label: '日期范围',
  //   data: '',
  //   field: 'startTime,endTime',
  //   config: {
  //     type: 'daterange'
  //     //   'range-separator': '至',
  //     //   'value-format': 'yyyy-MM-dd HH:mm:ss'
  //   }
  // },
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
  name: 'KnowledgeManagement',
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
        courseName: '',
        orgId: ''
      },
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [1, 2, 3, 4, 5, 6],
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
    /**
     * 格式化秒
     * @param int  value 总秒数
     * @return string result 格式化后的字符串
     */
    formatSeconds(value) {
      let theTime = parseInt(value) // 需要转换的时间秒
      let theTime1 = 0 // 分
      let theTime2 = 0 // 小时
      let theTime3 = 0 // 天
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60)
        theTime = parseInt(theTime % 60)
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60)
          theTime1 = parseInt(theTime1 % 60)
          if (theTime2 > 24) {
            //大于24小时
            theTime3 = parseInt(theTime2 / 24)
            theTime2 = parseInt(theTime2 % 24)
          }
        }
      }
      let result = ''
      if (theTime > 0) {
        result = '' + parseInt(theTime) + '秒'
      }
      if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + '分钟' + result
      }
      if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + '小时' + result
      }
      if (theTime3 > 0) {
        result = '' + parseInt(theTime3) + '天' + result
      }
      return result
    },
    // 导出
    exportFn() {
      let url = `api/manage/v1/web/coursecenter/queryCourseCountListExcelExport?courseName=${this.queryInfo.courseName}&orgId=${this.queryInfo.orgId}&pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}&`
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
          (this.searchPopoverConfig.popoverOptions[0].config.treeParams.data = _.concat(
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
    /**
     * 搜索
     */
    handleSearch(searchParams) {
      this.queryInfo = _.assign(this.queryInfo, searchParams)
      this.queryInfo.pageNo = 1
      this.queryInfo.currentPage = 1

      this.loadTableData()
    },
    // 跳去详情
    jumpDetail(row) {
      this.$router.push({
        path: '/report/courseFormDraft',
        query: { courseId: row.id, courseName: row.name }
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
        this.tableData = []
        this.queryInfo.courseId = this.$route.query.id
        let { totalNum, data } = await queryCourseCountList(this.queryInfo)
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
/deep/.cell:empty::before {
  content: '--';
  color: gray;
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
