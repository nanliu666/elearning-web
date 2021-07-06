<template>
  <div class="add-work-exper">
    <el-dialog
      ref="mask"
      :close-on-click-modal="false"
      append-to-body
      :title="title[operation]"
      :visible="visible"
      width="700px"
      :modal-append-to-body="false"
      @close="xHandleClose"
    >
      <el-form
        ref="basicForm"
        :model="formData"
        :rules="basicFormRules"
        label-position="top"
      >
        <el-row :gutter="60">
          <el-col :span="12">
            <el-form-item
              label="单位名称"
              prop="workUnit"
            >
              <el-input
                v-model.trim="formData.workUnit"
                :maxlength="32"
                placeholder="请填写"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="在职时间"
              prop="workTime"
            >
              <el-date-picker
                v-model="formData.workTime"
                style="width:100%;"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="职位名称"
              prop="jobName"
            >
              <el-input
                v-model.trim="formData.jobName"
                :maxlength="32"
                placeholder="请填写"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证明人">
              <el-input
                v-model.trim="formData.witness"
                :maxlength="32"
                placeholder="请填写"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="60">
          <el-col :span="12">
            <el-form-item label="证明人联系电话">
              <el-input
                v-model.trim="formData.witnessPhone"
                placeholder="请填写"
                :maxlength="11"
                @input="getNumber"
                @change="getTel"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item
              label="工作内容"
              prop="workContent"
              class="form-item-des"
            >
              <el-input
                v-model.trim="formData.workContent"
                type="textarea"
                :maxlength="500"
                :rows="4"
                show-word-limit
                placeholder="请输入"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="medium"
          @click="btnHandleClose"
        >取消</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="handleSubmit"
        >保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'WorkExper',
  props: {
    workData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      title: { edit: '编辑工作经历', add: '新增工作经历' },
      operation: 'edit',
      formData: {},
      basicFormRules: {
        workUnit: [{ required: true, message: '请填写单位名称', trigger: 'blur' }],
        workTime: [{ required: true, message: '请填写在职时间', trigger: 'change' }],
        jobName: [{ required: true, message: '请填写职位名称', trigger: 'blur' }],
        workContent: [{ required: true, message: '请填写工作内容', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //取消
    btnHandleClose() {
      this.formData = {}
      this.$refs.basicForm.resetFields()
      this.visible = false
    },
    xHandleClose() {
      this.formData = {}
      this.$refs.basicForm.resetFields()
      this.visible = false
    },
    //手机号校验
    getNumber(val) {
      if (/[^\d.]/.test(val)) {
        this.$set(this.formData, 'witnessPhone', '')
        return
      }
      this.$set(this.formData, 'witnessPhone', val)
    },
    getTel(val) {
      const reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/
      if (val && !reg.test(val)) {
        this.$message.error('手机号码格式有误，请重新输入')
        this.$set(this.formData, 'witnessPhone', '')
        return
      }
    },
    //保存
    handleSubmit() {
      this.$refs.basicForm.validate((valid) => {
        if (valid) {
          const experData = {
            workUnit: this.formData.workUnit,
            workStartTime: this.formData.workTime[0],
            workEndTime: this.formData.workTime[1],
            jobName: this.formData.jobName,
            witness: this.formData.witness || '',
            witnessPhone: this.formData.witnessPhone || '',
            workContent: this.formData.workContent,
            workTime: this.formData.workTime
          }
          if (this.operation === 'edit') {
            this.$emit('changeExperEdit', experData)
          } else {
            this.$emit('changeExperAdd', experData)
          }
          this.btnHandleClose()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body {
  padding: 20px 20px 0;
}
.form-item-des {
  /deep/.el-input__count {
    line-height: 1;
  }
}
</style>
