<template>
  <div class="Menu fill">
    <page-header title="菜单管理" />
    <basic-container block>
      <el-menu
        :default-active="activeIndex"
        class="el-menu"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          Web端菜单
        </el-menu-item>
        <el-menu-item index="2">
          Mobile菜单
        </el-menu-item>
        <el-menu-item index="3">
          后台系统菜单
        </el-menu-item>
      </el-menu>
      <common-table
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page-config="tablePageConfig"
        :page="page"
      >
        <template #topMenu>
          <div class="operations">
            <div class="operations__left">
              <el-select
                v-model="statusValue"
                style="width: 100px; margin-right: 20px"
                placeholder="请选择"
                @change="statusChange"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <seach-popover
                :require-options="searchPopoverConfig.requireOptions"
                @submit="handleSearch"
              />
            </div>
            <div class="operations__btns">
              <el-tooltip
                class="operations__btns--tooltip"
                content="刷新"
                effect="dark"
                placement="top"
              >
                <el-button
                  class="operations__btns--item"
                  size="mini"
                  type="text"
                  @click="refreshTableData"
                >
                  <i class="iconfont iconicon_refresh" />
                </el-button>
              </el-tooltip>
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
                  <el-button
                    class="operations__btns--item"
                    size="mini"
                    type="text"
                  >
                    <i class="iconfont iconicon_setting" />
                  </el-button>
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

        <template #icon="{row}">
          <i :class="_.get(row, 'icon', '')" />
        </template>
        <template #isEnabled="{row}">
          {{ row.isEnabled === 1 ? '已启用' : '已停用' }}
        </template>

        <template #handler="{row}">
          <div class="table__handler">
            <el-button
              v-if="row.isEnabled === 1"
              size="medium"
              type="text"
              @click.stop="() => handleMenuEnable(row)"
            >
              停用
            </el-button>
            <el-button
              v-else
              size="medium"
              type="text"
              @click.stop="() => handleMenuUnable(row)"
            >
              启用
            </el-button>
          </div>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import { getMenuInfo, putMenuInfo } from '@/api/system/menu'
const CLIENT_TYPE = [
  {
    type: 'Admin',
    text: '后台系统菜单'
  },
  {
    type: 'OAMobile',
    text: 'Web端菜单'
  },
  {
    type: 'Mobile',
    text: 'Mobile菜单'
  }
]
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '菜单名称',
    minWidth: 150,
    prop: 'name'
  },
  {
    label: '菜单图标',
    prop: 'icon',
    slot: true,
    minWidth: 150
  },
  {
    // 格式化菜单类型
    formatter: (row, column, text = '') => {
      switch (text) {
        case 'Dir':
          text = '目录'
          break
        case 'Menu':
          text = '菜单'
          break
        case 'Button':
          text = '按钮'
          break
        default:
      }
      return text
    },
    label: '菜单类型',
    prop: 'menuType',
    minWidth: 150
  },
  {
    label: '状态',
    prop: 'isEnabled',
    slot: true,
    minWidth: 150
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 60
  },
  enableMultiSelect: false,
  enablePagination: true,
  showHandler: true,
  showIndexColumn: true,
  // 树形结构懒加载
  lazy: true,
  load: async (row, treeNode, resolve) => {
    try {
      let items = await getMenuInfo(row.menuId)
      resolve(_.map(items, (i) => ({ ...i, hasChildren: true })))
    } catch (err) {
      resolve([])
    }
  },
  rowKey: 'menuId',
  treeProps: { hasChildren: 'hasChildren', children: 'children' }
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '请输入菜单名称' },
    data: '',
    field: 'name',
    label: '',
    type: 'input'
  }
]

const SEARCH_POPOVER_CONFIG = {
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}

export default {
  name: 'Menu',
  components: {
    SeachPopover: () => import('@/components/searchPopOver')
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      copyTableData: [],
      clientTypeList: CLIENT_TYPE,
      statusOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 1,
          label: '启用'
        },
        {
          value: 0,
          label: '禁用'
        }
      ],
      statusValue: '',
      activeIndex: '1',
      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      menuEditVisible: false,
      parentId: '0',
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      query: {},
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false,
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },
  created() {
    this.refreshTableData()
  },
  methods: {
    statusChange() {
      let searchParams = { isEnabled: this.statusValue }
      this.loadTableData(searchParams)
    },
    handleSelect(key) {
      this.statusValue = ''
      let searchParams = { clientId: this.clientTypeList[key - 1].type }
      this.handleSearch(searchParams)
    },
    handleMenuEnable(row) {
      let type = row.menuType === 'Button' ? '按钮' : '菜单'
      this.$confirm(`您确定要停用该${type}吗停用后，该${type}将不能出现在系统中`, {
        type: 'warning'
      }).then(() => {
        putMenuInfo({ isEnabled: 0, menuId: row.menuId }).then(() => {
          this.refreshTableData()
        })
      })
    },
    handleMenuUnable(row) {
      let type = row.menuType === 'Button' ? '按钮' : '菜单'
      this.$confirm(`您确定要启用该${type}吗`, {
        type: 'warning'
      }).then(() => {
        putMenuInfo({ isEnabled: 1, menuId: row.menuId }).then(() => {
          this.refreshTableData()
        })
      })
    },
    handleSearch(searchParams) {
      this.loadTableData(_.pickBy(searchParams))
    },
    // 刷新列表数据
    refreshTableData() {
      //  因为只加载了最外层的数据，children仍然是旧的，清空数据
      this.tableData = []
      this.loadTableData({ parentId: '0' })
    },

    // 加载表格数据
    // TODO: 分页还未实现
    async loadTableData(param = {}, page) {
      if (this.tableLoading) {
        return
      }
      this.tableLoading = true
      try {
        const query = _.assign(null, _.omit(param, 'parentId'), page)
        const tableData = await getMenuInfo(param.parentId || '0', query)
        this.tableData = _.map(tableData, (t) => ({
          children: [],
          hasChildren: true,
          ...t
        }))
        this.copyTableData = _.clone(this.tableData)
        // 更新分页器数据
        this.page.total = _.size(tableData)
      } catch (error) {
        window.console.log(error)
      } finally {
        this.tableLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.basic-container--block {
  .el-menu {
    margin-bottom: 20px;
    margin-top: -10px;
  }
  /deep/ .el-menu--horizontal {
    border-bottom: 1px solid #cccccc !important;
  }
}
</style>
<style lang="sass" scoped>
$color_icon: #A0A8AE

.basic-container--block
  height: calc(100% - 92px)
  min-height: calc(100% - 92px)
.operations
  align-items: center
  display: flex
  justify-content: space-between
  &__left
    display: flex
    align-items: center
  &__column--item
    height: 25px
  &__column--visible
    height: 200px
    overflow: scroll
  &__btns
    align-items: center
    display: flex
    height: 24px
    justify-content: flex-start
  &__btns--item
    margin: 0
    margin-right: 4px
    padding: 0
    height: 24px
    width: 24px
    line-height: 24px
    &:last-child
      margin: 0
    // margin-bottom: 8px
    // margin-right: 8px
  .iconfont
    color: $color_icon
    font-weight: bold
    font-size: 16px

.Menu
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
