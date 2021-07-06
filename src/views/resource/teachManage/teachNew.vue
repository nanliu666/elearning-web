<template>
  <div class="fill">
    <page-header
      :title="yTit"
      show-back
      :back="goBack"
    />
    <div class="teach-step">
      <el-steps
        :active="stepActive"
        align-center
      >
        <el-step title="信息配置"></el-step>
        <el-step title="添加徒弟"></el-step>
      </el-steps>
    </div>
    <el-form
      ref="basicForm"
      :model="formData"
      :rules="basicFormRules"
      label-position="top"
    >
      <basic-container block>
        <!--信息配置-->
        <div v-show="stepActive == 1">
          <div class="title">
            <h3>基础信息</h3>
          </div>
          <div style="padding:10px 240px;">
            <el-row :gutter="60">
              <el-col :span="12">
                <el-form-item
                  label="导师姓名"
                  prop="tutorName"
                >
                  <lazy-select
                    v-model="formData.tutorName"
                    :disabled="opear === 'edit'"
                    placeholder="请选择"
                    :remote-method="getUserWorkList"
                    :props="{ label: 'name', value: 'userId' }"
                    @getSelected="changeUser"
                  ></lazy-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别">
                  <el-radio-group
                    v-model="formData.sex"
                    disabled
                  >
                    <el-radio :label="1">
                      男
                    </el-radio>
                    <el-radio :label="0">
                      女
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所在部门">
                  <el-select
                    v-model="formData.orgName"
                    style="width:100%;"
                    placeholder="请选择"
                    disabled
                  >
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="岗位">
                  <el-select
                    v-model="formData.positionName"
                    style="width:100%;"
                    placeholder="请选择"
                    disabled
                  >
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出生日期">
                  <el-input
                    v-model="formData.birthDate"
                    disabled
                    placeholder="请选择"
                  >
                    <i
                      slot="suffix"
                      class="el-input__icon el-icon-date"
                    ></i>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="职称">
                  <el-input
                    v-model="formData.professionalName"
                    disabled
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="毕业院校"
                  prop="graduateSchool"
                >
                  <el-input
                    v-model.trim="formData.graduateSchool"
                    :maxlength="32"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="专业"
                  prop="major"
                >
                  <el-input
                    v-model.trim="formData.major"
                    :maxlength="32"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="学历"
                  prop="qualification"
                >
                  <el-select
                    v-model="formData.qualification"
                    style="width:100%;"
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in recordOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="本岗位工作年限"
                  prop="workYear"
                >
                  <el-input-number
                    v-model="formData.workYear"
                    style="width:100%;"
                    controls-position="right"
                    :min="0"
                    :max="100"
                    :step="1"
                    step-strictly
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="60">
              <el-col :span="12">
                <el-form-item label="上年度绩效">
                  <el-input
                    v-model.trim="formData.lastYearPerformance"
                    :maxlength="32"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="60">
              <el-col :span="12">
                <el-form-item
                  label="部门负责人评语"
                  class="form-item-des"
                >
                  <el-input
                    v-model.trim="formData.leaderComment"
                    type="textarea"
                    :maxlength="200"
                    :rows="4"
                    show-word-limit
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                  <div slot="label">
                    <span>部门负责人评分</span>
                    <el-tooltip
                      placement="top"
                      content="满分为70分"
                    >
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </div>
                  <el-input-number
                    v-model="formData.leaderScore"
                    style="width:100%;"
                    controls-position="right"
                    :min="0"
                    :max="70"
                    :step="0.5"
                    step-strictly
                    placeholder="请输入分数，满分为70分"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="title">
            <h3>工作经历</h3>
          </div>
          <WorkItem
            v-for="(item, idx) in workArray"
            :key="idx"
            :work-num="idx"
            :item-data="item"
            @on-workEdit="workEdit"
            @on-workDel="workDel"
          />

          <div
            v-show="workArray.length < 50"
            style="padding:0 20px;"
          >
            <div
              class="add-work"
              @click="addWork"
            >
              <i class="el-icon-plus"></i> 添加工作经历
            </div>
          </div>
        </div>
        <!--添加徒弟-->
        <template v-if="stepActive == 2">
          <AddDisciple
            ref="disciple"
            :student-v-o-s.sync="formData.studentVOS"
            :tutor-id="formData.userId"
            :operation="opear"
          />
        </template>
      </basic-container>

      <div class="bottomBtn">
        <div v-show="stepActive == '1'">
          <el-button
            type="primary"
            size="medium"
            @click="handleNext"
          >
            下一步
          </el-button>
          <el-button
            size="medium"
            @click="goBack"
          >
            取消
          </el-button>
        </div>
        <div v-show="stepActive == '2'">
          <el-button
            type="primary"
            size="medium"
            @click="handleSubmit"
          >
            完成
          </el-button>
          <el-button
            size="medium"
            @click="handlePrev"
          >
            上一步
          </el-button>
        </div>
      </div>
    </el-form>

    <AddWorkExper
      ref="addExper"
      :work-data="workData"
      @changeExperEdit="changeExperEdit"
      @changeExperAdd="changeExperAdd"
    />
  </div>
