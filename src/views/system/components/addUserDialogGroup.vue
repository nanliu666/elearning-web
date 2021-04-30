<template>
  <el-dialog
    title="添加用户"
    :visible="visible"
    width="800px"
    append-to-body
    :before-close="close"
    @open="dialogOpen"
  >
    <div class="content-wr">
      <div class="left">
        <el-input
          v-model="filterText"
          placeholder="成员名称"
          @input="searchLoadData"
        />
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="组织架构"
            name="org"
          >
            <el-tree
              ref="tree"
              :key="updateInfo"
              :data="orgTree"
              show-checkbox
              default-expand-all
              node-key="id"
              :props="defaultProps"
              :default-checked-keys="selectListIds"
              @check="handleCheckChange"
              @node-click="nodeClick"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="right">
        <div>
          <span class="title">已添加成员</span>
          <span style="float:right;">
            <el-button
              type="text"
              @click="handleUnselectAll()"
            >清除</el-button>
          </span>
        </div>
        <el-tag
          v-for="item in selectList"
          :key="item.id"
          size="small"
          closable
          @close="handleUnselect(item)"
        >
          {{ item.name }}
        </el-tag>
      </div>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="medium"
        @click="close"
      >取 消</el-button>
      <el-button
        :loading="submitting"
        size="medium"
        type="primary"
        @click="handleSubmit"
      >
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getOrgUserChild, getBizUserChild } from '@/api/system/user'
import { addGroupUser } from '@/api/system/role'

