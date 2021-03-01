<template>
  <el-dialog
    class="user-select"
    :title="title"
    :visible.sync="innerVisible"
    width="800px"
    append-to-body
  >
    <div class="content-wr">
      <div
        v-loading="loading"
        class="left"
      >
        <el-tabs
          v-if="!isRange"
          v-model="tab"
        >
          <el-tab-pane
            label="组织架构"
            name="Org"
          />
          <el-tab-pane
            label="外部联系人"
            name="OuterUser"
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
              check-on-click-node
              lazy
              node-key="_nodeKey"
              show-checkbox
              @check="handleCheckItem"
            />
            <el-tree
              v-show="orgSearch"
              ref="orgTreeSearch"
              :data="orgSearchData"
              :props="treeProps"
              check-strictly
              check-on-click-node
              lazy
              node-key="_nodeKey"
              show-checkbox
              @check="handleCheckItem"
            />
          </div>
        </div>
        <div
          v-show="tab === 'OuterUser'"
          class="outer-user"
        >
          <el-input
            v-model.trim="outerParams.search"
            placeholder="搜索姓名或手机号码"
          />
          <ul
            ref="outerUser"
            @scroll="debounceOuterScrollHandler"
          >
            <li
              v-for="item in outerData"
              :key="item.bizId"
            >
              <el-checkbox
                :value="!!_.find(selected, { bizId: item.bizId })"
                @change="handleSelectUser(item)"
              ></el-checkbox>

              {{ item.bizName }}{{ item.phonenum ? `(${item.phonenum})` : '' }}
            </li>
          </ul>
        </div>
      </div>
      <div class="right">
        <div>
          <span class="title">已选：</span>
          <span
            v-show="limit"
            class="selected-tip"
          >{{ `(${selected.length}/${limit}人)` }}</span>
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
        @click="close"
      >取 消</el-button>
      <el-button
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
import { getOrgUserChild, getOuterUser } from '@/api/system/user'
const SEARCH_DELAY = 500

const NODE_TYPE = {
  All: 'All',
  Org: 'Org',
  User: 'User'
}
const loadOrgTree = async ({ parentId, search, isRange }) => {
  search = _.trim(search)
  let data
  if (isRange) {
    data = await getOrgUserChild({ parentId: parentId, search: search })
  } else {
    // 只能传入一个参数 当传入search的时候不使用parentId
    data = await getOrgUserChild(_.pick({ parentId, search }, search ? 'search' : 'parentId'))
  }

  //过滤被冻结的用户
  data.users = data.users.filter((x) => x.userStatus !== '2')
  // 在这里处理两个数组为树形组件需要的结构
  const { orgs, users } = data
  const ORG_PROPS = { type: NODE_TYPE.Org }
  const USER_PROPS = { isLeaf: true, type: NODE_TYPE.User }
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
  name: 'UserSelect',
  props: {
    // 初始化有数据,例如预览时
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否为单选，默认为多选
    isSingle: {
      type: Boolean,
      default: false
    },
    // org属性用为false时候只能选中用户，不能选中组织
    org: {
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
        return '请选择审批人'
      }
    },
    // 选择人数限制
    limit: { type: Number, default: null },
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
      outerParams: {
        pageNo: 1,
        pageSize: 15,
        search: '',
        loaded: false
      },
      outerData: [],
      // 存放node对象
      selected: [],
      debounceOuterScrollHandler: _.debounce(this.handleOuterScroll, SEARCH_DELAY),
      debounceOuterSearchFn: _.debounce(this.handleSearchOuterUser, SEARCH_DELAY)
    }
  },
  computed: {
    // 树形组件的props属性
    treeProps() {
      const disabled = this.checkDisabled
      const props = {
        disabled,
        label: 'bizName',
        isLeaf: ({ type }) => type === NODE_TYPE.User,
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
  created() {
    this.loadOuterUser()
  },
  watch: {
    value(val) {
      this.selected = val.slice()
    },
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
      //如果查询范围内的  添加parentId
      let params = this.isRange
        ? {
            search,
            isRange: this.isRange,
            parentId: 1
          }
        : {
            search
          }
      loadOrgTree(params)
        .then((res) => {
          this.orgSearchData = _.map(this.thruHandler(res), (item) =>
            _.assign({ isLeaf: true }, item)
          )
        })
        .finally(() => (this.loading = false))
    }, SEARCH_DELAY),
    'outerParams.search'() {
      this.debounceOuterSearchFn()
    }
  },
  methods: {
    /**
     * 处理选中单个项
     * @param {object} node 树形组件的node结节
     */
    handleCheckItem(node, { checkedNodes }) {
      // 如果disabled则不能check项
      if (this.checkDisabled(node)) return
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

    // handleClickItem(data, node) {
    //   node = node.data
    //   // 只处理leaf节点
    //   if (!_.get(node, this.treeProps.isLeaf)) return
    //   //
    //   if (this.checkDisabled(node)) return
    //   const nextSelected = _.includes(this.selected, node)
    //     ? _.reject(this.selected, node)
    //     : _.concat(this.selected, node)
    //   this.handleCheckItem(node, { checkedNodes: nextSelected })
    // },
    // 判断节点是否可勾选
    checkDisabled({ disabled }) {
      return disabled || (this.limit && this.selected.length >= this.limit)
    },
    close() {
      this.selected = []
      this.innerVisible = false
    },

    handleSubmit() {
      const { selected } = this
      this.$emit('submit', _.uniqBy(selected, 'bizId'))
      this.close()
    },
    handleSelectUser(user) {
      const index = _.findIndex(this.selected, { bizId: user.bizId })
      if (index > -1) {
        this.selected = _.filter(this.selected, (item, i) => i != index)
      } else {
        this.selected.push(user)
      }
    },
    handleOuterScroll() {
      const ref = this.$refs.outerUser
      if (ref.scrollTop + ref.offsetHeight >= ref.scrollHeight) {
        this.loadOuterUser()
      }
    },
    handleSearchOuterUser() {
      this.outerParams.loaded = false
      this.outerParams.pageNo = 1
      this.loadOuterUser(true)
    },
    async loadOuterUser(isRefresh) {
      if (this.outerParams.loaded) {
        return
      }
      const { pageNo, pageSize, search } = this.outerParams
      this.loading = true
      getOuterUser({ pageNo, search, pageSize })
        .then((res) => {
          if (_.size(res.data) > 0) {
            const data = _.map(res.data, (item) =>
              _.assign(item, {
                path: item.userId,
                bizId: item.userId,
                bizName: item.name,
                type: NODE_TYPE.User
              })
            )
            if (isRefresh) {
              this.outerData = data
            } else {
              this.outerData = _.concat(this.outerData, data)
            }
          } else {
            this.outerParams.loaded = true
          }
          this.outerParams.pageNo = pageNo + 1
        })
        .finally(() => {
          this.loading = false
        })
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

    // 数据处理中间函数
    thruHandler(arr) {
      // disabled: ({ type }) => !(this.org || _.eq(type, PROCESS_TYPE.User)),
      if (!this.org) {
        // 不可以选择组织的时候将disable所有的type不为user类型的项
        arr = _.map(arr, (item) =>
          _.assign(
            {
              disabled: !_.eq(item.type, NODE_TYPE.User)
            },
            item
          )
        )
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
.outer-user {
  ul {
    overflow: auto;
    padding-top: 8px;
    height: 340px;
    li {
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
