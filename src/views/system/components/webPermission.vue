<template>
  <div>
    <common-table
      ref="table"
      :columns="columnsVisible | columnsFilter"
      :config="tableConfig"
      :data="tableData"
      :loading="tableLoading"
      :page-config="tablePageConfig"
      :page="page"
      @current-page-change="handleCurrentPageChange"
      @page-size-change="handlePageSizeChange"
    >
      <template #multiSelectMenu="{ selection }">
        <el-button
          style="margin-bottom:0;"
          type="text"
          @click="() => handleRemoveItems(selection)"
        >
          批量删除
        </el-button>
      </template>

      <template #icon="{row}">
        <i :class="_.get(row, 'icon', '')" />
      </template>

      <template #handler="{row}">
        <div class="table__handler">
          <!--          <el-button-->
          <!--            size="medium"-->
          <!--            type="text"-->
          <!--            @click.stop="() => handleMenuEditBtnClick(row)"-->
          <!--          >-->
          <!--            页面控件权限-->
          <!--          </el-button>-->
          <el-button
            size="medium"
            type="text"
            @click.stop="() => handleMenuItemAddBtnClick(row.menuId)"
          >
            管理范围
          </el-button>
          <el-button
            size="medium"
            type="text"
            @click.stop="() => handleRemoveItems([row])"
          >
            删除
          </el-button>
        </div>
      </template>
    </common-table>
    <data-rule
      v-if="dataRuleDialog"
      :visible="dataRuleDialog"
      :menu-id="menuId"
      class="data-rule"
      @closeDialog="closeDialogs"
      @clearMenuId="setMenuId"
    />
    <page-rule
      v-if="pageRuleDialog"
      :visible="pageRuleDialog"
      :parent-id="parentId"
      :client-id="clientId"
      :data="pageData"
      @closeDialog="closePageDialogs"
      @clearMenuId="setMenuId"
    />
  </div>
</template>

