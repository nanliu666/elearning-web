<template>
  <div>
    <page-header title="教室分类">
      <el-button
        slot="rightMenu"
        v-p="ADD_CLASSROOM_CLASSIFY"
        type="primary"
        size="medium"
        @click="$refs.orgEdit.create()"
      >
        创建分类
      </el-button>
    </page-header>
    <basic-container block>
      <common-table
        id="demo"
        ref="table"
        :columns="tableColumns"
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
              </div>
            </div>
          </div>
        </template>
        <template #status="{row}">
          {{ row.status == 0 ? '已停用' : '已启用' }}
        </template>
        <template #handler="{row}">
          <div class="menuClass">
            <el-button
              v-p="STOP_CLASSROOM_CLASSIFY"
              type="text"
              :disabled="getButtonDisabled(row)"
              @click="handleStatus(row)"
            >
              {{ row.status == 0 ? '启用' : '停用' }}
            </el-button>
            <el-button
              v-p="EDIT_CLASSROOM_CLASSIFY"
              type="text"
              @click="handleOrgEdit(row)"
            >
              编辑
            </el-button>
            <el-dropdown
              v-if="$p([DELETE_CLASSROOM_CLASSIFY, ADD_NEW_GROUNP_CLASSROOM_CLASSIFY])"
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
                  v-p="ADD_NEW_GROUNP_CLASSROOM_CLASSIFY"
                  command="addChild"
                >
                  创建子分类
                </el-dropdown-item>
                <el-dropdown-item
                  v-p="DELETE_CLASSROOM_CLASSIFY"
                  command="delete"
                >
                  删除
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
import { getCategoryTree, deleteCategory, updateCategoryStatus, getCreatorList } from '@/api/live'
import SearchPopover from '@/components/searchPopOver/index'
import CatalogEdit from './components/catalogEdit'
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
  rowKey: 'idStr',
  showHandler: true,
  defaultExpandAll: true,
  showIndexColumn: false,
  enablePagination: true,
  treeProps: { hasChildren: 'hasChildren', children: 'children' },
  handlerColumn: {
    minWidth: 100,
    fixed: false
  }
}
import {
  ADD_CLASSROOM_CLASSIFY,
  STOP_CLASSROOM_CLASSIFY,
  EDIT_CLASSROOM_CLASSIFY,
  DELETE_CLASSROOM_CLASSIFY,
  ADD_NEW_GROUNP_CLASSROOM_CLASSIFY
} from '@/const/privileges'
import { mapGetters } from 'vuex'
export default {
  name: 'ClassroomClassify',
  components: { SearchPopover, CatalogEdit },
  data() {
    return {
      tableLoading: false,
      tableData: [],
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS,
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
              { value: 0, label: '停用' },
              { value: 1, label: '启用' }
            ]
          },
          {
            type: 'select',
            field: 'creatorId',
            data: '',
            label: '创建人',
            options: [],
            config: { optionLabel: 'name', optionValue: 'id' },
            loading: false,
            noMore: false,
            pageNo: 2,
            loadMoreFun(item) {
              if (item.loading || item.noMore) return
              item.loading = true
              getCreatorList({ source: 'classroom' }).then((res) => {
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
      searchParams: {
        source: 'classroom'
      }
    }
  },
  computed: {
    ADD_CLASSROOM_CLASSIFY: () => ADD_CLASSROOM_CLASSIFY,
    STOP_CLASSROOM_CLASSIFY: () => STOP_CLASSROOM_CLASSIFY,
    EDIT_CLASSROOM_CLASSIFY: () => EDIT_CLASSROOM_CLASSIFY,
    DELETE_CLASSROOM_CLASSIFY: () => DELETE_CLASSROOM_CLASSIFY,
    ADD_NEW_GROUNP_CLASSROOM_CLASSIFY: () => ADD_NEW_GROUNP_CLASSROOM_CLASSIFY,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([
          STOP_CLASSROOM_CLASSIFY,
          EDIT_CLASSROOM_CLASSIFY,
          DELETE_CLASSROOM_CLASSIFY,
          ADD_NEW_GROUNP_CLASSROOM_CLASSIFY
        ])
      },
      deep: true
    }
  },
  activated() {
    getCreatorList({ source: 'classroom' }).then((res) => {
      this.searchConfig.popoverOptions[1].options.push(...res)
    })
    this.loadTableData()
  },
  methods: {
    // 如果父级停用，子级的启用按钮需要置灰处理
    getButtonDisabled(row) {
      let target = {}
      const loop = function(data) {
        _.each(data, (item) => {
          if (row.parentIdStr === item.idStr) {
            target = item
          }
          if (!_.isEmpty(item.children)) {
            loop(item.children)
          }
        })
      }
      loop(this.tableData)
      const isDisabled = !_.isEmpty(target) && target.status == 0
      return isDisabled
    },
    // 多种操作
    async handleCommand($event, row) {
      const TYPE_COMMAND = {
        delete: this.handleDelete,
        addChild: this.handleAddChild
      }
      TYPE_COMMAND[$event](row)
    },
    // 具体的删除函数
    deleteFun(id) {
      deleteCategory({ id }).then(() => {
        this.loadTableData()
        this.$refs.table.clearSelection()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
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
          this.deleteFun(row.idStr)
        })
      }
    },
    // 加载函数
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableLoading = true
        getCategoryTree(this.searchParams).then((res) => {
          const loop = (tree) => {
            _.each(tree, (item) => {
              item.hasChildren = false
              if (!_.isEmpty(item.children)) {
                loop(item.children)
              }
            })
          }
          loop(res)
          this.tableData = res
          this.tableLoading = false
        })
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
      this.searchParams = _.assign(this.searchParams, params)
      this.loadTableData()
    },
    // 添加子分类
    handleAddChild(row) {
      this.$refs.orgEdit.createChild(row)
    },
    // 编辑分类
    handleOrgEdit(row) {
      this.$refs.orgEdit.edit(row)
    },
    /**
     * 处理停用启用
     */
    handleStatus(row) {
      // 停启用当前分类是否存在子分类
      const hasChildren = !_.isEmpty(row.children)
      const statusText = row.status == 0 ? '启用' : '停用'
      const stopContent = `您确定要停用该分类吗？停用后，该分类${
        hasChildren ? '及其子分类' : ''
      }将暂停使用。`
      const startContent = `您确定要启用该分类${hasChildren ? '及其子分类' : ''}吗？`
      // 获取到当前分类以及子分类的id集合
      const params = { id: row.idStr, status: row.status == 0 ? 1 : 0 }
      this.$confirm(`${row.status == 1 ? stopContent : startContent}`, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateCategoryStatus(params).then(() => {
          this.loadTableData()
          this.$message({
            type: 'success',
            message: `${statusText}成功!`
          })
        })
      })
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
</style>
