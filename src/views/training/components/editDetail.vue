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
            :allow-create="isCreate"
            :searchable="remote"
            :load="loadCoordinator"
            :option-props="personOptionProps"
          />
        </template>
        <template #teachAssistant>
          <lazy-select
            v-model="formData.teachAssistant"
            :load="loadAssistant"
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
      <!-- <common-form
        v-if="formData.certificate"
        ref="certificateForm"
        class="person-form-style"
        :columns="certificateFormColumns"
        :model="formData"
      >
        <template #certificateTemplate>
          <lazy-select
            v-model="formData.templateId"
            :load="loadCertificate"
            :option-props="personOptionProps"
          />
        </template>
      </common-form> -->
    </section>
  </div>
</template>

<script>
import { getOrgUserList } from '@/api/system/user'
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
    prop: 'certificateTemplate',
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
      remote: true,
      isCreate: true,
      assessFormColumns,
      certificateFormColumns,
      personFormColumns,
      personOptionProps,
      formData: {
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
    getLiData(name) {
      return new Promise((resolve, reject) => {
        this.$refs[name]
          .validate()
          .then((valid) => {
            resolve(valid)
          })
          .catch(() => {
            reject()
          })
      })
    },
    getData() {
      let promiseList = []
      const personForm = this.getLiData('personForm')
      promiseList.push(personForm)
      if (this.formData.evaluation) {
        const assessForm = this.getLiData('assessForm')
        promiseList.push(assessForm)
      }
      // const certificateForm = this.getLiData('certificateForm')
      return Promise.all(promiseList).then(() => {
        return this.formData
      })
    },
    loadCoordinator() {
      let params = {
        pageNo: 1,
        pageSize: 10,
        search: '',
        orgId: this.$store.getters.userInfo.org_id || 0
      }
      return getOrgUserList(params)
    },
    loadAssistant() {
      let params = {
        pageNo: 1,
        pageSize: 10,
        search: '',
        orgId: this.$store.getters.userInfo.org_id || 0
      }
      return getOrgUserList(params)
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
