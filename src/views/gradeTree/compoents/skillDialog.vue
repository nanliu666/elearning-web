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
            type="primary"
            size="medium"
            @click="onClickSave"
          >
            完成
          </el-button>
          <el-button
            size="medium"
            @click="onContinue"
          >
            完成并继续新建
          </el-button>
        </div>
        <div
          v-else
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            size="medium"
            @click="handleModity"
          >
            保存
          </el-button>
          <el-button
            size="medium"
            @click="handleClose"
          >
            取消
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addSkill, editSkill, getJobList } from '@/api/gradeTree/skill'

export default {
  name: 'SkillDialog',
  props: {
    isEdit: {
      type: Boolean
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
        skillId: '', //技能编码
        skillName: '', //技能名称
        jobId: '', //岗位id
        duty: '', // 技能职责
        requirement: '' //技能要求
      },
      option: {
        menuBtn: false,
        labelPosition: 'top',
        size: 'medium',
        column: [
          {
            label: '技能名称',
            prop: 'skillName',
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
            label: '技能编码',
            prop: 'skillId',
            type: 'input',
            row: true,
            display: false,
            span: 24,
            disabled: true,
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
            label: '岗位',
            prop: 'jobId',
            type: 'select',
            row: true,
            placeholder: '请选择',
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
            label: '技能职责',
            prop: 'duty',
            type: 'textarea',
            row: true,
            span: 24,
            placeholder: '请输入',
            maxlength: 1000,
            showWordLimit: true
          },
          {
            label: '技能要求',
            prop: 'requirement',
            type: 'textarea',
            row: true,
            span: 24,
            placeholder: '请输入',
            maxlength: 1000,
            showWordLimit: true
          }
        ]
      },
      dialog: true
    }
  },
  computed: {},
  watch: {
    'form.jobId': {
      handler: async function(val, old) {
        if (val == old) return
        if (val.length > 0) {
          this.option.column[2].placeholder = '请选择'
          if (!this.firstLoad) {
            this.loading = true
            let jod = await this.getJod(val)
            if (this.form.jobId !== this.initOrgId) {
              this.initOrgId = ''
            }
            jod = jod.filter((it) => {
              if (this.row.jobId !== it.jobId && this.isEdit) {
                return it
              } else {
                return it
              }
            })
            jod = jod.filter((it) => {
              if (this.orgData.jobId !== it.jobId && this.isEdit) {
                return it
              } else {
                return it
              }
            })

            jod.map((it) => {
              it.label = it.jobName
              it.value = it.jobId
            })
            this.option.column[1].dicData = jod
            this.loading = false
          }
        } else {
          this.option.column[1].dicData = []
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
          this.option.column[1].display = true
        }
      },
      immediate: true
    },
    row: {
      handler: async function(val) {
        if (!this.orgData.name) {
          await this.init()
        }
        this.initOrgId = val.jobId
        if (val.jobId && this.isEdit) {
          let { id, name, jobId, duty, requirement } = { ...val }
          let form = {
            skillId: id,
            skillName: name, //技能名称
            jobId: jobId, //岗位id
            duty: duty, // 技能职责
            requirement: requirement //技能要求
          }
          // setTimeout(() => {
          this.form = Object.assign(this.form, form)
          // }, 500)
        } else if (val.jobId && !this.isEdit) {
          let { skillName, jobId, duty, requirement } = { ...val }
          let form = {
            jobId,
            skillName,
            duty,
            requirement
          }
          // setTimeout(() => {
          this.form = Object.assign(this.form, form)
          // }, 500)
        }
      },
      immediate: true
    }
  },
  async created() {},
  async mounted() {},

  methods: {
    async init() {
      this.loading = true
      let jod = await this.getJod()
      jod.map((it) => {
        it.label = it.jobName
        it.value = it.jobId
      })
      this.option.column[2].dicData = jod
      this.loading = false
      this.firstLoad = false
    },
    /**
     * @desc 获取岗位数据
     *
     */
    getJod() {
      let params = {
        jobName: ''
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
    reset() {
      if (this.row.jobId) {
        let form = JSON.parse(JSON.stringify(this.form))
        let { jobId } = { ...form }
        this.$refs.form.resetFields()
        let params = { jobId }
        this.form = Object.assign(this.form, params)
      } else {
        this.$refs.form.resetFields()
      }
    },
    onContinue() {
      this.onClickSave({ again: true }, this.reset)
    },
    //修改技能
    handleModity() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let { skillId, skillName, jobId, requirement, duty } = { ...this.form }

          let params = {
            skillId: skillId,
            jobId: jobId,
            skillName,
            requirement,
            duty
          }
          this.loading = true
          editSkill(params)
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
    //添加技能
    onClickSave({ again = false }, reset) {
      this.$refs.form.validate((vaild) => {
        if (vaild) {
          let { skillName, jobId, requirement, duty } = { ...this.form }
          let params = {
            jobId: this.row.jobId || jobId,
            skillName,
            requirement,
            duty
          }
          this.loading = true
          addSkill(params)
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
     *  @desc 退出编辑
     */
    handleClose() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: center;
}
</style>
