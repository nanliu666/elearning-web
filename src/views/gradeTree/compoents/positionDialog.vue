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
        <div>
          <avue-form
            ref="form"
            v-model="form"
            :option="option"
          />
        </div>
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
            @click="handleModity"
          >
            保存
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { postV1Job, putV1Job, getCategoryList, getJobList } from '@/api/organize/position'

export default {
  name: 'PositionDialog',
  props: {
    isEdit: {
      type: Boolean
    },
    orgTree: {
      type: Array,
      default: function() {
        return []
      }
    },
    orgData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    row: {
      type: Object,
      default: function() {
        return {}
      }
    },
    title: {
      type: String,
      default: function() {
        return ''
      }
    },

    dialogVisible: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    treechecked: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    // const validateTree = (rule, value, callback) => {
    //   if (!value.length) {
    //     callback(new Error('请选择关联岗位'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      orgId: '',
      firstLoad: true,
      initOrgId: '',
      loading: false,
      isSingle: true,
      form: {
        jobName: '', //岗位名称
        categoryId: '', //岗位类别id
        requirement: '', // 岗位要求
        parentId: '', //所属岗位
        duty: '', //岗位职责
        jobId: '' //岗位编码
      },
      option: {
        menuBtn: false,
        labelPosition: 'top',
        size: 'medium',
        column: [
          {
            label: '岗位名称',
            prop: 'jobName',
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
            label: '岗位类别',
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
            label: '岗位编码',
            prop: 'jobId',
            type: 'input',
            row: true,
            display: false,
            span: 24,
            disabled: true,
            placeholder: '请输入'
          },
          {
            label: '岗位职责',
            prop: 'duty',
            type: 'textarea',
            row: true,
            span: 24,
            maxlength: '1000',
            showWordLimit: true,
            placeholder: '请输入'
          },
          {
            label: '岗位要求',
            prop: 'requirement',
            type: 'textarea',
            row: true,
            span: 24,
            maxlength: '1000',
            showWordLimit: true,
            placeholder: '请输入'
          }
        ]
      },
      dialog: true
    }
  },
  computed: {},
  watch: {
    'form.orgId': {
      handler: async function(val, old) {
        if (val == old) return
        if (val.length > 0) {
          this.option.column[3].placeholder = '请选择'
          if (!this.firstLoad) {
            this.loading = true
            let jod = await this.getJod(val)
            if (this.form.orgId !== this.initOrgId) {
              this.form.parentId = ''
              this.initOrgId = ''
            }
            jod = jod.filter((it) => {
              if (this.row.id !== it.jobId && this.isEdit) {
                return it
              } else {
                return it
              }
            })
            jod = jod.filter((it) => {
              if (this.orgData.id !== it.jobId && this.isEdit) {
                return it
              } else {
                return it
              }
            })

            jod.map((it) => {
              it.label = it.jobName
              it.value = it.jobId
            })
            this.option.column[3].dicData = jod
            this.loading = false
          }
        } else {
          this.option.column[3].dicData = []
          this.form.parentId = ''
        }
      },
      deep: true //对象内部的属性监听，也叫深度监听
    },
    dialog: {
      handler: function() {
        this.$emit('update:dialogVisible', this.dialog)
      }
    },
    dialogVisible: {
      handler: function(val) {
        this.dialog = val
      },
      deep: true //对象内部的属性监听，也叫深度监听
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    isEdit: {
      handler(val) {
        if (val) {
          this.option.column[2].display = true
        }
      },
      immediate: true
    },
    row: {
      handler: async function(val) {
        if (!this.orgData.name) {
          await this.init()
        }
        this.initOrgId = val.orgId
        if (val.jobId && this.isEdit) {
          let { jobName, categoryId, duty, requirement, parentId, jobId } = { ...val }
          let form = {
            jobName,
            categoryId,
            duty,
            parentId,
            requirement,
            jobId
          }
          // setTimeout(() => {
          this.form = Object.assign(this.form, form)
          // }, 500)
        } else if (val.jobId && !this.isEdit) {
          let { orgId, jobId } = { ...val }
          let form = {
            parentId: jobId,
            orgId
          }
          // setTimeout(() => {
          this.option.column[3].disabled = true
          this.option.column[2].disabled = true
          this.form = Object.assign(this.form, form)
          // }, 500)
        }
      },
      immediate: true
    },
    orgData: {
      handler: async function(val) {
        if (val.name) {
          await this.init()
        }
        this.initOrgId = val.orgId
        if (this.isEdit && val.name) {
          let jobName = val.name
          let categoryId = val.categoryId
          let requirement = val.requirement
          let duty = val.duty
          let jobId = val.jobId
          // this.orgId = orgId
          let parentId = val.parentJobId
          // parentId = val.parentJobId
          // jobName: '', 岗位名称   categoryId: '',岗位类别id   remark: '', 描述  parentId: '', 所属岗位   orgId: [] 所属组织
          // if (orgId) {
          //   this.form.orgId = orgId
          // }
          let form = {
            jobName,
            categoryId,
            requirement,
            parentId,
            duty,
            jobId
          }
          setTimeout(() => {
            this.form = Object.assign(this.form, form)
          }, 500)
        } else if (!this.isEdit && val.name) {
          let orgId = val.orgId
          if (orgId) {
            setTimeout(() => {
              this.form.orgId = orgId
              this.option.column[2].disabled = true
            }, 500)
          }
          if (val.type === 'Job') {
            let parentId = ''
            if (val.type === 'Job') {
              parentId = val.id
            } else {
              parentId = val.parentJobId
            }
            this.form.parentId = parentId
            this.option.column[3].disabled = true
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  async created() {},
  async mounted() {},

  methods: {
    async init() {
      this.loading = true
      await this.getCategory()
      await this.getTree()
      let jod = await this.getJod(this.form.orgId)
      jod.map((it) => {
        it.label = it.jobName
        it.value = it.jobId
      })
      this.option.column[3].dicData = jod
      this.loading = false
      this.firstLoad = false
    },
    /**
     * @author guanfenda
     * @desc 获取上级岗位数据
     *
     */

    getJod(orgId = '0') {
      let params = {
        jobName: '',
        orgId: orgId
      }
      return new Promise((resolve, reject) => {
        getJobList(params)
          .then((res) => {
            return resolve(res)
          })
          .catch(() => {
            return reject()
          })
      })
    },
    /***
     *@ author guanfenda
     * @desc 获取所属组织数据
     *
     */
    getTree() {
      // let { parentId } = { ...this.orgData }
      // let params = {
      //   parentOrgId: parentId
      // }
      return new Promise((resolve) => {
        this.option.column[2].dicData = []
        resolve()
      })
    },
    /***
     * @author guanfenda
     * @desc 获取岗位类别
     *
     * @returns {Promise<unknown>}
     */
    getCategory() {
      let params = {
        categoryName: ''
      }

      return new Promise((resolve, reject) => {
        getCategoryList(params)
          .then((res) => {
            res.map((it) => {
              it.label = it.categoryName
              it.value = it.categoryId
            })
            this.option.column[1].dicData = res
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    reset() {
      if (this.orgData.orgId || this.row.orgId) {
        let form = JSON.parse(JSON.stringify(this.form))
        let { orgId, parentId } = { ...form }
        this.$refs.form.resetFields()
        let params = { orgId, parentId }
        this.form = Object.assign(this.form, params)
      } else {
        this.$refs.form.resetFields()
      }
    },
    onContinue() {
      this.onClickSave({ again: true }, this.reset)
    },
    /**
     * @author guanfenda
     * @desc 修改岗位
     * @returns {Generator<*, void, *>}
     */

    handleModity() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let { jobName, categoryId, requirement, parentId, duty } = { ...this.form }

          let params = {
            jobId: this.row.jobId || this.orgData.id,
            jobName,
            categoryId,
            requirement,
            parentId,
            duty
          }
          params.parentId = params.parentId ? params.parentId : '0'
          this.loading = true
          putV1Job(params)
            .then(() => {
              this.loading = false
              this.$message.success('修改成功')
              this.$emit('onsubmit', params)
              this.$emit('update:dialogVisible', false)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    /***
     *  @author guanfenda
     *  @desc 添加岗位
     *
     */
    onClickSave({ again = false }, reset) {
      this.$refs.form.validate((vaild) => {
        if (vaild) {
          // this.$message.success(JSON.stringify(this.obj0))
          let { jobName, categoryId, requirement, parentId, duty } = { ...this.form }
          let params = {
            jobName,
            categoryId,
            requirement,
            parentId,
            duty
          }
          params.parentId = params.parentId ? params.parentId : '0'
          this.loading = true
          postV1Job(params)
            .then(() => {
              this.loading = false
              this.$message.success('保存成功')
              this.$emit('onsubmit', params)

              if (!again) {
                this.$emit('update:dialogVisible', false)
              } else {
                reset()
              }
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    /***
     *  @author guanfenda
     *  @desc 退出编辑
     *
     */
    handleClose() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style scoped>
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
