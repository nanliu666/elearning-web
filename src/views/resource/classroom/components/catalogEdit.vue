<template>
  <el-dialog
    v-loading="loading"
    :title="type === 'create' ? '新建分类' : type === 'createChild' ? '新建子分类' : '编辑分类'"
    :visible="visible"
    width="800px"
    :modal-append-to-body="false"
    @close="handleClose"
  >
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="top"
      class="newOrgDailog"
    >
      <el-form-item
        label="分类名称"
        prop="name"
      >
        <el-input
          v-model.trim="form.name"
          maxlength="32"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="上级分类">
        <el-col>
          <el-select
            v-model="form.parentId"
            :disabled="type === 'createChild'"
            :multiple-limit="10"
            placeholder="请选择"
          >
            <el-option
              style="height: auto;padding:0"
              :value="form.parentId"
              :label="parentOrgIdLabel"
            >
              <el-tree
                ref="orgTreeRef"
                :data="orgTree"
                node-key="orgId"
                :props="{
                  children: 'children',
                  label: 'name'
                }"
                @node-click="handleOrgNodeClick"
              />
            </el-option>
          </el-select>
          <div
            v-if="type !== 'createChild'"
            class="select-tips"
          >
            可通过选择上级分类为其构建子分类
          </div>
        </el-col>
      </el-form-item>
      <!-- 可见范围 -->
      <el-form-item
        v-show="parentOrgIdLabel === '' || parentOrgIdLabel === '顶级'"
        label="可见范围"
      >
        <div>
          <UserOrgTree @selectedValue="getUserList"></UserOrgTree>
        </div>
        {{ userList }}
      </el-form-item>
    </el-form>
    <span
      v-if="type === 'create'"
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        size="medium"
        @click="submit('add')"
      >完成</el-button>
      <el-button
        size="medium"
        @click="submit('toCreate')"
      >完成并创建教室</el-button>
    </span>
    <span
      v-else
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="medium"
        @click="handleClose"
      >取消</el-button>
      <el-button
        type="primary"
        size="medium"
        @click="submit('add')"
      >保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getCategoryTree, addCategory, editCategory } from '@/api/live'
import { mapGetters } from 'vuex'
import UserOrgTree from '@/views/course/components/UserOrgTree'
export default {
  name: 'CatalogEdit',
  components: { UserOrgTree },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type: 'create',
      userList: [],
      form: {
        parentId: ''
      },
      parentOrgIdLabel: '',
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      orgTree: [],
      loading: false
    }
  },
  computed: {
    orgIds() {
      return _.join(_.map(this.userList, 'id'), ',')
    },
    ...mapGetters(['userId'])
  },
  methods: {
    // 可见范围返回数据
    getUserList(val) {
      this.userList = val
    },
    async loadOrgTree() {
      let res = await getCategoryTree({ source: 'classroom', addFlag: '1' })
      this.orgTree = this.type === 'edit' ? this.clearCurrentChildren(res) : res
    },
    // 过滤当前选择编辑的分类的子类
    clearCurrentChildren(res) {
      let tempTree = _.cloneDeep(res)
      const loop = (tree) => {
        _.each(tree, (item) => {
          if (!_.isEmpty(item.children)) {
            loop(item.children)
          }
          // 父级组织类型 === 当前组织的类型
          if (this.form.id === item.idStr) {
            item.children = []
          }
          return tree
        })
      }
      loop(tempTree)
      return tempTree
    },
    checkSameName() {
      let target = this.findOrg(this.form.parentId)
      let temp = _.isEmpty(target) ? this.orgTree : target.children
      let hasSameName = _.some(temp, (child) => {
        return child.name === this.form.name
      })
      if (hasSameName) {
        this.$message.error('该分类已存在')
      }
      return hasSameName
    },
    // 提交
    submit(type) {
      if (this.checkSameName()) return
      this.$refs.ruleForm.validate((valid, obj) => {
        if (valid) {
          if (this.type !== 'edit') {
            this.loading = true
            addCategory(_.assign(this.form, { orgIds: this.orgIds, source: 'classroom' }))
              .then((res) => {
                this.$message.success('创建成功')
                this.loading = false
                this.$emit('changevisible', false)
                if (type === 'add') {
                  this.$emit('refresh')
                } else {
                  this.$router.push({
                    path: '/resource/classroom/edit',
                    query: { catalogId: res.id }
                  })
                }
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            this.loading = true
            editCategory(_.assign(this.form, { source: 'classroom' }))
              .then(() => {
                this.$message.success('修改成功')
                this.$emit('refresh')
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
            this.$emit('changevisible', false)
          }
        } else {
          this.$message.error(obj[Object.keys(obj)[0]][0].message)
          return false
        }
      })
    },
    // 新建分类
    create() {
      this.userList = []
      this.type = 'create'
      this.parentOrgIdLabel = ''
      this.$emit('changevisible', true)
      this.orgTree[0] && this.handleOrgNodeClick()
    },
    // 新建子分类
    createChild(row) {
      this.userList = []
      this.type = 'createChild'
      this.form = _.pick(_.cloneDeep(row), ['name', 'parentId', 'source'])
      this.form.parentId = row.idStr
      this.form.name = ''
      this.parentOrgIdLabel = row.name
      this.$emit('changevisible', true)
    },
    edit(row) {
      this.userList = []
      this.type = 'edit'
      const { idStr, parentId, name } = row
      this.form = {
        id: idStr,
        parentId,
        name
      }
      this.parentOrgIdLabel = row.parentId == '0' ? '顶级' : this.findOrg(row.parentIdStr).name
      this.$emit('changevisible', true)
      this.loadOrgTree()
    },
    findOrg(id) {
      let org = {}
      function deep(arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].idStr === id) {
            org = arr[i]
            return
          }
          if (arr[i].children && arr[i].children.length > 0) {
            deep(arr[i].children)
          }
        }
      }
      deep(this.orgTree)
      return org
    },
    handleClose() {
      this.form = { parentId: '' }
      this.$refs.ruleForm.clearValidate()
      this.$emit('changevisible', false)
    },
    handleOrgNodeClick(data) {
      if (data !== undefined) {
        this.form.parentId = data.idStr
        this.parentOrgIdLabel = data.name
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.select-tips {
  font-size: 12px;
  color: #a1a8ae;
  margin-top: -8px;
}
.newOrgDailog {
  .el-select {
    width: 100%;
  }
}
.addressLoading {
  text-align: center;
}
/deep/ .el-form-item__error {
  padding-top: 0;
}
/deep/ .el-form-item__label {
  padding: 0 0 0 0;
}
</style>
