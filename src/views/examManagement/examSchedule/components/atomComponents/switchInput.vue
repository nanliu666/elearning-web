<template>
  <div class="switch-container">
    <el-switch v-model="innerSwitchValue"></el-switch>
    <div
      v-if="innerSwitchValue"
      style="margin-left: 10px;"
    >
      {{ preText }}
      <el-input
        v-model.number="innerInputValue"
        :style="`width:${inputWidth}px; display: inline-block`"
      ></el-input>
      {{ afterText }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SwitchInput',
  props: {
    switchValue: {
      type: Boolean,
      default: false
    },
    inputValue: {
      type: Number,
      default: 0
    },
    preText: {
      type: String,
      default: ''
    },
    afterText: {
      type: String,
      default: ''
    },
    inputWidth: {
      type: Number,
      default: 60
    }
  },
  data() {
    return {}
  },
  computed: {
    innerSwitchValue: {
      get: function() {
        return this.switchValue
      },
      set: function(value) {
        this.$emit('update:switchValue', value)
      }
    },
    innerInputValue: {
      get: function() {
        return this.inputValue
      },
      set: function(value) {
        this.$emit('update:inputValue', value)
      }
    }
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.switch-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 36px;
  color: #606266;
}
</style>
