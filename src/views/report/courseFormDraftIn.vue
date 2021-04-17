<template>
  <div class="Menu fill">
    <page-header
      title="课件详情"
      show-back
    />

    <basic-container block>
      <common-table
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
      >
        <template #topMenu>
          <div class="operations">
            <div class="courseNameTitle">
              <div>课程名： {{ $route.query.courseName }}</div>
              <div>学员名： {{ $route.query.name }}</div>
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
            </div>
          </div>
        </template>

        <!-- <template #progress="{row}">
          <el-progress :percentage="row.progress || 0"></el-progress>
        </template> -->

        <template #progress="{row}">
          {{ row.progress + '%' }}
        </template>

        <template #coursePeriod="{row}">
          {{ formatSeconds(row.coursePeriod) || '0秒' }}
        </template>
        <template #studyPeriod="{row}">
          {{ formatSeconds(row.studyPeriod) || '0秒' }}
        </template>
        <!-- <template #handler="{row}">
          <el-button
            type="text"
            @click="jumpDetail(row)"
          >
            详情
          </el-button>
        </template> -->
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import { contentCountList } from '@/api/courseForm'
import { getStore } from '@/util/store.js'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '序号',
    width: 70,
    type: 'index'
  },
  {
    label: '章节名称',
    minWidth: 150,
    prop: 'contentName'
  },
  {
    label: '章节时长',
    prop: 'coursePeriod',
    maxWidth: 100,
    slot: true
  },
  {
    label: '学习时长',
    prop: 'studyPeriod',
    minWidth: 100,
    slot: true
  },
  {
    label: '学习进度统计',
    slot: true,
    prop: 'progress',
    minWidth: 100
  }
]
const TABLE_CONFIG = {
  enablePagination: true,
  //   showHandler: true,
  //   enableMultiSelect: true,
  // showIndexColumn: true,
  rowKey: 'id'
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = []
let SEARCH_POPOVER_POPOVER_OPTIONS = []
let SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
const FORM_COLUMNS = []
export default {
  //   components: {
  //     SearchPopover
  //   },
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
      queryInfo: {
        courseId: '',
        userId: ''
      },
      userId: '',
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false,
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },

  activated() {
    this.loadTableData()
    this.userId = this.$route.query.userId
  },
  created() {
    this.userId = this.$route.query.userId
    this.loadTableData()
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
      let url = `api/manage/v1/content/exportContentList?courseId=${this.$route.query.courseId}&userId=${this.userId}`
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
    // 加载表格数据
    async loadTableData() {
      if (this.tableLoading) return
      this.tableLoading = true
      try {
        this.queryInfo.courseId = this.$route.query.courseId
        this.queryInfo.userId = this.userId
        let res = await contentCountList(this.queryInfo)
        this.tableData = res
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
  font-size: 14px;
  font-weight: bold;
  color: #777;
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
