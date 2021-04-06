<template>
  <el-dialog
    class="user-picker"
    title="请选择"
    :visible.sync="dialogVisible"
    width="700px"
    append-to-body
  >
    <div class="body">
      <div class="left-area">
        <div class="area-header">
          已选
        </div>
        <el-tabs
          v-model="activeTab"
          class="tab"
        >
          <el-tab-pane
            label="内部组织"
            name="tree"
          >
            <el-input
              v-model="search"
              class="search"
              placeholder="搜索组织部门或成员姓名"
            ></el-input>
            <el-scrollbar
              v-loading="treeLoading"
              class="scroll-bar tree"
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
            <el-scrollbar class="scroll-bar">
              <div class="checkbox-wrapper">
                <el-checkbox
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
                >
                  全选
                </el-checkbox>
                <el-checkbox-group
                  v-model="checkedOuter"
                  v-loading="checkboxLoading"
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
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="right-area">
        <div class="area-header">
          未选
        </div>
        <div class="select-wrapper">
          <el-scrollbar
            v-if="selectList.length"
            class="scroll-bar"
            style="height: 100%"
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
import { getOrgUserChild, getOuterUser } from '@/api/system/user'
import { getUserList } from '@/api/examManage/schedule'

export default {
  name: 'UserPicker2',
  props: {
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
      }
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
      this.getOuterData()
    },
    search(search) {
      const params = search ? { search } : undefined
      this.getTreeData(params).then((data) => {
        this.innerData = data
      })
    }
  },
  methods: {
    setCheckedKeys(keys = []) {
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(keys)
      })
    },
    submit() {
      this.selectList.forEach((select) => delete select.parent)
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

      this.$refs.tree.setChecked(del.id, false)
    },
    innerCheckChange(node, { checkedNodes }) {
      const list = this.selectList
      if (!checkedNodes.includes(node)) {
        if (node.type) {
          this.treeLoading = true
          getUserList({ orgId: node.id })
            .then((res = []) => {
              const data = this.normalizeData(res)
              data.forEach((item) => {
                this.updateSelectList(item, true)
              })
            })
            .finally(() => (this.treeLoading = false))
        } else {
          this.updateSelectList(node, true)
          if (this.selectList.includes(node.parent)) {
            this.updateSelectList(node.parent, true)
          }
        }
      } else {
        if (node.type) {
          this.treeLoading = true
          getUserList({ orgId: node.id })
            .then((res = []) => {
              const data = this.normalizeData(res)
              data.map((item) => {
                item.parent = node
                this.updateSelectList(item)
              })
            })
            .finally(() => (this.treeLoading = false))
        } else {
          this.updateSelectList(node, false)
        }
      }

      // 重新排序
      list.sort((a, b) => {
        return +a.id - +b.id
      })
    },
    handleCheckAllChange(val) {
      const list = this.selectList
      if (val) {
        this.checkedOuter = this.outerData.map((item) => item.name)

        this.outerData.map((outer) => {
          this.updateSelectList(outer)
        })
      } else {
        this.selectList = list.filter((item) => item.department)
        this.checkedOuter = []
      }
      this.isIndeterminate = false
    },
    outerCheckChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.outerData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.outerData.length
    },
    outerCheckItemChange(value, item) {
      this.updateSelectList(item, !value)
    },
    getTreeData(params = { parentId: '0' }) {
      return new Promise((resolve) => {
        getOrgUserChild(params).then((res) => {
          const { orgs = [], users = [] } = res
          resolve(this.normalizeData(orgs.concat(users)))
        })
      })
    },
    loadTreeData(node, resolve) {
      const parentId = node.data.id
      this.getTreeData({ parentId }).then((data) => {
        resolve(data)
        this.setCheckedKeys(this.selectList.map((s) => s.userId))
      })
    },
    normalizeData(data = []) {
      return data.map((item) => {
        const { phoneNum: phonenum, name, orgName: department, userId, id, type } = item
        const newItem = {
          phonenum,
          name,
          department,
          id: id || userId,
          type,
          userId
        }
        return newItem
      })
    },
    getOuterData() {
      this.checkboxLoading = true
      getOuterUser()
        .then((res) => {
          const { data = [] } = res
          this.outerData = data.map((item) => {
            const { phonenum, name, userId } = item
            return { phonenum, name, userId, id: userId }
          })

          const length = this.checkedOuter.length
          if (length) {
            if (length < this.outerData.length) {
              this.isIndeterminate = true
            } else {
              this.checkAll = true
            }
          }
        })
        .finally(() => (this.checkboxLoading = false))
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
      height: 450px;
      width: 100%;
      overflow: hidden;
      overflow-y: auto;
      box-sizing: border-box;
      &.tree {
        height: 416px;
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
        height: 504px;
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