<script>
import { getPrivilege, delPrivilege } from '@/api/system/menu'
import dataRule from './dataRule'
import pageRule from './pageRule'
const TABLE_COLUMNS = [
  {
    label: '菜单名称',
    minWidth: 150,
    prop: 'name'
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
    width: 150
  },
  {
    label: '页面地址',
    minWidth: 150,
    prop: 'path'
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 220
  },
  enableMultiSelect: true,
  enablePagination: true,
  showHandler: true,
  showIndexColumn: false,

  // 树形结构懒加载
  lazy: true,
  load: async (row, treeNode, resolve) => {
    try {
      resolve(row.children)
      //
      // let params ={
      //   parentId:row.menuId,
      //   roleId:roleId,
      //   clientId:'Admin'
      // }
      // let items = await getPrivilege(params)
      // let itemList = []
      // _.map(items,(it)=>{
      //
      //   let newData = {
      //     hasChildren: true,
      //     childrens: [],
      //     ...it
      //   }
      //   itemList.push(newData)
      // })
      // resolve(itemList)
      // resolve(_.map(items, (i) => ({ ...i, hasChildren: true })))
    } catch (err) {
      resolve([])
    }
  },
  rowKey: 'menuId',
  treeProps: { hasChildren: 'hasChildren', children: 'childrens' }
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
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    config: { placeholder: '请输入菜单编号' },
    data: '',
    field: 'code',
    label: '菜单编号',
    type: 'input'
  },
  {
    config: { placeholder: '请输入菜单别名' },
    data: '',
    field: 'alias',
    label: '菜单别名',
    type: 'input'
  }
]
const SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
export default {
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  components: {
    dataRule,
    pageRule
  },
  props: {
    clientId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pageData: [],
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
      tablePageConfig: TABLE_PAGE_CONFIG,
      dataRuleDialog: false,
      loading: false,
      menuId: '',
      pageRuleDialog: false
    }
  },
  created() {
    this.refreshTableData()
  },
  methods: {
    async handleDelete(data) {
      let menuId = []
      data.map((it) => {
        menuId.push(it.menuId)
      })
      menuId = menuId.join(',')
      let params = {
        roleId: this.$route.query.roleId,
        menuId: menuId
      }
      await delPrivilege(params)
      this.refreshTableData()
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    },
    handleRemoveItems(data) {
      this.$confirm('此操作将该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleDelete(data)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //  处理页码改变
    handleCurrentPageChange() {},
    handlePageSizeChange() {},

    handleSearch(searchParams) {
      this.loadTableData(_.pickBy(searchParams))
    },

    // handleRemoveItems(selection) {
    //   this.$confirm('确定将选择数据删除?', {
    //     type: 'warning'
    //   })
    //     .then(() => deleteMenuInfo(_.map(selection, ({ menuId }) => menuId).join(',')))
    //     .then(() => {
    //       // 删除完成后更新视图
    //       this.$refs.table.clearSelection()
    //       this.refreshTableData()
    //     })
    // },
    // 点击添加菜单按钮
    handleMenuAddBtnClick() {
      this.$refs.menuEdit.init()
    },
    // 数据规则
    handleMenuItemAddBtnClick(menuId) {
      this.menuId = menuId
      this.dataRuleDialog = true
    },

    // 点击页面控件权限
    handleMenuEditBtnClick(row) {
      this.parentId = row.parentId || 0
      this.pageRuleDialog = true
      this.pageData = _.cloneDeep(row.children)
      this.pageData = this.pageData.filter((it) => {
        if (it.menuType === 'Button') {
          return true
        }
      })
    },

    // 表单弹窗提交
    // handleMenuEditSubmit({ query, type }) {
    //   const menuEdit = this.$refs.menuEdit
    //   let api = null
    //   switch (type) {
    //     case 'add': // 与case "addItem": 处理相同
    //     case 'addItem':
    //       api = postMenuInfo
    //       break
    //     case 'edit':
    //       api = putMenuInfo
    //       break
    //     default:
    //       return
    //   }
    //   menuEdit.loading = true
    //   api(_.set(query, 'status', true))
    //     .then(() => {
    //       this.$message.success('操作成功!')
    //       this.refreshTableData()
    //       this.$refs.menuEdit.close()
    //     })
    //     .catch((err) => {
    //       window.console.log(err)
    //     })
    //     .finally(() => (menuEdit.loading = false))
    // },

    // 刷新列表数据
    refreshTableData() {
      //  因为只加载了最外层的数据，children仍然是旧的，清空数据
      this.tableData = []
      this.loadTableData({ parentId: '0' })
    },

    // 加载表格数据
    // TODO: 分页还未实现
    async loadTableData(param = {}) {
      if (this.tableLoading) {
        return
      }
      this.tableLoading = true
      try {
        // const query = _.assign(null, _.omit(param, 'parentId'), page)
        let params = {
          parentId: param.parentId || '0',
          roleId: this.$route.query.roleId,
          clientId: 'Admin'
        }
        const tableData = await getPrivilege(params)

        this.tableData = []

        let arr = []
        this.filterData(tableData, arr)
        this.tableData = arr
        // 更新分页器数据
        this.page.total = _.size(tableData)
      } catch (error) {
        window.console.log(error)
      } finally {
        this.tableLoading = false
      }
    },
    filterData(data, table) {
      data.map((it) => {
        if (it.isOwn) {
          table.push(_.cloneDeep(it))
        }
        if (it.isOwn && it.children && it.children.length > 0) {
          table[table.length - 1].children = []
          this.filterData(it.children, table[table.length - 1].children)
        }
      })
    },
    closeDialogs() {
      this.dataRuleDialog = false
    },
    closePageDialogs() {
      this.pageRuleDialog = false
    },
    setMenuId(val) {
      this.menuId = val
    }
  }
}
</script>

<style scoped>
.top-menu {
  height: 0 !important;
}
</style>
