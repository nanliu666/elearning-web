<template>
  <div class="content-wr">
    <div class="left">
      <div class="title">
        未选：
      </div>
      <div class="left_box">
        <el-input
          v-model="filterText"
          :placeholder="inputPlaceholder"
        >
        </el-input>
        <div class="tree">
          <el-tree
            ref="tree"
            v-loading="loading"
            class="filter-tree"
            :data="orgData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            node-key="orgId"
            show-checkbox
            :load="loadNode"
            lazy
            @check="handleCheckItem"
          >
          </el-tree>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="title">
        已选（以选中结果为准）：
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
import { getorganizationNew } from '@/api/org/org'
export default {
  // 可见范围组织列表增加入参，orgSource:1  如果不是就不用 传
  props: {
    idList: [String, Number, Array, Object],
    isload: [String, Number, Array, Object],
    orgSource: [String, Number, Array, Object],
    inputPlaceholder: {
      type: String,
      default: '输入关键字进行过滤'
    }
  },
  data() {
    return {
      filterText: '',
      orgData: null,
      selected: [],
      defaultProps: {
        label: 'orgName',
        disabled: 'disabled',
        value: 'orgId'
      },
      loading: false,
      idListChange:false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    selected() {
      this.handleSubmit()
    },
    idList() {
      this.createdSetCheckedKeys(true,this.idList)
    },
    orgData() {}
  },
  created() {
    this.createdSetCheckedKeys()
  },
  methods: {
    createdSetCheckedKeys(hasCheckList,arr) {
      this.loadOrgData().then(() => {
        if (this.idList instanceof Array) {
          let list = this.idList.reduce((pre,cur)=>{
            pre.push(cur.orgId)
            return pre
          },[])
          this.$refs.tree.setCheckedKeys(list)
          this.selected = []
          if(hasCheckList){
            this.setSelected(arr)
          }else{
            this.setSelected(this.idList)
          }
          // this.updateSelected(this.orgData)
        }
      })
    },
    setSelected(list = []){
      list.forEach((item) => {
        item.id = item.orgId
        this.selected.push(item)
      })
    },
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
      this.loading = true
      return getorganizationNew({ parentId: '0' })
        .then((res) => {
          this.orgData = res
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCheckItem(node, { checkedNodes,checkedKeys }) {
      // window.console.log(this.orgData)
      //获取当前tree 选中的数据    合并传入的数据，并去重
      let arr  = this.selected.reduce((pre,cur)=>{
        pre.push(cur)
        return pre
      },[])
      checkedNodes.forEach(item=>{
        if(checkedKeys.indexOf(item.id)>=0){
          arr.push({
            id:item.id,
            orgId:item.orgId,
            orgName:item.orgName
          })
        }
      })
      // if(checkedNodes.length<=0){
      //   //删除当前节点
      //   let idx = _.findIndex(arr, ['id', node.id])
      //   let i = _.findIndex(this.selected, ['id', node.id])
      //   this.selected.splice(i,1)
      //   arr.splice(idx,1)
      //   //删除当前节点子节点
      //   // let childRes = []
      //   // this.delChildNode(node,childRes)
      //   // console.log(childRes,'') 
      //   // childRes.forEach(y=>{
      //   //   let t = _.findIndex(arr, ['id', y])
      //   //   arr.splice(t,1)
      //   // })
      // }
      arr = _.uniqBy(arr,'id')
      this.selected =  arr
    },
    delChildNode(node,res){
      let nodeInfo = this.$refs.tree.getNode(node.orgId)
      if(nodeInfo.childNodes.length>0){
        _.forEach(nodeInfo.childNodes,x=>{
          res.push(x.data.id)
          if(x.childNodes.length>0){
            this.delChildNode(x,res)
          }
        })
        
      }
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
    },
    async loadNode(node, resolve) {
      if (!node.data) return
      await getorganizationNew({ parentId: node.data.orgId }).then((res) => {
        resolve(res)
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
