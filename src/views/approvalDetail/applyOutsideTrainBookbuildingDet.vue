<!--外派培训申请的审批详情-->
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
          <span class="name">费用预算：</span>
          <span class="wContent">{{ formDetaill.budget }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">研修成果：</span>
          <!-- <span class="wContent">{{ formDetaill.trainResult }}</span> -->
          <span class="wContent">{{ getTrainResultStr(formDetaill)}}</span>
        </el-col>
        <el-col
          :span="24"
          class="experienceList"
        >
          <span class="name">研修目的：</span>
          <span class="wContent">{{ formDetaill.trainTarget }}</span>
        </el-col>
        <el-col
          :span="24"
          class="experienceList"
        >
          <span class="name">研修内容：</span>
          <span class="wContent">{{ formDetaill.trainContent }}</span>
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
    <div class="content">
      <div class="title">
        外派人员
      </div>
      <el-table
        :data="courseData"
        style="width: 100%"
        max-height="400"
      >
        <el-table-column
          label="序号"
          type="index"
          width="100"
        >
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="年龄">
          <template slot-scope="scope">
            {{ getAges(scope.row.birthDate) }}
          </template>
        </el-table-column>
        <el-table-column label="所属部门">
          <template slot-scope="scope">
            {{ scope.row.dept }}
          </template>
        </el-table-column>
        <el-table-column label="岗位名称">
          <template slot-scope="scope">
            {{ scope.row.postionName }}
          </template>
        </el-table-column>
        <el-table-column label="工作时间（年）">
          <template slot-scope="scope">
            {{ scope.row.workYear }}
          </template>
        </el-table-column>
        <el-table-column label="外派理由">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { trainingOuterDetails } from '@/api/approval/apply'
import moment from 'moment'
export default {
  name: 'ApplyOutsideTrainBookbuildingDet',
  props: {
    applyDetail: {
      type: Object
    }
  },
  data() {
    return {
      courseData: [],
      formDetaill: {},
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
        this.trainingOuterDetailsFn()
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
        3:'课程攻关',
        4:'其他形式'
      }
      let content = obj.trainResult === '4' ? `${obj.trainResultContent?'('+obj.trainResultContent+')':''}` : ''
      return `${type[obj.trainResult]} ${content}`
    },
    getAges(birth) {
      var age = birth ? moment().get('year') - Number(birth.substr(0, 4)) : ''
      return age
    },
    async trainingOuterDetailsFn() {
      this.formDetaill = await trainingOuterDetails({ id: this.applyDetail.formId })
      this.courseData = this.formDetaill.trainOuterSendJoins
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
.content h4 {
  font-weight: normal;
  color: #000b15;
  opacity: 0.45;
}
</style>
