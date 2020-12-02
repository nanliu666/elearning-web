<template>
  <div class="fill">
    <page-header title="成绩管理" />

    <basic-container block>
      <common-table
        id="demo"
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :page="page"
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
                <div class="refresh-container">
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
                      :disabled="item.prop === 'orgName'"
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
              @click="handleLookUp(row)"
            >
              查看考生成绩
            </el-button>
          </div>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import { getKnowledgeCatalogList } from '@/api/knowledge/knowledge'
import SearchPopover from '@/components/searchPopOver/index'
const TABLE_COLUMNS = [
  {
    label: '考试名称',
    prop: 'name',
    slot: true,
    fixed: true,
    minWidth: 150
  },
  {
    label: '试卷类型',
    prop: 'status',
    slot: true,
    minWidth: 120
  },
  {
    label: '有效试卷',
    prop: 'creatorName',
    minWidth: 120
  },
  {
    label: '参加人数',
    slot: true,
    prop: 'updateTime',
    minWidth: 120
  },
  {
    label: '无统计数据人次',
    slot: true,
    prop: 'updateTime1',
    minWidth: 120
  },
  {
    label: '出卷人',
    slot: true,
    prop: 'updateTime2',
    minWidth: 120
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
  name: 'Achievement',
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
            field: 'name',
            label: '',
            data: '',
            options: [],
            config: { placeholder: '输入考试名称搜索', 'suffix-icon': 'el-icon-search' }
          }
        ],
        popoverOptions: [
          {
            type: 'select',
            field: 'status',
            label: '试卷类型',
            data: '',
            options: [
              { value: '', label: '全部' },
              { value: 0, label: '启用' },
              { value: 1, label: '停用' }
            ]
          },
          {
            type: 'numInterval',
            field: 'userId',
            data: {},
            label: '参加人数',
            options: [],
            config: { optionLabel: 'name', optionValue: 'userId' },
            loading: false,
            noMore: false
          },
          {
            type: 'select',
            field: 'status1',
            label: '出卷人',
            data: '',
            options: [
              { value: '', label: '全部' },
              { value: 0, label: '启用' },
              { value: 1, label: '停用' }
            ]
          }
        ]
      },
      data: [],
      createOrgDailog: false,
      searchParams: {}
    }
  },
  activated() {
    this.loadTableData()
  },
  methods: {
    handleLookUp(row) {
      this.$router.push({
        path: '/examManagement/grade/ExamineeAchievement',
        query: { id: row.id }
      })
    },

    // 加载函数
    async loadTableData() {
      if (this.tableLoading) {
        return
      }
      try {
        const params = this.searchParams
        this.tableLoading = true
        getKnowledgeCatalogList(params).then((res) => {
          this.tableData = res
          this.tableLoading = false
        })
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.tableLoading = false
      }
    },
    // 搜索
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
</style>
