<template>
  <basic-container
    block
    style="padding-top: 0"
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
          v-p="RESET_USER"
          type="text"
          style="margin-bottom: 0"
          @click="handleReset(selection)"
        >
          批量重置密码
        </el-button>
        <el-button
          v-p="BATCH_EXPORT"
          type="text"
          style="margin-bottom: 0"
          @click="batchExport(selection)"
        >
          批量导出
        </el-button>
        <el-button
          v-p="BULK_DEPARTURES"
          type="text"
          style="margin-bottom: 0"
          @click="bulkDepartures(selection)"
        >
          批量离职
        </el-button>
        <el-button
          v-p="BATCH_DEPARTMENT"
          type="text"
          style="margin-bottom: 0"
          @click="batchDepartment(selection)"
        >
          批量修改部门
        </el-button>
        <el-button
          v-p="BATCH_DELETE_USER"
          type="text"
          style="margin-bottom: 0"
          @click="batchDelete(selection)"
        >
          批量删除
        </el-button>
      </template>
      <template #userType="{ row }">
        {{ row.orgName ? '公司员工' : '外部人员' }}
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
                style="padding-left: 10px; cursor: pointer"
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
      <template #name="{ row }">
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
          v-p="SETTING_USER"
          size="medium"
          type="text"
          :disabled="row.auditStatus==='4'"
          @click="handleEditRole(row)"
        >
          角色设置
        </el-button>
        <el-button
          v-p="RESET_USER"
          size="medium"
          type="text"
          :disabled="row.auditStatus==='4'"
          @click="handleReset(row)"
        >
          密码重置
        </el-button>
        <el-dropdown
          style="float: right"
          @command="(command) => handleCommand(command, row)"
        >
          <el-button
            type="text"
            class="el-dropdown-link"
            style="padding: 0"
          >
            <i class="el-icon-more" />
          </el-button>
          <el-dropdown-menu
            v-if="$p([EDIT_USER, DELETE_USER, END_USER])"
            slot="dropdown"
          >
            <el-dropdown-item
              v-if="row.needAppr==='1'"
              v-p="EDIT_USER"
              :disabled="row.auditStatus==='4'"
              command="audit"
            >
              审批
            </el-dropdown-item>
            <el-dropdown-item
              v-p="EDIT_USER"
              :disabled="row.auditStatus==='4'"
              command="edit"
            >
              编辑
            </el-dropdown-item>
            <el-dropdown-item
              v-if="row.userStatus === '1'"
              :disabled="row.auditStatus==='4'"
              v-p="END_USER"
              command="suspend"
            >
              离职
            </el-dropdown-item>
            <el-dropdown-item
              :disabled="row.auditStatus==='4'"
              v-if="row.userStatus === '2'"
              v-p="END_USER"
              command="unsuspend"
            >
              在职
            </el-dropdown-item>
            <el-dropdown-item
              :disabled="row.auditStatus==='4'"
              v-p="DELETE_USER"
              command="delete"
            >
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
    <!-- 添加部门 -->
    <el-dialog
      title="批量修改部门"
      :visible.sync="batchVisible"
      width="30%"
    >
      <common-form
        ref="form"
        :model="form"
        :columns="formColumns"
      ></common-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="medium"
          @click="batchClose"
        >取 消</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="batchDetermine"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 审批发起组件 -->
    <appr-submit
      ref="apprSubmit"
      :category-id="categoryId"
      @submit="handleSubmit"
      @apprCancel="apprCancel"
    />
  </basic-container>
</template>

