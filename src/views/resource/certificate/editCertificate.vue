<template>
  <div>
    <page-header
      title="编辑证书模版"
      show-back
    />
    <basic-container>
      <div class="content">
        <div class="form_left">
          <!-- 左侧表单 -->
          <div class="form_left_in">
            <el-form
              ref="form"
              :model="form"
              :rules="rules"
            >
              <el-form-item
                prop="name"
                label="证书名称"
              >
                <el-input
                  v-model="form.name"
                  placeholder="请输入标题，建议2～25个字符"
                  minlength="2"
                  maxlength="25"
                />
              </el-form-item>
              <el-form-item
                prop="backUrl"
                label="背景图片"
              >
                <template>
                  <common-upload
                    :multiple="false"
                    :before-upload="beforeResumeUpload"
                    @input="backUpLoad"
                  >
                    <div
                      v-if="!form.backUrl"
                      class="mycommon-upload"
                    >
                      <i class="el-icon-plus"></i>
                      <div class="mycommon-upload-title">
                        添加背景图片
                      </div>
                    </div>
                    <img
                      v-else
                      class="mycommon-upload"
                      :src="form.backUrl"
                    />
                  </common-upload>
                  <div class="common-upload-bg-title">
                    <div>建议背景图片色彩单调简约，画面中心留白居多；</div>
                    <div>支持PNG、JPG格式，建议尺寸1169*826px，大小不超过5M</div>
                  </div>
                </template>
              </el-form-item>
              <el-form-item
                prop="text"
                label="证书正文"
              >
                <el-input
                  v-model="form.text"
                  :rows="6"
                  type="textarea"
                  placeholder="请输入文案，建议20～100个字符"
                  minlength="20"
                  maxlength="100"
                />
              </el-form-item>
              <el-form-item
                prop="awardAgency"
                label="颁发机构名称"
              >
                <el-input
                  v-model="form.awardAgency"
                  placeholder="请输入机构名称，建议2～25个字符"
                  minlength="2"
                  maxlength="25"
                />
              </el-form-item>
              <el-form-item
                prop="logoUrl"
                label="颁发机构logo"
              >
                <template>
                  <common-upload
                    :before-upload="beforeResumeUpload"
                    @input="logoUpLoad"
                  >
                    <div
                      v-if="!form.logoUrl"
                      class="mycommon-upload"
                    >
                      <i class="el-icon-plus"></i>
                      <div class="mycommon-upload-title">
                        添加机构logo
                      </div>
                    </div>
                    <img
                      v-else
                      class="mycommon-upload"
                      :src="form.logoUrl"
                    />
                  </common-upload>
                  <div class="common-upload-bg-title">
                    <div>建议透明背景的机构logo；</div>
                    <div>支持PNG、JPG格式，建议尺寸240*120px，大小不超过1M</div>
                  </div>
                </template>
              </el-form-item>
              <el-form-item
                prop="activeTime"
                label="生效日期"
              >
                <el-date-picker
                  v-model="form.activeTime"
                  type="date"
                  placeholder="请选择"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
              <el-form-item
                prop="date"
                label="有效期"
              >
                <el-date-picker
                  v-model="form.date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  placeholder="请选择"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
              <el-form-item
                prop="category"
                label="证书类型"
              >
                <el-radio-group v-model="form.category">
                  <el-radio label="0">
                    培训合格证书
                  </el-radio>
                  <el-radio label="1">
                    聘书
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                prop="way"
                label="获得方式"
              >
                <el-input
                  v-model="form.way"
                  type="textarea"
                  placeholder="请输入标题"
                  maxlength="200"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="preview_right">
          <div class="preview_right_in">
            <div class="preview_right_title">
              预览
            </div>
            <CertificateTemplate
              class="preview"
              :certificate-data="form"
            />
          </div>
        </div>
      </div>
      <div class="btn">
        <el-button
          type="primary"
          size="medium"
          @click="isAddCertificate(1)"
        >
          保存
        </el-button>
        <el-button
          size="medium"
          @click="isAddCertificate(0)"
        >
          取消
        </el-button>
      </div>
    </basic-container>
  </div>
