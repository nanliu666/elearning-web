<template>
  <div class="fill">
    <page-header title="组织管理">
      <el-dropdown
        slot="rightMenu"
        v-p="ADD_ORG"
        @command="handleCommand"
      >
        <el-button
          type="primary"
          size="medium"
        >
          新建组织
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="add">
            单个新建
          </el-dropdown-item>
          <!-- <el-dropdown-item>Excel导入</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        slot="rightMenu"
        v-p="IMPORT_ORGS"
        style="margin-left:10px;"
        type="primary"
        size="medium"
        @click="importUser"
      >
        导入组织
      </el-button>
    </page-header>

    <basic-container block>
      <common-table
        id="demo"
        ref="table"
        :columns="tableColumns | columnsFilter(columnsVisible)"
        :config="tableConfig"
        :load="loadFn"
        :data="tableData"
        :loading="tableLoading"
      >
        <template #multiSelectMenu="{selection}">
          <el-button
            v-p="DELETE_ORG"
            type="text"
            size="medium"
            icon="el-icon-delete"
            @click="handleDelete(selection)"
          >
            批量删除
          </el-button>
        </template>
        <template #topMenu>
          <div class="operations">
            <SearchPopover
              ref="searchPopover"
              :popover-options="searchConfig.popoverOptions"
              :require-options="searchConfig.requireOptions"
              @submit="handleSearch"
            />
            <div class="operations__right">
              <div
                class="refresh-container btn"
                @click="toSort"
              >
                <!-- <i class="el-icon-sort" />
                <span>调整排序</span> -->
              </div>
              <el-popover
                placement="bottom"
                width="80"
                trigger="click"
              >
                <i
                  slot="reference"
                  style="cursor: pointer;"
                  class="el-icon-setting"
                />
                <!-- 设置表格列可见性 -->
                <div class="operations__column--visible">
                  <el-checkbox-group v-model="columnsVisible">
                    <el-checkbox
                      v-for="item of originColumn"
                      :key="item.prop"
                      :label="item.prop"
                      :disabled="item.prop === 'orgName'"
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
        <template
          slot="orgName"
          slot-scope="{ row }"
        >
          <span
            class="title-class"
            @click="toOrgDetail(row)"
          >
            {{ row.orgName }}
          </span>
        </template>
        <template #orgType="{row}">
          {{ orgTypeObj[row.orgType] }}
        </template>

        <template #handler="{row}">
          <div class="menuClass">
            <el-button
              v-p="ADD_ORG_CHILD"
              type="text"
              @click="handleCreateChild(row)"
            >
              创建子组织
            </el-button>
            <el-button
              v-p="EDIT_ORG"
              type="text"
              @click="handleOrgEdit(row)"
            >
              编辑
            </el-button>
            <el-dropdown
              v-if="row.parentId !== '0' && $p([DELETE_ORG])"
              @command="handleCommand($event, row)"
            >
              <el-button
                type="text"
                style="margin-left: 10px"
              >
                <i class="el-icon-arrow-down el-icon-more" />
              </el-button>
              <el-dropdown-menu
                slot="dropdown"
                v-p="DELETE_ORG"
              >
                <el-dropdown-item command="deleteOrg">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </common-table>
      <org-edit
        v-if="createOrgDailog"
        ref="orgEdit"
        :visible="createOrgDailog"
        @refresh="refresh"
        @changevisible="changevisible"
      />
    </basic-container>
  </div>
</template>

<script>
import { getOrgTree, getOrgTreeSimple, deleteOrg, getOrgLeader, getorganizationNew } from '@/api/org/org'
import SearchPopover from '@/components/searchPopOver/index'
import OrgEdit from './components/orgEdit'

