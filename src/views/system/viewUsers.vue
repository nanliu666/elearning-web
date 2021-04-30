<template>
  <div>
    <page-header
      title="查看用户"
      show-back
      :back="goBack"
    >
      <template slot="rightMenu">
        <el-button
          v-p="ADD_ROLE_USER"
          type="primary"
          size="medium"
          @click="handlerAdd"
        >
          添加用户
        </el-button>
      </template>
    </page-header>
    <div class="category">
      <div>
        <div>
          <common-table
            ref="table"
            style="width: 100%"
            :data="data"
            :config="tableConfig"
            :columns="columns"
            :loading="loading"
            :page="page"
            @page-size-change="sizeChange"
            @current-page-change="pageChange"
          >
            <template slot="topMenu">
              <div class="flex-flow flex justify-content align-items">
                <div>
                  <el-input
                    v-model="groupName"
                    placeholder="输入工号或者姓名搜索"
                    clearable
                    style="width: 200px; margin-right: 12px"
                    @input="search"
                  />
                </div>
                <div>
                  <i
                    class="icon el-icon-refresh-right"
                    @click="getData"
                  />
                </div>
              </div>
            </template>
            <template
              slot="multiSelectMenu"
              slot-scope="{ selection }"
            >
              <span
                v-p="DELETE_ROLE_USER"
                class="all"
              >
                <span @click="handleDelete(selection)"><i class="el-icon-delete" /> 批量删除</span>
              </span>
            </template>
            <template
              slot="handler"
              slot-scope="scope"
              style="width: 80px"
            >
              <!-- <el-button
                type="text"
                size="medium"
                @click.stop="handleEdit(scope.row, scope.index)"
              >
                编辑
              </el-button> -->
              <el-button
                v-p="DELETE_ROLE_USER"
                type="text"
                size="medium"
                @click.stop="handleDelete(scope.row, scope.index)"
              >
                删除
              </el-button>
            </template>
          </common-table>
        </div>
      </div>
    </div>
    <addUserDialogGroup
      :visible.sync="editVisible"
      @after-submit="handleAfterSubmit"
    />
  </div>
</template>

