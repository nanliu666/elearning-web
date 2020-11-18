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
        :columns="tableColumns | columnsFilter(columnsVisible)"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
      >
        <template #topMenu>
          <div class="transitionBox">
            <transition name="el-zoom-in-center">
              <div
                v-show="multipleSelection.length === 0"
                class="searchBox"
              >
                <div>
                  <search-popover
                    ref="searchPopover"
                    :require-options="searchConfig.requireOptions"
                    :popover-options="searchConfig.popoverOptions"
                  />
                  <el-button
                    icon="el-icon-sort"
                    size="medium"
                    @click="toSort"
                  >
                    调整排序
                  </el-button>
                  <el-popover
                    placement="bottom"
                    width="40"
                    trigger="click"
                    style="margin-left:10px"
                  >
                    <el-checkbox-group
                      v-model="checkColumn"
                      style="display: flex;flex-direction: column;"
                      @change="columnChange"
                    >
                      <el-checkbox
                        v-for="item in originColumn"
                        :key="item.prop"
                        :label="item.prop"
                        :disabled="item.prop === 'orgName'"
                        class="originColumn"
                      >
                        {{ item.label }}
                      </el-checkbox>
                    </el-checkbox-group>
                    <el-button
                      slot="reference"
                      icon="el-icon-setting"
                      size="medium"
                    />
                  </el-popover>
                </div>
              </div>
            </transition>
            <transition name="el-zoom-in-center">
              <div
                v-show="multipleSelection.length > 0"
                class="multipleBox"
              >
                <div class="multipleLeft">
                  <div class="multipleLength">
                    已选中 {{ multipleSelection.length }} 项
                  </div>
                </div>
                <el-button
                  size="medium"
                  type="text"
                  icon="el-icon-close"
                  @click="clearMultipleSelection"
                />
              </div>
            </transition>
          </div>
        </template>
        <template slot="orgType">
          <!-- <template #orgType="{row}"> -->
          正常
        </template>
        <template slot="leaders">
          <!-- <template #leaders="{row}"> -->
          2020-10-14 11:24:32
        </template>

        <template #handler="{row}">
          <div class="menuClass">
            <el-button
              v-if="row.parentId === '0'"
              type="text"
              @click="handleDisabled(row)"
            >
              停用
            </el-button>
            <el-button
              v-if="row.parentId !== '0'"
              type="text"
              @click="handleEnabled(row)"
            >
              启用
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
import { getOrgTree, deleteOrg, getOrgLeader } from '@/api/org/org'
import { tableOptions } from '@/util/constant'
import SearchPopover from '@/components/searchPopOver/index'
import CatalogEdit from './components/catalogEdit'
const TABLE_COLUMNS = [
  {
    label: '目录名称',
    prop: 'orgName',
    slot: true,
    minWidth: 150
  },
  {
    label: '状态',
    prop: 'orgType',
    slot: true,
    minWidth: 120
  },
  {
    label: '创建人',
    prop: 'orgCode',
    minWidth: 120
  },
  {
    label: '更新时间',
    slot: true,
    prop: 'leaders',
    minWidth: 120
  }
]
const TABLE_CONFIG = {
  rowKey: 'orgId',
  showHandler: true,
  defaultExpandAll: true,
  showIndexColumn: true,
  enablePagination: true,
  enableMultiSelect: false,
  handlerColumn: {
    minWidth: 100
  }
}
export default {
  name: 'CatelogManager',
  components: { SearchPopover, CatalogEdit },
  filters: {
    // 过滤不可见的列
    columnsFilter: (columns, visibleColProps) =>
      _.filter(columns, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      tableLoading: false,
      tableData: [],
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS,
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      checkColumn: [
        'orgName',
        'orgType',
        'orgCode',
        'leaders',
        'jobNum',
        'userNum',
        'workNum',
        'remark'
      ],
      originColumn: TABLE_COLUMNS,
      searchConfig: {
        requireOptions: [
          {
            type: 'input',
            field: 'orgName',
            label: '',
            data: '',
            options: [],
            config: { placeholder: '请输入目录名称搜索', 'suffix-icon': 'el-icon-search' }
          }
        ],
        popoverOptions: [
          {
            type: 'select',
            field: 'orgType',
            label: '状态',
            data: '',
            options: [
              { value: 'Enterprise', label: '正常' },
              { value: 'Company', label: '停用' }
            ],
            config: { optionLabel: '', optionValue: '' }
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
              getOrgLeader({ pageNo: item.pageNo, pageSize: 100 }).then((res) => {
                if (res.data.length > 0) {
                  item.options.push(...res.data)
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
      multipleSelection: [],
      option: {
        ...tableOptions,
        headerAlign: 'center',
        align: 'center',
        border: false,
        menuWidth: 180,
        selectionWidth: 60,
        defaultExpandAll: true,
        selection: true,
        formHeight: 20,
        rowKey: 'orgId',
        column: TABLE_COLUMNS
      },
      newOrg: {},
      rules: {
        orgName: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
        parentOrgId: [{ required: true, message: '请选择上级组织', trigger: 'change' }],
        orgType: [{ required: true, message: '请选择组织类型', trigger: 'change' }]
      },
      createOrgDailog: false,
      searchParams: { parentOrgId: 0 }
    }
  },
  watch: {
    multipleSelection: {
      handler(newVal) {
        newVal.forEach((item) => {
          this.$refs.avueCrud.toggleRowSelection(item, true)
        })
      },
      deep: true
    }
  },
  created() {
    getOrgLeader({ pageNo: 1, pageSize: 100 }).then((res) => {
      this.searchConfig.popoverOptions[1].options.push(...res.data)
    })
  },
  activated() {
    this.loadTableData()
  },
  methods: {
    turnToLevelArray(data = []) {
      let responsibleList = []
      const maxLevel = Math.max.apply(
        Math,
        data.map((item) => item.level)
      )
      for (var j = 0; j < maxLevel; j++) {
        responsibleList.push({
          level: j + 1,
          userNameArr: []
        })
      }
      data.map((item) => {
        responsibleList[item.level - 1]['userNameArr'].push(item.userName)
      })
      return responsibleList
    },
    async loadTableData() {
      if (this.tableLoading) {
        return
      }
      try {
        const params = this.searchParams
        this.tableLoading = true
        if (Array.isArray(params.parentOrgId)) params.parentOrgId = params.parentOrgId[0]['']
        getOrgTree(params).then((res) => {
          this.tableData = res
          this.multipleSelection = []
          this.tableLoading = false

          if (this.searchParams.orgName) {
            // this.data =[]
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
    clearMultipleSelection() {
      this.$refs.avueCrud.selectClear()
      this.multipleSelection = []
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
    handleCommand(command, row) {
      if (command === 'add') {
        this.createOrgDailog = true
        this.$refs.orgEdit.create()
      } else if (command === 'deleteOrg') {
        if (row.parentId === 0) {
          this.$message.error('顶级组织不可删除')
          return
        }
        if (row.children > 0) {
          this.$message.error('很抱歉，您选中的组织下存在子组织，请先将子组织调整后再删除!')
          return
        }
        if (row.jobNum > 0) {
          this.$message.error('很抱歉，您选中的组织下存在子职位，请先将子职位调整后再删除!')
          return
        }
        this.$confirm('您确定要删除选中的组织么？', '提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteOrg({ ids: row.orgId }).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.loadTableData()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    multipleDeleteClick() {
      let isError = false
      let params = {
        ids: this.multipleSelection
          .map((item) => {
            if (item.parentId === 0) {
              this.$message.error('顶级组织不可删除')
              isError = true
            }
            if (item.children > 0) {
              this.$message.error('很抱歉，您选中的组织下存在子组织，请先将子组织调整后再删除!')
              isError = true
            }
            if (item.jobNum > 0) {
              this.$message.error('很抱歉，您选中的组织下存在子职位，请先将子职位调整后再删除!')
              isError = true
            }
            return item.orgId
          })
          .join(',')
      }
      if (isError) return
      deleteOrg(params).then(() => {
        this.$message.success('删除成功')
        this.loadTableData()
      })
    },
    handleDelete(row) {
      let hasChildren = !_.isEmpty(row.children)
      this.$confirm(`您确定要启用该目录${hasChildren ? '及其子目录' : ''}吗？`, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.loadTableData()
          this.$message({
            type: 'success',
            message: '启用成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          })
        })
    },
    handleAdd() {
      this.$refs.orgEdit.create()
    },
    handleOrgEdit(row) {
      this.$refs.orgEdit.edit(row)
    },
    handleEnabled(row) {
      let hasChildren = !_.isEmpty(row.children)
      let content = '您选中的目录下含有课程，删除目录将会把该目录下的课程同时删除。'
      let deleteText = '您确定要删除选中的目录吗？'
      this.$confirm(`${hasChildren ? content : ''}${deleteText}`, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.loadTableData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      // this.$message.error('很抱歉，您选中的目录下存在子目录，请先将子目录调整后再删除!')
    },
    handleDisabled(row) {
      let hasChildren = !_.isEmpty(row.children)
      this.$confirm(
        `您确定要停用该目录吗吗？停用后，该目录${hasChildren ? '及其子目录' : ''}将暂停使用?`,
        '提醒',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          await this.loadTableData()
          this.$message({
            type: 'success',
            message: '停用成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消停用'
          })
        })
    },
    columnChange() {
      this.option.column = TABLE_COLUMNS.filter((item) => {
        return this.checkColumn.indexOf(item.prop) > -1
      })
    },
    toggleSelection(rows, flag) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.avueCrud.toggleRowSelection(row, flag)
        })
      } else {
        this.$refs.avueCrud.selectClear()
      }
    },
    rowSelect(selection, row) {
      this.multipleSelection = selection
      if (selection.indexOf(row) > -1 && row.children && row.children.length > 0) {
        // this.toggleSelection(row.children, true)
        this.deepCheck(selection, true)
      }
    },
    deepCheck(arr, check) {
      arr.forEach((item) => {
        if (item.children && item.children.length > 0) {
          this.deepCheck(item.children, check)
        }
        if (this.multipleSelection.indexOf(item) === -1 && check) {
          this.multipleSelection.push(item)
        }
        // this.toggleSelection(item.children, check)
      })
    },
    selectAll(selection) {
      var flag = false // 默认 为全不选
      // selection.forEach((item) => {
      if (this.multipleSelection.length === 0) {
        flag = true
      }
      // })
      this.multipleSelection = selection
      if (!flag) {
        this.toggleSelection()
        this.multipleSelection = []
      } else {
        this.deepCheck(selection, true)
      }
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
.multipleBox {
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 62px;
  .multipleLeft {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 20px;
    .multipleLength {
      padding: 0 20px;
      margin-right: 20px;
      border-right: 1px solid #999999;
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
