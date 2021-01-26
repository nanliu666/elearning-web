<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialog"
      width="1000px"
      append-to-body
      :before-close="handleClose"
    >
      <div
        v-loading="loading"
        class="content"
      >
        <commonForm
          ref="form"
          :model="form"
          :columns="columns"
        >
          <template slot="workNo">
            <div class="work">
              <el-input
                v-model="form.workNo"
                placeholder="请输入工号"
                style="width: 150px;margin-right:10px "
                @input="(value) => inputPhonenum(value, 'phonenum')"
              />
              <div
                class="workno"
                @click="handleNowWork"
              >
                生成工号
              </div>
            </div>
          </template>
          <template slot="phonenum">
            <el-input
              v-model="form.phonenum"
              placeholder="请输入手机号"
              maxlength="11"
              @input="(value) => inputPhonenum(value, 'phonenum')"
            />
          </template>
        </commonForm>
        <el-button
          class="create"
          size="medium"
          type="primary"
          @click="onsubmit"
        >
          <span v-if="!editData.userId">新增</span> <span v-else>保存</span>
        </el-button>
        <div style="margin-bottom: 50px">
          <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="80"
            />
            <el-table-column
              prop="userId"
              label="用户ID"
              width="180"
            />
            <el-table-column
              prop="workNo"
              label="工号"
            />
            <el-table-column
              prop="name"
              label="真实姓名"
            />
            <el-table-column
              prop="phonenum"
              label="手机号"
            />
            <el-table-column
              prop="userStatus"
              label="用户状态"
              :formatter="formatter"
            />
            <el-table-column
              prop="address"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  @click="handleDelete(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { putAdmin, postAdmin, getAdmin, delAdmin, getRule, getworkno } from '@/api/system/tenant'

export default {
  name: 'SuperAdminDialog',
  props: {
    row: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      editData: {},
      tableData: [],
      title: '超级管理员',
      dialog: true,
      rules: '',
      columns: [
        {
          span: 4,
          prop: 'rule',
          itemType: 'select',
          options: [],
          props: {
            label: 'name',
            value: 'rule'
          },
          label: '工号规则',
          maxlength: 5,
          required: false
        },
        {
          span: 6,
          offset: 1,
          prop: 'workNo',
          rows: 1,
          itemType: 'slot',
          label: '工号',
          rules: [
            {
              required: true,
              message: '请输入工号',
              trigger: 'blur'
            }
          ]
        },
        {
          span: 4,
          offset: 1,
          prop: 'name',
          type: 'input',
          rows: 1,
          itemType: 'input',
          label: '真实姓名',
          required: true
        },
        {
          span: 4,
          offset: 1,
          prop: 'phonenum',
          type: 'input',
          rows: 1,
          maxlength: 11,
          itemType: 'slot',
          label: '手机号',
          rules: [
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            }
          ]
        }
      ],
      form: {
        workNo: '',
        name: '',
        phonenum: '',
        rule: ''
      }
    }
  },

  watch: {
    dialog: {
      handler: function() {
        this.$emit('update:dialogVisible', this.dialog)
      }
    }
  },
  mounted() {
    this.getData()
    this.getgrule()
  },
  methods: {
    handleNowWork() {
      if (this.form.rule) {
        let params = {
          rule: this.form.rule
        }
        getworkno(params).then((res) => {
          this.form.workNo = res.workNo
        })
      } else {
        this.$message.warning('请选择工号规则')
      }
    },
    getgrule() {
      let params = {
        tenantId: this.row.tenantId
      }
      getRule(params).then((res) => {
        this.columns.find((it) => it.prop === 'rule').options = res
      })
    },
    inputPhonenum(value, index) {
      value = value.replace(/[^\d]/g, '')
      this.form[index] = value
    },
    formatter(row) {
      return row.userStatus === '1' ? '正常' : '禁用（冻结)'
    },
    getData() {
      let params = {
        tenantId: this.row.tenantId
      }
      this.loading = true
      getAdmin(params)
        .then((res) => {
          this.tableData = res
        })
        .finally(() => {
          // setTimeout(()=>{
          this.loading = false
          // },1000)
        })
    },
    onsubmit() {
      this.$refs.form.validate().then(() => {
        let { tenantId } = this.row
        let { workNo, name, phonenum } = this.form
        let params = {
          tenantId: tenantId,
          workNo: workNo,
          name: name,
          phonenum: phonenum
        }
        this.editData.userId && (params.userId = this.editData.userId)
        let Rule = this.editData.userId ? putAdmin : postAdmin
        this.editData.id && (params.id = this.editData.id)
        this.loading = true
        Rule(params)
          .then(() => {
            this.editData.userId && (this.editData = {})
            this.form = {}
            this.getData()
          })
          .finally(() => {
            // setTimeout(()=>{
            this.loading = false
            // },1000)
          })
      })
    },
    handleEdit(row) {
      this.editData = JSON.parse(JSON.stringify(row))
      let { workNo, name, phonenum } = this.editData
      this.form = {
        ...this.from,
        workNo,
        name,
        phonenum
      }
    },
    handleDelete(row) {
      this.$confirm('你确定要删除这个用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let { tenantId } = this.row
        let params = {
          userId: row.userId,
          tenantId: tenantId
        }
        this.loading = true
        delAdmin(params)
          .then(() => {})
          .finally(() => {
            // setTimeout(()=>{
            this.getData()
            this.loading = false
            // },1000)
          })
      })
    },
    handleClose() {
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  .create {
    position: absolute;
    top: 28px;
    right: 2px;
  }
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
.label {
  display: inline-block;
  width: 100px;
  text-align: right;
  line-height: 40px;
  font-size: 14px;
  font-weight: 800;
  color: #333;
}
.prop {
  display: inline-block;
  line-height: 40px;
  font-size: 14px;
  color: #666;
  margin-left: 10px;
}
.text {
  font-size: 12px;
  color: #999;
  position: relative;
  top: -15px;
}
.button {
  color: $primaryColor;
}
.work {
  display: flex;
  display: -moz-box;
  display: -webkit-flex;
  display: -ms-flex;
  flex-flow: row nowrap;
}
.workno {
  background-color: #fff;
  border: 0;
  /*padding: 0 10px;*/
  color: cornflowerblue;
  cursor: pointer;
}
</style>
