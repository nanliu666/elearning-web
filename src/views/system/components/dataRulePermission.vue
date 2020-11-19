<template>
  <!-- 数据规则 -->
  <div
    v-loading="loading"
    style="width:350px;"
  >
    <div>
      <el-tabs
        v-model="activeName"
        @tab-click="tabHandleClick"
      >
        <el-input
          v-show="activeName != 'custom'"
          v-model="filterText"
          :disabled="!showCheckbox"
          placeholder="输入关键字进行过滤"
        />

        <el-tab-pane
          label="组织架构"
          name="org"
        >
          <div>
            <el-tree
              ref="tree"
              :data="orgPermissionData"
              :draggable="false"
              :show-checkbox="showCheckbox"
              :check-on-click-node="showCheckbox"
              node-key="orgId"
              :default-checked-keys="defualtOrgId"
              highlight-current
              :props="orgTreeProps"
              :default-expand-all="true"
              :filter-node-method="orgfilterNode"
              @check="check('orgTree')"
            />
          </div>
        </el-tab-pane>
        <!--        <el-tab-pane-->
        <!--          label="业务部门"-->
        <!--          name="business"-->
        <!--        >-->
        <!--          <div>-->
        <!--            <el-tree-->
        <!--              ref="bizTree"-->
        <!--              :show-checkbox="showCheckbox"-->
        <!--              :check-on-click-node="showCheckbox"-->
        <!--              :data="bizPermissionData"-->
        <!--              :draggable="false"-->
        <!--              :default-expand-all="true"-->
        <!--              :default-checked-keys="defualtBizId"-->
        <!--              node-key="bizId"-->
        <!--              highlight-current-->
        <!--              :props="bizTreeProps"-->
        <!--              :filter-node-method="bizFilterNode"-->
        <!--              @check="check('bizTree')"-->
        <!--            />-->
        <!--          </div>-->
        <!--        </el-tab-pane>-->
        <!--        <el-tab-pane-->
        <!--          label="自定义"-->
        <!--          name="custom"-->
        <!--        >-->
        <!--          <el-form-->
        <!--            v-if="activeName == 'custom'"-->
        <!--            ref="costumeForm"-->
        <!--            :model="form"-->
        <!--            :disabled="!showCheckbox"-->
        <!--            label-width="100px"-->
        <!--            label-position="top"-->
        <!--            class="newOrgDailog"-->
        <!--          >-->
        <!--            <el-form-item-->
        <!--              label="权限类名"-->
        <!--              prop="scopeClass"-->
        <!--            >-->
        <!--              <el-input-->
        <!--                v-model="form.scopeClass"-->
        <!--                placeholder="请输入权限类名"-->
        <!--                @input="getCheckList('custom')"-->
        <!--              />-->
        <!--            </el-form-item>-->
        <!--            <el-form-item-->
        <!--              label="规则值"-->
        <!--              prop="scopeValue"-->
        <!--            >-->
        <!--              <el-input-->
        <!--                v-model="form.scopeValue"-->
        <!--                type="textarea"-->
        <!--                :rows="2"-->
        <!--                placeholder="请输入规则值"-->
        <!--                maxlength="200"-->
        <!--                show-word-limit-->
        <!--                @input="getCheckList('custom')"-->
        <!--              />-->
        <!--            </el-form-item>-->
        <!--          </el-form>-->
        <!--        </el-tab-pane>-->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { flatTree } from '@/util/util'
