<template>
  <div class="fill">
    <page-header title="考评分类" />
    <basic-container block>
      <el-menu
        :default-active="activeIndex"
        class="el-menu"
        :active-text-color="activeColor"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="0">
          题库分类
        </el-menu-item>
        <el-menu-item index="1">
          试卷/考试分类
        </el-menu-item>
      </el-menu>
      <common-table
        id="demo"
        ref="table"
        :columns="columnsVisible"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
      >
        <template #topMenu>
          <div class="search-box">
            <search-popover
              ref="searchPopover"
              :require-options="searchConfig.requireOptions"
              :popover-options="searchConfig.popoverOptions"
              @submit="handleSearch"
            />
            <el-button
              v-p="ADD_EXAM_CATALOG"
              type="primary"
              size="medium"
              @click="addCategory"
            >
              创建分类
            </el-button>
          </div>
        </template>
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="deleteSelected(selection)"
          >
            批量删除
          </el-button>
        </template>
        <template #status="{row}">
          {{ row.status === 1 ? '正常' : '已停用' }}
        </template>
        <template #handler="{row}">
          <div class="menuClass">
            <el-button
              v-p="STOP_EXAM_CATALOG"
              type="text"
              :disabled="getButtonDisabled(row)"
              @click="handleStatus(row)"
            >
              {{ row.status === 1 ? '停用' : '启用' }}
            </el-button>
            <el-dropdown
              v-if="$p([EDIT_EXAM_CATALOG, DELETE_EXAM_CATALOG, ADD_GROUNP_EXAM_CATALOG])"
              @command="handleCommand($event, row)"
            >
              <el-button
                type="text"
                style="margin-left: 10px"
              >
                <i class="el-icon-arrow-down el-icon-more" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-p="EDIT_EXAM_CATALOG"
                  command="edit"
                >
                  编辑
                </el-dropdown-item>
                <el-dropdown-item
                  v-p="DELETE_EXAM_CATALOG"
                  command="delete"
                >
                  删除
                </el-dropdown-item>
                <el-dropdown-item
                  v-p="ADD_GROUNP_EXAM_CATALOG"
                  command="addChild"
                >
                  创建子分类
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </common-table>
    </basic-container>
    <catalog-edit
      ref="orgEdit"
      :visible="createOrgDailog"
      @refresh="loadTableData"
      @changevisible="changevisible"
    />
  </div>
</template>

