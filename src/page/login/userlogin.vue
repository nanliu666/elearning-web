<template>
  <el-form
    ref="loginForm"
    class="login-form"
    status-icon
    :rules="loginRules"
    :model="loginForm"
    label-width="0"
    size="medium"
  >
    <!-- account是用户名 -->
    <el-form-item prop="account">
      <el-input
        v-model="loginForm.account"
        auto-complete="off"
        :maxlength="11"
        placeholder="请输入手机号码"
        @keyup.enter.native="handleLogin"
      />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        :type="passwordType"
        auto-complete="off"
        placeholder="请输入密码"
        @keyup.enter.native="handleLogin"
      >
        <i
          v-if="passwordType !== 'password'"
          slot="suffix"
          class="icon-basics-eyeopen-outlined eye-icon"
          @click="showPassword"
        />
        <i
          v-else
          slot="suffix"
          class="icon-basics-eyeblind-outlined eye-icon"
          @click="showPassword"
        />
      </el-input>
    </el-form-item>
    <el-form-item
      v-if="website.captchaMode"
      prop="code"
    >
      <el-row :span="24">
        <el-col :span="16">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="请输入验证码"
            @keyup.enter.native="handleLogin"
          />
        </el-col>
        <el-col
          :offset="2"
          :span="6"
        >
          <div class="login-code">
            <img
              :src="loginForm.image"
              class="login-code-img"
              @click="refreshCode"
            />
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item class="login-submitBtn">
      <el-button
        type="primary"
        size="small"
        class="login-submit"
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>
    </el-form-item>
    <el-form-item>
      <div class="form-bottom">
        <div
          class="forget-password"
          @click="forgetPW"
        >
          忘记密码？
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCaptcha, getTenantInfo } from '@/api/user'

export default {
  name: 'Userlogin',
  data() {
    return {
      // 默认使用工号登录
      loginMode: 'username',
      tenantMode: this.website.tenantMode,
      loginForm: {
        // 工号登录
        account: '',
        //租户ID
        tenantId: '',

        //密码
        password: '',
        //账户类型
        type: 'account',
        //验证码的值
        code: '',
        //验证码的索引
        key: '',
        //预加载白色背景
        image: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      },
      loginRules: {
        account: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^[0-9]{11}$/, message: '请输入合法的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, message: '密码长度最少为6位', trigger: 'blur' }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      passwordType: 'password'
    }
  },

  computed: {
    ...mapGetters(['tagWel', 'tenantContent'])
  },
  created() {
    this.getTenant()
    this.refreshCode()
  },
  mounted() {},
  methods: {
    changeMode() {
      this.loginMode = this.loginMode === 'username' ? 'account' : 'username'
      this.$refs['loginForm'].clearValidate(...arguments)
    },
    refreshCode() {
      getCaptcha().then((res) => {
        this.loginForm.key = res.key
        this.loginForm.image = res.image
      })
    },
    showPassword() {
      this.passwordType === '' ? (this.passwordType = 'password') : (this.passwordType = '')
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '登录中,请稍后...',
            spinner: 'el-icon-loading'
          })

          this.$store
            .dispatch('LoginByUsername', this.loginForm)
            .then((res) => {
              this.$store.dispatch('getOrgIdsAc', this.loginForm.account) // 获取用户的组织id（包括当前和当前以上的），存放在localstore，vuex
              let path = this.$route.query.previewUrl
                ? decodeURI(this.$route.query.previewUrl)
                : this.tagWel.value
              this.$router.push({ path })
              this.$store.dispatch('GetUserPrivilege', res.user_id).then((menu) => {
                this.$router.$avueRouter.formatRoutes(menu, true)
              })
              loading.close()
            })
            .catch(() => {
              loading.close()
              this.refreshCode()
            })
        }
      })
    },
    getTenant() {
      let domain =
        process.env.NODE_ENV === 'development' ? 'www.bestgrand.com.cn' : window.location.host
      domain =
        process.env.NODE_ENV === 'development' ? '139.159.141.248:8081' : window.location.host
      getTenantInfo({ domain: `${domain}` }).then((res) => {
        this.loginForm.tenantId = res.tenantId || 'learn'
        this.$store.commit('SET_TENANT_CONTENT', JSON.stringify(res))
        this.$store.commit('SET_TENANT_ID', res.tenantId)
      })
      // 临时指定域名，方便测试
      //domain = "https://bladex.vip";
      // info(domain).then((res) => {
      //   const data = res.data
      //   if (data.success && data.data.tenantId) {
      //     this.tenantMode = false
      //     this.loginForm.tenantId = data.data.tenantId
      //     this.$parent.$refs.login.style.backgroundImage = `url(${data.data.backgroundUrl})`
      //   }
      // })
    },
    forgetPW() {
      this.$router.push({ path: '/selectMode' })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-submit {
  font-size: 16px;
}
.eye-icon {
  color: #757c85;
}
.form-bottom {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .change-mode {
    font-size: 12px;
    color: #409eff;
    cursor: pointer;
  }
}
</style>
