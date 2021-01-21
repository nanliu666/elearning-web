<template>
  <div class="question-list  fill">
    <page-header title="学分明细">
    </page-header>
    <el-row
      style="height: calc(100% - 92px);"
      :gutter="8"
    >
      <el-col class="fill sidebar">
        <basic-container
          v-loading="treeLoading"
          block
        >
          <el-input
            v-model="treeSearch"
            clearable
            placeholder="组织名称"
            style="margin-bottom:10px;"
          />
          <el-tree
            ref="orgTree"
            v-loading="treeLoading"
            :filter-node-method="filterNode"
            :data="treeData"
            node-key="orgId"
            :props="treeProps"
            :expand-on-click-node="false"
            default-expand-all
            @node-click="nodeClick"
          >
            <span
              slot-scope="{ node, data }"
              class="custom-tree-node"
            >
              <span>{{ data.orgName }}{{ '  ' }} ({{
                data.orgId ? data.userNum : outerUserCount
              }})</span>
            </span>
          </el-tree>
        </basic-container>
      </el-col>
      <el-col
        class="content"
        style="height:100%"
      >
        <basic-container block>
          <common-table
            ref="table"
            :config="tableConfig"
            :loading="loading"
            :data="tableData"
            :page="page"
            :columns="columns"
            @current-page-change="currentChange"
            @page-size-change="sizeChange"
          >
            <template #multiSelectMenu>
            </template>
            <template #topMenu>
              <div class="flex flex-justify-between align-center">
                <search-popover
                  ref="searchPopover"
                  :require-options="searchConfig.requireOptions"
                  :popover-options="searchConfig.popoverOptions"
                  @submit="handleSubmitSearch"
                  @reset="handleResetSearch"
                />
                <div class="operations-right">
                  <div
                    class="refresh-container"
                    @click="handleRefresh"
                  >
                    <i class="el-icon-refresh-right" />
                    <span>刷新</span>
                  </div>
                </div>
              </div>
            </template>
            <template #handler="{row}">
              <el-button
                v-p="'/creditManagement/credit/view'"
                size="medium"
                type="text"
                @click="jumpEdit(row.user_id_str)"
              >
                查看详情
              </el-button>
            </template>
          </common-table>
        </basic-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getListScoreDetails } from '@/api/credit/credit'
import { QUESTION_TYPE_MAP, QUESTION_STATUS_MAP } from '@/const/examMange'
import { deleteHTMLTag } from '@/util/util'
import { getOrganization } from '@/api/system/user'
const COLUMNS = [
  {
    prop: 'name',
    label: '姓名',
    slot: true,
    minWidth: 180
  },
  {
    prop: 'code',
    label: '用户编号',
    minWidth: 180
  },
  {
    prop: 'score',
    label: '学分分值',
    minWidth: 120
  },
  {
    prop: 'user_status',
    label: '状态',
    formatter: (row) => {
      return (
        {
          true: '停用',
          false: '正常'
        }[row.user_status] || ''
      )
    }
  },
  {
    prop: 'dept',
    label: '所在部门',
    slot: true,
    minWidth: 180
  },
  {
    prop: 'update_time',
    label: '更新时间',
    minWidth: 180
  }
]
export default {
  name: 'Credit',
  components: {
    SearchPopover: () => import('@/components/searchPopOver/index')
  },
  data() {
    return {
      outerUserCount: 0,
      loading: false,
      treeData: [], // 组织架构数据
      treeProps: {
        labelText: '标题',
        label: 'orgName',
        value: 'orgId',
        children: 'children'
      },
      activeCategory: null,
      parentOrgId: 0,
      treeSearch: '',
      treeLoading: false,
      tableConfig: {
        showHandler: true,
        enableMultiSelect: false,
        enablePagination: true,
        showIndexColumn: false,
        rowKey: 'id',
        handlerColumn: {
          width: 120
        }
      },
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      tableData: [],
      searchConfig: {
        requireOptions: [
          {
            type: 'input',
            field: 'search',
            label: '',
            data: '',
            options: [],
            config: { placeholder: '姓名/编号', 'suffix-icon': 'el-icon-search' }
          }
        ],
        popoverOptions: [
          {
            type: 'dataPicker',
            label: '日期范围',
            data: '',
            field: 'startTime,endTime',
            config: {
              type: 'datetimerange',
              'range-separator': '至',
              'value-format': 'yyyy-MM-dd HH:mm:ss'
            }
          }
        ]
      }
    }
  },
  computed: {
    columns: () => COLUMNS,
    QUESTION_STATUS_MAP: () => QUESTION_STATUS_MAP,
    QUESTION_TYPE_MAP: () => QUESTION_TYPE_MAP
  },
  watch: {
    treeSearch(val) {
      this.$refs.categoryTree.filter(val)
    }
  },
  activated() {
    this.loadData()
  },
  mounted() {
    this.loadTree()
    this.loadData()
  },
  methods: {
    loadTree(parentOrgId = '0') {
      this.treeLoading = true
      getOrganization({ parentOrgId })
        .then((data) => {
          if (parentOrgId === '0') {
            data.push({ orgId: null, orgName: '外部人员' })
          }
          this.treeData = data
          this.treeLoading = false
        })
        .catch(() => {
          this.treeLoading = false
        })
    },
    deleteHTMLTag(...args) {
      return deleteHTMLTag(...args)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    nodeClick(data) {
      this.activeCategory = data
      this.page.currentPage = 1
      this.loadData()
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage
      this.loadData()
    },
    handleSubmitSearch(params) {
      this.query = { ...this.query, ...params }
      this.loadData()
    },
    handleResetSearch() {
      this.query = {}
      this.loadData()
    },
    handleRefresh() {
      this.loadData()
      this.loadTree()
    },
    sizeChange(pageSize) {
      this.page.size = pageSize
      this.loadData()
    },
    jumpEdit(id) {
      this.$router.push({ path: '/creditManagement/creditDetails', query: { id } })
    },
    loadData() {
      this.loading = true
      getListScoreDetails({
        currentPage: this.page.currentPage,
        size: this.page.size,
        orgId: this.activeCategory ? this.activeCategory.orgId : null,
        operType: '1',
        ...this.query
      })
        .then((res) => {
          this.page.total = res.totalNum
          this.tableData = res.list
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.question-list {
  .el-tree {
    overflow: auto;
    max-height: calc(100% - 44px);
  }
}
/deep/ .basic-container--block {
  height: 100%;
  min-height: 100%;
  > .el-card {
    height: 100%;
    > .el-card__body {
      height: 100%;
      overflow: auto;
    }
  }
}
.question-content {
  line-height: 22px;
  padding: 12px 0;
}
.sidebar {
  width: 350px;
}
.content {
  width: calc(100% - 350px);
}
.operations {
  align-items: center;
  display: flex;
  justify-content: space-between;
  &-right {
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
    }
  }
}
.divider {
  margin: 0 10px;
}
</style>
