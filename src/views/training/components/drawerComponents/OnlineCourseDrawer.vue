<template>
  <el-drawer
    :title="title"
    :visible.sync="innnerVisible"
  >
    <div class="wrapper">
      <common-form
        v-if="innnerVisible"
        ref="form"
        :model="model"
        class="form"
        :columns="columns"
      >
        <template #courseId>
          <lazy-select
            v-model="model.courseId"
            :searchable="remote"
            :first-option="courseDefault"
            :load="loadCourse"
            :option-props="{
              label: 'courseName',
              value: 'courseId',
              key: 'courseId'
            }"
            @select="selectCourse"
          />
        </template>
        <template #lecturerName>
          <lazy-select
            v-model="model.lecturerName"
            :disabled="true"
            :searchable="true"
            :load="loadCoordinator"
            :option-props="{ label: 'name', value: 'userId', key: 'userId' }"
          />
        </template>
      </common-form>
      <div class="footer">
        <el-button
          type="primary"
          @click="submit"
        >
          保存
        </el-button>
        <el-button @click="close">
          取消
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { getOrgUserList } from '@/api/system/user'
import { getTrainCource } from '@/api/train/train'
const EventColumns = [
  {
    itemType: 'datePicker',
    span: 24,
    required: true,
    prop: 'classTime',
    type: 'daterange',
    label: '上课日期'
  },
  { itemType: 'slot', span: 24, required: true, prop: 'courseId', label: '关联课程' },
  { itemType: 'slot', span: 24, required: false, prop: 'lecturerName', label: '讲师' },
  {
    itemType: 'radio',
    prop: 'studyType',
    label: '修读类型',
    required: true,
    span: 24,
    options: [
      { label: '必修', value: 0 },
      { label: '选修', value: 1 }
    ]
  }
]
const modelCopy = {
  studyType: 0,
  courseId: '',
  courseName: '',
  lecturerId: null,
  lecturerName: null,
  classTime: []
}
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  name: 'OnlineCourseDrawer',
  components: {
    LazySelect: () => import('@/components/lazy-select/lazySelect')
  },
  props: {
    course: { type: Object, default: null },
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      courseDefault: [],
      remote: true,
      editType: 'add',
      columns: EventColumns,
      title: '添加在线课程',
      model: modelCopy
    }
  },
  computed: {
    ...mapGetters(['trainTimeInVuex']),
    innnerVisible: {
      get: function() {
        return this.visible
      },
      set: function(value) {
        this.$emit('update:visible', value)
      }
    }
  },
  watch: {
    visible: {
      handler: function(val) {
        if (val) {
          if (!_.isEmpty(this.course)) {
            this.model = _.cloneDeep(this.course)
            this.courseDefault = [
              {
                courseName: _.get(this.model, 'courseName', null),
                courseId: _.get(this.model, 'courseId', null)
              }
            ]
            this.title = '编辑在线课程'
            this.editType = 'edit'
          } else {
            this.model = _.assign(_.cloneDeep(modelCopy), { id: _.uniqueId('12454611451154') })
            this.editType = 'add'
          }
        }
      }
    }
  },
  mounted() {
    const classTimeProps = _.find(this.columns, { prop: 'classTime' })
    const classTimeRules = [
      { required: true, validator: this.validateClassTime, trigger: ['blur', 'change'] }
    ]
    _.set(classTimeProps, 'rules', classTimeRules)
  },
  methods: {
    // 上课开始时间大于等于培训开始时间，授课结束时间要小于等于培训结束时间
    validateClassTime(rule, value, callback) {
      // 上课开始时间要在考试时间之前
      const isLegalBeginTime = moment(this.trainTimeInVuex[0]).isSameOrBefore(
        moment(this.model.classTime[0])
      )
      // 上课结束时间要在考试结束时间之后
      const isLegalEndTime = moment(this.trainTimeInVuex[1]).isSameOrAfter(
        moment(this.model.classTime[1])
      )
      if (!isLegalBeginTime) {
        callback(new Error(`上课开始日期要在培训开始日期（${this.trainTimeInVuex[0]}）之后`))
      } else if (!isLegalEndTime) {
        callback(new Error(`上课结束日期要在培训结束日期（${this.trainTimeInVuex[1]}）之前`))
      } else {
        callback()
      }
    },
    selectCourse(data) {
      this.model = _.assign(this.model, data)
      this.model.lecturerName = data.name
      this.model.lecturerId = data.userId
      this.courseDefault = [
        {
          name: data.name,
          userId: data.userId
        }
      ]
    },
    loadCoordinator(params) {
      return getOrgUserList(_.assign(params, { orgId: 0 }))
    },
    loadCourse(params) {
      //courseType 1-在线课程
      return getTrainCource(_.assign(params, { courseType: 1 }))
    },
    close() {
      this.innnerVisible = false
    },
    submit() {
      this.$refs.form.validate().then(() => {
        this.close()
        this.$emit('submit', _.cloneDeep(this.model), this.editType)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.form {
  padding: 0 30px;
  flex: 1;
}

.footer {
  display: flex;
  padding: 20px 0;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #f5f5f7;
}
</style>
