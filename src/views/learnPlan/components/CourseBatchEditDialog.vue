<template>
  <el-dialog
    title="批量修改"
    :visible.sync="dialogVisible"
    :append-to-body="true"
  >
    <div class="batch_label">
      允许输入的时间段
    </div>
    <el-date-picker v-model="datePick1"></el-date-picker>
    <el-date-picker v-model="datePick2"></el-date-picker>
    <el-date-picker v-model="datePick3"></el-date-picker>
    <div class="batch_label">
      允许学习次数
    </div>
    <el-input-number
      v-model="learnNumber"
      controls-position="right"
      :min="0"
      placeholder="请输入"
    ></el-input-number>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button
        type="primary"
        @click="dialogVisible = false"
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
  }
}
</script>

<style lang="scss" scoped>
.course-batch-edit-dialog {
}
</style>
