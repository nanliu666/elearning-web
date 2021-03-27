<template>
  <div class="fill">
    <page-header
      title="查看详情"
      show-back
    >
    </page-header>

    <basic-container block>
      <common-table
        id="demo"
        ref="table"
        :page="page"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
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
        <template #multiSelectMenu="{ selection }">
          <el-button
            type="text"
            style="margin-bottom:0;"
            icon="el-icon-delete"
            @click="handleDeleteAll(selection)"
          >
            批量删除
          </el-button>
        </template>
        <!-- <template #name="{row}">
          <el-link
            type="primary"
            style="line-height: 22px"
          >
            {{ row.name }}
          </el-link>
        </template> -->
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
    </basic-container>
  </div>
</template>

<script>
import { getListSysRulus, getListScoreDetails, deleteScoreDetails } from '@/api/credit/credit'
import SearchPopover from '@/components/searchPopOver/index'
import { DELETE_CREDIT_DETAIL } from '@/const/privileges'
import { mapGetters } from 'vuex'

const TABLE_COLUMNS = [
  // {
  //   prop: 'code',
  //   label: '学员编号',
  //   minWidth: 180
  // },
  {
    prop: 'name',
    label: '姓名',
    slot: true,
    minWidth: 150
  },
  {
    prop: 'dept',
    label: '部门',
    slot: true,
    minWidth: 210
  },
  {
    prop: 'sys_rule',
    label: '系统规则来源',
    slot: true,
    minWidth: 180
  },
  {
    prop: 'stu_name',
    label: '学分来源',
    slot: true,
    minWidth: 180
  },
  {
    prop: 'score',
    label: '分值',
    minWidth: 120
  },
  {
    prop: 'create_time',
    label: '更新时间',
    minWidth: 180
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
    minWidth: 50
  }
}
export default {
  name: 'CreditDetails',
  components: { SearchPopover },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
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
            field: 'search',
            label: '',
            data: '',
            options: [],
            config: { placeholder: '输入规则来源搜索', 'suffix-icon': 'el-icon-search' }
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
          },
          {
            type: 'select',
            label: '系统规则来源',
            data: '',
            field: 'sysRule',
            config: { multiple: false, optionLabel: 'sysRuleSource', optionValue: 'sysRuleSource' },
            options: []
          }
        ]
      },
      data: [],
      createOrgDailog: false,
      searchParams: {}
    }
  },
  computed: {
    DELETE_CREDIT_DETAIL: () => DELETE_CREDIT_DETAIL,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([DELETE_CREDIT_DETAIL])
      },
      deep: true
    }
  },
  mounted() {
    this.getsysRule()
  },
  activated() {
    this.loadTableData()
  },
  methods: {
    /***
     * @author guanfenda
     * @desc 获取系统规则数据
     *
     * */
    getsysRule() {
      let params = {
        status: '1'
      }
      getListSysRulus(params).then((res) => {
        this.searchConfig.popoverOptions.find((it) => it.field == 'sysRule').options = res
      })
    },
    /**
     * @author guanfenda
     * @desc 批量导出
     * */
    handleExportAll() {},
    /**
     * @author guanfenda
     * @desc 批量删除
     *
     * */
    handleDeleteAll(selection) {
      // 批量删除
      let params = []
      selection.forEach((item) => {
        params.push(item.id)
      })
      params = params.join(',')
      this.$confirm('此操作将删选中, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteScoreDetails({ ids: params }).then(() => {
            this.loadTableData()
            this.$refs.table.clearSelection()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    /**
     * @author guanfenda
     * @desc 删除
     * @params row 数据
     * */
    handleDelete(row) {
      this.$confirm('您确定要删除该条信息吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: row.id
        }
        deleteScoreDetails(params).then(() => {
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
        getListScoreDetails(
          _.assign(params, {
            userId: this.$route.query.id,
            size: this.page.size,
            currentPage: this.page.currentPage
          })
        ).then((res) => {
          this.tableData = res.list
          this.page.total = res.totalNum
          this.tableLoading = false
        })
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
.refresh-container {
  cursor: pointer;
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
