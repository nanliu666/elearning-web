<template>
  <el-radio :label="innerValue">
    {{ textBefore }}
    <el-input
      v-model.number="innerValue"
      :style="`width:${inputWidth}px`"
      :disabled="disabled"
      v-bind="inputProps"
      @input="inputNumber"
    ></el-input>
    {{ textAfter }}
  </el-radio>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
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
      innerValue: this.defaultValue
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
  methods: {
    inputNumber(value) {
      value = value.replace(/[^\d]/g, '')
      this.innerValue = value
    }
  }
}
</script>
