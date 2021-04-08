<template>
  <div class="fill">
    <page-header title="系统规则来源">
    </page-header>

    <basic-container block>
      <common-table
        id="demo"
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
      >
        <template slot="topMenu">
          <div class="transitionBox">
            <div class="searchBox">
              <div class="search-box">
                <search-popover
                  ref="searchPopover"
                  :require-options="searchConfig.requireOptions"
                  :popover-options="searchConfig.popoverOptions"
                  @submit="handleSearch"
                />
              </div>
            </div>
          </div>
        </template>
        <template #sysRuleSource="{ row }">
          <span :class="{ disabled: row.status == '0' }"> {{ row.sysRuleSource }} </span>
        </template>
        <template #name="{ row }">
          <el-link
            type="primary"
            style="line-height: 22px"
          >
            {{ row.name }}
          </el-link>
        </template>
        <template #handler="{ row }">
          <div class="menuClass">
            <el-button
              v-p="STOP_SYSTEM_RULE"
              type="text"
              @click="handleIsStart(row)"
            >
              {{ row.status == 0 ? '启用' : '停用' }}
            </el-button>
          </div>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import { getListSysRulus, putEditSysRulus } from '@/api/credit/credit'
import SearchPopover from '@/components/searchPopOver/index'
const TABLE_COLUMNS = [
  {
    label: '系统规则来源',
    prop: 'sysRuleSource',
    slot: true,
    fixed: true,
    minWidth: 150
  },
  {
    label: '规则来源说明',
    prop: 'ruleState',
    minWidth: 150
  },
  {
    label: '状态',
    prop: 'status',
    minWidth: 120,
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
  enableMultiSelect: false, // TODO：关闭批量删除
  handlerColumn: {
    minWidth: 150,
    fixed: false
  }
}
import { STOP_SYSTEM_RULE } from '@/const/privileges'
import { mapGetters } from 'vuex'
export default {
  name: 'SystemRule',
  components: { SearchPopover },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      tableLoading: false,
      tableData: [],
      tableConfig: TABLE_CONFIG,
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      checkColumn: ['name', 'status', 'creatorName', 'updateTime'],
      searchConfig: {
        requireOptions: [
          {
            type: 'input',
            field: 'sys_rule_source',
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
  computed: {
    STOP_SYSTEM_RULE: () => STOP_SYSTEM_RULE,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([STOP_SYSTEM_RULE])
      },
      deep: true
    }
  },
  activated() {
    this.loadTableData()
  },
  methods: {
    /**
     * @author guanfenda
     * @desc 停用启用系统规则
     * @params row 规则数据
     * */
    handleIsStart(row) {
      let text =
        row.status == 0
          ? '您确定要启用该系统规则吗？'
          : '您确定要停用该系统规则来源吗？停用后，该系统规则来源将暂停使用。'
      this.$confirm(text, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row.id,
          status: row.status == 0 ? '1' : '0'
        }
        putEditSysRulus(Object.assign(params, this.searchParams)).then(() => {
          this.$message.success('修改成功')
          this.loadTableData()
        })
      })
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
        getListSysRulus(_.assign(params)).then((res) => {
          const hasRule = ['登录积分', '在线学习积分', '知识库积分', '资源共享积分']
          const temp = _.filter(res, (item) => {
            return _.some(hasRule, (ruleItem) => {
              return item.sysRuleSource === ruleItem
            })
          })
          this.tableData = temp
          console.log(this.tableData)
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
.disabled {
  color: #d4dbdd;
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
