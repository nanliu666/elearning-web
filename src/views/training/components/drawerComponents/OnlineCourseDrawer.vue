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
            :allow-create="isCreate"
            :searchable="remote"
            :load="loadCourse"
            :option-props="{
              label: 'courseName',
              value: 'courseId',
              key: 'courseId'
            }"
            @select="selectContact"
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
      remote: true,
      isCreate: true,
      editType: 'add',
      columns: EventColumns,
      title: '添加在线课程',
      model: modelCopy
    }
  },
  computed: {
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
  methods: {
    selectContact(data) {
      this.model = _.assign(this.model, data)
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
