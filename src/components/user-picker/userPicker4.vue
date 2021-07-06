<template>
  <el-dialog
    class="user-picker"
    title="添加人员"
    :visible.sync="dialogVisible"
    width="700px"
    append-to-body
  >
    <div class="body">
      <div class="left-area">
        <div class="area-header">
          请选择人员
        </div>
        <el-tabs
          v-model="activeTab"
          class="tab"
        >
          <el-tab-pane
            label="组织机构"
            name="tree"
          >
            <el-input
              v-model="search"
              class="search"
              placeholder="搜索组织部门或成员姓名"
              clearable
            ></el-input>
            <el-scrollbar
              v-loading="treeLoading"
              class="scroll-bar"
              native
            >
              <el-tree
                ref="tree"
                lazy
                show-checkbox
                node-key="id"
                :data="innerData"
                :load="loadTreeData"
                :props="treeProps"
                @check="innerCheckChange"
              >
              </el-tree>
            </el-scrollbar>
          </el-tab-pane>

          <el-tab-pane
            label="外部联系人"
            name="checkbox"
          >
            <el-input
              v-model="outerForm.search"
              class="search"
              clearable
              placeholder="搜索成员姓名"
            ></el-input>
            <el-scrollbar
              v-loading="checkboxLoading"
              class="scroll-bar check-list"
              native
            >
              <div
                v-if="outerData.length"
                class="checkbox-wrapper"
              >
                <el-checkbox
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
                >
                  全选
                </el-checkbox>
                <el-checkbox-group
                  v-model="checkedOuter"
                  @change="outerCheckChange"
                >
                  <el-checkbox
                    v-for="outer in outerData"
                    :key="outer.id"
                    class="outer-item"
                    :label="outer.name"
                    :value="outer.id"
                    @change="(value) => outerCheckItemChange(value, outer)"
                  >
                    {{ outer.name + '(' + outer.phonenum + ')' }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>

              <div
                v-else-if="!outerData.length && !checkboxLoading"
                style="text-align: center; font-size: 12px"
              >
                暂无数据
              </div>
            </el-scrollbar>

            <pagination
              style="margin-top: 0; margin-bottom: 20px"
              small
              layout="prev, pager, next"
              :total="outerTotal"
              :page="outerForm.pageNo"
              :limit="outerForm.pageSize"
              @pagination="pagination"
            ></pagination>
          </el-tab-pane>

          <!--岗位-->
          <el-tab-pane
            label="岗位"
            name="position"
          >
            <el-input
              v-model="posSearch"
              class="search"
              placeholder="搜索岗位名称"
              clearable
            ></el-input>
            <el-scrollbar
              v-loading="treeLoading"
              class="scroll-bar"
              native
            >
              <el-tree
                ref="posTree"
                lazy
                show-checkbox
                node-key="id"
                :data="positionsData"
                :load="posloadTreeData"
                :props="posTreeProps"
                @check="posInnerCheckChange"
              >
              </el-tree>
            </el-scrollbar>
          </el-tab-pane>
          <!--分组-->
          <el-tab-pane
            label="分组"
            name="group"
          >
            <el-input
              v-model="groupSearch"
              class="search"
              clearable
              placeholder="搜索分组名称"
            ></el-input>
            <el-scrollbar
              v-loading="checkboxLoading"
              class="scroll-bar check-list"
              native
            >
              <div
                v-if="groupData.length"
                class="checkbox-wrapper"
              >
                <el-checkbox
                  v-model="groupCheckAll"
                  :indeterminate="groupIsIndeterminate"
                  @change="groupHandleCheckAllChange"
                >
                  全选
                </el-checkbox>
                <el-checkbox-group
                  v-model="groupcheckedOuter"
                  @change="groupCheckChange"
                >
                  <el-checkbox
                    v-for="outer in groupData"
                    :key="outer.id"
                    class="outer-item"
                    :label="outer.id"
                    :value="outer.id"
                    @change="(value) => groupCheckItemChange(value, outer)"
                  >
                    {{ outer.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>

              <div
                v-else-if="!groupData.length && !checkboxLoading"
                style="text-align: center; font-size: 12px"
              >
                暂无数据
              </div>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="right-area">
        <div class="area-header">
          <!-- 已选：{{ selectList.length }}人 -->
          已选
        </div>
        <div class="select-wrapper">
          <el-scrollbar
            v-if="selectList.length"
            class="scroll-bar"
            style="height: 100%"
            native
          >
            <ul class="select-list">
              <li
                v-for="item in selectList"
                :key="item.id"
                class="select-item"
              >
                <i class="iconfont icon-approval-checkin-bicolor select-type-icon"></i>
                <div class="select-name">
                  {{ getSelectedName(item) }}
                </div>

                <i
                  class="select-del-btn el-icon-error"
                  @click="delSelect(item)"
                ></i>
              </li>
            </ul>
          </el-scrollbar>

          <div
            v-else
            class="empty-tips"
          >
            <img
              src="@/assets/images/nodata.png"
              class="empty-img"
            />
            <div class="empty-text">
              未选择人员
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="medium"
        @click="dialogVisible = false"
      >
        取 消
      </el-button>
      <el-button
        type="primary"
        size="medium"
        @click="submit"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getOrgUserChild, getOuterUser, getPostionUserChild, getGroup } from '@/api/system/user'

// import { getUserList } from '@/api/examManage/schedule'
import Pagination from '@/components/common-pagination'
const NODE_TYPE = {
  All: 'All',
  Org: 'Org',
  User: 'User'
}
export default {
  name: 'UserPicker2',
  components: {
    Pagination
  },
  props: {
    // 只选人，选了组织在右侧会显示人
    onlyUser: {
      type: Boolean,
      default: false
    },
    // 是否为单选，默认为多选
    isSingle: {
      type: Boolean,
      default: false
    },
    initList: {
      type: Array,
      default() {
        return []
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      search: '',
      activeTab: 'tree',
      innerData: [],
      outerData: [],
      selectList: [],
      checkedOuter: [],
      isIndeterminate: false,
      checkAll: false,
      treeLoading: false,
      checkboxLoading: false,
      treeProps: {
        label: 'name',
        children: 'children'
      },
      outerForm: {
        search: '',
        pageNo: 1,
        pageSize: 10
      },
      outerTotal: 0,

      groupSearch: '',
      posSearch: '',
      positionsData: [], //岗位数据
      posTreeProps: {
        label: 'positionName', //name
        children: 'children'
      },
      groupData: [], //分组数据
      groupcheckedOuter: [], //分组已选数据
      groupTotal: 0, //分组总数据
      groupIsIndeterminate: false,
      groupCheckAll: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) return
      this.treeLoading = true
      this.selectList = JSON.parse(JSON.stringify(this.value))
      this.checkedOuter = this.selectList
        .filter((item) => !item.department)
        .map((item) => item.name)
      this.getTreeData()
        .then((data) => {
          this.innerData = data
        })
        .finally(() => {
          this.treeLoading = false
        })
      this.isIndeterminate = false
      this.checkAll = false
      this.getOuterData()

      this.getPositions('0')
        .then((data) => {
          //岗位
          this.positionsData = data
        })
        .finally(() => {
          this.treeLoading = false
        })
      this.groupcheckedOuter = this.selectList.filter((item) => item.isGroup).map((item) => item.id)
      this.groupIsIndeterminate = false
      this.groupCheckAll = false
      this.getAllGroup() //分组
    },
    search(search) {
      const params = search ? { search } : undefined
      this.getTreeData(params).then((data) => {
        this.innerData = data
      })
    },
    // 'outerForm.search': _.debounce(function() {
    //   this.getOuterData()
    // }, 1000),

    posSearch(search) {
      const params = search ? { search } : '0'
      this.getPositions(params)
        .then((data) => {
          //岗位
          this.positionsData = data
        })
        .finally(() => {
          this.treeLoading = false
        })
    },

    groupSearch(search) {
      const params = search ? { name: search } : undefined
      this.getAllGroup(params)
    }
  },
  methods: {
    pagination({ page, limit }) {
      this.outerForm.pageNo = page
      this.outerForm.pageSize = limit
      this.getOuterData()
    },
    setCheckedKeys(keys = []) {
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(keys)
      })
    },
    submit() {
      this.selectList.forEach((select) => {
        delete select.parent
        if (select.department == 'no') {
          delete select.department
        }
      })
      this.$emit('input', this.selectList)
      this.dialogVisible = false
    },
    getSelectedName(item) {
      const { name, phonenum } = item
      if (phonenum) {
        return name + '(' + phonenum + ')'
      }
      return name
    },
    delSelect(del) {
      this.updateSelectList(del, true)
      if (!del.department) {
        this.checkedOuter.splice(this.checkedOuter.indexOf(del.name), 1)
        this.isIndeterminate =
          this.checkedOuter.length > 0 && this.checkedOuter.length < this.outerData.length
        return
      }
      this.groupRightToLeft(del)
      this.$refs.tree.setChecked(del.bizId, false)
      this.$refs.posTree.setChecked(del.id, false)
    },
    //树形点击checkbox
    innerCheckChange(node, { checkedNodes }) {
      if (_.some(checkedNodes, (item) => item.bizId === node.bizId)) {
        if (node.type !== NODE_TYPE.User) {
          if (!this.onlyUser) {
            this.selectList = _.reject(this.selectList, (item) => _.includes(item.path, node.path))
          }
        }
        // 如果是单选模式
        if (this.isSingle) {
          this.selectList = [node]
        } else {
          this.selectList.push(node)
        }
      } else {
        const { bizId } = node
        if (_.find(this.selectList, { bizId })) {
          this.selectList = _.reject(this.selectList, { bizId })
        } else {
          // 当前节点不在selected中则父节点被勾选时，取消勾选子节点
          this.selectList = _(this.selectList)
            // 去除父节点
            .reject((i) => _.includes(node.path, i.path) || _.includes(i.path, node.path))
            // 添加其他节点
            .concat(this.getCheckedNodes(checkedNodes))
            .value()
        }
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
    handleCheckAllChange(val) {
      const outerData = this.outerData
      if (val) {
        this.checkedOuter = this.checkedOuter.concat(outerData.map((item) => item.name))

        outerData.map((outer) => {
          this.updateSelectList(outer)
        })
      } else {
        if (this.isIndeterminate) {
          this.isIndeterminate = false
          this.handleCheckAllChange((this.checkAll = true))
          return
        }
        outerData.map((outer) => {
          this.checkedOuter = this.checkedOuter.filter((name) => name !== outer.name)
          this.selectList = this.selectList.filter((item) => item.id !== outer.id)
        })
      }
      this.isIndeterminate = false
    },
    outerCheckChange() {
      this.updateCheckBoxState()
    },
    outerCheckItemChange(value, item) {
      this.updateSelectList(item, !value)
    },
    getTreeData(params = { parentId: '0' }) {
      return new Promise((resolve) => {
        getOrgUserChild(params).then((res) => {
          res.orgs.forEach((val) => {
            val.type = NODE_TYPE.Org
          })
          res.users.forEach((val) => {
            val.type = NODE_TYPE.User
          })
          const { orgs = [], users = [] } = res
          this.setCheckedKeys(this.selectList.map((s) => s.userId))
          resolve(this.normalizeData(orgs.concat(users)))
        })
      })
    },
    loadTreeData(node, resolve) {
      const parentId = node.data.id
      const parentPath = node.level > 0 ? node.data.path : '0'
      if (!parentId) return
      this.getTreeData({ parentId }).then((data) => {
        data.forEach((item) => {
          item.path = `${parentPath || '0'}_${item.id}`
        })
        resolve(data)
      })
    },
    normalizeData(data = []) {
      return data.map((item) => {
        const { phoneNum: phonenum, name, orgName: department, userId, id, type } = item
        const newItem = {
          phonenum,
          name,
          id: id || userId,
          type,
          userId: id || userId,
          bizId: id || userId,
          bizName: name,
          path: `0_${item.userId || item.id}`,
          department: department || 'no'
        }
        return newItem
      })
    },
    getOuterData() {
      this.checkboxLoading = true
      getOuterUser(this.outerForm)
        .then((res) => {
          const { data = [], totalNum } = res
          this.outerTotal = totalNum
          this.outerData = data.map((item) => {
            const { phonenum, name, userId } = item
            return { phonenum, name, userId, id: userId, bizId: userId, bizName: name }
          })

          this.updateCheckBoxState()
        })
        .finally(() => (this.checkboxLoading = false))
    },
    //获取岗位
    getPositions(query) {
      let params = {}
      if (typeof query == 'object') {
        params = query
      } else {
        params = {
          parentIds: query
        }
      }
      return new Promise((resolve) => {
        getPostionUserChild(params).then((res) => {
          const { positions = [] } = res
          this.posSetCheckedKeys(this.selectList.map((s) => s.userId))
          resolve(this.posNormalizeData(positions))
        })
      }).finally(() => (this.checkboxLoading = false))
    },
    posSetCheckedKeys(keys = []) {
      this.$nextTick(() => {
        this.$refs.posTree.setCheckedKeys(keys)
      })
    },
    posloadTreeData(node, resolve) {
      const parentId = node.data.positionId || node.data.userId
      if (!parentId) return
      this.getPositions(parentId).then((data) => {
        resolve(data)
      })
    },
    posNormalizeData(data = []) {
      return data.map((item) => {
        const { positionId, name, positionName, userId, phoneNum } = item
        const newItem = {
          positionName: positionName || name,
          userId: userId || positionId,
          positionId: positionId || '',
          name: positionName || name,
          phonenum: phoneNum || '',
          id: userId || positionId,
          department: 'no',
          position: true,
          bizId: positionId,
          bizName: positionName,
          type: 'Position'
        }
        return newItem
      })
    },
    posInnerCheckChange(node, { checkedNodes }) {
      if (!checkedNodes.includes(node)) {
        this.selectList = this.selectList.filter((item) => item.userId != node.userId)
      } else {
        this.selectList.push(node)
      }
      // 重新排序
      this.selectList.sort((a, b) => {
        return +a.id - +b.id
      })
    },
    //获取分组
    getAllGroup(param = {}) {
      this.checkboxLoading = true
      getGroup(param)
        .then((res) => {
          res.forEach((item) => {
            item.userId = item.id
            item.isGroup = true
            item.department = 'no'
            item.bizId = item.id
            item.bizName = item.name
            item.type = 'Group'
          })
          this.groupTotal = res.length || 0
          this.groupData = res
          this.groupCheckChange()
        })
        .finally(() => (this.checkboxLoading = false))
    },
    groupCheckItemChange(value, item) {
      if (value) {
        this.selectList.push(item)
      } else {
        this.selectList = this.selectList.filter((s) => s.userId != item.id)
      }
      this.groupCheckChange()
    },
    groupCheckChange() {
      const length = this.groupcheckedOuter.length
      const total = this.groupTotal
      if (length && total) {
        if (length < total) {
          this.groupIsIndeterminate = true
        } else if (length === total) {
          this.groupCheckAll = true
          this.groupIsIndeterminate = false
        }
      } else {
        this.groupIsIndeterminate = false
      }
    },

    groupHandleCheckAllChange(val) {
      const outerData = this.groupData
      if (val) {
        if (this.groupcheckedOuter.length == outerData.length) {
          this.groupAllUnCheck()
          return
        }
        this.groupAllCheck()
      } else {
        if (this.groupIsIndeterminate) {
          this.groupIsIndeterminate = false
          this.groupCheckAll = true
          this.groupHandleCheckAllChange(true)
          return
        }
        this.groupAllUnCheck()
      }
    },
    groupAllUnCheck() {
      this.groupCheckAll = false
      this.groupcheckedOuter = []
      this.groupData.map((outer) => {
        this.selectList = this.selectList.filter(
          (item) => item.userId !== outer.id && !item.isGroup
        )
      })
    },
    groupAllCheck() {
      this.groupIsIndeterminate = false
      this.groupCheckAll = true
      this.groupcheckedOuter = this.groupData.map((item) => item.id)
      this.groupData.map((outer) => {
        this.updateSelectList(outer)
      })
    },
    groupRightToLeft(del) {
      if (del.isGroup) {
        this.groupcheckedOuter = this.groupcheckedOuter.filter((item) => item != del.userId)
        this.groupCheckChange()
      }
    },

    updateCheckBoxState() {
      const length = this.checkedOuter.length
      const total = this.outerTotal
      if (length && total) {
        if (length < total) {
          this.isIndeterminate = true
        } else if (length === total) {
          this.checkAll = true
          this.isIndeterminate = false
        }
      }
      this.checkedOuter = this.selectList
        .filter((item) => !item.department)
        .map((item) => item.name)
    },
    updateSelectList(item, isRemove) {
      const list = this.selectList
      const index = list.findIndex((select) => select.userId === item.userId)
      if (isRemove) {
        if (index > -1) {
          list.splice(index, 1)
        }
      } else {
        if (index < 0) {
          list.push(item)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.user-picker {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
<style lang="scss" scoped>
.user-picker {
  .body {
    border: 1px solid #f2f2f2;
    display: flex;
    .scroll-bar {
      height: 416px;
      margin: 10px;
      overflow: hidden;
      overflow-y: auto;
      box-sizing: border-box;
      &.check-list {
        height: 390px;
      }
    }
    .area-header {
      height: 48px;
      line-height: 48px;
      padding-left: 12px;
      font-size: 13px;
      color: #606266;
      border-bottom: 1px solid #f2f2f2;
    }
    .left-area {
      width: 60%;
      border-right: 1px solid #f2f2f2;
      box-sizing: border-box;
      .tab {
        padding: 0 12px;
      }
      .search {
        padding: 0 6px;
      }
      .outer-item {
        display: block;
        margin-top: 18px;
        .el-checkbox__label {
          font-size: 16px !important;
        }
      }
    }
    .right-area {
      height: 100%;
      width: 40%;
      .select-wrapper {
        position: relative;
        height: 530px;
        .select-list {
          .select-item {
            cursor: default;
            display: flex;
            padding: 5px 8px;
            align-items: center;
            .select-type-icon {
              flex: 0 0 32px;
              font-size: 32px;
              margin-right: 5px;
              color: #01aafc;
            }
            .select-name {
              flex: 1;
              width: 0;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: #333;
              font-size: 14px;
            }
            .select-del-btn {
              cursor: pointer;
              flex: 0 0 20px;
              font-size: 20px;
            }
          }
        }
        .empty-tips {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          .empty-img {
            width: 120px;
            height: 120px;
          }
          .empty-text {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
