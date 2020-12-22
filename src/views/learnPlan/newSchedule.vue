<template>
  <div
    id="newSchedule"
    class="newSchedule"
  >
    <page-header>
      <span
        slot="title"
        class="header_title"
      >{{
        active == '0' ? '新建手工试卷' : '新建课程安排'
      }}</span>
    </page-header>
    <basic-container block>
      <el-steps
        :active="active"
        finish-status="success"
      >
        <el-step title="填写基本信息"></el-step>
        <el-step title="添加课程"></el-step>
        <el-step title="人员信息"></el-step>
      </el-steps>
      <component :is="pageArr[active]"></component>
      <div class="page-bottom">
        <el-button
          v-show="active != '2'"
          type="primary"
          @click="handleNext"
        >
          下一步
        </el-button>
        <el-button
          v-show="active == '2'"
          type="primary"
          @click="handleNext"
        >
          完成
        </el-button>
        <el-button
          v-show="active != '0'"
          @click="handlePre"
        >
          返回上一步
        </el-button>
        <el-button
          v-show="active != '0'"
          @click="handleSubmit"
        >
          保存
        </el-button>
      </div>
    </basic-container>
  </div>
</template>

<script>
import basicInfo from './scheduleSubPage/basicInfo' // 基本信息
import addSchedule from './scheduleSubPage/addSchedule' // 添加课程
import personInfo from './scheduleSubPage/personInfo' // 人员信息
import { getCatalogs, addPlan, updatePlan } from '@/api/learnPlan'
export default {
  components: {
    basicInfo,
    addSchedule,
    personInfo
  },
  data() {
    return {
      active: 0,
      checkAll: false, // 是否全选
      treeData: [], // 所属分类
      pageArr: [basicInfo, addSchedule, personInfo],
      formData: {
        // 所有的数据
        automaticIntegralCount: false,
        courseCatalogId: '',
        courseCatalogName: '',
        coursePlanName: '',
        coursePlanNo: '',
        endDate: '',
        endTime: '',
        id: '',
        sponsor: '',
        startTime: '',
        participantsList: [],
        courseList: []
      },
      state: 'add'
    }
  },
  provide() {
    return {
      parentObj: this
    }
  },
  created() {
    this.isgetCatalogs()
  },
  methods: {
    handleCheckAllChange() {},
    toAddCertificate() {},
    handleSubmit() {
      let data = JSON.parse(JSON.stringify(this.formData))
      let [startTime, endTime] = [data.startTime[0], data.startTime[1]]
      data.startTime = startTime
      data.endTime = endTime
      let filterArr = this.treeData.filter((item) => {
        item.courseCatalogId == data.courseCatalogId
      })
      data.courseCatalogName = filterArr.length > 0 ? filterArr[0].name : ''
      if (this.state === 'add') {
        // 调用新增接口
        addPlan(data)
          .then(() => {
            this.state = 'edit'
          })
          .catch((err) => window.console.log(err))
      } else {
        // 否则调用编辑接口
        updatePlan(data).then(() => {})
      }
    },
    handlePre() {
      this.active != '0' ? this.active-- : '0'
    },
    handleNext() {
      this.active != '2' ? this.active++ : '2'
    },
    // 拿树形图数据
    isgetCatalogs() {
      getCatalogs().then((res) => {
        this.treeData = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.newSchedule {
  position: relative;
  .header_title {
    &::before {
      content: '<';
      font-size: 16px;
      margin-right: 9px;
      color: #8c9195;
    }
  }
  .page-bottom {
    text-align: center;
    position: absolute;
    bottom: 0px;
    width: 100%;
  }
}
/deep/.el-card {
  //   height: 100%;

  //   overflow: auto;
  .el-card__body {
    padding-bottom: 52px;
    box-sizing: border-box;
    position: relative;
  }
}
.el-steps {
  width: 80%;
  margin: auto;
}
</style>
