<template>
  <el-dialog
    v-loading="loading"
    :title="type === 'create' ? '新建分类' : type === 'createChild' ? '新建子分类' : '编辑分类'"
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
        type="primary"
        size="medium"
        @click="submit"
      >完成</el-button>
      <el-button
        size="medium"
        @click="submitAndCreate"
      >完成并创建课程</el-button>
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
        @click="submit"
      >保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  updateKnowledgeCatalog,
  addKnowledgeCatalog,
  getKnowledgeCatalogList
} from '@/api/knowledge/knowledge'
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
      type: 'create',
      radioDisable: {
        Company: false,
        Department: false,
        Group: false
      },
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
  methods: {
    loadOrgTree() {
      getKnowledgeCatalogList().then((res) => {
        this.orgTree = res
      })
    },
    // 完成并创建课程
    submitAndCreate() {},
    // 提交
    submit() {
      this.$refs.ruleForm.validate((valid, obj) => {
        if (valid) {
          if (this.type !== 'edit') {
            this.loading = true
            addKnowledgeCatalog(this.form)
              .then(() => {
                this.$message.success('创建成功')
                this.$emit('refresh')
                this.loading = false
                this.$emit('changevisible', false)
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            this.loading = true
            updateKnowledgeCatalog(this.form)
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
      this.type = 'create'
      this.parentOrgIdLabel = ''
      this.$emit('changevisible', true)
      this.orgTree[0] && this.handleOrgNodeClick()
    },
    // 新建子分类
    createChild(row) {
      this.type = 'createChild'
      this.form = _.cloneDeep(row)
      this.form.parentId = row.id
      this.form.name = ''
      this.parentOrgIdLabel = row.name
      this.$emit('changevisible', true)
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
          if (arr[i].id === id) {
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
