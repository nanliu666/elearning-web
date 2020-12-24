<template>
  <!-- 左侧分类栏 -->
  <div class="leftColumn">
    <el-input
      v-if="searchShow"
      v-model="searchVal"
      suffix-icon="el-icon-search"
    />
    <el-tree
      ref="tree"
      v-bind="$attrs"
      node-key="id"
      :filter-node-method="filterNode"
      v-on="$listeners"
      @node-click="nodeClick"
    >
      <div
        slot-scope="{ node, data }"
        class="custom-tree-node"
      >
        <span
          v-if="!data.hasOwnProperty('flag')"
        >{{ data.label }} {{ data.hasOwnProperty('children') ? '' : '(' + data.num + ')' }}</span>
        <el-dropdown
          v-if="moreMenu.length > 0 && currentNodeKey === data.id"
          class="custom-tree-node-right"
          @command="(val) => commandChange(val, data, node)"
        >
          <span class="el-dropdown-link">
            <i
              class="el-icon-more"
              @click="moreMenuShow = !moreMenuShow"
            ></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="moreMenu.includes('add')"
              command="add"
            >
              新增分类
            </el-dropdown-item>
            <el-dropdown-item
              v-if="moreMenu.includes('move')"
              command="move"
            >
              移动
            </el-dropdown-item>
            <el-dropdown-item
              v-if="moreMenu.includes('edit')"
              command="edit"
            >
              编辑
            </el-dropdown-item>
            <el-dropdown-item
              v-if="moreMenu.includes('delete')"
              command="delete"
            >
              删除
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div
          v-if="data.hasOwnProperty('flag')"
          class="temporaryNode"
        >
          <el-input
            v-model="classifyName"
            maxlength="20"
          />
          <span
            class="sureBtn textStyle"
            @click="temporarySure(data, node)"
          >确定</span>
          <span
            class="cancleBtn"
            @click="cancleCall(data, node)"
          >取消</span>
        </div>
      </div>
    </el-tree>

    <div
      v-if="!temporaryShow"
      class="addGroup"
      @click="commandChange('add')"
    >
      <i class="el-icon-circle-plus-outline"></i>新建分类
    </div>

    <el-dialog
      title="移动"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="30%"
    >
      <label class="dialog_label">
        <i class="requiredStart">*</i>分类名称
        <el-input
          v-model="groupName"
          class="block"
          :disabled="true"
        />
      </label>
      <label class="dialog_label">
        <i class="requiredStart">*</i>上级分类组
        <el-select
          v-model="upGroup"
          class="block"
        >
          <el-option
            v-for="item in upGroupList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </label>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="sureBtn"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    search: {
      default: true,
      type: Boolean
    },
    moreMenu: {
      type: Array,
      default: function() {
        return []
      }
    },
    interfaceList: {
      type: Object,
      default: () => {
        return {
          addCatalog: Promise.reject(),
          delCatalogs: Promise.reject(),
          getCatalogs: Promise.reject(),
          moveCatalogs: Promise.reject(),
          updateCatalogs: Promise.reject()
        }
      }
    }
  },
  data() {
    return {
      dialogVisible: false, // 弹窗是否显示
      searchShow: this.search,
      searchVal: '', // 搜索框的值
      temporaryShow: false, // 是否显示临时添加选项
      classifyName: '', // 新添加的分类名称
      treeData: [], // 树的数据
      currentNodeKey: '', // 当前选中的行
      moreMenuShow: false, // 更多菜单显示
      groupName: '', // 分类名称
      upGroup: '', // 选中的上级分类组
      upGroupList: [], // 当前选中的所有上级分类组的列表
      currentData: '', // 当前选中的节点数据
      currentNode: '', // 当前选中的节点的node
      options: '', // 当前的操作类型
      addCatalog: this.interfaceList.addCatalog, // 新增树单元接口
      delCatalogs: this.interfaceList.delCatalogs, // 删除树单元接口
      getCatalogs: this.interfaceList.getCatalogs, // 获取树单元接口
      moveCatalogs: this.interfaceList.moveCatalogs, // 移动树单元接口
      updateCatalogs: this.interfaceList.updateCatalogs // 更新树单元接口
    }
  },
  watch: {
    searchVal(val) {
      this.$refs.tree.filter(val)
    },
    temporaryShow(val) {
      if (!val) {
        // 如果隐藏了，则把input框数据清空
        this.classifyName = ''
      }
    },
    '$attrs.data'(val) {
      this.treeData = val
      // console.log(this.treeData)
    }
  },
  created() {
    // console.log(this.treeData)
  },
  beforeCreate() {
    // this.treeData.unshift({
    //   id: 'weifenl',
    //   label: '未分类'
    // })
    // console.log(this.treeData)
  },

  methods: {
    sureBtn() {
      // 弹窗的确认按钮
      let catalogsDta = {
        id: this.currentData.id,
        parentId: this.upGroup
      }
      this.moveCatalogs(catalogsDta)
        .then(() => {
          this.refreshTree()
          this.$message({
            type: 'success',
            message: '移动成功!'
          })
        })
        .catch((err) => {
          window.console.log(err)
        })
      //   this.recursionTarget(this.treeData)
      //   this.deleteNode(this.currentData, this.currentNode)
      this.dialogVisible = false
    },
    recursionTarget(data) {
      // 递归取到目标元素并且做添加处理
      let that = this
      data.forEach((item) => {
        if (item.id == that.upGroup) {
          item.hasOwnProperty('children')
            ? item.children.push(this.currentData)
            : this.$set(item, 'children', [this.currentData])
        } else if (item.hasOwnProperty('children') && item.children.length > 0) {
          // item.children = this.recursionTarget(item.children);
          this.$set(item, 'children', this.recursionTarget(item.children))
        }
      })
      return data
    },
    commandChange(val, data, node) {
      this.currentData = data
      this.currentNode = node
      this.options = val
      // 菜单改变
      switch (val) {
        case 'add':
          this.addCallBack(data, node)
          break
        case 'edit':
          this.editCallBack()
          break
        case 'move':
          this.moveCallBack()
          break
        case 'delete':
          this.deleteCallBack()
          break
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getParentNode(node, data = '') {
      let arrays = node.level == '1' ? this.treeData : node.parent.data.children
      let index = -1
      if (data) {
        index = arrays.findIndex((item) => item.id === data.id)
      }
      return {
        arrays: arrays,
        index: index,
        parentData: node.level == '1' ? this.treeData : node.parent.data
      }
    },
    addCallBack(data = '') {
      // 新增回调
      let flagTest = {
        label: '',
        id: Math.random() * 10000000,
        flag: ''
      }
      if (!data) {
        this.treeData.push(flagTest)
      } else {
        data.hasOwnProperty('children')
          ? data.children.push(flagTest)
          : this.$set(data, 'children', [flagTest])
      }
      this.temporaryShow = true
    },
    moveCallBack(data = this.currentData) {
      // 移动回调
      this.upGroup = ''
      this.groupName = ''
      this.dialogVisible = true

      this.groupName = data.label
      this.upGroupList = []
      this.recursionFn(this.treeData)
      this.upGroupList = this.upGroupList.filter((item) => {
        return item.id != data.id
      })
    },
    recursionFn(data) {
      // 写个递归方法来把所有的label拿到
      for (let i in data) {
        let tempData = JSON.parse(JSON.stringify(data[i]))
        if (
          tempData.label === this.groupName ||
          tempData.label === this.currentNode.parent.data.label
        ) {
          continue
        }
        // if (tempData && tempData.hasOwnProperty('children') && tempData.children.length > 0) {
        //   this.recursionFn(tempData.children)
        //   delete tempData.children
        // }
        this.upGroupList.push(tempData)
      }
    },
    editCallBack(data = this.currentData, node = this.currentNode) {
      // 编辑回调
      let { arrays, index } = this.getParentNode(node, data)
      let currentData = JSON.parse(JSON.stringify(data))
      currentData.flag = 'edit'
      this.classifyName = currentData.label
      arrays.splice(index, 1, currentData)
      // console.log(arrays, index, currentData, this.treeData);
      // this.$refs.tree.updateKeyChildren(node.);
      // this.$refs.tree.filter(this.searchVal)
    },
    deleteCallBack(data = this.currentData) {
      // 删除回调
      if (data.hasOwnProperty('children') && data.children.length > 0) {
        this.$message({
          message: '您选择的分类下存在数据，请先将数据调整后再删除',
          type: 'warning'
        })
        return
      }
      this.$confirm('您确认要删除选中的分类吗？', '确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let catalogsData = {
            id: data.id
          }
          this.delCatalogs(catalogsData)
            .then(() => {
              this.refreshTree()
              // this.deleteNode(data, node)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch((err) => {
              window.console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    cancleCall(data = {}, node) {
      // 临时取消
      this.temporaryHide()
      if (data.hasOwnProperty('flag')) {
        if (data.flag === 'edit') {
          //   let { arrays, index } = this.getParentNode(node, data)
          delete data.flag
          //   arrays.splice(index, 1, data)
          return
        }
        this.deleteNode(data, node)
      }
    },
    deleteNode(data, node) {
      // 删除方法
      let { arrays, index, parentData } = this.getParentNode(node, data)
      //   console.log(data,node,arrays, parentData);
      arrays.splice(index, 1)
      if (parentData.hasOwnProperty('children') && parentData.children.length <= 0) {
        delete parentData.children
      }
    },
    temporaryHide() {
      // 临时添加隐藏
      this.temporaryShow = false
    },
    async temporarySure(data, node) {
      // 临时添加 添加按钮回调 先判断有没有，如果存在抛出脱误，没有则添加
      let filterList = this.treeData.filter((item) => {
        return item.label === this.classifyName
      })
      if (filterList.length > 0) {
        this.$message({
          message: '该分类已存在',
          type: 'warning'
        })
      } else {
        // let { arrays, index } = this.getParentNode(node, data)
        // let datas = JSON.parse(JSON.stringify(data))
        if (this.options === 'add') {
          let interfaceData = {
            name: this.classifyName
          }
          node.parent ? (interfaceData.parentId = node.parent.data.id) : ''
          await this.addCatalog(interfaceData)
            .then(() => {
              this.refreshTree()
            })
            .catch((err) => {
              window.console.log(err)
            })
        } else if (this.options === 'edit') {
          let interfaceData = {
            id: data.id,
            name: this.classifyName
          }
          node.parent ? (interfaceData.parentId = node.parent.data.id) : ''
          await this.updateCatalogs(interfaceData)
            .then(() => {
              this.refreshTree()
            })
            .catch((err) => {
              window.console.log(err)
            })
        }
        let text = this.options === 'edit' ? '保存成功' : '新建成功'
        // delete datas.flag
        // datas.label = this.classifyName
        // arrays.splice(index, 1, datas)
        this.$message({
          message: text,
          type: 'success'
        })
        this.temporaryHide()
      }
    },
    nodeClick(data) {
      // 节点被点击
      this.currentNodeKey = data.id
      this.moreMenuShow = false
    },
    refreshTree() {
      // 刷新树数据
      this.$emit('refreshTree')
      this.classifyName = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.leftColumn {
  min-height: 500px;
  position: relative;
  padding-bottom: 30px;
  background-color: #fff;
  width: 100%;
  /deep/.el-tree-node > .el-tree-node__children {
    overflow: inherit;
  }
  /deep/.custom-tree-node {
    display: inline-block;
    width: 100%;
    position: relative;
    padding-right: 30px;
    box-sizing: border-box;
    &::after {
      content: '';
      clear: both;
      display: block;
    }
    .custom-tree-node-right {
      position: absolute;
      top: 50%;
      right: 0;
      height: 14px;
      transform: translateY(-50%);
      line-height: 1;
      .moreMenu {
        position: absolute;
        top: 20px;
        right: 0;
        padding: 0 10px;
        line-height: 30px;
        background-color: #fff;
        box-shadow: 0px 0px 8px -2px grey;
        z-index: 100;
      }
    }
    .el-icon-more {
      transform: rotate(90deg);
    }
  }
  .temporaryNode {
    margin-top: 15px;
    .el-input {
      width: 70%;
    }
    span {
      cursor: pointer;
      display: inline-block;
      margin-left: 10px;
    }
  }
  .addGroup {
    position: absolute;
    color: #409eff;
    bottom: 0;
    line-height: 30px;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    .el-icon-circle-plus-outline {
      font-size: 16px;
      margin-right: 5px;
    }
  }
  .textStyle {
    color: #409eff;
  }
}
/deep/.el-dialog {
  label {
    display: block;
    margin-bottom: 10px;
  }
  .requiredStart {
    font-size: 12px;
    margin-right: 5px;
    line-height: 16px;
    vertical-align: middle;
    color: rgb(199, 32, 32);
  }
  .block {
    display: block;
    margin-top: 10px;
  }
}
</style>
