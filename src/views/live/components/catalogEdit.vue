<template>
  <el-dialog
    v-if="visible"
    v-loading="loading"
    :title="type === 'create' ? '创建分类' : type === 'createChild' ? '创建子分类' : '编辑分类'"
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
            <!-- 可通过选择上级分类为其构建子分类 -->
          </div>
        </el-col>
      </el-form-item>
      <!-- 可见范围 -->
      <el-form-item
        v-show="!parentOrgIdLabel"
        label=""
      >
        <div>
          <el-tabs v-model="activeName">
            <el-tab-pane
              label="可见范围"
              name="first"
            >
              <OrgTree
                :id-list="form.orgIdList"
                :org-source="1"
                input-placeholder="搜索组织名称"
                @selectedValue="getOrgList"
              ></OrgTree>
            </el-tab-pane>
            <!-- <el-tab-pane
              label="所属范围"
              name="second"
            >
              <OrgTree
                :id-list="form.orgIdListBackstage"
                @selectedValue="getOrgIdsBackstage"
              ></OrgTree>
            </el-tab-pane> -->
          </el-tabs>
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
  components: { OrgTree },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: 'first',
      type: 'create',
      radioDisable: {
        Company: false,
        Department: false,
        Group: false
      },
      form: {
        parentId: '',
        orgIds: [],
        name: '',
        source: 'live'
      },
      parentOrgIdLabel: '',
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      orgTree: [],
      loading: false
    }
  },
  watch: {
    visible(val) {
      if (!val) {
        this.$refs.ruleForm.resetFields()
        this.$set(this.form, 'name', '')
        this.$set(this.form, 'parentId', '')
      }
    }
  },
  methods: {
    // 可见范围返回数据
    getOrgList(val) {
      this.form.orgIds = val.map((item) => item.id)
    },
    async loadOrgTree() {
      let res = await getCategoryTree({ source: 'live' })
      this.orgTree = this.type === 'edit' ? this.clearCurrentChildren(res) : res
      this.form.parentId = this.form.parentId === '0' ? '' : this.form.parentId
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
        return child.name === this.form.name
      })
      if (hasSameName) {
        this.$message.error('该分类已存在')
      }
      return hasSameName
    },
    // 提交
    submit(type) {
      // if (this.checkSameName()) return
      this.$refs.ruleForm.validate((valid, obj) => {
        this.form.orgIds = this.form.orgIds.toString()
        if (valid) {
          if (this.type !== 'edit') {
            this.loading = true
            // console.log('this.form', this.form)

            this.form.parentId = this.form.parentId + ''
            this.form.source = 'live'

            const parmas = {
              name: this.form.name,
              parentId: this.form.parentId,
              orgIds: this.form.orgIds,
              source: 'live'
            }
            addCategory(parmas)
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
            // console.log('this.form', this.form)
            const parmas = {
              name: this.form.name,
              parentId: this.form.parentId,
              id: this.form.idStr,
              orgIds: this.form.orgIds,
              source: 'live'
            }
            editCategory(parmas)
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
      // this.$refs.ruleForm.resetFields()
      // this.$set(this.form, 'name', '')
      // this.$set(this.form, 'parentId', '')
    },
    // 创建分类
    create() {
      this.type = 'create'
      this.parentOrgIdLabel = ''
      this.$emit('changevisible', true)
      this.orgTree[0] && this.handleOrgNodeClick()
      // this.$nextTick(()=>{
      //   this.$refs.ruleForm.resetFields()
      // })
    },
    // 新建子分类
    createChild(row) {
      this.type = 'createChild'
      this.form = {
        parentId: row.idStr,
        name: '',
        source: 'live'
      }
      this.parentOrgIdLabel = row.name
      this.$emit('changevisible', true)
    },
    edit(row) {
      this.type = 'edit'
      this.form = _.cloneDeep(row)
      if (this.form.orgIdList.length) {
        this.form.orgIdList = this.form.orgIdList.reduce((pre, cur, index) => {
          pre.push({
            orgId: cur,
            orgName: this.form.orgNames.split(',')[index]
          })
          return pre
        }, [])
      }
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
      // this.$refs.ruleForm.clearValidate()
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
