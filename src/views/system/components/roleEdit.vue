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
import { createRole, updateRole } from '../../../api/system/role'

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
        span: 24,
        maxlength: 32,
        required: true
      },
      {
        prop: 'remark',
        itemType: 'slot',
        label: '描述',
        maxlength: 200,
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
        remark: ''
      },
      jobDicData: []
    }
  },
  watch: {
    row: {
      handler: function(newVal) {
        let { roleId, roleName, remark } = { ...newVal }
        this.form = {
          roleId,
          roleName,
          remark
        }
      },
      immediate: true,
      deep: true
    },
    roleVisible: {
      handler: function() {
        this.$emit('update:visible', this.roleVisible)
      }
    }
  },
  mounted() {},
  methods: {
    onOpened() {
      if (this.row.roleId) {
        this.$nextTick(() => {
          const { roleId, roleName, remark } = this.row
          const form = this.form
          form.roleId = roleId
          form.roleName = roleName
          form.remark = remark
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
      const params = {
        ...this.form,
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
