<template>
  <div
    v-if="knowInfo"
    v-loading="isLoading"
    class="applyKnowledgeShare"
  >
    <h3>{{ knowInfo.resName }}</h3>
    <ul class="info">
      <li>
        <span>所在分类:</span>
        <span class="span"> {{ knowInfo.catalogName }}</span>
        <span> 知识体系: </span>
        <span class="span"> {{ knowInfo.knowledgeSystemFullName }}</span>
      </li>
      <li>
        <span>提供人：</span>
        <span class="span"> {{ knowInfo.providerName }}</span>
        <span>更新时间：</span>
        <span class="span">{{ knowInfo.updateTime }}</span>
      </li>
    </ul>
    <h3 style="padding-top: 40px">
      资料附件
    </h3>
    <div
      v-if="!knowInfo.attachments.length"
      class="address"
    >
      <span>资源地址:</span>
      <span class="url">{{ knowInfo.resUrl }}</span>
      <el-button
        v-clipboard:copy="knowInfo.resUrl"
        v-clipboard:success="onCopy"
        style="margin-left: 10px"
        type="text"
        size="small"
      >
        复制链接
      </el-button>
    </div>
    <div v-else>
      <el-row>
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="selectAll"
        >
          全选
        </el-checkbox>
        <span
          v-show="bulkLoad"
          class="bulk"
          @click="loadAll"
        >
          <i class="iconfont iconimage_icon_download"></i>
          <span>批量下载</span>
        </span>
      </el-row>
      <ul class="enclosureGroup">
        <li
          v-for="(item, index) in knowInfo.attachments"
          :key="index"
          class="enclosure"
        >
          <div
            class="mask"
            :style="{ visibility: selectList[index] ? 'visible' : 'hidden' }"
          >
            <div class="checkbox">
              <el-checkbox
                v-model="selectList[index]"
                @change="checkItem(item)"
              />
            </div>
            <i
              class="iconfont iconimage_icon_download"
              style="cursor: pointer"
              @click="downLoad(item)"
            >下载</i>
            <i
              class="iconfont iconimage_icon_eye"
              style="cursor: pointer"
              @click="previewContent(item)"
            >预览</i>
          </div>
          <svg
            v-if="showIcon(index)"
            class="icon"
            aria-hidden="true"
          >
            <use :xlink:href="iconType(item.fileName)"></use>
          </svg>
          <img
            v-else
            :src="item.url"
            style="width: 35px; height: 35px; border-radius: 5px"
            @error="srcError(index)"
          />
          <p style="width: 100%; text-align: center">
            {{ item.fileName }}
          </p>
        </li>
        <div
          v-if="refresh"
          style="refresh"
        ></div>
      </ul>
    </div>
    <div v-if="introduction">
      <h3>资料介绍</h3>
      <p
        class="introduce"
        v-html="knowInfo.introduction"
      ></p>
    </div>
    <el-dialog
      :visible="preview"
      width="80%"
      title="内容预览"
      top="7vh"
      @close="close"
    >
      <video
        v-if="previewVideo"
        width="100%"
        height="100%"
        :src="previewVideo"
        autoplay
        controls
      ></video>
      <img
        v-if="previewImg"
        :src="previewImg"
        style="width: 100%; height: 100%"
      />
      <iframe
        v-if="perviewSrc"
        width="100%"
        height="100%"
        :src="perviewSrc"
        frameborder="0"
      ></iframe>
    </el-dialog>
  </div>
</template>

