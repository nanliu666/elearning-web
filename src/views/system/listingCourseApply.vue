<template>
  <div class="fill">
    <page-header
      title="课程申请"
      show-back
      :back="goBack"
    />
    <basic-container block>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xl="16"
          :lg="16"
          :md="18"
          :sm="20"
          :xs="22"
        >
          <common-form
            ref="form"
            :model="formData"
            :columns="columns"
          >
            <div
              slot="trainTarget"
              class="tranMB"
            >
              <el-form-item label="培训目标">
                <el-input
                  v-model.trim="formData.trainTarget"
                  type="textarea"
                  :rows="3"
                  :maxlength="1000"
                  placeholder="请输入"
                  show-word-limit
                />
              </el-form-item>
            </div>
            <div slot="pay">
              <el-form-item
                label="总课酬"
                class="inputNumber"
              >
                <el-input-number
                  v-model="formData.pay"
                  style="width:100%;"
                  controls-position="right"
                  placeholder="请输入金额"
                  :precision="2"
                  :min="0"
                  :max="9999999999.99"
                />
                <a class="inputNumber-icon">￥</a>
              </el-form-item>
            </div>
            <div slot="trainTime">
              <el-form-item label="培训时间">
                <el-date-picker
                  v-model="formData.trainTime"
                  style="width:100%;"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                  type="datetime"
                  placeholder="请选择"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div slot="pm">
              <el-form-item label="项目经理">
                <lazy-select
                  v-model="formData.pm"
                  :remote-method="getOrgUserList"
                  :props="{ label: 'name', value: 'userId' }"
                ></lazy-select>
              </el-form-item>
            </div>
          </common-form>
          <div class="page-bottom">
            <el-button
              type="primary"
              size="medium"
              @click="handleSubmit('submit')"
            >
              提交
            </el-button>
            <el-button
              size="medium"
              @click="handleSubmit('cancel')"
            >
              取消
            </el-button>
          </div>
        </el-col>
      </el-row>
    </basic-container>
    <!-- 审批发起组件 -->
    <appr-submit
      ref="apprSubmit"
      category-id="12"
      @submit="handleSubmit('submit')"
    />
  </div>
</template>

