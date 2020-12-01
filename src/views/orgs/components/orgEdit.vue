<template>
  <el-dialog
    v-loading="loading"
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
          maxlength="64"
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
        <!--        <el-select-->
        <!--          ref="parentOrgId"-->
        <!--          v-model="form.parentOrgId"-->
        <!--          placeholder="请选择"-->
        <!--          :disabled="type !== 'create'"-->
        <!--        >-->
        <!--          &lt;!&ndash; 注意：产品提出不可在编辑状态修改上级部门，只能在拖拽时修改上级部门 &ndash;&gt;-->
        <!--          &lt;!&ndash; :disabled="type === 'createChild'" &ndash;&gt;-->
        <!--          <el-option-->
        <!--            style="height: auto;padding:0"-->
        <!--            :value="form.parentOrgId"-->
        <!--            :label="parentOrgIdLabel"-->
        <!--          >-->
        <!--            <el-tree-->
        <!--              ref="orgTree"-->
        <!--              :data="orgTree"-->
        <!--              node-key="orgId"-->
        <!--              :props="{-->
        <!--                children: 'children',-->
        <!--                label: 'orgName'-->
        <!--              }"-->
        <!--              @node-click="handleOrgNodeClick"-->
        <!--            />-->
        <!--          </el-option>-->
        <!--        </el-select>-->
        <el-tree-select
          v-model="form.parentOrgId"
          :select-params="column.props && column.props.selectParams"
          :tree-params="column.props && column.props.treeParams"
          v-bind="itemAttrs(column)"
          :disabled="type === 'createChild'"
          :placeholder="column.placeholder ? column.placeholder : `请选择${column.label}`"
          @node-click="check"
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
            :disabled="radioDisable.indexOf(orgType) > 1"
          >
            公司
          </el-radio>
          <el-radio
            v-if="type !== 'edit' || form.orgType !== 'Enterprise'"
            label="Department"
            :disabled="radioDisable.indexOf(orgType) > 2"
          >
            部门
          </el-radio>
          <el-radio
            v-if="type !== 'edit' || form.orgType !== 'Enterprise'"
            label="Group"
            :disabled="radioDisable.indexOf(orgType) > 3"
          >
            小组
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="负责人"
        prop="true"
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
              :label="item1.name !== '空缺' ? item1.name + '（' + item1.workNo + '）' : item1.name"
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
      labelTxt: [
        '负责人',
        '二级负责人',
        '三级负责人',
        '四级负责人',
        '五级负责人',
        '六级负责人',
        '七级负责人',
        '八级负责人',
        '九级负责人',
        '十级负责人'
      ],
      type: 'create',
      // radioDisable: {
      //   Company: false,
      //   Department: false,
      //   Group: false
      // },
      orgType: '',
      radioDisable: ['Enterprise', 'Company', 'Department', 'Group'],
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
      allUserIdArr: [],
      parentOrgIdLabel: '',
      rules: {
        orgName: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
        parentOrgId: [{ required: true, message: '请选择上级组织', trigger: 'change' }],
        orgType: [{ required: true, message: '请选择组织类型', trigger: 'blur' }],
        orgCode: [{ required: true, message: '请输入组织编码', trigger: 'blur' }],
        leaders: [{ required: true, message: '请选择负责人', trigger: 'blur' }]
      },

      orgTree: [],
      leaderList: [],
      loadLeader: false,
      noMoreLeader: false,
      leaderPageNo: 1,
      loading: false
    }
  },
  created() {
    this.loadOrgTree()
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
    check(data) {
      this.orgType = data.orgType
      if (data.orgType !== 'Enterprise') {
        this.form.orgType = data.orgType
      } else {
        this.form.orgType = 'Company'
      }
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
    loadOrgTree() {
      getOrgTreeSimple({ parentOrgId: 0 }).then((res) => {
        this.orgTree = res
        this.column.props.treeParams.data = res
      })
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
    //编辑新建添加下级
    addSubLevel(index) {
      if (this.allUserIdArr.length >= 10) {
        this.$message.warning('添加失败，最多只能十级负责人！')
        return
      }
      this.allUserIdArr.splice(index + 1, 0, [
        {
          level: index + 2,
          userId: []
        }
      ])
      for (var i = index + 1; i < this.allUserIdArr.length; i++) {
        this.allUserIdArr[i].level = this.allUserIdArr[i].level + 1
      }
    },
    //删除负责人下级
    deleteSubLevel(index) {
      this.allUserIdArr.splice(index, 1)
      for (var i = index; i < this.allUserIdArr.length; i++) {
        this.allUserIdArr[i].level = this.allUserIdArr[i].level - 1
      }
    },
    submitAndCreate() {
      this.$refs.ruleForm.validate((valid, obj) => {
        if (valid) {
          this.loading = true
          let form = _.cloneDeep(this.form)
          form.leaders = _.map(form.leaders, (item) => ({ userId: item }))
          createOrg(form)
            .then(() => {
              this.$message.success('创建成功')
              this.form = { orgType: '' }
              this.allUserIdArr = [{ level: 1, userId: [] }] //初始化责任人内容
              this.$refs.ruleForm.clearValidate()
              this.loadOrgTree()
              this.parentOrgIdLabel = ''
              this.$emit('refresh')
              this.loading = false
            })
            .catch(() => {
              this.loading = false
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
          this.loading = true
          if (this.type !== 'edit') {
            createOrg(form)
              .then(() => {
                this.$message.success('创建成功')
                this.$emit('refresh')
                this.loading = false
                this.$emit('changevisible', false)
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            editOrg(form)
              .then(() => {
                this.$message.success('修改成功')
                this.$emit('refresh')
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
            this.$emit('changevisible', false)
          }
        } else {
          this.$message.error(obj[Object.keys(obj)[0]][0].message)
          return false
        }
      })
    },
    create() {
      this.type = 'create'
      this.parentOrgIdLabel = ''
      this.allUserIdArr = [{ level: 1, userId: [] }] //初始化责任人内容
      this.$emit('changevisible', true)
      this.orgTree[0] && this.handleOrgNodeClick()
    },
    createChild(row) {
      this.allUserIdArr = [{ level: 1, userId: [] }] //初始化责任人内容
      this.type = 'createChild'
      this.handleOrgNodeClick(row)
      // this.form.parentOrgId = row.parentOrgId
      this.form.parentOrgType = row.orgType
      // this.loadRadio()
      this.$emit('changevisible', true)
      this.loadOrgTree()
    },
    edit(row) {
      this.type = 'edit'
      this.form = JSON.parse(JSON.stringify(row))
      this.parentOrgIdLabel = this.findOrg(row.parentOrgId).orgName
      this.form.parentOrgType = this.findOrg(row.parentOrgId).orgType
      this.form.leaders = _.map(this.form.leaders, 'userId')
      // this.loadRadio(true)
      this.$emit('changevisible', true)
      this.loadOrgTree()
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
    },
    handleOrgNodeClick(data) {
      if (data !== undefined) {
        this.form.parentOrgId = data.orgId
        this.parentOrgIdLabel = data.orgName
        this.form.parentOrgType = data.orgType
        if (this.type !== 'createChild') this.$refs.parentOrgId && this.$refs.parentOrgId.blur()
      }
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
