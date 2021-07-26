<template>
  <el-dialog
    title="题目来源"
    :visible.sync="roleVisible"
    width="1200px"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :before-close="onClose"
  >
    <div v-loading="loading">
      <div class="flex flex-flow">
        <div class="table">
          <common-table
            id="demo"
            ref="table"
            :columns="columnsVisible | columnsFilter"
            :config="tableConfig"
            :page="page"
            :data="tableData"
            :page-config="pageConfig"
            :loading="tableLoading"
            @current-page-change="handleCurrentPageChange"
            @page-size-change="handlePageSizeChange"
            @select="select"
            @select-all="select"
          >
            <template #topMenu>
              <div class="transitionBox">
                <div class="searchBox">
                  <div class="search-box">
                    <commonForm
                      ref="form"
                      :model="form"
                      :config="config"
                      :columns="columns"
                    />
                    <el-button
                      size="medium"
                      class="search"
                      type="primary"
                      @click="handleSearch"
                    >
                      搜索
                    </el-button>
                  </div>
                  <div style="position: relative;top:-10px; left: 10px">
                    未选择题目
                  </div>
                </div>
              </div>
            </template>
            <template #content="{row}">
              {{ getContent(row.content) }}
            </template>
          </common-table>
        </div>
        <div class="flex-flow flex flexcenter">
          <div
            class="addTopic"
            @click="addTopic"
          >
            添加题目 <i class="el-icon-d-arrow-right"></i>
          </div>
        </div>
        <div class="select">
          <common-table
            ref="table2"
            :columns="columnsVisible | columnsFilter"
            :config="tableConfig2"
            :data="selectData"
            :loading="tableLoading"
            @current-page-change="handleCurrentPageChange"
            @page-size-change="handlePageSizeChange"
            @select="select"
            @select-all="select"
          >
            <template #topMenu>
              <div class="transitionBox">
                <div class="searchBox">
                  <div class="search-box">
                    <div
                      style="line-height: 40px"
                      class="flex flex-flow flex-justify-between"
                    >
                      <div>已选中题目</div>
                      <div>已添加{{ selectData.length }}条</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template #content="{row}">
              {{ getContent(row.content) }}
            </template>
            <template #multiSelectMenu="{selection}">
              <el-button
                type="text"
                @click="handleAllSelete(selection)"
              >
                批量删除
              </el-button>
            </template>
            <template #handler="{row}">
              <div class="menuClass">
                <el-button
                  type="text"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </common-table>
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="medium"
          @click="onClose"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          size="medium"
          @click="onsubmit"
        >
          保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getcategoryTree } from '@/api/examManage/category'
