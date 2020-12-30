<template>
  <basic-container
    block
    style="padding-top:0;"
  >
    <common-table
      ref="crud"
      :config="tableConfig"
      :columns="columnsVisible | columnsFilter"
      :loading="loading"
      :data="data"
      :page="page"
      @current-page-change="currentChange"
      @page-size-change="sizeChange"
    >
      <template
        slot="multiSelectMenu"
        slot-scope="{ selection }"
      >
        <el-button
          type="text"
          style="margin-bottom:0;"
          @click="handleReset(selection)"
        >
          批量重置密码
        </el-button>
      </template>
      <template slot="topMenu">
        <div class="operations">
          <search-popover
            ref="searchPopover"
            :require-options="searchConfig.requireOptions"
            :popover-options="searchConfig.popoverOptions"
            @submit="handleSubmitSearch"
            @reset="handleResetSearch"
          />
          <div class="operations-right">
            <div
              class="refresh-container"
              @click="handleRefresh"
            >
              <i class="el-icon-refresh-right" />
              <span>刷新</span>
            </div>
            <el-popover
              placement="bottom"
              width="40"
              trigger="click"
            >
              <i
                slot="reference"
                style="padding-left: 10px;cursor: pointer;"
                class="el-icon-setting"
              />
              <!-- 设置表格列可见性 -->
              <div class="operations__column--visible">
                <el-checkbox-group v-model="columnsVisible">
                  <el-checkbox
                    v-for="item of columns"
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
      <template #name="{row}">
        <el-button
          type="text"
          @click="handleUserClick(row)"
        >
          {{ row.name }}
        </el-button>
      </template>
      <template
        slot="handler"
        slot-scope="{ row }"
      >
        <el-button
          size="medium"
          type="text"
          @click="handleEditRole(row)"
        >
          角色设置
        </el-button>
        <el-button
          size="medium"
          type="text"
          @click="handleReset(row)"
        >
          密码重置
        </el-button>
        <el-dropdown
          style="float:right;"
          @command="(command) => handleCommand(command, row)"
        >
          <el-button
            type="text"
            class="el-dropdown-link"
            style="padding:0;"
          >
            <i class="el-icon-more" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="edit">
              编辑
            </el-dropdown-item>
            <el-dropdown-item
              v-if="row.userStatus === '1'"
              command="suspend"
            >
              冻结
            </el-dropdown-item>
            <el-dropdown-item
              v-if="row.userStatus === '2'"
              command="unsuspend"
            >
              解冻
            </el-dropdown-item>
            <el-dropdown-item command="delete">
              删除
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </common-table>
    <user-role-edit
      ref="userRoleEdit"
      :visible.sync="editVisible"
      :user="editingUser"
      @after-submit="handleAfterSubmit"
    />
  </basic-container>
</template>

<script>
import {
  getOrgUserList,
  modifyUserStatus,
  resetPwd,
  delUser,
  getOuterUserList
} from '@/api/system/user'
import { getRoleList } from '@/api/system/role'

