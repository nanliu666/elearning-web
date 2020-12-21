<template>
  <div class="Menu fill">
    <page-header title="分类管理">
      <el-button
        slot="rightMenu"
        size="medium"
        type="primary"
        @click="dialogFormVisible = true"
      >
        新建分类
      </el-button>
    </page-header>

    <basic-container block>
      <common-table
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page-config="tablePageConfig"
        row-key="id"
      >
        <template #topMenu>
          <div class="operations">
            <seach-popover
              :popover-options="searchPopoverConfig.popoverOptions"
              :require-options="searchPopoverConfig.requireOptions"
              @submit="handleSearch"
            />

            <div class="operations__btns">
              <el-tooltip
                class="operations__btns--tooltip"
                content="调整排序"
                effect="dark"
                placement="top"
                style="color:#acb3b8;"
              >
                <el-button
                  class="operations__btns--item"
                  size="mini"
                  icon="el-icon-sort"
                  type="text"
                  @click="toSort"
                >
                  <!-- <i class="iconfont iconicon_refresh" /> -->
                </el-button>
              </el-tooltip>
              <span
                class="text_refresh"
                @click="toSort"
              >调整排序</span>
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
                    icon="el-icon-setting"
                    style="color:#acb3b8;"
                  >
                    <!-- <i class="iconfont iconicon_setting" /> -->
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
        <!-- 课程类型 -->
        <template
          slot="status"
          slot-scope="{ row }"
        >
          <span v-if="row.status == 1">正常</span>
          <span v-if="row.status == 0">停用</span>
        </template>

        <template #multiSelectMenu="{ selection}">
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

        <template
          slot="handler"
          slot-scope="scope"
        >
          <el-button
            v-if="scope.row.status == 1"
            type="text"
            size="medium"
            @click.stop="handlestatus(scope.row, 0)"
          >
            停用
          </el-button>
          <span
            v-else
            style="color:#ccc;"
            @click.stop="handlestatus(scope.row, 1)"
          >启用</span>
          <span style="color: #a0a8ae;"> &nbsp;&nbsp;|&nbsp;</span>
          <el-button
            type="text"
            size="medium"
            @click="dialogVisible = true"
          >
            权限配置
          </el-button>
          <span style="color: #a0a8ae;"> &nbsp;&nbsp;|&nbsp;</span>
          <el-dropdown
            trigger="hover"
            style="color: #a0a8ae;"
            @command="handleCommand($event, scope.row)"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit">
                编辑
              </el-dropdown-item>
              <el-dropdown-item command="del">
                删除
              </el-dropdown-item>
              <el-dropdown-item command="news">
                新增子分类
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </common-table>
    </basic-container>

    <!-- 新建分类dialog -->

    <el-dialog
      id="my_dialog"
      title="新建分类"
      :visible.sync="dialogFormVisible"
      :modal-append-to-body="false"
      width="30%"
    >
      <el-form :model="newForm">
        <el-form-item
          label="分类名称"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="newForm.newName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="上级分类"
          :label-width="formLabelWidth"
        >
          <el-cascader
            v-model="newForm.newValue"
            :options="tableData"
            :props="{ label: 'name', value: 'id' }"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="newCatalogue"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>

    <!-- 编辑&新增分类dialog -->

    <el-dialog
      id="my_dialog"
      :title="editOrNewsTitle"
      :visible.sync="compileDialogFormVisible"
      :modal-append-to-body="false"
      width="30%"
    >
      <el-form :model="newForm">
        <el-form-item
          label="分类名称"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="newForm.newName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="上级分类"
          :label-width="formLabelWidth"
        >
          <el-cascader
            v-model="newForm.newValue"
            :options="tableData"
            :props="{ label: 'name', value: 'id' }"
            :show-all-levels="false"
            :disabled="!editOrNews"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="compileDialogFormVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="compileCatalogue"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>

    <!-- 权限配置dialog -->
    <el-dialog
      title="请选择管理者"
      :visible.sync="dialogVisible"
      width="70%"
      :modal-append-to-body="false"
    >
      <div class="jurisdiction_dialog_box">
        <div class="box_title">
          <div class="box_title_i">
            已选 :
          </div>
          <div class="box_title_i">
            未选 :
          </div>
        </div>
        <div class="box_con">
          <div class="box_con_i">
            <el-tabs
              v-model="activeName"
              @tab-click="handleClick"
            >
              <el-tab-pane
                label="组织架构"
                name="first"
              >
                <div class="box_con_i_pane">
                  <el-input
                    v-model="filterText"
                    placeholder="输入关键字进行过滤"
                    suffix-icon="el-icon-search"
                  >
                  </el-input>

                  <el-tree
                    ref="tree"
                    class="filter-tree"
                    :data="data"
                    :props="defaultProps"
                    default-expand-all
                    :filter-node-method="filterNode"
                    show-checkbox
                    highlight-current
                    node-key="id"
                    @check="getNodeKey(data)"
                  >
                  </el-tree>
                </div>
              </el-tab-pane>
              <el-tab-pane
                label="角色"
                name="second"
              >
                角色
              </el-tab-pane>
            </el-tabs>
          </div>

          <div class="box_con_i">
            <div class="box_con_i_list">
              <span
                v-for="(item, index) in nodeKeyList"
                :key="item.id"
                class="nodekeylist"
              >{{ item.label }} &nbsp; &nbsp;
                <i
                  class="el-icon-close"
                  @click="deleteNodekeylist(index)"
                ></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCatalog, addCatalog, delCatalag, editCatalog, updateStatus } from '@/api/course/course'

