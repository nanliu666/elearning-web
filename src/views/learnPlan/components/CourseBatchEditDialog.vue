<template>
  <el-dialog
    title="批量修改"
    :visible="visible"
    class="course-batch-edit-dialog"
    width="422px"
    @close="handleClose"
  >
    <div class="batch_label">
      允许的时间段
    </div>
    <el-date-picker
      v-for="(time, index) in timeList"
      :key="index"
      v-model="time.list"
      class="picker"
      type="daterange"
      value-format="yyyy-MM-dd HH:mm:ss"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
    />
    <div class="batch_label--study">
      允许学习次数
    </div>
    <el-input-number
      v-model="studyFrequency"
      controls-position="right"
      :min="0"
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
      timeList: [{ list: [] }, { list: [] }, { list: [] }],
      studyFrequency: 0
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.timeList = [{ list: [] }, { list: [] }, { list: [] }]
      this.studyFrequency = 0
    },
    handleSubmit() {
      this.$emit('submit', {
        timeList: this.timeList,
        studyFrequency: this.studyFrequency
      })
      this.handleClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.course-batch-edit-dialog {
  /deep/.el-dialog__header {
    padding-bottom: 16px;
  }
  /deep/.el-dialog__body {
    padding-top: 16px;
  }
  .picker {
    margin-bottom: 8px;
    width: 100%;
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
