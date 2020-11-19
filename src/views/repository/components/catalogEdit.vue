<template>
  <el-dialog
    v-loading="loading"
    :title="type === 'create' ? '新建目录' : type === 'createChild' ? '新建子目录' : '编辑目录'"
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
        label="目录名称"
        prop="orgName"
      >
        <el-input
          v-model.trim="form.orgName"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="上级目录">
        <el-col>
          <el-select
            v-model="form.highlightLevel"
            v-loadmore="loadMoreLeader"
            multiple
            filterable
            :multiple-limit="10"
            placeholder="请选择或输入上级目录名称搜索"
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
          <div class="select-tips">
            可通过选择上级目录为其构建子目录
          </div>
        </el-col>
      </el-form-item>
    </el-form>
    <span
      v-if="type === 'create'"
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        size="medium"
        @click="submit"
      >完成</el-button>
      <el-button
        size="medium"
        @click="submitAndCreate"
      >完成并创建课程</el-button>
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

export default {
  name: 'CatalogEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type: 'create',
      radioDisable: {
        Company: false,
        Department: false,
        Group: false
      },
      form: {
        orgType: '',
        highlightLevel: ''
      },
      parentOrgIdLabel: '',
      rules: {
        orgName: [{ required: true, message: '请输入目录名称', trigger: 'blur' }]
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
    loadOrgTree() {
      getOrgTreeSimple({ parentOrgId: 0 }).then((res) => {
        this.orgTree = res
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

    submitAndCreate() {
      // this.$refs.ruleForm.validate((valid, obj) => {
      //   if (valid) {
      //   } else {
      //     this.$message.error(obj[Object.keys(obj)[0]][0].message)
      //     return false
      //   }
      // })
    },
    submit() {
      this.$refs.ruleForm.validate((valid, obj) => {
        if (valid) {
          if (this.type !== 'edit') {
            this.loading = true
            createOrg(this.form)
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
            this.loading = true
            editOrg(this.form)
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
      this.loadRadio()
      this.$emit('changevisible', true)
      this.loadOrgTree()
    },
    edit(row) {
      this.type = 'edit'
      let leadersIdList = []
      if (row.leaders.length > 0) {
        //有负责人数据
        leadersIdList = this.turnToLevelArray(row.leaders)
        this.allUserIdArr = JSON.parse(JSON.stringify(leadersIdList))
      } else {
        this.allUserIdArr = [{ level: 1, userId: [] }] //初始化责任人内容
      }
      this.form = JSON.parse(JSON.stringify(row))
      this.parentOrgIdLabel = this.findOrg(row.parentOrgId).orgName
      this.form.parentOrgType = this.findOrg(row.parentOrgId).orgType
      this.loadRadio(true)
      this.$emit('changevisible', true)
      this.loadOrgTree()
    },
    //单个uesr数据转换成按级别分的数组
    turnToLevelArray(data = []) {
      let responsibleList = []
      const maxLevel = Math.max.apply(
        Math,
        data.map((item) => item.level)
      )
      for (var j = 0; j < maxLevel; j++) {
        responsibleList.push({
          level: j + 1,
          userIdArr: []
        })
      }
      data.map((item) => {
        responsibleList[item.level - 1]['userIdArr'].push(item.userId)
      })
      return responsibleList
    },

    //责任人可搜索条件
    searchFilter(val) {
      if (val) {
        //val存在
        this.leaderListCopy = JSON.parse(JSON.stringify(this.leaderList))
        this.leaderList = this.leaderListCopy.filter((item) => {
          if (
            !!~item.label.indexOf(val) ||
            !!~item.label.toUpperCase().indexOf(val.toUpperCase())
          ) {
            return true
          }
        })
      }
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
      this.radioDisable = {
        Company: false,
        Department: false,
        Group: false
      }
      this.$emit('changevisible', false)
    },
    loadRadio(noChangeType) {
      this.radioDisable = this.$options.data().radioDisable
      if (this.form.parentOrgType === 'Enterprise') {
        if (!noChangeType) this.form.orgType = 'Company'
      } else if (this.form.parentOrgType === 'Company') {
        if (!noChangeType) this.form.orgType = 'Department'
      } else if (this.form.parentOrgType === 'Department') {
        this.radioDisable.Company = true
        if (!noChangeType) this.form.orgType = 'Department'
      } else if (this.form.parentOrgType === 'Group') {
        this.radioDisable.Company = true
        this.radioDisable.Department = true
        if (!noChangeType) this.form.orgType = 'Group'
      }
    },
    handleOrgNodeClick(data) {
      if (data !== undefined) {
        this.form.parentOrgId = data.orgId
        this.parentOrgIdLabel = data.orgName
        this.form.parentOrgType = data.orgType
        this.loadRadio()
        if (this.type !== 'createChild') this.$refs.parentOrgId && this.$refs.parentOrgId.blur()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.select-tips {
  font-size: 12px;
  color: #a1a8ae;
  margin-top: -8px;
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
/deep/ .el-form-item__label {
  padding: 0 0 0 0;
}
</style>
