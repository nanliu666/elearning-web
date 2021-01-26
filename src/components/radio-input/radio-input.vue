<template>
  <el-radio :label="label">
    {{ textBefore }}
    <el-input-number
      v-model.number="innerValue"
      :controls="false"
      :min="min"
      :style="`width:${inputWidth}px`"
      v-bind="inputProps"
    ></el-input-number>
    {{ textAfter }}
  </el-radio>
</template>

<script>
export default {
  name: 'RadioInput',
  props: {
    min: {
      type: Number,
      default: 0
    },
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
