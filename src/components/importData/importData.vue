<template>
  <div class="question-import fill">
    <page-header
      show-back
      :title="title"
    />
    <basic-container block>
      <div
        v-if="step === '0'"
        class="import-step"
      >
        <div class="section">
          <p class="title">
            1.下载导入模板
          </p>
          <p class="tips">
            请先下载导入模版并按照模板填写后再上传。
          </p>

          <a
            v-if="templateIsUrl"
            target="_blank"
            download="用户导入模板.xsl"
            :href="downloadTemplate"
          >
            <el-button
              size="medium"
            ><i
              class="iconimage_icon_download iconfont"
              style="margin-right: 10px"
            ></i>下载导入模板</el-button>
          </a>
          <el-button
            v-if="!templateIsUrl"
            size="medium"
            @click="getTemplate"
          >
            <i
              class="iconimage_icon_download iconfont"
              style="margin-right: 10px"
            ></i>下载导入模板
          </el-button>
        </div>
        <div class="section">
          <p class="title">
            2.上传填好的表格
          </p>
          <p>
            <span class="tips">支持文件类型：xls,xlsx。 </span>
            <br />
            <span class="tips"> 一次至多导入500条信息，超出信息将不予以导入。</span>
          </p>
          <el-upload
            ref="uploader"
            class="uploader"
            drag
            action=""
            :file-list.sync="uploadList"
            :limit="1"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :http-request="httpRequest"
            :on-change="onChange"
            :before-remove="removeFile"
            :auto-upload="false"
          >
            <i class="iconimage_icon_Uploadcoursecontent1 iconfont icon-upload"></i>
            <div class="el-upload__text">
              点击或将文件拖拽到这里上传
            </div>
          </el-upload>
        </div>
        <div class="footer">
          <el-button
            type="primary"
            size="medium"
            :disabled="importDisabled"
            @click="handleSubmit"
          >
            确认导入
          </el-button>
          <el-button
            size="medium"
            @click="handleCancel"
          >
            取消
          </el-button>
        </div>
      </div>
      <div
        v-if="step === '1'"
        class="failed-step"
      >
        <div class="count">
          导入成功{{ successCount }}条, 导入失败{{ failedCount }}条
        </div>
        <div class="tip">
          <span>{{ failedCount }}条不符合导入要求，将不会被导入，可下载
            <el-button
              type="text"
              @click="downloadFile()"
            >错误报告</el-button>
            ，修改后重新导入。</span>
          <el-upload
            ref="uploader1"
            class="uploader1"
            action=""
            :limit="1"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :http-request="httpRequest"
          >
            <el-button
              size="medium"
              type="text"
              class="import-btn"
            >
              重新导入
            </el-button>
          </el-upload>
        </div>
        <!-- <common-table
          :columns="TABLE_COLUMNS"
          :config="TABLE_CONFIG"
          :data="failedList"
        /> -->
      </div>
      <div
        v-if="step === '2'"
        class="success-step"
      >
        <svg
          class="icon success-icon"
          aria-hidden="true"
        >
          <use xlink:href="#iconimage_icon_Correctprompt"></use>
        </svg>
        <div class="text">
          导入成功
        </div>
        <el-button
          type="primary"
          size="medium"
          @click="jumpToQuestionList"
        >
          立即查看
        </el-button>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { exportToExcel } from '@/util/util'