</template>
<script>
import { getSingle, editCertificate } from '@/api/certificate/certificate'
import CertificateTemplate from './components/CertificateTemplate.vue'
import { pinyin } from 'pinyin-pro'
export default {
  name: 'DemoForm',
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload'),
    CertificateTemplate
  },
  data() {
    return {
      form: {
        date: []
      },
      rules: {
        name: [
          { required: true, message: '证书名称不能为空', trigger: 'blur' },
          { min: 2, max: 25, message: '证书名称仅支持2-25个字符', trigger: 'blur' }
        ],
        text: [
          { required: true, message: '证书正文名称不能为空', trigger: 'blur' },
          { min: 20, max: 100, message: '证书正文仅支持20-100个字符', trigger: 'blur' }
        ],
        awardAgency: [
          { required: true, message: '颁发机构名称不能为空', trigger: 'blur' },
          { min: 2, max: 25, message: '颁发机构名称仅支持2-25个字符', trigger: 'blur' }
        ],
        activeTime: [{ required: true, message: '生效日期不能为空', trigger: 'change' }],
        date: [
          { required: true, message: '有效期不能为空', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (this.form.activeTime && this.form.date.length !== 0) {
                this.checkDate(callback)
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        category: [{ required: true, message: '证书类型', trigger: 'change' }],
        logoUrl: [{ required: true, message: 'logo不能为空', trigger: 'blur' }],
        backUrl: [{ required: true, message: '背景不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'form.activeTime'() {
      if (this.form.activeTime && this.form.date.length !== 0) {
        this.$refs.form.validateField('date')
      }
    },
    'form.date'() {
      if (this.form.activeTime && this.form.date.length !== 0) {
        this.$refs.form.validateField('date')
      }
    }
  },
  created() {
    getSingle({ templateId: this.$route.query.id }).then((res) => {
      this.form = res
      this.$set(this.form, 'date', [res.bornTime, res.deadTime])
      let currentstr = pinyin(res.awardAgency, { pattern: 'initial', type: 'array' })
        .splice(0, 2)
        .join('')
        .toUpperCase()

      this.form.certificateNo = (currentstr ? currentstr : 'YB') + '-20201130-0001'
    })
  },
  methods: {
    // 校验有效期与生效期
    checkDate(callback) {
      const activeTime = new Date(this.form.activeTime).getTime()
      const date = new Date(this.form.date[0]).getTime()

      if (date < activeTime) {
        callback(new Error('生效日期不能大于有效期开始日期'))
      } else {
        callback()
      }
    },
    isAddCertificate(i) {
      if (i) {
        this.$refs.form.validate().then(() => {
          this.form.bornTime = this.form.date[0]
          this.form.deadTime = this.form.date[1]
          editCertificate(this.form).then(() => {
            this.$message.success('编辑成功')
            this.$router.push({ path: '/resource/certificate/certificateManage' })
          })
        })
      } else {
        this.$router.push({ path: '/resource/certificate/certificateManage' })
      }
    },
    backUpLoad(file) {
      this.form.backUrl = file[0].fileUrl
      this.form.backName = file[0].fileName
      this.$refs.form.validateField('backUrl')
    },
    logoUpLoad(file) {
      this.form.logoUrl = file[0].fileUrl
      this.form.logoName = file[0].fileName
      this.$refs.form.validateField('logoUrl')
    },
    beforeResumeUpload(file) {
      const regx = /^.*\.(PNG|JPG|png|jpg)$/
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传图片只支持PNG或JPG文件')
        return false
      }

      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  overflow: hidden;
  display: flex;
  // height: 90vh;
  margin-bottom: 100px;
  .form_left {
    box-sizing: border-box;
    flex: 1;
    height: 100%;
    border-right: 1px solid #ebeced;
    // padding: 5vh 5vw 0 20vw;
    .form_left_in {
      width: 30vw;
      float: right;
      padding-right: 50px;
      padding-top: 20px;
      .mycommon-upload {
        width: 189px;
        height: 110px;
        background: #ffffff;
        border: 1px dashed #d9dbdc;
        border-radius: 4px;
        color: #8c9195;
        .el-icon-plus {
          font-size: 32px;
          font-weight: 900;
          margin: 25px auto;
        }
        .mycommon-upload-title {
          margin-top: -25px;
        }
      }
      .common-upload-bg-title {
        margin-top: 8px;
        width: 20vw;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: rgba(0, 11, 21, 0.25);
        letter-spacing: 0;
        line-height: 18px;
      }
    }
  }
  .preview_right {
    flex: 1;
    height: 100%;
    position: relative;
    .preview_right_title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
      line-height: 24px;
    }
    .preview {
      transform: scale(0.65);
      position: absolute;
      top: -55px;
      left: -116px;
    }
  }
}
.btn {
  position: fixed;
  bottom: 0;
  width: 79%;
  box-shadow: 0 -6px 12px 0 rgba(0, 61, 112, 0.08);
  display: flex;
  justify-content: center;
  height: 76px;
  padding: 20px 0;
  margin-left: -25px;
  background-color: #fff;
}
/deep/ .el-input,
.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
  width: 28vw !important;
}
::v-deep label.el-form-item__label {
  float: none;
  text-align: left;
}
</style>
