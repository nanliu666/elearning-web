<template>
  <el-select
    ref="selector"
    v-model="valueId"
    :clearable="clearable"
    :placeholder="placeholder"
    :disabled="disabled"
    @clear="clearHandle"
    @focus="handleFocus"
  >
    <el-option
      :value="valueId"
      :label="valueTitle"
    >
      <el-tree
        id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="optionList"
        :props="props"
        :node-key="props.value"
        :default-expanded-keys="defaultExpandedKey"
        @node-click="handleNodeClick"
      ></el-tree>
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: 'ElTreeSelect',
  model: {
    prop: 'value',
    event: 'getValue'
  },
  props: {
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          value: 'id', // ID字段名
          label: 'title', // 显示名称
          children: 'children' // 子级字段名
        }
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    initialOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    /* 初始值 */
    value: {
      type: String,
      default: ''
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      valueId: this.value, // 初始值
      valueTitle: '',
      defaultExpandedKey: []
    }
  },
  computed: {
    optionList() {
      return _.uniqBy(this.initialOptions.concat(this.options), this.props.value)
    }
  },
  watch: {
    value(val) {
      this.valueId = val
      this.$nextTick(() => {
        this.initHandle()
      })
    },
    options: {
      handler() {
        this.$nextTick(() => {
          this.initHandle()
        })
      },
      deep: true
    }
  },
  methods: {
    handleFocus() {
      this.$emit('focus')
    },
    // 初始化值
    initHandle() {
      if (this.valueId) {
        const node = this.$refs.selectTree.getNode(this.valueId)
        if (!node) return
        this.valueTitle = node.data[this.props.label] // 初始化显示
        this.$refs.selectTree.setCurrentKey(this.valueId) // 设置默认选中
        this.defaultExpandedKey = [this.valueId] // 设置默认展开
        this.$nextTick(() => {
          let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
          let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
          scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
          scrollBar.forEach((ele) => (ele.style.width = 0))
        })
      } else {
        this.valueTitle = ''
      }
    },
    // 切换选项
    handleNodeClick(node) {
      this.valueTitle = node[this.props.label]
      this.valueId = node[this.props.value]
      this.$emit('getValue', this.valueId)
      const data = {
        label: this.valueTitle,
        value: this.valueId
      }
      this.$emit('change', data)
      this.defaultExpandedKey = []
      this.$refs.selector.blur()
    },
    // 清除选中
    clearHandle() {
      this.valueTitle = ''
      this.valueId = null
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('getValue', null)
    },
    /* 清空选中样式 */
    clearSelected() {
      let allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach((element) => element.classList.remove('is-current'))
    }
  }
}
</script>
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
</style>
