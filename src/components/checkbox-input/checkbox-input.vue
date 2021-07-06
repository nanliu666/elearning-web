<template>
  <el-checkbox
    v-model="checkValue"
    :disabled="disabled"
    class="checkbox-input"
  >
    {{ textBefore }}
    <el-input-number
      v-model.number="innerValue"
      :controls="false"
      :min="0"
      :style="`width:${inputWidth}px`"
      v-bind="inputProps"
    ></el-input-number>
    {{ textAfter }}
  </el-checkbox>
</template>

<script>
export default {
  name: 'CheckboxInput',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
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
      type: Number,
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
    return {}
  },
  computed: {
    checkValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    innerValue: {
      get() {
        return this.defaultValue
      },
      set(value) {
        this.$emit('update:defaultValue', value)
      }
    }
  },
  methods: {}
}
</script>
<style lang="scss">
.checkbox-input {
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #606266;
  }
  .el-checkbox__label {
    color: rgba(0, 11, 21, 0.85);
  }
}
</style>
