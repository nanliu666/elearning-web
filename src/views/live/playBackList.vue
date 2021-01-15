<template>
  <div class="fill">
    <page-header title="直播回放" />
    <basic-container block>
      <common-table
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #topMenu>
          <div class="search-box">
            <search-popover
              ref="searchPopover"
              :require-options="searchConfig.requireOptions"
              :popover-options="searchConfig.popoverOptions"
              @submit="handleSearch"
            />
            <div
              v-if="activeIndex === '0'"
              class="filter-box"
            >
              <div
                class="search-sort-box"
                @click="loadTableData"
              >
                <i class="el-icon-refresh-right" />
                <span class="sort-text">刷新</span>
              </div>
              <el-popover
                placement="bottom"
                width="40"
                trigger="click"
                style="margin-left:10px"
              >
                <el-checkbox-group
                  v-model="columnsVisible"
                  style="display: flex;flex-direction: column;"
                >
                  <el-checkbox
                    v-for="item in tableColumns"
                    :key="item.prop"
                    :label="item.prop"
                    class="originColumn"
                  >
                    {{ item.label }}
                  </el-checkbox>
                </el-checkbox-group>
                <i
                  slot="reference"
                  class="el-icon-setting"
                  style="cursor: pointer;"
                />
              </el-popover>
            </div>
          </div>
        </template>
        <template #handler="{row}">
          <div class="menuClass">
            <el-button
              type="text"
              @click="jumpDetail(row)"
            >
              查看回放
            </el-button>
          </div>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import SearchPopover from '@/components/searchPopOver/index'
import { getArrangeList } from '@/api/examManage/schedule'
import { getCreatUsers, getKnowledgeCatalogList } from '@/api/knowledge/knowledge'
let TABLE_COLUMNS = [
  { type: 'index', label: '序号', minWidth: 150 },
  {
    label: '直播编号',
    prop: 'examName',
    minWidth: 150
  },

  {
    label: '直播名称',
    prop: 'category',
    minWidth: 120
  },
  {
    label: '所属分类',
    slot: true,
    prop: 'examPattern',
    minWidth: 120
  },
  {
    label: '包含课程',
    prop: 'examType',
    minWidth: 120
  },
  {
    label: '创建人',
    prop: 'examType',
    minWidth: 120
  },
  {
    label: '状态',
    prop: 'examType',
    minWidth: 120
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  showIndexColumn: false,
  enablePagination: true,
  enableMultiSelect: false,
  handlerColumn: {
    minWidth: 50
  }
}

const SEARCH_CONFIG = {
  requireOptions: [
    {
      type: 'input',
      field: 'examName',
      label: '',
      data: '',
      options: [],
      config: { placeholder: '输入直播标题或编号搜索', 'suffix-icon': 'el-icon-search' }
    }
  ],
  popoverOptions: [
    {
      type: 'treeSelect',
      field: 'catalogId',
      label: '所在分类',
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
            label: 'name',
            disabled: 'disabled',
            value: 'id'
          }
        }
      }
    },
    {
      type: 'select',
      field: 'userId',
      data: '',
      label: '创建人',
      options: [],
      config: { optionLabel: 'name', optionValue: 'userId' },
      loading: false,
      noMore: false,
      pageNo: 2,
      loadMoreFun(item) {
        if (item.loading || item.noMore) return
        item.loading = true
        getCreatUsers().then((res) => {
          if (res.length > 0) {
            item.options.push(...res)
            item.pageNo += 1
            item.loading = false
          } else {
            item.noMore = true
            item.loading = false
          }
        })
      }
    },
    {
      type: 'select',
      field: 'status',
      label: '状态',
      data: '',
      options: [
        { value: '', label: '全部' },
        { value: 0, label: '正常' },
        { value: 1, label: '禁用' }
      ]
    }
  ]
}
import styles from '@/styles/variables.scss'
import { getOrgTreeSimple } from '@/api/org/org'
export default {
  name: 'PlayBackList',
  components: { SearchPopover },
  filters: {
    // // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      activeColor: styles.primaryColor,
      activeIndex: '0',
      tableLoading: false,
      tableData: [],
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS,
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      searchConfig: SEARCH_CONFIG,
      queryInfo: {
        parentOrgId: '', // 分类ID
        creatorId: '', //评卷人id
        examType: '', //考试类型 CurrencyExam-通用考试 CourseExam-课程考试 TrainExam-培训班考试
        pageNo: 1,
        pageSize: 10,
        testPaper: '', //关联考卷id
        type: 0 //状态:0-已发布，1-草稿箱
      }
    }
  },
  activated() {
    this.initSearchData()
    getCreatUsers().then((res) => {
      this.searchConfig.popoverOptions[1].options.push(...res)
    })
    this.loadTableData()
    let categoryIdType = _.find(this.searchConfig.popoverOptions, { field: 'parentOrgId' })
    getOrgTreeSimple({ parentOrgId: 0 }).then((res) => {
      _.set(categoryIdType, 'config.treeParams.data', res)
    })
  },
  methods: {
    getCategoryList() {
      return getKnowledgeCatalogList().then((res) => {
        return _.concat(
          [
            {
              id: '',
              name: '全部'
            }
          ],
          res
        )
      })
    },
    async initSearchData() {
      let catalogId = _.find(this.searchConfig.popoverOptions, { field: 'catalogId' })
      // let tagId = _.find(this.searchPopoverConfig.popoverOptions, { field: 'tagId' })
      // if (tagId) {
      //   getKnowledgeManageTaglist().then(
      //     (res) =>
      //       (tagId.options = _.concat(
      //         [
      //           {
      //             id: '',
      //             name: '全部'
      //           }
      //         ],
      //         res
      //       ))
      //   )
      // }
      let catalogList = await this.getCategoryList()
      if (catalogId) {
        catalogId.config.treeParams.data = catalogList
      }
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
    // 跳转详情
    jumpDetail(row) {
      this.$router.push({ path: '/live/statisticsDetails', query: { id: row.id } })
    },
    // 切换nav
    handleSelect(key) {
      this.$refs.table.clearSelection()
      this.activeIndex = key
      this.handleSearch({ type: Number(key) })
    },
    // 加载函数
    async loadTableData() {
      if (this.tableLoading) {
        return
      }
      try {
        this.tableData = []
        this.tableLoading = true
        let { totalNum, data } = await getArrangeList(this.queryInfo)
        this.tableLoading = false
        this.tableData = data
        this.page.total = totalNum
      } catch (error) {
        this.tableLoading = false
        this.$message.error(error.message)
      }
    },
    // 搜索
    handleSearch(params) {
      this.queryInfo = _.assign(this.queryInfo, params)
      this.queryInfo.pageNo = 1
      this.page.currentPage = 1
      this.loadTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
  .el-menu {
    margin-bottom: 20px;
    margin-top: -10px;
  }
  /deep/ .el-menu--horizontal {
    border-bottom: 1px solid #cccccc !important;
  }
  .title {
    color: $primaryColor;
    cursor: pointer;
  }
}
.originColumn {
  height: 25px;
}
.search-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  i {
    color: #a0a8ae;
    font-size: 18px;
  }
  .filter-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .search-sort-box {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 10px;
    cursor: pointer;
    .sort-text {
      color: #a0a8ae;
      margin-left: 6px;
      font-size: 14px;
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