</template>

<script>
import {
  addTutor,
  editTutor,
  queryExperienceList,
  tutorDetail,
  checkTutor
} from '@/api/resource/teach'
import { getUserWorkList } from '@/api/org/org'
import LazySelect from '@/components/el-lazy-select'
import AddWorkExper from './components/addWorkExper'
import WorkItem from './components/workItem'
import AddDisciple from './components/addDisciple'
export default {
  name: 'TeachNew',
  components: {
    AddWorkExper,
    WorkItem,
    AddDisciple,
    LazySelect
  },
  data() {
    return {
      workArray: [],
      stepActive: 1,
      showWorkEdit: false,
      workData: {}, //工作经历数据
      title: { edit: '编辑导师', add: '创建导师' },
      yTit: '',
      editIndex: 0, //编辑工作经历的下标
      opear: 'add',
      teachInfo: {}, //导师详情数据
      loading: false,
      formData: {
        // tutorName:"",  //导师姓名
        // sex:1,  //性别
        // orgName:"",  //部门
        // positionName:"",  //岗位
        // birthDate:"",  //出生日期
        // title:"",  //职称
        // graduateSchool:"",  //毕业院校
        // major:"",  //专业
        // qualification:"",  //学历
        // lastYearPerformance:"",  //上年度绩效
        // leaderComment:"",  //部门负责人评语
        // // score:"",  //部门负责人评分
        studentVOS: [],
        tutorExperienceList: [], //工作经历
        tutorStudentList: [] //学徒列表
      },
      recordOptions: [
        { label: '初中及以下', value: '初中及以下' },
        { label: '中专/中技', value: '中专/中技' },
        { label: '高中', value: '高中' },
        { label: '大专', value: '大专' },
        { label: '本科', value: '本科' },
        { label: '硕士', value: '硕士' },
        { label: '博士', value: '博士' }
      ],
      basicFormRules: {
        tutorName: [{ required: true, message: '请选择导师', trigger: 'change' }],
        graduateSchool: [{ required: true, message: '请填写毕业院校', trigger: 'blur' }],
        major: [{ required: true, message: '请填写专业', trigger: 'blur' }],
        qualification: [{ required: true, message: '请选择学历', trigger: 'change' }],
        workYear: [{ required: true, message: '请填写工作年限', trigger: ['blur', 'change'] }]
      }
    }
  },
  watch: {},
  mounted() {
    const TAG_LABEL = this.title[this.$route.query.operation]
    this.$store.commit('SET_TAG_LABEL', TAG_LABEL)
    document.title = TAG_LABEL
    this.yTit = TAG_LABEL
    this.opear = this.$route.query.operation
    if (this.opear === 'edit') {
      //编辑
      const id = this.$route.query.id
      this.getExperienceList(id)
      this.getDetail(id)
    }
  },
  methods: {
    //选中用户
    changeUser(val) {
      checkTutor({ userId: val.userId })
        .then(() => {
          this.formData.id = val.userId
          this.formData.userId = val.userId //导师用户id
          this.formData.sex = parseInt(val.sex)
          this.formData.orgName = val.orgName
          this.formData.positionName = val.positionName
          this.formData.birthDate = val.birthDate
          this.formData.professionalName = val.professionalName
          this.formData = { ...this.formData }
        })
        .catch(() => {
          this.$set(this.formData, 'tutorName', '')
          this.$set(this.formData, 'id', '')
          this.$set(this.formData, 'userId', '')
        })
    },
    getUserWorkList(params) {
      return getUserWorkList(Object.assign(params))
    },
    goBack() {
      this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
      this.$refs.basicForm.clearValidate()
      this.$router.back(-1)
    },
    getDetail(id) {
      tutorDetail({ id }).then((data) => {
        data.idStr = id
        this.teachInfo = data
        this.formData = {
          id: data.idStr, //导师id
          userId: data.userId, //导师用户id
          tutorName: data.tutorName, //导师姓名
          sex: parseInt(data.sex), //性别
          orgName: data.orgName, //部门
          positionName: data.positionName, //岗位
          birthDate: data.birthDate, //出生日期
          professionalName: data.professionalName, //职称
          graduateSchool: data.graduateSchool, //毕业院校
          major: data.major, //专业
          qualification: data.qualification, //学历
          workYear: data.workYear, //工作年限
          lastYearPerformance: data.lastYearPerformance, //上年度绩效
          leaderComment: data.leaderComment, //部门负责人评语
          leaderScore: data.leaderScore, //负责人评分
          studentVOS: data.studentVOS
        }
      })
    },
    //获取工作经历列表
    getExperienceList(id) {
      queryExperienceList({ id }).then((res) => {
        const data = res.map((item) => {
          return {
            workUnit: item.workUnit,
            workStartTime: item.workStartTime,
            workEndTime: item.workEndTime,
            jobName: item.jobName,
            witness: item.witness,
            witnessPhone: item.witnessPhone,
            workContent: item.workContent,
            workTime: item.workTime || [item.workStartTime, item.workEndTime]
          }
        })
        this.workArray = data || []
      })
    },
    //保存添加工作经历
    changeExperAdd(item) {
      this.workArray.unshift(item)
      this.experSort()
    },
    //保存编辑工作经历
    changeExperEdit(item) {
      this.workArray[this.editIndex] = JSON.parse(JSON.stringify(item))
      this.experSort()
      this.workArray = [...this.workArray]
    },
    //工作经历排序
    experSort() {
      this.workArray.sort((a, b) => {
        if (this.transDate(a.workStartTime) == this.transDate(b.workStartTime)) {
          return this.transDate(a.workEndTime) - this.transDate(b.workEndTime)
        }
        return this.transDate(b.workStartTime) - this.transDate(a.workStartTime)
      })
    },
    transDate(str) {
      return parseInt(str.replace(/-/g, ''))
    },

    //删除工作经历
    workDel(index) {
      this.workArray.splice(index, 1)
    },
    //添加工作经历
    addWork() {
      this.$refs.addExper.visible = true
      this.$refs.addExper.operation = 'add'
    },
    //编辑工作经历
    workEdit(data, idx) {
      this.editIndex = idx
      const addExper = this.$refs.addExper
      addExper.visible = true
      addExper.formData = JSON.parse(JSON.stringify(data))
      addExper.operation = 'edit'
    },
    //下一步
    async handleNext() {
      try {
        await this.$refs.basicForm.validate()
      } catch (error) {
        this.$message.error('请完善信息')
        throw error
      }
      this.stepActive = 2
      this.showWorkEdit = false
    },
    //上一步
    handlePrev() {
      this.stepActive = 1
    },

    handleSubmit() {
      const disciple = this.$refs.disciple
      const studentList = disciple.tableData.map((item) => {
        return {
          userId: item.userId,
          agreementStartTime: item.agreementStartTime,
          agreementEndTime: item.agreementEndTime
        }
      })
      disciple.formData.tutorStudentList = studentList
      disciple.$refs.subForm.validate((valid) => {
        if (valid) {
          const form = {
            userId: this.formData.userId,
            workYear: this.formData.workYear,
            graduateSchool: this.formData.graduateSchool,
            major: this.formData.major,
            qualification: this.formData.qualification,
            lastYearPerformance: this.formData.lastYearPerformance,
            leaderComment: this.formData.leaderComment,
            leaderScore: this.formData.leaderScore,
            tutorExperienceList: this.workArray
          }
          if (this.opear == 'edit') {
            form.id = this.formData.id
          }
          const params = { ...form, ...disciple.formData }
          const func = this.opear == 'edit' ? editTutor : addTutor
          func(params).then(() => {
            this.$message.success(this.opear == 'edit' ? '修改成功' : '已成功创建导师')
            this.goBack()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.teach-step {
  padding: 30px 200px 24px;
  background: #fff;
}
.bottomBtn {
  width: 100%;
  background: #fff;
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.basic-container--block {
  height: calc(100% - 304px); //204px
  min-height: calc(100% - 304px);
  border-radius: 0;
  /deep/.el-card__body {
    height: 540px;
    overflow-y: auto;
  }
  .form-item-des {
    /deep/.el-input__count {
      line-height: 1;
    }
  }
  .el-icon-question {
    font-size: 16px;
    margin-left: 4px;
  }
  .add-work {
    width: 100%;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border: 1px dashed #d9dbdc;
    border-radius: 4px;
    color: #01aafc;
    cursor: pointer;
    .el-icon-plus {
      font-weight: 600;
    }
  }
}
</style>
