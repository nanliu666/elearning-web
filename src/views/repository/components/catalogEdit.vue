<template>
  <el-dialog
    v-if="visible"
    v-loading="loading"
    :title="type === 'create' ? '新建分类' : type === 'createChild' ? '新建子分类' : '编辑分类'"
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
            可通过选择上级类目为其创建子分类，子分类可见范围跟随父分类
          </div>
        </el-col>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div>
            是否公开

            <el-tooltip
              class="item"
              effect="dark"
              content="此选项可以选择该分类是否展示给其他子公司"
              placement="top-start"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </template>
        <el-select
          v-model="form.isPublic"
          placeholder="请选择"
        >
          <el-option
            label="否"
            :value="0"
          ></el-option>
          <el-option
            label="是"
            :value="1"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 可见范围 -->
      <el-form-item
        v-show="!parentOrgIdLabel"
        label="可见范围"
      >
        <div>
          <OrgTree
            :id-list="form.orgIdList"
            @selectedValue="getOrgList"
          ></OrgTree>
        </div>
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
      >完成并创建资源</el-button>
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
import {
  updateKnowledgeCatalog,
  addKnowledgeCatalog,
  getKnowledgeCatalogList
} from '@/api/knowledge/knowledge'
import { mapGetters } from 'vuex'
import OrgTree from '@/components/UserOrg-Tree/OrgTree'

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
      radioDisable: {
        Company: false,
        Department: false,
        Group: false
      },
      form: {
        parentId: '',
        orgIds: [],
        isPublic: 0
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
    ...mapGetters(['userId'])
  },
  methods: {
    // 可见范围返回数据
    getOrgList(val) {
      this.form.orgIds = val.map((item) => item.id)
    },
    async loadOrgTree() {
      let res = await getKnowledgeCatalogList()
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
        return child.name == this.form.name
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
        this.form.orgIds = this.form.orgIds.toString()
        this.form.source = 'knowledge'
        if (valid) {
          if (this.type !== 'edit') {
            this.loading = true
            addKnowledgeCatalog(_.assign(this.form, { creatorId: this.userId }))
              .then((res) => {
                this.$message.success('创建成功')
                this.loading = false
                this.$emit('changevisible', false)
                if (type === 'add') {
                  this.$emit('refresh')
                } else {
                  this.$router.push({
                    path: '/repository/knowledgeEdit',
                    query: { catalogId: res.id }
                  })
                }
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
/deep/.el-dialog__footer {
  padding: 0px 20px 20px;
}
</style>
