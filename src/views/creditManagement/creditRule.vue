<template>
  <div class="fill">
    <page-header title="学分规则管理">
      <div slot="rightMenu">
        <el-button
          type="primary"
          size="medium"
          @click="handleAddRule"
        >
          新建规则
        </el-button>
      </div>
    </page-header>

    <basic-container block>
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
                <search-popover
                  ref="searchPopover"
                  :require-options="searchConfig.requireOptions"
                  :popover-options="searchConfig.popoverOptions"
                  @submit="handleSearch"
                />
                <div
                  class="refresh-container"
                  @click="loadTableData"
                >
                  <span class="icon  el-icon-refresh-right" />
                  <span class="refresh-text">刷新</span>
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
                      :disabled="item.prop === 'examName'"
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
        <template #handler="{row}">
          <div class="menuClass">
            <el-button
              type="text"
              @click="handleIsStart(row)"
            >
              {{ row.status ? '停用' : '启用' }}
            </el-button>
            <el-button
              type="text"
              @click="handleLookUp(row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </common-table>
      <ruleDialog
        v-if="visible"
        :visible.sync="visible"
        :row="row"
        @loadData="loadTableData"
      ></ruleDialog>
    </basic-container>
  </div>
</template>

<script>
import { getCreditList, postCreditStartAndStop, deleteCredit } from '@/api/credit/credit'
import SearchPopover from '@/components/searchPopOver/index'
import ruleDialog from './components/ruleDialog'
const TABLE_COLUMNS = [
  {
    label: '规则名称',
    prop: 'stuName',
    slot: true,
    fixed: true,
    minWidth: 150
  },
  {
    label: '系统规则来源',
    prop: 'sysRuleSource',
    minWidth: 150
  },
  {
    label: '分值',
    prop: 'score',
    minWidth: 120
  },
  {
    label: '每日上限',
    prop: 'dayLimit',
    slot: true,
    minWidth: 120
  },
  {
    label: '分值规则说明',
    prop: 'ruleState',
    minWidth: 120
  },
  {
    label: '更新时间',
    slot: true,
    prop: 'updateTime',
    minWidth: 200
  },
  {
    label: '状态',
    prop: 'status',
    minWidth: 100,
    formatter: (row) => {
      return (
        {
          0: '停用',
          1: '正常'
        }[row.status] || ''
      )
    }
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  defaultExpandAll: false,
  showIndexColumn: false,
  enablePagination: false,
  enableMultiSelect: true, // TODO：关闭批量删除
  handlerColumn: {
    minWidth: 150
  }
}
export default {
  name: 'CreditRule',
  components: { SearchPopover, ruleDialog },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      visible: false,
      row: {},
      tableLoading: false,
      tableData: [],
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS,
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      checkColumn: ['name', 'status', 'creatorName', 'updateTime'],
      searchConfig: {
        requireOptions: [
          {
            type: 'input',
            field: 'likeQuery',
            label: '',
            data: '',
            options: [],
            config: { placeholder: '输入规则来源搜索', 'suffix-icon': 'el-icon-search' }
          }
        ]
      },
      data: [],
      createOrgDailog: false,
      searchParams: {}
    }
  },
  mounted() {},
  activated() {
    this.loadTableData()
  },
  methods: {
    /**
     * @author guanfenda
     * @desc 弹出新建弹出
     * */
    handleAddRule() {
      this.visible = true
    },
    /**
     * @author guanfenda
     * @desc 编辑规则
     * @params row 规则数据
     * */
    handleLookUp(row) {
      this.visible = true
      this.row = _.cloneDeep(row)
    },
    /**
     * @author guanfenda
     * @desc 处理停用或者启用
     *
     * */
    handleIsStart(row) {
      let tip = row.status == 0 ? '启用' : '停用'
      this.$confirm(`您确定要 ${tip} 该条信息吗？`, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row.id,
          status: row.status == 0 ? '1' : '0'
        }
        postCreditStartAndStop(params).then(() => {
          this.$message.success('修改成功')
          this.loadTableData()
        })
      })
    },
    /**
     * @author guanfenda
     * @desc 删除规则
     * @params row 规则数据
     * */
    handleDelete(row) {
      this.$confirm('您确定要删除该条信息吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row.id
        }
        deleteCredit(params).then(() => {
          this.$message.success('删除成功')
          this.loadTableData()
        })
      })
    },
    /**
     * @author guanfenda
     * @desc 加载第几页方法
     * @params param 页数
     * */
    handleCurrentPageChange(param) {
      this.page.currentPage = param
      this.loadTableData()
    },
    /**
     * @author guanfenda
     * @desc 加载数据一次多少条
     * @params 加载一次的数量
     * */
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.loadTableData()
    },
    // 加载函数
    /**
     * @author guanfenda
     * @desc 加载table数据
     *
     * */
    async loadTableData() {
      if (this.tableLoading) {
        //防抖
        return
      }
      try {
        const params = this.searchParams
        this.tableLoading = true
        getCreditList(_.assign(params, this.page, { pageNo: this.page.currentPage })).then(
          (res) => {
            this.tableData = res.data
            this.page.total = res.totalNum
            this.tableLoading = false
          }
        )
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.tableLoading = false
      }
    },
    // 搜索
    /**
     * @author guanfenda
     *@desc 搜索
     * */
    handleSearch(params) {
      this.searchParams = params
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
}

.originColumn {
  height: 25px;
}

.transitionBox {
  position: relative;
  height: 50px;
}

.searchBox {
  position: absolute;
  width: 100%;

  i {
    color: #a0a8ae;
    font-size: 18px;
  }

  .search-box {
    display: flex;
    align-items: center;

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

  > div {
    display: flex;

    :first-child {
      flex: 1;
    }

    > button {
      height: 34px;
    }
  }
}

/deep/ .avue-crud__pagination {
  height: 0px;
}

.newOrgDailog {
  .el-select {
    width: 100%;
  }
}

/deep/ .avue-crud__pagination {
  display: none;
}

.refresh-text {
  padding-left: 6px;
  display: inline-block;
  height: 18px;
  color: #a0a8ae;
}
/deep/.el-table__fixed::before {
  position: relative;
}
</style>
