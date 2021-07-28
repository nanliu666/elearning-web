<template>
  <div class="question-import fill">
    <page-header
      show-back
      title="用户导入"
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
            target="_blank"
            :href="templateLink"
          >
            <el-button
              size="medium"
            ><i
              class="iconimage_icon_download iconfont"
              style="margin-right: 10px"
            ></i>下载导入模板</el-button>
          </a>
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
        <common-table
          :columns="TABLE_COLUMNS"
          :config="TABLE_CONFIG"
          :data="failedList"
        />
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
import { QUESTION_IMPORT_URL } from './config'
import { importUser, importUserErrorFile } from '@/api/system/user'
import { getTemplate } from '@/api/system/template'
const TABLE_CONFIG = {
  maxHeight: '580px',
  showHandler: false,
  showIndexColumn: false,
  enableMultiSelect: false
}
const TABLE_COLUMNS = [
  { label: '行号', prop: 'lineNo', fixed: 'left', minWidth: 100 },
  { label: '姓名', prop: 'name', minWidth: 150 },
  { label: '身份证号', prop: 'idNo', minWidth: 150 },
  { label: '在职状态', prop: 'status', minWidth: 150 },
  { label: '性别', prop: 'sexStr', minWidth: 150 },
  { label: '部门', prop: 'orgName', minWidth: 150 },
  { label: '电话', prop: 'phonenum', minWidth: 150 },
  { label: '邮箱', prop: 'userEmail', minWidth: 150 },
  { label: '角色', prop: 'roleName', minWidth: 150 },
  { label: '直属领导', prop: 'leader', minWidth: 150 },
  { label: '岗位', prop: 'position', minWidth: 150 },
  { label: '出生日期', prop: 'birthDate', minWidth: 150 },
  { label: '职级', prop: 'postLevel', minWidth: 150 },
  { label: '职务', prop: 'post', minWidth: 150 },
  { label: '职称', prop: 'positionTitle', minWidth: 150 },
  { label: '入职日期', prop: 'entryDate', minWidth: 150 },
  { label: '备注', prop: 'userRemark', minWidth: 150 },
  { label: '错误信息', prop: 'errMsg', fixed: 'right', minWidth: 220 }
]
export default {
  name: 'ImportUser',
  data() {
    return {
      templateLink: '',
      importDisabled: true,
      uploadList: [],
      successCount: 0,
      failedCount: 0,
      failedList: [],
      importRes: {},
      step: '0', // 0 未导入，1 导入中，2 导入完成
      TABLE_CONFIG,
      TABLE_COLUMNS
    }
  },
  computed: {
    QUESTION_IMPORT_URL: () => QUESTION_IMPORT_URL
  },
  activated() {
    this.reset()
    this.downTemplate()
  },
  methods: {
    reset() {
      this.successCount = 0
      this.failedCount = 0
      this.failedList = []
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
      const loading = this.$loading({
        lock: true,
        text: '正在导入，请稍等！',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })
      const parmas = new FormData()
      parmas.append('file', file.file)
      importUser(parmas)
        .then((res) => {
          this.successCount += res.successNum
          this.failedCount = res.failedNum
          this.failedList = res.failedList
          this.importRes = res
          this.$refs.uploader1 && this.$refs.uploader1.clearFiles()
          if (this.failedCount == 0) {
            this.step = '2'
          } else {
            this.step = '1'
          }
        })
        .catch()
        .finally(() => {
          loading.close()
        })
    },
    downTemplate() {
      getTemplate({ code: 't1' }).then((res) => {
        this.templateLink = res.fileUrl
      })
    },
    downloadFile() {
      importUserErrorFile({
        cacheKey: this.importRes.cacheKey
      }).then((res) => {
        exportToExcel(res)
      })
    },
    handleSubmit() {
      this.$refs.uploader.submit()
    },
    jumpToQuestionList() {
      this.$router.push({ path: '/system/user' })
    },
    handleCancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
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
