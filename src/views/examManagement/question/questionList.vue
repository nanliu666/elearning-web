<template>
  <div class="question-list  fill">
    <page-header title="题库管理">
      <el-dropdown
        slot="rightMenu"
        v-p="ADD_QUSTION"
        @command="handleCommand"
      >
        <el-button
          type="primary"
          size="medium"
        >
          创建试题<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="single">
            单个创建
          </el-dropdown-item>
          <el-dropdown-item command="batch">
            批量导入
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-button
        slot="rightMenu"
        type="primary"
        size="medium"
        @click="jumpEdit()"
      >
        创建试题
      </el-button> -->
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
            placeholder="分类名称"
            style="margin-bottom:10px;"
          />
          <el-tree
            ref="categoryTree"
            :filter-node-method="filterNode"
            :data="treeData"
            node-key="id"
            :props="treeProps"
            :expand-on-click-node="false"
            default-expand-all
            :current-node-key="activeCategory.id"
            @node-click="nodeClick"
          >
            <span
              slot-scope="{ node, data }"
              class="custom-tree-node"
            >
              <span>{{ data.name }}</span><span>{{ data.relatedNum ? ` (${data.relatedNum})` : ' (0)' }}</span>
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
            <template #multiSelectMenu="{ selection }">
              <el-button
                v-p="DELETE_ALL_QUSTION"
                type="text"
                style="margin-bottom:0;"
                @click="handleDelete(selection)"
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
                    @click="handleRefresh"
                  >
                    <i class="el-icon-refresh-right" />
                    <span>刷新</span>
                  </div>
                </div>
              </div>
            </template>
            <template #content="{row}">
              <div class="question-content">
                <div class="ellipsis">
                  {{
                    deleteHTMLTag(_.unescape(row.content)).length > 200
                      ? deleteHTMLTag(_.unescape(row.content)).slice(0, 200) + '...'
                      : deleteHTMLTag(_.unescape(row.content))
                  }}
                </div>
                <div>
                  {{ QUESTION_TYPE_MAP[row.type] || '' }}<span class="divider">|</span>状态：{{
                    QUESTION_STATUS_MAP[row.status] || ''
                  }}<span class="divider">|</span>关联试卷数：{{ row.examNum }}
                </div>
              </div>
            </template>
            <template #handler="{row}">
              <el-button
                v-p="EDIT_QUSTION"
                size="medium"
                type="text"
                @click="handleEdit(row.id)"
              >
                编辑
              </el-button>
              <el-button
                v-p="DELETE_QUSTION"
                size="medium"
                type="text"
                @click="handleDelete(row)"
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
import { getQuestionList, delQuestion, getQuestionCategory } from '@/api/examManage/question'
import { QUESTION_TYPE_MAP, QUESTION_STATUS_MAP } from '@/const/examMange'
import { deleteHTMLTag } from '@/util/util'
const COLUMNS = [
  {
    prop: 'content',
    label: '题目名称',
    slot: true
  }
]
import { DELETE_QUSTION, EDIT_QUSTION, DELETE_ALL_QUSTION, ADD_QUSTION } from '@/const/privileges'
import { mapGetters } from 'vuex'
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
        label: 'name',
        value: 'id',
        children: 'children'
      },
      activeCategory: { id: -1 },
      parentOrgId: 0,
      treeSearch: '',
      treeLoading: false,
      tableConfig: {
        showHandler: true,
        enableMultiSelect: true,
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
    QUESTION_TYPE_MAP: () => QUESTION_TYPE_MAP,
    DELETE_QUSTION: () => DELETE_QUSTION,
    EDIT_QUSTION: () => EDIT_QUSTION,
    DELETE_ALL_QUSTION: () => DELETE_ALL_QUSTION,
    ADD_QUSTION: () => ADD_QUSTION,
    ...mapGetters(['privileges'])
  },
  watch: {
    treeSearch(val) {
      this.$refs.categoryTree.filter(val)
    },
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([DELETE_QUSTION, EDIT_QUSTION])
      },
      deep: true
    }
  },
  activated() {
    this.loadData()
    this.loadTree()
  },
  methods: {
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
    loadTree() {
      this.treeLoading = true
      getQuestionCategory({ parentId: '0', type: '0' })
        .then((data) => {
          this.treeData = [{ id: -1, name: '未分类' }, ...data]
          this.$refs.categoryTree.setCurrentKey(this.activeCategory.id)
          getQuestionList({ pageNo: 1, pageSize: 1 }).then((res) => {
            this.$set(this.treeData, 0, { id: -1, name: '未分类', relatedNum: res.totalNum })
            setTimeout(() => {
              this.$refs.categoryTree.setCurrentKey(this.activeCategory.id)
            })
          })
        })
        .catch(() => {})
        .finally(() => {
          this.treeLoading = false
        })
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage
      this.loadData()
    },
    async handleDelete(data) {
      let id = null
      if (Array.isArray(data)) {
        if (_.some(data, (item) => item.examNum > 0)) {
          await this.$confirm(
            '你选择的数据中包含关联试卷数的试题，不能进行删除操作，是否忽略继续删除其它试题？',
            { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
          )
          id = _.filter(data, (item) => item.examNum <= 0)
            .map((item) => item.id)
            .join(',')
        } else {
          id = _.map(data, 'id').join(',')
        }
      } else {
        if (data.examNum > 0) {
          this.$message.warning('您选中试题有正在关联的试卷，请调整后再进行删除！')
          return
        }
        id = data.id
      }
      if (id === '') {
        this.$message.warning('您选择的试题中没有无关联的试卷，请调整后再进行删除！')
        return
      }
      this.$confirm('您确定要删除选中的试题吗？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delQuestion({ id }).then(() => {
            this.$refs.table.clearSelection()
            this.loadTree()
            this.loadData()
          })
        })
        .catch()
    },
    handleSubmitSearch(params) {
      this.query = { ...this.query, ...params }
      this.page.currentPage = 1
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
    handleCommand(data) {
      if (data === 'single') {
        //单个创建
        this.$router.push({ path: '/examManagement/question/questionEdit' })
      } else {
        //批量创建
        this.$router.push({ path: '/examManagement/question/questionImport' })
      }
    },
    handleEdit(id) {
      this.$router.push({ path: '/examManagement/question/questionEdit', query: { id } })
    },
    loadData() {
      this.loading = true
      getQuestionList({
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        categoryId: this.activeCategory.id === -1 ? null : this.activeCategory.id,
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
