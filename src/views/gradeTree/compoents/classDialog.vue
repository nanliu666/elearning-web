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
        <avue-form
          ref="form"
          v-model="form"
          :option="option"
        />
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
import { putCategory, addNewClass } from '@/api/organize/position'

export default {
  name: 'CatDialog',
  props: {
    isEdit: {
      type: Boolean
    },
    catList: {
      type: Array,
      default() {
        return []
      }
    },
    orgTree: {
      type: Object,
      default() {
        return {}
      }
    },
    current: {
      type: Object,
      default() {
        return {}
      }
    },
    dialogVisible: {
      type: Boolean
    },
    title: {
      type: String,
      default: '新建职级'
    }
  },
  data() {
    return {
      loading: false,
      form: {
        jobLevelName: '',
        remark: '',
        categoryId: '',
        jobLevelId: ''
      },
      option: {
        menuBtn: false,
        labelPosition: 'top',
        size: 'medium',
        column: [
          {
            label: '职级名称',
            prop: 'jobLevelName',
            type: 'input',
            row: true,
            span: 24,
            placeholder: '请输入',
            rules: [
              {
                required: true,
                message: '请输入',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '职级编码',
            prop: 'jobLevelId',
            type: 'input',
            row: true,
            display: false,
            span: 24,
            disabled: true,
            placeholder: '请输入'
          },
          {
            label: '分类',
            prop: 'categoryId',
            type: 'select',
            row: true,
            span: 24,
            rules: [
              {
                required: true,
                message: '请选择',
                trigger: 'blur'
              }
            ],
            dicData: ''
          },
          {
            label: '描述',
            prop: 'remark',
            maxlength: 200,
            type: 'textarea',
            row: true,
            showWordLimit: true,
            span: 24,
            placeholder: '请输入 '
          }
        ]
      },
      dialog: true
    }
  },
  computed: {
    classCatList() {
      return this.catList
    }
  },
  watch: {
    orgTree: {
      handler: function(val) {
        if (val.categoryId !== '' && this.isEdit) {
          let { jobLevelName, remark, jobLevelId, categoryId } = { ...val }
          let form = {
            jobLevelName,
            remark,
            categoryId,
            jobLevelId
          }
          // setTimeout(() => {
          this.form = Object.assign(this.form, form)
        }
      },
      deep: true,
      immediate: true
    },
    isEdit: {
      handler: function(val) {
        val && (this.option.column[1].display = true)
      },
      deep: true,
      immediate: true
    },
    // data: {
    //   handler: function(val) {
    //     this.form.name = val.name
    //     this.form.remark = val.remark
    //   },
    //   immediate: true,
    //   deep: true
    // },
    dialog: {
      handler: function() {
        this.$emit('update:dialogVisible', false)
      }
    }
  },
  mounted() {
    // console.log('this.catList->',this.catList)
    let catList = this.catList.slice(1)
    catList.map((it) => {
      it.label = it.categoryName
      it.value = it.categoryId
      it.disabled = false
    })

    this.option.column[2].dicData = catList
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
      putCategory(data)
        .then(() => {
          this.$message.success('修改成功')
          this.loading = false
          this.$emit('onsubmit')
          this.dialog = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    onClickSave({ again = false }, reset) {
      this.$refs.form.validate((vaild) => {
        if (vaild) {
          // this.$emit('onsubmit')
          let params = {
            ...this.form
          }
          // delete params['$categoryId']
          this.loading = true
          addNewClass(params)
            .then(() => {
              this.loading = false
              this.$message.success('新增成功')
              this.$emit('onsubmit')
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
