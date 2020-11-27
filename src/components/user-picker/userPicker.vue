<template>
  <el-dialog
    class="user-select"
    :title="title"
    :visible.sync="innerVisible"
    width="800px"
    append-to-body
    :before-close="close"
  >
    <div
      v-loading="loading"
      class="content-wr"
    >
      <div class="left">
        <div>
          <el-tabs v-model="activeTab">
            <el-tab-pane
              label="组织架构"
              name="Org"
            />
          </el-tabs>
          <div v-show="activeTab === 'Org'">
            <el-input
              v-model="orgSearch"
              placeholder="搜索组织部门或成员姓名"
            />
            <div class="tree">
              <el-tree
                v-show="!orgSearch"
                ref="orgTree"
                :load="lazyLoadOrgTree"
                :props="treeProps"
                lazy
                node-key="path"
                show-checkbox
                @check="handleCheckItem"
              />
              <el-tree
                v-show="orgSearch"
                ref="orgTreeSearch"
                :data="orgSearchData"
                :props="treeProps"
                lazy
                node-key="path"
                show-checkbox
                @check="handleCheckItem"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div>
          <span class="title">已选：</span>
        </div>

        <div
          v-for="item of _(selected)
            .sortBy(['type', 'bizName'])
            .uniqBy('bizId')
            .value()"
          :key="item.bizId"
          class="info flex flex-justify-between flex-items"
        >
          <div class="flex flex-justify-between flex-items">
            <!-- 用户图标 -->
            <i
              v-if="item.type == 'Org'"
              class="iconfont icon-usercircle2 imgss"
            />
            <i
              v-else-if="item.type === 'User'"
              class="iconfont  icon-approval-checkin-bicolor imgs"
            />
            {{ item.bizName }}
          </div>
          <div class="icon">
            <i
              class="el-icon-error pointer"
              @click="() => handleUncheckItem(item)"
            />
          </div>
        </div>
      </div>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="medium"
        @click="handleClose"
      >取 消</el-button>
      <el-button
        v-loading="loading"
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
const SEARCH_DELAY = 200
const NODE_TYPE = {
  All: 'All',
  Org: 'Org',
  User: 'User'
}

const loadOrgTree = async ({ parentId, parentPath, search }) => {
  search = _.trim(search)
  // 只能传入一个参数 当传入search的时候不使用parentId
  const data = await getOrgUserChild(_.pick({ parentId, search }, search ? 'search' : 'parentId'))
  // 在这里处理两个数组为树形组件需要的结构
  const { orgs, users } = data
  const ORG_PROPS = { type: NODE_TYPE.Org }
  const USER_PROPS = { isLeaf: true, type: NODE_TYPE.User }
  return _.concat(
    _.map(orgs, (item) =>
      _.assign(
        { path: `${parentPath || '0'}_${item.id}`, bizId: item.id, bizName: item.name },
        item,
        ORG_PROPS
      )
    ),
    _.map(users, (item) =>
      _.assign(
        {
          path: `${parentPath || '0'}_${item.userId}`,
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
  name: 'UserPicker',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    // 是否为单选，默认为多选
    isSingle: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: () => {
        return '请选择'
      }
    }
  },
  data() {
    return {
      activeTab: 'Org',
      loading: false,
      orgSearch: '',
      orgSearchData: [],

      // 存放node对象
      selected: []
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
    },
    innerVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },

  watch: {
    value(val) {
      this.selected = val.slice()
    },
    selected(val) {
      const { orgTree, orgTreeSearch } = this.$refs
      ;[orgTree, orgTreeSearch].forEach((ref) => {
        if (_.isNil(ref)) return
        ref.setCheckedKeys(_.map(val, (item) => item.path))
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
    }, SEARCH_DELAY)
  },

  methods: {
    /**
     * 处理选中单个项
     * @param {object} node 树形组件的node结节
     */
    handleCheckItem(node, { checkedNodes }) {
      // 如果disabled则不能check项
      if (_.get(node, this.treeProps.disabled)) return
      if (_.some(checkedNodes, (item) => item.bizId === node.bizId)) {
        // this.handleUncheckItem(node) // 防止选中不同节点下的相同数据
        if (node.type !== NODE_TYPE.User) {
          this.selected = _.reject(this.selected, (item) => _.includes(item.path, node.path))
        }
        // 如果是单选模式
        if (this.isSingle) {
          this.selected = [node]
        } else {
          this.selected.push(node)
        }
      } else {
        // 连续选中同一个目标则uncheck该选项
        this.handleUncheckItem(node, checkedNodes)
      }
    },
    handleUncheckItem(item, checkedNodes) {
      const { bizId } = item
      if (_.find(this.selected, { bizId })) {
        this.selected = _.reject(this.selected, { bizId })
      } else {
        // 当前节点不在selected中则父节点被勾选时，取消勾选子节点
        this.selected = _(this.selected)
          // 去除父节点
          .reject((i) => _.includes(item.path, i.path) || _.includes(i.path, item.path))
          // 添加其他节点
          .concat(this.getCheckedNodes(checkedNodes))
          .value()
      }
    },
    // 过滤掉已勾选的父节点下的所有子节点
    getCheckedNodes(checkedNodes) {
      const orgs = _.filter(checkedNodes, { type: NODE_TYPE.Org })
      orgs.forEach((org) => {
        checkedNodes = _.filter(
          checkedNodes,
          (node) => node.path === org.path || !_.includes(node.path, org.path)
        )
      })
      return checkedNodes
    },
    close() {
      this.innerVisible = false
    },
    handleClose() {
      this.selected = this.value.slice()
      this.close()
    },

    handleSubmit() {
      this.$emit('input', _.uniqBy(this.selected, 'bizId'))
      this.close()
    },
    /**
     * 懒加载组织树形组件数据
     * @param {string} [parentId="0"] 父级id
     * @returns {void}
     */
    lazyLoadOrgTree(node, resolve) {
      const parentId = node.level > 0 ? node.data.bizId : '0'
      if (parentId === '0') this.loading = true
      loadOrgTree({ parentId, parentPath: node.level > 0 ? node.data.path : '0' })
        .then((res) => resolve(this.thruHandler(res)))
        .finally(() => (this.loading = false))
    },
    // 数据处理中间函数
    thruHandler(arr) {
      if (this.isDepartmentOnly) {
        // 只可以选择部门, 过滤所有的User类型
        arr = _.reject(arr, { type: NODE_TYPE.User })
      }
      return arr
    }
  }
}
</script>

<style lang="stylus" scoped>
.user-select {
  .tree {
    // 隐藏disabled属性的树形组件的checkbox输入框。
    >>> .el-checkbox.is-disabled {
      display: none
    }
  }
}
.content-wr {
  display: flex;
  border: 1px solid #efefef;
  .left {
    width: 60%;
    padding-right: 20px;
    padding: 20px;
  }
  .right {
    border-left: 1px solid #f2f2f2;
    width: 40%;
    padding-left: 20px;
    height: 470px;
    overflow-y: auto;
    .title {
      line-height: 40px;
    }
    .el-tag {
      margin-right: 12px;
      margin-bottom: 8px;
    }
  }
}
.tree {
  height: 400px;
  overflow-y: auto;
  padding-top: 10px;
}
.info {
  width: 98%;
  margin: 10px 0;
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
  .company{
    color: $primaryColor;
  }
</style>