// import {
//   importLecturer,
//   downloadLecturerTemplate,
//   importLecturerErrorFile
// } from '@/api/lecturer/lecturer'
export default {
  name: 'ImportData',
  props: {
    title: {
      type: [String],
      default: '导入'
    },
    downloadTemplate: {
      //下载模板的函数或者url
      type: [Function, String],
      required: true
    },
    downloadErrorFunction: {
      //下载错误信息的函数
      type: [Function],
      required: true
    },
    uploadFunction: {
      //上传
      type: [Function],
      required: true
    }
  },
  data() {
    return {
      importDisabled: true,
      uploadList: [],
      successCount: 0,
      failedCount: 0,
      failedList: [],
      importRes: {},
      step: '0' // 0 未导入，1 导入中，2 导入完成
    }
  },
  computed: {
    templateIsUrl() {
      return typeof this.downloadTemplate === 'function' ? false : true
    }
  },
  activated() {
    this.reset()
  },
  methods: {
    reset() {
      this.successCount = 0
      this.failedCount = 0
      this.failedList = 0
      this.step = '0'
      this.uploadList = []
      this.$refs.uploader && this.$refs.uploader.clearFiles()
      this.$refs.uploader1 && this.$refs.uploader1.clearFiles()
    },
    handleExceed() {
      this.$message.warning('只能选择一个文件')
    },
    beforeUpload(file) {
      const regx = /^.*\.(xls|xlsx)$/
      if (!regx.test(file.name)) {
        this.$message.error('上传资料只支持xls，xlsx文件')
        return false
      }
      // const isXLS = file.type === 'application/vnd.ms-excel'
      const isLt2M = file.size / 1024 / 1024 < 2
      // if (!isXLS) {
      //   this.$message.error('上传文件只能是 xls 格式!')
      // }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!')
      }
      return isLt2M && regx.test(file.name)
    },
    onChange() {
      this.importDisabled = false
    },
    removeFile() {
      this.importDisabled = true
    },
    httpRequest(file) {
      const parmas = new FormData()
      parmas.append('file', file.file)
      this.uploadFunction(parmas)
        .then((res) => {
          this.successCount += res.successNum
          this.failedCount = res.failedNum
          // this.failedList = res.importFailDatal
          this.importRes = res
          this.$refs.uploader1 && this.$refs.uploader1.clearFiles()
          if (this.failedCount == 0) {
            this.step = '2'
          } else {
            this.step = '1'
          }
        })
        .catch()
    },
    getTemplate() {
      this.downloadTemplate().then((res) => {
        exportToExcel(res)
      })
    },
    downloadFile() {
      this.downloadErrorFunction({
        cacheKey: this.importRes.cacheKey
      }).then((res) => {
        exportToExcel(res)
      })
    },
    handleSubmit() {
      this.$refs.uploader.submit()
    },
    jumpToQuestionList() {
      this.$router.go(-1)
    },
    handleCancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.question-import {
  /deep/ .basic-container--block {
    height: calc(100% - 92px);
    min-height: calc(100% - 92px);
    > .el-card {
      height: 100%;
      > .el-card__body {
        height: 100%;
        overflow: auto;
      }
    }
  }
  .import-step {
    .section {
      background: #fafafa;
      border-radius: 4px;
      padding: 24px;
      margin-bottom: 16px;
      .title {
        color: rgba(#000b15, 0.85);
        font-size: 16px;
        line-height: 22px;
        margin-top: 0;
      }
      .tips {
        color: rgba(#000b15, 0.45);
      }
    }
    .footer {
      display: flex;
      justify-content: center;
    }
    /deep/ .el-upload {
      width: 100%;
    }
    /deep/.el-upload-dragger {
      border: none;
      border-radius: 4px;
      width: 100%;
      height: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    /deep/.el-upload-dragger .el-upload__text {
      color: rgba(#000b15, 0.45);
    }
    .icon-upload {
      font-size: 28px;
      color: #8c9195;
      margin-bottom: 10px;
      display: inline-block;
    }
  }
  .failed-step {
    .count {
      line-height: 40px;
      padding-left: 24px;
      background: #fafafa;
      border-radius: 4px;
    }
    .tip {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
      margin-bottom: 16px;
    }
    /deep/ .el-button {
      padding: 0;
    }
    .import-btn {
      // color: rgba(0, 11, 21, 0.85);
    }
  }
  .success-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    .success-icon {
      font-size: 72px;
    }
    .text {
      font-size: 24px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
      text-align: center;
      line-height: 36px;
      font-weight: 600;
      margin: 16px 0 24px;
    }
  }
}
</style>
