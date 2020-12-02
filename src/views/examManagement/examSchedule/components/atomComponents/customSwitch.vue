<template>
  <ul class="switch-ul">
    <li
      v-for="(item, index) in config"
      :key="index"
      class="switch-li"
    >
      <div class="switch-container">
        <label class="switch-label">{{ item.label }}</label>
        <!-- 控制显示隐藏 -->
        <el-switch
          v-model="data[item.prop]"
          @change="changeSwitch(...arguments, item)"
        />
      </div>
      <div
        v-if="data[item.prop] && item.expand"
        class="expand-container"
      >
        <span>{{ item.expand.pre }}</span>
        <el-form :model="{ value: data[item.prop] }">
          <el-form-item
            prop="value"
            :rules="rules"
          >
            <el-input
              v-model.number="data[`${item.prop}Value`]"
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
  data() {
    return {
      rules: [
        {
          required: true,
          message: '不能为空',
          trigger: 'change'
        }
      ]
    }
  },
  methods: {
    changeSwitch(args, data) {
      this.$emit('changeSwitch', args, data)
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
