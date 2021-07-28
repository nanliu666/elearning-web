<template>
  <div style="height:100%">
    <page-header title="分组管理">
      <el-button
        slot="rightMenu"
        v-p="ADD_GROUNP"
        size="medium"
        type="primary"
        @click="onHandleEdit('add')"
      >
        添加分组
      </el-button>
    </page-header>
    <basic-container block>
      <common-table
        ref="table"
        :columns="columns"
        :config="tableConfig"
        :page="page"
        :data="tableData"
        :loading="loading"
        @current-page-change="pageChange"
        @page-size-change="sizeChange"
      >
        <template #topMenu>
          <div class="flex flex-flow flex-justify-between flex-items">
            <el-input
              v-model="groupName"
              size="medium"
              placeholder="分组名称"
              clearable
              style="width: 200px; margin-right: 12px"
              @input="searchGroup"
            />
            <div class="refresh-container">
              <span
                class="icon el-icon-refresh-right"
                @click="reload"
              />
              <span class="refresh-text">刷新</span>
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
            @click="handleDel(selection)"
          >
            批量删除
          </el-button>
        </template>

        <template
          slot="handler"
          slot-scope="scope"
        >
          <el-button
            v-p="VIEW_GROUNP"
            type="text"
            size="medium"
            @click.stop="handleCheck(scope.row, scope.index)"
          >
            查看用户
          </el-button>
          <el-button
            v-p="EDIT_GROUNP"
            type="text"
            size="medium"
            @click.stop="onHandleEdit('edit', scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-p="DEL_GROUNP"
            type="text"
            size="medium"
            @click.stop="handleDel(scope.row, scope.index)"
          >
            删除
          </el-button>
        </template>
      </common-table>
    </basic-container>

    <el-dialog
      :close-on-click-modal="false"
      append-to-body
      title="添加分组"
      :visible="visible"
      width="550px"
      :modal-append-to-body="false"
      @close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-width="100px"
        label-position="top"
        class="newOrgDailog"
      >
        <el-form-item
          label="分组名称"
          prop="name"
        >
          <el-input
            v-model.trim="formData.name"
            maxlength="32"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="medium"
          @click="handleClose"
        >取消</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="submit"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { groupList, addGroup, sysDelGroup, sysEditGroup } from '../../api/system/role'
import { ADD_GROUNP, DEL_GROUNP, EDIT_GROUNP, VIEW_GROUNP } from '@/const/privileges'
import { mapGetters } from 'vuex'

const TABLE_CONFIG = {
  showHandler: true, //是否显示操作列
  showIndexColumn: false, //是否显示序号列
  rowKey: 'id',
  enableMultiSelect: true,
  handlerColumn: {
    //操作列配置
    width: 200,
    fixed: false
  }
}
const COLUMNS = [
  {
    label: '分组名称',
    prop: 'name'
  }
]

export default {
  name: 'GroupManage',
  components: {},
  data() {
    return {
      visible: false,
      loading: false,
      groupRow: {},
      btnKey: 'edit',
      tableData: [],
      groupName: '',
      formData: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }]
      },
      page: {
        size: 10,
        currentPage: 1,
        total: 0
      },
      columns: COLUMNS,
      tableConfig: TABLE_CONFIG
    }
  },
  computed: {
    ADD_GROUNP: () => ADD_GROUNP,
    DEL_GROUNP: () => DEL_GROUNP,
    EDIT_GROUNP: () => EDIT_GROUNP,
    VIEW_GROUNP: () => VIEW_GROUNP,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([ADD_GROUNP, DEL_GROUNP, EDIT_GROUNP, VIEW_GROUNP])
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    // this.loadData()
  },
  activated() {
    this.loadData()
  },
  methods: {
    sizeChange(val) {
      this.page.size = val
      this.page.currentPage = 1
      this.loadData()
    },
    pageChange(val) {
      this.page.currentPage = val
      this.loadData()
    },
    //搜索分组
    searchGroup() {
      this.reload()
    },
    // 删除分组
    handleDel(rows) {
      const content = rows.length > 0 ? '你确定将选择数据删除吗？' : '您确定要删除当前分组？'
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const ids = rows.length > 0 ? rows.map((row) => row.id) : [rows.id]
          sysDelGroup(ids).then(() => {
            this.$message.success('删除成功')
            this.reload()
          })
        })
        .catch(() => {})
    },
    // 加载分组数据
    loadData() {
      const params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        name: this.groupName || ''
      }
      this.loading = true
      groupList(params).then((res) => {
        this.tableData = res.data
        this.page.total = res.totalNum
        this.loading = false
      })
    },
    // 刷新数据
    reload() {
      this.$set(this.page, 'currentPage', 1)
      this.loadData()
    },
    //添加分组
    onHandleEdit(key, row) {
      if (key == 'edit') {
        this.$set(this.formData, 'name', row.name)
      }
      this.groupRow = row || {}
      this.btnKey = key
      this.visible = true
    },
    //关闭弹出层
    handleClose() {
      this.$set(this.formData, 'name', '')
      this.$refs.ruleForm.clearValidate()
      this.visible = false
    },

    //编辑和添加分组
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.btnKey === 'add') {
            //新增
            const params = {
              name: this.formData.name
            }
            addGroup(params).then(() => {
              this.$message.success('新增成功')
              this.reload()
              this.handleClose()
            })
          } else {
            //编辑
            const params = {
              id: this.groupRow.id,
              name: this.formData.name
            }
            sysEditGroup(params).then(() => {
              this.$message.success('修改成功')
              this.reload()
              this.handleClose()
            })
          }
        }
      })
    },
    //查看用户
    handleCheck(row) {
      this.$router.push({ path: '/system/viewUsers?groupId=' + row.id })
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
  .title {
    color: $primaryColor;
    cursor: pointer;
  }
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

.searchBox {
  // position: absolute;
  // width: 100%;
  i {
    color: #a0a8ae;
    font-size: 18px;
  }
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
  .table-search {
    display: flex;
    align-items: center;
    .search-list {
      flex: 1;
    }
  }
}
.refresh-text {
  padding-left: 6px;
  display: inline-block;
  height: 18px;
  color: #a0a8ae;
}
.icon {
  font-size: 18px;
  color: #a0a8ae;
  cursor: pointer;
}

.search-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .upload-date {
    margin-right: 16px;
  }
  /deep/.require-form .el-form-item {
    padding: 0;
    margin: 0;
  }
}
</style>
