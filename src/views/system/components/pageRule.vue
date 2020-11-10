<template>
  <!-- 数据规则 -->
  <el-dialog
    v-loading="loading"
    title="页面空间权限"
    :visible="visible"
    width="550px"
    :modal-append-to-body="false"
    @close="handleClose"
  >
    <!-- <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"
    /> -->
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
        @click="handleClose"
      >保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPagePermission, putRolePermission } from '@/api/system/menu'
export default {
  name: 'PageRule',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    parentId: {
      type: String,
      default: ''
    },
    clientId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roleId: 0,
      $parentId: '',
      filterText: '',
      form: {},
      loading: false
    }
  },
  watch: {
    parentId(val, oldVal) {
      this.$parentId = val
      if (val !== oldVal) {
        this.getPermission()
      }
    }
  },
  created() {
    let roleId = this.$route.query.roleId
    this.roleId = roleId
  },
  methods: {
    getPermission() {
      let param = {
        clientId: this.clientId,
        roleId: this.roleId,
        parentId: this.$parentId
      }
      this.loading = true
      getPagePermission(param).then(() => {
        this.loading = false
      })
    },
    // setCheckedNodes(treeNode, key, obj) {
    //   let arr = flatTree(treeNode)
    //   let hasPermissionArr = []
    //   for (let i = 0; arr[i]; i++) {
    //     if (arr[i].isOwn == 1) {
    //       hasPermissionArr.push(arr[i][key])
    //     }
    //   }
    //   obj.setCheckedKeys(hasPermissionArr)
    // },
    orgfilterNode(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    bizFilterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    submit() {
      if (!this.roleId || !this.clientId || this.parentId) {
        this.$message.error('缺少必要参数roleId,menuId或者parentId')
        return false
      }
      let orgPermissionChecked = this.$refs.tree.getCheckedNodes().map((item) => {
        return item.orgId
      })
      let bizPermissionChecked = this.$refs.bizTree.getCheckedNodes().map((item) => {
        return item.bizId
      })
      let param = {
        roleId: this.roleId,
        parentId: this.parentId,
        ...this.form,
        orgId: orgPermissionChecked.join(','),
        bizId: bizPermissionChecked.join(',')
      }
      this.loading = true
      putRolePermission(param).then(() => {
        this.$message.success('修改成功')
        this.loading = false
        this.clearData()
      })
    },
    clearData() {
      this.activeName = 'org'
      ;(this.filterText = ''),
        (this.orgPermissionData = []),
        (this.bizPermissionData = []),
        (this.form = {
          scopeClass: '',
          scopeValue: ''
        })
      this.$emit('clearMenuId', '')
      this.handleClose()
    },
    handleClose() {
      this.$emit('closeDialog', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.newOrgDailog {
  .el-select {
    width: 100%;
  }
}
.addressLoading {
  text-align: center;
}
/deep/ .el-form-item__error {
  padding-top: 0;
}
/deep/ .newOrgDailog {
  .el-form--label-top {
    .el-form-item__label {
      padding: 0 0 0 0;
    }
  }
}
</style>
