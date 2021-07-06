<template>
  <el-aside class="aside-wrap">
    <div class="role-aside_wrap">
      <div
        v-p="ADD_ROLE_CATALOG"
        class="bottom-wrap"
      >
        <div
          class="bottom-item"
          @click="createNew()"
        >
          <i class="el-icon-circle-plus" />
          创建分类
        </div>
      </div>
      <div class="tree-wrap">
        <div class="tree">
          <asideTree
            :props="props"
            :current-id="currentId"
            :tree-list="treeList"
            :group-id.sync="cateForm.groupId"
            @del="handleDel"
            @reload="reload"
            @edit="handleEdit"
          />
        </div>
      </div>
    
    </div>
    <el-dialog
      :title="cateForm.categoryId ? '重命名' : '创建分类'"
      :visible.sync="cateVisible"
      width="550px"
      append-to-body
    >
      <div style="padding: 0 40px">
        <commonForm
          ref="form"
          :model="cateForm"
          :columns="columns"
          :config="{ inline: true, labelPosition: 'left' }"
        />
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          style="margin-right: 15px"
          size="medium"
          @click="onClickVisible"
        >
          取消
        </el-button>
        <el-button
          v-loading="loading"
          type="primary"
          size="medium"
          @click="onCatSave()"
        >
          保存
        </el-button>
      </div>
    </el-dialog>
  </el-aside>
</template>

<script>
import asideTree from './roleAsideTree'
import { createCate, updateCate, delCate } from '../../../api/system/role'
const BASE_COLUMNS = [
  {
    prop: 'categoryName',
    itemType: 'input',
    placeholder: '请输入分类名称',
    label: '分类名称',
    span: 24,
    maxlength: 20,
    required: true
  }
]
import { ADD_ROLE_CATALOG } from '@/const/privileges'
export default {
  name: 'RoleAside',
  components: {
    asideTree
  },
  props: {
    treeList: {
      type: Array,
      default: () => []
    },
    currentId: {
      type: [String, Number],
      default: ''
    },
    props: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data() {
    return {
      columns: BASE_COLUMNS,
      cateId: '',
      loading: false,
      cateVisible: false,
      searchInput: '',
      cateForm: {
        categoryId: '',
        categoryName: '',
        groupId: ''
      },
      preTreeList: [],
      positions: [],
      positionProps: {
        label: 'name'
      },
      jobProps: {
        label: 'orgName'
      }
    }
  },

  computed: {
    ADD_ROLE_CATALOG: () => ADD_ROLE_CATALOG
  },
  watch: {
    treeList: {
      handler(val) {
        this.cateForm.groupId = val[0] ? val[0][this.props.id] : ''
      },
      deep: true
    }
  },

  methods: {
    /**
     * @description 点击分类树节点
     * @param node 当前节点的 Node 对象
     * @param data 当前节点的数据
     */
    handleEdit(node, data) {
      this.cateForm.categoryId = data.cateId
      this.cateForm.categoryName = data.label
      this.cateVisible = true
    },
    onClickVisible(str, node, data) {
      // 分类
      this.$nextTick(() => {
        if (!data) {
          // 新增，初始化表单数据
          this.cateForm.categoryId = ''
          this.cateForm.categoryName = ''
          let groupId = this.cateForm.groupId
          this.$nextTick(() => {
            if (this.$refs.cateForm) {
              this.$refs.cateForm.resetForm()
              this.cateForm.groupId = groupId
            }
          })
        } else {
          // 点击的是编辑
          this.cateForm.categoryId = data[this.props.id]
          this.cateForm.categoryName = data[this.props.label]
          this.cateForm.groupId = data.groupId
        }
      })
      this.cateVisible = !this.cateVisible
    },
    handleDel(node, data) {
      this.delCate(node, data)
    },
    // 删除分类提示
    delCate(node, data) {
      const baseTips = '您确定要删除该分类吗？'
      const roleTips = '<br/> 分类下有角色，无法删除，请先删除所有角色'
      const tips = data.roleNum === 0 ? baseTips : `${baseTips}${roleTips}`
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          this.delCateFunc(node, data)
        })
        .catch(() => {})
    },

    // 删除分类
    delCateFunc(node, data) {
      const params = {
        id: data[this.props.id]
      }
      delCate(params).then(() => {
        this.$message.success('删除分类成功')
        if (data[this.props.id] === this.currentId) {
          // 如果删除的分类是当前激活的分类，清空激活分类，重新获取
          this.$emit('update:currentId', '')
        }
        this.reload()
      })
    },

    //保存分类
    onCatSave() {
      this.$refs.form.validate().then(() => {
        if (this.cateForm.categoryId) {
          this.updateCateFunc()
        } else {
          this.createCateFunc()
        }
      })
    },
    createNew() {
      this.initCatform()
      this.cateVisible = true
    },
    // 新增分类
    createCateFunc(str) {
      const params = {
        name: this.cateForm.categoryName
      }
      this.loading = true
      createCate(params)
        .then(() => {
          this.initCatform()
          this.loading = false
          this.$message.success('创建分组成功')
          this.onClickVisible(str)
          this.$emit('reload')
        })
        .catch(() => {
          this.loading = false
        })
    },

    //清空分类数据
    initCatform() {
      this.cateForm = {
        categoryId: '',
        categoryName: ''
      }
    },

    // 更新分类
    updateCateFunc(str) {
      const params = {
        id: this.cateForm.categoryId,
        name: this.cateForm.categoryName
      }
      this.loading = true
      updateCate(params)
        .then(() => {
          this.initCatform()
          this.loading = false
          this.$message.success('修改分类成功')
          this.onClickVisible(str)
          this.$emit('reload')
        })
        .catch(() => {
          this.loading = false
        })
    },

    // 父组件role重新加载数据
    reload(data) {
      this.$emit('reload', data)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-form-item__content {
  width: 380px;
}
/deep/ .el-dialog__header {
  padding: 16px 0;
  margin: 0 24px;
  border-bottom: 1px solid rgba(208, 211, 214, 0.44);
  font-size: 18px;
  color: #202940;
  line-height: 24px;
}

/deep/ .el-dialog__body {
  padding: 24px;
}

/deep/ .el-dialog__footer {
  padding: 0px 24px 24px;
}

/deep/ .el-form-item__label {
  line-height: 20px;
  font-size: 14px;
  color: #0f0000;
}

/deep/ .el-form-item {
  margin-bottom: 24px;
}
.dialog-footer {
  text-align: right;
}
.aside-wrap {
  margin-left: -16px;
}

.role-aside_wrap {
  display: flex;
  flex-direction: column;
  height: 100%;

  .tree-wrap {
    padding: 0 16px;
    flex: 1;
  }
}

.tree-container {
  border: 1px solid #f2f2f2;
  height: 150px;
}

.bottom-wrap {
  /*border-top: 1px solid rgba(215, 215, 215, 1) ;*/
  display: flex;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
  // box-shadow: 0px -2px 5px rgba(0, 0, 0, 0.0980392156862745);

  .bottom-item {
    flex: 1;
    text-align: center;
    color: #409eff;
    cursor: pointer;
  }
}
.tree {
  /*overflow-y: auto;*/
  height: calc(100% - 50px);
}
</style>
