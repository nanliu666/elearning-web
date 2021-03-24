<template>
  <el-dialog
    :title="
      type === 'create'
        ? `新建${currentType}分类`
        : type === 'createChild'
          ? `新建${currentType}子分类`
          : `编辑${currentType}分类`
    "
    :visible="visible"
    width="550px"
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
                ref="orgTree"
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
          <div class="select-tips">
            可通过选择上级分类为其构建子分类
          </div>
        </el-col>
      </el-form-item>
    </el-form>
    <span
      v-if="type === 'create'"
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
        @click="submit('refresh')"
      >完成</el-button>
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
        @click="submit('refresh')"
      >保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
const CLIENT_TYPE = ['题库', '试卷/考试']
import { getCategoryList, putCategory, postCategory } from '@/api/examManage/category'
import { mapGetters } from 'vuex'
export default {
  name: 'CatalogEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentType: '',
      CLIENT_TYPE,
      type: 'create',
      radioDisable: {
        Company: false,
        Department: false,
        Group: false
      },
      form: {
        parentId: '',
        name: '',
        type: ''
      },
      parentOrgIdLabel: '',
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      orgTree: []
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  methods: {
    // 当主页面修改后，编辑页面的加载函数修改
    async loadOrgTree() {
      let paramsform = {
        parentId: '0',
        name: '',
        type: this.$parent.searchParams.type
      }
      let res = await getCategoryList(paramsform)
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
          // 父级组织类型 ==== 当前组织的类型
          if (this.form.id === item.id) {
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
    submit() {
      if (this.type === 'create' && this.checkSameName()) return
      this.$refs.ruleForm.validate((valid, obj) => {
        if (valid) {
          if (this.type !== 'edit') {
            postCategory(
              _.assign(
                this.form,
                { createUser: this.userId },
                { type: this.$parent.searchParams.type }
              )
            ).then(() => {
              this.$message.success('创建成功')
              this.$emit('refresh')
              this.$emit('changevisible', false)
            })
          } else {
            putCategory(_.assign(this.form, { type: this.$parent.searchParams.type })).then(() => {
              this.$message.success('修改成功')
              this.$emit('refresh')
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
    create(type) {
      this.currentType = this.CLIENT_TYPE[type]
      this.type = 'create'
      this.parentOrgIdLabel = ''
      this.$emit('changevisible', true)
      this.orgTree[0] && this.handleOrgNodeClick()
      this.loadOrgTree()
    },
    // 新建子分类
    createChild(row) {
      this.type = 'createChild'
      this.form = _.cloneDeep(row)
      this.form.parentId = row.id
      this.form.name = ''
      this.parentOrgIdLabel = row.name
      this.$emit('changevisible', true)
      this.loadOrgTree()
    },
    edit(row) {
      this.type = 'edit'
      this.form = _.cloneDeep(row)
      this.parentOrgIdLabel = row.parentId === '0' ? '' : this.findOrg(row.parentId).name
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
      this.radioDisable = {
        Company: false,
        Department: false,
        Group: false
      }
      this.$refs.ruleForm.clearValidate()
      this.$emit('changevisible', false)
    },
    handleOrgNodeClick(data) {
      if (data !== undefined) {
        this.form.parentId = data.id
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
