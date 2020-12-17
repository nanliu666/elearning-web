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
      pageArr: [basicInfo, addSchedule, personInfo]
    }
  },
  methods: {
    handleCheckAllChange() {},
    toAddCertificate() {},
    handleSubmit() {},
    handlePre() {
      this.active != '0' ? this.active-- : '0'
    },
    handleNext() {
      this.active != '2' ? this.active++ : '2'
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
    bottom: 10px;
    width: 100%;
  }
}
.el-card {
  height: 100%;
  padding-bottom: 42px;
  box-sizing: border-box;
  position: relative;
}
.el-steps {
  width: 80%;
  margin: auto;
}
</style>
