<template>
  <div class="content-wr">
    <div class="left">
      <div class="title">
        未选：
      </div>
      <div class="left_box">
        <el-input
          v-model="filterText"
          placeholder="输入关键字进行过滤"
        >
        </el-input>
        <div class="tree">
          <el-tree
            ref="tree"
            class="filter-tree"
            :data="orgData"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            node-key="id"
            show-checkbox
            @check="handleCheckItem"
          >
          </el-tree>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="title">
        已选：
      </div>
      <div
        v-for="(item, index) in selected"
        :key="index"
        class="info flex flex-justify-between flex-items"
      >
        <div class="flex flex-justify-between flex-items">
          {{ item.orgName }}
        </div>
        <div class="icon">
          <i
            class="el-icon-error pointer"
            @click="() => handleUncheckItem(item)"
          >123</i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getOrgTreeSimple } from '@/api/org/org'
export default {
  // 可见范围组织列表增加入参，orgSource:1  如果不是就不用 传
  props: ['idList', 'isload', 'orgSource'],
  data() {
    return {
      filterText: '',
      orgData: [],
      selected: [],
      defaultProps: {
        children: 'children',
        label: 'orgName',
        disabled: 'disabled',
        id: 'id'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    selected() {
      this.handleSubmit()
    }
  },
  created() {
    this.loadOrgData().then(() => {
      const list = this.idList
      this.$refs.tree.setCheckedKeys(list)
      this.updateSelected(this.orgData)
    })
  },
  methods: {
    updateSelected(list = []) {
      list.forEach((item) => {
        const { id, children = [] } = item
        if (this.idList.includes(id)) {
          this.selected.push(item)
        }
        if (children.length) {
          this.updateSelected(children)
        }
      })
    },
    handleSubmit() {
      this.$emit('selectedValue', this.selected)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    loadOrgData() {
      this.selected = []
      return getOrgTreeSimple({ parentOrgId: 0, orgSource: this.orgSource }).then((res) => {
        this.orgData = res
      })
    },
    handleCheckItem(node, { checkedNodes }) {
      // window.console.log(node)
      this.selected = checkedNodes
    },

    handleUncheckItem(item) {
      this.selected.splice(this.selected.indexOf(item), 1)
      this.posArr(item)
      this.posArrCrr(item)
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.selected.map((item) => item.id))
      })
    },
    posArr(item) {
      this.selected.map((itemi, index) => {
        if (itemi.id == item.parentId) {
          this.selected.splice(index, 1)
          this.posArr(itemi)
        }
      })
    },
    posArrCrr(item) {
      this.selected.forEach((itemi, index) => {
        if (itemi.parentId == item.id) {
          this.selected.splice(index, 1)
          this.posArrCrr(itemi)
          this.posArrCrr(item)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.user-select {
  .tree {
    // 隐藏disabled属性的树形组件的checkbox输入框。
    >>> .el-checkbox.is-disabled {
      display: none;
    }
  }
}
.content-wr {
  margin-top: 10px;
  display: flex;
  border: 1px solid #efefef;
  .left {
    width: 60%;
  }
  .left_box {
    padding: 20px 20px 0;
  }
  .right {
    border-left: 1px solid #f2f2f2;
    width: 40%;
    // padding-left: 20px;
    // padding-right: 20px;
    height: 370px;
    overflow-y: auto;

    .el-tag {
      margin-right: 12px;
      margin-bottom: 8px;
    }
  }
}
.outer-user {
  overflow-y: auto;
  height: 300px;

  .total-check {
    padding: 6px;
    padding-top: 8px;
  }
  .check-ul {
    .check-li {
      display: block;
      &:hover {
        background-color: $lightGray;
      }
      padding: 6px;

      label {
        margin-right: 4px;
      }
    }
  }
}
.tree {
  height: 250px;
  overflow-y: auto;
  padding-top: 10px;
}
.info {
  width: 88%;
  margin: 10px 20px;
  background-color: #f5f6f6;
  padding: 0 10px;
  border-radius: 4px;
  overflow: hidden;
  .icon:hover {
    color: $primaryColor;
  }
}
.imgs {
  height: 30px;
  width: 30px;
  display: inline-block;
  border-radius: 48px;
  margin-right: 10px;
  line-height: 30px;
  text-align: center;
  font-size: 18px;
  background: $primaryColor;
  color: #fff;
}
.imgss {
  height: 30px;
  width: 30px;
  display: inline-block;
  border-radius: 48px;
  margin-right: 10px;
  line-height: 30px;
  text-align: center;
  font-size: 30px;
  background: #fff;
  color: $primaryColor;
}
.company {
  color: $primaryColor;
}
.title {
  line-height: 40px;
  padding-left: 20px;
  border-bottom: 1px solid #f2f2f2;
}
</style>
