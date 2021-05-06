<template>
  <el-dialog
    class="user-select"
    :title="title"
    :visible.sync="innerVisible"
    width="800px"
    append-to-body
    :before-close="close"
  >
    <div class="content-wr">
      <div
        v-loading="loading"
        class="left"
      >
        <div>
          <el-tabs v-model="activeTab">
            <el-tab-pane
              v-if="selectTypes.includes('Org')"
              label="组织架构"
              name="Org"
            />
            <el-tab-pane
              v-if="selectTypes.includes('OuterUser')"
              label="外部联系人"
              name="OuterUser"
            >
            </el-tab-pane>
            <el-tab-pane
              v-if="selectTypes.includes('Position')"
              label="岗位"
              name="Position"
            />
            <el-tab-pane
              v-if="selectTypes.includes('Group')"
              label="分组"
              name="Group"
            />
          </el-tabs>
          <div
            v-if="selectTypes.includes('Org')"
            v-show="activeTab === 'Org'"
          >
            <el-input
              v-model="orgSearch"
              placeholder="搜索组织部门或成员姓名"
            />
            <div class="tree">
              <el-tree
                v-show="!orgSearch"
                :load="lazyLoadOrgTree"
                :props="treeProps"
                :default-checked-keys="defaultOrgLists"
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
          <!--外部联系人-->
          <div
            v-show="activeTab === 'OuterUser'"
            v-if="selectTypes.includes('OuterUser')"
            class="outer-user"
          >
            <el-input
              v-model.trim="outerParams.search"
              placeholder="搜索姓名或手机号码"
            />
            <div v-if="!_.isEmpty(outerData)">
              <el-checkbox
                v-model="checkAll"
                class="total-check"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
              >
                全选
              </el-checkbox>
              <el-checkbox-group
                v-model="checkedUsers"
                class="check-ul"
                @change="handleCheckedUserChange"
              >
                <el-checkbox
                  v-for="item in outerData"
                  :key="item.bizId"
                  class="check-li"
                  :label="item"
                  @change="handleSelectUser(item)"
                >
                  {{ item.bizName }}{{ item.phonenum ? `(${item.phonenum})` : '' }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <com-empty
              v-if="_.isEmpty(outerData)"
              height="31vh"
            />
          </div>
          <!--岗位-->
          <div
            v-if="selectTypes.includes('Position')"
            v-show="activeTab === 'Position'"
          >
            <el-input
              v-model="postionSearch"
              placeholder="搜索岗位"
            />
            <div class="tree">
              <el-tree
                v-show="!postionSearch"
                :load="lazyLoadPositionTree"
                :props="positionTreeProps"
                :default-checked-keys="defaultPositionLists"
                lazy
                node-key="path"
                show-checkbox
                @check="handleCheckPositionItem"
              />
              <el-tree
                v-show="postionSearch"
                ref="orgTreeSearch"
                :data="positionSearchData"
                :props="positionTreeProps"
                lazy
                node-key="path"
                show-checkbox
                @check="handleCheckPositionItem"
              />
            </div>
          </div>
          <!-- 分组 -->
          <div
            v-show="activeTab === 'Group'"
            v-if="selectTypes.includes('Group')"
            class="outer-user"
          >
            <el-input
              v-model.trim="outerParams.search"
              placeholder="搜索分组"
            />
            <div v-if="!_.isEmpty(groupData)">
              <el-checkbox
                v-model="checkAllGroup"
                class="total-check"
                :indeterminate="isIndeterminateGroup"
                @change="handleCheckAllGroupChange"
              >
                全选
              </el-checkbox>
              <el-checkbox-group
                v-model="checkedUsersGroup"
                class="check-ul"
                @change="handleCheckedGroupChange"
              >
                <el-checkbox
                  v-for="(item, index) in groupData"
                  :key="item.id"
                  class="check-li"
                  :label="item"
                  @change="handleSelectGroup(groupData[index])"
                >
                  {{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <com-empty
              v-if="_.isEmpty(groupData)"
              height="31vh"
            />
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
              v-else
              class="iconfont  icon-approval-checkin-bicolor imgs"
            />
            <span>{{ item.bizName }}</span>
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
import { getOrgUserChild, getOuterUser, getPostionUserChild, getGroup } from '@/api/system/user'
import ComEmpty from '@/components/common-empty/empty'
import _ from 'lodash'
const SEARCH_DELAY = 200
const NODE_TYPE = {
  All: 'All',
  Org: 'Org',
  User: 'User'
}
const SELECT_TYPE = ['Org', 'OuterUser', 'Position', 'Group']

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
const loadPostionTree = async ({ parentId, parentPath, search }) => {
  search = _.trim(search)
  // 只能传入一个参数 当传入search的时候不使用parentId
  const data = await getPostionUserChild(
    _.pick({ parentIds: parentId, search }, search ? 'search' : 'parentIds')
  )
  // 在这里处理两个数组为树形组件需要的结构
  const { positions } = data
  return _.concat(
    _.map(positions, (item) =>
      _.assign(
        {
          path: `${parentPath || '0'}_${item.positionId}`,
          bizId: item.positionId,
          bizName: item.positionName,
          type: 'Position'
        },
        item
      )
    )
  )
}
export default {
  name: 'UserPicker',
  components: {
    ComEmpty
  },
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
    //显示类型
    tabType: {
      type: String,
      default: 'Org'
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
      checkAllGroup: false,
      checkedUsersGroup: [], //分组人员
      isIndeterminateGroup: false,
      groupData: [],
      isClear: false, // 当前外部人员是否加载完毕
      checkAll: false,
      checkedUsers: [],
      isIndeterminate: false,
      activeTab,
      loading: false,
      orgSearch: '',
      postionSearch: '',
      orgSearchData: [],
      positionSearchData: [],
      outerParams: {
        pageNo: 1,
        pageSize: 500,
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
    // 按类型分组
    groupValue() {
      return _.groupBy(this.value, 'type')
    },
    // 获取外部人员的默认值以及全选半选的切换状态，获取组织tree的默认值
    defaultOrgLists() {
      return _.map(_.get(this.groupValue, 'Org'), 'path')
    },
    // 获取岗位树的默认值
    defaultPositionLists() {
      return _.map(_.get(this.groupValue, 'Position'), 'path')
    },
    // 树形组件的props属性
    treeProps() {
      return {
        disabled: 'disabled',
        label: 'bizName',
        isLeaf: 'isLeaf',
        children: 'children'
      }
    },
    positionTreeProps() {
      return {
        disabled: 'disabled',
        label: 'positionName',
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
    value: {
      handler(val) {
        this.selected = val.slice()
        this.handleCheckStatus(val)
        this.initCheckUser()
      },
      deep: true,
      immediate: true
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
    }, SEARCH_DELAY),
    // 在岗位架构下使用查询参数
    postionSearch: _.debounce(function(search) {
      if (!search) return
      this.loading = true
      loadPostionTree({ search })
        .then((res) => {
          this.positionSearchData = _.map(this.thruHandler(res), (item) => _.assign(item))
        })
        .finally(() => (this.loading = false))
    }, SEARCH_DELAY),

    'outerParams.search'() {
      this.debounceOuterSearchFn()
    }
  },
  mounted() {
    this.loadGroup() //查询分组
    if (_.includes(this.selectType, 'OuterUser')) {
      this.loadOuterUser()
    }
    this.listenerScroll()
  },
  beforeDestroy() {
    //移除监听滚动条事件
    window.removeEventListener('scroll', this.listenerScroll)
  },
  methods: {
    initCheckUser() {
      if (_.size(this.checkedUsers) === _.size(this.outerData) && _.size(this.outerData) !== 0) {
        this.checkAll = true
      }
      if (_.size(this.checkedUsers) !== 0 && _.size(this.checkedUsers) !== _.size(this.outerData)) {
        this.isIndeterminate = true
      }
    },
    handleCheckStatus(val) {
      this.checkedUsers = _.map(_.get(this.groupValue, 'User'), 'name')
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
      const temp_group = _.map(this.checkedUsersGroup, (item) => {
        return { name: item.id }
      })
      const diffName_group = _.differenceBy(temp_group, val, 'id')
      const diffIndex_group = _.findIndex(this.checkedUsersGroup, (item) => {
        return item.id === _.get(diffName_group, '[0].id', '')
      })
      if (diffIndex_group !== -1) {
        this.checkedUsersGroup.splice(diffIndex_group, 1)
        this.checkAllGroup = false
        this.isIndeterminateGroup = true
      }
    },
    //分组接口
    async loadGroup() {
      this.loading = true
      getGroup()
        .then((res) => {
          (res || []).forEach((item) => {
            item.bizId = item.id
            ;(item.bizName = item.name), (item.type = 'Group')
          })
          this.groupData = _.cloneDeep(res)
          this.loading = false
        })
        .finally(() => {
          this.loading = false
        })
    },

    listenerScroll() {
      window.addEventListener('scroll', this.debounceOuterScrollHandler, true)
    },
    handleOuterScroll(e) {
      if (this.isClear) return
      const refTarget = e.target
      if (refTarget.scrollTop + refTarget.offsetHeight >= refTarget.scrollHeight) {
        this.loadOuterUser()
      }
    },
    // 切换全选与全删
    handleCheckAllChange(val) {
      this.checkedUsers = val ? this.outerData : []
      this.isIndeterminate = false
      // 全删除需要过滤组织选的人,组织
      if (_.isEmpty(this.checkedUsers)) {
        _.pullAllBy(this.selected, this.outerData, 'bizId')
      } else {
        // 半选换全选需要把未选上的加入
        if (_.size(this.checkedUsers) === _.size(this.outerData)) {
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

    // 切换分组的全选与全删
    handleCheckAllGroupChange(val) {
      this.checkedUsersGroup = val ? this.groupData : []
      this.isIndeterminateGroup = false
      // 全删除需要过滤组织选的人,组织
      if (_.isEmpty(this.checkedUsersGroup)) {
        _.pullAllBy(this.selected, this.groupData, 'bizId')
      } else {
        // 半选换全选需要把未选上的加入
        if (_.size(this.checkedUsersGroup) === _.size(this.groupData)) {
          this.selected = _.uniqBy([..._.cloneDeep(this.groupData), ...this.selected], 'bizId')
        } else {
          // 全选需要去重
          _.each(this.groupData, (item) => {
            this.handleSelectGroup(item)
          })
          this.selected = _.uniqBy(this.selected, 'bizId')
        }
      }
    },

    // 当前是否切换为半选状态
    handleCheckedUserChange(value) {
      console.log(value)
      let checkedCount = value.length
      this.checkAll = checkedCount === this.outerData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.outerData.length
    },

    // 当前是否切换为半选状态
    handleCheckedGroupChange(value) {
      let checkedCount = value.length
      this.checkAllGroup = checkedCount === this.groupData.length
      this.isIndeterminateGroup = checkedCount > 0 && checkedCount < this.groupData.length
    },

    //选择分组
    handleSelectGroup(group) {
      const index = _.findIndex(this.selected, { bizId: group.bizId })
      if (index > -1) {
        this.selected = _.filter(this.selected, (item, i) => i != index)
      } else {
        this.selected.push(group)
      }
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
    // 选择岗位
    handleCheckPositionItem(node, { checkedNodes }) {
      // console.log('node, checkedNodes', node, checkedNodes)
      // 如果disabled则不能check项
      if (_.get(node, this.positionTreeProps.disabled)) return
      if (_.some(checkedNodes, (item) => item.positionId === node.positionId)) {
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

      const outerIndex_group = _.findIndex(this.checkedUsersGroup, (userItem) => {
        return item.name === userItem
      })
      if (outerIndex_group !== -1) {
        this.checkedUsersGroup.splice(outerIndex, 1)
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
      this.$emit('input', _.uniqBy(this.selected, 'bizId'))
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
          const { totalPage } = res
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
            this.outerData = []
            this.outerParams.loaded = true
          }
          this.outerParams.pageNo = pageNo + 1
          this.isClear = totalPage < pageNo + 1
        })
        .finally(() => {
          this.loading = false
        })
    },
    lazyLoadPositionTree(node, resolve) {
      const parentId = node.level > 0 ? node.data.positionId : '0'
      if (parentId === '0') this.loading = true
      loadPostionTree({
        parentId,
        parentPath: node.level > 0 ? node.data.path : '0'
      })
        .then((res) => resolve(this.thruHandler(res)))
        .finally(() => (this.loading = false))
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
  .total-check {
    padding: 6px;
    padding-top: 8px;
  }
  .check-ul {
    overflow-y: auto;
    height: 350px;
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
.company {
  color: $primaryColor;
}
</style>
