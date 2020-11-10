<template>
  <!-- 数据规则 -->
  <el-dialog
    v-loading="loading"
    title="数据规则"
    :visible="visible"
    width="550px"
    :modal-append-to-body="false"
    @close="handleClose"
  >
    <el-tabs
      v-model="activeName"
      @tab-click="tabHandleClick"
    >
      <el-input
        v-show="activeName != 'custom'"
        v-model="filterText"
        placeholder="输入关键字进行过滤"
      />
      <el-tab-pane
        label="组织架构"
        name="org"
      >
        <el-tree
          ref="tree"
          :data="orgPermissionData"
          :draggable="false"
          show-checkbox
          node-key="orgId"
          highlight-current
          :props="orgTreeProps"
          :filter-node-method="orgfilterNode"
        />
      </el-tab-pane>
      <el-tab-pane
        label="业务部门"
        name="business"
      >
        <el-tree
          ref="bizTree"
          :data="bizPermissionData"
          :draggable="false"
          show-checkbox
          node-key="bizId"
          highlight-current
          :props="bizTreeProps"
          :filter-node-method="bizFilterNode"
        />
      </el-tab-pane>
      <el-tab-pane
        label="自定义"
        name="custom"
      >
        <el-form
          ref="costumeForm"
          :model="form"
          label-width="100px"
          label-position="top"
          class="newOrgDailog"
        >
          <el-form-item
            label="权限类名"
            prop="scopeClass"
          >
            <el-input
              v-model="form.scopeClass"
              placeholder="请输入权限类名"
            />
          </el-form-item>
          <el-form-item
            label="规则值"
            prop="scopeValue"
          >
            <el-input
              v-model="form.scopeValue"
              type="textarea"
              :rows="2"
              placeholder="请输入规则值"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
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
      >保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { flatTree } from '@/util/util'
// import { getOrgTreeSimple, editOrg, createOrg, getUserWorkList } from '@/api/org/org'
import { getOrgPermission, getBizPermission, putRolePermission } from '@/api/system/menu'
export default {
  name: 'DataRule',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    menuId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: 'org',
      roleId: 0,
      $menuId: '',
      filterText: '',
      orgPermissionData: [],
      orgTreeProps: {
        label: 'orgName',
        children: 'children'
      },
      bizPermissionData: [],
      bizTreeProps: {
        label: 'name',
        children: 'children'
      },
      form: {
        scopeClass: '',
        scopeValue: ''
      },
      loading: false
    }
  },
  watch: {
    menuId(val, oldVal) {
      this.$menuId = val
      if (val !== oldVal) {
        if (this.activeName == 'org') {
          this.getOrgPermission()
        } else if (this.activeName == 'business') {
          this.getBizPermission()
        }
      }
    },
    filterText(val) {
      if (this.activeName == 'org') this.$refs.tree.filter(val, this.orgPermissionData)
      else if (this.activeName == 'business') this.$refs.bizTree.filter(val, this.bizPermissionData)
    }
  },
  created() {
    let roleId = this.$route.query.roleId
    this.roleId = roleId
  },
  methods: {
    getOrgPermission() {
      let param = {
        roleId: this.roleId,
        menuId: this.$menuId
      }
      this.loading = true
      getOrgPermission(param).then((res) => {
        this.loading = false
        this.orgPermissionData = JSON.parse(JSON.stringify(res))
        this.setCheckedNodes(this.orgPermissionData, 'orgId', this.$refs.tree)
      })
    },
    setCheckedNodes(treeNode, key, obj) {
      let arr = flatTree(treeNode)
      let hasPermissionArr = []
      for (let i = 0; arr[i]; i++) {
        if (arr[i].isOwn == 1) {
          hasPermissionArr.push(arr[i][key])
        }
      }
      obj.setCheckedKeys(hasPermissionArr)
    },
    orgfilterNode(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    bizFilterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    submit() {
      if (!this.roleId || !this.$menuId) {
        this.$message.error('缺少必要参数roleId或者menuId')
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
        menuId: this.$menuId,
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
      // this.form = { orgType: '', parentOrgId: '' }
      // this.radioDisable = {
      //   Company: false,
      //   Department: false,
      //   Group: false
      // }
      this.$emit('closeDialog', false)
    },
    tabHandleClick() {
      switch (this.activeName) {
        case 'org':
          if (!this.orgPermissionData.length) this.getOrgPermission()
          break
        case 'business':
          if (!this.bizPermissionData.length) this.getBizPermission()
          break
        case 'custom':
          break
        default:
      }
    },
    getBizPermission() {
      let param = {
        roleId: this.roleId,
        menuId: this.$menuId
      }
      this.loading = true
      getBizPermission(param).then((res) => {
        this.loading = false
        this.bizPermissionData = JSON.parse(JSON.stringify(res))
        this.setCheckedNodes(this.bizPermissionData, 'bizId', this.$refs.bizTree)
        // this.setCheckedNodes(this.orgPermissionData)
      })
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
