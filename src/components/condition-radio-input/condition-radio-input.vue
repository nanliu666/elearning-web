<template>
  <div class="radio-input-box">
    <el-radio :label="innerValue">
      <span
        class="label-text"
        style="margin-right: 15px;"
      >{{ labelText }}</span>
      <span v-if="innerValue === value">
        {{ textBefore }}
        <el-input-number
          v-model.number="modelNumber"
          :controls="false"
          :min="min"
          :style="`width:${inputWidth}px`"
          :disabled="disabled"
          v-bind="inputProps"
        ></el-input-number>
        {{ textAfter }}
      </span>
    </el-radio>
  </div>
</template>

<script>
export default {
  name: 'ConditionRadioInput',
  props: {
    min: {
      type: Number,
      default: 0
    },
    value: {
      type: Number,
      default: null
    },
    passScope: {
      type: Number,
      default: null
    },
    number: {
      type: Number,
      default: null
    },
    labelText: {
      type: String,
      default: ''
    },
    textBefore: {
      type: String,
      default: ''
    },
    textAfter: {
      type: String,
      default: ''
    },
    defaultValue: {
      type: [String, Number],
      default: 10
    },
    inputWidth: {
      type: Number,
      default: 50
    },
    inputProps: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      innerValue: this.defaultValue,
      modelNumber: this.number
    }
  },
  computed: {
    disabled() {
      return this.value === 0
    }
  },
  watch: {
    innerValue(val) {
      this.$emit('input', val)
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.radio-input-box {
  .el-radio {
    display: flex;
    align-items: center;
    .label-text {
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    /deep/ .el-radio__label {
      display: flex;
    }
  }
}
</style>
