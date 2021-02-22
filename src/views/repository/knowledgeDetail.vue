<template>
  <div>
    <page-header
      title="学习情况"
      show-back
    />
    <basic-container>
      <div class="details-container">
        <div class="details-top">
          <div class="top-title">
            <span class="title-text">{{ konwledgeDetail.resName }}</span>
            <el-tag :type="getStatusType(konwledgeDetail.status)">
              {{ konwledgeDetail.status | statusFilterer }}
            </el-tag>
          </div>
          <ul class="details-ul">
            <li class="details-li">
              <span class="li-label">创建人：</span>
              <span class="li-value">{{ konwledgeDetail.creatorName }}</span>
            </li>
            <li class="details-li">
              <span class="li-label">更新时间：</span>
              <span class="li-value">{{ konwledgeDetail.updateTime }}</span>
            </li>
            <li class="details-li">
              <span class="li-label">所在分类：</span>
              <span class="li-value">{{ konwledgeDetail.catalogName }}</span>
            </li>
            <li class="details-li">
              <span class="li-label">提供人：</span>
              <span class="li-value">{{ konwledgeDetail.providerName }}</span>
            </li>
            <li class="details-li">
              <span class="li-label">上传模式：</span>
              <span class="li-value">{{
                konwledgeDetail.uploadType === 0 ? '本地文件' : '链接文件'
              }}</span>
            </li>
            <li
              v-if="konwledgeDetail.uploadType === 0"
              class="details-li"
            >
              <span class="li-label">是否允许下载：</span>
              <span class="li-value">{{ konwledgeDetail.allowDownload === 1 ? '是' : '否' }}</span>
            </li>
            <li
              v-if="konwledgeDetail.uploadType === 1"
              class="details-li"
              style="width: 100%;"
            >
              <span class="li-label">链接地址：</span>
              <span class="li-value">{{ konwledgeDetail.resUrl }}</span>
            </li>
          </ul>
        </div>
        <div class="details-bottom">
          <li class="bottom-li">
            <div class="bottom-li-title">
              查看人数
            </div>
            <div class="bottom-li-value">
              {{ konwledgeDetail.watchNum }}
            </div>
          </li>
          <li class="bottom-li">
            <div class="bottom-li-title">
              收藏人数
            </div>
            <div class="bottom-li-value">
              {{ konwledgeDetail.collectNum }}
            </div>
          </li>
          <li class="bottom-li">
            <div class="bottom-li-title">
              评论人数
            </div>
            <div class="bottom-li-value">
              {{ konwledgeDetail.commentNum }}
            </div>
          </li>
          <li
            v-if="konwledgeDetail.allowDownload"
            class="bottom-li"
          >
            <div class="bottom-li-title">
              下载人数
            </div>
            <div class="bottom-li-value">
              {{ konwledgeDetail.downloadNum }}
            </div>
          </li>
        </div>
      </div>
    </basic-container>
    <basic-container style="margin-top: 20px">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        :active-text-color="activeColor"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          资源介绍
        </el-menu-item>
        <el-menu-item
          v-if="_.size(konwledgeDetail.attachments) > 0"
          index="2"
        >
          附件
        </el-menu-item>
      </el-menu>
      <div style="padding: 20px; min-height:32vh">
        <div
          v-if="activeIndex === '1'"
          v-html="_.unescape(konwledgeDetail.introduction)"
        />
        <section v-if="activeIndex === '2'">
          <div class="image-ul">
            <div
              v-for="(item, index) in fileGroup.true"
              :key="index"
              class="image__li"
            >
              <common-image-view
                :is-download="true"
                :url="item.url"
                :file-name="item.fileName"
                :preview-src-list="previewSrcList"
                @downloadFile="downloadFile"
              />
            </div>
          </div>
          <ul
            v-for="(item, index) in fileGroup.false"
            :key="index"
          >
            <li class="file-title">
              <span>{{ item.fileName }}</span>
              <i
                class="el-icon-download"
                style="margin-left: 10px; cursor: pointer"
                @click.stop="downloadFile(item)"
              />
            </li>
          </ul>
        </section>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { getKnowledgeManageDetails } from '@/api/knowledge/knowledge'
