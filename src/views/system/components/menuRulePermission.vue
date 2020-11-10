<template>
  <div>
    <div class="limit-title">
      {{ title }}
    </div>
    <el-tree
      ref="tree"
      :data="treeList || []"
      :default-expanded-keys="[1]"
      :default-checked-keys="defaultValue"
      :highlight-current="true"
      show-checkbox
      :check-strictly="true"
      :node-key="defaultProps.id"
      :props="{ label: defaultProps.label, disabled: genDisabled }"
      :expand-on-click-node="false"
      :disabled="disabled"
      @node-click="handleCheck"
      @check="check"
    />
  </div>
</template>

<script>
export default {
  name: 'MenuRulePermission',
  props: {
    title: {
      type: String,
      default: ''
    },
    defaultProps: {
      type: Object,
      default() {
        return {
          id: 'id',
          label: 'label'
        }
      }
    },

    treeList: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultValue: [],
      activeData: {}
    }
  },
  watch: {
    treeList: {
      handler(val) {
        if (val.length > 0) {
          this.defaultValue = []
          this.findValue(val, this.defaultValue)
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  methods: {
    genDisabled() {
      return this.disabled
    },
    getCheck() {
      // 勾选的key
      var checkedKeys = this.$refs.tree.getCheckedKeys()
      // 暂选状态的母tab的key
      var halfKeys = this.$refs.tree.getHalfCheckedKeys()
      // 合并两个数组
      var save = checkedKeys.concat(halfKeys)
      // this.$emit('save',save)
      return save
    },
    check(data) {
      data.cleck = !data.cleck
      if (data.cleck && data.menuId == this.activeData.menuId) {
        this.$emit('nodeClick', data, true, 1)
      } else {
        this.$emit('nodeClick', data, false, 1)
      }
    },
    handleCheck(data) {
      this.activeData = data
      if (data.isOwn == 1) data.cleck = true
      // this.setOwn(this.treeList, treeKeys)
      if (data.cleck) {
        this.$emit('nodeClick', data, true, 0)
      } else {
        this.$emit('nodeClick', data, false, 0)
      }

      // this.$refs.tree.setCheckedKeys([data.menuId])
    },

    // 根据树形内选中的节点，改变数据内的isOwn字段
    setOwn(arr, treeKeys) {
      arr.forEach((item) => {
        item.isOwn = treeKeys.indexOf(item[this.defaultProps.id]) > -1
        if (item.children && item.children.length > 0) {
          this.setOwn(item.children, treeKeys)
        }
      })
    },

    findValue(arr, data) {
      arr.forEach((item) => {
        if (item.isOwn) {
          data.push(item[this.defaultProps.id])
        }
        if (item.children && item.children.length > 0) {
          this.findValue(item.children, data)
        }
      })
    }
  }
}
</script>

<style scoped>
.limit-title {
  font-size: 18px;
  margin-bottom: 20px;
}
</style>