// 表格属性
const TABLE_COLUMNS = [
  {
    label: '分类名称',
    minWidth: 450,
    prop: 'name'
  },
  {
    label: '状态',
    prop: 'status',
    width: 300,
    slot: true
  },
  {
    label: '创建人',
    prop: 'creatorName',
    width: 300
  },
  {
    label: '更新时间',
    prop: 'updateTime',
    width: 300
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 200
  },
  enableMultiSelect: true,
  enablePagination: true,
  showHandler: true,
  showIndexColumn: false,
  // 树形结构懒加载
  lazy: true,
  load: async (row, treeNode, resolve) => {
    try {
      let items = await getCatalog(row.id)
      resolve(_.map(items, (i) => ({ ...i, hasChildren: true })))
    } catch {
      resolve([])
    }
  },
  rowKey: 'id',
  treeProps: { hasChildren: 'hasChildren', children: 'children' }
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '请输入分类名称搜索' },
    data: '',
    field: 'name',
    label: '',
    type: 'input'
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    config: { placeholder: '请选择状态' },
    data: '',
    field: 'status',
    label: '状态',
    type: 'select',
    options: [
      { value: 1, label: '正常' },
      { value: 0, label: '停用' }
    ]
  },
  {
    config: { placeholder: '请选择创建人' },
    data: '',
    field: 'id',
    label: '创建人',
    type: 'cascader',
    options: [{ value: '', label: '' }]
  }
]
const SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
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
      // 编辑&新增
      editOrNews: 1,
      editOrNewsTitle: '',
      // 编辑的id
      compileId: '',
      // 权限配置dialog
      nodeKeyList: '',
      dialogVisible: false,
      activeName: 'first',
      filterText: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      // 新建分类dialog
      dialogFormVisible: false,
      // 编辑分类dialog
      compileDialogFormVisible: false,
      newForm: {
        newName: '',
        newValue: ''
      },
      formLabelWidth: '70px',

      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
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
  // 权限配置dialog
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    editOrNews(val) {
      if (val) {
        this.editOrNewsTitle = '编辑'
      } else {
        this.editOrNewsTitle = '新建子分类'
      }
    }
  },
  created() {
    this.refreshTableData()
    // this.iscatalogUserList()
  },
  methods: {
    toSort() {
      this.$router.push({ path: '/course/courseSort' })
    },
    // 筛选-创建人数据
    // iscatalogUserList() {
    //   getCatalog().then((res) => {

    //   })
    // },
    // 停用&启用
    handlestatus(row, i) {
      // let id = row.id + ','
      updateStatus({ ids: [row.id], status: i }).then(() => {
        this.loadTableData()
      })
    },
    // 删除&编辑&新增子分类
    handleCommand(e, row) {
      if (e === 'del') {
        // 删除
        if (row.children) {
          this.$message.error('很抱歉，您选中的类目下存在子分类，请先将子分类调整后再删除!')
        } else {
          this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              delCatalag({ id: row.id }).then(() => {
                this.$message({
                  message: '删除成功!!!',
                  type: 'success'
                })
              })
              this.refreshTableData()
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      }
      if (e === 'edit') {
        this.editOrNews = 1
        // 编辑
        // editCatalog()
        this.compileDialogFormVisible = true
        this.newForm.newName = row.name
        this.newForm.newValue = row.id
        this.compileId = row.id
      }
      if (e === 'news') {
        // 新增子分类
        this.editOrNews = 0
        this.compileDialogFormVisible = true
        this.newForm.newName = row.name
        this.newForm.newValue = row.id
        this.compileId = row.id
      }
    },
    // 编辑&新增子分类
    compileCatalogue() {
      if (this.editOrNews) {
        // 编辑
        let params = {
          name: this.newForm.newName,
          parentId: this.newForm.newValue[this.newForm.newValue.length - 1],
          id: this.compileId
        }
        editCatalog(params).then(() => {
          this.$message({
            message: '编辑分类成功!!!',
            type: 'success'
          })
        })
      } else {
        // 新增子分类
        let params = {
          name: this.newForm.newName,
          parentId: this.compileId
        }
        addCatalog(params).then(() => {
          this.$message({
            message: '新增子分类成功!!!',
            type: 'success'
          })
        })
      }
      this.refreshTableData()
      this.compileDialogFormVisible = false
      this.newForm.newName = ''
      this.newForm.newValue = []
    },

    //新建分类
    newCatalogue() {
      let params = {
        name: this.newForm.newName,
        parentId: this.newForm.newValue[this.newForm.newValue.length - 1]
      }
      // console.log(params)
      addCatalog(params).then(() => {
        this.dialogFormVisible = false
        this.refreshTableData()
        this.newForm.newName = ''
        this.newForm.newValue = []
        this.$message({
          message: '新建分类成功!!!',
          type: 'success'
        })
      })
    },

    // 权限配置dialog
    deleteNodekeylist(index) {
      this.nodeKeyList.splice(index, 1)
    },
    getNodeKey() {
      this.nodeKeyList = this.$refs.tree.getCheckedNodes(true)
    },
    handleClick() {
      // console.log(tab, event)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    // 下拉框搜索按钮
    handleSearch(searchParams) {
      this.loadTableData(searchParams)
      // window.console.log(searchParams)
    },

    handleRemoveItems(selection) {
      // console.log(_.map(selection, ({ id }) => id).join(','));

      // console.log('-------------', selection)

      this.$confirm('确定将选择数据删除?', {
        type: 'warning'
      })
        .then(() => delCatalag({ id: _.map(selection, ({ id }) => id).join(',') }))
        .then(() => {
          // 删除完成后更新视图
          this.$refs.table.clearSelection()
          this.refreshTableData()
        })
    },

    // 表单弹窗提交

    // 刷新列表数据
    refreshTableData() {
      //  因为只加载了最外层的数据，children仍然是旧的，清空数据
      this.tableData = []
      this.loadTableData({ parentId: '0' })
    },

    // 递归去除空children
    getTreeData(data) {
      // 循环遍历json数据
      // for (var i = 0; i < data.length; i++) {
      //   if (data[i].children.length < 1) {
      //     // children若为空数组，则将children设为undefined
      //     data[i].children = undefined
      //   } else {
      //     // children若不为空数组，则继续 递归调用 本方法
      //     this.getTreeData(data[i].children)
      //   }
      // }
      return data
    },

    // 加载表格数据
    async loadTableData(param = {}) {
      if (this.tableLoading) {
        return
      }
      this.tableLoading = true
      try {
        const query = _.assign(null, _.omit(param, 'parentId'))
        const tableData = await getCatalog(param || '0', query)
        this.tableData = this.getTreeData(tableData)
        // console.log(this.tableData)
        SEARCH_POPOVER_POPOVER_OPTIONS[1].options = []
        this.tableData.forEach((item) => {
          SEARCH_POPOVER_POPOVER_OPTIONS[1].options.push({
            value: item.id,
            label: item.creatorName
          })
        })
      } finally {
        this.tableLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-input {
  width: 280px !important;
}

.jurisdiction_dialog_box {
  width: 100%;
  .box_title {
    display: flex;
    .box_title_i {
      width: 50%;
      height: 45px;
      line-height: 45px;
      box-sizing: border-box;
      padding-left: 10px;
      border: 1px solid #ccc;
    }
  }
  .box_con {
    display: flex;
    .box_con_i {
      width: 50%;
      border: 1px solid #ccc;
      /deep/.el-tabs__item {
        padding-left: 90px;
      }
      .box_con_i_pane {
        padding: 25px;
      }
      .box_con_i_list {
        padding: 25px;
        display: flex;
        flex-wrap: wrap;
        .nodekeylist {
          padding: 5px;
          background-color: #cdcdcd;
          margin: 10px;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>

<style lang="sass" scoped>

/deep/.el-input
  width: 100%
/deep/.el-select
  width: 100%
/deep/.el-input

.operations__btns
    color: #acb3b8
    display: flex;
.text_refresh
    color: #acb3b8
    margin-right: 20px
$color_icon: #A0A8AE

.basic-container--block
  height: calc(100% - 92px)
  min-height: calc(100% - 92px)
.operations
  align-items: center
  display: flex
  justify-content: space-between
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
