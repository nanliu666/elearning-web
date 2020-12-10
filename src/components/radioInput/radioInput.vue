<template>
  <el-radio :label="label">
    {{ textBefore }}
    <el-input
      v-model.number="innerValue"
      :style="`width:${inputWidth}px`"
      v-bind="inputProps"
    ></el-input>
    {{ textAfter }}
  </el-radio>
</template>

<script>
export default {
  props: {
    label: {
      type: [String, Number, Boolean],
      default: true
    },
    inputValue: {
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
        return this.inputValue
      },
      set(value) {
        this.$emit('update:inputValue', value)
      }
    }
  },
  methods: {}
}
</script>
