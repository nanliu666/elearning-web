<template>
  <el-dialog
    title="权限配置"
    :visible.sync="dialogVisible"
    width="900px"
    :close-on-click-modal="false"
    append-to-body
  >
    <div
      v-loading="loading"
      class="limit-wrap"
    >
      <el-scrollbar class="scroll-item">
        <div class="limit-item">
          <div class="limit-title">
            端口
          </div>
          <ul>
            <li
              v-for="(item, index) in prots"
              :key="index"
              class="limit-port"
              :class="activePort === item.value ? 'active' : ''"
              @click="handlePort(item)"
            >
              {{ item.label }}
            </li>
          </ul>
        </div>
      </el-scrollbar>
      <el-scrollbar class="scroll-item scroll-tree">
        <div class="limit-item">
          <treeLimits
            ref="privilege"
            v-model="tree"
            title="菜单权限"
            :default-props="menuProps"
            :tree-list="menuPrivileges"
            :disabled="disabled"
            @nodeClick="nodeClick"
          />
        </div>
      </el-scrollbar>
      <el-scrollbar class="scroll-item">
        <div class="limit-item">
          <div class="limit-title">
            页面控制权限
          </div>
          <el-checkbox
            v-if="pageControls.length > 0"
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            :disabled="true"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="controlsList"
            class="controls-container"
            :disabled="disabled"
          >
            <el-checkbox
              v-for="(item, index) in pageControls"
              :key="index"
              :label="item.name"
              class="controls-container-item"
            />
          </el-checkbox-group>
        </div>
      </el-scrollbar>
      <el-scrollbar
        class="scroll-item"
        style="border: none"
      >
        <div class="limit-item">
          <div class="limit-title">
            数据规则权限
          </div>
          <el-tabs
            v-model="activeTabName"
            class="fill"
            @tab-click="selectedTab"
          >
            <el-tab-pane
              v-loading="treeLoading"
              element-loading-text="正在加载中"
              label="组织架构"
              name="orgTree"
              class="fill"
            >
              <el-input
                v-model="treeSearch"
                clearable
                placeholder="组织名称"
                style="margin-bottom:10px;"
              />
              <el-tree
                ref="orgTree"
                :filter-node-method="filterNode"
                :data="treeData"
                node-key="orgId"
                :props="treeProps"
                :disabled="disabled"
                :show-checkbox="true"
                :expand-on-click-node="false"
                default-expand-all
                :default-checked-keys="orgCheckedKeys"
              >
                <span
                  slot-scope="{ node, data }"
                  class="custom-tree-node"
                >
                  <span>{{ data.orgName }}</span>
                </span>
              </el-tree>
            </el-tab-pane>
            <el-tab-pane
              v-loading="treeLoading"
              element-loading-text="正在加载中"
              label="业务架构"
              name="businessTree"
              class="fill"
            >
              <el-input
                v-model="businessSearch"
                clearable
                placeholder="业务部门名称"
                style="margin-bottom:10px;"
              />
              <el-tree
                ref="businessTree"
                :filter-node-method="filterBusNode"
                :data="businessTreeData"
                node-key="bizId"
                :props="businessTreeProps"
                :show-checkbox="true"
                :expand-on-click-node="false"
                :disabled="disabled"
                :default-checked-keys="busCheckedKeys"
                default-expand-all
              >
                <span
                  slot-scope="{ node, data }"
                  class="custom-tree-node"
                >
                  <span>{{ data.name }}</span>
                </span>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-scrollbar>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="medium"
        @click="onClose"
      >
        取消
      </el-button>
      <el-button
        v-if="!disabled"
        :loading="submiting"
        type="primary"
        size="medium"
        @click="onClickSave"
      >
        保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import treeLimits from './roleTreePermission'
import { updatePrivilege } from '../../../api/system/role'
import { getMenuPrivilege, getOrgPrivilege, getBizPrivilege } from '@/api/system/user'

// 用于递归遍历节点，并执行回调处理
const R = (f, s) => s.map((i) => (f(i), i.children && i.children.length ? R(f, i.children) : 0, i))

