<template>
  <div>
    <el-radio :label="innerValue">
      <span style="margin-right: 15px">{{ labelText }}</span>
      <span v-if="innerValue === value">
        {{ textBefore }}
        <el-input
          v-model.number="modelNumber"
          :style="`width:${inputWidth}px`"
          :disabled="disabled"
          v-bind="inputProps"
          @input="inputNumber"
        ></el-input>
        {{ textAfter }}
      </span>
    </el-radio>
  </div>
</template>

<script>
export default {
  props: {
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
      // console.log(123)
      this.$emit('input', val)
    }
  },
  methods: {
    inputNumber(value) {
      value = value.replace(/[^\d]/g, '')
      this.$emit('update:number', parseInt(value))
      // this.value.passScope =value
    }
  }
}
</script>
