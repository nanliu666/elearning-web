<template>
  <ul class="question-options">
    <li
      v-for="(option, index) in value"
      :key="option.key"
    >
      <el-radio
        v-if="!isCheckBox"
        v-model="option.isCorrect"
        :label="1"
        @change="(val) => handleRadioCheck(val, option)"
      >
        {{ '' }}
      </el-radio>
      <el-checkbox
        v-if="isCheckBox"
        v-model="option.isCorrect"
        :true-label="1"
      >
        {{ '' }}
      </el-checkbox>
      <el-input
        v-model="option.content"
        maxlength="150"
        placeholder="请输入选项内容"
      ></el-input>
      <i
        class="el-icon-remove-outline"
        @click="handleRemoveOption(option)"
      ></i>
      <i
        v-if="index === value.length - 1 && value.length !== 10"
        class="el-icon-circle-plus-outline"
        @click="handleAddOption"
      ></i>
    </li>
  </ul>
</template>

<script>
import { createUniqueID } from '@/util/util'
import Emitter from '@/mixins/elFormEmitter'
export default {
  name: 'QuestionOptions',
  mixins: [Emitter],
  props: {
    value: {
      type: Array,
      default: () => []
    },
    isCheckBox: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleRadioCheck(val, option) {
      this.value.forEach((item) => {
        if (item.key !== option.key) {
          item.isCorrect = 0
        }
      })
      this.dispatch('ElFormItem', 'el.form.change', this.value)
    },
    handleRemoveOption(option) {
      this.$emit(
        'input',
        _.filter(this.value, (item) => item.key !== option.key)
      )
      this.dispatch('ElFormItem', 'el.form.change', this.value)
    },
    handleAddOption() {
      this.value.push({
        key: createUniqueID(),
        content: '',
        isCorrect: 0,
        url: ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.question-options {
  li {
    .el-radio {
      margin-right: 10px;
    }
    .el-checkbox {
      margin-right: 10px;
    }
    .el-input {
      width: 60%;
    }
    i {
      font-size: 24px;
      margin-left: 8px;
      cursor: pointer;
    }
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }
}
</style>
