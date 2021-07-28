<template>
  <div class="Jobs fill">
    <page-header title="职级管理">
      <el-button
        slot="rightMenu"
        v-p="ADD_RANK"
        type="primary"
        size="medium"
        @click="addStation"
      >
        创建职级
      </el-button>
    </page-header>

    <basic-container block>
      <common-table
        id="demorank"
        :key="Math.random()"
        ref="multipleTable"
        :config="tableConfig"
        :columns="columnsVisible | columnsFilter"
        :data="tableData"
        :loading="tableLoading"
      >
        <template #topMenu>
          <div class="operations">
            <div class="operations__left">
              <seach-popover
                ref="searchPopover"
                :require-options="searchPopoverConfig.requireOptions"
                @submit="handleSearch"
              />
            </div>
            <div class="operations-right">
              <div
                class="refresh-container"
                @click="refresh"
              >
                <i class="el-icon-refresh-right" />
                <span>刷新</span>
              </div>
              <el-popover
                placement="bottom"
                width="40"
                trigger="click"
              >
                <i
                  slot="reference"
                  style="padding-left: 10px; cursor: pointer"
                  class="el-icon-setting"
                />
                <!-- 设置表格列可见性 -->
                <div class="operations__column--visible">
                  <el-checkbox-group v-model="columnsVisible">
                    <el-checkbox
                      v-for="item of columns"
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
        <template #handler="{ row }">
          <div class="table__handler">
            <el-button
              size="medium"
              type="text"
              :disabled="row.fullName.split('|').length >= 5"
              @click.stop="() => handleCreateSubordinate(row, 'create')"
            >
              创建下级职级
            </el-button>

            <el-button
              v-p="EDIT_RANK"
              type="text"
              @click="edit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-p="DELETE_RANK"
              type="text"
              @click="deleteOpe(row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </common-table>
      <!-- 表单 -->
      <rank-form
        ref="rankForm"
        :row-data="rowData"
        @initData="loadData"
      ></rank-form>
    </basic-container>
  </div>
</template>

<script>
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '职级名称',
    prop: 'name'
  },
  {
    label: '职级描述',
    prop: 'remark'
  },
  {
    label: '创建人',
    prop: 'creatorName'
  },
  {
    label: '更新时间',
    prop: 'updateTime'
  }
  //    {
  //     label: '操作',
  //     prop: 'caozuo',
  //   }
]

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '请输入职级名称搜索', 'suffix-icon': 'el-icon-search' },
    data: '',
    field: 'name',
    label: '',
    type: 'input'
  }
]

const SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_REQUIRE_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}

import rankForm from './components/rankForm'
import { ADD_RANK, EXPORTS_RANK, EDIT_RANK, DELETE_RANK } from '@/const/privileges'
import { dateFormat } from '@/util/date'
import { queryRank, getRankChild } from '@/api/system/rank'
export default {
  name: 'Jobs',
  components: {
    SeachPopover: () => import('@/components/searchPopOver'),
    rankForm
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      // 默认选中所有列
      columns: TABLE_COLUMNS,
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      tableData: [],
      tableColumns: TABLE_COLUMNS,
      tableLoading: false,
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      tableConfig: {
        showHandler: true,
        defaultExpandAll: false,
        enableMultiSelect: false,
        enablePagination: true,
        showIndexColumn: false,
        rowKey: 'id',
        lazy: true,
        treeProps: { children: 'children', hasChildren: 'hasChildren' },
        load: async (tree, treeNode, resolve) => {
          this.loadTree(tree, treeNode, resolve)
        },
        handlerColumn: {
          width: '200',
          fixed: false
        }
      },
      fullscreenLoading: false,
      filename: '职级列表' + dateFormat(new Date(), 'yyyyMMdd'),
      autoWidth: true,
      bookType: 'xlsx',
      rowData: {},
      searchParams: {}
    }
  },
  computed: {
    ADD_RANK: () => ADD_RANK,
    EXPORTS_RANK: () => EXPORTS_RANK,
    EDIT_RANK: () => EDIT_RANK,
    DELETE_RANK: () => DELETE_RANK
  },
  activated() {
    this.loadData()
  },
  methods: {
    // 创建职级
    addStation() {
      this.$refs.rankForm.openDialog('创建职级')
      this.rowData = {}
    },
    // 创建下级职级
    handleCreateSubordinate(row, type) {
      this.rowData = row
      this.$refs.rankForm.openDialog({ create: '创建下级职级', edit: '编辑职级' }[type], type)
    },
    handleSearch: _.debounce(function(params) {
      this.loadData(params)
    }, 500),
    // 加载数据

    async loadData(value) {
      this.tableLoading = true
      this.tableData = []
      await queryRank({ name: (value && value.name) || '' })
        .then((res) => {
          this.tableData = res.map((item) => {
            if (!item.remark) {
              item.remark = '--'
            }
            return item
          })
        })
        .finally(() => {
          this.tableLoading = false
        })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
    // 刷新
    refresh() {
      this.searchPopoverConfig.requireOptions[0].data = ''
      this.loadData()
    },

    // 编辑
    edit(row) {
      this.handleCreateSubordinate(row, 'edit')
    },

    deleteOpe(row) {
      this.$refs.rankForm.deleteOpe(row)
    },

    async loadTree(tree, treeNode, resolve) {
      try {
        let params = {
          parentId: tree.id
        }
        await getRankChild(params).then((res) => {
          resolve(res)
        })
      } catch (err) {
        resolve([])
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$color_icon: #a0a8ae;
.refresh-container {
  cursor: pointer;
  color: #a0a8ae;
  display: flex;
  align-items: center;
  .refresh-text {
    padding-left: 6px;
    display: inline-block;
    height: 18px;
  }
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
  &__column--item {
    height: 25px;
  }
  &__column--visible {
    height: 200px;
    overflow: scroll;
  }
  &:last-child {
    margin: 0;
    // margin-bottom: 8px
    // margin-right: 8px
  }
  i {
    color: $color_icon;
    font-size: 18px;
  }
}
</style>
<style lang="sass" scoped>
.basic-container--block
    height: calc(100% - 92px)
    min-height: calc(100% - 92px)
.Jobs
  // 添加一个分隔号 "｜"
.table__handler
    display: flex
    justify-content: flex-end
    > .el-button--text
        text-align: center
        padding: 0 8px
        margin-left: 0px
        position: relative
    &:not(:last-child)::after
        background-color: #e3e7e9
        content: ''
        height: 10px
        position: absolute
        right: 0
        top: 50%
        transform: translateY(-50%)
        width: 1px
</style>