// import { getOrgTreeSimple, editOrg, createOrg, getUserWorkList } from '@/api/org/org'
import {
  getOrgPermission,
  getBizPermission,
  putRolePermission,
  getDataPermission
} from '@/api/system/menu'
export default {
  name: 'DataRulePer',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    defualtRuleData: {
      type: Object,
      default() {
        return {}
      }
    },
    menuId: {
      type: String,
      default: ''
    },
    showCheckbox: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      orgTreeCheckList: [],
      bizTreeCheckList: [],
      activeName: 'org',
      roleId: 0,
      $menuId: '',
      filterText: '',
      orgPermissionData: [],
      orgTreeProps: {
        label: 'orgName',
        children: 'children'
      },
      defualtOrgId: [],
      defualtBizId: [],
      bizPermissionData: [],
      bizTreeProps: {
        label: 'name',
        children: 'children'
      },
      form: {
        scopeClass: '',
        scopeValue: ''
      },
      loading: false,
      isMenuChange: false
    }
  },
  watch: {
    menuId(val, oldVal) {
      this.$menuId = val
      if (val !== oldVal) {
        this.orgTreeCheckList = []
        this.bizTreeCheckList = []
        this.form = {
          scopeClass: '',
          scopeValue: ''
        }
        this.defualtOrgId = this.defualtRuleData.orgId == '' ? [] : this.defualtRuleData.orgId
        this.defualtBizId = this.defualtRuleData.bizId == '' ? [] : this.defualtRuleData.bizId
        this.form = this.defualtRuleData.form
        this.isMenuChange = true
        if (this.activeName == 'org') {
          this.getOrgPermission()
        } else if (this.activeName == 'business') {
          this.getBizPermission()
        }
        this.getDataPermission()
      } else {
        this.isMenuChange = false
      }
    },

    filterText(val) {
      if (this.activeName == 'org') this.$refs.tree.filter(val, this.orgPermissionData)
      else if (this.activeName == 'business') this.$refs.bizTree.filter(val, this.bizPermissionData)
    }
  },
  created() {
    this.$menuId = this.menuId
    let roleId = this.$route.query.roleId
    this.roleId = roleId
    if (this.activeName == 'org') {
      this.getOrgPermission()
    } else if (this.activeName == 'business') {
      this.getBizPermission()
    }
    this.getDataPermission()
  },
  methods: {
    getCheckList(name) {
      //  orgTreeCheckList:[],
      // bizTreeCheckList:[],
      let arr = []
      if (name == 'orgTree') {
        this.orgTreeCheckList = []
        arr = this.$refs.tree.getCheckedNodes()
      } else if (name == 'bizTree') {
        this.bizTreeCheckList = []
        arr = this.$refs.bizTree.getCheckedNodes()
      }
      for (var k = 0, len = arr.length; k < len; k++) {
        if (name == 'orgTree') {
          this.orgTreeCheckList.push(arr[k].orgId)
        } else if (name == 'bizTree') {
          this.bizTreeCheckList.push(arr[k].bizId)
        }
      }

      this.showCheckbox &&
        this.$emit('getDataRuleCleck', {
          orgId: this.orgTreeCheckList,
          bizId: this.bizTreeCheckList,
          form: this.form
        })
    },
    check(name) {
      this.getCheckList(name)
    },
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
      let list = []
      if (key == 'orgId') {
        list = hasPermissionArr.concat(this.defualtOrgId)
      } else {
        list = hasPermissionArr.concat(this.defualtBizId)
      }
      obj.setCheckedKeys(list)
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
    tabHandleClick() {
      switch (this.activeName) {
        case 'org':
          if (this.defualtOrgId.length == 0) this.defualtOrgId = this.orgTreeCheckList
          if (!this.orgPermissionData.length) this.getOrgPermission()
          break
        case 'business':
          if (this.defualtBizId.length == 0) this.defualtBizId = this.bizTreeCheckList
          if (!this.bizPermissionData.length) this.getBizPermission()
          break
        case 'custom':
          this.getDataPermission()
          break
        default:
      }
    },
    getDataPermission() {
      let param = {
        roleId: this.roleId,
        menuId: this.$menuId
      }
      this.loading = true

      getDataPermission(param).then((res) => {
        this.loading = false
        if (res.length > 0) {
          this.form.scopeClass = res[0].scopeClass
          this.form.scopeValue = res[0].scopeValue
        }
      })
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
        this.setCheckedNodes(this.orgPermissionData, 'orgId', this.$refs.tree)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.limit-title {
  font-size: 18px;
  margin-bottom: 20px;
}
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
