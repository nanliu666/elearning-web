<template>
  <div class="submitSucceed">
    <!-- 面包屑 -->
    <el-breadcrumb
      separator="/"
      style="padding: 25px 0 20px"
    >
      <!-- <el-breadcrumb-item>业务申请</el-breadcrumb-item>
      <el-breadcrumb-item>培训需求申请</el-breadcrumb-item> -->
    </el-breadcrumb>
    <div class="content">
      <div class="content2">
        <span class="iconimage_icon_Tips iconfont succeedIcon"></span>
        <div>
          <span class="text1">您的资料已提交</span>
          <span class="text2">系统会在近期内对资料进行审核，请内心等待</span>
        </div>
        <div class="btn">
          <el-button
            size="medium"
            @click="toDetails"
          >
            查看审批详情
          </el-button>
          <el-button
            type="primary"
            style="margin-left: 15px"
            size="medium"
            @click.native="toHome"
          >
            返回首页
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SubmitSucceed',
  data() {
    return {}
  },
  methods: {
    toHome() {
      this.$router.push({ path: '/wel' })
    },
    toDetails() {
      let { id, key } = this.$route.query
      if (id) {
        this.$router.push({
          path: '/apprProcess/apprDetail',
          query: { apprNo: id, formKey: key }
        })
      }
    }
  }
}
</script>
<style scoped>
.submitSucceed {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}
.content .content2 {
  width: 472px;
  text-align: center;
}
.content .succeedIcon {
  font-size: 70px;
  color: #2875d4;
}
.content .text1 {
  font-size: 18px;
  color: #000b15;
  padding: 18px 0 0 0;
  opacity: 0.85;
  display: block;
  font-weight: bold;
}
.content .text2 {
  font-size: 14px;
  color: #000b15;
  padding: 13px 0 0 0;
  opacity: 0.65;
  display: block;
}
.btn {
  padding: 30px 0 0 0;
}
.btn /deep/ .el-button--primary {
  background-color: #2875d4;
  border-color: #2875d4;
}
.btn /deep/ .el-button--medium {
  padding: 11px 21px;
}
.btn /deep/ span {
  font-size: 16px;
}
</style>