<script>
// import { deleteV1Job } from '@/api/organize/position'
import { getToken } from '@/util/auth'
import addUserDialogGroup from './components/addUserDialogGroup'
// import { getV1Position, deleteV1Position } from '@/api/organize/position'
import { getGroupUser, delGroupUser } from '@/api/system/role'
import { ADD_ROLE_USER, DELETE_ROLE_USER } from '@/const/privileges'
import { mapGetters } from 'vuex'
export default {
  name: 'RoleUsers',
  components: {
    addUserDialogGroup
  },
  data() {
    return {
      groupName: '',
      selectionList: [],
      loading: false,
      isEdit: false,
      title: '新建用户',
      stationDialog: false,
      dialogVisible: false,
      isBatch: false,
      show: true,
      number: 0,
      row: {},
      data: [],
      tableConfig: {
        showHandler: true,
        showIndexColumn: false,
        rowKey: 'userId',
        enableMultiSelect: true,
        handlerColumn: {
          width: 80
        }
      },
      columns: [
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '用户编号',
          prop: 'workNo'
        },
        {
          label: '手机号',
          prop: 'phonenum'
        },
        {
          label: '状态',
          prop: 'userStatus',
          formatter(row) {
            let arr = { 1: '正常', 2: '禁用' }
            return arr[row.userStatus]
          }
        },
        {
          label: '部门',
          prop: 'orgName'
        }
      ],
      page: {
        size: 10,
        currentPage: 1,
        total: 0
      },
      params: {
        pageNo: 0,
        pageSize: 0,
        search: '',
        roleId: ''
      },
      editVisible: false
    }
  },
  computed: {
    ADD_ROLE_USER: () => ADD_ROLE_USER,
    DELETE_ROLE_USER: () => DELETE_ROLE_USER,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([DELETE_ROLE_USER])
      },
      deep: true
    }
  },
  activated() {
    this.getData()
  },
  methods: {
    goBack() {
      this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
      this.$router.back(-1)
    },
    getData() {
      const params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        groupId: this.$route.query.groupId,
        userName: this.groupName,
        workNo: ''
      }
      this.loading = true
      getGroupUser(params).then((res) => {
        this.data = res.data
        this.page.total = res.totalNum
        this.loading = false
      })
    },
    //刷新
    handleAfterSubmit() {
      this.page.currentPage = 1
      this.getData()
    },
    //删除
    handleDelete(rows) {
      const content = rows.length > 0 ? '你确定将选择数据删除吗？' : '您确定要删除该用户吗？'
      this.$confirm(content, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = rows.length > 0 ? rows.map((row) => row.id) : [rows.id]
        delGroupUser(ids).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.handleAfterSubmit()
          this.$refs.table.clearSelection()
        })
      })
    },
    //搜索
    search: _.debounce(function() {
      this.page.currentPage = 1
      this.getData()
    }, 500),

    getJobData() {},
    closeBatch() {
      this.isBatch = false
    },
    handlerAdd() {
      this.editVisible = true
    },
    close() {
      this.show = false
    },
    sizeChange(val) {
      this.page.size = val
      this.page.currentPage = 1
      this.getData()
    },
    pageChange(val) {
      this.page.currentPage = val
      this.getData()
    },
    handleEdit(row) {
      this.row = JSON.parse(JSON.stringify(row))
      this.isEdit = true
      this.title = '编辑岗位'
      this.stationDialog = true
    },
    handleExport() {
      this.$confirm('是否导出数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const searchForm = this.form
        window.open(
          `/api/blade-user/export-user?Blade-Auth=${getToken()}&account=${
            searchForm.account
          }&realName=${searchForm.realName}`
        )
      })
    },
    onLoad() {},
    handleConfig() {
      // this.configVisible = !this.configVisible
      this.isEdit = false
      this.title = '创建子组织'
      // this.positionDialog = true
    },
    handleAside(item, index) {
      this.active = index
      this.params.categoryId = item.categoryId
      this.getJobData()
    },
    handleCheck() {
      this.isEdit = true
      this.title = '编辑子组织'
      // this.positionDialog = true
    },
    toggleSelection(val) {
      this.$refs.crud.toggleSelection(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.category {
  // margin-top: 16px;
  background: #ffffff;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 24px !important;
  min-height: calc(100% - 204px);
  .form_ {
    padding-top: 40px;
    width: 400px;
    margin: 0 auto;
    font-size: 14px;
    .label_ {
      /*display: inline-block;*/
      /*margin-top:24px;*/
      /*margin-bottom:8px;*/
    }
    .tip {
      font-size: 12px;
      line-height: 14px;
      color: #a0a8ae;
    }
    .bt {
      /*margin-top: 40px;*/
    }
  }
}
.aside {
  width: 200px;
  border-right: 1px solid #efefef;
  height: 100%;
  box-sizing: border-box;
  margin-right: 20px;
  margin-top: 20px;
  ul {
    list-style: none;
    padding: 0 10px;
    margin-top: 10px;
    line-height: 34px;
    li {
      cursor: pointer;
    }
    li:not(.selection) {
      line-height: 34px;
      font-size: 14px;
      padding-left: 30px;
    }
    .selection {
      .icon {
        display: inline-block;
        margin: 0 6px 0 6px;
        font-size: 18px;
      }
    }
    .actives {
      border-right: 4px solid #1e9fff;
      background: #efefef;
    }
  }
}
/*.header {*/
/*  display: flex;*/
/*  display: -ms-flex;*/
/*  display: -moz-box;*/
/*  display: -webkit-flex;*/
/*  flex-flow: row nowrap;*/
/*  justify-content: space-between;*/
/*  align-items: center;*/
/*  font-size: 18px;*/
/*  color: #202940;*/
/*  line-height: 28px;*/
/*  font-weight: bold;*/
/*  padding-top: 14px;*/
/*}*/
.nav {
  /*height: 36px;*/
  display: flex;
  display: -ms-flex;
  display: -moz-box;
  display: -webkit-flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  line-height: 16px;
  padding: 0px 20px;
  margin-top: -6px;
  background: #edf8ff;
  border: 1px solid #73b9ff;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  /*span {*/
  /*  line-height: 20px;*/
  /*}*/
}
.aside_header {
  display: flex;
  display: -ms-flex;
  display: -moz-box;
  display: -webkit-flex;
  align-items: center;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 0 10px 0px 10px;
  padding-bottom: 10px;
  font-size: 18px;
  border-bottom: 1px solid #efefef;
  /*line-height: 40px;*/
}
.flex {
  display: flex;
  display: -ms-flex;
  display: -moz-box;
  display: -webkit-flex;
}
.flex-flow {
  flex-flow: row nowrap;
}
.flex-flow-column {
  flex-flow: column nowrap;
}

.justify-content {
  justify-content: space-between;
}
.align-items {
  align-items: center;
}

.input-with-select {
  width: 250px;
}
.condition {
  margin: 20px 0 10px 0;
}

.all {
  /*border: 1px solid #efefef;*/
  cursor: pointer;
  padding: 10px;
  span:first-child {
    /*border-right: 1px solid #999;*/
    padding-right: 15px;
  }
  span {
    margin-right: 20px;
  }
}

/deep/ .el-card__body {
  padding-bottom: 0 !important;
}

.icon {
  font-size: 18px;
  color: #a0a8ae;
  cursor: pointer;
}
</style>
