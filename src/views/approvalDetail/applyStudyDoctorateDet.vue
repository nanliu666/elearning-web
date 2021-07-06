<!--在职读博申请的审批详情-->
<template>
  <div class="applyCourseDevDet">
    <div class="content">
      <div class="title">
        申请人信息
      </div>
      <el-row>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">姓名：</span><span class="wContent">{{ applyDetail.userName }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">性别：</span><span class="wContent">{{ applyDetail.sex }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">出生年月：</span><span class="wContent">{{ applyDetail.birthDate }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">所属部门：</span><span class="wContent">{{ applyDetail.orgName }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">工作岗位：</span><span class="wContent">{{ applyDetail.position }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">职业资格/职称：</span><span class="wContent">{{ applyDetail.jobName }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <div class="title">
        申请信息
      </div>
      <el-row>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">项目名称：</span>
          <span class="wContent">{{ formDetaill.projectName }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">徐工工龄：</span>
          <span class="wContent">{{ formDetaill.xgWorkYear }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">毕业学校：</span>
          <span class="wContent">{{ formDetaill.graduateSchool }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">专业：</span>
          <span class="wContent">{{ formDetaill.major }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">学历/学位：</span>
          <span class="wContent">{{ qualification[formDetaill.qualification] }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">申请学校及院系：</span>
          <span class="wContent">{{ formDetaill.schoolApply }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">申请专业及研究方向：</span>
          <span class="wContent">{{ formDetaill.majorApply }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">读博形式：</span>
          <span class="wContent">{{ formDetaill.studyType }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">拟取得证书类型：</span>
          <span class="wContent">{{ formDetaill.certificateTypeFuture }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">预计读博费用：</span>
          <span class="wContent">{{ formDetaill.budget }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">读博时间：</span>
          <span
            class="wContent"
          >{{ formDetaill.studyStartTime }} 至 {{ formDetaill.studyEndTime }}</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { doctorStudyApplyDetails } from '@/api/approval/apply'
export default {
  name: 'ApplyStudyDoctorateDet',
  props: {
    applyDetail: {
      type: Object
    }
  },
  data() {
    return {
      qualification: {
        '1': '初中及以下',
        '2': '中专/中技',
        '3': '高中',
        '4': '大专',
        '5': '本科',
        '6': '硕士',
        '7': '博士'
      },
      formDetaill: {}
    }
  },
  computed: {
    formData() {
      return this.applyDetail.formData && this.applyDetail.formData.length > 0
        ? JSON.parse(this.applyDetail.formData)
        : {}
    }
  },
  watch: {
    formData: {
      handler() {
        this.doctorStudyApplyDetailsFn()
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    async doctorStudyApplyDetailsFn() {
      this.formDetaill = await doctorStudyApplyDetails({ id: this.applyDetail.formId })
    }
  }
}
</script>
<style scoped>
.applyCourseDevDet {
  margin-top: 30px;
}
.content {
  padding-bottom: 30px;
}
.content .title {
  color: #000b15;
  opacity: 0.85;
  font-size: 14px;
  font-weight: bold;
  padding-bottom: 18px;
}
.content /deep/ .el-col {
  margin-bottom: 9px;
}
.content .experienceList {
  display: flex;
}
.content .name {
  color: #000b15;
  opacity: 0.45;
}
.content .wContent {
  flex: 1;
  padding-left: 10px;
}
</style>
