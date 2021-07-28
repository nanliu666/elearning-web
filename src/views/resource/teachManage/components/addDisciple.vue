<template>
  <div class="fill">
    <el-form
      ref="subForm"
      :model="formData"
      :rules="formRules"
      label-position="top"
    >
      <el-row>
        <el-col
          :span="24"
          class="add-apprentice"
        >
          <el-button
            class="add-btn"
            type="text"
            @click.stop="handleAdd"
          >
            添加徒弟
          </el-button>
          <el-form-item label="徒弟选择">
            <common-table
              ref="table"
              class="addTable"
              :columns="columns"
              :config="tableConfig"
              :data="tableData"
              :loading="loading"
            >
              <template
                slot="multiSelectMenu"
                slot-scope="{ selection }"
              >
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDel(selection)"
                >
                  批量删除
                </el-button>
              </template>
              <template
                slot="handler"
                slot-scope="scope"
              >
                <el-button
                  type="text"
                  size="medium"
                  @click.stop="handleEdit(scope.row, scope.$index)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="medium"
                  @click.stop="handleDel(scope.row, scope.index)"
                >
                  删除
                </el-button>
              </template>
            </common-table>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog
      :close-on-click-modal="false"
      append-to-body
      :title="isOperation == 'add' ? '添加徒弟' : '编辑徒弟'"
      :visible="visible"
      width="550px"
      :modal-append-to-body="false"
      @close="handleClose"
    >
      <el-form
        ref="dialogForm"
        :model="studentFormData"
        :rules="studentFormRules"
        label-position="top"
      >
        <el-row>
          <el-col :span="22">
            <el-form-item
              label="协议期"
              prop="agreement"
            >
              <el-date-picker
                v-model="studentFormData.agreement"
                style="width:100%;"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item
              label="徒弟"
              prop="name"
            >
              <lazy-select
                ref="lSelect"
                v-model="studentFormData.name"
                :disabled="isOperation == 'edit'"
                placeholder="请选择"
                :remote-method="getUserWorkList"
                :props="{ label: 'name', value: 'userId' }"
                :disa-arr="userIdArr"
                @getSelected="changeUser"
              ></lazy-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span
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
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { isExitTutor } from '@/api/resource/teach'
import { getOrgUserList } from '@/api/system/user'
import LazySelect from './el-lazy-select'

const FORM_TABLE = [
  {
    label: '用户编号',
    prop: 'workNo'
  },
  {
    label: '姓名',
    prop: 'studentName',
    width: 160
  },
  {
    label: '归属组织',
    prop: 'orgName'
  },
  {
    label: '岗位',
    prop: 'positionName'
  },
  {
    label: '手机号',
    prop: 'phonenum'
  }
]
const TABLE_CONFIG = {
  maxHeight: 360,
  showHandler: true, //是否显示操作列
  showIndexColumn: false, //是否显示序号列
  enablePagination: true,
  enableMultiSelect: true,
  rowKey: 'userId',
  handlerColumn: {
    //操作列配置
    width: 110,
    fixed: false
  }
}
export default {
  name: 'AddDisciple',
  components: {
    LazySelect
  },
  props: {
    stepActive: {
      type: Number,
      default: 0
    },
    tutorId: {
      //导师id
      type: String,
      default: ''
    },
    operation: {
      //操作
      type: String,
      default: 'add'
    },
    studentVOS: {
      //徒弟列表
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      index: 0,
      isOperation: 'add',
      userIdArr: [],
      userData: {}, //保存选中用户数据
      loading: false,
      visible: false,
      tableData: [],
      tableConfig: TABLE_CONFIG,
      columns: FORM_TABLE,

      studentFormData: {
        agreement: [], //协议期
        userId: '' //选择徒弟
      },
      formData: {
        tutorStudentList: [] //徒弟选择
      },
      formRules: {},
      studentFormRules: {
        agreement: [{ required: true, message: '请选择日期', trigger: 'change' }],
        name: [{ required: true, message: '请选择人员', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    getUserWorkList(params) {
      this.userIdArr = this.tableData.map((val) => val.userId)
      return getOrgUserList(Object.assign(params, { orgId: 0 }))
    },
    //添加
    handleAdd() {
      this.isOperation = 'add'
      this.$refs.table.clearSelection()
      this.visible = true
    },
    //选择用户
    changeUser(data) {
      data.studentName = data.name
      this.userData = data
      this.studentFormData.userId = data.userId
    },
    //提交添加
    submit() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          const params = {
            userId: this.studentFormData.userId,
            agreementStartTime: this.studentFormData.agreement[0],
            agreementEndTime: this.studentFormData.agreement[1],
            tutorId: this.tutorId
          }
          this.userData.agreementStartTime = this.studentFormData.agreement[0]
          this.userData.agreementEndTime = this.studentFormData.agreement[1]
          if (this.isOperation === 'add') {
            isExitTutor(params).then(() => {
              this.tableData.unshift(this.userData)
              this.$emit('update:studentVOS', this.tableData)
              this.handleClose()
            })
            return
          }
          this.tableData[this.index] = this.userData
          this.tableData = [...this.tableData]
          this.$emit('update:studentVOS', this.tableData)
          this.handleClose()
        }
      })
    },
    //关闭弹出层
    handleClose() {
      this.studentFormData = {}
      this.$refs.dialogForm.resetFields()
      this.visible = false
    },
    //获取徒弟列表
    loadData() {
      this.loading = true
      setTimeout(() => {
        this.tableData = [...this.studentVOS]
        this.loading = false
      }, 500)
    },
    //编辑
    handleEdit(row, idx) {
      this.$refs.table.clearSelection()
      this.index = idx
      this.isOperation = 'edit'
      this.userData = row
      this.userData.studentName = row.studentName || row.name
      this.visible = true
      this.studentFormData = {
        agreement: [row.agreementStartTime, row.agreementEndTime],
        userId: row.userId,
        name: row.studentName
      }
    },
    //删除
    handleDel(selection) {
      let ids = ''
      if (Array.isArray(selection)) {
        //批量
        ids = selection.map((item) => item.userId).join(',')
      } else {
        //单个
        ids = selection.userId
      }
      this.$message.success('删除成功')
      const data = this.tableData.filter((val) => ids.indexOf(val.userId) < 0)
      this.$refs.table.clearSelection()
      this.$emit('update:studentVOS', data)
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
.addTable {
  /deep/.el-form-item__content {
    position: static;
  }
}
.add-apprentice {
  position: relative;
}
.add-btn {
  position: absolute;
  right: 0;
  top: -2px;
}
/deep/.top-menu {
  display: none;
}
</style>
