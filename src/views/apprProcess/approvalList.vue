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
            v-if="row.useStatus === 'Yes'"
            type="text"
            @click="disableApproval(row)"
          >
            停用
          </el-button>
          <el-button
            v-if="row.useStatus === 'No'"
            type="text"
            @click="enableApproval(row)"
          >
            启用
          </el-button>
          <el-button
            type="text"
            @click="jumpToEdit(row)"
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
    </basic-container>
  </div>
</template>
<script>
import { categoryOptions, categoryMap } from '@/const/approve'
import {
  getProcessList,
  startProcess,
  stopProcess,
  deleteProcess
} from '@/api/apprProcess/apprProcess'
import { mapGetters } from 'vuex'
const statusDict = {
  No: '停用',
  Yes: '正常'
}
const TABLE_COLUMNS = [
  {
    label: '审批名称',
    prop: 'processName',
    minWidth: 120
  },
  {
    label: '状态',
    prop: 'useStatus',
    formatter: (row) => statusDict[row.useStatus],
    width: 100
  },
  {
    label: '审批类型',
    prop: 'categoryId',
    formatter: (row) => categoryMap[row.categoryId] || '',
    width: 120
  },
  {
    label: '适用范围',
    prop: 'visibleRange',
    minWidth: 120
  }
]

const TABLE_CONFIG = {
  rowKey: 'apprNo',
  showHandler: true,
  showIndexColumn: false,
  // enablePagination: true,
  handlerColumn: {
    width: 100
  }
}

const SEARCH_CONFIG = {
  requireOptions: [
    {
      type: 'input',
      field: 'processName',
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
      field: 'useStatus',
      label: '状态',

      options: [
        { label: '正常', value: 'Yes' },
        { label: '停用', value: 'No' }
      ]
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
      field: 'visibleRange',
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
    jumpToEdit(row) {
      this.$router.push({
        path: '/process/design',
        query: {
          processId: row.processId
        }
      })
    },
    handleSearch(searchParams) {
      this.searchParams = _.pickBy(searchParams)
      this.loadTableData()
    },
    /**
     * 删除审批
     */
    handleDelete(data) {
      deleteProcess({ processId: data.processId }).then(() => {
        this.$message.success('删除成功')
        this.refresh()
      })
    },
    /**
     * 停用审批
     */
    disableApproval(data) {
      stopProcess({ processId: data.processId }).then(() => {
        this.$message.success('停用成功')
        this.refresh()
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
        const data = await getProcessList(params)
        this.tableData = data
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
