<template>
  <div>
    <div class="limit-title">
      {{ title }}
    </div>
    <el-tree
      ref="tree"
      :data="treeList || []"
      :default-expanded-keys="[]"
      :default-checked-keys="defaultValue"
      :highlight-current="true"
      show-checkbox
      :check-strictly="false"
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
import { flatTree } from '@/util/util'
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
          let filterVal = []
          this.filterData(val, filterVal)
          let fiterTree = flatTree(filterVal)
          fiterTree.map((it) => {
            if (it.isOwn && it.menuType === 'Menu') {
              this.defaultValue.push(it.menuId)
            }
          })
          // this.findValue(val, this.defaultValue)
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  methods: {
    filterData(data, table) {
      data.map((it) => {
        if (it.isOwn) {
          table.push(_.cloneDeep(it))
        }
        if (it.isOwn && it.children && it.children.length > 0) {
          table[table.length - 1].children = []
          this.filterData(it.children, table[table.length - 1].children)
        }
      })
    },
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