<script>
import { categoryMap } from '@/const/approve'
import ApprSubmit from '@/components/appr-submit/ApprSubmit'
import {
  addCourseApplication,
  regGetCourseInfo,
  listTeacherComboBox,
  listCatalog
} from '@/api/system/systemList'
import { getOrgUserList } from '@/api/system/user'
import CommonForm from '@/components/common-form/commonForm.vue'
import LazySelect from '@/components/el-lazy-select'
const FORM_TABLE = [
  {
    prop: 'orgName',
    itemType: 'select',
    label: '申请组织',
    required: true,
    rules: [{ required: true, message: '请选择申请组织', trigger: 'change' }],
    options: [],
    disabled: true
  },
  {
    prop: 'courseNo',
    itemType: 'input',
    label: '课程编号',
    offset: 4,
    required: true,
    rules: [{ required: true, message: '请选择课程编号', trigger: 'blur' }],
    disabled: true
  },
  {
    prop: 'courseName',
    itemType: 'input',
    label: '课程名称',
    rules: [{ required: true, message: '请选择课时名称', trigger: 'blur' }],
    options: [],
    disabled: true
  },
  {
    prop: 'teacherName',
    itemType: 'select',
    label: '课程讲师',
    offset: 4,
    required: true,
    rules: [{ required: true, message: '请选择课程讲师', trigger: 'change' }],
    options: [],
    props: {
      label: 'name',
      value: 'idStr'
    },
    disabled: true
  },
  {
    prop: 'courseCate',
    itemType: 'treeSelect',
    label: '课程分类',
    rules: [{ required: true, message: '请选择课程分类', trigger: 'change' }],
    props: {
      selectParams: {
        placeholder: '请选择课程分类',
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
    prop: 'period',
    itemType: 'inputNumber',
    label: '标准课时（小时）',
    offset: 4,
    min: 0,
    max: 10000,
    precision: 1,
    step: 0.1,
    disabled: true
  },
  {
    prop: 'pay',
    itemType: 'slotout'
  },
  // {
  //   prop: 'pay',
  //   itemType: 'input',
  //   label: '总课酬',
  //   maxlength: 12
  // },
  {
    prop: 'trainTime',
    itemType: 'slotout',
    offset: 4
  },
  {
    prop: 'address',
    itemType: 'input',
    label: '培训地点',
    maxlength: 32
  },
  {
    prop: 'joinNum',
    itemType: 'inputNumber',
    offset: 4,
    label: '培训人数',
    min: 0,
    // max: 10000,
    precision: 0,
    step: 1
  },
  {
    prop: 'trainTarget',
    itemType: 'slotout',
    span: 24
  },
  {
    prop: 'pm',
    itemType: 'slotout'
  },

  {
    prop: 'contactInfo',
    itemType: 'input',
    label: '联系方式',
    maxlength: 11,
    offset: 4,
    props: {
      onlyNumber: true
    },
    rules: [{ pattern: /^1[3456789]\d{9}$/, message: '手机号码不合法', trigger: 'blur' }]
  }
]
export default {
  name: 'ListingCourseApply',
  components: { CommonForm, LazySelect, ApprSubmit },
  data() {
    return {
      formKey: 'CourseApplication',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      columns: FORM_TABLE,
      formData: {
        orgName: '', //申请组织
        courseNo: '', //课程编号
        courseName: '', //课程名称
        teacherName: '', //课程讲师
        courseCate: '', //课程分类
        period: 0, //总课时
        // pay: '', //总课酬
        trainTime: '', //培训时间
        address: '', //培训地点
        joinNum: '', //培训人数
        trainTarget: '', //培训目标
        pm: '', //项目经理
        contactInfo: '' //联系方式
      }
    }
  },
  mounted() {
    const courseId = this.$route.query.courseId
    this.formData.courseId = courseId
    this.myCourseInfo(courseId)
    this.getClass()
    // this.getTeacher() //讲师
  },
  methods: {
    getOrgUserList(params) {
      return getOrgUserList(Object.assign(params, { orgId: '0' }))
    },
    goBack() {
      this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
      this.$refs.form.clearValidate()
      this.$router.back(-1)
    },
    //获取课程信息
    myCourseInfo(courseId) {
      regGetCourseInfo({ courseId }).then((res) => {
        this.formData.orgId = res.orgId
        this.formData.orgName = res.orgName
        this.formData.courseNo = res.courseNo
        this.formData.courseName = res.courseName
        this.formData.teacherName = res.teacherName
        this.formData.teacherId = res.teacherId
        this.formData.period = Number(res.period) //总课时
      })
    },
    //讲师
    getTeacher() {
      const params = {
        pageSize: 9999,
        pageNo: 1,
        likeQuery: ''
      }
      listTeacherComboBox(params).then((res) => {
        res = _.uniqBy(res, 'idStr')
        this.columns.forEach((val) => {
          if (val.prop == 'teacherName') {
            val.options = res
          }
        })
      })
    },
    //课程分类
    getClass() {
      listCatalog({ status: 0 }).then((res) => {
        this.columns.forEach((val) => {
          if (val.prop == 'courseCate') {
            val.props.treeParams.data = res
          }
        })
      })
    },
    handleSubmit(key) {
      if (key == 'submit') {
        this.onSubmit()
      } else {
        this.goBack()
      }
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.apprSubmit.validate().then((process) => {
            console.log('审批id', process)
            if (process) {
              const params = {
                address: this.formData.address,
                applicationOrgId: this.formData.orgId, //组织id
                catalogId: this.formData.courseCate, //课程分类id
                contactInfo: this.formData.contactInfo, //联系方式
                courseId: this.formData.courseId,
                joinNum: this.formData.joinNum, //培训人数
                pay: this.formData.pay || 0, //总课酬
                pm: this.formData.pm, //项目经理
                trainTarget: this.formData.trainTarget,
                trainTime: this.formData.trainTime
              }
              addCourseApplication(params).then((res) => {
                // this.submitApprApply(res.cpCourseId)
                this.submitApprApply(res.cpCourseId)
                // this.$message.success('创建成功')
                // this.goBack()
              })
            }
          })
        }
      })
    },
    // 提交审批
    submitApprApply(applyId) {
      //申请表   给formData 添加id,catalogName字段
      this.formData.id = applyId
      // this.formData.catalogName = this.parentOrgIdLabel
      this.$refs.apprSubmit
        .submit({
          formId: applyId,
          processName: categoryMap['12'],
          formKey: this.formKey
          // formTitle: this.formData.name,
          // formData: JSON.stringify(this.formData)
        })
        .then((res) => {
          //提交成功，跳转到成功页面
          this.$router.push({
            path: '/apprProcess/submitSucceed',
            query: { id: res.apprNo, key: this.formKey }
          })
          //发布成功清除数据
          //this.isdeleteData()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.tranMB {
  /deep/.el-input__count {
    line-height: 1;
  }
}
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
  .inputNumber {
    position: relative;
    /deep/.el-input__inner {
      padding-left: 22px;
    }
    .inputNumber-icon {
      font-size: 15px;
      position: absolute;
      left: 6px;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
}
</style>
