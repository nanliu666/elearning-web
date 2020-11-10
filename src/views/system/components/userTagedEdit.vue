<template>
  <el-dialog
    title="添加成员"
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
        />
        <el-tree
          v-show="!orgSearch"
          ref="orgTree"
          class="orgTree"
          :load="lazyLoadOrgTree"
          :props="treeProps"
          check-strictly
          lazy
          node-key="_nodeKey"
          show-checkbox
          @check="handleCheckItem"
        />
        <el-tree
          v-show="orgSearch"
          ref="orgTreeSearch"
          class="orgTree"
          :data="orgSearchData"
          :props="treeProps"
          check-strictly
          lazy
          node-key="_nodeKey"
          show-checkbox
          @check="handleCheckItem"
        />
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
          v-for="item in selected"
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
import { createTagUser, getOrgUserChild } from '@/api/system/user'

const PROCESS_TYPE = {
  All: 'All',
  Biz: 'Biz',
  Org: 'Org',
  User: 'User'
}

const loadOrgTree = async ({ parentId, search }) => {
  search = _.trim(search)
  // 只能传入一个参数 当传入search的时候不使用parentId
  const data = await getOrgUserChild(_.pick({ parentId, search }, search ? 'search' : 'parentId'))
  // 在这里处理两个数组为树形组件需要的结构
  const { orgs, users } = data
  const ORG_PROPS = { type: PROCESS_TYPE.Org }
  const USER_PROPS = { isLeaf: true, type: PROCESS_TYPE.User }
  return _.concat(
    _.map(orgs, (item) =>
      _.assign(
        { _nodeKey: `${parentId || '0'}_${item.id}`, bizId: item.id, bizName: item.name },
        item,
        ORG_PROPS
      )
    ),
    _.map(users, (item) =>
      _.assign(
        {
          _nodeKey: `${parentId || '0'}_${item.userId}`,
          bizId: item.userId,
          bizName: item.name
        },
        item,
        USER_PROPS
      )
    )
  )
}

export default {
  name: 'UserTagedEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      submitting: false,
      orgSearch: '',
      props: {
        disabled: (data) => data.type !== 'user' && data.users.length === 0,
        label: (item) => item.orgName || item.name,
        children: 'children'
      },
      defaultProps: {
        label: (item) => item.name,
        children: 'children'
      },
      selected: [],
      oldSelectList: [],
      orgSearchData: [],
      tagId: null
    }
  },
  computed: {
    // 树形组件的props属性
    treeProps() {
      const props = {
        disabled: 'disabled',
        label: 'bizName',
        isLeaf: 'isLeaf',
        children: 'children'
      }
      return props
    }
  },
  watch: {
    selected(val) {
      const { orgTree, orgTreeSearch } = this.$refs
      ;[orgTree, orgTreeSearch].forEach((ref) => {
        if (_.isNil(ref)) return
        ref.setCheckedKeys(_.map(val, (item) => item._nodeKey))
      })
    },
    // 在组织架构下使用查询参数
    orgSearch: _.debounce(function(search) {
      if (!search) return
      this.loading = true
      loadOrgTree({ search })
        .then((res) => {
          this.orgSearchData = _.map(this.thruHandler(res), (item) =>
            _.assign({ isLeaf: true }, item)
          )
        })
        .finally(() => (this.loading = false))
    }, 500)
  },
  methods: {
    handleCheckItem(node, { checkedNodes }) {
      if (_.some(checkedNodes, (item) => item.bizId === node.bizId)) {
        this.handleUncheckItem(node) // 防止选中不同节点下的相同数据
        this.selected.push(node)
      } else {
        // 连续选中同一个目标则uncheck该选项
        this.handleUncheckItem(node)
      }
    },
    handleUncheckItem(item) {
      const { bizId } = item
      this.selected = _.reject(this.selected, { bizId })
    },
    handleUnselect(item) {
      this.selected = this.selected.filter((i) => i.id != item.id)
      // this.$refs.tree.setCheckedKeys(this.selected.map((i) => i.id))
    },
    handleUnselectAll() {
      this.selected = []
      // this.$refs.tree.setCheckedKeys([])
    },
    close() {
      this.clear()
      this.$emit('update:visible', false)
    },
    clear() {
      this.tagId = null
      this.selected = []
      this.oldSelectList = []
    },
    init(data) {
      this.tagId = data.tagId
      const list = data.userList.map((user) => ({ ...user, id: user.userId }))
      this.selected = list.slice()
      this.oldSelectList = list.slice()

      this.$emit('update:visible', true)
    },

    lazyLoadOrgTree(node, resolve) {
      const parentId = node.level > 0 ? node.data.bizId : '0'
      if (parentId === '0') this.loading = true
      loadOrgTree({ parentId })
        .then((res) => resolve(this.thruHandler(res)))
        .finally(() => (this.loading = false))
    },
    thruHandler(arr) {
      // 不可以选择组织的时候将disable所有的type不为user类型的项
      arr = _.map(arr, (item) =>
        _.assign(
          {
            disabled: !_.eq(item.type, PROCESS_TYPE.User)
          },
          item
        )
      )

      return arr
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
      this.submitting = true
      createTagUser(
        this.tagId,
        this.diff(
          this.selected.map((i) => i.userId),
          this.oldSelectList.map((i) => i.userId)
        )
      )
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
</script>
<style lang="scss">
.content-wr {
  display: flex;
  .left {
    width: 60%;
    padding-right: 20px;
    .orgTree {
      margin-top: 12px;
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
