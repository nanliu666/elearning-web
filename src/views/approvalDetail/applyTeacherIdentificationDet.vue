<!--讲师认证申请详情-->
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
          <span class="name">初始工作日期：</span>
          <span class="wContent">{{ formDetaill.workStartTime }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">徐工工作日期：</span>
          <span class="wContent">{{ formDetaill.xgWorkStartTime }}</span>
        </el-col>
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
          <span class="name">现等级：</span>
          <span class="wContent">{{ formDetaill.grade }}</span>
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
        任职资格
      </div>
      <el-row>
        <el-col
          :span="16"
          class="experienceList"
        >
          <span class="name">授课课时：</span>
          <span class="wContent">{{ formDetaill.teachHours }}</span>
        </el-col>
        <el-col
          :span="16"
          class="experienceList"
        >
          <span class="name">课程效果：</span>
          <span class="wContent">{{ formDetaill.teachResult }}</span>
        </el-col>
      </el-row>
      <h4>参与课程开发</h4>
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
        <el-table-column label="课程描述">
          <template slot-scope="scope">
            {{ scope.row.courseName }}
            <!-- <el-input v-model="scope.row.courseName" placeholder=""></el-input> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { teacherAuthApplyDetail } from '@/api/approval/apply'
export default {
  name: 'ApplyLeaveDet',
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
        this.teacherAuthApplyDetailFn()
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    async teacherAuthApplyDetailFn() {
      this.formDetaill = await teacherAuthApplyDetail({ id: this.applyDetail.formId })
      this.courseData = this.formDetaill.applyCourseDevJoins
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