export default {
  name: 'RolePermission',
  components: {
    treeLimits
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    roleId: {
      // 	角色ID，多个以英文逗号分隔
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      submiting: false,
      orgPrivileges: [],
      menuPrivileges: [],
      menuProps: {
        label: 'name',
        id: 'menuId'
      },
      page: [],
      rule: [],
      org: [0, 1, 2],
      tree: [],
      dataPrivileges: [],
      buttonData: {},
      buttonMenuId: '',
      originData: [],
      prots: [
        { label: 'PC端', value: 'Admin' },
        { label: '移动端', value: 'OAMobile' }
      ],
      activePort: 'Admin',
      pageControls: [],
      controlsList: [],
      businessTreeData: [],
      busCheckedKeys: [],
      treeData: [],
      orgCheckedKeys: [],
      activeTabName: 'orgTree',
      treeProps: {
        labelText: '标题',
        label: 'orgName',
        value: 'orgId',
        children: 'children'
      },
      businessTreeProps: {
        labelText: '标题',
        label: 'name',
        value: 'bizId',
        children: 'children'
      },
      businessSearch: '',
      treeSearch: '',
      treeLoading: false,
      parentOrgId: 0,
      isIndeterminate: true,
      checkAll: false
    }
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.visible
      },
      set: function(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    treeSearch(val) {
      this.$refs.orgTree.filter(val)
    },
    businessSearch(val) {
      this.$refs.businessTree.filter(val)
    }
  },
  mounted() {
    this.getRolePrivilege()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    filterBusNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 查询用户权限
    getRolePrivilege(parentId = 0) {
      const params = {
        roleId: this.roleId,
        clientId: this.activePort,
        parentId: parentId
      }
      this.loading = true
      getMenuPrivilege(params)
        .then((res) => {
          this.originData = JSON.parse(JSON.stringify(res)) // 保存一份原数据，保存的时候用作对比
          this.orgPrivileges = res || []
          let index = this.orgPrivileges.findIndex((it) => it.isOwn == 1)
          if (index === -1 && this.orgPrivileges.length > 0) {
            this.orgPrivileges[0].isOwn = 1
          }
          this.menuPrivileges = this.menuFilter(res)
          if (this.menuPrivileges[0]) {
            this.dataPrivileges = this.menuPrivileges[0].dataPrivileges || []
            this.buttonMenuId = this.menuPrivileges[0].buttonMenuId
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    findBusValue(arr, data) {
      arr.forEach((item) => {
        if (item.isOwn && !(item.children && item.children.length > 0)) {
          data.push(item[this.businessTreeProps.value])
        }
        if (item.children && item.children.length > 0) {
          this.findBusValue(item.children, data)
        }
      })
    },
    findOrgValue(arr, data) {
      arr.forEach((item) => {
        if (item.isOwn && !(item.children && item.children.length > 0)) {
          data.push(item[this.treeProps.value])
        }
        if (item.children && item.children.length > 0) {
          this.findOrgValue(item.children, data)
        }
      })
    },
    getOrgPrivilege() {
      const params = {
        roleId: this.roleId,
        menuId: this.buttonMenuId
      }
      this.treeLoading = true
      getOrgPrivilege(params)
        .then((res) => {
          this.findOrgValue(res, this.orgCheckedKeys)
          this.treeData = R((i) => {
            i.disabled = true
          }, res)
          this.treeLoading = false
        })
        .finally(() => {
          this.treeLoading = false
        })
    },

    getBizPrivilege() {
      const params = {
        roleId: this.roleId,
        menuId: this.buttonMenuId
      }
      this.treeLoading = true
      getBizPrivilege(params)
        .then((res) => {
          this.findBusValue(res, this.busCheckedKeys)
          this.businessTreeData = R((i) => {
            i.disabled = true
          }, res)

          this.treeLoading = false
        })
        .finally(() => {
          this.treeLoading = false
        })
    },

    // 判断当前菜单类型是Button的菜单过滤掉
    menuFilter(arr, parentId) {
      return (
        arr.filter((item) => {
          if (item.menuType === 'Button') {
            // 如果节点是按钮类型，保存到buttonData
            if (this.buttonData[parentId]) {
              this.buttonData[parentId].push(item)
            } else {
              this.$set(this.buttonData, parentId || 0, [item])
            }
            return false
          } else {
            if (item.children && item.children.length > 0) {
              item.children = this.menuFilter(item.children, item.menuId)
            }
            return true
          }
        }) || []
      )
    },
    ping(data, menus, popover) {
      data.map((it) => {
        menus.push(it)
        popover.push(it.dataPrivileges)
        if (it.children && it.children.length > 0) {
          this.ping(it.children, menus, popover)
        }
      })
    },
    // 点击保存
    onClickSave() {
      let save = this.$refs.privilege.getCheck()
      if (save.length === 0) {
        this.$message.warning('选择角色菜单权限')
        return
      }
      let isselectOrg = this.orgPrivileges.findIndex((it) => it.isOwn === true)
      if (isselectOrg === -1) {
        this.$message.warning('选择角色组织权限')
        return
      }
      this.orgPrivileges.map((it) => {
        it.operatorType = it.isOwn ? 'Add' : 'Del'
      })
      this.getButtonPrivilege(this.menuPrivileges)

      let menu = []
      let menuPrivileges = JSON.parse(JSON.stringify(this.menuPrivileges))
      let Privileges = []

      this.ping(menuPrivileges, menu, Privileges)
      let dataPrivileges = []
      Privileges.map((it) => {
        if (it.length > 0) {
          dataPrivileges = dataPrivileges.concat(it)
        }
      })
      menu.map((it) => {
        delete it.children
      })
      menu.map((it) => {
        if (it.menuType !== 'Button') it.isOwn = false
        save.map((item) => {
          if (it.menuId === item) {
            it.isOwn = true
            it.operatorType = 'Add'
          } else {
            it.operatorType = 'Del'
          }
        })
      })
      menu.map((it) => {
        it.operatorType = it.isOwn ? 'Add' : 'Del'
      })
      const params = {
        roleId: this.roleId,
        orgPrivileges: this.orgPrivileges,
        menuPrivileges: menu,
        dataPrivileges
      }
      this.submiting = true
      updatePrivilege(params)
        .then(() => {
          this.$message.success('保存成功')
        })
        .finally(() => {
          this.submiting = false
          this.onClose()
        })
    },

    // 根据原数据，添加operatorType字段，Add-添加，Del-删除
    diff(newList, oldList, key, id = 'menuId') {
      newList.forEach((item) => {
        const data = oldList.find((oldData) => oldData[id] === item[id])
        if (!item[key] && data[key]) {
          item.operatorType = 'Del'
        } else if (item[key] && !data[key]) {
          item.operatorType = 'Add'
        }

        for (const listKey in item) {
          if (Array.isArray(item[listKey])) {
            this.diff(item[listKey], data[listKey], key)
          }
        }
        if (item.dataPrivileges && item.dataPrivileges.length > 0) {
          this.diff(item.dataPrivileges, data.dataPrivileges, key, 'dataId')
        }
      })
    },

    // 把抽取出来的buttonData，重新赋值回权限数据
    getButtonPrivilege(arr) {
      arr.forEach((item) => {
        if (this.buttonData[item.menuId]) {
          item.children = item.children.concat(this.buttonData[item.menuId])
        }
        if (item.children && item.children.length > 0) {
          this.getButtonPrivilege(item.children)
        }
      })
    },
    onClose() {
      this.buttonData = {}
      this.buttonMenuId = ''
      this.$emit('update:visible', false)
    },
    nodeClick(data) {
      this.buttonMenuId = data.menuId
      this.dataPrivileges = data.dataPrivileges || []
      this.getPageContorls(data.menuId)
      if (this.activeTabName === 'orgTree') {
        this.getOrgPrivilege()
      } else if (this.activeTabName === 'businessTree') {
        this.getBizPrivilege()
      }
    },
    getPageContorls(menuId) {
      this.pageControls = []
      this.controlsList = []
      this.isIndeterminate = true
      if (!_.isEmpty(this.buttonData[menuId])) {
        this.pageControls = this.buttonData[menuId]
        this.buttonData[menuId].forEach((btn) => {
          if (btn.isOwn) {
            this.controlsList.push(btn.name)
          }
        })
        this.isIndeterminate = this.pageControls.length === this.controlsList.length ? false : true
        this.checkAll = this.pageControls.length === this.controlsList.length
      }
    },
    handlePort(data) {
      this.activePort = data.value
      this.clearAllData()
      this.getRolePrivilege()
    },
    clearAllData() {
      this.controlsList = []
      this.pageControls = []
      this.businessTreeData = []
      this.treeData = []
      this.treeSearch = ''
      this.businessSearch = ''
    },
    selectedTab(tab) {
      this.treeSearch = ''
      this.businessSearch = ''
      if (!this.buttonMenuId) {
        return
      }
      const params = {
        roleId: this.roleId,
        menuId: this.buttonMenuId
      }
      let apiMap = {
        orgTree: getOrgPrivilege,
        businessTree: getBizPrivilege
      }
      let findValueMap = {
        orgTree: this.findOrgValue,
        businessTree: this.findBusValue
      }
      let defualtKeysMap = {
        orgTree: this.orgCheckedKeys,
        businessTree: this.busCheckedKeys
      }
      apiMap[tab.name](params)
        .then((res) => {
          if (tab.name === 'businessTree') {
            this.businessTreeData = R((i) => {
              i.disabled = true
            }, res)
          } else if (tab.name === 'orgTree') {
            this.treeData = R((i) => {
              i.disabled = true
            }, res)
          }
          findValueMap[tab.name](res, defualtKeysMap[tab.name])
          this.$forceUpdate()
        })
        .catch((error) => {
          this.$message.warning(error.resMsg)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}

.limit-title {
  font-size: 18px;
  margin-bottom: 20px;
}

.limit-port {
  height: 36px;
  line-height: 36px;
  font-size: 16px;
  cursor: pointer;
}

.active {
  background-color: #f2faff;
}

.controls-container {
  display: flex;
  flex-direction: column;
  &-item {
    height: 32px;
    line-height: 32px;
  }
}

.limit-wrap {
  display: flex;
  height: 400px;

  .scroll-item {
    border-right: 1px solid #f2f2f2;
    min-width: 180px;
    overflow: hidden;
    overflow-y: auto;

    &.scroll-tree {
      min-width: 220px;
    }

    .limit-item {
      padding: 0 15px;
      /*flex: 1;*/
    }
  }
}
</style>
