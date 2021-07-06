<template>
  <el-dialog
    :title="dialogTitle"
    :visible="visible"
    width="550px"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    @close="handleClose"
  >
    <el-row
      type="flex"
      justify="center"
    >
      <el-col :span="24">
        <common-form
          ref="form"
          :model="form"
          :columns="columns"
        >
        </common-form>
      </el-col>
    </el-row>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        size="medium"
        :loading="saveLoading"
        @click="onClickSave"
      >
        保存
      </el-button>
      <el-button
        v-if="!type"
        size="medium"
        :loading="saveContinue"
        @click="onContinue"
      >
        保存并继续添加
      </el-button>
      <el-button
        v-else
        size="medium"
        @click="handleClose"
      >
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
//import { getStationTree, editStation, deleteStation } from '@/api/system/station'
import { getRankTree, addRank, editRank, deleteRank } from '@/api/system/rank'
export default {
  name: 'JobsForm',
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dialogTitle: '',
      visible: false,
      form: {},
      columns: [
        {
          prop: 'name',
          label: '职级名称',
          itemType: 'input',
          required: true,
          span: 24,
          maxlength: 32,
          placeholder: ' 请输入名称，建议不超过32个字符'
        },
        {
          prop: 'parentId',
          itemType: 'treeSelect',
          label: '上级职级',
          span: 24,
          props: {
            selectParams: {
              placeholder: '请选择',
              multiple: false
            },
            treeParams: {
              data: [],
              'check-strictly': true,
              'default-expand-all': false,
              'expand-on-click-node': false,
              clickParent: true,
              filterable: false,
              props: {
                children: 'children',
                label: 'name',
                disabled: 'disabled',
                value: 'id'
              }
            }
          }
        },
        {
          prop: 'remark',
          label: '职级描述',
          placeholder: '请输入职级描述,最多100字符',
          itemType: 'input',
          type: 'textarea',
          maxlength: 100,
          showWordLimit: true,
          span: 24,
          rows: 4
        }
      ],
      type: '',
      treeData: [],
      saveLoading: false,
      saveContinue: false
    }
  },
  watch: {
    rowData: {
      handler: function(newVal) {
        this.rowData = newVal
        this.commonWatch(this.rowData, this.type)
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.loadOrgData()
  },
  methods: {
    // 关闭模态框
    handleClose() {
      this.visible = false
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    // 打开模态框
    openDialog(title, type) {
      this.type = type
      this.dialogTitle = title
      this.commonWatch(this.rowData, this.type)
      this.columns.forEach((v) => {
        if (v.prop == 'parentId') this.$set(v, 'disabled', type == 'create')
      })
      this.visible = true
    },
    // 初始化数据
    async loadOrgData() {
      await getRankTree().then((res) => {
        // 递归循环删除层级数5层以下的节点
        const loop = (tree) => {
          _.each(tree, (item) => {
            if (item.fullName.split('|').length > 3 && item.children) {
              delete item.children
            }
            loop(item.children)
          })
        }
        loop(res)
        this.treeData = res
      })
      this.columns.find((item) => item.prop === 'parentId').props.treeParams.data = this.treeData
    },
    // 保存并继续添加
    onContinue() {
      this.$refs.form.validate().then(async (valid) => {
        if (!valid) return
        let fullPath = '|'
        let params = _.cloneDeep(this.form)
        this.saveContinue = true
        // 处理当前节点完整路径,完整路径=父级完整路径+父级ID
        if (params.parentId) {
          let flatObj = this.getParentId(this.treeData, params.parentId)
          if (flatObj && flatObj.length) {
            let idArr = []
            flatObj.map((v) => {
              idArr.push(v.id)
            })
            fullPath += idArr.reverse().join('|')
          }
        } else {
          params.parentId = 0
        }
        if (!params.remark) params.remark = ''
        params.fullName = fullPath
        params.sort = 1
        await addRank(params)
          .then(() => {
            this.loadOrgData()
            this.$nextTick(() => {
              this.form = {}
            })
            this.$emit('initData')
            this.$message({
              type: 'success',
              message: '保存成功，请继续添加!'
            })
          })
          .finally(() => {
            this.saveContinue = false
          })
      })
    },
    // 点击保存
    onClickSave() {
      this.$refs.form.validate().then(async (valid) => {
        if (!valid) return
        let fullPath = '|'
        let params = _.cloneDeep(this.form)
        this.saveLoading = true
        // 处理当前节点完整路径,完整路径=父级完整路径+父级ID
        if (params.parentId) {
          let flatObj = this.getParentId(this.treeData, params.parentId)
          if (flatObj && flatObj.length) {
            let idArr = []
            flatObj.map((v) => {
              idArr.push(v.id)
            })
            fullPath += idArr.reverse().join('|')
          }
        } else {
          params.parentId = 0
        }
        if (!params.remark) params.remark = ''
        params.fullName = fullPath
        params.sort = 1
        if (this.type == 'edit') {
          params.id = this.rowData.id
          editRank
          await editRank(params)
            .then(() => {
              this.handleClose()
              this.loadOrgData()
              this.$emit('initData', this.rowData.parentId)
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
            })
            .finally(() => {
              this.saveLoading = false
            })
          return
        }
        await addRank(params)
          .then(() => {
            this.handleClose()
            this.loadOrgData()
            this.$emit('initData', this.rowData.parentId)
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
          })
          .finally(() => {
            this.saveLoading = false
          })
      })
    },
    // 删除操作
    deleteOpe(row) {
      let params = {
        ids: row.id
      }
      this.$confirm('您确定要删除选中的职级吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        //   判断删除行是否包含子级
        if (row.hasChildren) {
          this.$message({
            type: 'error',
            message: '删除失败，本职级含有下级职级，请先将下级职级调整后再删除!'
          })
        } else {
          await deleteRank(params).then(() => {
            this.$emit('initData')
            this.loadOrgData()
            this.$message({
              type: 'success',
              message: '已成功删除该职级!'
            })
          })
        }
      })
    },
    // 监听公共方法,根据不同情况进行不同的操作，1、创建下级职级，2、编辑
    commonWatch(data, type) {
      let { name, parentId, remark } = data
      this.form = {
        name,
        parentId,
        remark
      }
      // 创建下级职级，只保留父级
      if (type == 'create') {
        this.form.name = ''
        this.form.remark = ''
        this.form.parentId = data.id
      }
      // 编辑，JSON递归寻找父级ID
      if (type == 'edit') {
        // debugger
        let faltTree = this.findPnodeId(this.treeData)
        faltTree.map((v) => {
          if (parentId == v.parentId) this.form.parentId = v.parentId == '0' ? null : v.parentId
        })
      }
    },
    //先把属性结构扁平化，再根据id找到父级ID
    findPnodeId(data) {
      let res = []
      data.forEach((item) => {
        res.push(item)
        if (item.children) {
          res.push(...this.findPnodeId(item.children))
        }
      })
      return res
    },
    getParentId(list, id) {
      for (let i in list) {
        if (list[i].id == id) {
          return [list[i]]
        }
        if (list[i].children) {
          let node = this.getParentId(list[i].children, id)
          if (node !== undefined) {
            return node.concat(list[i])
          }
        }
      }
    }
  }
}
</script>

<style></style>
