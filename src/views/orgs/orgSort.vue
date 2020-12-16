<template>
  <div class="contain">
    <page-header
      title="调整排序"
      show-back
    />
    <basic-container :block="true">
      <div class="treeBox">
        <div class="title">
          操作提示：鼠标点击并拖拽目录调整排序
        </div>
        <el-tree
          v-loading="loading"
          :data="data"
          node-key="orgId"
          :props="{ label: 'orgName' }"
          default-expand-all
          draggable
          :allow-drag="allowDrag"
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
import { getOrgTree, sortOrgTree } from '@/api/org/org'

export default {
  name: 'OrgSort',
  data() {
    return {
      data: [],
      oldData: [],
      loading: true,
      sameNameMessage: false,
      orgTypeList: ['Enterprise', 'Company', 'Department', 'Group']
      // Enterprise-企业，Company-公司，Department-部门，Group-小组
    }
  },
  created() {
    this.getOrgTree()
  },
  activated() {
    this.getOrgTree()
  },
  methods: {
    messageFun(org) {
      if (this.sameNameMessage) return
      this.$message.error({
        message: org ? org : '该组织名称在目标层级已存在',
        onClose: () => {
          this.sameNameMessage = false
        }
      })
    },
    allowDrag(draggingNode) {
      return draggingNode.data.parentId !== '0'
    },
    allowDrop(draggingNode, dropNode, type) {
      let draggIndex = this.orgTypeList.indexOf(draggingNode.data.orgType)
      let dropIndex = this.orgTypeList.indexOf(dropNode.data.orgType)
      if (draggIndex < dropIndex) {
        this.messageFun('不能将大组织放入小组织内')
        this.sameNameMessage = true
        return false
      }
      // console.log('type______',type)
      if (type === 'prev' || type === 'next') {
        let parentOrg = this.findParentOrg(dropNode.data.orgId)
        let draggingNodeParent = this.findParentOrg(draggingNode.data.orgId)
        if (parentOrg.orgId === draggingNodeParent.orgId) {
          return true
        }
        if (parentOrg && parentOrg.children) {
          for (let i = 0; i < parentOrg.children.length; i++) {
            if (
              parentOrg.children[i].orgName === draggingNode.data.orgName &&
              parentOrg.children[i].orgId !== draggingNode.data.orgId
            ) {
              this.messageFun()
              this.sameNameMessage = true
              return false
            }
          }
        }
        return true
      } else if (type === 'inner') {
        if (dropNode.data.children) {
          for (let i = 0; i < dropNode.data.children.length; i++) {
            if (
              dropNode.data.children[i].orgName === draggingNode.data.orgName &&
              dropNode.data.children[i].orgId !== draggingNode.data.orgId
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
              if (item.children[i].orgId === id) {
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
      getOrgTree({ parentOrgId: 0 }).then((res) => {
        this.data = res
        this.oldData = JSON.parse(JSON.stringify(res))
        this.loading = false
      })
    },
    goBack() {
      this.$router.push('/orgs/orgManagement')
    },
    close() {
      this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
      this.data = JSON.parse(JSON.stringify(this.oldData))
      this.goBack()
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
      // { orgs: this.data }
      this.loading = true
      sortOrgTree(this.data).then(() => {
        this.$message.success('保存成功')
        getOrgTree({ parentOrgId: 0 }).then((res) => {
          this.data = res
          this.loading = false
        })
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
  height: calc(100% - 58px);
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
        .title {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.45);
          margin-bottom: 10px;
        }
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