<script>
import { getDetailsById } from '@/api/knowledge/knowledge'
import { downLoadFile } from '@/util/util'
import { getStore } from '@/util/store.js'
import axios from 'axios'
import '@/config/iconfont'
export default {
  name: 'ApplyKnowledgeShare',
  props: {
    applyDetail: {
      type: Object
    },
    introduction: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      knowInfo: null,
      word: /\.(txt|doc|wps|rtf|docx|xls|xlsx)$/, // 文档格式
      video: /\.(avi|wmv|mp4|3gp|rm|rmvb|mov)$/, // 视频格式
      image: /\.(jpg|jpeg|png|GIF|gif|bmp)$/, // 图片
      compress: /\.(rar|zip)$/, // 压缩包
      audio: /\.(mp3|wma|wav)$/, // 音频
      type: null,
      perviewSrc: '',
      preview: false,
      previewVideo: '',
      previewImg: '',
      loadList: [],
      isIndeterminate: false,
      selectList: [],
      checkAll: false,
      isLoading: false,
      refresh: false
    }
  },
  computed: {
    iconType() {
      return (type) => {
        const ppt = /\.(ppt)$/
        const pdf = /\.(pdf)$/
        const xls = /\.(xls|xlsx)$/
        if (this.image.test(type)) return '#iconimage'
        else if (this.video.test(type)) return '#iconvi'
        else if (this.compress.test(type)) return '#iconyasuobao'
        else if (this.word.test(type)) return '#icondoc'
        else if (ppt.test(type)) return '#iconppt'
        else if (pdf.test(type)) return '#iconpdf'
        else if (this.audio.test(type)) return '#iconyinpin'
        else if (xls.test(type)) return '#iconxls'
        else return '#iconppt'
      }
    },
    bulkLoad() {
      return this.selectList.find((item) => item)
    },
    showIcon() {
      return (index) => {
        const data = this.knowInfo.attachments[index]
        return !this.image.test(data.fileName) || data.showIcon
      }
    }
  },
  watch: {
    'applyDetail.formId': {
      handler() {
        this.getData()
      },
      deep: true
    }
  },
  methods: {
    selectAll(flag) {
      if (flag) {
        this.loadList = _.cloneDeep(this.knowInfo.attachments)
        this.selectList = this.selectList.map(() => true)
      } else {
        this.loadList = []
        this.selectList = this.selectList.map(() => false)
      }
      this.isIndeterminate = false
    },
    checkItem(file) {
      const index = this.loadList.findIndex((item) => item.url === file.url)
      index === -1 ? this.loadList.push(file) : this.loadList.splice(index, 1)
      this.isIndeterminate =
        this.loadList.length > 0 && this.loadList.length < this.knowInfo.attachments.length
      this.checkAll = this.loadList.length === this.knowInfo.attachments.length
    },
    // 获取知识详情
    getData() {
      if (!this.applyDetail.formId) return
      getDetailsById({ id: this.applyDetail.formId }).then((res) => {
        for (const key in res) {
          if (res[key] === '') res[key] = '--'
        }
        res.introduction = _.unescape(res.introduction)
        res.attachments.forEach(() => {
          this.selectList.push(false)
        })
        this.knowInfo = res
      })
    },
    // 预览
    previewContent(file) {
      const name = file.fileName.toLowerCase()
      if (this.word.test(name)) {
        this.type = 0
      } else if (/ppt$/.test(name)) {
        this.type = 0
      } else if (/pdf$/.test(name)) {
        this.type = 20
      } else if (this.image.test(name)) {
        this.previewImg = file.url
        this.preview = true
        return
      } else {
        this.$message.warning('此文件类型无法预览，推荐下载之后打开')
        return
      }
      axios({
        method: 'post',
        url:
          'http://139.9.41.27:9090/fcscloud/composite/httpfile' +
          `?convertType=${this.type}&fileUrl=${file.url}`,
        withCredentials: false,
        validateStatus: function(status) {
          return status >= 200 && status <= 500
        }
      }).then((res) => {
        if (res.data.errorcode === 0) {
          if (this.type === 69) {
            this.previewImg = res.data.data.viewUrl
            this.preview = true
            return
          }
          this.perviewSrc = res.data.data.viewUrl
          this.preview = true
        } else {
          this.$message.warning(res.data.message)
        }
      })
    },
    // 下载
    downLoad(file) {
      if (this.knowInfo.allowDownload === 1) return this.$message.error('此文件暂无下载权限')
      downLoadFile(file)
    },
    // dialog 关闭事件
    close() {
      this.preview = false
      this.perviewSrc = ''
      this.previewVideo = ''
      this.previewImg = ''
    },
    // 批量下载
    loadAll() {
      if (this.knowInfo.allowDownload === 1) return this.$message.error('此文件暂无下载权限')
      this.isLoading = true
      let params = {
        filePath: '',
        fileName: '',
        zipComment: encodeURIComponent('DownloadFiles.zip'),
        responseType: 'blob',
        emulateJSON: true
      }

      this.loadList.forEach((item) => {
        if (item.fileName != '未提交') {
          params.filePath += item.url + ',' //.push(item.filePath)
          params.fileName += item.fileName + ',' //.push(item.fileName)
        }
      })
      let url = `api/common/oss/download/zip?filePath=${params.filePath}&fileName=${params.fileName}
      &responseType=blob&emulateJSON=true&zipComment=${params.zipComment}`
      let token = getStore({ name: 'token' })
      let x = new XMLHttpRequest()
      x.open('GET', url, true)
      x.setRequestHeader('accessToken', `bearer  ${token}`)
      x.responseType = 'blob'
      x.onprogress = function() {}
      x.onload = () => {
        let url = window.URL.createObjectURL(x.response)
        let a = document.createElement('a')
        a.href = url
        a.download = '打包下载文件.zip' //可以填写默认的下载名称
        a.click()
        this.isLoading = false
        this.indexLoading = ''
      }
      x.send()
    },
    // 外包资源请求失败事件
    srcError(index) {
      this.knowInfo.attachments[index].showIcon = true
      this.refresh = !this.refresh
    },
    // 复制链接
    onCopy() {
      this.$message.success('复制链接成功！')
    }
  }
}
</script>
<style lang="scss" scoped>
.applyKnowledgeShare {
  .enclosureGroup {
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;
    .enclosure {
      width: 125px;
      height: 125px;
      position: relative;
      flex-shrink: 0;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      margin-bottom: 10px;
      & > i {
        font-size: 61;
      }
      & > p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mask {
        visibility: hidden;
        background-color: rgba(189, 189, 189, 0.9);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .checkbox {
          position: absolute;
          top: 7px;
          left: 7px;
        }
        i {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #fff;
          cursor: pointer;
          font-size: 16px;
        }
        i:first-of-type {
          margin-right: 10px;
        }
      }
      &:hover .mask {
        visibility: visible !important;
      }
    }
  }
  .info li {
    display: flex;
    margin-bottom: 20px;
    span {
      flex-shrink: 0;
      width: 70px;
    }
    .span {
      flex: 1;
      padding-left: 10px;
    }
  }
  .icon {
    width: 2em;
    height: 2em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .introduce {
    padding: 20px;
  }
  ::v-deep .el-dialog__body {
    height: 80vh;
  }
  .bulk {
    margin-left: 20px;
    cursor: pointer;
    i {
      margin-right: 5px;
    }
  }
  .refresh {
    width: 0px;
    height: 0px;
    visibility: hidden;
  }
  .address {
    .url {
      margin: 0 15px;
    }
  }
}
</style>
