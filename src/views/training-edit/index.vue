<template>
  <div
    ref="body"
    class="training-edit"
  >
    <div class="header">
      <el-row
        type="flex"
        justify="space-between"
        align="middle"
      >
        <el-col :span="7">
          <el-page-header
            :content="headerName"
            @back="back"
          ></el-page-header>
        </el-col>
        <el-col
          :span="type === 'outer' ? 6 : 12"
          style="margin-bottom: 0;"
        >
          <el-steps
            :active="activeStep"
            align-center
          >
            <el-step
              v-for="(step, index) in steps"
              :key="index"
              :title="step.title"
              :icon="step.icon"
              class="step"
              @click.native="handleStepChange(index + 1)"
            ></el-step>
          </el-steps>
        </el-col>
        <el-col :span="7">
          <el-row style="text-align: right">
            <el-button
              v-if="activeStep > 1"
              size="medium"
              @click="handleStepChange(activeStep - 1)"
            >
              上一步
            </el-button>
            <el-button
              v-if="activeStep < steps.length"
              type="primary"
              size="medium"
              @click="handleStepChange(activeStep + 1)"
            >
              下一步
            </el-button>

            <el-button
              v-if="!isUnderwayEdit"
              type="default"
              size="medium"
              :loading="publishLoading1"
              @click="publish(1)"
            >
              存草稿
            </el-button>
            <el-button
              v-if="activeStep === steps.length"
              type="primary"
              size="medium"
              :loading="publishLoading0"
              @click="publish(0)"
            >
              发布
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <div class="body">
      <component
        :is="activeComponent"
        ref="activePage"
        :head-teacher-options="headTeacherOptions"
        :form.sync="form"
        :type="type"
        :train-way-radios="trainWayRadios"
        :train-type-options="trainTypeOptions"
        :get-setting-disabled-value="getSettingDisabledValue"
        :cur-weighted-value="curWeightedValue"
        :active-setting-data="activeSettingData"
        :setting-data="settingData"
        :is-underway-edit="isUnderwayEdit"
        @importPersonData="onImportPersonData"
      />

      <el-row class="buttons">
        <el-button
          v-if="activeStep > 1"
          size="medium"
          @click="handleStepChange(activeStep - 1)"
        >
          上一步
        </el-button>
        <el-button
          v-if="activeStep < steps.length"
          type="primary"
          size="medium"
          @click="handleStepChange(activeStep + 1)"
        >
          下一步
        </el-button>

        <el-button
          v-if="!isUnderwayEdit"
          type="default"
          size="medium"
          :loading="publishLoading1"
          @click="publish(1)"
        >
          存草稿
        </el-button><el-button
          v-if="activeStep === steps.length"
          type="primary"
          size="medium"
          :loading="publishLoading0"
          @click="publish(0)"
        >
          发布
        </el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import Config from './config'
import Arrange from './arrange'
import Setting from './setting'
import Person from './person'
import { getStore } from '@/util/store'
import {
  addOuterTrain,
  updateOuterTrain,
  editEchoOuterTrain,
  editTrain,
  addTrain,
  getTrain,
  queryOuterTrainObject,
  executeTrainObjectUsers
} from '@/api/train/train'
import { save } from '@/api/questionnaire'
const ORIGIN_FORM = {
  sponsor: '',
  trainCurrentStatus: '',
  headTeacherName: '',
  evaluateCondition: '1',
  organizer: '',
  certificateId: '',
  applyJoinEndDate: '',
  focusTest: '',
  courseStudy: '',
  attendance: '',
  reportMaterial: 0,
  practicalTest: 0,
  defenseReport: 0,
  coursePerformance: 0,
  categoryId: '',
  asqId: '',
  headTeacher: '',
  trainName: '',
  trainTime: [],
  address: '',
  trainWay: '',
  people: '',
  costBudget: '',
  contactName: '',
  applyJoin: true,
  applyJoinValue: 'approval',
  contactPhone: '',
  introduction: '',
  coverPic: '',
  signIn: false,
  certificate: true,
  evaluationType: [1],
  trainOfflineTodo: [],
  trainExam: [],
  trainOnlineCourse: [],
  trainObjectsList: [],
  personnelObjects: {
    userObjects: [],
    positionObjects: [],
    orgObjects: []
  },
  trainType: '',
  scoreGet: '',
  teachingObject: ''
}

