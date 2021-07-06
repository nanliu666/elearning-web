<template>
  <el-dialog
    title="添加用户"
    :visible="visible"
    width="800px"
    append-to-body
    :before-close="close"
  >
    <div class="content-wr">
      <div class="left">
        <el-input
          v-model="orgSearch"
          placeholder="成员名称"
          @input="searchLoadData"
        />
        <el-tabs v-model="activeTab">
          <el-tab-pane
            label="组织架构"
            name="org"
          >
            <div class="tree__container">
              <el-tree
                v-if="!orgSearch"
                ref="orgTree"
                show-checkbox
                :load="lazyLoadOrgTree"
                node-key="userId"
                lazy
                :props="treeProps"
                @check="handleCheckChange"
              />
              <el-tree
                v-show="orgSearch"
                ref="orgTreeSearch"
                :data="orgSearchData"
                :props="treeProps"
                lazy
                node-key="userId"
                show-checkbox
                @check="handleCheckChange"
              />
            </div>
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
import { getOrgUserChild } from '@/api/system/user'
import { addGroupUser } from '@/api/system/role'
const NODE_TYPE = {
  All: 'All',
  Org: 'Org',
  User: 'User'
}
const loadOrgTree = async ({ parentId, parentPath, search, orgName }) => {
  search = _.trim(search)
  // 只能传入一个参数 当传入search的时候不使用parentId
  const data = await getOrgUserChild(_.pick({ parentId, search }, search ? 'search' : 'parentId'))
  // 在这里处理两个数组为树形组件需要的结构
  const { orgs, users } = data
  const ORG_PROPS = { type: NODE_TYPE.Org }
  const USER_PROPS = { isLeaf: true, type: NODE_TYPE.User }
  const target = _.concat(
    _.map(orgs, (item) =>
      _.assign(
        {
          path: `${parentPath || '0'}_${item.id}`,
          bizId: item.id,
          bizName: item.name,
          disabled: ['Enterprise', 'Company', 'Department', 'Group'].includes(item.type)
        },
        item,
        ORG_PROPS
      )
    ),
    _.map(users, (item) =>
      _.assign(
        {
          path: `${parentPath || '0'}_${item.userId}`,
          bizId: item.userId,
          bizName: item.name,
          orgName,
          orgId: parentId
        },
        item,
        USER_PROPS
      )
    )
  )
  return target
}
export default {
  name: 'AddUserDialogGrounp',
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
      orgSearchData: [],
      activeTab: 'org',
      loading: false,
      submitting: false,
      orgSearch: '',
      selectList: []
    }
  },
  computed: {
    // 当前哪个树用于清除选中状态
    refTree() {
      return !this.orgSearch ? 'orgTree' : 'orgTreeSearch'
    },
    // 树形组件的props属性
    treeProps() {
      return {
        disabled: 'disabled',
        label: 'bizName',
        isLeaf: 'isLeaf',
        children: 'children'
      }
    }
  },
  methods: {
    /**
     * 点击check盒子切换右侧选中效果
     */
    handleCheckChange(node) {
      const index = _.findIndex(this.selectList, (item) => {
        return item.bizId === node.bizId
      })
      if (index === -1) {
        this.selectList.push(node)
      } else {
        // 连续选中同一个目标则uncheck该选项
        this.selectList.splice(index, 1)
      }
    },
    /**
     * 清除选中
     */
    handleUnselect(item) {
      this.selectList = this.selectList.filter((i) => i.bizId != item.bizId)
      this.$refs[this.refTree].setCheckedKeys(this.selectList.map((i) => i.bizId))
    },
    handleUnselectAll() {
      this.selectList = []
      this.$refs[this.refTree].setCheckedKeys([])
    },
    close() {
      this.clear()
      this.$emit('update:visible', false)
    },
    clear() {
      this.selectList = []
      this.$refs[this.refTree].setCheckedKeys([])
    },
    /**
     * 搜索
     */
    searchLoadData: _.debounce(function(search) {
      if (!search) return
      this.loading = true
      loadOrgTree({ search })
        .then((res) => {
          this.orgSearchData = _.map(res, (item) => _.assign(item))
        })
        .finally(() => (this.loading = false))
    }, 500),
    async lazyLoadOrgTree(node, resolve) {
      const parentId = node.level > 0 ? node.data.bizId : '0'
      let orgName = {}
      if (node) {
        orgName = node.data && node.data.type === 'Org' ? node.data.bizName : ''
      }
      if (parentId === '0') this.loading = true
      const target = await loadOrgTree({
        parentId,
        orgName
      })
      this.loading = false
      resolve(target)
    },
    handleSubmit() {
      let userIdArr = this.selectList.map((item) => {
        return item.userId
      })
      let params = {
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
    }
  }
}
</script>
<style lang="scss">
.content-wr {
  display: flex;
  height: 50vh;
  overflow: hidden;
  .left {
    width: 60%;
    padding-right: 20px;
    .tree__container {
      height: 40vh;
      overflow: auto;
    }
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
