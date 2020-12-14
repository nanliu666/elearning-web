<template>
  <div class="fill page">
    <div class="logo">
      <img src="../../assets/images/logo.svg" />
    </div>
    <page-header
      style="padding-left:32px"
      :title="'选择密码找回方式'"
      show-back
    />
    <basic-container block>
      <div class="select-mode-style">
        <div class="select-mode">
          <div class="page-des">
            你可以通过员工账号绑定的手机或者邮箱找回密码：
          </div>
          <el-radio
            v-model="mode"
            class="select-radio"
            label="phone"
          >
            通过手机找回
          </el-radio>
          <el-radio
            v-model="mode"
            label="email"
          >
            通过邮箱找回
          </el-radio>
          <div>
            <el-button
              class="bt"
              type="primary"
              size="medium"
              @click="forgetPW"
            >
              下一步
            </el-button>
          </div>
        </div>
      </div>
    </basic-container>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      mode: 'phone'
    }
  },
  methods: {
    forgetPW() {
      this.$router.push({
        path: '/getBackPW',
        query: {
          mode: this.mode
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  padding-left: 32px;
}
.page {
  background-color: #f2f5f7;
}
.basic-container--block {
  margin: 0 32px;
  height: calc(100% - 68px - 56px - 24px);
  min-height: calc(100% - 68px - 56px - 24px);
}
.select-mode-style {
  position: relative;
  .select-mode {
    width: 400px;
    margin: 0 auto;
    padding-top: 40px;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    .select-radio {
      margin-bottom: 24px;
    }
    /deep/ .el-radio__label {
      font-size: 16px;
    }
    .page-des {
      color: #202940;
      margin-bottom: 24px;
    }
    .bt {
      margin-top: 24px;
    }
  }
}
</style>
