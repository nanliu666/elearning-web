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
            :allow-create="true"
            :searchable="true"
            :multiple="true"
            :load="loadCoordinator"
            :option-props="personOptionProps"
          />
        </template>
        <template #teachAssistant>
          <lazy-select
            v-model="formData.teachAssistant"
            :allow-create="true"
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
            :allow-create="true"
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
import { getOrgUserList } from '@/api/system/user'
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
  key: 'userId'
}

const personFormColumns = [
  {
    itemType: 'slot',
    label: '班主任',
    prop: 'headTeacher',
    required: true,
    span: 11,
    offset: 0
  },
  {
    itemType: 'slot',
    label: '助教',
    prop: 'teachAssistant',
    required: true,
    span: 11,
    offset: 2
  }
]
export default {
  name: 'EditDetail',
  components: {
    LazySelect: () => import('@/components/lazy-select/lazySelect')
  },
  data() {
    return {
      assessFormColumns,
      certificateFormColumns,
      personFormColumns,
      personOptionProps,
      formData: {
        certificateId: '',
        evaluation: true,
        certificate: true,
        evaluationType: [0],
        templateId: '',
        headTeacher: null,
        teachAssistant: null
      }
    }
  },
  methods: {
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
    getData() {
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
      return Promise.all(promiseList).then(() => {
        return this.formData
      })
    },
    loadCoordinator(params) {
      return getOrgUserList(_.assign(params, { orgId: 0 }))
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
