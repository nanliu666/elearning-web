<template>
  <el-dialog
    title="添加用户"
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
            :disabled="false"
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
import { getAllUserList } from '@/api/system/user'
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
    roleId: {
      type: String,
      default: () => {
        return ''
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
      formData: {
        userId: '',
        orgIdList: []
      }
    }
  },
  methods: {
    loadUser(params) {
      // 获取用户列表
      return getAllUserList(params)
    },
    getOrgList(val) {
      // 获取组织id
      this.form.orgIds = val.map((item) => item.id)
    },
    init() {},
    handleSubmit() {},
    close() {
      this.clear()
      this.$emit('update:visible', false)
    },
    clear() {}
  }
}
</script>
<style lang="scss"></style>
