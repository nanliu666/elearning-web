<template>
  <div>
    <importDataByFile
      res-key="failedList"
      title="导入用户"
      :download-error-function="errorFile"
      :download-template="templateLink"
      :upload-function="importLecturer"
      :query="query"
      :columns="columns"
    ></importDataByFile>
  </div>
</template>
<script>
import { usergroupImport, groupErrFileExport } from '@/api/system/user'
import { getTemplate } from '@/api/system/template'
import importDataByFile from '@/components/importData/importData.vue'
export default {
  components: {
    importDataByFile
  },
  data() {
    return {
      templateLink: '',
      query: {},
      columns: [
        {
          label: '行号',
          prop: 'lineNo'
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '手机号',
          prop: 'phonenum'
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
  activated() {
    this.query.groupId = this.$route.query.groupId
  },
  methods: {
    downTemplate() {
      getTemplate({ code: 't10' }).then((res) => {
        this.templateLink = res.fileUrl
      })
    },
    importLecturer(params) {
      return usergroupImport(params)
    },
    template() {
      // return downloadPositionTemplate()
    },
    errorFile(params) {
      return groupErrFileExport(params)
    }
  }
}
</script>
<style lang="scss"></style>