<script>
import {
  getOrgUserList,
  modifyUserStatus,
  resetPwd,
  delUser,
  getOuterUserList,
  bulkDepartures,
  updateUserIdBatchOrg,
  batchDeleteUserByIds
} from '@/api/system/user'
import { getStationParent } from '@/api/system/station'
import { getRoleList, getPositionAll } from '@/api/system/role'
import { getRankTree } from '@/api/system/rank'
import { getOrgTree } from '@/api/org/org'
import { mapGetters } from 'vuex'
import { categoryMap } from '@/const/approve'
import { userRegisterAppr } from '@/api/user'
import {
  SETTING_USER,
  RESET_USER,
  EDIT_USER,
  END_USER,
  DELETE_USER,
  BATCH_EXPORT,
  BULK_DEPARTURES,
  BATCH_DEPARTMENT,
  BATCH_DELETE_USER
} from '@/const/privileges'
const COLUMNS = [
  {
    label: '姓名',
    prop: 'name',
    align: 'left',
    slot: true
  },
  {
    label: '用户编号',
    align: 'center',
    prop: 'workNo'
  },
  {
    label: '审核状态',
    prop: 'auditStatus',
    align: 'center',
    formatter(record) {
      return { '0': '待审核', '1': '审核通过', '2':'审核驳回', '4':'审核中'  }[record.auditStatus] || ''
    }
  },
  //状态，1-在职，2-离职
  {
    label: '在职状态',
    prop: 'userStatus',
    align: 'center',
    formatter(record) {
      return { 1: '在职', 2: '离职' }[record.userStatus] || ''
    }
  },
  {
    label: '性别',
    prop: 'sex',
    align: 'center',
    width: 120,
    formatter(record) {
      return { 1: '男', 0: '女' }[record.sex] || ''
    }
  },
  {
    label: '用户类型',
    prop: 'userType',
    align: 'left',
    slot: true
  },
  {
    label: '部门',
    align: 'left',
    prop: 'orgName',
    width: 230
  },
  {
    label: '直接领导',
    align: 'left',
    prop: 'leaderName'
  },
  {
    label: '岗位',
    align: 'left',
    prop: 'positionName'
  },
  {
    label: '职务',
    align: 'left',
    prop: 'post'
  },
  {
    label: '电话',
    align: 'center',
    prop: 'phonenum'
  },
  {
    label: '邮箱',
    align: 'center',
    prop: 'userEmail'
  },

  {
    label: '角色',
    prop: 'roles',
    width: 100,
    align: 'center',
    formatter(record) {
      return record.roles.map((role) => role.roleName).join(';')
    }
  },
  {
    label: '创建人',
    align: 'center',
    prop: 'creatorName'
  },
  {
    label: '创建时间',
    align: 'center',
    prop: 'createTime'
  }
]

