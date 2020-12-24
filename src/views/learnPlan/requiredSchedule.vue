<template>
  <div
    id="requiredSchedule"
    class="requiredSchedule Menu fill"
  >
    <!-- 必修课安排 页面 -->
    <page-header>
      <template slot="title">
        <span class="header_title">必修课程安排</span>学员完成率
      </template>
      <template slot="rightMenu">
        <el-button
          type="primary"
          size="medium"
          @click="toAddCertificate"
        >
          新建模板
        </el-button>
      </template>
    </page-header>
    <basic-container
      block
      class="basicContainer clearfix"
    >
      <leftColumn
        :search="true"
        :data="data"
        :current-node-key="currentNodeKey"
        :more-menu="['edit', 'add', 'delete', 'move']"
        :interface-list="interfaceList"
        @node-click="nodeClick"
        @refreshTree="isgetCatalogs"
      ></leftColumn>
      <div class="line"></div>
      <common-table
        ref="table"
        class="commonTable"
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
                  <el-checkbox-group v-model="columnsVisible">
                    <el-checkbox
                      v-for="item of tableColumns"
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
        <template #courseList="{row}">
          <span>{{ row.courseList.map((item) => item.courseName).join(',') }}</span>
        </template>
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            type="text"
            size="medium"
            icon="el-icon-delete"
            @click="multipleDeleteClick(selection)"
          >
            批量删除
          </el-button>
        </template>
        <template #handler="{row}">
          <span class="startBtn">编辑 &nbsp; </span>
          <span
            class="startBtn"
            :title="row.title"
          >删除 &nbsp; </span>
          <span
            class="startBtn"
            @click="viewRate(row)"
          >查看完成率 &nbsp; </span>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import SearchPopover from '@/components/searchPopOver/index'
import leftColumn from '@/components/leftColumn'
import {
  getlearnPlanList,
  addCatalog,
  delCatalogs,
  getCatalogs,
  moveCatalogs,
  updateCatalogs
} from '@/api/learnPlan'
// import { getCatalogs } from '@/api/training/training'

// 表格属性
const TABLE_COLUMNS = [
  {
    label: '编号',
    width: 180,
    prop: 'courseCatalogId'
  },
  {
    label: '名称',
    prop: 'coursePlanName',
    width: 300
  },
  {
    label: '分类',
    prop: 'courseCatalogName',
    minWidth: 100
  },
  {
    label: '包含课程',
    slot: true,
    prop: 'courseList',
    minWidth: 100
  },
  {
    label: '开始时间',
    slot: true,
    prop: 'startTime',
    minWidth: 100
  },
  {
    label: '结束时间',
    slot: true,
    prop: 'endTime',
    minWidth: 100
  }
]
const TABLE_CONFIG = {
  enablePagination: true,

  enableMultiSelect: true,
  rowKey: 'id',
  showHandler: true,
  treeProps: { hasChildren: 'hasChildren', children: 'children' }
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '输入菜单名称搜索', 'suffix-icon': 'el-icon-search' },
    data: '',
    field: 'name',
    label: '',
    type: 'input'
  }
]
let SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    type: 'input',
    field: 'cellPhone',
    label: '手机',
    data: ''
    // config: { optionLabel: 'name', optionValue: 'id' }
  },
  {
    type: 'select',
    field: 'course',
    label: '课程',
    data: '',
    options: [
      { value: 0, label: '停用' },
      { value: 1, label: '正常' }
    ]
  },
  {
    type: 'numInterval',
    field: 'percentageRate',
    label: '完成率 （%）',
    data: { min: '', max: '' }
    // config: { optionLabel: 'name', optionValue: 'id' }
  }
]
let SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
const FORM_COLUMNS = [
  {
    label: '移动到新目录',
    itemType: 'treeSelect',
    prop: 'catalogId',
    required: true,
    span: 24,
    props: {
      selectParams: {
        placeholder: '请选择所在目录',
        multiple: false
      },
      treeParams: {
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        data: [],
        filterable: false,
        props: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        required: true
      }
    }
  }
]
export default {
  name: 'KnowledgeManagement',
  components: {
    SearchPopover,
    leftColumn
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      currentNodeKey: '', // 默认选中的节点key
      interfaceList: {
        addCatalog: addCatalog,
        delCatalogs: delCatalogs,
        getCatalogs: getCatalogs,
        moveCatalogs: moveCatalogs,
        updateCatalogs: updateCatalogs
      },
      data: [],
      preview: {},
      moveKnowledgeRow: {},
      formColumns: FORM_COLUMNS,
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
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        sponsor: '',
        courseCatalogName: '',
        startTime: '',
        coursePlanName: '',
        coursePlanNo: '',
        courseCatalogId: ''
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
    // this.initSearchData()
    // this.refreshTableData()
  },
  created() {
    this.isgetCatalogs().then(() => this.refreshTableData())
  },
  methods: {
    nodeClick(data) {
      this.queryInfo.courseCatalogId = data.id
      this.refreshTableData()
    },
    // 拿左侧树形图数据
    isgetCatalogs() {
      return getCatalogs().then((res) => {
        let datar = []
        for (let i = 0; i < res.length; i++) {
          let d = {
            id: 1,
            label: '一级 1',
            btnshow: 1,
            children: []
          }
          d.id = res[i].id
          d.label = res[i].name
          d.btnshow = 1
          d.children = []
          datar.push(d)

          for (let f = 0; f < res[i].list.length; f++) {
            let c = {
              id: 1,
              label: '一级 1',
              btnshow: 1,
              parentId: ''
            }
            c.id = res[i].list[f].id
            c.label = res[i].list[f].name
            c.btnshow = 0
            c.parentId = res[i].list[f].parentId
            datar[i].children.push(c)
          }
        }
        this.data = datar
        let firstNode = this.data[0]
        this.currentNodeKey =
          firstNode.hasOwnProperty('children') && firstNode.children.length > 0
            ? firstNode.children[0].id
            : firstNode.id
        // this.idSchedule = datar[0].children[0].id
        this.queryInfo.courseCatalogId = this.currentNodeKey
        // this.isgetScheduleList()
      })
    },
    viewRate(row) {
      // 查看完成率
      window.sessionStorage.setItem('requiredScheduleDetail', JSON.stringify(row))
      this.$router.push({ path: '/learnPlan/requiredScheduleDetail' })
    },
    // 去新建证书
    toAddCertificate() {
      this.$router.push({ path: '/learnPlan/newSchedule' })
    },
    /**
     * 处理页码改变
     */
    handleCurrentPageChange(param) {
      this.queryInfo.pageNo = param
      this.loadTableData()
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.queryInfo.pageSize = param
      this.loadTableData()
    },
    /**
     * 搜索
     */
    handleSearch(searchParams) {
      for (let i in searchParams) {
        this.queryInfo[i] = searchParams[i]
      }
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
        let { totalNum, data } = await getlearnPlanList(this.queryInfo)
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
.requiredSchedule {
  .startBtn {
    cursor: pointer;
    color: #01aafc;
  }
  .leftColumn {
    width: 300px;
    float: left;
  }
  .commonTable {
    margin-left: 320px;
  }
  .basicContainer {
    position: relative;
    .line {
      position: absolute;
      left: 335px;
      top: 0;
      height: 100%;
      width: 1px;
      border: 24px solid #fff;
      border-width: 24px 0 24px 0;
      background-color: rgba(0, 11, 21, 0.25);
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
