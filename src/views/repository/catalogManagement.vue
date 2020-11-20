<template>
  <div class="fill">
    <page-header title="目录管理">
      <el-button
        slot="rightMenu"
        type="primary"
        size="medium"
        @click="handleAdd"
      >
        新建目录
      </el-button>
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
                <div
                  class="search-sort-box"
                  @click="toSort"
                >
                  <i class="el-icon-sort" />
                  <span class="sort-text">调整排序</span>
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
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="deleteSelected(selection)"
          >
            删除
          </el-button>
        </template>
        <template #status="{row}">
          {{ row.status === 0 ? '已启用' : '已停用' }}
        </template>
        <template #handler="{row}">
          <div class="menuClass">
            <el-button
              type="text"
              @click="handleStatus(row)"
            >
              {{ row.status === 0 ? '停用' : '启用' }}
            </el-button>
            <el-button
              type="text"
              @click="handleOrgEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
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
import CatalogEdit from './components/catalogEdit'
const TABLE_COLUMNS = [
  {
    label: '目录名称',
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
    prop: 'createName',
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
      tableLoading: false,
      tableData: [],
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS,
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      checkColumn: ['name', 'status', 'createName', 'updateTime'],
      searchConfig: {
        requireOptions: [
          {
            type: 'input',
            field: 'name',
            label: '',
            data: '',
            options: [],
            config: { placeholder: '请输入目录名称搜索', 'suffix-icon': 'el-icon-search' }
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
    deleteSelected(selected) {
      let selectedIds = []
      _.each(selected, (item) => {
        selectedIds.push(item.id)
      })
      this.deleteFun(selectedIds)
    },
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

          if (this.searchParams.orgName) {
            let newData = []
            this.recursion(this.data, newData)
            this.data = newData
          }
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

    /**
     *  @author guanfenda
     *  @desc 处理扁平化数组
     * */
    recursion(data, newData) {
      data.filter((item) => {
        let it = JSON.parse(JSON.stringify(item))
        it.children && delete it.children
        newData.push(it)
        item.children && item.children.length > 0 && this.recursion(item.children, newData)
      })
    },
    handleSearch(params) {
      this.searchParams = params
      this.loadTableData()
    },
    async deleteFun(id) {
      await deleteKnowledgeCatalog(id)
      await this.loadTableData()
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    },
    handleDelete(row) {
      let hasChildren = !_.isEmpty(row.children)
      let content = '您选中的目录下含有课程，删除目录将会把该目录下的课程同时删除。'
      let deleteText = '您确定要删除选中的目录吗？'
      this.$confirm(`${hasChildren ? content : ''}${deleteText}`, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteFun(row.id)
      })
    },
    handleAdd() {
      this.$refs.orgEdit.create()
    },
    handleOrgEdit(row) {
      this.$refs.orgEdit.edit(row)
    },
    handleStatusFun(row) {
      updateStatusKnowledgeCatalog({ id: row.id, status: row.status })
    },
    /**
     * 处理停用启用
     */
    handleStatus(row) {
      const hasChildren = !_.isEmpty(row.children)
      const statusText = row.status === 0 ? '停用' : '启用'
      const stopContent = `您确定要停用该目录吗吗？停用后，该目录${
        hasChildren ? '及其子目录' : ''
      }将暂停使用。`
      const startContent = `您确定要启用该目录${hasChildren ? '及其子目录' : ''}吗？`
      this.$confirm(`${row.status === 0 ? stopContent : startContent}`, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.handleStatusFun(row)
        await this.loadTableData()
        this.$message({
          type: 'success',
          message: `${statusText}成功!`
        })
      })
    },
    toSort() {
      this.$router.push({ path: '/repository/catalogSort', query: { type: 'catalog' } })
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
</style>
