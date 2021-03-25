<template>
  <div class="radio-input-box">
    <el-radio :label="label">
      <span
        class="label-text"
        style="margin-right: 15px;"
      >{{ labelText }}</span>
      <span v-if="isShow">
        {{ textBefore }}
        <el-input-number
          v-model.number="innerValue"
          :controls="false"
          :min="min"
          :style="`width:${inputWidth}px`"
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
    label: {
      type: Number,
      default: 1
    },
    isShow: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
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
    inputWidth: {
      type: Number,
      default: 60
    },
    inputProps: {
      type: Object,
      default: null
    }
  },
  data() {
    return {}
  },
  computed: {
    innerValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
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