import CommonImageView from '@/components/common-image-viewer/viewer'
import styles from '@/styles/variables.scss'
export default {
  filters: {
    statusFilterer(data) {
      return data === '0' ? '已上架' : '已下架'
    }
  },
  components: {
    CommonImageView
  },
  data() {
    return {
      activeColor: styles.primaryColor,
      fileGroup: {},
      previewSrcList: [],
      activeIndex: '1',
      konwledgeDetail: {}
    }
  },
  activated() {
    this.initData()
  },
  methods: {
    /**
     * 通用的打开下载对话框方法，没有测试过具体兼容性
     * @param url 下载地址，也可以是一个blob对象，必选
     * @param saveName 保存文件名，可选
     */
    openDownloadDialog(url, saveName) {
      if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url) // 创建blob地址
      }
      var aLink = document.createElement('a')
      aLink.href = url
      aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      var event
      if (window.MouseEvent) event = new MouseEvent('click')
      else {
        event = document.createEvent('MouseEvents')
        event.initMouseEvent(
          'click',
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        )
      }
      aLink.dispatchEvent(event)
    },
    downloadFile(data) {
      // const SPLIT_LIST = data.fileName.split('.')
      // let fileSuffix = SPLIT_LIST[SPLIT_LIST.length - 1]
      // console.log('file==', fileSuffix)
      // if (fileSuffix === 'txt') {
      //   var blob = new Blob([data.url], { type: 'text/txt,charset=UTF-8' })
      //   this.openDownloadDialog(blob, data.fileName)
      // }
      // const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
      // if (imglist.find((item) => item === fileSuffix)) {
      //   fileSuffix = fileSuffix || 'image/png'
      //   var url = canvasObj.toDataURL(fileSuffix, 0.92).replace(/image\/.*?;/, 'image/octet-stream;')
      //   openDownloadDialog(url, saveName)
      // }
      let sUrl = data.url
      //iOS devices do not support downloading. We have to inform user about this.
      if (/(iP)/g.test(navigator.userAgent)) {
        alert(
          'Your device does not support files downloading. Please try again in desktop browser.'
        )
        return false
      }
      //If in Chrome or Safari - download via virtual link click
      const isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1
      const isSafari = navigator.userAgent.toLowerCase().indexOf('chrsafariome') > -1
      if (isChrome || isSafari) {
        //Creating new link node.
        var link = document.createElement('a')
        link.href = sUrl
        if (link.download !== undefined) {
          //Set HTML5 download attribute. This will prevent file from opening if supported.
          var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length)
          link.download = fileName
        }
        //Dispatching click event.
        if (document.createEvent) {
          var e = document.createEvent('MouseEvents')
          e.initEvent('click', true, true)
          link.dispatchEvent(e)
          return true
        }
      }
      // Force file download (whether supported by server).
      if (sUrl.indexOf('?') === -1) {
        sUrl += '?download'
      }
      window.open(sUrl, '_self')
      return true
    },
    /**
     * 标识状态
     */
    getStatusType(status) {
      const TYPE_STATUS = {
        '0': 'success',
        '1': 'danger'
      }
      return TYPE_STATUS[status]
    },
    /**
     * 初始数据，并处理附件
     */
    initData() {
      getKnowledgeManageDetails({ id: this.$route.query.id }).then((res) => {
        this.konwledgeDetail = res
        this.fileGroup = _.groupBy(this.konwledgeDetail.attachments, (item) => {
          return this.fileTypeIsImage(item.fileName)
        })
        _.each(this.fileGroup.true, (item) => {
          this.previewSrcList.push(item.url)
        })
      })
    },
    // 判断当前格式是否为图片类型的格式
    fileTypeIsImage(fileName) {
      const lastIndex = fileName.lastIndexOf('.')
      const fileType = fileName.substr(lastIndex + 1, fileName.length)
      const imageType = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
      if (imageType.includes(fileType)) {
        return true
      } else {
        return false
      }
    },
    /**
     * 处理nav切换
     */
    handleSelect(key) {
      this.activeIndex = key
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-menu--horizontal {
  border-bottom: 1px solid #cccccc !important;
}
.details-container {
  background-color: #fff;
  .details-top {
    padding: 20px;
    border-bottom: 1px solid #e3e7e9;
    .top-title {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .title-text {
        font-size: 18px;
        font-weight: 550;
        margin-right: 10px;
      }
    }
    .details-ul {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      .details-li {
        width: 50%;
        display: flex;
        margin-bottom: 10px;
        .li-label {
          min-width: 80px;
          display: inline-block;
          color: #666666;
        }
        .li-value {
          color: #1e1e1e;
        }
      }
    }
  }
  .details-bottom {
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    .bottom-li {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 25%;
      .bottom-li-title {
        color: #666666;
        font-size: 16px;
      }
      .bottom-li-value {
        font-size: 18px;
        color: #1e1e1e;
        font-weight: 500;
        margin-top: 10px;
      }
    }
  }
}
.image-ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .image__li {
    margin-bottom: 40px;
  }
}
.file-title {
  margin-bottom: 10px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #000b15;
}
</style>
