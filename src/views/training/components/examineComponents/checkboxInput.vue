<template>
  <el-checkbox
    v-model="checked"
    class="checkbox-input"
  >
    {{ textBefore }}
    <el-input
      v-model.number="innerValue"
      :style="`width:${inputLength}px`"
      :disabled="disabled"
      v-bind="inputProps"
      @input="inputNumber"
    ></el-input>
    {{ textAfter }}
  </el-checkbox>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: null
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
    inputLength: {
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
      innerValue: this.defaultValue
    }
  },
  computed: {
    disabled() {
      return this.value === 0
    },
    checked: {
      get() {
        return !!this.value
      },
      set(val) {
        if (val) {
          this.$emit('input', this.innerValue)
        } else {
          this.$emit('input', 0)
        }
      }
    }
  },
  watch: {
    innerValue(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    inputNumber(value) {
      value = _.toNumber(value.replace(/[^\d]/g, ''))
      this.innerValue = value < 1 ? 1 : value
    }
  }
}
</script>
<style lang="scss">
.checkbox-input {
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #606266;
  }
}
</style>
