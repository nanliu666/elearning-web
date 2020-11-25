<template>
  <div class="editDetail">
    <section class="config-section">
      <div class="section-title">
        人员设置
      </div>
      <common-form
        ref="form"
        class="person-form-style"
        :columns="personFormColumns"
        :model="formData"
      >
        <template #coordinator>
          <lazy-select
            v-model="formData.coordinatorId"
            :load="loadCoordinator"
            :option-props="personOptionProps"
          />
        </template>
        <template #assistant>
          <lazy-select
            v-model="formData.assistantId"
            :load="loadAssistant('assistant')"
            :option-props="personOptionProps"
          />
        </template>
      </common-form>
    </section>
    <section class="config-section">
      <div class="section-title">
        <span style="margin-right: 10px">评估管理</span>
        <el-switch v-model="hasAssess" />
      </div>
      <common-form
        v-if="hasAssess"
        ref="form"
        class="person-form-style"
        :columns="assessFormColumns"
        :model="formData"
      />
    </section>
    <section class="config-section">
      <div class="section-title">
        <span style="margin-right: 10px">证书管理</span>
        <el-switch v-model="hasCertificate" />
      </div>
      <common-form
        v-if="hasCertificate"
        ref="form"
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
      </common-form>
    </section>
  </div>
</template>

<script>
const assessFormColumns = [
  {
    itemType: 'checkbox',
    label: '问卷类型',
    prop: 'questionnaireTypes',
    required: true,
    span: 11,
    offset: 0,
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
    prop: 'coordinator',
    required: true,
    span: 11,
    offset: 0
  },
  {
    itemType: 'slot',
    label: '助教',
    prop: 'assistant',
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
      hasAssess: true,
      hasCertificate: true,
      assessFormColumns,
      certificateFormColumns,
      personFormColumns,
      personOptionProps,
      formData: {
        questionnaireTypes: [],
        templateId: '',
        coordinatorId: null,
        assistantId: null
      }
    }
  },
  methods: {
    loadCoordinator() {
      // return getUserWorkList(params)
    },
    loadAssistant() {
      // return getUserWorkList(params)
    },
    loadCertificate() {
      // return getUserWorkList(params)
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
