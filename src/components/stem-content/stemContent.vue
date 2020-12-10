<template>
  <el-dialog
    :title="form.roleId ? '编辑角色' : '新建角色'"
    :visible.sync="roleVisible"
    width="1000px"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :before-close="onClose"
    @opened="onOpened"
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
            :loading="tableLoading"
            @current-page-change="handleCurrentPageChange"
            @page-size-change="handlePageSizeChange"
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
                    >
                    </commonForm>
                    <el-button
                      size="medium"
                      class="search"
                      type="primary"
                    >
                      搜索
                    </el-button>
                  </div>
                </div>
              </div>
            </template>
            <template slot="multiSelectMenu">
              <!--          <el-button-->
              <!--            type="text"-->
              <!--            icon="el-icon-delete"-->
              <!--          >-->
              <!--            批量导出-->
              <!--          </el-button>-->
            </template>
            <template #name="{row}">
              <el-link
                type="primary"
                style="line-height: 22px"
              >
                {{ row.name }}
              </el-link>
            </template>
          </common-table>
        </div>
        <div class="flex-flow flex flexcenter">
          <div style="padding:0 20px">
            添加题目 <i class="el-icon-d-arrow-right"></i>
          </div>
        </div>
        <div class="select"></div>
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
        >
          保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
// import { getExamineeAchievementEdit } from '@/api/examManagement/achievement'
// import SearchPopover from '@/components/searchPopOver/index'
const TABLE_COLUMNS = [
  {
    label: '考试名称',
    prop: 'name',
    slot: true,
    fixed: true,
    minWidth: 100
  },

  {
    label: '有效时间',
    slot: true,
    prop: 'expiredTime',
    minWidth: 100
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: false,
  defaultExpandAll: false,

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
    visible: {
      type: Boolean,
      default: false
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
    const BASE_COLUMNS = [
      {
        prop: 'examineeName',
        itemType: 'treeSelect',
        props: {
          selectParams: {
            placeholder: '题目分类',
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
        },
        label: '题目分类',
        span: 10,
        required: false
      },
      {
        prop: 'examTime',
        itemType: 'input',
        type: 'datetimerange',
        label: '题目标题',
        span: 10,
        required: false
      }
    ]
    return {
      config: {
        labelPosition: 'left',
        labelWidth: '80px'
      },
      columns: BASE_COLUMNS,
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
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      form: {
        answerTime: '',
        totalScore: '',
        examineeName: '',
        examTime: '',
        score: '',
        isPass: '',
        status: ''
      },
      jobDicData: []
    }
  },
  watch: {
    roleVisible: {
      handler: function() {
        this.$emit('update:visible', this.roleVisible)
      }
    }
  },
  mounted() {},
  methods: {
    // 搜索
    handleSearch(params) {
      this.searchParams = params
      this.loadTableData()
    },
    loadTableData() {},
    numberInput(value, data) {
      this.form[data] = value.replace(/[^\d]/g, '')
    },
    handleCurrentPageChange(param) {
      this.page.pageNo = param
      this.loadTableData()
    },
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.loadTableData()
    },
    onOpened() {},
    onClose() {
      this.roleVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
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
  width: 450px;
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
</style>