const originSettingData = [
  {
    name: '集中测试',
    key: 'focusTest',
    way: '系统评定'
  },
  {
    name: '课程学习',
    key: 'courseStudy',
    way: '系统评定'
  },
  {
    name: '出勤情况',
    key: 'attendance',
    way: '系统评定'
  },
  {
    name: '上报材料',
    key: 'reportMaterial',
    way: '手工评定'
  },
  {
    name: '实操考试',
    key: 'practicalTest',
    way: '手工评定'
  },
  {
    name: '答辩汇报',
    key: 'defenseReport',
    way: '手工评定'
  },
  {
    name: '课程表现',
    key: 'coursePerformance',
    way: '手工评定'
  }
]

export default {
  name: 'TrainingEdit',
  components: {
    Config,
    Arrange,
    Setting,
    Person
  },
  data() {
    return {
      settingData: JSON.parse(JSON.stringify(originSettingData)),
      activeStep: 1,
      getSubjectParams: {
        pageSize: 600,
        pageNo: 1
      },

      form: JSON.parse(JSON.stringify(ORIGIN_FORM)),
      publishLoading1: false,
      publishLoading0: false,
      steps: [],
      headTeacherOptions: [],
      classroomOptions: []
    }
  },
  computed: {
    isUnderwayEdit() {
      if (this.form.trainCurrentStatus === 2 && !this.$route.query.isNext) {
        return true
      }
      return false
    },
    curWeightedValue() {
      const activeData = this.activeSettingData
      let total = 0
      activeData.forEach((item) => {
        total += this.form[item.key]
      })
      total = 100 - total
      return total || 0
    },
    activeSettingData() {
      return this.settingData
        .slice(0, 3)
        .filter((item) => !this.getSettingDisabledValue(item.key))
        .concat(this.settingData.slice(3))
    },
    type() {
      return this.$route.query.type
    },
    id() {
      return this.$route.query.id
    },
    headerName() {
      let name = '项目'
      const { id, type, isNext } = this.$route.query
      if (type === 'outer') {
        name = '外训' + name
      } else {
        name = '内训' + name
      }
      name = (id && !isNext ? '编辑' : '创建') + name
      return name
    },
    activeComponent() {
      return this.steps[this.activeStep - 1].component
    },
    trainWayRadios() {
      if (this.type === 'inside') {
        return [
          {
            label: '线上培训',
            value: '1'
          },
          {
            label: '线下培训',
            value: '2'
          },
          {
            label: '混合式培训',
            value: '3'
          }
        ]
      } else {
        return [
          {
            label: '非脱产培训',
            value: '11'
          },
          {
            label: '脱产培训',
            value: '12'
          },
          {
            label: '业余培训',
            value: '13'
          }
        ]
      }
    },
    trainTypeOptions() {
      if (this.type === 'inside') {
        return [
          { label: '通用力培训', value: '01' },
          { label: '专业力培训', value: '02' },
          { label: '领导力培训', value: '03' }
        ]
      } else {
        return [
          { label: '岗位取证', value: 'POST_CERT' },
          { label: '学历教育（自主）', value: 'EDU_SELF' },
          { label: '学历教育（委派）', value: 'EDU_APPOINT' },
          { label: '专题研修', value: 'SPECIAL' }
        ]
      }
    }
  },
  watch: {
    'form.people'() {
      if (this.setFormData) return
      if (this.type === 'inside') {
        Object.assign(this.form, {
          personnelObjects: {
            userObjects: [],
            positionObjects: [],
            orgObjects: []
          }
        })
      } else {
        Object.assign(this.form, { trainObjectsList: [] })
      }
    },
    'form.trainWay'() {
      if (this.setFormData) return
      this.form.trainOfflineTodo = []
      this.form.trainOnlineCourse = []
      this.form.trainExam = []
    },
    'form.signIn'() {
      if (this.setFormData) return
      this.initSetting()
    },
    'form.evaluateCondition'() {
      if (this.setFormData) return
      this.initSetting()
    },
    'form.trainOfflineTodo': {
      handler() {
        if (this.setFormData) return
        this.initSetting()
      },
      deep: true
    },
    'form.trainOnlineCourse': {
      handler() {
        if (this.setFormData) return
        this.initSetting()
      },
      deep: true
    },
    'form.trainExam': {
      handler() {
        if (this.setFormData) return
        this.initSetting()
      },
      deep: true
    }
  },
  created() {
    if (this.$route.query.type === 'outer') {
      this.steps = [
        {
          icon: 'el-icon-setting',
          title: '信息配置',
          component: 'Config'
        },
        {
          icon: 'el-icon-user',
          title: '关联人员',
          component: 'Person'
        }
      ]
    } else {
      this.steps = [
        {
          icon: 'el-icon-setting',
          title: '信息配置',
          component: 'Config'
        },
        {
          icon: 'el-icon-position',
          title: '培训安排',
          component: 'Arrange'
        },
        {
          icon: 'el-icon-s-tools',
          title: '评定设置',
          component: 'Setting'
        },
        {
          icon: 'el-icon-user',
          title: '关联人员',
          component: 'Person'
        }
      ]
    }
    this.initData()
  },
  methods: {
    back() {
      this.$confirm('所填信息将不会保存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push({
            path: '/training/trainingArrange'
          })
        })
        .catch(() => {})
    },
    validate2() {
      return new Promise((resolve) => {
        const { trainOfflineTodo, trainOnlineCourse, trainExam } = this.form
        let check
        if (
          trainOfflineTodo.some((todo) => {
            if (!todo.todoDate) {
              check = todo
              return true
            }
            return false
          })
        ) {
          const name = check.type === 1 ? '(面授课程)' + check.courseName : '(活动)' + check.theme
          resolve(
            `线下课程：【${name}】${
              check.type === 1 ? '授课时间' : '活动时间'
            }未填，请填写后再继续操作`
          )
        }
        if (
          trainOnlineCourse.some((course) => {
            if (!course.classTime.length) {
              check = course
              return true
            }
            return false
          })
        ) {
          resolve(`线上课程：【${check.courseName}】上课时间未填，请填写后再继续操作`)
        }
        if (
          trainExam.some((exam) => {
            if (!exam.examTime.length) {
              check = exam
              return true
            }
            return false
          })
        ) {
          resolve(`考试安排：【${check.examName}】考试时间未填，请填写后再继续操作`)
        }
        resolve(true)
      })
    },
    validate3() {
      return new Promise((resolve) => {
        if (this.activeSettingData.length && this.curWeightedValue > 0) {
          resolve('权重需分配完才能进入下一步')
          return
        }
        resolve(true)
      })
    },
    setSettingData() {
      const data = JSON.parse(JSON.stringify(originSettingData))
      this.settingData = this.form.evaluateCondition == '1' ? data : data.slice(0, 3)
      data.forEach((item) => {
        this.form[item.key] = ''
      })
    },
    initSettingData() {
      const activeData = this.activeSettingData
      activeData.forEach((item) => {
        this.form[item.key] = 0
        this.$watch(`form.${item.key}`, (val) => {
          if (typeof val == 'undefined') {
            this.form[item.key] = 0
          }
        })
      })
    },
    getSettingDisabledValue(key) {
      const form = this.form
      switch (key) {
        case 'focusTest':
          return !form.trainExam.length
        case 'courseStudy':
          return !form.trainOnlineCourse.length
        case 'attendance':
          return !form.trainOfflineTodo.length || !form.signIn
      }
      return false
    },
    onImportPersonData(data) {
      for (const key in this.form.personnelObjects) {
        if (key === 'userObjects') {
          const list = this.form.personnelObjects[key]
          list.push(data)
          break
        }
      }
      this.$forceUpdate()
    },
    publish(publishType) {
      const data = {}
      const form = JSON.parse(JSON.stringify(this.form))
      const introduction = form.introduction
      form.introduction = _.escape(introduction)

      let userList = []
      if (this.type === 'outer') {
        userList = form.trainObjectsList
        data.trainObjectsList = userList.map((item) => ({ bizId: item.bizId }))
      } else if (this.type === 'inside') {
        const { trainOfflineTodo, trainExam, trainOnlineCourse, personnelObjects } = form
        const { userObjects, positionObjects, orgObjects } = personnelObjects
        userList = userObjects
        personnelObjects.userObjects = userList.map((item) => ({ bizId: item.bizId }))
        personnelObjects.positionObjects = positionObjects.map((item) => ({
          bizId: item.positionId
        }))
        personnelObjects.orgObjects = orgObjects.map((item) => ({ bizId: item.id }))

        data.trainOfflineTodo = trainOfflineTodo.map((item) => {
          item.todoTime.map((time) => {
            return time
              .split(':')
              .slice(0, 2)
              .join(':')
          })
          delete item.$additional
          return item
        })
        data.trainExam = trainExam.map((item) => {
          delete item.$additional
          return item
        })
        data.trainOnlineCourse = trainOnlineCourse.map((item) => {
          delete item.$additional
          return item
        })
        data.personnelObjects = personnelObjects
      }

      let info, api
      if (this.type === 'outer') {
        info = data.trainOuterInfo = form
      } else {
        info = data.trainInfo = form
        let { applyJoinEndDate } = info
        if (applyJoinEndDate) {
          info.applyJoinEndDate = applyJoinEndDate + ' 23:59:59'
        }
        if (info.evaluateCondition === '2') {
          if (!info.trainOfflineTodo.length) {
            info.attendance = ''
          }
          if (!info.trainExam.length) {
            info.focusTest = ''
          }
          if (!info.trainOnlineCourse.length) {
            info.courseStudy = ''
          }
          const deleteKeys = [
            'reportMaterial',
            'practicalTest',
            'defenseReport',
            'coursePerformance'
          ]
          deleteKeys.forEach((key) => {
            delete info[key]
          })
        }
      }
      if (this.type === 'inside') {
        api = addTrain
      } else if (this.type === 'outer') {
        api = addOuterTrain
      }

      if (this.id && !this.$route.query.isNext) {
        data.id = this.id
        if (this.type === 'outer') {
          api = updateOuterTrain
        } else {
          api = editTrain
        }
      }
      info.type = publishType

      delete info.trainOfflineTodo
      delete info.trainExam
      delete info.trainOnlineCourse
      delete info.personnelObjects
      delete info.trainObjectsList

      this['publishLoading' + publishType] = true

      api(data)
        .then((response) => {
          this.$message.success('操作成功')
          this.$router.push({
            path: '/training/trainingArrange'
          })
          if (form.asqId && publishType === 0) {
            // 创建问卷安排
            if (
              Object.keys(data.personnelObjects).every((key) => !data.personnelObjects[key].length)
            ) {
              return
            }
            const { trainName, questionCategoryId, trainTime, questionCategoryName, asqId } = form
            let [publishTime, endTime] = trainTime
            endTime = new Date(endTime)
            endTime = endTime.getTime() + 7 * 86400000
            endTime = new Date(endTime)
            const [date, time] = endTime.toISOString().split('T')
            endTime = date + ' ' + time.split('.')[0]
            let planCode = new Date()
            // eslint-disable-next-line
            planCode = planCode.toISOString().replace(/\-|T|\:|\.|Z/g, '')

            executeTrainObjectUsers(data.personnelObjects).then((res = []) => {
              if (res.length) {
                const params = {
                  planName: trainName + '评估问卷',
                  categoryId: questionCategoryId,
                  subjectName: trainName,
                  asqScore: 0,
                  publishTime,
                  endTime,
                  subjectId: asqId,
                  categoryName: questionCategoryName,
                  users: res.map((item) => {
                    const { userDeptStr } = item
                    item.userDeptStr = Array.isArray(userDeptStr)
                      ? userDeptStr.join('')
                      : userDeptStr
                    return item
                  }),
                  type: publishType,
                  source: 'train',
                  sourceId: response.id,
                  planCode
                }
                save(params)
              }
            })
          }
        })
        .finally(() => {
          this['publishLoading' + publishType] = false
        })
    },
    initData() {
      if (!this.id) {
        this.initSetting()
      }
      this.form.trainWay = this.trainWayRadios[0].value
      this.form.trainType = this.trainTypeOptions[0].value
      this.form.trainTime = []
      if (this.id) {
        const loading = this.$loading({
          lock: true,
          text: '数据加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const request = this.type === 'outer' ? editEchoOuterTrain : getTrain
        request({ trainId: this.id })
          .then((res) => {
            loading.close()
            delete res.id
            let info
            let {
              trainInfo,
              trainOfflineTodo = [],
              trainOnlineCourse,
              trainExam,
              personnelObjects
            } = res

            if (this.type === 'inside') {
              trainOfflineTodo.forEach((item, index) => {
                item.$id = '' + index
                item.course = item.courseId
              })
              if (this.$route.query.isNext) {
                trainOfflineTodo.forEach((item) => {
                  item.todoDate = ''
                })
                trainExam.forEach((item) => {
                  item.examTime = []
                })
                trainOnlineCourse.forEach((item) => {
                  item.classTime = []
                })
                personnelObjects = {
                  userObjects: [],
                  positionObjects: [],
                  orgObjects: []
                }
              } else {
                const { orgObjects = [], positionObjects = [], userObjects = [] } = personnelObjects
                personnelObjects.orgObjects = orgObjects.map((org) => {
                  org.name = org.bizName
                  org.id = org.bizId
                  org.workNum = +org.peopleNum
                  return org
                })
                personnelObjects.positionObjects = positionObjects.map((position) => {
                  position.positionName = position.bizName
                  position.positionId = position.bizId
                  position.workNum = +position.peopleNum
                  return position
                })
                personnelObjects.userObjects = userObjects.map((user) => {
                  user.phoneNum = user.phonenum
                  return user
                })
              }
              info = Object.assign(trainInfo, {
                trainOfflineTodo,
                trainOnlineCourse,
                trainExam,
                personnelObjects
              })
            } else {
              // outer
              info = res
              if (this.$route.query.isNext) {
                info.trainObjectsList = []
              }
            }
            if (this.$route.query.isNext) {
              info.applyJoinEndDate = ''
              info.trainTime = []
            }

            let {
              headTeacher,
              headTeacherName,
              contactPhone,
              evaluateCondition,
              trainWay,
              introduction
            } = info
            this.headTeacherOptions = [
              {
                userId: headTeacher,
                name: headTeacherName,
                phonenum: contactPhone
              }
            ]

            info.evaluateCondition = evaluateCondition + ''
            info.trainWay = trainWay + ''
            introduction = _.unescape(introduction)
            const div = document.createElement('div')
            div.innerHTML = introduction
            info.introduction = div.innerHTML
            this.setFormData = true

            Object.assign(this.form, info)
            if (this.type === 'inside') {
              const data = JSON.parse(JSON.stringify(originSettingData))
              this.settingData = info.evaluateCondition === '1' ? data : data.slice(0, 3)
            }
            this.$nextTick(() => {
              this.setFormData = false
              this.$refs.activePage.handleWordCount()
              if (this.activeStep === 1) {
                this.$refs.activePage.clearValidate()
              }
              this.$forceUpdate()
            })
            if (!this.$route.query.isNext && this.type === 'outer') {
              queryOuterTrainObject({ trainId: this.id }).then((res = { data: [] }) => {
                this.form.trainObjectsList = res.data.map((item) => {
                  item.bizName = item.userName
                  item.phoneNum = item.phonenum
                  item.bizId = item.userId
                  return item
                })
              })
            }
          })
          .finally(() => {})
      } else {
        if (!this.form.headTeacher) {
          const userInfo = getStore({ name: 'userInfo' })
          const userId = (this.form.headTeacher = userInfo.user_id)
          const name = (this.form.headTeacherName = userInfo.nick_name)
          const phonenum = (this.form.contactPhone = userInfo.account)
          this.headTeacherOptions = [
            {
              userId,
              name,
              phonenum
            }
          ]
        }
      }
    },
    async handleStepChange(step) {
      if (this.activeStep < step) {
        let valid = true
        let interval = step - this.activeStep
        let i = this.activeStep
        while (interval) {
          const validate = i === 1 ? this.$refs.activePage.validate : this['validate' + i]
          valid = await validate()
          if (!valid || typeof valid == 'string') {
            break
          }
          i++
          interval--
        }
        if (!valid || typeof valid == 'string') {
          const message = typeof valid == 'string' ? valid : '请填写必填项'
          this.$notify({
            title: '提示',
            message,
            type: 'warning'
          })
          this.activeStep = i
          return
        }
      }
      this.activeStep = step
    },
    initSetting() {
      this.setSettingData()
      this.initSettingData()
    }
  }
}
</script>

<style lang="scss">
.training-edit {
  .step {
    cursor: pointer;
  }
}
</style>
<style lang="scss" scoped>
.training-edit {
  background-color: #fafafa;
  overflow-y: scroll;
  height: 100%;
  .header {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    padding: 10px 24px;
    width: 100%;
    background-color: #fff;
    z-index: 111;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.04), 0 8px 16px 4px rgba(0, 0, 0, 0.04);
    .back-btn {
      width: fit-content;
      font-size: 17px;
      cursor: pointer;
    }
  }
  .body {
    min-height: calc(100vh - 115px);
    background-color: #fff;
    margin: 90px auto 25px;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    padding: 65px 120px;
    width: 1300px;
    .buttons {
      margin-top: 45px;
      text-align: center;
    }
    .person-table {
      .table-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-bottom: 16px;
      }
    }
  }
}
</style>
