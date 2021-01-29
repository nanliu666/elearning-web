<template>
  <el-dialog
    title="批量修改"
    :visible="visible"
    class="course-batch-edit-dialog"
    width="422px"
    append-to-body
    @close="handleClose"
  >
    <el-form
      ref="form"
      label-position="top"
      :model="{ timeList }"
    >
      <el-form-item
        label="允许的时间段"
        prop="timeList"
        :rules="rules"
      >
        <el-time-picker
          v-for="(time, index) in timeList"
          :key="index"
          v-model="time.list"
          class="picker"
          is-range
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
          value-format="HH:mm:ss"
        />
      </el-form-item>
    </el-form>
    <div class="batch_label--study">
      允许学习次数
    </div>
    <el-input-number
      v-model="studyFrequency"
      controls-position="right"
      :min="0"
      style="width: 100%"
    ></el-input-number>
    <div class="batch_label__tip">
      0：表示无限制
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="medium"
        @click="handleClose"
      >取 消</el-button>
      <el-button
        type="primary"
        size="medium"
        @click="handleSubmit"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { validateTimeList } from './config'
const emptyTimeList = [{ list: ['', ''] }, { list: ['', ''] }, { list: ['', ''] }]
export default {
  name: 'CourseBatchEditDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timeList: _.cloneDeep(emptyTimeList),
      studyFrequency: 0,
      rules: [{ validator: validateTimeList }]
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.timeList = _.cloneDeep(emptyTimeList)
      this.studyFrequency = 0
    },
    handleSubmit() {
      this.$refs.form.validate().then(() => {
        this.$emit('submit', {
          timeList: this.timeList,
          studyFrequency: this.studyFrequency
        })
        this.handleClose()
      })
    }
  }
}
</script>

<style lang="scss">
.course-batch-edit-dialog {
  /deep/.el-dialog__header {
    padding-bottom: 16px;
  }
  /deep/.el-dialog__body {
    padding-top: 16px;
  }
  .picker {
    margin-bottom: 8px;
    width: 100% !important;
  }
  .batch_label {
    margin-bottom: 8px;
    &__tip {
      margin-top: 8px;
    }
  }
  .batch_label--study {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>
