<template>
  <div class="question-list  fill">
    <page-header title="题库管理">
      <el-button
        slot="rightMenu"
        type="primary"
        size="medium"
        @click="jumpEdit()"
      >
        创建试题
      </el-button>
    </page-header>
    <el-row
      style="height: calc(100% - 92px);"
      :gutter="8"
    >
      <el-col class="fill sidebar">
        <basic-container block>
          <el-input
            v-model="treeSearch"
            clearable
            placeholder="分类名称"
            style="margin-bottom:10px;"
          />
          <el-tree
            ref="categoryTree"
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
              <span>{{ data.orgName }}{{ '  ' }} ({{ data.userNum }})</span>
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
            :config="tableConfig"
            :loading="loading"
            :data="tableData"
            :page="page"
            :columns="columns"
            @current-page-change="currentChange"
            @page-size-change="sizeChange"
          >
            <template #multiSelectMenu="{ selection }">
              <el-button
                type="text"
                style="margin-bottom:0;"
                @click="handleReset(selection)"
              >
                批量删除
              </el-button>
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
                    @click="loadData"
                  >
                    <i class="el-icon-refresh-right" />
                    <span>刷新</span>
                  </div>
                </div>
              </div>
            </template>
            <template #content="{row}">
              <div class="question-content">
                <div>{{ row.content }}</div>
                <div>
                  {{ QUESTION_TYPE_MAP[row.type] || '' }}<span class="divider">|</span>状态：{{
                    QUESTION_STATUS_MAP[row.status] || ''
                  }}<span class="divider">|</span>关联试卷数：{{ row.examNum }}
                </div>
              </div>
            </template>
            <template #handler="">
              <el-button
                size="medium"
                type="text"
                @click="jumpEdit(row.questionId)"
              >
                编辑
              </el-button>
              <el-button
                size="medium"
                type="text"
              >
                删除
              </el-button>
            </template>
          </common-table>
        </basic-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getOrganization } from '@/api/system/user'
import { getQuestionList } from '@/api/examManage/question'
import { QUESTION_TYPE_MAP, QUESTION_STATUS_MAP } from '@/const/examMange'
const COLUMNS = [
  {
    prop: 'content',
    slot: true
  }
]
export default {
  name: 'QuestionList',
  components: {
    SearchPopover: () => import('@/components/searchPopOver/index')
  },
  data() {
    return {
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
      tableConfig: {
        showHandler: true,
        enableMultiSelect: true,
        enablePagination: true,
        showIndexColumn: false,
        rowKey: 'questionId',
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
            config: { placeholder: '输入题干内容搜索', 'suffix-icon': 'el-icon-search' }
          }
        ],
        popoverOptions: [
          {
            type: 'select',
            field: 'type',
            label: '类型',
            options: _.map(QUESTION_TYPE_MAP, (val, key) => ({ label: val, value: key }))
          },
          {
            type: 'select',
            field: 'status',
            label: '状态',
            options: _.map(QUESTION_STATUS_MAP, (val, key) => ({ label: val, value: key }))
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
  mounted() {
    this.loadTree()
    this.loadData()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    nodeClick(data) {
      this.activeCategory = data
    },
    loadTree(parentOrgId = '0') {
      this.treeLoading = true
      getOrganization({ parentOrgId })
        .then((data) => {
          this.treeData = data
          this.treeLoading = false
        })
        .catch(() => {
          this.treeLoading = false
        })
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
    sizeChange(pageSize) {
      this.page.size = pageSize
      this.loadData()
    },
    jumpEdit(id) {
      this.$router.push({ path: '/examManagement/question/questionEdit', query: { id } })
    },
    loadData() {
      this.loading = true
      getQuestionList({
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        ...this.query
      })
        .then((res) => {
          this.page.total = res.totalNum
          this.tableData = res.data
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