import { getQuestionList } from '@/api/examManage/question'
import { QUESTION_TYPE_MAP_TOTAL } from '@/const/examMange'
import { deleteHTMLTag } from '@/util/util'
const TABLE_COLUMNS = [
  {
    label: '题目名称',
    prop: 'content',
    slot: true,
    fixed: true,
    minWidth: 100
  },
  {
    label: '题目类型',
    prop: 'type',
    minWidth: 100,
    formatter: (row) => {
      return QUESTION_TYPE_MAP_TOTAL[row.type] || ''
    }
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: false,
  defaultExpandAll: false,
  height: 300,
  showIndexColumn: false,
  enablePagination: false,
  enableMultiSelect: true, // TODO：关闭批量删除
  handlerColumn: {
    minWidth: 150
  }
}
const TABLE2_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  defaultExpandAll: false,
  height: 300,
  showIndexColumn: false,
  enablePagination: false,
  enableMultiSelect: true, // TODO：关闭批量删除
  handlerColumn: {
    minWidth: 150
  }
}
export default {
  name: 'StemContent',
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },
    categoryId: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      categoryIdsOptions: [],
      pageConfig: {
        layout: 'prev, pager, next'
      },
      config: {
        labelPosition: 'left',
        labelWidth: '80px'
      },
      selectData: [],
      selection: [],
      columns: [
        {
          itemType: 'cascader',
          label: '题目分类',
          span: 12,
          prop: 'category',
          options: [],
          required: false,
          filterable: true,
          collapseTags: true,
          clearable: true,
          props: {
            checkStrictly: true,
            multiple: true,
            value: 'id',
            label: 'name'
          }
        },
        {
          prop: 'search',
          itemType: 'input',
          type: 'datetimerange',
          label: '题目标题',
          span: 10,
          required: false
        }
      ],
      tableData: [],
      tableLoading: false,
      page: {
        currentPage: 1,
        pageSize: 10,
        pageNo: 1,
        total: 0
      },
      loading: false,
      roleVisible: true,
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS,
      tableConfig2: TABLE2_CONFIG,
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      form: {
        category: '',
        search: ''
      },
      jobDicData: []
    }
  },
  watch: {
    data: {
      handler(val) {
        val = _.cloneDeep(val)
        if (val.length > 0) {
          val.map((it) => {
            if (!it.id) {
              it.id = it.key
            }
          })
          this.selectData = val
        }
      },
      immediate: true
    },
    roleVisible: {
      handler: function() {
        this.$emit('update:visible', this.roleVisible)
      }
    },
    'form.category': {
      handler() {
        this.getData()
      },
      deep: true
    }
  },
  mounted() {
    this.getcategoryTree()
  },
  methods: {
    getContent(data) {
      const contentText = deleteHTMLTag(_.unescape(data))
      return contentText.length > 200 ? `${contentText.slice(0, 200)}...` : contentText
    },
    /**
     * @author guanfenda
     * @desc 批量删除选中
     * */
    handleAllSelete(selection) {
      this.selectData = this.selectData.filter((it) => {
        let data = selection.filter((item) => item.id == it.id)
        if (data.length === 0) {
          return true
        }
      })
      this.$refs.table2.clearSelection()
    },
    /**
     * @author guanfenda
     * @desc 删除当前行
     *
     * */
    handleDelete(row) {
      this.selectData = this.selectData.filter((it) => it.id !== row.id)
    },
    /**
     * @author guanfenda
     * @desc 添加选中
     * */
    addTopic() {
      this.$refs.table.clearSelection()
      _.each(this.selection, (item) => {
        item.questionId = item.id
      })
      this.selectData = _.uniqBy([...this.selectData, ...this.selection], 'questionId')
    },
    /**
     * @author guanfenda
     * @desc 确认选中
     * */
    onsubmit() {
      this.$emit('input', this.selectData)
      this.onClose()
    },
    /**
     * @author guanfenda
     * @desc 选中的数据
     * */
    select(data) {
      this.selection = data
    },
    /**
     * @author guanfenda
     * @desc 获取table 数据
     *
     * */
    getData() {
      let targetIdList = []
      _.each(this.form.category, (item) => {
        targetIdList.push(item[_.size(item) - 1])
      })
      const categoryIds = _.join(targetIdList, ',')
      if (categoryIds) {
        let params = {
          categoryIds,
          search: this.form.search,
          type: this.type,
          status: 'normal'
        }
        getQuestionList(_.assign(params, this.page, { pageNo: this.page.currentPage })).then(
          (res) => {
            this.tableData = res.data
            this.page.total = res.totalNum
          }
        )
      } else {
        this.tableData = []
        this.page.total = 0
      }
    },
    /**
     * @author guanfenda
     * @desc 获取试题分类
     *
     * */
    getcategoryTree() {
      let params = {
        parentId: 0,
        type: 0
      }
      getcategoryTree(params).then((res) => {
        const categoryIdsProp = _.find(this.columns, { prop: 'category' })
        categoryIdsProp.options = this.categoryIdsOptions = [
          // { id: 0, name: '未分类', parentId: '0' },
          ...res
        ]
      })
    },
    // 搜索
    handleSearch() {
      this.page.currentPage = 1
      this.getData()
    },
    /**
     * @author guanfenda
     * @desc 当前页加载
     * */
    handleCurrentPageChange(param) {
      this.page.currentPage = param
      this.getData()
    },
    /**
     * @author guanfenda
     * @desc 当前页加载多少条数据
     * */
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.getData()
    },
    onClose() {
      this.roleVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  /deep/ .top-menu {
    margin-bottom: 20px;
    height: 60px;
  }
}

/deep/ .el-dialog__header {
  padding: 16px 0;
  margin: 0 24px;
  border-bottom: 1px solid rgba(208, 211, 214, 0.44);
  font-size: 18px;
  color: #202940;
  line-height: 24px;
}

/deep/ .el-dialog__body {
  padding: 24px;
}

/deep/ .el-dialog__footer {
  padding: 0px 24px 24px;
}

/deep/ .el-form-item__label {
  font-size: 14px;
  color: #0f0000;
  text-align: right;
}
/deep/ .el-form-item {
  margin-bottom: 24px;
}
.dialog-footer {
  text-align: right;
}

/deep/ .is-error {
  .tree-button {
    border-color: #f56c6c;
  }
}

/deep/ .el-radio {
  margin-right: 20px;
}
/deep/ .el-input__icon .el-input__validateIcon .el-icon-circle-close {
  display: none;
}
.answerTime {
  font-size: 14px;
  margin-right: 5px;
}
.table {
  min-height: 300px;
  width: 650px;
}
.refresh-text {
  padding-left: 6px;
  display: inline-block;
  height: 18px;
  color: #a0a8ae;
}
.search-box {
  position: relative;
  .search {
    position: absolute;
    right: 0;
    top: 0;
  }
}
.addTopic {
  width: 80px;
  padding: 0 2px;
  cursor: pointer;
}
.select {
  width: 450px;
}
/deep/.el-form-item {
  margin-bottom: 0px;
}
</style>
