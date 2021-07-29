<template>
  <div>
    <importDataByFile
      res-key="errData"
      title="导入讲师"
      :download-error-function="errorFile"
      :download-template="templateLink"
      :upload-function="importLecturer"
      :columns="columns"
    ></importDataByFile>
  </div>
</template>
<script>
import {
  importLecturer,
  downloadLecturerTemplate,
  importLecturerErrorFile
} from '@/api/lecturer/lecturer'
import { getTemplate } from '@/api/system/template'
import importDataByFile from '@/components/importData/importData.vue'
//https://xlms-file.xcmg.com:11443/eln/default/20210711/17/31/0/2d10447f886735a2d7290a7565788341.xlsx
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
          prop: 'snum',
          minWidth: 100,
          fixed: 'left'
        },
        {
          label: '讲师类型',
          prop: 'teacherTypeStr',
          minWidth: 150
        },
        {
          label: '讲师名称',
          prop: 'userName',
          minWidth: 150
        },
        {
          label: '讲师手机号',
          prop: 'phoneNo',
          minWidth: 150
        },
        {
          label: '性别',
          prop: 'sexStr',
          minWidth: 150
        },
        {
          label: '聘用类型',
          prop: 'typeStr',
          minWidth: 150
        },
        {
          label: '聘用日期开始日期',
          prop: 'hireStartTime',
          minWidth: 160
        },
        {
          label: '聘用日期结束日期',
          prop: 'hireEndTime',
          minWidth: 160
        },
        {
          label: '专业分类',
          prop: 'professionalCataStr',
          minWidth: 150
        },
        {
          label: '讲师等级',
          prop: 'teacherLevelStr',
          minWidth: 150
        },
        {
          label: '授课课时费（元）',
          prop: 'courseCost',
          minWidth: 160
        },
        {
          label: '讲师职称',
          prop: 'teacherTitleStr',
          minWidth: 150
        },
        {
          label: '所属分类',
          prop: 'category',
          minWidth: 150
        },
        {
          label: '证书编号',
          prop: 'certNo',
          minWidth: 150
        },
        {
          label: '擅长领域',
          prop: 'skilledField',
          minWidth: 150
        },
        {
          label: '是否推荐',
          prop: 'isRecommendStr',
          minWidth: 100
        },
        {
          label: '详细介绍',
          prop: 'introduction',
          minWidth: 220
        },
        {
          label: '错误信息',
          prop: 'errMsg',
          minWidth: 240,
          fixed: 'right'
        }
      ]
    }
  },
  created() {
    this.downTemplate()
  },
  methods: {
    downTemplate() {
      getTemplate({ code: 't7' }).then((res) => {
        this.templateLink = res.fileUrl
      })
    },
    importLecturer(params) {
      return importLecturer(params)
    },
    template() {
      return downloadLecturerTemplate()
    },
    errorFile(params) {
      return importLecturerErrorFile(params)
    }
  }
}
</script>
<style lang="scss"></style>
