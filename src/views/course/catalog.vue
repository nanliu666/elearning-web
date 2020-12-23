<template>
  <div class="fill">
    <page-header title="分类管理">
      <el-button
        slot="rightMenu"
        type="primary"
        size="medium"
        @click="$refs.orgEdit.create()"
      >
        新建分类
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
import SearchPopover from '@/components/searchPopOver/index'
import CatalogEdit from './components/catalogEdit'
import { getCatalog, delCatalag, updateStatus } from '@/api/course/course'
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
  enableMultiSelect: true, // TODO：树无法做批量选择
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
            field: 'createId',
            data: '',
            label: '创建人',
            options: [],
            config: { optionLabel: 'creatorName', optionValue: 'creatorId' }
          }
        ]
      },
      data: [],
      createOrgDailog: false,
      searchParams: {}
    }
  },
  activated() {
    getCatalog().then((res) => {
      let data = this.flag(res)
      data = this.arrayUnique(data, 'creatorId')
      this.searchConfig.popoverOptions[1].options.push(...data)
    })
    this.loadTableData()
  },
  methods: {
    // 去重
    arrayUnique(arr, name) {
      var hash = {}
      return arr.reduce(function(item, next) {
        hash[next[name]] ? '' : (hash[next[name]] = true && item.push(next))
        return item
      }, [])
    },
    // 树状结构数组扁平化
    flag(arr) {
      let result = []
      for (let item of arr) {
        var res = JSON.parse(JSON.stringify(item))
        delete res['children']
        result.push(res)
        if (item.children instanceof Array && item.children.length > 0) {
          result = result.concat(this.flag(item.children))
        }
      }
      return result
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
      delCatalag({ id: id }).then(() => {
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
          this.deleteFun(row.id)
        })
      }
    },
    // 批量删除
    deleteSelected(selected) {
      // console.log(selected)

      let someOneHasChilren = _.some(selected, (row) => {
        return !_.isEmpty(row.children)
      })
      if (someOneHasChilren) {
        this.$message.error('很抱歉，您选中的分类下存在子分类，请先将子分类调整后再删除!')
      } else {
        let selectedIds = []
        _.each(selected, (item) => {
          selectedIds.push(item.id)
        })
        this.deleteFun(selectedIds.join(','))
      }
    },
    // 加载函数
    async loadTableData() {
      if (this.tableLoading) {
        return
      }
      try {
        const params = this.searchParams
        this.tableLoading = true
        getCatalog(params).then((res) => {
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
        updateStatus(params).then(() => {
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
    },
    // 跳转排序
    toSort() {
      this.$router.push({ path: '/course/courseSort', query: { type: 'catalog' } })
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
