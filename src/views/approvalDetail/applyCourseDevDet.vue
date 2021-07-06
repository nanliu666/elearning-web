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
          <span class="name">课程名称：</span><span class="wContent">{{ formData.courseName }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">开发方式：</span><span class="wContent">{{ formData.devType }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">开发周期：</span><span class="wContent">{{ formData.devStartTime }} 至 {{ formData.devEndTime }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">培训对象：</span><span class="wContent">{{ formData.trainObject }}</span>
        </el-col>
        <el-col
          :span="24"
          class="experienceList"
        >
          <span class="name">主要内容：</span><span class="wContent">{{ formData.conent }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <div class="title">
        课程开发责任人
      </div>
      <el-table
        :data="leadersData"
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
            {{ scope.row.userName }}
          </template>
        </el-table-column>
        <el-table-column label="所属部门">
          <template slot-scope="scope">
            {{ scope.row.dept }}
          </template>
        </el-table-column>
        <el-table-column label="岗位名称">
          <template slot-scope="scope">
            {{ scope.row.position }}
          </template>
        </el-table-column>
        <el-table-column label="职责分工">
          <template slot-scope="scope">
            {{ scope.row.duty }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { applyAddCourseDetail } from '@/api/approval/apply'
export default {
  name: 'ApplyCourseDevDet',
  props: {
    applyDetail: {
      type: Object
    }
  },
  data() {
    return {
      formDetaill: {},
      leadersData: []
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
        this.applyAddCourseDetailFn()
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    async applyAddCourseDetailFn() {
      this.formDetaill = await applyAddCourseDetail({ id: this.applyDetail.formId })
      this.leadersData = this.formDetaill.leaders
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
