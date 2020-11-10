<template>
  <div
    ref="login"
    class="login-container"
  >
    <div class="login-weaper animated bounceInDown">
      <div class="login-border">
        <div class="login-main">
          <h4 class="login-title">
            {{ website.title }}
          </h4>
          <p class="login-welcome">
            欢迎您登录OA系统
          </p>
          <userLogin v-if="activeName === 'user'" />
          <codeLogin v-else-if="activeName === 'code'" />
          <thirdLogin v-else-if="activeName === 'third'" />
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
.footer-style {
  color: rgba(237, 248, 255, 0.6);
  bottom: 0;
  left: 0;
  position: absolute;
  height: 48px;
}
</style>
