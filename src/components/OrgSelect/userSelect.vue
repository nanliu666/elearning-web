<template>
  <el-dialog
    class="user-select"
    :title="title"
    :visible="visible"
    width="800px"
    append-to-body
    :before-close="close"
  >
    <div
      v-loading="loading"
      class="content-wr"
    >
      <div class="left">
        <div v-if="!isPreviewSelect || initData.length === 0">
          <el-tabs
            v-if="!isRange"
            v-model="tab"
          >
            <el-tab-pane
              label="组织架构"
              name="Org"
            />
            <el-tab-pane
              label="业务架构"
              name="Biz"
            />
          </el-tabs>
          <div v-show="tab === 'Org'">
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
                check-strictly
                lazy
                node-key="_nodeKey"
                show-checkbox
                @check="handleCheckItem"
                @node-click="handleClickItem"
              />
              <el-tree
                v-show="orgSearch"
                ref="orgTreeSearch"
                :data="orgSearchData"
                :props="treeProps"
                check-strictly
                lazy
                node-key="_nodeKey"
                show-checkbox
                @node-click="handleClickItem"
                @check="handleCheckItem"
              />
            </div>
          </div>
          <div v-show="tab === 'Biz'">
            <el-input
              v-model="bizSearch"
              placeholder="搜索业务部门或成员姓名"
            />
            <div class="tree">
              <el-tree
                v-show="!bizSearch"
                ref="bizTree"
                :load="lazyLoadBizTree"
                :props="treeProps"
                check-strictly
                lazy
                node-key="_nodeKey"
                show-checkbox
                @node-click="handleClickItem"
                @check="handleCheckItem"
              />
              <el-tree
                v-show="bizSearch"
                ref="bizTreeSearch"
                :data="bizSearchData"
                :props="treeProps"
                check-strictly
                lazy
                node-key="_nodeKey"
                show-checkbox
                @node-click="handleClickItem"
                @check="handleCheckItem"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <el-tree
            ref="bizTree"
            :load="lazyLoadPreviewData"
            :props="treeProps"
            check-strictly
            lazy
            node-key="_nodeKey"
            show-checkbox
            @node-click="handleClickItem"
            @check="handleCheckItem"
          />
        </div>
      </div>
      <div class="right">
        <div>
          <span
            v-if="!isRange"
            class="title"
          >已选：</span>
          <span
            v-else
            class="title"
          >发布范围： <span class="company">企业内部</span> </span>
          <span style="float:right;" />
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
              class="el-icon-error"
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
        @click="close"
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
import { getBizUserChild, getOrgUserChild } from '@/api/system/user'
const SEARCH_DELAY = 500
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
const loadBizTree = async ({ parentId, search }) => {
  search = _.trim(search)
  // 只能传入一个参数 当传入search的时候不使用parentId
  const data = await getBizUserChild(_.pick({ parentId, search }, search ? 'search' : 'parentId'))
  // 在这里处理两个数组为树形组件需要的结构
  const { bizs, users } = data
  const BIZ_PROPS = { type: 'Biz' }
  const USER_PROPS = { isLeaf: true, type: 'User' }
  return _.concat(
    _.map(bizs, (item) =>
      _.assign(
        {
          _nodeKey: `${parentId || '0'}_${item.id}`,
          bizId: item.id,
          bizName: item.name
        },
        item,
        BIZ_PROPS
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
    // 初始化有数据,例如预览时
    initData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 专门为预览做的选择器，默认不是
    isPreviewSelect: {
      type: Boolean,
      default: false
    },
    // 是否为单选，默认为多选
    isSingle: {
      type: Boolean,
      default: false
    },
    // org属性用为false时候只能选中用户，不能选中组织
    org: Boolean,
    visible: {
      type: Boolean,
      default: false
    },

    // 是否只显示部门,会在数据中过滤用户类型
    isDepartmentOnly: Boolean,
    title: {
      type: String,
      default: () => {
        return '请选择审批人'
      }
    },
    //新闻公告的新建公告的发布范围要用到的
    isRange: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      tab: 'Org',
      loading: false,
      orgSearch: '',
      orgSearchData: [],
      bizSearch: '',
      bizSearchData: [],
      // 存放node对象
      selected: []
    }
  },
  computed: {
    // 树形组件的props属性
    treeProps() {
      const props = {
        // disabled: ({ type }) => !(this.org || _.eq(type, PROCESS_TYPE.User)),
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
      const { orgTree, bizTree, orgTreeSearch, bizTreeSearch } = this.$refs
      ;[orgTree, bizTree, orgTreeSearch, bizTreeSearch].forEach((ref) => {
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
    }, SEARCH_DELAY),

    // 在业务架构下使用查询参数
    bizSearch: _.debounce(function(search) {
      if (!search) return
      this.loading = true
      loadBizTree({ search })
        .then((res) => {
          this.bizSearchData = _.map(this.thruHandler(res), (item) =>
            _.assign({ isLeaf: true }, item)
          )
        })
        .finally(() => (this.loading = false))
    }, SEARCH_DELAY)
  },
  created() {
    // this.title =
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
        this.handleUncheckItem(node) // 防止选中不同节点下的相同数据
        // 如果是单选模式
        if (this.isSingle) {
          this.selected = [node]
        } else {
          this.selected.push(node)
        }
      } else {
        // 连续选中同一个目标则uncheck该选项
        this.handleUncheckItem(node)
      }
    },

    handleUncheckItem(item) {
      const { bizId } = item
      this.selected = _.reject(this.selected, { bizId })
    },

    handleClickItem(data, node) {
      node = node.data
      // 只处理leaf节点
      if (!_.get(node, this.treeProps.isLeaf)) return
      const nextSelected = _.includes(this.selected, node)
        ? _.reject(this.selected, node)
        : _.concat(this.selected, node)
      this.handleCheckItem(node, { checkedNodes: nextSelected })
    },

    close() {
      this.selected = []
      this.$emit('update:visible', false)
    },

    init(data) {
      // 处理输入为null和没有参数输入的情况
      if (_.isNil(data)) data = []
      this.selected = _.cloneDeep(data)
      this.$emit('update:visible', true)
    },

    handleSubmit() {
      const { selected } = this
      this.$emit('addUser', _.uniqBy(selected, 'bizId'))
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
      loadOrgTree({ parentId })
        .then((res) => resolve(this.thruHandler(res)))
        .finally(() => (this.loading = false))
    },
    /**
     * 加载预览数据
     */
    lazyLoadPreviewData(node, resolve) {
      if (node.level === 0) {
        resolve(this.thruHandler(this.initData))
      } else {
        let nodeData = _.filter(this.initData, (item) => {
          return item.id === node.data.id
        })[0]
        if (nodeData.type !== 'User') {
          let ObjectF = {
            Org: loadOrgTree,
            Biz: loadBizTree
          }
          ObjectF[nodeData.type]({ parentId: nodeData.id }).then((res) => {
            resolve(this.thruHandler(res))
          })
        }
      }
    },
    /**
     * 懒加载组织树形组件数据
     * @param {string} [parentId="0"] 父级id
     * @returns {void}
     */
    lazyLoadBizTree(node, resolve) {
      const parentId = node.level > 0 ? node.data.id : '0'
      if (parentId === '0') this.loading = true
      loadBizTree({ parentId })
        .then((res) => resolve(this.thruHandler(res)))
        .finally(() => (this.loading = false))
    },

    // 数据处理中间函数
    thruHandler(arr) {
      // disabled: ({ type }) => !(this.org || _.eq(type, PROCESS_TYPE.User)),
      if (!this.org) {
        // 不可以选择组织的时候将disable所有的type不为user类型的项
        arr = _.map(arr, (item) =>
          _.assign(
            {
              disabled: !_.eq(item.type, PROCESS_TYPE.User)
            },
            item
          )
        )
      }
      if (this.isDepartmentOnly) {
        // 只可以选择部门, 过滤所有的User类型
        arr = _.reject(arr, { type: PROCESS_TYPE.User })
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
