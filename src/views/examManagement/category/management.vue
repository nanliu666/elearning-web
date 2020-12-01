<template>
  <div class="fill">
    <page-header title="分类管理" />
    <basic-container block>
      <el-menu
        :default-active="activeIndex"
        class="el-menu"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          题库分类
        </el-menu-item>
        <el-menu-item index="2">
          试卷/考试分类
        </el-menu-item>
      </el-menu>
      <common-table
        id="demo"
        ref="table"
        :columns="columnsVisible | columnsFilter"
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
              type="primary"
              size="medium"
              @click="addCategory"
            >
              新建分类
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
          {{ row.status === '0' ? '已启用' : '已停用' }}
        </template>
        <template #handler="{row}">
          <div class="menuClass">
            <el-button
              type="text"
              :disabled="getButtonDisabled(row)"
              @click="handleStatus(row)"
            >
              {{ row.status === '0' ? '停用' : '启用' }}
            </el-button>
            <el-button
              type="text"
              @click="handleAuth(row)"
            >
              权限配置
            </el-button>
            <el-dropdown @command="handleCommand($event, row)">
              <el-button
                type="text"
                style="margin-left: 10px"
              >
                <i class="el-icon-arrow-down el-icon-more" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit">
                  编辑
                </el-dropdown-item>
                <el-dropdown-item command="delete">
                  删除
                </el-dropdown-item>
                <el-dropdown-item command="addChild">
                  新建子分类
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
import {
  getKnowledgeCatalogList,
  getKnowledgeCreatUsers,
  deleteKnowledgeCatalog,
  updateStatusKnowledgeCatalog
} from '@/api/knowledge/knowledge'
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
    prop: 'creatorName',
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
  enableMultiSelect: true,
  handlerColumn: {
    minWidth: 100
  }
}
const CLIENT_TYPE = [
  {
    type: 'questionBank',
    text: '题库分类'
  },
  {
    type: 'testPaper',
    text: '试卷/考试分类'
  }
]
export default {
  name: 'CatelogManager',
  components: { SearchPopover, CatalogEdit },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      clientTypeList: CLIENT_TYPE,
      activeIndex: '1',
      tableLoading: false,
      tableData: [],
      tableConfig: TABLE_CONFIG,
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
            config: { placeholder: '请输入分类名称搜索', 'suffix-icon': 'el-icon-search' }
          }
        ],
        popoverOptions: [
          {
            type: 'select',
            field: 'status',
            label: '状态',
            data: '',
            options: [
              { value: '', label: '全部' },
              { value: 0, label: '启用' },
              { value: 1, label: '停用' }
            ]
          },
          {
            type: 'select',
            field: 'userId',
            data: '',
            label: '创建人',
            options: [],
            config: { optionLabel: 'name', optionValue: 'userId' },
            loading: false,
            noMore: false,
            pageNo: 2,
            loadMoreFun(item) {
              if (item.loading || item.noMore) return
              item.loading = true
              getKnowledgeCreatUsers().then((res) => {
                if (res.length > 0) {
                  item.options.push(...res)
                  item.pageNo += 1
                  item.loading = false
                } else {
                  item.noMore = true
                  item.loading = false
                }
              })
            }
          }
        ]
      },
      data: [],
      createOrgDailog: false,
      searchParams: {}
    }
  },
  activated() {
    getKnowledgeCreatUsers().then((res) => {
      this.searchConfig.popoverOptions[1].options.push(...res)
    })
    this.loadTableData()
  },
  methods: {
    addCategory() {
      this.$refs.orgEdit.create(this.activeIndex - 1)
    },
    handleSelect(key) {
      this.activeIndex = key
      this.statusValue = ''
      let searchParams = { clientId: this.clientTypeList[key - 1].type }
      this.handleSearch(searchParams)
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
      const isDisabled = !_.isEmpty(target) && target.status === '1' ? true : false
      return isDisabled
    },
    // 权限配置窗口
    handleAuth() {
      this.$message.warning('正在开发中...')
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
    // 具体的删除函数
    deleteFun(id) {
      deleteKnowledgeCatalog({ id }).then(() => {
        this.loadTableData()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 删除检测
    deleteCheck() {},
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
      this.searchParams = params
      this.loadTableData()
    },
    // 添加子分类
    handleAddChild(row) {
      this.$refs.orgEdit.create(this.activeIndex - 1)
      this.$refs.orgEdit.createChild(row)
    },
    // 编辑分类
    handleOrgEdit(row) {
      this.$refs.orgEdit.create(this.activeIndex - 1)
      this.$refs.orgEdit.edit(row)
    },
    /**
     * 处理停用启用
     */
    handleStatus(row) {
      // 停启用当前分类是否存在子分类
      const hasChildren = !_.isEmpty(row.children)
      const statusText = row.status === '0' ? '停用' : '启用'
      const stopContent = `您确定要停用该分类吗吗？停用后，该分类${
        hasChildren ? '及其子分类' : ''
      }将暂停使用。`
      // 获取到当前分类以及子分类的id集合
      let ids = this.getDeepIds(row)
      const params = { ids, status: row.status === '0' ? 1 : 0 }
      const startContent = `您确定要启用该分类${hasChildren ? '及其子分类' : ''}吗？`
      this.$confirm(`${row.status === '0' ? stopContent : startContent}`, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatusKnowledgeCatalog(params).then(() => {
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
