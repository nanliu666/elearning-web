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
          <span class="name">培训名称：</span>
          <span class="wContent">{{ formDetaill.trainName }}</span>
        </el-col>
        <el-col
          :span="24"
          class="experienceList"
        >
          <span class="name">培训目的：</span>
          <span class="wContent">{{ formDetaill.applyDesc }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <div class="title">
        培训信息
      </div>
      <el-row>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">培训名称：</span>
          <span class="wContent">{{ formDetaill.trainName }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">分类：</span>
          <span class="wContent">{{ formDetaill.categoryName }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">培训时间：</span>
          <span
            class="wContent"
          >{{ formDetaill.trainBeginTime }}-{{ formDetaill.trainEndTime }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">知识体系：</span>
          <span class="wContent">{{ formDetaill.knowledgeSystemId }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">授课对象：</span>
          <span class="wContent">{{ teachingObjectBase[formDetaill.teachingObject] }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">培训类型：</span>
          <span class="wContent">{{ trainTypeBase[formDetaill.trainType] }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">培训形式：</span>
          <span class="wContent">{{ trainWayBase[formDetaill.trainWay] }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">培训机构：</span>
          <span class="wContent">{{ formDetaill.organizer }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">项目经理：</span>
          <span class="wContent">{{ formDetaill.headTeacherName }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">联系电话：</span>
          <span class="wContent">{{ formDetaill.contactPhone }}</span>
        </el-col>
        <el-col
          :span="8"
          class="experienceList"
        >
          <span class="name">培训地点：</span>
          <span class="wContent">{{ formDetaill.address }}</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { applyJoinOuterTrainDetail } from '@/api/approval/apply'
export default {
  name: 'ApplyOutsideTrainingDet',
  props: {
    applyDetail: {
      type: Object
    }
  },
  data() {
    return {
      formDetaill: {},
      trainTypeBase: {
        POST_CERT: '岗位取证',
        EDU_SELF: '学历教育（自主）',
        EDU_APPOINT: '学历教育（委派）',
        SPECIAL: '专题研修'
      },
      teachingObjectBase: {
        '1': '干部',
        '2': '后备干部',
        '3': '技术人员',
        '4': '技能人员',
        '5': '营销人员',
        '6': '管理人员',
        '7': '新入职/转岗'
      },
      trainWayBase: {
        '1': '在线培训',
        '2': '面授培训',
        '3': '混合培训',
        '11': '在职培训',
        '12': '脱产培训',
        '13': '业余培训'
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
        this.applyJoinOuterTrainDetailFn()
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    async applyJoinOuterTrainDetailFn() {
      this.formDetaill = await applyJoinOuterTrainDetail({ applyId: this.applyDetail.formId })
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
