<template>
  <div class="security">
    <page-header
      title="修改密码"
      show-back
      :back="goback"
    ></page-header>
    <div class="securitySetting">
      <div class="form_">
        <el-form
          ref="form"
          :model="form"
          label-width="80px"
          :rules="rules"
          label-position="top"
          size="medium"
        >
          <el-form-item
            label="旧密码"
            type="password"
            prop="oldPassword"
          >
            <span
              slot="label"
              class="label_"
            >
              <span>旧密码</span>
            </span>
            <el-input
              v-model="form.oldPassword"
              type="password"
              show-password
              placeholder="请输入旧密码"
            />
          </el-form-item>
          <el-form-item prop="newPassword">
            <span
              slot="label"
              class="label_"
            >
              <span>新密码</span><span class="tip">(密码包含字母，符号或数字中至少两项且长度6到12个字符的密码)</span>
            </span>
            <el-input
              v-model.trim="form.newPassword"
              placeholder="请输入新密码"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <span
              slot="label"
              class="label_"
            >
              <span>确认密码</span>
            </span>
            <el-input
              v-model.trim="form.confirmPassword"
              placeholder="请输入确认密码"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button
              :disabled="buttonDisabled"
              type="primary"
              @click="onsubmit"
            >
              确认修改
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { validatePW } from '@/util/validate'
import { checkPassword } from '@/api/personalInfo'
import { mapGetters } from 'vuex'
import md5 from 'js-md5'
export default {
  name: 'SecuritySetting',
  data() {
    const validateSurePSW = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    const validateNewPSW = function(rule, value, callback) {
      if (value.length < 6 || value.length > 12) {
        callback(new Error('密码的长度需要在6到12个字符之间'))
      } else if (!validatePW(value)) {
        callback(new Error('密码必须包含字母，符号或数字中至少两项'))
      } else if (value === this.form.oldPassword) {
        callback(new Error('新旧密码不能相同'))
      } else {
        callback()
      }
    }
    return {
      active: 0,
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        newPassword: [
          { required: true, validator: validateNewPSW, trigger: 'blur' },
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        confirmPassword: [{ required: true, validator: validateSurePSW, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    buttonDisabled: function() {
      let isDisabled = false
      _.mapKeys(this.form, (value) => {
        if (!value) {
          isDisabled = true
        }
      })
      return isDisabled
    }
  },
  methods: {
    onsubmit() {
      this.$refs.form.validate((isPass) => {
        if (isPass) {
          let params = {
            userId: this.userInfo.user_id,
            newPassword: md5(this.form.newPassword),
            oldPassword: md5(this.form.oldPassword)
          }
          checkPassword(params).then(() => {
            this.$message.success('修改成功')
            setTimeout(() => {
              this.goback()
            }, 3000)
          })
        }
      })
    },
    goback() {
      this.$parent.editType = 'entry'
      this.$parent.getUserAllInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
.security {
  font-family: PingFangSC-Regular;
  font-size: 14px;
}
.avue-view {
  margin: 0 32px 32px 32px;
}
.back {
  margin: 10px 0 16px 0;
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: #202940;
  line-height: 28px;
  .el-icon-arrow-left {
    padding: 8px;
    cursor: pointer;
  }
  span {
    font-weight: 800;
  }
}
.securitySetting {
  background: #ffffff;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  border-radius: 4px;
  height: calc(100vh - 60px - 32px - 40px - 56px);
  .form_ {
    padding-top: 40px;
    width: 400px;
    margin: 0 auto;
    font-size: 14px;
    .tip {
      font-size: 12px;
      line-height: 14px;
      color: #a0a8ae;
    }
  }
  /deep/ .el-form-item__label {
    line-height: 40px;
  }
}
/deep/ .el-form-item {
  margin-bottom: 24px;
}
</style>