export default {
  name: 'User',
  components: {
    // 员工角色编辑
    userRoleEdit: () => import('./userRoleEdit'),
    SearchPopover: () => import('@/components/searchPopOver/index'),
    ApprSubmit:() => import('@/components/appr-submit/ApprSubmit')
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
      queryListParams: {},
      batchVisible: false,
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
            label: '在职状态',
            data: '',
            options: [
              { value: '', label: '全部' },
              { value: '1', label: '在职' },
              { value: '2', label: '离职' }
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

          {
            data: '',
            field: 'positionId',
            label: '岗位',
            type: 'lazySelect',
            optionList: [],
            placeholder: '请选择岗位',
            optionProps: {
              formatter: (item) => `${item.name}`,
              key: 'name',
              value: 'id'
            },
            load: (p) => {
              console.log(this, 'ppppp')
              p.name = p.search
              return getStationParent(p)
            },
            remote: true,
            searchable: true,
            config: { optionLabel: 'name', optionValue: 'id' }
          },
          // { type: 'input', field: 'postLevel', label: '职级', config: {} },
          {
            type: 'treeSelect',
            field: 'postLevel',
            label: '职级',
            data: '',
            config: {
              selectParams: {
                placeholder: '请选择职级',
                multiple: false
              },
              treeParams: {
                data: [],
                'check-strictly': true,
                'default-expand-all': false,
                'expand-on-click-node': false,
                clickParent: true,
                filterable: false,
                props: {
                  children: 'children',
                  label: 'name',
                  value: 'id'
                }
              }
            }
          },

          { type: 'input', field: 'post', label: '职务' },
          { type: 'dataPicker', field: 'entryDate', label: '入职日期' }
        ]
      },
      categoryId:'',
      tableConfig: {
        showHandler: true,
        enableMultiSelect: true,
        enablePagination: true,
        showIndexColumn: false,
        rowKey: 'userId',
        handlerColumn: {
          width: '180',
          fixed: false
        }
      },
      columns: COLUMNS,
      columnsVisible: _.map(COLUMNS, 'prop').filter((v) => {
        return v != 'userStatus' && v != 'userEmail' && v != 'creatorName' && v != 'createTime'
      }),
      data: [],
      editVisible: false,
      editingUser: {},
      formColumns: [
        {
          prop: 'orgId',
          itemType: 'treeSelect',
          label: '所在部门',
          span: 24,
          required: true,
          props: {
            selectParams: {
              placeholder: '请选择所在部门',
              multiple: false
            },
            treeParams: {
              data: [],
              'check-strictly': true,
              'default-expand-all': false,
              'expand-on-click-node': false,
              clickParent: true,
              filterable: false,
              props: {
                children: 'children',
                label: 'orgName',
                disabled: 'disabled',
                value: 'orgId'
              }
            }
          }
        }
      ],
      form: {
        orgId: ''
      },
      orgData: [],
      currentRowData:{},
      selection:[],
      operateType: '' //操作类型  是删除/批量删除/批量修改部门/审核
    }
  },
  computed: {
    SETTING_USER: () => SETTING_USER,
    RESET_USER: () => RESET_USER,
    EDIT_USER: () => EDIT_USER,
    END_USER: () => END_USER,
    DELETE_USER: () => DELETE_USER,
    BATCH_EXPORT: () => BATCH_EXPORT,
    BULK_DEPARTURES: () => BULK_DEPARTURES,
    BATCH_DEPARTMENT: () => BATCH_DEPARTMENT,
    BATCH_DELETE_USER: () => BATCH_DELETE_USER,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([
          SETTING_USER,
          RESET_USER,
          EDIT_USER,
          END_USER,
          DELETE_USER
        ])
      },
      deep: true
    },
    columnsVisible: {
      handler() {
        this.$nextTick(() => {
          this.$refs.crud.doLayout()
          this.$refs.crud.$forceUpdate()
        })
      },
      deep: true
    },
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
    this.loadOrgData()
    this.loadData()
    this.loadRoleData()
    getPositionAll().then((res) => {
      const positionConfig = _.find(this.searchConfig.popoverOptions, { field: 'positionId' })
      _.set(positionConfig, 'config.treeParams.data', res)
    })

    getRankTree().then((res) => {
      //  debugger
      const postLevelConfig = _.find(this.searchConfig.popoverOptions, { field: 'postLevel' })
      _.set(postLevelConfig, 'config.treeParams.data', res)
    })
  },
  activated() {
    //清空之前的选项
    this.$refs.searchPopover.resetForm()
    this.loadData()
  },
  methods: {
    //注册用户拉起审批流
    async handleAuditUser(){
      this.$refs.apprSubmit.categoryId = '14'
      await this.$refs.apprSubmit.getProcessList()
      this.$refs.apprSubmit.validate().then((process) => {
        userRegisterAppr({userId:this.currentRowData.userId}).then(res=>{
         this.submitApprApply(res,'用户注册审批')
        })
      })
    },
    submitApprApply(obj,formTitle){
      this.$refs.apprSubmit.submit({
        formId: `${obj.id}`,
        formData: '',
        processName: categoryMap[this.$refs.apprSubmit.categoryId],
        formKey: obj.applyType,
        formTitle: formTitle
      }).then(res=>{
        this.loadOrgData()
        this.loadData()
        this.currentRowData = {}
        this.selection = []
      })
    },
    // 审批发起组件的弹窗确认回调
    handleSubmit() {
      if(this.batchVisible){
        this.batchDetermine()
      }else{
        let {operateType} = this
        if(operateType==='handleDeleteUser' || operateType==='handleAuditUser'){
          this[`${operateType}`](this.currentRowData)
        }else{
          this[`${operateType}`](this.selection)
        }
      }
      
    },
    // 审批组件取消事件
    apprCancel() {
      this.isLoading = false
    },
    loadOrgData() {
      getOrgTree({ parentOrgId: '0' }).then((res) => {
        this.formColumns.find((item) => item.prop === 'orgId').props.treeParams.data = res
      })
    },
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
        res.unshift({ roleId: '-1', roleName: '无角色' })
        this.searchConfig.popoverOptions.find((item) => item.field === 'roleId').options = res
      })
    },
    handleSubmitSearch(params) {
      this.query = { ...this.query, ...params }
      this.page.currentPage = 1
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
      this.$confirm('确定将选择账号密码重置为xcmg123456?', {
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
          this.operateType = "handleDeleteUser"  //删除操作
          this.currentRowData = row
          this.handleDeleteUser(row)
          break
        case 'audit':
          this.operateType = "handleAuditUser"  //审核操作
          this.currentRowData = row
          this.handleAuditUser(row)
          break
      }
    },
    modifyUserStatus(userId, status) {
      let msg = ''
      if (status === '2') {
        msg = '您确定要将该用户设置为“离职”状态吗？\n离职后，该用户将不能登录系统'
      } else {
        msg = '您确定要将该用户设置为“在职”状态吗？'
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
      this.categoryId = '14'
      this.$confirm('您确定要删除该用户吗？\n删除后将不能恢复', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$refs.apprSubmit.getProcessList()
          this.$refs.apprSubmit.validate().then((process) => {
              delUser({ userId: row.userId }).then(res=>{
                this.submitApprApply(res,'删除用户')
              })
          })
          
        })
    },
    loadData() {
      this.loading = true
      let func = getOrgUserList
      if (!this.activeOrg.orgId) {
        func = getOuterUserList
      }
      this.queryListParams = {
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        orgId: this.activeOrg.orgId,
        ...this.query
      }
      func(this.queryListParams)
        .then((res) => {
          this.page.total = res.totalNum
          this.data = res.data
          this.$emit('updateList', this.data)
          // this.selectionClear()
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 批量导出
    batchExport(selection) {
      selection.forEach((v) => {
        v.userStatus = { 1: '在职', 2: '离职' }[v.userStatus]
        v.roles = v.roles.map((role) => role.roleName).join(';')
      })
      let addColumns = ['直属领导', '岗位', '出生日期', '职级', '职务', '职称', '入职日期', '备注']
      let addValues = [
        'leaderName',
        'positionName',
        'birthDate',
        'postLevel',
        'post',
        'positionTitle',
        'entryDate',
        'userRemark'
      ]
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = this.columns.map((v) => v.label)
        tHeader.push(...addColumns)
        const filterVal = this.columns.map((v) => v.prop)
        filterVal.push(...addValues)
        const data = this.formatJson(filterVal, selection)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '用户列表'
        })
        this.loadData()
        this.$refs.crud.clearSelection()
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
    // 批量离职
    bulkDepartures(selection) {
      this.$confirm('确定要把选中的用户设置成离职状态吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let userStr = selection.map((v) => v.userId)
        let params = {
          userId: userStr.join(','),
          userStatus: '2'
        }
        bulkDepartures(params)
          .then(() => {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.loadData()
            this.$refs.crud.clearSelection()
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '保存失败,请联系管理员!'
            })
          })
      })
    },
    //批量删除用户
    batchDelete(selection) {
      this.selection = selection
      this.$confirm('确定要把选中的用户批量删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.operateType = 'batchDelete'
        this.categoryId = '14'
        this.$refs.apprSubmit.categoryId = '14'
        let userStr = selection.map((v) => v.userId)
        let params = {
          userIds: userStr.join(',')
        }
        await this.$refs.apprSubmit.getProcessList()
        this.$refs.apprSubmit.validate().then((process) => {
          batchDeleteUserByIds(params)
          .then((res) => {
            this.submitApprApply(res,'删除用户')
            this.$refs.crud.clearSelection()
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '刪除失败,请联系管理员!'
            })
          })
        })
        
      })
    },
    // 批量修改部门
    batchDepartment(selection) {
      this.batchVisible = true
      this.orgData = selection
      this.categoryId = '15'
      this.$refs.apprSubmit.categoryId = '15'
      this.operateType = 'batchDetermine'
    },
    // 批量修改部门-确定按钮
    batchDetermine() {
      console.log(this.orgData)
      this.$refs.form.validate().then(async (valid) => {
        if (!valid) return
        let userStr = this.orgData.map((v) => v.userId)
        let params = {
          userId: userStr.join(','),
          id: this.form.orgId
        }
        await this.$refs.apprSubmit.getProcessList()
        this.$refs.apprSubmit.validate().then(async (process) => {
          await updateUserIdBatchOrg(params)
            .then((res) => {
              this.batchClose()
              this.submitApprApply(res,'批量修改部门')
              this.$refs.crud.clearSelection()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '保存失败,请联系管理员!'
              })
            })
          })
        
      })
    },
    batchClose() {
      this.batchVisible = false
      this.$refs.form.resetFields()
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