const TABLE_COLUMNS = [
  {
    label: '组织名称',
    prop: 'orgName',
    slot: true,
    minWidth: 250
  },
  {
    label: '组织类型',
    prop: 'orgType',
    slot: true,
    minWidth: 120
  },
  {
    label: '组织编码',
    prop: 'orgCode',
    minWidth: 120
  },
  {
    label: '组织负责人',
    prop: 'leaders',
    minWidth: 120,
    formatter(row) {
      return _.map(row.leaders, 'userName')
        .filter((i) => i)
        .join(',')
    }
  },
  {
    label: '描述',
    prop: 'remark',
    minWidth: 120
  }
]
// const TABLE_CONFIG = 
import { ADD_ORG, ADD_ORG_CHILD, EDIT_ORG, DELETE_ORG, IMPORT_ORGS } from '@/const/privileges'
import { mapGetters } from 'vuex'
export default {
  name: 'OrgManagement',
  components: { SearchPopover, OrgEdit },
  filters: {
    // 过滤不可见的列
    columnsFilter: (columns, visibleColProps) =>
      _.filter(columns, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      tableLoading: false,
      tableData: [],
      tableConfig: {
        rowKey: 'orgId',
        showHandler: true,
        defaultExpandAll: false,
        showIndexColumn: false,
        enablePagination: true,
        load:this.loadFn,
        lazy:true,
        handlerColumn: {
          width: 160,
          fixed: false
        }
      },
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
            type: 'treeSelectNew',
            field: 'parentId',
            label: '',
            data: '',            
            config: {
              selectParams: {
                placeholder: '请输入内容',               
                multiple: false,
              },
              treeParams: {
                data: [],
                'check-strictly': true,
                'default-expand-all': false,
                'expand-on-click-node': false,
                clickParent: true,
                load:this.loadSelectTreeFn,
                lazy:true,
                filterable: false,                           
                props: {                  
                  isLeaf:'hasChildren',
                  children: 'children',
                  label: 'orgName',
                  disabled: 'disabled',
                  value: 'orgId'
                }
              }
            }
          },
          {
            type: 'input',
            field: 'orgName',
            label: '',
            data: '',
            config: { placeholder: '组织名称', 'suffix-icon': 'el-icon-search' }
          }
        ],
        popoverOptions: [
          {
            type: 'select',
            field: 'orgType',
            label: '组织类型',
            data: '',
            options: [
              { value: 'Enterprise', label: '公司' },
              { value: 'Company', label: '单位' },
              { value: 'Department', label: '部门' },
              { value: 'Group', label: '小组' }
            ]
          },
          {
            type: 'numInterval',
            field: 'minUserNum,maxUserNum',
            data: { min: '', max: '' },
            label: '组织人数'
          },
          {
            type: 'select',
            field: 'userId',
            data: '',
            label: '负责人',
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
      newOrg: {},
      rules: {
        orgName: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
        parentId: [{ required: true, message: '请选择上级组织', trigger: 'change' }],
        orgType: [{ required: true, message: '请选择组织类型', trigger: 'change' }]
      },
      createOrgDailog: false,
      orgTypeObj: { Enterprise: '公司', Company: '单位', Department: '部门', Group: '小组' },
      searchParams: { parentId: '0' }
    }
  },
  computed: {
    IMPORT_ORGS: () => IMPORT_ORGS,
    ADD_ORG: () => ADD_ORG,
    ADD_ORG_CHILD: () => ADD_ORG_CHILD,
    EDIT_ORG: () => EDIT_ORG,
    DELETE_ORG: () => DELETE_ORG,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([ADD_ORG_CHILD, EDIT_ORG, DELETE_ORG])
      },
      deep: true
    }
  },
  created() {
    getOrgLeader({ pageNo: 1, pageSize: 100 }).then((res) => {
      this.searchConfig.popoverOptions[2].options.push(...res.data)
    })
    // getorganizationNew({ parentId: 0 }).then((res) => {
    //   res.map(val=>val.hasChildren=true)     
    //   this.searchConfig.requireOptions[0].config.treeParams.data = res
    //   // this.$refs['searchPopover'].treeDataUpdateFun(res, 'parentId')
    //   // this.searchConfig.requireOptions[0].data = res[0].orgId
    // })
  },
  activated() {
    this.loadTableData()
  },
  methods: {
    importUser() {
      this.$router.push('/orgs/importOrg')
    },

    refresh() {
      this.loadTableData()
    },
    async loadSelectTreeFn(node, resolve){ //  懒加载下拉树数据
      let params={parentId:node.data&&node.data.id?node.data.id:'0'}
      getorganizationNew(params).then((res) => {
        // res.map(val=>val.hasChildren=true)        
        resolve(res)
      })      
    },
    async loadFn(tree, treeNode, resolve){ // 懒加载表格数据      
      let params={parentId:tree.id}
      getorganizationNew(params).then((res) => {
        res.map(val=>val.hasChildren=true)        
        resolve(res)
      })
    },
    async loadTableData() {
      if (this.tableLoading) {
        return
      }
      try {
        const params = this.searchParams
        this.tableLoading = true
        if (Array.isArray(params.parentId)) params.parentId = params.parentId[0]['']
        getorganizationNew(params).then((res) => {
          this.tableData = res
          this.tableData.map(val=>val.hasChildren=true)          
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

    toOrgDetail(row) {
      this.$router.push({ path: '/orgs/orgDetail?orgId=' + row.orgId })
    },
    handleSearch(params) {
      this.searchParams = params
      this.loadTableData()
    },
    handleCommand(command, row) {
      if (command === 'add') {
        this.createOrgDailog = true
        this.$nextTick(() => {
          this.$refs.orgEdit.create()
        })
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
    handleDelete(selection) {
      let isError = false
      let params = {
        ids: selection
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
      this.$confirm('您确定要删除选中的组织么？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrg(params).then(() => {
          this.$message.success('删除成功')
          this.loadTableData()
        })
      })
    },
    handleOrgEdit(row) {
      this.createOrgDailog = true
      this.$nextTick(() => {
        this.$refs.orgEdit.edit(row)
      })
    },
    handleCreateChild(row) {
      this.createOrgDailog = true
      this.$nextTick(() => {
        this.$refs.orgEdit.createChild(row)
      })
    },
    toSort() {
      this.$router.push({ path: '/orgs/orgSort' })
    }
  }
}
</script>

<style lang="scss" scoped>
$color_icon: #a0a8ae;
.title-class {
  cursor: pointer;
  color: $primaryColor;
}
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
}

.originColumn {
  height: 25px;
}

.operations {
  align-items: center;
  display: flex;
  justify-content: space-between;
  &__column--item {
    height: 25px;
  }
  &__right {
    i {
      margin-left: 12px;
      font-size: 18px;
      color: #a0a8ae;
      cursor: pointer;
    }
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
  &__column--visible {
    height: 200px;
    overflow: scroll;
  }
  &__btns {
    align-items: center;
    display: flex;
    height: 24px;
    justify-content: flex-start;
  }
  &__btns--item {
    margin: 0;
    margin-right: 4px;
    padding: 0;
    height: 24px;
    width: 24px;
    line-height: 24px;
    &:last-child {
      margin: 0;
    }
  }
  // margin-bottom: 8px;
  // margin-right: 8px;
  .iconfont {
    color: $color_icon;
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
