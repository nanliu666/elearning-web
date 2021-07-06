<template>
  <div>
    <div class="limit-title">
      {{ title }}
    </div>
    <el-tree
      ref="tree"
      :data="treeList || []"
      :default-expanded-keys="[]"
      :highlight-current="true"
      show-checkbox
      :check-strictly="systemNodeFlag"
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
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultValue: [],
      activeData: {},
      systemNodeFlag:true
    }
  },
  methods: {
    initDefault() {
      this.defaultValue = []
      let filterVal = []
      this.filterData(this.treeList, filterVal)
      let fiterTree = flatTree(filterVal)
      // console.log(this.treeList,filterVal)
      // console.log(fiterTree)
      // const keys = []
      // fiterTree.map((it) => {
      //   // 修复当菜单类型为目录以及菜单都被勾选中
      //   // TODO: 待补充：父级内有未被勾选的子集时应该显示半选，即删除父级id
      //   if (it.isOwn !== 0 && (it.menuType === 'Menu' || it.menuType === 'Dir')) {
      //     this.defaultValue.push(it.menuId)
      //     keys.push(it.menuId)
      //   }
      // })
      const checkedKeys = []
      fiterTree.map((it) => {
        // 修复当菜单 isOwn==1 && menuType === 'Menu' 才被选中
        if (it.isOwn !== 0  && (it.menuType === 'Menu' || it.menuType === 'Dir')) {
          this.defaultValue.push(it.menuId)
          checkedKeys.push(it.menuId)
        }
      })
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(checkedKeys)
        this.systemNodeFlag = false 
      })

      
    },
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
