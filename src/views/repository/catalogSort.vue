<template>
  <div class="contain">
    <page-header
      title="调整排序"
      show-back
      :back="close"
    />
    <basic-container :block="true">
      <div class="treeBox">
        <el-tree
          v-loading="loading"
          :data="data"
          node-key="id"
          :props="{ label: 'name' }"
          default-expand-all
          draggable
          :allow-drop="allowDrop"
        />
      </div>
      <div class="btnBox">
        <el-button
          size="medium"
          @click="close"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          size="medium"
          @click="onSubmit"
        >
          保存
        </el-button>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { getKnowledgeCatalogList, sortSaveKnowledgeCatalog } from '@/api/knowledge/knowledge'

export default {
  name: 'OrgSort',
  data() {
    return {
      data: [],
      oldData: [],
      loading: true,
      sameNameMessage: false
    }
  },
  activated() {
    this.getOrgTree()
  },
  methods: {
    messageFun() {
      if (this.sameNameMessage) return
      this.$message.error({
        message: '该分类名称在分类层级已存在',
        onClose: () => {
          this.sameNameMessage = false
        }
      })
    },
    /**
     * draggingNode: 当前拖拽点
     * dropNode: 目标节点
     */
    allowDrop(draggingNode, dropNode, type) {
      // 同级节点前后移动
      if (type === 'prev' || type === 'next') {
        let parentOrg = this.findParentOrg(dropNode.data.id)
        let draggingNodeParent = this.findParentOrg(draggingNode.data.id)
        if (parentOrg.id === draggingNodeParent.id) return false
        if (_.isEmpty(parentOrg)) {
          let index = _.findIndex(this.data, (item) => {
            return item.name === dropNode.data.name
          })
          if (index > -1) {
            this.messageFun()
            this.sameNameMessage = true
            return false
          }
        }
        if (parentOrg && parentOrg.children) {
          // 同一层级不能有两个相同的节点
          for (let i = 0; i < parentOrg.children.length; i++) {
            if (
              parentOrg.children[i].name === draggingNode.data.name &&
              dropNode.data.children[i].id !== draggingNode.data.id
            ) {
              this.messageFun()
              this.sameNameMessage = true
              return false
            }
          }
        }
        return true
      } else if (type === 'inner') {
        // 插入节点
        // 同一层级不能有两个相同的节点
        if (dropNode.data.children) {
          for (let i = 0; i < dropNode.data.children.length; i++) {
            if (
              dropNode.data.children[i].name === draggingNode.data.name &&
              dropNode.data.children[i].id !== draggingNode.data.id
            ) {
              this.messageFun()
              this.sameNameMessage = true
              return false
            }
          }
        }
        return true
      }
    },
    findParentOrg(id) {
      let org = {}
      function deep(arr) {
        arr.forEach((item) => {
          if (item.children) {
            for (let i = 0; i < item.children.length; i++) {
              if (item.children[i].id === id) {
                org = item
                return
              }
              deep(item.children)
            }
          }
        })
      }
      deep(this.data)
      return org
    },
    getOrgTree() {
      getKnowledgeCatalogList().then((res) => {
        this.data = res
        this.oldData = _.cloneDeep(res)
        this.loading = false
      })
    },
    close() {
      this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
      this.data = JSON.parse(JSON.stringify(this.oldData))
      this.$router.push('/repository/catalogManagement')
    },
    loadSort(arr) {
      arr.forEach((item, index) => {
        item.sort = index + 1
        if (item.children && item.children.length > 0) {
          this.loadSort(item.children)
        }
      })
    },
    onSubmit() {
      this.loadSort(this.data)
      this.loading = true
      sortSaveKnowledgeCatalog(this.data).then(() => {
        this.$message.success('保存成功')
        this.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.contain {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.pageHeader {
  height: 48px;
  // padding: 0 24px;
  line-height: 48px;
  font-size: 18px;
}

/deep/ .is-always-shadow {
  overflow: hidden scroll;
}
.btnBox {
  margin: 0 0 10px 100px;
  height: 40px;
  // position: absolute;
  bottom: 0;
}
/deep/ .el-tree-node__content {
  height: 42px;
  cursor: move;
  border-bottom: 1px solid #f2f2f2;
}
/deep/ .basic-container {
  flex: 1;
  height: calc(100% - 98px);
  display: flex;
  flex-direction: column;
  .el-card {
    flex: 1;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    .el-card__body {
      flex: 1;
      display: flex;
      flex-direction: column;
      .treeBox {
        flex: 1;
        width: calc (100% - 160) px;
        // padding-bottom: 40px;
        overflow: scroll;
      }
    }
  }
}
/deep/ .el-tree-node__expand-icon {
  color: #115fd4;
}

/deep/ .el-tree-node__expand-icon.is-leaf {
  color: transparent;
}
/deep/ .el-tree-node__label {
  font-family: 'PingFangSC-Regular';
  font-size: 14px;
  color: #202940;
  line-height: 43px;
}
</style>
