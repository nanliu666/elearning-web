<template>
  <div>
    <importDataByFile
      res-key="errData"
      title="导入组织"
      :download-error-function="errorFile"
      :download-template="templateLink"
      :upload-function="importLecturer"
      :columns="columns"
    ></importDataByFile>
  </div>
</template>
<script>
//https://xlms-file.xcmg.com:11443/eln/default/20210711/17/21/0/93b6b9595fa5c21c1386cb22645b579c.xlsx
import { importOrgs, exportErrOrgs } from '@/api/org/org'
import { getTemplate } from '@/api/system/template'
import importDataByFile from '@/components/importData/importData.vue'
export default {
  components: {
    importDataByFile
  },
  data() {
    return {
      templateLink: '',
      columns: [
        {
          label: '行号',
          prop: 'snum'
        },
        {
          label: '组织名称',
          prop: 'orgName'
        },
        {
          label: '上级组织',
          prop: 'parentOrg'
        },
        {
          label: '组织类型',
          prop: 'orgTypeStr'
        },
        {
          label: '负责人手机号',
          prop: 'leaderPhones'
        },
        {
          label: '描述',
          prop: 'remark'
        },
        {
          label: '错误信息',
          prop: 'errMsg'
        }
      ]
    }
  },
  created() {
    this.downTemplate()
  },
  methods: {
    downTemplate() {
      getTemplate({ code: 't2' }).then((res) => {
        this.templateLink = res.fileUrl
      })
    },
    importLecturer(params) {
      return importOrgs(params)
    },
    template() {
      // return exportTemplateOrgs()
    },
    errorFile(params) {
      return exportErrOrgs(params)
    }
  }
}
</script>
<style lang="scss" scoped></style>
