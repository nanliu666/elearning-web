<template>
  <div class="content-wr">
    <div
      v-loading="loading"
      class="left"
    >
      <div class="title">
        未选：
      </div>
      <div class="left_box">
        <div
          v-if="selectTypes.includes('Org')"
          v-show="activeTab === 'Org'"
        >
          <el-input
            v-model="orgSearch"
            placeholder="搜索组织部门名称"
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
      <div class="title">
        已选：
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
          > 123 </i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getOrgUserChild, getOuterUser } from '@/api/system/user'
// import ComEmpty from '@/components/common-empty/empty'
import _ from 'lodash'
const SEARCH_DELAY = 200
const NODE_TYPE = {
  All: 'All',
  Org: 'Org',
  User: 'User'
}
const SELECT_TYPE = ['Org', 'OuterUser']

const loadOrgTree = async ({ parentId, parentPath, search, orgName }) => {
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
          bizName: item.name,
          orgName,
          orgId: parentId
        },
        item,
        USER_PROPS
      )
    )
  )
}
export default {
  name: 'UserPicker',
  // components: {
  //   ComEmpty
  // },
  props: {
    // 只选人，选了组织在右侧会显示人
    onlyUser: {
      type: Boolean,
      default: false
    },
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
    },
    // 选择类型，用逗号分隔，可选项包括 Org(组织机构),OuterUser(外部联系人)
    selectType: {
      type: String,
      default: 'Org'
    }
  },
  data() {
    const activeTab = this.selectType.split(',')[0] || 'Org'
    return {
      checkAll: false,
      checkedUsers: [],
      usersNameList: [],
      isIndeterminate: false,
      activeTab,
      loading: false,
      orgSearch: '',
      orgSearchData: [],
      outerParams: {
        pageNo: 1,
        pageSize: 10000,
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
      return {
        disabled: 'disabled',
        label: 'bizName',
        isLeaf: 'isLeaf',
        children: 'children'
      }
    },
    selectTypes() {
      return this.selectType.split(',').filter((item) => SELECT_TYPE.includes(item))
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
      const temp = _.map(this.checkedUsers, (item) => {
        return { name: item }
      })
      const diffName = _.differenceBy(temp, val, 'name')
      const diffIndex = _.findIndex(this.checkedUsers, (item) => {
        return item === _.get(diffName, '[0].name', '')
      })
      if (diffIndex !== -1) {
        this.checkedUsers.splice(diffIndex, 1)
        this.checkAll = false
        this.isIndeterminate = true
      }
    },
    selected(val) {
      const { orgTree, orgTreeSearch } = this.$refs
      ;[orgTree, orgTreeSearch].forEach((ref) => {
        if (_.isNil(ref)) return
        ref.setCheckedKeys(_.map(val, (item) => item.path))
      })
      this.handleSubmit()
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
    'outerParams.search'() {
      this.debounceOuterSearchFn()
    }
  },
  mounted() {
    if (_.includes(this.selectType, 'OuterUser')) {
      this.loadOuterUser()
    }
  },

  methods: {
    // 切换全选与全删
    handleCheckAllChange(val) {
      this.checkedUsers = val ? _.cloneDeep(this.usersNameList) : []
      this.isIndeterminate = false
      // 全删除需要过滤组织选的人,组织
      if (_.isEmpty(this.checkedUsers)) {
        _.pullAllBy(this.selected, this.outerData, 'bizId')
      } else {
        // 半选换全选需要把未选上的加入
        if (_.size(this.checkedUsers) === _.size(this.usersNameList)) {
          this.selected = _.uniqBy([..._.cloneDeep(this.outerData), ...this.selected], 'bizId')
        } else {
          // 全选需要去重
          _.each(this.outerData, (item) => {
            this.handleSelectUser(item)
          })
          this.selected = _.uniqBy(this.selected, 'bizId')
        }
      }
    },
    // 当前是否切换为半选状态
    handleCheckedUserChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.usersNameList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.usersNameList.length
    },
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
          if (!this.onlyUser) {
            this.selected = _.reject(this.selected, (item) => _.includes(item.path, node.path))
          }
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
      const outerIndex = _.findIndex(this.checkedUsers, (userItem) => {
        return item.name === userItem
      })
      if (outerIndex !== -1) {
        this.checkedUsers.splice(outerIndex, 1)
      }
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
      this.$emit('selectedValue', _.uniqBy(this.selected, 'bizId'))
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
            this.usersNameList = _.map(this.outerData, 'name')
          } else {
            this.usersNameList = []
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
      let orgName = {}
      if (node) {
        orgName = node.data && node.data.type === NODE_TYPE.Org ? node.data.bizName : ''
      }
      loadOrgTree({
        parentId,
        parentPath: node.level > 0 ? node.data.path : '0',
        orgName
      })
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
  display: flex;
  border: 1px solid #efefef;
  .left {
    width: 60%;
  }
  .left_box {
    padding: 20px;
  }
  .right {
    border-left: 1px solid #f2f2f2;
    width: 40%;
    // padding-left: 20px;
    // padding-right: 20px;
    height: 470px;
    overflow-y: auto;

    .el-tag {
      margin-right: 12px;
      margin-bottom: 8px;
    }
  }
}
.outer-user {
  overflow-y: auto;
  height: 380px;

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
  height: 340px;
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