export default {
  name: 'AddUserDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      loading: false,
      activeName: 'org',
      submitting: false,
      filterText: '',
      props: {
        disabled: (data) => data.type !== 'user' && data.users.length === 0,
        label: (item) => item.orgName || item.name,
        children: 'children'
      },
      defaultProps: {
        label: (item) => item.name,
        children: 'children'
      },
      selectList: [],
      selectListIds: [],
      oldSelectList: [],
      orgTree: [],
      tagId: null,
      treeIds: {
        orgIds: [],
        bizIds: []
      },
      bizTree: [],
      activeNodeId: 0,
      updateInfo: 0,
      bizUpdateInfo: 0
    }
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.name
      this.handleTab()
    },
    handleTab() {
      switch (this.activeName) {
        case 'org':
          if (this.filterText) {
            this.filterText = ''
            this.bizTree = []
            this.getOrgUserTree()
          } else {
            if (!this.orgTree.length) this.getOrgUserTree()
          }
          break
        case 'biz':
          if (this.filterText) {
            this.filterText = ''
            this.orgTree = []
            this.getBizUserChild()
          } else {
            if (!this.bizTree.length) this.getBizUserChild()
          }
          break
      }
    },
    handleCheckChange(data) {
      let flag = false
      this.selectList.forEach((item, index) => {
        if (item.id === data.id) {
          flag = true
          this.selectList.splice(index, 1)
        }
      })
      if (!flag) {
        this.selectList.push(data)
      }
      this.selectList.forEach((item) => {
        this.selectListIds.push(item.id)
      })
    },
    nodeClick(data) {
      this.activeNodeId = data.id
      switch (this.activeName) {
        case 'org':
          if (!this.treeIds.orgIds.includes(data.id)) {
            this.treeIds.orgIds.push(data.id)
            this.getOrgUserTree(data.id)
          }
          break
        case 'biz':
          if (!this.treeIds.bizIds.includes(data.id)) {
            this.treeIds.bizIds.push(data.id)
            this.getBizUserChild(data.id)
          }
          break
      }
    },
    handleUnselect(item) {
      this.selectList = this.selectList.filter((i) => i.id != item.id)
      this.$refs.tree.setCheckedKeys(this.selectList.map((i) => i.id))
    },
    handleUnselectAll() {
      this.selectList = []
      this.$refs.tree.setCheckedKeys([])
    },
    close() {
      this.clear()
      this.$emit('update:visible', false)
    },
    clear() {
      this.tagId = null
      this.selectList = []
      this.oldSelectList = []
      this.selectListIds = []
      this.$refs.tree.setCheckedKeys([])

      // this.$refs.bizTree.setCheckedKeys([])
      this.activeName = 'org'
      this.orgTree = []
      this.bizTree = []
      this.treeIds = {
        orgIds: [],
        bizIds: []
      }
    },
    init(data) {
      this.tagId = data.tagId
      const list = data.userList.map((user) => ({ ...user, id: user.userId }))
      this.selectList = list.slice()
      this.oldSelectList = list.slice()
      this.selectList.forEach((item) => {
        this.selectListIds.push(item.id)
      })

      this.$emit('update:visible', true)
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.selectList.map((i) => i.id))
      })
    },
    searchLoadData: _.debounce(function() {
      switch (this.activeName) {
        case 'org':
          if (!this.filterText) this.activeNodeId = 0
          this.orgTree = []
          this.treeIds.orgIds = []
          this.getOrgUserTree(this.activeNodeId, true)
          break
        case 'biz':
          if (!this.filterText) this.activeNodeId = 0
          this.bizTree = []
          this.treeIds.bizIds = []
          this.getBizUserChild(this.activeNodeId, true)
          break
      }
    }, 500),
    getOrgUserTree(parentId = 0, search) {
      let params = {
        parentId
      }
      if (search && this.filterText) {
        params.search = this.filterText
        delete params.parentId
      }
      this.loading = true
      getOrgUserChild(params)
        .then((res) => {
          this.resolveTree(res)
        })
        .finally(() => {
          this.loading = false
        })
    },
    getBizUserChild(parentId = 0, search) {
      let params = {
        parentId
      }
      if (search && this.filterText) {
        params.search = this.filterText
        delete params.parentId
      }
      this.loading = true
      getBizUserChild(params)
        .then((res) => {
          this.resolveBizTree(res)
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * 比较新旧list，新增,减少的数据分别添加标识
     * @param {Object} newIdList
     * @param {Object} oldIdList
     */
    diff(newIdList, oldIdList) {
      // 要添加的
      const addIdList = this._.difference(newIdList, oldIdList)
      // 要删除的
      const removeIdList = this._.difference(oldIdList, newIdList)

      const result = addIdList
        .map((id) => ({
          userId: id,
          operatorType: 'Add'
        }))
        .concat(
          removeIdList.map((id) => ({
            userId: id,
            operatorType: 'Del'
          }))
        )

      return result
    },
    handleSubmit() {
      let userIdArr = this.selectList.map((item) => {
        return item.userId
      })
      let params = {
        // roleId: this.roleId || this.$route.query.roleId,
        // userId: userIdArr.join(',')

        groupId: this.roleId || this.$route.query.groupId,
        userIds: userIdArr
      }
      if (_.isEmpty(userIdArr)) {
        this.$message.error('请添加用户')
      } else {
        this.submitting = true
        addGroupUser(params)
          .then(() => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.close()
            this.$emit('after-submit')
          })
          .finally(() => {
            this.submitting = false
          })
      }
    },
    resolveTree(tree) {
      if (tree.orgs.length > 0) {
        tree.orgs.forEach((node) => {
          if (['Enterprise', 'Company', 'Department', 'Group'].includes(node.type))
            node.disabled = true
        })
      }
      if (tree.users.length > 0) {
        tree.users.forEach((node) => {
          node.id = node.userId
        })
      }
      tree.orgs = [...tree.orgs, ...tree.users]

      const loop = (treeData) => {
        if (treeData.length > 0) {
          treeData.forEach((item) => {
            if (item.id === this.activeNodeId && this.filterText === '') {
              item.children = [...tree.orgs]
            } else if (this.filterText !== '') {
              this.orgTree = _.cloneDeep(tree.orgs)
            } else if (item.children && item.children.length > 0) {
              loop(item.children)
            }
          })
        } else {
          this.orgTree = _.cloneDeep(tree.orgs)
        }
      }
      loop(this.orgTree)
      this.updateInfo += 1
    },
    resolveBizTree(tree) {
      if (tree.orgs.length > 0) {
        tree.orgs.forEach((node) => {
          if (
            ['ProductLine', 'Enterprise', 'Department', 'Product', 'PDU', 'BusinessGroup'].includes(
              node.type
            )
          )
            node.disabled = true
        })
      }
      if (tree.users.length > 0) {
        tree.users.forEach((node) => {
          node.id = node.userId
        })
      }
      tree.orgs = [...tree.orgs, ...tree.users]

      const loop = (treeData) => {
        if (treeData.length > 0) {
          treeData.forEach((item) => {
            if (item.id === this.activeNodeId && this.filterText === '') {
              item.children = [...tree.orgs]
            } else if (this.filterText !== '') {
              this.bizTree = _.cloneDeep(tree.orgs)
            } else if (item.children && item.children.length > 0) {
              loop(item.children)
            }
          })
        } else {
          this.bizTree = _.cloneDeep(tree.orgs)
        }
      }
      loop(this.bizTree)
      this.bizUpdateInfo += 1
    },
    dialogOpen() {
      this.handleTab()
    }
  }
}
</script>
<style lang="scss">
.content-wr {
  display: flex;
  .left {
    width: 60%;
    padding-right: 20px;
  }
  .right {
    border-left: 1px solid #f2f2f2;
    width: 40%;
    padding-left: 20px;
    .title {
      line-height: 40px;
    }
    .el-tag {
      margin-right: 12px;
      margin-bottom: 8px;
    }
  }
}
</style>