const COLUMNS = [
  {
    label: '姓名',
    prop: 'name',
    slot: true
  },
  {
    label: '用户编号',
    prop: 'workNo'
  },
  //状态，1-正常，2-禁用
  {
    label: '状态',
    prop: 'userStatus',
    formatter(record) {
      return (
        {
          '1': '正常',
          '2': '禁用'
        }[record.userStatus] || ''
      )
    }
  },
  {
    label: '性别',
    prop: 'sex',
    formatter(record) {
      return { '1': '男', '0': '女' }[record.sex] || ''
    }
  },
  {
    label: '部门',
    prop: 'orgName'
  },
  {
    label: '电话',
    prop: 'phonenum'
  },
  {
    label: '邮箱',
    prop: 'userEmail'
  },

  {
    label: '角色',
    prop: 'roles',
    width: 100,
    formatter(record) {
      return record.roles.map((role) => role.roleName).join(';')
    }
  },
  {
    label: '创建人',
    prop: 'creatorName'
  },
  {
    label: '创建时间',
    prop: 'createTime'
  }
]
export default {
  name: 'User',
  components: {
    // 员工角色编辑
    userRoleEdit: () => import('./userRoleEdit'),
    SearchPopover: () => import('@/components/searchPopOver/index')
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  props: {
    activeOrg: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      query: {},
      loading: false,
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      searchConfig: {
        requireOptions: [
          {
            type: 'input',
            field: 'search',
            label: '',
            data: '',
            options: [],
            config: { placeholder: '姓名/手机号码', 'suffix-icon': 'el-icon-search' }
          }
        ],
        popoverOptions: [
          {
            type: 'select',
            field: 'userStatus',
            label: '状态',
            data: '',
            options: [
              { value: '', label: '全部' },
              { value: '1', label: '正常' },
              { value: '2', label: '冻结' }
            ]
          },
          {
            type: 'select',
            field: 'roleId',
            label: '角色',
            data: '',
            options: [],
            config: { optionLabel: 'roleName', optionValue: 'roleId' }
          },

          { type: 'input', field: 'position', label: '岗位', config: {} },
          { type: 'input', field: 'postLevel', label: '职级', config: {} },
          { type: 'input', field: 'post', label: '职务', config: {} },
          { type: 'dataPicker', field: 'entryDate', label: '入职日期' }
        ]
      },
      tableConfig: {
        showHandler: true,
        enableMultiSelect: true,
        enablePagination: true,
        showIndexColumn: false,
        rowKey: 'userId',
        handlerColumn: {
          width: '180'
        }
      },
      columns: COLUMNS,
      columnsVisible: _.map(COLUMNS, 'prop'),
      data: [],
      editVisible: false,
      editingUser: {}
    }
  },
  watch: {
    activeOrg: function() {
      this.page = {
        currentPage: 1,
        size: 10,
        total: 0
      }
      this.loadData()
    }
  },
  created() {
    this.loadData()
    this.loadRoleData()
  },
  activated() {
    this.loadData()
  },
  methods: {
    searchLoadData: _.debounce(function() {
      this.loadData()
    }, 500),
    handleAfterSubmit() {
      this.loadData()
    },
    handleEditRole(user) {
      this.$refs['userRoleEdit'].init(user)
    },
    handleRefresh() {
      this.$emit('refresh')
      this.loadData()
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage
      this.loadData()
    },
    loadRoleData() {
      getRoleList({ categoryId: '' }).then((res) => {
        this.searchConfig.popoverOptions.find((item) => item.field === 'roleId').options = res
      })
    },
    handleSubmitSearch(params) {
      this.query = { ...this.query, ...params }
      this.loadData()
    },
    handleResetSearch() {
      this.query = {}
      this.loadData()
    },
    sizeChange(pageSize) {
      this.page.size = pageSize
      this.loadData()
    },
    handleUserClick(row) {
      this.$router.push({ path: '/system/userDetail', query: { userId: row.userId } })
    },
    handleReset(data) {
      let ids
      if (Array.isArray(data)) {
        ids = data.map((item) => item.userId).join(',')
      } else {
        ids = data.userId
      }
      this.$confirm('确定将选择账号密码重置为123456?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.resetPwd(ids, data)
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
    },
    resetPwd(ids, data) {
      resetPwd(ids).then(() => {
        Array.isArray(data) ? (data.length = 0) : ''
        this.loadData()
      })
    },
    handleCommand(command, row) {
      switch (command) {
        case 'suspend':
          this.modifyUserStatus(row.userId, '2')
          break
        case 'unsuspend':
          this.modifyUserStatus(row.userId, '1')
          break
        case 'edit':
          this.$router.push({ path: '/system/editUser', query: { userId: row.userId } })
          break
        case 'delete':
          this.handleDeleteUser(row)
          break
      }
    },
    modifyUserStatus(userId, status) {
      let msg = ''
      if (status === '2') {
        msg = '您确定要冻结该用户吗？\n冻结后，该用户将不能登录系统'
      } else {
        msg = '您确定要解冻该用户吗？'
      }
      this.$confirm(msg, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => modifyUserStatus(userId, status))
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.loadData()
        })
    },
    handleDeleteUser(row) {
      this.$confirm('您确定要删除该用户吗？\n删除后将不能恢复', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => delUser({ userId: row.userId }))
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.loadData()
        })
    },
    loadData() {
      this.loading = true
      let func = getOrgUserList
      if (!this.activeOrg.orgId) {
        func = getOuterUserList
      }
      func({
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        orgId: this.activeOrg.orgId,
        ...this.query
      })
        .then((res) => {
          this.page.total = res.totalNum
          this.data = res.data
          // this.selectionClear()
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
$color_icon: #a0a8ae;
.addUser {
  font-size: 14px;
  display: inline-block;
  color: #757c85;
  line-height: 14px;
  cursor: pointer;
  padding-right: 12px;
  border-right: 0.5px solid #e9e9e9;
}
.icon {
  margin-left: 12px;
  font-size: 18px;
  color: #a0a8ae;
  cursor: pointer;
}
.operations {
  align-items: center;
  display: flex;
  justify-content: space-between;
  &-right {
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
  &__column--item {
    height: 25px;
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
  }
  &:last-child {
    margin: 0;
    // margin-bottom: 8px
    // margin-right: 8px
  }
  i {
    color: $color_icon;
    font-size: 18px;
  }
}
</style>
