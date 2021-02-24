<template>
  <div>
    <page-header
      title="新建证书模版"
      show-back
    />
    <basic-container>
      <div class="content">
        <div class="form_left">
          <!-- 左侧表单 -->
          <div class="form_left_in">
            <common-form
              ref="form"
              :model="form"
              :columns="columns"
            >
              <!-- 背景 -->
              <template slot="back">
                <common-upload
                  v-model="form.back"
                  :multiple="false"
                  :before-upload="beforeResumeUpload"
                >
                  <div
                    v-if="!form.back[0]"
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
                    :src="form.back[form.back.length - 1].url"
                    alt=""
                  />
                </common-upload>
                <div class="common-upload-bg-title">
                  <div>建议背景图片色彩单调简约，画面中心留白居多；</div>
                  <div>支持PNG、JPG格式，建议尺寸1169*826px，大小不超过1M</div>
                </div>
              </template>
              <!-- logo -->

              <template slot="logo">
                <common-upload
                  v-model="form.logo"
                  :before-upload="beforeResumeUpload"
                >
                  <div
                    v-if="!form.logo[0]"
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
                    :src="form.logo[form.logo.length - 1].url"
                    alt=""
                  />
                </common-upload>
                <div class="common-upload-bg-title">
                  <div>建议透明背景的机构logo；</div>
                  <div>支持PNG、JPG格式，建议尺寸240*120px，大小不超过1M</div>
                </div>
              </template>
            </common-form>
          </div>
        </div>

        <div class="preview_right">
          <div class="preview_right_in">
            <div class="preview_right_title">
              预览
            </div>
            <div
              v-show="form.name"
              class="preview_right_box"
            >
              <img
                v-if="form.back[0]"
                :src="form.back[form.back.length - 1].url"
                alt=""
                class="bgimg"
              />
              <div class="name">
                {{ form.name }}
              </div>
              <div class="text">
                {{ form.text }}
              </div>
              <img
                v-if="form.logo[0]"
                :src="form.logo[form.logo.length - 1].url"
                alt=""
                class="logo"
              />
              <div class="studentName">
                张三
              </div>
              <div class="serial">
                <div>证书编号:</div>
                <div>YB-20201130-0001</div>
                <div>2020年12月11日</div>
              </div>
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
      </div>
    </basic-container>
  </div>
</template>
<script>
import { addCertificate } from '@/api/certificate/certificate'
export default {
  name: 'DemoForm',
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload')
  },
  data() {
    return {
      form: {
        awardAgency: '',
        name: '',
        text: '',
        logo: [],
        back: []
      },
      columns: [
        {
          placeholder: '请输入标题，建议2～10个字符',
          prop: 'name',
          itemType: 'input',
          label: '模版名称',
          maxLength: 10,
          offset: 5,
          required: true,
          rules: [{ min: 2, max: 10, message: '建议2～10个字符', trigger: 'blur' }]
        },

        {
          prop: 'back',
          itemType: 'slot',
          label: '背景图片',
          offset: 5,
          required: true
        },
        {
          placeholder: '请输入标题，建议20～50个字符',
          prop: 'text',
          itemType: 'input',
          label: '证书正文',
          maxLength: 50,
          props: {},
          offset: 5,
          required: true,
          rules: [{ min: 20, max: 50, message: '建议20～50个字符', trigger: 'blur' }]
        },
        {
          placeholder: '请输入标题，建议2～10个字符',
          prop: 'awardAgency',
          itemType: 'input',
          label: '颁发机构',
          maxLength: 10,
          props: {},
          offset: 5,
          required: true,
          rules: [{ min: 2, max: 10, message: '建议2～10个字符', trigger: 'blur' }]
        },
        {
          prop: 'logo',
          itemType: 'slotout',
          required: false,
          offset: 5
        }
      ]
    }
  },
  watch: {
    'form.back': {
      handler() {
        this.$nextTick(() => {
          this.$refs.form.validateField('back', () => {})
        })
      },
      immediate: false
    }
  },
  created() {},
  methods: {
    isAddCertificate(i) {
      if (i) {
        this.$refs.form
          .validate()
          .then(() => {
            let params = {
              backName: '',
              backUrl: '',
              logoName: '',
              logoUrl: '',
              name: '',
              text: '',
              awardAgency: ''
            }
            params.backName = this.form.back[this.form.back.length - 1].fileName
            params.backUrl = this.form.back[this.form.back.length - 1].url
            if (this.form.logo.length) {
              params.logoName = this.form.logo[this.form.logo.length - 1].fileName
              params.logoUrl = this.form.logo[this.form.logo.length - 1].url
            }

            params.name = this.form.name
            params.text = this.form.text
            params.awardAgency = this.form.awardAgency

            addCertificate(params).then(() => {
              this.$message.success('保存成功')
              this.$router.push({ path: '/resource/certificate/certificateManage' })
              this.form = {
                awardAgency: '',
                name: '',
                text: '',
                logo: [],
                back: []
              }
            })
          })
          .catch(() => {
            this.$message.error('请补充信息！！！')
          })
      } else {
        this.$router.push({ path: '/resource/certificate/certificateManage' })
        this.form = {
          awardAgency: '',
          name: '',
          text: '',
          logo: [],
          back: []
        }
      }
    },

    beforeResumeUpload(file) {
      const regx = /^.*\.(PNG|JPG|png|jpg)$/
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
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
  height: 90vh;
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
    .preview_right_in {
      padding-left: 50px;
      padding-top: 20px;
      .preview_right_title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
        line-height: 24px;
      }
      .preview_right_box {
        position: relative;
        border: 1px solid #d9dbdc;
        margin-top: 15px;
        width: 408px;
        height: 288px;
        .bgimg {
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        .name {
          position: absolute;
          top: 22%;
          left: 50%;
          font-size: 30px;
          font-weight: 700;
          transform: translateX(-50%);
          text-align: center;
          width: 80%;
        }
        .text {
          position: absolute;
          top: 58%;
          left: 50%;
          font-size: 12px;
          font-weight: 700;
          transform: translateX(-50%);
          color: #8b8a8a;
          width: 50%;
          height: 28%;
          text-align: center;
          word-wrap: break-word;
        }
        .logo {
          position: absolute;
          top: 75.6%;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
        }
        .studentName {
          position: absolute;
          top: 46%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 22px;
          font-weight: 500;
        }
        .serial {
          position: absolute;
          right: 9%;
          bottom: 9%;
          color: #8b8a8a;
          font-size: 8px;
        }
      }
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
/deep/ .el-input {
  width: 20vw !important;
}
</style>
