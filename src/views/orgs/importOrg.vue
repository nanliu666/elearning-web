<template>
  <div>
    <importDataByFile
      title="导入组织"
      :download-error-function="errorFile"
      :download-template="template"
      :upload-function="importLecturer"
    ></importDataByFile>
  </div>
</template>
<script>
import { importOrgs, exportErrOrgs, exportTemplateOrgs } from '@/api/org/org'
import importDataByFile from '@/components/importData/importData.vue'
export default {
  components: {
    importDataByFile
  },
  methods: {
    importLecturer(params) {
      return importOrgs(params)
    },
    template() {
      return exportTemplateOrgs()
    },
    errorFile(params) {
      return exportErrOrgs(params)
    }
  }
}
</script>
<style lang="scss" scoped></style>
