<template>
  <div class="editDetail">
    <section class="config-section">
      <div class="section-title">
        人员设置
      </div>
      <common-form
        ref="personForm"
        class="person-form-style"
        :columns="personFormColumns"
        :model="formData"
      >
        <template #headTeacher>
          <lazy-select
            v-model="formData.headTeacher"
            :searchable="true"
            :first-option="teacherDefault"
            :load="loadCoordinator"
            :option-props="personOptionProps"
          />
        </template>
        <template #teachAssistant>
          <lazy-select
            v-model="formData.teachAssistant"
            :first-option="teachAssistantDefault"
            :searchable="true"
            :multiple="true"
            :load="loadCoordinator"
            :option-props="personOptionProps"
          />
        </template>
      </common-form>
    </section>
    <section class="config-section">
      <div class="section-title">
        <span style="margin-right: 10px">评估管理</span>
        <el-switch v-model="formData.evaluation" />
      </div>
      <common-form
        v-if="formData.evaluation"
        ref="assessForm"
        class="person-form-style"
        :columns="assessFormColumns"
        :model="formData"
      />
    </section>
    <section class="config-section">
      <div class="section-title">
        <span style="margin-right: 10px">证书管理</span>
        <el-switch v-model="formData.certificate" />
      </div>
      <common-form
        v-if="formData.certificate"
        ref="certificateForm"
        class="person-form-style"
        :columns="certificateFormColumns"
        :model="formData"
      >
        <template #certificateId>
          <lazy-select
            v-model="formData.certificateId"
            :searchable="true"
            :load="loadCertificateList"
            :option-props="{
              label: 'name',
              value: 'id',
              key: 'id'
            }"
          />
        </template>
      </common-form>
    </section>
  </div>
</template>

<script>
import { getWorkList } from '@/api/system/user'
import { getCertificateList } from '@/api/examManage/schedule'
const assessFormColumns = [
  {
    itemType: 'checkbox',
    label: '问卷类型',
    prop: 'evaluationType',
    required: true,
    span: 11,
    offset: 0,
    disabled: true,
    options: [
      {
        label: '整体满意度评估（默认）',
        value: 0
      },
      {
        label: '自定义问卷',
        value: 1
      }
    ]
  }
]
const certificateFormColumns = [
  {
    itemType: 'slot',
    label: '证书模板',
    prop: 'certificateId',
    required: true,
    span: 11,
    offset: 0
  }
]
const personOptionProps = {
  label: 'name',
  value: 'userId',
  formatter: function(item) {
    return `${item.name}(${item.phonenum})`
  },
  key: 'userId'
}

export default {
  name: 'EditDetail',
  components: {
    LazySelect: () => import('@/components/lazy-select/lazySelect')
  },
  data() {
    return {
      teachAssistantDefault: [],
      teacherDefault: [],
      assessFormColumns,
      certificateFormColumns,
      personFormColumns: [
        {
          itemType: 'slot',
          label: '班主任',
          prop: 'headTeacher',
          rules: [
            { required: true, validator: this.checkHeadTeacher, trigger: ['blur', 'change'] }
          ],
          span: 11,
          offset: 0
        },
        {
          itemType: 'slot',
          label: '助教',
          prop: 'teachAssistant',
          rules: [
            { required: true, validator: this.checkTeachAssistant, trigger: ['blur', 'change'] }
          ],
          required: true,
          span: 11,
          offset: 2
        },
        {
          itemType: 'select',
          label: '公开报名',
          prop: 'applyJoinValue',
          required: false,
          disabled: true,
          hasLabelSwitch: true,
          labelSwitchConfig: {
            prop: 'applyJoin'
          },
          options: [
            { label: '审批通过', value: 'approval' },
            { label: '自动通过', value: 'automatic' }
          ],
          span: 11,
          offset: 0
        },
        {
          itemType: 'datePicker',
          label: '报名截止日期',
          prop: 'applyJoinEndDate',
          isVisible: false,
          required: false,
          span: 11,
          offset: 2
        }
      ],
      personOptionProps,
      formData: {
        applyJoinEndDate: '',
        applyJoinValue: 'approval',
        applyJoin: false,
        certificateId: '',
        evaluation: false,
        certificate: false,
        evaluationType: [0],
        templateId: '',
        headTeacher: null,
        teachAssistant: null
      }
    }
  },
  watch: {
    'formData.applyJoin': {
      handler(data) {
        const temp = _.find(this.personFormColumns, { prop: 'applyJoinEndDate' })
        _.set(temp, 'isVisible', data)
        const applyJoinValueTemp = _.find(this.personFormColumns, { prop: 'applyJoinValue' })
        _.set(applyJoinValueTemp, 'disabled', !data)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 检验班主任与助教不能同时为一人
    checkHeadTeacher(rule, value, callback) {
      const { headTeacher, teachAssistant } = this.formData
      if (_.isEmpty(value)) {
        callback(new Error('请选择班主任！'))
      } else if (
        _.some(teachAssistant, (item) => {
          return item === headTeacher
        })
      ) {
        callback(new Error('班主任与助教不能同时为一人！'))
      } else {
        callback()
      }
    },
    // 检验班主任与助教不能同时为一人
    checkTeachAssistant(rule, value, callback) {
      const { headTeacher, teachAssistant } = this.formData
      if (_.isEmpty(value)) {
        callback(new Error('请选择助教！'))
      } else if (
        _.some(teachAssistant, (item) => {
          return item === headTeacher
        })
      ) {
        callback(new Error('班主任与助教不能同时为一人！'))
      } else {
        callback()
      }
    },
    loadCertificateList(params) {
      return getCertificateList(_.assign(params, { status: 1 }))
    },
    getLiData(name) {
      return new Promise((resolve) => {
        this.$refs[name]
          .validate()
          .then((valid) => {
            resolve(valid)
          })
          .catch(() => {
            this.$emit('jump')
          })
      })
    },
    getData(type) {
      let promiseList = []
      const personForm = this.getLiData('personForm')
      promiseList.push(personForm)
      // 问卷类型校验
      if (this.formData.evaluation) {
        const assessForm = this.getLiData('assessForm')
        promiseList.push(assessForm)
      }
      // 证书模板校验
      if (this.formData.certificate) {
        const certificateForm = this.getLiData('certificateForm')
        promiseList.push(certificateForm)
      }
      // 如果是草稿，直接返回数据
      if (type === 1) {
        return new Promise((resolve) => {
          resolve(this.formData)
        })
      } else {
        return Promise.all(promiseList).then(() => {
          return this.formData
        })
      }
    },
    loadCoordinator(params) {
      return getWorkList(_.assign(params, { orgId: 0 }))
    },
    loadCertificate() {
      return Promise.resolve({ data: [] })
    }
  }
}
</script>

<style lang="scss" scoped>
.editDetail {
  background-color: #fff;
  padding: 10px 60px;
  height: calc(100% - 30px);
  .config-section {
    margin: 20px 0;
    .section-title {
      background-color: #f8f9f9;
      padding: 10px 15px;
      color: #1e1e1e;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      align-items: center;
    }
    .person-form-style {
      background-color: #f8f9f9;
      margin-top: 4px;
      padding: 20px 35px 0;
    }
  }
}
</style>
