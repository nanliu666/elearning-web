<template>
  <div>
    <el-dialog
      title="角色设置"
      :visible="visible"
      width="1000px"
      append-to-body
      :before-close="close"
      custom-class="user-role-edit-dialog"
    >
      <div class="title-wr">
        <div class="title">
          已选择
        </div>
        <el-tag size="small">
          {{ user.name }} {{ ' ' }}({{ user.workNo }})
        </el-tag>
      </div>
      <div class="content-wr">
        <div
          v-loading="loading"
          class="left"
        >
          <div class="title">
            角色列表
          </div>
          <el-input
            v-model="filterText"
            placeholder="角色名称"
            style="margin-bottom: 10px"
          />
          <el-tree
            ref="tree"
            :data="allRoleTree"
            show-checkbox
            default-expand-all
            node-key="roleId"
            :props="props"
            :filter-node-method="filterNode"
            :check-on-click-node="true"
            @check="handleCheckChange"
          />
        </div>
        <div class="right">
          <div>
            <span class="title">已添加角色</span>
            <span style="float:right;">
              <el-button
                type="text"
                @click="showPreview"
              >预览权限</el-button>
              <el-button
                type="text"
                @click="handleUnselectAll()"
              >清空</el-button>
            </span>
          </div>
          <el-tag
            v-for="item in selectList"
            :key="item.roleId"
            size="small"
            closable
            @close="handleUnselect(item)"
          >
            {{ item.roleName }}
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
          type="primary"
          size="medium"
          @click="handleSubmit"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
    <role-permission
      v-if="previewVisible"
      :visible.sync="previewVisible"
      disabled
      :role-id="roleIds"
    />
  </div>
</template>
<script>
import { getRoleList, modifyUserRole, getUserRole } from '@/api/system/user'
import rolePermission from './rolePermission'

export default {
  name: 'UserRoleEdit',
  components: {
    rolePermission
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      submitting: false,
      filterText: '',
      props: {
        disabled: (data) => !data.roleName,
        label: (item) => item.groupName || item.categoryName || item.roleName
      },
      selectList: [],
      oldSelectList: [],
      roleEdit: false,
      allRoleTree: [],
      user: {},
      previewVisible: false,
      loading: false
    }
  },
  computed: {
    roleIds() {
      return this.selectList.map((item) => item.roleId).join(',')
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {},
  methods: {
    /**
     * 初始化
     * @param {String} user
     */
    init(user) {
      this.user = user
      this.loadData()
      this.$emit('update:visible', true)
    },
    loadData() {
      this.loading = true
      Promise.all([this.getUserRole(), this.getRoleList()])
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    showPreview() {
      if (this.roleIds.length > 0) {
        this.previewVisible = true
      } else {
        this.$message.error('请先选择角色')
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.roleName && data.roleName.indexOf(value) !== -1
    },
    handleCheckChange(data) {
      let index = this.selectList.findIndex((item) => item.roleId === data.roleId)
      if (index >= 0) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(data)
      }
    },
    handleUnselect(item) {
      this.selectList = this.selectList.filter((i) => i != item)
      this.$refs.tree.setCheckedKeys(this.selectList.map((i) => i.roleId))
    },
    handleUnselectAll() {
      this.selectList = []
      this.$refs.tree.setCheckedKeys([])
    },
    close() {
      this.clear()
      this.$emit('update:visible', false)
    },
    clear() {
      this.user = {}
      this.selectList = []
      this.oldSelectList = []
      this.$refs.tree.setCheckedKeys([])
    },
    getUserRole() {
      return new Promise((resolve, reject) => {
        getUserRole(this.user.userId)
          .then((res) => {
            const list = res
            this.selectList = list.slice()
            this.oldSelectList = list.slice()

            this.$nextTick(() => {
              this.$refs.tree.setCheckedKeys(this.selectList.map((i) => i.roleId))
            })
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
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
          roleId: id,
          operatorType: 'Add'
        }))
        .concat(
          removeIdList.map((id) => ({
            roleId: id,
            operatorType: 'Del'
          }))
        )

      return result
    },
    handleSubmit() {
      this.submitting = true
      modifyUserRole(
        this.user.userId,
        this.diff(
          this.selectList.map((i) => i.roleId),
          this.oldSelectList.map((i) => i.roleId)
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
    },
    getRoleList() {
      return new Promise((resolve, reject) => {
        let params = {
          categoryId: ''
        }
        getRoleList(params)
          .then((data) => {
            this.resolveTree(data)
            this.allRoleTree = data
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    resolveTree(tree) {
      if (tree.length === 0) {
        return
      }
      tree.forEach((node) => {
        if (node.categories) {
          node.roleId = node.groupId
          node.children = node.categories.map((category) => ({
            ...category,
            roleId: category.categoryId
          }))
          this.resolveTree(node.children)
        }
        if (node.roles) {
          node.children = node.roles.slice()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .user-role-edit-dialog {
  .el-checkbox.is-disabled {
    display: none;
  }
  .el-dialog__body {
    padding: 24px;
    padding-top: 10px;
  }
  .el-dialog__footer {
    padding: 0 24px 24px;
  }
  .el-dialog__header {
    padding: 24px 24px 10px;
  }
  .title-wr {
    padding-bottom: 10px;
    .title {
      line-height: 30px;
    }
  }
  .content-wr {
    min-height: 400px;
    display: flex;
    border: 1px solid #f2f2f2;

    .left {
      width: 60%;
      padding: 8px;
      padding-right: 20px;
      .title {
        line-height: 30px;
      }
    }
    .right {
      border-left: 1px solid #f2f2f2;
      width: 40%;
      padding: 8px;
      padding-left: 20px;
      .title {
        line-height: 30px;
      }
      .el-tag {
        margin-right: 12px;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
