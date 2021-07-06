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
        个人信息
      </div>
      <el-row>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">学历：</span>
          <span class="wContent">{{ qualification[formDetaill.qualification] }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">毕业院校：</span>
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
          <span class="name">本岗位工作年限：</span>
          <span class="wContent">{{ formDetaill.workYear }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">上年度绩效评价结果（2020年）：</span>
          <span class="wContent">{{ formDetaill.lastYearPerformance }}</span>
        </el-col>
        <el-col
          :span="24"
          class="experienceList"
        >
          <span class="name">申请说明：</span>
          <span class="wContent">{{ formDetaill.remark }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <div class="title">
        工作经历
      </div>
      <div
        v-for="(item, index) in editExperData"
        :key="item.id ? item.id : index"
        class="experience"
        @mouseover="activeId = index + 1"
        @mouseout="activeId = 0"
      >
        <h3>
          <span class="experienceTitle">工作经历（{{ index + 1 }}）</span>
        </h3>
        <div>
          <el-row>
            <el-col :span="8">
              <span class="name">单位名称：</span>{{ item.workUnit }}
            </el-col>
            <el-col :span="8">
              <span class="name">在职时间：</span>{{ item.workStartTime }} 至
              {{ item.workEndTime }}
            </el-col>
            <el-col :span="8">
              <span class="name">职位名称：</span>{{ item.jobName }}
            </el-col>
            <el-col :span="8">
              <span class="name">证明人：</span>{{ item.witness }}
            </el-col>
            <el-col :span="8">
              <span class="name">证明人联系电话：</span>{{ item.witnessPhone }}
            </el-col>
            <el-col
              :span="24"
              class="experienceList"
            >
              <span class="name">工作内容：</span><span class="wContent">{{ item.workContent }}</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { applyTutorDetail } from '@/api/approval/apply'
export default {
  name: 'ApplyTutorAuthDet',
  props: {
    applyDetail: {
      type: Object
    }
  },
  data() {
    return {
      formDetaill: {},
      editExperData: [],
      qualification: {
        '1': '初中及以下',
        '2': '中专/中技',
        '3': '高中',
        '4': '大专',
        '5': '本科',
        '6': '硕士',
        '7': '博士'
      }
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
        this.trainLeaveDetailFn()
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    async trainLeaveDetailFn() {
      this.formDetaill = await applyTutorDetail({ id: this.applyDetail.formId })
      this.editExperData = this.formDetaill.userExperiences
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

.experience {
  padding: 0 0 20px 0;
  border-bottom: #ebeced dashed 1px;
  margin-bottom: 24px;
}
.experience h3 {
  font-size: 14px;
  padding: 0 0 18px 0;
  margin: 0;
}
.experience .experienceTitle {
  padding-right: 20px;
}
.experience h3 span {
  float: left;
}
.experience h3 .operation {
  padding-right: 15px;
  cursor: pointer;
  color: #2875d4;
}
.experience h3::before {
  display: block;
  float: left;
  content: '';
  background: #2875d4;
  width: 4px;
  height: 14px;
  margin: 3px 10px 0 0;
}
.experience h3::after {
  content: '';
  display: block;
  clear: both;
}
.experience .experienceList {
  display: flex;
}
.experience .name {
  width: 70px;
}
.experience .wContent {
  flex: 1;
}
</style>
