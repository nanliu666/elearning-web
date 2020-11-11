<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialog"
      width="550px"
      :modal-append-to-body="false"
      :before-close="handleClose"
    >
      <div v-loading="loading">
        <commonForm
          ref="form"
          :model="form"
          :columns="columns"
        >
          <template slot="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="4"
              placeholder="请输入"
              maxlength="150"
              :show-word-limit="true"
            >
            </el-input>
          </template>
        </commonForm>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <div
          v-if="!isEdit"
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="medium"
            @click="onContinue"
          >
            保存并继续添加
          </el-button>
          <el-button
            type="primary"
            size="medium"
            @click="onClickSave"
          >
            保存
          </el-button>
        </div>
        <div
          v-else
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="medium"
            @click="handleClose"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="medium"
            @click="modity"
          >
            保存
          </el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { postCategoryDefine, putCategoryDefine } from '@/api/organize/position'

export default {
  name: 'CategoryDialog',
  props: {
    isEdit: {
      type: Boolean
    },
    data: {
      type: Object,
      default: function() {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type: Boolean
    }
  },
  data() {
    const BASE_COLUMNS = [
      {
        prop: 'name',
        itemType: 'input',
        placeholder: '请输入岗位类别名称',
        label: '岗位类别名称',
        span: 24,
        required: true
      },
      {
        prop: 'remark',
        itemType: 'slot',
        label: '描述',
        span: 24
      }
    ]
    return {
      loading: false,
      form: {
        name: '',
        remark: ''
      },
      columns: BASE_COLUMNS,
      dialog: true
    }
  },
  watch: {
    data: {
      handler: function(val) {
        this.form.name = val.name
        this.form.remark = val.remark
      },
      immediate: true,
      deep: true
    },
    dialog: {
      handler: function() {
        this.$emit('update:dialogVisible', false)
      }
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    onContinue() {
      this.onClickSave({ again: true }, this.reset)
      // this.dialog = false
    },
    modity() {
      let data = {
        ...this.data,
        ...this.form
      }
      this.loading = true
      putCategoryDefine(data)
        .then(() => {
          this.$message.success('修改成功')
          this.loading = false
          this.$emit('onSubmit', data)
          this.dialog = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    onClickSave({ again = false }, reset) {
      this.$refs.form.validate((vaild) => {
        if (vaild) {
          this.$emit('onsubmit')
          let params = {
            name: this.form.name.replace(/(^\s*)|(\s*$)/g, ''),
            remark: this.form.remark
          }
          this.loading = true
          postCategoryDefine(params)
            .then(() => {
              this.loading = false
              this.$message.success('新增成功')
              this.$emit('onSubmit', params)
              if (!again) {
                this.dialog = false
              } else {
                reset()
              }
            })
            .catch(() => {
              this.loading = false
              // this.dialog = false
            })
        }
      })
    },
    handleClose() {
      this.dialog = false
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
</style>
