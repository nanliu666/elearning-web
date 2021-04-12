<template>
  <div
    ref="login"
    class="login-container"
  >
    <div class="login-content">
      <!--图片-->
      <div class="nav flex flex-flow ">
        <div class="LOGO">
          <img
            v-if="envVar === 'zehui' && isOrgIdE"
            src="../../assets/images/logoE.png"
          />
          <img
            v-else-if="envVar === 'zehui'"
            src="../../assets/images/logoZeHui.png"
          />
          <img
            v-else-if="envVar === 'xugong'"
            src="../../assets/images/logo.png"
          />
          <img
            v-else
            src="../../assets/images/logo_yb.png"
          />
          <!-- <img
            src="../../assets/images/logo.png"
            alt=""
          /> -->
        </div>
        <div class="title">
          {{ systemNameC }}
          <!-- elearning后台管理系统 -->
        </div>
      </div>

      <!--内容-->
      <div class="container ">
        <div class="containers flex flex-flow">
          <!--左边-->
          <div class="img ">
            <img
              class="bg"
              src="../../assets/images/welcome.png"
              alt=""
            />
            <!-- <img
              class="welcome_logo"
              src="../../assets/images/logo_white.png"
              alt=""
            /> -->
            <div>
              <img
                class="welcome_welcome"
                src="../../assets/images/HelloWelcome.svg"
                alt=""
              />
            </div>
            <div class="welcome_text">
              <!-- 欢迎登录elearning管理系统 -->
              欢迎登录{{ systemNameC }}
            </div>
          </div>
          <!--右边-->
          <div class="login_content">
            <div class="login-weaper animated bounceInDown">
              <div class="login-border">
                <div class="login-main">
                  <h4 class="login-title">
                    <!-- {{ website.title }} -->
                    登录账号
                  </h4>
                  <p class="login-welcome">
                    <!-- 欢迎您内训系统 -->
                  </p>
                  <userLogin v-if="activeName === 'user'" />
                  <codeLogin v-else-if="activeName === 'code'" />
                  <thirdLogin v-else-if="activeName === 'third'" />
                </div>
              </div>
            </div>
            <div class="hint">
              推荐使用谷歌浏览器
            </div>
          </div>
        </div>
      </div>
    </div>
    <mg-footer class="footer-style" />
  </div>
</template>
<script>
import userLogin from './userlogin'
import codeLogin from './codelogin'
import thirdLogin from './thirdlogin'
import { mapGetters } from 'vuex'
import { dateFormat } from '@/util/date'
import { validatenull } from '@/util/validate'
import { getStore } from '@/util/store'
import { systemName } from '@/config/env'
export default {
  name: 'Login',
  components: {
    userLogin,
    codeLogin,
    thirdLogin,
    MgFooter: () => import('@/components/footer/footer')
  },
  props: [],
  data() {
    return {
      isOrgIdE: false,
      time: '',
      activeName: 'user'
    }
  },
  computed: {
    systemNameC() {
      return systemName
    },
    envVar() {
      let envC = process.env
      return envC.VUE_APP_ENV
    },
    // orgId() {
    //   let userInfo = getStore({ name: 'userInfo' })
    //   // console.log('userInfo',userInfo)
    //   return userInfo.org_id
    // },
    ...mapGetters(['website'])
  },
  watch: {
    $route() {
      const params = this.$route.query
      this.socialForm.state = params.state
      this.socialForm.code = params.code
      if (!validatenull(this.socialForm.state)) {
        const loading = this.$loading({
          lock: true,
          text: `${this.socialForm.state === 'WX' ? '微信' : 'QQ'}登录中,请稍后。。。`,
          spinner: 'el-icon-loading'
        })
        setTimeout(() => {
          loading.close()
        }, 2000)
      }
    }
  },

  created() {
    this.getTime()
    setInterval(() => {
      this.getTime()
    }, 1000)
  },
  mounted() {
    this.isOrgIdEFn()
  },
  methods: {
    isOrgIdEFn() {
      // 判断是否是挖机组织
      // 获取用户的组织id（包括当前和当前以上的），存放在localstore，vuex
      let orgIdsVuex = this.orgIds
      this.orgIdsD = orgIdsVuex || getStore({ name: 'orgIds' })
      this.isOrgIdE = this.orgIdsD.indexOf('5263') !== -1 ? true : false
    },
    getTime() {
      this.time = dateFormat(new Date())
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/login.scss';
.login-content {
  padding-top: 33px;
  width: 62.5vw;
  min-width: 800px;
  margin: 0 auto;
  height: 100%;
  .nav {
    height: 32px;
    align-items: center;
    .title {
      margin-left: 12px;
      font-size: 16px;
      color: #000b15;
      text-align: center;
      opacity: 0.85;
    }
  }
  .container {
    /*background: #FFFFFF;*/

    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: calc(100% - 60px);
    .containers {
      border-radius: 8px;
      overflow: hidden;
      width: 100%;
      box-shadow: 0 6px 32px 0 rgba(0, 134, 185, 0.24);
    }
    .img {
      width: 50%;
      height: 63vh;
      display: flex;
      align-items: center;
      flex-direction: column;
      position: relative;
      z-index: 99;
      img.bg {
        top: 0;
        position: absolute;
        z-index: -1;
        width: 100%;
        height: 100%;
      }
      .welcome_logo {
        margin: 40px;
      }
      .welcome_welcome {
        width: 377px;
        margin: 0 auto;
        height: 178px;
      }
      .welcome_text {
        font-size: 22px;
        color: #ffffff;
        line-height: 30px;
        margin-top: 20px;
      }
    }
    .login_content {
      position: relative;
      width: 50%;
      height: 63vh;
      background: #fff;
    }
    .hint {
      position: absolute;
      top: 20px;
      right: 20px;
      color: #a0a8ae;
      font-size: 14px;
    }
  }
}
.footer-style {
  color: #000b15;
  opacity: 0.25;
  bottom: 0;
  left: 0;
  position: absolute;
  height: 48px;
  z-index: 99;
}
</style>
