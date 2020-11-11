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
          <commonForm
            ref="form"
            :model="form"
            :columns="columns"
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
import { postV1Job, putV1Job, getCategoryList } from '@/api/organize/position'

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
      columns: [
        {
          span: 20,
          offset: 2,
          prop: 'jobName',
          itemType: 'input',
          type: 'input',
          label: '岗位名称',
          props: {},
          required: true
        },
        {
          span: 20,
          offset: 2,
          prop: 'categoryId',
          itemType: 'select',
          options: [],
          type: 'select',
          label: '岗位类别',
          props: {},
          required: true
        },
        {
          span: 20,
          offset: 2,
          prop: 'jobId',
          itemType: 'input',
          options: [],
          disabled: true,
          display: false,
          type: 'input',
          label: '岗位编码',
          props: {}
        },
        {
          span: 20,
          offset: 2,
          prop: 'duty',
          itemType: 'input',
          type: 'textarea',
          label: '岗位职责',
          props: {},
          rows: 3,
          maxlength: '1000'
        },
        {
          span: 20,
          offset: 2,
          prop: 'requirement',
          itemType: 'input',
          type: 'textarea',
          label: '岗位要求',
          rows: 3,
          props: {},
          maxlength: '1000'
        }
      ],
      dialog: true
    }
  },
  computed: {},
  watch: {
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
        if (!val) {
          this.columns = this.columns.filter((it) => it.prop !== 'jobId')
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
          this.form = Object.assign(this.form, form)
        } else if (val.jobId && !this.isEdit) {
          let { orgId, jobId } = { ...val }
          let form = {
            parentId: jobId,
            orgId
          }
          this.form = Object.assign(this.form, form)
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
          let parentId = val.parentJobId
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
              this.columns = this.columns.filter((it) => it.prop !== 'jobId')
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
      this.loading = false
      this.firstLoad = false
    },
    /***
     *@ author guanfenda
     * @desc 获取所属组织数据
     *
     */
    getTree() {
      return new Promise((resolve) => {
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
            this.columns.find((it) => it.prop === 'categoryId').options = res
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    reset() {
      this.$refs.form.resetFields()
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
      this.$refs.form.validate().then((res) => {
        if (!res) return
        let { jobName, categoryId, requirement, duty, parentId, jobId } = this.form
        let params = {
          jobId: jobId || this.orgData.id,
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
      })
    },
    /***
     *  @author guanfenda
     *  @desc 添加岗位
     *
     */
    onClickSave({ again = false }, reset) {
      this.$refs.form.validate().then((res) => {
        if (!res) return
        let { jobName, categoryId, requirement, parentId, duty } = this.form
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
