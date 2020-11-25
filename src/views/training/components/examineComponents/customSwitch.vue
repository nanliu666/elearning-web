<template>
  <ul class="switch-ul">
    <li
      v-for="(item, index) in config"
      :key="index"
      class="switch-li"
    >
      <div class="switch-container">
        <label class="switch-label">{{ item.label }}</label>
        <el-switch v-model="item.value" />
      </div>
      <div
        v-if="item.value && item.expand"
        class="expand-container"
      >
        <span>{{ item.expand.pre }}</span>
        <el-form :model="{ value: item.expand.defaultValue }">
          <el-form-item
            prop="value"
            :rules="getRules(item)"
          >
            <el-input
              v-model.number="item.expand.defaultValue"
              class="expand-input"
            ></el-input>
          </el-form-item>
        </el-form>
        <span>{{ item.expand.before }}</span>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'CustomSwitch',
  props: {
    config: {
      type: Array,
      default: () => {
        return []
      }
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    config: {
      handler() {
        let tempData = {}
        _.each(this.config, (item) => {
          // 开启了switch，需要在判断默认值，有默认值用默认值，没有默认值用1，没开启用原先的初始值0
          tempData[item.prop] = item.value ? (item.expand ? item.expand.defaultValue : 1) : 0
        })
        this.$emit('update:data', tempData)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getRules() {
      let rules = [
        {
          required: true,
          message: '不能为空',
          trigger: 'change'
        }
      ]
      return rules
    }
  }
}
</script>

<style scoped lang="scss">
.switch-ul {
  .switch-li {
    .switch-container {
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
      .switch-label {
        color: #666666;
      }
    }
  }
  .expand-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    padding: 20px 0;
    color: #666666;
    .expand-input {
      width: 60px;
    }
  }
}
/deep/ .el-form-item {
  margin-bottom: 0;
}
</style>
