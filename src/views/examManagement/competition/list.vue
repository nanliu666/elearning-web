<template>
  <div class="competition-list">
    <page-header title="闯关竞赛">
      <el-button
        slot="rightMenu"
        v-p="COMPETITION_ADD"
        size="medium"
        type="primary"
        @click="addCompetition"
      >
        创建闯关竞赛
      </el-button>
    </page-header>
    <basic-container>
      <common-table
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #topMenu>
          <div class="operations">
            <seach-popover
              ref="seachPopover"
              :popover-options="searchPopoverConfig.popoverOptions"
              :require-options="searchPopoverConfig.requireOptions"
              @submit="handleSearch"
            />
            <div class="operations__btns">
              <el-tooltip
                class="operations__btns--tooltip"
                content="刷新"
                effect="dark"
                placement="top"
                style="color: #acb3b8"
              >
                <el-button
                  class="operations__btns--item"
                  size="mini"
                  icon="el-icon-refresh-right"
                  style="font-size: 18px"
                  type="text"
                  @click="refresh"
                >
                </el-button>
              </el-tooltip>
              <span
                class="text_refresh"
                style="cursor: pointer; font-size: 18px; color: #acb3b8; margin-right: 20px"
                @click="refresh"
              >刷新</span>
              <el-popover
                placement="bottom"
                width="40"
                trigger="click"
              >
                <el-tooltip
                  slot="reference"
                  class="operations__btns--tooltip"
                  content="显隐"
                  effect="dark"
                  placement="top"
                >
                  <i
                    class="el-icon-setting"
                    style="color: #acb3b8; font-size: 18px; margin-left: 0px"
                  />
                </el-tooltip>

                <!-- 设置表格列可见性 -->
                <div class="operations__column--visible">
                  <el-checkbox-group v-model="columnsVisible">
                    <el-checkbox
                      v-for="item of tableColumns"
                      :key="item.prop"
                      :disabled="item.prop === 'name'"
                      :label="item.prop"
                      class="operations__column--item"
                    >
                      {{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-popover>
            </div>
          </div>
        </template>
        <template #multiSelectMenu="{ selection }">
          <el-button
            v-p="COMPETITION_DEL"
            style="margin-bottom: 0"
            type="text"
            @click="batchDel(selection)"
          >
            批量删除
          </el-button>
        </template>
        <template #handler="{ row }">
          <el-button
            v-p="COMPETITION_EDIT"
            type="text"
            @click="edit(row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-p="COMPETITION_DEL"
            type="text"
            @click="del(row.id)"
          >
            删除
          </el-button>
        </template>
        <template #name="{ row }">
          <el-button
            type="text"
            @click="goToInfo"
          >
            {{ row.name }}
          </el-button>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import { COMPETITION_ADD, COMPETITION_EDIT, COMPETITION_DEL } from '@/const/privileges'
import { mapGetters } from 'vuex'
const TABLE_COLUMNS = [
  {
    label: '闯关竞赛名称',
    prop: 'name',
    slot: true
  },
  {
    label: '分类',
    prop: 'name'
  },
  {
    label: '状态',
    prop: 'name'
  },
  {
    label: '有效期限',
    prop: 'name'
  },
  {
    label: '竞赛关数',
    prop: 'name'
  },
  {
    label: '参与人数',
    prop: 'name'
  }
]
const TABLE_CONFIG = {
  enableMultiSelect: true,
  showHandler: true,
  handlerColumn: {
    label: '操作',
    minWidth: 150
  },
  highlightSelect: true,
  rowKey: 'id'
}
// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '输入专区名称' },
    data: '',
    field: 'name',
    label: '',
    type: 'input'
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    data: '',
    field: 'orgId',
    label: '分类',
    type: 'treeSelect',
    config: {
      multiple: true,
      selectParams: {
        placeholder: '请选择'
      },
      treeParams: {
        data: [],
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        filterable: false,
        props: {
          children: 'children',
          label: 'orgName',
          disabled: 'disabled',
          value: 'id'
        }
      }
    }
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'status',
    label: '状态',
    type: 'select',
    options: [
      { value: 0, label: '未开始' },
      { value: 1, label: '进行中' },
      { value: 2, label: '已结束' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'status',
    label: '创建人',
    type: 'select',
    options: []
  },
  {
    type: 'dataPicker',
    data: 'time',
    label: '创建时间',
    config: {
      // 显示类型
      type: 'datetime',
      placeholder: '请选择'
    }
  }
]
const SEARCH_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
export default {
  computed: {
    COMPETITION_ADD: () => COMPETITION_ADD,
    COMPETITION_EDIT: () => COMPETITION_EDIT,
    COMPETITION_DEL: () => COMPETITION_DEL,
    ...mapGetters(['privileges'])
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  components: {
    SeachPopover: () => import('@/components/searchPopOver')
  },
  data() {
    return {
      time: '',
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false,
      searchPopoverConfig: SEARCH_CONFIG,
      searchParams: {
        name: '',
        orgId: ''
      },
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop).filter((v) => {
        return v
      })
    }
  },
  methods: {
    refresh() {
      this.getData()
    },
    getData() {},
    batchDel() {},
    edit() {},
    del() {},
    addCompetition() {
      this.$router.push('/examManagement/competition/addAndEdit')
    },
    goToInfo() {},
    handleCurrentPageChange(params) {
      this.page.currentPage = params
      this.getData()
    },
    handlePageSizeChange(params) {
      this.page.currentPage = 1
      this.page.pageSize = params
      this.getData()
    },
    handleSearch(searchParams) {
      this.searchParams = searchParams
      this.page.currentPage = 1
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.competition-list {
  .operations {
    align-items: center;
    display: flex;
    justify-content: space-between;
    &__column--item {
      height: 25px;
    }
    &__column--visible {
      height: 200px;
      overflow: scroll;
    }
    &__btns {
      align-items: center;
      display: flex;
      height: 24px;
      justify-content: flex-start;
    }
    &__btns--item {
      margin: 0;
      margin-right: 4px;
      padding: 0;
      height: 24px;
      width: 24px;
      line-height: 24px;
      &:last-child {
        margin: 0;

        .iconfont {
          font-weight: bold;
          font-size: 16px;
        }
        .Menu {
          .table__handler {
            display: flex;
            justify-content: flex-end;
            > .el-button--text {
              text-align: center;
              padding: 0 8px;
              margin-left: 0px;
              position: relative;
              &:not(:last-child)::after {
                background-color: #e3e7e9;
                content: '';
                height: 10px;
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 1px;
              }
            }
          }
        }
      }
    }
  }
  /deep/.cell:empty::before {
    content: '--';
    color: gray;
  }
}
</style>
