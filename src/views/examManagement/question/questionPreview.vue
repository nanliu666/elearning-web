<template>
  <div class="qustion">
    <div class="qustion__content">
      <span class="qustion__label">题目: </span><span v-html="data.content"></span>
    </div>
    <div
      v-if="!_.isEmpty(data.attachments)"
      class="qustion__attachments"
    >
      <el-image
        v-for="(attachment, index) in data.attachments"
        :key="index"
        :src="attachment.fileUrl"
      ></el-image>
    </div>
    <div
      v-if="[QUESTION_TYPE_SINGLE, QUESTION_TYPE_MULTIPLE, QUESTION_TYPE_JUDGE].includes(data.type)"
      class="qustion__options"
    >
      <li
        v-for="option in data.options"
        :key="option.key"
      >
        <div class="wrap">
          <el-radio
            v-if="QUESTION_TYPE_SINGLE === data.type"
            :value="option.isCorrect"
            :label="1"
            :disabled="true"
          >
            {{ '' }}
          </el-radio>
          <el-checkbox
            v-if="QUESTION_TYPE_MULTIPLE === data.type"
            :value="option.isCorrect"
            :true-label="1"
            :disabled="true"
          >
            {{ '' }}
          </el-checkbox>
          <span>{{ option.content }}</span>
        </div>
      </li>
    </div>

    <div
      v-if="data.type === QUESTION_TYPE_BLANK"
      class="qustion__correct-answer"
    >
      <span class="qustion__label">标准答案：</span>
      <span class="qustion__text">{{ (_.head(data.options) || {}).content }}</span>
    </div>
    <div class="qustion__analysis">
      <span class="qustion__label">试题分析：</span>
      <span class="qustion__text">{{ data.analysis }}</span>
    </div>
  </div>
</template>

<script>
import {
  QUESTION_TYPE_MAP,
  QUESTION_TYPE_MULTIPLE,
  QUESTION_TYPE_SINGLE,
  QUESTION_TYPE_JUDGE,
  QUESTION_TYPE_SHOER,
  QUESTION_TYPE_BLANK
  // QUESTION_TYPE_GROUP
} from '@/const/examMange'
export default {
  name: 'QustionPreview',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    QUESTION_TYPE_MULTIPLE: () => QUESTION_TYPE_MULTIPLE,
    QUESTION_TYPE_SINGLE: () => QUESTION_TYPE_SINGLE,
    QUESTION_TYPE_JUDGE: () => QUESTION_TYPE_JUDGE,
    QUESTION_TYPE_BLANK: () => QUESTION_TYPE_BLANK,
    QUESTION_TYPE_SHOER: () => QUESTION_TYPE_SHOER,
    QUESTION_TYPE_MAP: () => QUESTION_TYPE_MAP
  }
}
</script>

<style lang="scss" scoped>
.qustion {
  &__content {
    margin-bottom: 12px;
  }
  &__options {
    li {
      margin-bottom: 12px;
      // &:last-of-type {
      //   margin-bottom: 0;
      // }
      .el-radio {
        margin-right: 10px;
      }
      .el-checkbox {
        margin-right: 10px;
      }
    }
  }
}
</style>
