<template>
  <div>
    <importDataByFile
      res-key="errData"
      title="导入岗位"
      :download-error-function="errorFile"
      :download-template="templateLink"
      :upload-function="importLecturer"
      :columns="columns"
    ></importDataByFile>
  </div>
</template>
<script>
import { importPosition, importPositionErrorFile } from '@/api/system/station'
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
          label: '岗位名称',
          prop: 'name'
        },
        {
          label: '父级岗位',
          prop: 'parent'
        },
        {
          label: '岗位说明',
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
      getTemplate({ code: 't9' }).then((res) => {
        this.templateLink = res.fileUrl
      })
    },
    importLecturer(params) {
      return importPosition(params)
    },
    template() {
      // return downloadPositionTemplate()
    },
    errorFile(params) {
      return importPositionErrorFile(params)
    }
  }
}
</script>
<style lang="scss"></style>
