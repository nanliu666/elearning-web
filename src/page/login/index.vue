<template>
  <div
    ref="login"
    class="login-container"
  >
    <div class="content">
      <!--图片-->
      <div class="nav flex flex-flow ">
        <div class="LOGO">
          <img
            src="../../assets/images/logo.svg"
            alt=""
          />
        </div>
        <div class="title">
          elearning后台管理系统
        </div>
      </div>

      <!--内容-->
      <div class="container ">
        <div class="containers flex flex-flow">
          <!--左边-->
          <div class="img flex flexcenter flex-flow-column">
            <img
              class="bg"
              src="../../assets/images/welcome.png"
              alt=""
            />
            <div>
              <img
                class="welcome_logo"
                src="../../assets/images/logo_icon.svg"
                alt=""
              />
            </div>
            <div>
              <img
                class="welcome_welcome"
                src="../../assets/images/HelloWelcome.svg"
                alt=""
              />
            </div>
            <div class="welcome_text">
              欢迎登录elearning管理系统
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
      time: '',
      activeName: 'user'
    }
  },
  computed: {
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
  mounted() {},
  methods: {
    getTime() {
      this.time = dateFormat(new Date())
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/login.scss';
.content {
  padding-top: 33px;
  width: 1200px;
  margin: 0 auto;
  height: 100%;
  .nav {
    height: 32px;
    align-items: center;
    .LOGO {
      /*width: 150px;*/
      height: 32px;
    }
    .title {
      font-size: 16px;
      color: #000b15;
      text-align: center;
      opacity: 0.85;
    }
  }
  .container {
    /*background: #FFFFFF;*/

    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: calc(100% - 60px);
    .containers {
      box-shadow: 0 6px 32px 0 rgba(0, 134, 185, 0.24);
    }
    .img {
      width: 687px;
      height: 680px;
      position: relative;
      z-index: 99;
      img.bg {
        top: 0;
        position: absolute;
        z-index: -1;
        width: 687px;
        height: 680px;
      }
      .welcome_logo {
        height: 40px;
        top: -94px;
        position: relative;
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
      width: calc(100% - 687px);
      background: #fff;
      height: 680px;
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
