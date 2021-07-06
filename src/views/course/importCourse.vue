<template>
  <div>
    <!-- :download-template="template" -->
    <importDataByFile
      title="导入课程"
      :download-template="template"
      :download-error-function="errorFile"
      :upload-function="importLecturer"
    ></importDataByFile>
    <p class="text">
      <span style="text-align: center">课程导入注意事项 ：</span>
      <span> 1、列标题打 “*”的列为必填项。</span>
      <span>2、列标题标有红色三角形的鼠标移至标题字段查看相对应的序号代表，例如：授课方式：1代表在线，2代表面授，3代表直播，输入中文字符或是其他字段则无效。
        红三角列有：授课方式、选修类型、课程认证等级、课程认证级别、通过条件、是否推荐。</span>
      <span>3、讲师账号”必须是讲师管理里面的数据，拷贝“联系方式”。</span>
      <span>4、“课程分类”多层级分类用斜杆“/”间隔，需要在后台管理的课程分类创建好相对应的分类方可批量导入。</span>
      <span>5、“课程开发人员账号”，如果讲师与是课程开发人员是同一人则输入同一账号，其他人员则输入相对应的账号，账号没有角色要求。</span>
      <span>6、此课程批量导入模板只供课程的基本字段信息导入，课程封面及课件内容（文档、视频、图片）需在后台管理的课程管理进入相对应的课程名称进行录入，修改。</span>
    </p>
  </div>
</template>
<script>
import { importCourse, exportErrFileCourse } from '@/api/course/course'
import importDataByFile from '@/components/importData/importData.vue'
export default {
  components: {
    importDataByFile
  },
  data() {
    return {
      template: 'https://file.zexueyuan.com.cn/8e73cb90578f41b2a9ab811f2f3f9f55.xlsx'
    }
  },
  methods: {
    importLecturer(params) {
      return importCourse(params)
    },

    errorFile(params) {
      return exportErrFileCourse(params)
    }
  }
}
</script>
<style lang="scss" scoped>
.text {
  color: red;
  position: absolute;
  top: 158px;
  right: 79px;
  width: 638px;
  display: flex;
  flex-direction: column;
  span {
    line-height: 26px;
  }
}
</style>
