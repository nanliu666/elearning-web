<template>
  <el-dialog
    title="权限配置"
    :visible.sync="dialogVisible"
    width="800px"
    :close-on-click-modal="false"
    append-to-body
  >
    <div
      v-loading="loading"
      class="limit-wrap"
    >
      <el-scrollbar class="scroll-item border__right">
        <div class="limit-item">
          <menuRulePermission
            ref="privilege"
            v-model="tree"
            title="菜单权限"
            :default-props="menuProps"
            :tree-list="menuData"
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
          <checkLimits
            v-if="buttonMenuId"
            v-model="page"
            title=""
            :check-list="buttonData || []"
            :default-props="{
              value: 'menuId',
              label: 'name',
              check: 'isOwn'
            }"
            :disabled="disabled"
          />
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
import checkLimits from './roleCheckPermission'
import menuRulePermission from './menuRulePermission'
import { getRoleMenuPermission, postOrgPrivilege } from '../../../api/system/menu'
import { flatTree } from '@/util/util'

const pages = [
  {
    orgName: '新建',
    orgId: 'create',
    isOwn: true
  },
  {
    orgName: '修改',
    orgId: 'update',
    isOwn: false
  },
  {
    orgName: '查看',
    orgId: 'watch',
    isOwn: true
  },
  {
    orgName: '删除',
    orgId: 'del',
    isOwn: true
  }
]
export default {
  name: 'RoleLimite',
  components: {
    checkLimits,
    menuRulePermission
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // roleId: {
    //   // 	角色ID，多个以英文逗号分隔
    //   type: [String, Number],
    //   default: ''
    // },
    disabled: {
      type: Boolean,
      default: false
    },
    clientId: {
      type: String,
      default: 'Admin'
    }
  },
  data() {
    return {
      menuData: [],
      loading: false,
      submiting: false,
      defualtRuleData: {}, //回显数据规则已选择数据
      submitData: [], //提交的数据
      menuCleckList: [], //菜单选中id
      orgPrivileges: [],
      menuPrivileges: [],
      menuProps: {
        label: 'name',
        id: 'menuId'
      },
      pages,
      page: [],
      rule: [],
      org: [0, 1, 2],
      tree: [],
      dataPrivileges: [],
      buttonData: [],
      buttonMenuId: '',
      originData: [],
      dataRuleDialog: false
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
    menuPrivileges: {
      handler(val) {
        let data = []
        this.filterData(val, data)
        this.menuData = data
      },
      deep: true
    },
    visible() {}
  },
  created() {
    this.roleId = this.$route.query.roleId
    this.getRolePrivilege()
  },
  mounted() {},
  methods: {
    filterData(data, table) {
      data.map((it, i) => {
        if (it.menuType !== 'Button') {
          table.push(_.cloneDeep(it))
        }
        if (it.children && it.children.length > 0) {
          if (table[i]) {
            table[i].childrenList = _.get(_.cloneDeep(it), 'children', [])
            table[i].children = []
            this.filterData(it.children, table[i].children)
          }
        }
      })
    },
    // 查询用户权限
    getRolePrivilege() {
      const params = {
        roleId: this.roleId,
        clientId: this.clientId,
        parentId: 0
      }
      this.loading = true
      // putRolePermission
      getRoleMenuPermission(params)
        .then((res) => {
          this.menuPrivileges = JSON.parse(JSON.stringify(res))
          this.menuPrivileges.map((item) => {
            item.cleck = false
          })
          // this.originData = JSON.parse(JSON.stringify(res)) // 保存一份原数据，保存的时候用作对比
          // this.orgPrivileges = res.orgPrivileges || []
          // let index = this.orgPrivileges.findIndex((it) => it.isOwn == 1)
          // if (index === -1 && this.orgPrivileges.length > 0) {
          //   this.orgPrivileges[0].isOwn = 1
          // }
          // this.menuPrivileges = this.menuFilter(res.menuPrivileges)
          // if (this.menuPrivileges[0]) {
          //   this.dataPrivileges = this.menuPrivileges[0].dataPrivileges || []
          //   this.buttonMenuId = this.menuPrivileges[0].buttonMenuId
          // }
        })
        .finally(() => {
          this.loading = false
        })
    },

    // // 判断当前菜单类型是Button的菜单过滤掉
    // menuFilter(arr, parentId) {
    //   return (
    //     arr.filter((item) => {
    //       if (item.menuType === 'Button') {
    //         // 如果节点是按钮类型，保存到buttonData
    //         if (this.buttonData[parentId]) {
    //           this.buttonData[parentId].push(item)
    //         } else {
    //           this.$set(this.buttonData, parentId || 0, [item])
    //         }
    //         return false
    //       } else {
    //         if (item.children && item.children.length > 0) {
    //           item.children = this.menuFilter(item.children, item.menuId)
    //         }
    //         return true
    //       }
    //     }) || []
    //   )
    // },
    // ping(data, menus, popover) {
    //   data.map((it) => {
    //     menus.push(it)
    //     popover.push(it.dataPrivileges)
    //     if (it.children && it.children.length > 0) {
    //       this.ping(it.children, menus, popover)
    //     }
    //   })
    // },
    filterID(data, table) {
      data.map((it, i) => {
        if (it.menuType !== 'Button') {
          table.push(_.cloneDeep(it))
        }
        if (it.children && it.children.length > 0) {
          table[i].childrenList = _.cloneDeep(it).children
          table[i].children = []
          this.filterData(it.children, table[i].children)
        }
      })
    },
    // 点击保存
    async onClickSave() {
      let save = this.$refs.privilege.getCheck()
      // save = save.join(',')
      // this.filterID()
      let fiterTree = flatTree(this.menuData)
      let pageButtonId = []
      fiterTree.map((it) => {
        if (it.childrenList && it.childrenList.length > 0) {
          it.childrenList.map((it) => {
            it.menuType === 'Button' && it.isOwn && pageButtonId.push(it.menuId)
          })
        }
      })
      let allId = [...save, ...pageButtonId]
      // pageButtonId && allId.push(pageButtonId)

      this.submitData.map((item) => {
        item.orgId && (item.orgId = item.orgId.join(','))
        item.bizId && (item.bizId = item.bizId.join(','))
      })
      let submitData = this.submitData.filter((it) => {
        if (allId.includes(it.menuId)) {
          return it
        }
      })
      let idList = []
      submitData.map((item) => {
        idList.push(item.menuId)
      })
      let menuIdList = []
      allId.map((it) => {
        if (!idList.includes(it)) {
          let newItem = {
            menuId: it
          }
          menuIdList.push(newItem)
        }
      })
      menuIdList = menuIdList.concat(submitData)
      if (menuIdList.length === 0) {
        this.$message.warning('请选择权限')
      }
      let param = {
        roleId: this.roleId,
        privileges: menuIdList
      }

      this.loading = true
      await postOrgPrivilege(param)
      this.$message.success('权限添加成功')
      this.buttonMenuId = ''
      this.submitData = []
      this.$emit('setConfig')
      this.$store.dispatch('GetUserPrivilege', this.$store.getters.userId)
      // if(this.buttonMenuId){
      //
      // }else{
      //   // this.$message.success('权限添加成功')
      //   // this.$emit('setConfig')
      // }
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

    nodeClick(data, isok, num) {
      // num 1复选框点击0文字点击
      let cloneMenuData = _.cloneDeep(data)
      let index = this.submitData.findIndex((item) => {
        return item.menuId == data.menuId
      })
      if (num == 1) {
        if (index > -1 && !data.cleck) {
          this.submitData.splice(index, 1)
          this.buttonMenuId = ''
        }
        isok && (this.buttonMenuId = cloneMenuData.menuId)
      }
      this.buttonMenuId = cloneMenuData.menuId
      isok && data.cleck
      if (index == -1 && data.cleck && this.buttonMenuId) {
        this.submitData.push({
          menuId: this.buttonMenuId,
          orgId: [],
          bizId: [],
          scopeClass: '',
          scopeValue: ''
        })
      }
      this.$set(this.defualtRuleData, 'orgId', [])
      this.$set(this.defualtRuleData, 'bizId', [])
      this.$set(this.defualtRuleData, 'form', {
        scopeClass: '',
        scopeValue: ''
      })

      if (index > -1 && data.cleck) {
        this.defualtRuleData = {
          orgId: this.submitData[index].orgId,
          bizId: this.submitData[index].bizId,
          form: {
            scopeClass: this.submitData[index].scopeClass,
            scopeValue: this.submitData[index].scopeValue
          }
        }
      }

      if (data) {
        this.buttonData = []
        data.childrenList &&
          data.childrenList.map((it) => {
            if (it.menuType === 'Button') {
              this.buttonData.push(it)
            }
          })
      }
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
.limit-wrap {
  display: flex;
  height: 400px;

  .scroll-item {
    min-width: 50%;
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
  .border__right {
    border-right: 1px solid #f2f2f2;
  }
}
</style>
