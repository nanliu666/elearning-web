<template>
  <el-dialog
    :title="form.roleId ? '编辑角色' : '新建角色'"
    :visible.sync="roleVisible"
    width="500px"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :before-close="onClose"
    @opened="onOpened"
  >
    <div v-loading="loading">
      <commonForm
        ref="form"
        :model="form"
        :columns="columns"
      >
        <template
          slot="jobs"
          slot-scope="scope"
        >
          <treeSelect
            v-model="form.jobs"
            :option="scope.column"
            :dic-data="jobDicData"
          />
        </template>
        <template slot="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入描述"
          >
          </el-input>
        </template>
      </commonForm>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          v-if="form.roleId"
          size="medium"
          @click="onClose"
        >
          取消
        </el-button>
        <el-button
          v-else
          size="medium"
          @click="onContinue"
        >
          保存并继续添加
        </el-button>
        <el-button
          type="primary"
          size="medium"
          @click="onClickSave(onClose)"
        >
          保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import treeSelect from '@/components/treeSelect/treeSelect'
import { createRole, getRelativeJobs, updateRole } from '../../../api/system/role'

export default {
  name: 'RoleEdit',
  components: {
    treeSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    jobs: {
      type: Array,
      default: () => []
    },
    positions: {
      type: Array,
      default: () => []
    },
    jobProps: {
      type: Object,
      default: () => {
        return {}
      }
    },
    positionProps: {
      type: Object,
      default: () => {
        return {}
      }
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },
    categoryId: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    const JOBS_COLUMN = {
      prop: 'jobs',
      itemType: 'slot',
      placeholder: '请选择关联职位',
      span: 24,
      label: '关联职位',
      required: true
    }
    const BASE_COLUMNS = [
      {
        prop: 'roleName',
        itemType: 'input',
        label: '角色名称',
        required: true
      },
      {
        prop: 'type',
        itemType: 'radio',
        label: '关联类型',
        span: 24,
        required: true,
        options: [
          {
            label: '关联职位',
            value: 'Job'
          },
          {
            label: '无关联',
            value: 'No'
          }
        ]
      },
      {
        prop: 'remark',
        itemType: 'slot',
        label: '描述',
        span: 24
      }
    ]
    return {
      jobColumn: JOBS_COLUMN,
      columns: BASE_COLUMNS,
      loading: false,
      roleVisible: true,
      form: {
        roleId: '',
        roleName: '',
        type: '',
        remark: '',
        positions: '',
        jobs: []
      },
      jobDicData: []
    }
  },
  watch: {
    row: {
      handler: function(newVal) {
        let { roleId, roleName, type, remark, positions, jobs } = { ...newVal }
        let newpositions = []
        if (positions) {
          positions.map((it) => {
            newpositions.push(it.positionId)
          })
        }

        positions = newpositions[0]
        let newjobs = []
        if (jobs) {
          jobs.map((it) => {
            newjobs.push(it.jobId)
          })
        }

        jobs = newjobs
        this.form = {
          roleId,
          roleName,
          type,
          remark,
          positions,
          jobs
        }
      },
      immediate: true,
      deep: true
    },
    roleVisible: {
      handler: function() {
        this.$emit('update:visible', this.roleVisible)
      }
    },
    'form.type': {
      handler(val) {
        this.form.type = val
        if (val === 'Job') {
          this.columns.splice(2, 0, this.jobColumn)
        } else if (val === 'No') {
          let index = _.findIndex(this.columns, (item) => {
            return item.prop === 'jobs'
          })
          if (index > -1) {
            this.columns.splice(index, 1)
          }
        }
      },
      immediate: true,
      deep: true
    },
    'form.jobs': {
      // 清空关联职位的校验
      handler() {
        this.$refs['form'].validateField('jobs', () => {})
      },
      deep: true
    }
  },
  mounted() {
    this.getJobsFunc()
  },
  methods: {
    getJobsFunc() {
      let params = {
        jobName: '',
        pageNo: 1,
        pageSize: 100
      }
      getRelativeJobs(params).then((res) => {
        let targetData = res.data.map((item) => {
          return {
            label: item.jobName,
            id: item.jobId,
            roles: item.roleId
          }
        })
        this.jobDicData = targetData
      })
    },
    filterTree(data) {
      data.map((it) => {
        if (!(it.children && it.children.length > 0) && it.orgType) {
          it.disabled = true
        }
        if (it.children && it.children.length > 0) {
          this.filterTree(it.children)
        }
      })
    },
    jobFilter(arr, data, data2) {
      arr.filter((item) => {
        const obj = {
          children: []
        }
        const obj2 = {
          children: []
        }
        if (item.jobs && item.jobs.length > 0) {
          item.jobs.forEach((item) => {
            const job = {
              label: item.jobName,
              id: item.jobId,
              roles: item.roles
            }
            obj.children.push(job)
            if (!(item.roles && item.roles.length > 0)) {
              obj2.children.push(job)
            } else {
              job.disabled = true
            }
            if (item.roles && item.roles.length > 0 && item.roles[0].roleId === this.row.roleId) {
              job.disabled = false
              obj2.children.push(job)
            }
          })
        }
        if (item.orgType) {
          obj.label = item.orgName
          obj.id = item.orgId
          obj2.label = item.orgName
          obj2.id = item.orgId
          obj2.orgType = item.orgType
          if (item.children && item.children.length > 0) {
            this.jobFilter(item.children, obj.children, obj2.children)
          } else {
            obj.disabled = true
          }
        }
        data.push(obj)
        data2.push(obj2)
      })
    },
    recursion(data, roleId) {
      data.map((it) => {
        if (it.roles && it.roles.length > 0 && it.roles[0].roleId === roleId) {
          it.disabled = false
        }
        if (it.children && it.children.length > 0) {
          this.recursion(it.children, roleId)
        }
      })
    },

    findObject(column, key) {
      return column.find((item) => item.prop === key)
    },

    onOpened() {
      if (this.row.roleId) {
        this.$nextTick(() => {
          const { roleId, roleName, type, remark, jobs, positions } = this.row
          const form = this.form
          form.roleId = roleId
          form.roleName = roleName
          form.type = type
          form.remark = remark
          if (jobs && jobs.length > 0) {
            form.jobs = jobs.map((it) => it.jobId)
          }
          if (positions && positions.length > 0) {
            form.positions = positions[0].positionId
          }
        })
      }
    },

    // 保存并继续添加
    onContinue() {
      this.onClickSave(this.clearForm)
    },
    // 点击保存
    onClickSave(callback) {
      this.$refs.form.validate((vaild) => {
        if (vaild) {
          this.form.roleId ? this.updateFunc() : this.createFunc(callback)
        }
      })
    },
    //新建角色
    createFunc(callback) {
      let positions = []

      this.form.positions && positions.push(this.form.positions)
      const params = {
        ...this.form,
        positions,
        jobs: this.form.jobs,
        categoryId: this.categoryId
      }
      this.loading = true
      createRole(params)
        .then(() => {
          this.loading = false
          this.$message.success('新建角色成功')
          this.$emit('reload')
          callback()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 更新角色
    updateFunc() {
      let positions = []
      this.form.positions && positions.push(this.form.positions)
      const params = {
        ...this.form,
        positions,
        jobs: this.form.jobs,
        categoryId: this.categoryId
      }
      this.loading = true
      updateRole(params)
        .then(() => {
          this.loading = false
          this.$message.success('编辑角色成功')
          this.$emit('reload')
          this.onClose()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 关闭弹窗
    onClose() {
      this.roleVisible = false
    },

    // 清空表单
    clearForm() {
      this.$refs.form.resetForm()
      this.form.roleId = ''
      this.form.positions = []
      this.form.jobs = []
    },

    // 清除avue表单组件防重提交
    handleSubmit(form, done) {
      done()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__header {
  padding: 16px 0;
  margin: 0 24px;
  border-bottom: 1px solid rgba(208, 211, 214, 0.44);
  font-size: 18px;
  color: #202940;
  line-height: 24px;
}

/deep/ .el-dialog__body {
  padding: 24px;
}

/deep/ .el-dialog__footer {
  padding: 0px 24px 24px;
}

/deep/ .el-form-item__label {
  line-height: 20px;
  font-size: 14px;
  color: #0f0000;
}

/deep/ .el-form-item {
  margin-bottom: 24px;
}
.dialog-footer {
  text-align: right;
}

/deep/ .is-error {
  .tree-button {
    border-color: #f56c6c;
  }
}

/deep/ .el-radio {
  margin-right: 20px;
}
/deep/ .el-input__icon .el-input__validateIcon .el-icon-circle-close {
  display: none;
}
</style>
