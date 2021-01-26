<template>
  <el-dialog
    :title="type === 'create' ? '新建组织' : type === 'createChild' ? '新建子组织' : '编辑组织'"
    :visible="visible"
    width="550px"
    :modal-append-to-body="false"
    @close="handleClose"
  >
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="top"
      class="newOrgDailog"
    >
      <el-form-item
        label="组织名称"
        prop="orgName"
      >
        <el-input
          v-model.trim="form.orgName"
          maxlength="32"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        v-if="type === 'edit'"
        label="组织编码"
        prop="orgCode"
      >
        <el-input
          v-model="form.orgCode"
          disabled
        />
      </el-form-item>
      <el-form-item
        v-show="form.orgType !== 'Enterprise'"
        label="上级组织"
        prop="parentOrgId"
      >
        <el-tree-select
          v-model="form.parentOrgId"
          :select-params="column.props && column.props.selectParams"
          :tree-params="column.props && column.props.treeParams"
          v-bind="itemAttrs(column)"
          :disabled="type === 'createChild'"
          :placeholder="column.placeholder ? column.placeholder : `请选择${column.label}`"
          @node-click="nodeClick"
        />
      </el-form-item>
      <el-form-item
        label="组织类型"
        prop="orgType"
      >
        <el-radio-group v-model="form.orgType">
          <el-radio
            v-if="form.orgType === 'Enterprise' && type == 'edit'"
            label="Enterprise"
            disabled
          >
            企业
          </el-radio>
          <el-radio
            v-if="type !== 'edit' || form.orgType !== 'Enterprise'"
            label="Company"
            :disabled="radioDisabled('Company')"
          >
            公司
          </el-radio>
          <el-radio
            v-if="type !== 'edit' || form.orgType !== 'Enterprise'"
            label="Department"
            :disabled="radioDisabled('Department')"
          >
            部门
          </el-radio>
          <el-radio
            v-if="type !== 'edit' || form.orgType !== 'Enterprise'"
            label="Group"
            :disabled="radioDisabled('Group')"
          >
            小组
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="负责人"
        prop="leaders"
      >
        <el-col>
          <el-select
            v-model="form.leaders"
            v-loadmore="loadMoreLeader"
            multiple
            filterable
            :multiple-limit="10"
            placeholder="请选择或输入员工姓名/手机号搜索"
          >
            <el-option
              v-for="(item1, k) in leaderList"
              :key="k"
              :label="
                item1.name !== '空缺' ? item1.name + '（' + item1.phonenum + '）' : item1.name
              "
              :value="item1.userId"
            />
            <div
              v-show="loadLeader"
              class="addressLoading"
            >
              <i class="el-icon-loading" />
            </div>
            <div
              v-show="noMoreLeader"
              style="text-align: center; font-size:14px;color: #606266;"
            >
              没有更多了
            </div>
          </el-select>
        </el-col>
      </el-form-item>

      <el-form-item
        label="描述"
        prop="remark"
      >
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="2"
          placeholder="请输入描述"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <span
      v-if="type === 'create'"
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="medium"
        @click="submitAndCreate"
      >完成并继续新建</el-button>
      <el-button
        type="primary"
        size="medium"
        @click="submit"
      >完成</el-button>
    </span>
    <span
      v-else
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
import { getOrgTreeSimple, editOrg, createOrg, getUserWorkList } from '@/api/org/org'
import { defaultAttrs, noneItemAttrs } from '@/components/common-form/config'
const radioDisable = ['Group', 'Department', 'Company', 'Enterprise']
export default {
  name: 'OrgEdit',
  components: {
    elTreeSelect: () => import('@/components/elTreeSelect/elTreeSelect')
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isrules: false,
      type: 'create',
      form: {
        orgType: '',
        parentOrgId: ''
      },
      column: {
        span: 20,
        prop: 'orgId',
        itemType: 'treeSelect',
        label: '请选择上级组织',
        required: true,
        offset: 2,
        props: {
          selectParams: {
            placeholder: '请选择上级组织',
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
      },
      rules: {
        orgName: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
        parentOrgId: [{ required: true, message: '请选择上级组织', trigger: 'change' }],
        orgType: [{ required: true, message: '请选择组织类型', trigger: 'change' }],
        orgCode: [{ required: true, message: '请输入组织编码', trigger: 'blur' }],
        leaders: [{ required: true, message: '请选择负责人', trigger: 'change' }]
      },

      orgTree: [],
      leaderList: [],
      loadLeader: false,
      noMoreLeader: false,
      leaderPageNo: 1
    }
  },
  async created() {
    await this.loadOrgTree()
    getUserWorkList({ pageNo: this.leaderPageNo, pageSize: 1000 }).then((res) => {
      this.leaderList = res.data
      this.leaderList.splice(0, 0, {
        userId: '',
        name: '空缺',
        workNo: ''
      })
      this.leaderPageNo += 1
    })
  },
  methods: {
    radioDisabled(data) {
      if (!_.isEmpty(this.form.id) || this.form.parentOrgId) {
        // 父级的组织类型的次序
        const parentOrg = this.findOrg(this.form.parentOrgId)
        let parentOrgType = parentOrg.orgType
        const parentIndex = _.findIndex(radioDisable, (item) => {
          return item === parentOrgType
        })
        let dataIndex = _.findIndex(radioDisable, (item) => {
          return item === data
        })
        // 下级组织的组织类型不能大于上级组织翻译成以下意义：
        // 可选的当前组织组织类型必须比子级的最大的组织类型要大
        let isMoreThenSon = parentIndex >= dataIndex
        let flag = !isMoreThenSon
        if (this.type === 'edit') {
          let indexList = []
          _.each(this.form.children, (item) => {
            indexList.push(
              _.findIndex(radioDisable, (radioItem) => {
                return radioItem === item.orgType
              })
            )
          })
          let maxNumber = Math.max(...indexList)
          if (dataIndex < maxNumber) {
            flag = true
          }
        }
        return flag
      }
    },
    nodeClick(data) {
      this.form.parentOrgType = data.orgType
    },
    itemAttrs(column) {
      const copy = { ...defaultAttrs[column.itemType] }
      for (const key in column) {
        if (!noneItemAttrs.includes(key)) {
          copy[key] = column[key]
        }
      }
      return copy
    },

    loadMoreLeader() {
      if (this.loadLeader || this.noMoreLeader) return
      this.loadLeader = true
      getUserWorkList({ pageNo: this.leaderPageNo, pageSize: 100 }).then((res) => {
        if (res.data.length > 0) {
          this.leaderList.push(...res.data)
          this.leaderPageNo += 1
          this.loadLeader = false
        } else {
          this.noMoreLeader = true
          this.loadLeader = false
        }
      })
    },
    submitAndCreate() {
      this.$refs.ruleForm.validate((valid, obj) => {
        if (valid) {
          let form = _.cloneDeep(this.form)
          form.leaders = _.map(form.leaders, (item) => ({ userId: item }))
          createOrg(form).then(() => {
            this.$message.success('创建成功')
            this.form = { orgType: '' }
            this.$refs.ruleForm.clearValidate()
            this.loadOrgTree()
            this.$emit('refresh')
            this.$nextTick(() => {
              this.$refs.ruleForm.clearValidate(...arguments)
            })
          })
        } else {
          this.$message.error(obj[Object.keys(obj)[0]][0].message)
          return false
        }
      })
    },
    submit() {
      this.$refs.ruleForm.validate((valid, obj) => {
        if (valid) {
          let form = _.cloneDeep(this.form)
          form.leaders = _.map(form.leaders, (item) => ({ userId: item }))
          if (this.type !== 'edit') {
            createOrg(form).then(() => {
              this.$message.success('创建成功')
              this.$emit('refresh')
              this.$emit('changevisible', false)
            })
          } else {
            this.editFun(form)
          }
        } else {
          this.$message.error(obj[Object.keys(obj)[0]][0].message)
          return false
        }
      })
    },
    editFun(form) {
      editOrg(form).then(() => {
        this.$message.success('修改成功')
        this.$emit('refresh')
        this.$emit('changevisible', false)
      })
    },
    create() {
      this.type = 'create'
      this.$emit('changevisible', true)
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate(...arguments)
      })
    },
    async createChild(row) {
      this.type = 'createChild'
      await this.loadOrgTree()
      this.form.leaders = _.map(this.form.leaders, 'userId')
      this.form.parentOrgId = row.id
      this.form.parentOrgType = _.cloneDeep(row.orgType)
      this.$emit('changevisible', true)
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate(...arguments)
      })
    },
    async edit(row) {
      this.type = 'edit'
      this.form = _.cloneDeep(row)
      this.form.parentOrgType = _.cloneDeep(this.findOrg(row.parentOrgId)).orgType
      this.form.leaders = _.map(this.form.leaders, 'userId')
      await this.loadOrgTree()
      this.$emit('changevisible', true)
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate(...arguments)
      })
    },
    async loadOrgTree() {
      let res = await getOrgTreeSimple({ parentOrgId: 0 })
      this.orgTree = res
      const treeData = this.type === 'edit' ? this.filterHeightOrg(res) : res
      this.column.props.treeParams.data = treeData
    },
    // 获取到比自己要高的父组织的结构
    filterHeightOrg(res) {
      const currentIndex = _.findIndex(radioDisable, (item) => {
        return item === this.form.orgType
      })
      let tempTree = _.cloneDeep(res)
      // 给比自己大的每一项加一个标识
      const loop = function(tree) {
        _.each(tree, (item) => {
          if (!_.isEmpty(item.children)) {
            loop(item.children)
          }
          const dataIndex = _.findIndex(radioDisable, (radioItem) => {
            return radioItem === item.orgType
          })
          // 父级组织类型 >= 当前组织的类型
          if (dataIndex >= currentIndex) {
            item.isShow = true
          }
          return tree
        })
      }
      loop(tempTree)
      let targetTree = this.deal(tempTree, (node) => node.isShow)
      return targetTree
    },
    // 再次递归，把这些isShow为true的过滤出来
    deal(nodes, predicate) {
      // 如果已经没有节点了，结束递归
      if (!(nodes && nodes.length)) {
        return []
      }
      const newChildren = []
      for (const node of nodes) {
        if (predicate(node)) {
          // 如果节点符合条件，直接加入新的节点集
          newChildren.push(node)
          node.children = this.deal(node.children, predicate)
        } else {
          // 如果当前节点不符合条件，递归过滤子节点，
          // 把符合条件的子节点提升上来，并入新节点集
          newChildren.push(...this.deal(node.children, predicate))
        }
      }
      return newChildren
    },
    findOrg(id) {
      let org = {}
      function deep(arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].orgId === id) {
            org = arr[i]
            return
          }
          if (arr[i].children && arr[i].children.length > 0) {
            deep(arr[i].children)
          }
        }
      }
      deep(this.orgTree)
      return org
    },
    handleClose() {
      this.form = { orgType: '', parentOrgId: '' }
      this.$emit('changevisible', false)
    }
  }
}
</script>
<style>
.isrules .el-input__inner {
  border: 1px solid #f56c6c;
}
.isrules {
  position: relative;
}
.isrules:after {
  position: absolute;
  top: 28px;
  font-size: 12px;
  left: 1px;
  color: #f56c6c;

  content: '请选择负责人';
}
</style>
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
/deep/ .el-select {
  width: 100%;
}
</style>
