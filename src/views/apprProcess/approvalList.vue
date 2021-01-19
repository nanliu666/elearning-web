<template>
  <div class="approval-index-style fill">
    <page-header title="审批流程">
      <template #rightMenu>
        <el-button
          type="primary"
          size="medium"
          @click="jumpCreate"
        >
          创建审批流程
        </el-button>
      </template>
    </page-header>
    <basic-container block>
      <common-table
        id="demo"
        ref="table"
        :columns="tableColumns | columnsFilter(columnsVisible)"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #topMenu>
          <div class="operations">
            <seach-popover
              :popover-options="searchConfigLocal.popoverOptions"
              :require-options="searchConfigLocal.requireOptions"
              @submit="handleSearch"
            />
            <div class="operations__right">
              <el-tooltip
                content="刷新"
                effect="dark"
                placement="top"
              >
                <el-button
                  size="mini"
                  type="text"
                  @click="refresh"
                >
                  <i class="iconfont iconicon_refresh" />
                </el-button>
              </el-tooltip>
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
                <div>
                  <el-checkbox-group v-model="columnsVisible">
                    <el-checkbox
                      v-for="item of tableColumns"
                      :key="item.prop"
                      :disabled="item.prop === 'processName'"
                      :label="item.prop"
                    >
                      {{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-popover>
            </div>
          </div>
        </template>

        <template #apprNo="{row}">
          <span
            class="table__link"
            @click="jumpToDetail(row)"
          >{{ row.apprNo }}</span>
        </template>

        <template #handler="{row}">
          <el-button
            v-if="row.status === 0"
            type="text"
            @click="disableApproval(processesItem)"
          >
            停用
          </el-button>
          <el-button
            v-if="row.status === 1"
            type="text"
            @click="enableApproval(item, processesItem)"
          >
            启用
          </el-button>
          <el-button
            type="text"
            @click="jumpToDetail(row)"
          >
            查看
          </el-button>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>
<script>
import { categoryOptions } from '@/const/approve'
import { getProcessList, startProcess, stopProcessCategory } from '@/api/apprProcess/apprProcess'
import { mapGetters } from 'vuex'
const statusDict = {
  '1': '停用',
  '0': '正常'
}
const TABLE_COLUMNS = [
  {
    label: '审批名称',
    prop: 'processName',
    minWidth: 120
  },
  {
    label: '状态',
    prop: 'status',
    formatter: (row) => statusDict[row.status],
    minWidth: 120
  },
  {
    label: '审批类型',
    prop: 'categoryId',
    formatter: (row) => statusDict[row.status],
    minWidth: 120
  },
  {
    label: '适用范围',
    prop: 'processVisible',
    minWidth: 120
  }
]

const TABLE_CONFIG = {
  rowKey: 'apprNo',
  showHandler: true,
  showIndexColumn: false,
  // enablePagination: true,
  handlerColumn: {
    minWidth: 50
  }
}

const SEARCH_CONFIG = {
  requireOptions: [
    {
      type: 'input',
      field: 'search',
      label: '',
      data: '',
      config: {
        'suffix-icon': 'el-icon-search',
        placeholder: '审批名称'
      }
    }
  ],
  popoverOptions: [
    {
      type: 'select',
      data: '',
      field: 'status',
      label: '状态',
      config: [
        { label: '正常', value: 0 },
        { label: '停用', value: 1 }
      ],
      options: []
    },
    {
      type: 'select',
      data: '',
      field: 'categoryId',
      label: '审批类型',
      options: categoryOptions
    },
    {
      type: 'input',
      field: 'visible',
      label: '适用范围',
      data: ''
    }
  ]
}
export default {
  name: 'ApprovalList',
  components: {
    SeachPopover: () => import(/* webpackChunkName: "views" */ '@/components/searchPopOver')
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (columns, visibleColProps) =>
      _.filter(columns, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      page: {
        currentPage: 1,
        size: 1000,
        total: 0
      },
      searchConfigLocal: SEARCH_CONFIG,
      searchParams: null,
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false,
      statusDict
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  activated() {
    this.refresh()
  },
  methods: {
    jumpCreate() {
      this.$router.push({
        path: '/process/design'
      })
    },
    // 处理跳转
    jumpToDetail(row) {
      this.$router.push({
        path: '/apprProcess/apprDetail',
        query: { formId: row.formId, formKey: row.formKey, apprNo: row.apprNo, preview: true }
      })
    },

    handleCurrentPageChange(page) {
      this.page.currentPage = page
      this.loadTableData()
    },
    handlePageSizeChange(pageSize) {
      this.page.size = pageSize
      this.loadTableData()
    },
    handleSearch(searchParams) {
      this.searchParams = _.pickBy(searchParams)
      this.page.currentPage = 1
      this.loadTableData()
    },
    /**
     * 停用审批
     */
    disableApproval(data) {
      stopProcessCategory({ processId: data.processId }).then(() => {
        this.$message.success('停用成功')
        this.refres()
      })
    },
    /**
     * 启用
     */
    enableApproval(data) {
      startProcess({ processId: data.processId }).then(() => {
        this.$message.success('启用成功')
        this.refresh()
      })
    },
    // 翻译字典
    translator({ value, dictKey, $config: config }) {
      if (!(dictKey = dictKey || _.get(config, 'dictKey'))) {
        return value
      }

      const dicts = this.dictionary[dictKey]
      // 如果字典为 undefined 时候加载字典
      if (!dicts) this.loadDictionary(dictKey)
      let result = value
      _.each(dicts, (item) => {
        if (item.dictKey === _.trim(value)) {
          result = item.dictValue
          return false
        }
      })
      return result
    },
    async loadDictionary(dictKey) {
      const dict = await this.$store.dispatch('CommonDict', dictKey)
      this.$set(this.dictionary, dictKey, dict)
      return dict
    },
    refresh() {
      this.loadTableData()
    },
    async loadTableData() {
      if (this.tableLoading) {
        return
      }
      try {
        const params = this.searchParams
        this.tableLoading = true
        const page = {
          pageNo: this.page.currentPage,
          pageSize: this.page.size
        }
        const { data, totalNum } = await getProcessList(_.assign(null, page, params))
        this.tableData = data
        this.page.total = totalNum
        // eslint-disable-next-line no-useless-catch
      } catch (error) {
        throw error
      } finally {
        this.tableLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: 0;
  min-height: calc(100% - 92px);
}
.operations {
  align-items: center;
  display: flex;
  justify-content: space-between;
  &__right {
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
}
</style>