<script>
import { getCategoryList, ableCategory, delCategory } from '@/api/examManage/category'
import SearchPopover from '@/components/searchPopOver/index'
import CatalogEdit from './edit'
const TABLE_COLUMNS = [
  {
    label: '分类名称',
    prop: 'name',
    slot: true,
    minWidth: 150
  },
  {
    label: '状态',
    prop: 'status',
    slot: true,
    minWidth: 120
  },
  {
    label: '创建人',
    prop: 'createUser',
    minWidth: 120
  },
  {
    label: '更新时间',
    slot: true,
    prop: 'updateTime',
    minWidth: 120
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  defaultExpandAll: true,
  showIndexColumn: false,
  enablePagination: true,
  // enableMultiSelect: true, // TODO: 以后添加多选
  handlerColumn: {
    minWidth: 100,
    fixed: false
  }
}
const searchConfig = {
  requireOptions: [
    {
      type: 'input',
      field: 'name',
      label: '',
      data: '',
      options: [],
      config: { placeholder: '请输入分类名称搜索', 'suffix-icon': 'el-icon-search' }
    }
  ],
  popoverOptions: []
}
import styles from '@/styles/variables.scss'
import {
  ADD_EXAM_CATALOG,
  STOP_EXAM_CATALOG,
  EDIT_EXAM_CATALOG,
  DELETE_EXAM_CATALOG,
  ADD_GROUNP_EXAM_CATALOG
} from '@/const/privileges'
import { mapGetters } from 'vuex'
export default {
  name: 'CatelogManager',
  components: { SearchPopover, CatalogEdit },

  data() {
    return {
      activeColor: styles.primaryColor,
      activeIndex: '0',
      tableLoading: false,
      tableData: [],
      tableConfig: TABLE_CONFIG,
      columnsVisible: TABLE_COLUMNS,
      checkColumn: ['name', 'status', 'createUser', 'updateTime'],
      searchConfig,
      data: [],
      createOrgDailog: false,
      searchParams: {
        parentId: 0,
        type: '0',
        name: ''
      }
    }
  },
  computed: {
    ADD_EXAM_CATALOG: () => ADD_EXAM_CATALOG,
    STOP_EXAM_CATALOG: () => STOP_EXAM_CATALOG,
    EDIT_EXAM_CATALOG: () => EDIT_EXAM_CATALOG,
    DELETE_EXAM_CATALOG: () => DELETE_EXAM_CATALOG,
    ADD_GROUNP_EXAM_CATALOG: () => ADD_GROUNP_EXAM_CATALOG,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([
          STOP_EXAM_CATALOG,
          EDIT_EXAM_CATALOG,
          DELETE_EXAM_CATALOG,
          ADD_GROUNP_EXAM_CATALOG
        ])
      },
      deep: true
    }
  },
  activated() {
    this.loadTableData()
  },
  methods: {
    // 新增分类
    addCategory() {
      this.$refs.orgEdit.create(Number(this.activeIndex))
    },
    handleSelect(key) {
      this.activeIndex = key
      this.searchParams.type = key
      this.$refs.table.clearSelection()
      this.loadTableData()
    },
    // 多种操作
    async handleCommand($event, row) {
      const TYPE_COMMAND = {
        delete: this.handleDelete,
        edit: this.handleOrgEdit,
        addChild: this.handleAddChild
      }
      TYPE_COMMAND[$event](row)
    },
    // 如果父级停用，子级的启用按钮需要置灰处理
    getButtonDisabled(row) {
      let target = {}
      const loop = function(data) {
        _.each(data, (item) => {
          if (row.parentId === item.id) {
            target = item
          }
          if (!_.isEmpty(item.children)) {
            loop(item.children)
          }
        })
      }
      loop(this.tableData)
      const isDisabled = !_.isEmpty(target) && target.status === 0 ? true : false
      return isDisabled
    },
    // 具体的删除函数
    deleteFun(id) {
      delCategory({ id }).then(() => {
        this.loadTableData()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.$refs.table.clearSelection()
      })
    },
    // 单个删除
    handleDelete(row) {
      let hasChildren = !_.isEmpty(row.children)
      if (hasChildren) {
        this.$message.error('很抱歉，您选中的分类下存在子分类，请先将子分类调整后再删除!')
      } else {
        this.$confirm('您确定要删除选中的分类吗？', '提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteFun(row.id)
        })
      }
    },
    // 批量删除
    deleteSelected(selected) {
      let selectedIds = []
      _.each(selected, (item) => {
        selectedIds.push(item.id)
      })
      this.deleteFun(selectedIds.join(','))
    },
    // 加载函数
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableLoading = true
        getCategoryList(this.searchParams).then((res) => {
          this.tableData = res
          this.tableLoading = false
        })
        this.$refs.orgEdit.loadOrgTree()
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.tableLoading = false
      }
    },
    changevisible(data) {
      this.createOrgDailog = data
    },
    // 搜索
    handleSearch(params) {
      _.assign(this.searchParams, params)
      this.loadTableData()
    },
    // 添加子分类
    handleAddChild(row) {
      this.$refs.orgEdit.create(Number(this.activeIndex))
      this.$refs.orgEdit.createChild(row)
    },
    // 编辑分类
    handleOrgEdit(row) {
      this.$refs.orgEdit.create(Number(this.activeIndex))
      this.$refs.orgEdit.edit(row)
    },
    /**
     * 处理停用启用
     */
    handleStatus(row) {
      // 停启用当前分类是否存在子分类
      const hasChildren = !_.isEmpty(row.children)
      const statusText = row.status === 1 ? '停用' : '启用'
      const stopContent = `您确定要停用该分类吗？停用后，该分类${
        hasChildren ? '及其子分类' : ''
      }将暂停使用。`
      // 获取到当前分类以及子分类的id集合
      let ids = this.getDeepIds(row)
      const params = { ids, status: row.status === 1 ? 0 : 1 }
      const startContent = `您确定要启用该分类${hasChildren ? '及其子分类' : ''}吗？`
      this.$confirm(`${row.status === 1 ? stopContent : startContent}`, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ableCategory(params).then(() => {
          this.loadTableData()
          this.$message({
            type: 'success',
            message: `${statusText}成功!`
          })
        })
      })
    },
    // 递归获取所有的停启用的id集合
    getDeepIds(row) {
      let ids = []
      const deep = function(row) {
        ids.push(row.id)
        if (!_.isEmpty(row.children)) {
          _.each(row.children, (item) => {
            deep(item)
          })
        }
      }
      deep(row)
      return ids
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
  .el-menu {
    margin-bottom: 20px;
    margin-top: -10px;
  }
  /deep/ .el-menu--horizontal {
    border-bottom: 1px solid #cccccc !important;
  }
}
.originColumn {
  height: 25px;
}
.transitionBox {
  position: relative;
  height: 50px;
}
.search-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
</style>
