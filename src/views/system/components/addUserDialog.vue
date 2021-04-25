<template>
  <el-dialog
    v-if="visible"
    :modal-append-to-body="false"
    :title="row.name ? '编辑用户' : '添加用户'"
    :visible="visible"
    width="800px"
    append-to-body
    :before-close="close"
  >
    <div>
      <common-form
        ref="userFormRef"
        :model="formData"
        :columns="columns"
      >
        <template #roleUser>
          <lazy-select
            v-model="formData.userId"
            :disabled="row.name ? true : false"
            :first-option="defaultUser"
            :searchable="true"
            :load="loadUser"
            :option-props="{
              label: 'name',
              value: 'userId',
              key: 'userId'
            }"
            :multiple="false"
          />
        </template>
        <template slot="range">
          <OrgTree
            :id-list="formData.orgIdList"
            @selectedValue="getOrgList"
          ></OrgTree>
        </template>
      </common-form>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="medium"
        @click="close"
      >取 消</el-button>
      <el-button
        :loading="submitting"
        size="medium"
        type="primary"
        @click="handleSubmit"
      >
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
// import commonForm from '@/components/common-form/commonForm.vue'
// import { getOrgUserChild, getBizUserChild } from '@/api/system/user'
// import { addUser } from '@/api/system/role'
import { getAllUserList, getMgmtOrgIds, addEditUser } from '@/api/system/user'
import OrgTree from '@/components/UserOrg-Tree/OrgTree'
export default {
  // components: { commonForm },
  name: 'AddUserDialog',
  components: {
    LazySelect: () => import('@/components/lazy-select/lazySelect'),
    OrgTree
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    const BASE_COLUMNS = [
      { itemType: 'slot', span: 24, required: false, prop: 'roleUser', label: '创建人' },
      {
        prop: 'range',
        label: '管理范围',
        itemType: 'slot',
        span: 24
      }
    ]
    return {
      defaultUser: [], // 默认选择的用户
      submitting: false,
      columns: BASE_COLUMNS,
      form: { orgIds: [] },
      formData: {
        userId: '',
        orgIdList: []
      }
    }
  },
  watch: {
    row: function() {
      this.$nextTick(() => {
        this.getData()
      })
    },
    'formData.userId': function() {
      this.$nextTick(() => {
        if (this.row.name) return
        this.getOrgIds()
      })
    }
  },
  methods: {
    // 添加用户
    // 1先选创建人
    // 2拿创建人id跟 roleId type=0 去查询管理范围 // /api/user/v1/user/getMgmtOrgIds
    async getOrgIds() {
      let params = {
        type: 0,
        roleId: this.$route.query.roleId,
        userId: this.formData.userId
      }
      let res = await getMgmtOrgIds(params)
      if (res) res = res.split(',')
      this.formData.orgIdList = res || []
    },

    // 编辑回显
    getData() {
      this.formData.userId = this.row.name || '' //显示名字
      this.formData._userId = this.row.userId || '' //真实ID
      // this.formData.userId = this.row.userId || ''
      // this.formData.name = this.row.name || ''
      if (this.row.orgIds) {
        this.formData.orgIdList = this.row.orgIds.split(',')
      } else {
        this.formData.orgIdList = []
      }
    },

    loadUser(params) {
      // 获取用户列表
      return getAllUserList(params)
    },
    getOrgList(val) {
      // 获取组织id
      this.form.orgIds = val.map((item) => item.id)
    },
    init() {},
    handleSubmit() {
      let params = {
        orgIds: this.form.orgIds.join(','),
        roleId: this.$route.query.roleId,
        userId: this.formData.userId
      }

      if (this.row.name) {
        params.userId = this.formData._userId
      }
      addEditUser(params).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.close()
      })
    },

    close() {
      this.clear()
      this.$emit('update:visible', false)
    },
    clear() {
      this.$emit('after-submit', '123')
    }
  }
}
</script>
<style lang="scss"></style>
