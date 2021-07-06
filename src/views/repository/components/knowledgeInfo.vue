<template>
  <div class="knowledgeInfo">
    <template v-if="konwledgeDetail.introduction || konwledgeDetail.resUrl || fileGroup.length > 0">
      <el-row
        :gutter="20"
        style="margin-bottom:20px;"
      >
        <template v-if="konwledgeDetail.uploadType === 1">
          <el-col :span="24">
            <span class="li-label">链接地址：</span>
            <span class="li-value">{{ konwledgeDetail.resUrl }}</span>
            <span
              class="copyLink"
              @click="copyLink"
            >复制链接</span>
            <el-input
              id="copy"
              v-model="konwledgeDetail.resUrl"
              class="copy"
            />
          </el-col>
        </template>
        <template v-else>
          <el-col
            :span="24"
            class="system-right-query"
          >
            <el-checkbox
              v-model="allChecked"
              :indeterminate="indeterminate"
              :disabled="fileGroup.length < 1"
              @change="getAllChecked"
            >
              全选
            </el-checkbox>
            <div
              class="system-right-download"
              :class="{ active: chechedId.length < 1 }"
              @click="allowDownload"
            >
              <i class="el-icon-download"></i>
              <span>批量下载({{ chechedId.length }})</span>
            </div>
          </el-col>
          <el-col
            v-for="(item, idx) in fileGroup"
            :key="idx"
            :span="4"
          >
            <div class="file-item-box">
              <div class="file-fileName">
                <template v-if="item.showIcon">
                  <img
                    :src="item.showIcon"
                    alt=""
                  />
                </template>
                <template v-else>
                  <el-image
                    style="width:100%;height:100px;"
                    :src="item.url"
                    fit="cover"
                  >
                  </el-image>
                  <!-- <img
                      :src="item.url"
                      style="width:100%;min-height:48px;"
                    /> -->
                </template>
                <el-tooltip
                  :content="item.fileName"
                  placement="bottom"
                >
                  <p class="file-item-name">
                    {{ item.fileName }}
                  </p>
                </el-tooltip>
              </div>
              <div
                class="system-list-mask"
                :class="{ showMask: item.isCheck }"
              >
                <div class="system-list-mask-box">
                  <el-checkbox
                    v-model="item.isCheck"
                    class="system-list-checked"
                    @change="changeChecked($event, item)"
                  ></el-checkbox>
                  <div
                    class="mask-item"
                    @click="changeView(item)"
                  >
                    <i class="el-icon-view"></i>
                    <span>预览</span>
                  </div>
                  <div
                    class="mask-item"
                    @click="changeDownload(item)"
                  >
                    <i class="el-icon-download"></i>
                    <span>下载</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </template>
      </el-row>
      <div v-html="_.unescape(konwledgeDetail.introduction)"></div>
    </template>
    <template v-else>
      <div style="text-align:center;">
        <img
          src="../../../assets/images/nodata.png"
          alt=""
        />
        <div style="color:#718199;">
          暂无数据
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { downLoadFile, getReviewUrl } from '@/util/util'
const myIcon = {
  ppt: require('../../../assets/images/icon_ppt.svg'),
  doc: require('../../../assets/images/icon_doc.svg'),
  pdf: require('../../../assets/images/icon_pdf.svg'),
  other: require('../../../assets/images/icon_other.svg'),
  ad: require('../../../assets/images/icon_ad.svg'),
  xls: require('../../../assets/images/icon_xls.svg'),
  zip: require('../../../assets/images/icon_zip.svg'),
  vi: require('../../../assets/images/icon_vi.svg')
}
export default {
  name: 'KnowledgeInfo',
  props: {
    konwledgeDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      fileGroup: [],
      chechedId: [],
      indeterminate: false,
      allChecked: false //所有
    }
  },
  mounted() {
    this.fileGroup = this.konwledgeDetail.attachments || []
    this.fileGroup.forEach((val) => {
      val.isCheck = false
      val.showIcon = this.fileTypeIsImage(val.fileName)
    })
  },
  methods: {
    async changeView(row) {
      let url = row.url
      let onlineViewType = ['doc', 'docx', 'xls', 'xlsx', 'xlsm', 'ppt', 'pptx']
      let allZip = ['zip', 'rar']
      let fileTypeName = url.substring(url.lastIndexOf('.') + 1, url.length).split('?')[0]
      if (allZip.includes(fileTypeName.toLowerCase())) {
        this.$message.error('此文件类型无法预览，推荐下载之后打开')
        return
      }
      let isWord = onlineViewType.find((type) => type === fileTypeName.toLowerCase())
      if (isWord) {
        // url = 'http://view.officeapps.live.com/op/view.aspx?src=' + url
        let { data } = await getReviewUrl({
          convertType: 0,
          fileUrl: url
        })
        url = data.data.viewUrl
      }
      window.open(url, '_blank')
    },
    changeDownload(item) {
      downLoadFile(item)
    },
    fileTypeIsImage(fileName) {
      const lastIndex = fileName.lastIndexOf('.')
      const fileType = fileName.substr(lastIndex + 1, fileName.length).toLowerCase()
      const docType = ['doc', 'docx']
      const execlType = ['xls', 'xlsx', 'xlsm']
      const pdfType = ['pdf']
      const pptType = ['ppt', 'pptx']
      const wpsType = ['wps', 'rtf']
      const zipType = ['rar', 'zip']
      const adType = ['mp3', 'wma', 'wav']
      const viType = ['avi', 'wmv', 'mp4', '3gp', 'rm', 'rmvb', 'mov']
      if (docType.includes(fileType)) {
        //文档
        return myIcon['doc']
      } else if (execlType.includes(fileType)) {
        return myIcon['xls']
      } else if (pdfType.includes(fileType)) {
        return myIcon['pdf']
      } else if (pptType.includes(fileType)) {
        return myIcon['ppt']
      } else if (wpsType.includes(fileType)) {
        return myIcon['other']
      } else if (zipType.includes(fileType)) {
        return myIcon['zip']
      } else if (adType.includes(fileType)) {
        return myIcon['ad']
      } else if (viType.includes(fileType)) {
        return myIcon['vi']
      }
      return ''
    },
    //复制
    copyLink() {
      const content = document.getElementById('copy')
      content.select()
      document.execCommand('Copy')
      this.$message.success('复制链接成功')
    },
    // 单选
    changeChecked(checked, row) {
      if (checked) {
        this.chechedId.push(row)
      } else {
        this.chechedId = this.chechedId.filter((val) => val.id != row.id)
      }
      this.checkedIcon()
    },
    //全选icon的变化
    checkedIcon() {
      const no = this.fileGroup.every((val) => {
        //全部没选
        return val.isCheck == false
      })
      const all = this.fileGroup.every((val) => {
        //全选
        return val.isCheck == true
      })
      if (!no && all) {
        this.allChecked = true
      }
      if (no && !all) {
        this.allChecked = false
      }
      if (!no && !all) {
        this.indeterminate = true
        this.allChecked = false
      } else {
        this.indeterminate = false
      }
    },
    //全选
    getAllChecked() {
      const myChechedId = this.chechedId.map((val) => val.id)
      this.fileGroup.forEach((val) => {
        val.isCheck = this.allChecked
        if (this.allChecked) {
          if (myChechedId.indexOf(val.id) < 0) {
            this.chechedId.push(val)
          }
        }
      })
      this.indeterminate = false
      if (!this.allChecked) {
        const trainId = this.fileGroup.map((val) => val.id)
        this.chechedId = this.chechedId.filter((item) => trainId.indexOf(item.id) < 0)
      }
    },
    //批量下载
    allowDownload() {
      if (this.chechedId.length > 0) {
        const imgUrl = this.chechedId.every((val) => {
          return val.url.indexOf('http') > -1 || val.url.indexOf('https') > -1
        })
        if (!imgUrl) {
          this.$message.error('文件地址不正确')
          return
        }
        this.chechedId.map((item) => {
          downLoadFile(item)
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.knowledgeInfo {
  margin-top: 8px;
}
.file-item-box {
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  .file-fileName {
    width: 126px;
    border-radius: 4px;
    text-align: center;
    overflow: hidden;
  }
  .file-item-name {
    margin: 8px 0 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    z-index: 80;
  }
}
.system-right-query {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  .system-right-download {
    margin-left: 20px;
    cursor: pointer;
    .el-icon-download {
      margin-right: 4px;
    }
  }
  .active {
    cursor: not-allowed;
    color: #eee;
  }
}

.file-item-box:hover .system-list-mask {
  display: flex;
}
.showMask {
  display: flex !important;
}
.system-list-mask {
  border-radius: 4px;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.45);
  display: none;
  align-items: center;
  justify-content: center;
  .system-list-mask-box {
    display: flex;
    align-items: center;
    color: #fff;
  }
  .system-list-checked {
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .mask-item {
    text-align: center;
    cursor: pointer;
  }
  .mask-item + .mask-item {
    margin-left: 24px;
  }
  i {
    display: block;
    font-size: 18px;
    margin-bottom: 4px;
  }
}

.li-label {
  min-width: 80px;
  display: inline-block;
  color: rgba(0, 11, 21, 0.45);
}
.li-value {
  color: #1e1e1e;
}
.copy {
  position: absolute;
  z-index: -100;
  opacity: 0;
}
.copyLink {
  display: inline-block;
  margin-left: 16px;
  color: #01aafc;
  cursor: pointer;
  user-select: none;
}
</style>
