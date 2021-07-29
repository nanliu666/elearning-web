<!--外购培训申请详情-->
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
          <span class="name">申请单位：</span>
          <span class="wContent">{{ formDetaill.applyUnit }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">培训对象：</span>
          <span class="wContent">{{ formDetaill.trainObject }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">计划人数：</span>
          <span class="wContent">{{ formDetaill.joinNum }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">培训时间：</span>
          <span
            class="wContent"
          >{{ formDetaill.trainStartTime }} 至 {{ formDetaill.trainEndTime }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">培训地点：</span>
          <span class="wContent">{{ formDetaill.address }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">总课时：</span>
          <span class="wContent">{{ formDetaill.lessonPeriod }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">费用预算：</span>
          <span class="wContent">{{ formDetaill.budget }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">项目经理：</span>
          <span class="wContent">{{ formDetaill.pmName }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">联系方式：</span>
          <span class="wContent">{{ formDetaill.contactInfo }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">内化形式：</span>
          <span class="wContent">{{ getTrainResultStr(formDetaill) }}</span>
        </el-col>
        <el-col
          :span="24"
          class="experienceList"
        >
          <span class="name">培训目标：</span>
          <span class="wContent">{{ formDetaill.trainTarget }}</span>
        </el-col>
        <el-col
          :span="24"
          class="experienceList"
        >
          <span class="name">培训内容：</span>
          <span class="wContent">{{ formDetaill.trainConent }}</span>
        </el-col>
        <el-col
          :span="24"
          class="experienceList"
        >
          <span class="name">讲师/机构介绍：</span>
          <span class="wContent">{{ formDetaill.introduce }}</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { trainingOuterBuyDetails } from '@/api/approval/apply'
export default {
  name: 'ApplyTrainingOuterBuyDet',
  props: {
    applyDetail: {
      type: Object
    }
  },
  data() {
    return {
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
        this.trainingOuterBuyDetailsFn()
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    getTrainResultStr(obj){
      let type = {
        1:'课程开发',
        2:'经验交流',
        3:'其他形式'
      }
      let content = obj.internalization === '3' ? `${obj.internalizationContent?'('+obj.internalizationContent+')':''}` : ''
      return `${type[obj.internalization]} ${content}`
    },
    async trainingOuterBuyDetailsFn() {
      this.formDetaill = await trainingOuterBuyDetails({ id: this.applyDetail.formId })
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
}
</style>
