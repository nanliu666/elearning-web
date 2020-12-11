<template>
  <el-drawer
    :title="title"
    :visible.sync="innnerVisible"
  >
    <div class="wrapper">
      <common-form
        ref="form"
        :model="model"
        class="form"
        :columns="columns"
      >
        <template #courseName>
          <lazy-select
            v-model="model.courseName"
            :allow-create="isCreate"
            :searchable="remote"
            :load="loadCourse"
            :option-props="{
              label: 'name',
              value: 'name',
              key: 'id'
            }"
          />
        </template>
        <template #lecturerName>
          <lazy-select
            v-model="model.lecturerName"
            :allow-create="true"
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
import { createUniqueID } from '@/util/util'
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
  // TODO：关联课程应该用lazy-select
  { itemType: 'slot', span: 24, required: true, prop: 'courseName', label: '关联课程' },
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

export default {
  name: 'EditCourseDrawer',
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
      model: {
        studyType: 0,
        courseName: '',
        lecturerName: '',
        classTime: []
      }
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
            this.$refs.form && this.$refs.form.resetFields()
            this.model.id = createUniqueID()
            this.editType = 'add'
          }
        }
      }
    }
  },
  methods: {
    loadCoordinator(params) {
      return getOrgUserList(_.assign(params, { orgId: this.$store.getters.userInfo.org_id }))
    },
    loadCourse(params) {
      return getTrainCource(params)
    },
    close() {
      this.innnerVisible = false
    },
    submit() {
      this.$refs.form.validate().then(() => {
        this.close()
        this.$emit('submit', this.model, this.editType)
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
