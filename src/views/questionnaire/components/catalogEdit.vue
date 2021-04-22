<template>
  <el-dialog
    v-if="visible"
    v-loading="loading"
    :title="type === 'create' ? '创建分类' : type === 'createChild' ? '创建子分类' : '编辑分类'"
    :visible="visible"
    width="800px"
    :modal-append-to-body="false"
    top="5vh"
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
          placeholder="请输入"
          maxlength="32"
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
              style="height: auto; padding: 0"
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
            可通过选择上级类目为其创建子分类，子分类可见范围跟随父分类
          </div>
        </el-col>
      </el-form-item>
      <!-- 可见范围 -->
      <el-form-item
        v-show="type === 'create' || (type === 'edit' && parentOrgIdLabel === '顶级')"
        label="可见范围"
      >
        <div>
          <OrgTree
            :id-list="form.orgIdList"
            @selectedValue="getOrgList"
          ></OrgTree>
        </div>
        <!-- {{ userList }} -->
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
        @click="handleClose"
      >取消</el-button>
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
import OrgTree from '@/components/UserOrg-Tree/OrgTree'
import { getCategoryTree, addCategory, editCategory } from '@/api/live'
export default {
  name: 'CatalogEdit',
  components: {
    OrgTree
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type: 'create',
      form: {
        name: '',
        parentId: '',
        orgIds: []
      },
      parentOrgIdLabel: '',
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      orgTree: [],
      loading: false
    }
  },
  methods: {
    // 可见范围返回数据
    getOrgList(val) {
      this.form.orgIds = val.map((item) => item.id)
    },
    async loadOrgTree() {
      let res = await getCategoryTree({ source: 'questionnaire', addFlag: '1' })
      if (this.type === 'edit') {
        this.orgTree = this.clearCurrentChildren(res)
        this.parentOrgIdLabel =
          this.form.parentId === '0' ? '顶级' : this.findOrg(this.form.parentId).name
      } else {
        this.orgTree = res
      }
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
      if (this.type === 'create' && this.checkSameName()) return
      this.$refs.ruleForm.validate((valid, obj) => {
        this.form.orgIds = this.form.orgIds.toString()
        this.form.source = 'questionnaire'
        if (valid) {
          if (this.type !== 'edit') {
            this.loading = true
            addCategory(this.form)
              .then(() => {
                this.$message.success('创建成功')
                this.loading = false
                this.$emit('changevisible', false)
                if (type === 'add') {
                  this.$emit('refresh')
                } else {
                  // this.$router.push({
                  //   path: "/resource/classroom/edit",
                  //   query: { catalogId: res.id },
                  // });
                }
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            this.loading = true
            editCategory(_.assign(this.form, { source: 'questionnaire' }))
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
    // 创建分类
    create() {
      this.type = 'create'
      _.assign(this.$data, this.$options.data())
      this.$emit('changevisible', true)
      this.orgTree[0] && this.handleOrgNodeClick()
      this.loadOrgTree()
    },
    // 新建子分类
    createChild(row) {
      this.type = 'createChild'
      this.form = _.cloneDeep(row)
      this.form.parentId = row.idStr
      this.form.name = ''
      this.parentOrgIdLabel = row.name
      this.$emit('changevisible', true)
      this.loadOrgTree()
    },
    edit(row) {
      this.type = 'edit'
      this.loadOrgTree()
      this.form = _.cloneDeep(row)
      this.$emit('changevisible', true)
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
  margin-bottom: -24px;
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
/deep/ .el-dialog__body {
  padding: 15px 20px 0;
}
/deep/ .el-form-item {
  margin-bottom: 10px;
}
</style>
