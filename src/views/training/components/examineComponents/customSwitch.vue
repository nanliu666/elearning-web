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
          v-model="insertData[item.prop]"
          @change="changeSwitch(...arguments, item)"
        />
      </div>
      <div
        v-if="insertData[item.prop] && item.expand"
        class="expand-container"
      >
        <span>{{ item.expand.pre }}</span>
        <el-form :model="{ value: data[item.prop] }">
          <el-form-item
            prop="value"
            :rules="rules"
          >
            <el-input
              v-if="data[item.prop]"
              v-model.number="data[item.prop]"
              class="expand-input"
            ></el-input>
            <el-input
              v-else
              v-model.number="item.expand.defaultValue"
              class="expand-input"
              @input="defaultValueInput(...arguments, item)"
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
      insertData: _.cloneDeep(this.data), //用来做true/false处理
      rules: [
        {
          required: true,
          message: '不能为空',
          trigger: 'change'
        }
      ]
    }
  },
  watch: {
    insertData: {
      handler() {
        // 开启了switch，需要在判断默认值，有默认值用默认值，没开启用原先的初始值0
        _.forIn(this.insertData, (value, key) => {
          let temp = 0
          if (value) {
            let configFilter = _.filter(this.config, (config) => {
              return config.prop === key
            })[0]
            if (!_.isEmpty(configFilter.expand)) {
              temp = this.data[key] === 0 ? configFilter.expand.defaultValue : this.data[key]
            } else {
              temp = this.data[key]
            }
          } else {
            temp = 0
          }
          this.data[key] = temp
        })
      },
      deep: true
    }
  },
  created() {
    _.forIn(this.insertData, (value, key) => {
      this.insertData[key] = value === 0 ? false : true
    })
  },
  methods: {
    // 默认值改变后，赋值需要传给后端的数据
    defaultValueInput(data, args) {
      this.data[args.prop] = Number(data)
    },
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
