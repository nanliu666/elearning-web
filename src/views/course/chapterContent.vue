<template>
  <div class="content">
    <page-header title="查看章节内容" show-back />
    <el-container>
      <el-aside width="290px">
        <div
          v-for="(item, index) in courseContent"
          :key="index"
          class="aside"
          :class="{ active: active === item.contentId }"
          @click="activeContent(item.contentId)"
        >
          <span style="width: 20px">{{ index + 1 }}</span>

          <el-tooltip
            class="item"
            :disabled="item.name.length < 12"
            effect="dark"
            :content="item.name"
            placement="top"
          >
            <span class="class-name">{{ `【${type[item.type - 1]}】` + item.name }}</span>
          </el-tooltip>
        </div>
      </el-aside>
      <el-main>
        <div v-if="currentChapter" class="content">
          <!-- 文章类型 -->
          <div
            v-if="currentChapter.type == '1'"
            class="chapter-article"
            v-html="
              `<h2>${_.unescape(currentChapter.localName)}</h2>${_.unescape(
                _.unescape(currentChapter.content)
              )}`
            "
          ></div>
          <!-- 文档-->
          <div v-if="currentChapter.type === '2'" class="chapter-file">
            <video
              v-if="video.test(currentChapter.localName.toLowerCase())"
              ref="videoRef"
              controlslist="nodownload"
              autoplay
              preload
              controls
              :src="currentChapter.content"
              style="width: 100%"
            ></video>
            <img
              v-else-if="image.test(currentChapter.localName.toLowerCase())"
              ref="currentImg"
              :src="previewImg"
              style="display: block; margin: 0 auto"
            />
            <iframe
              v-else-if="word.test(currentChapter.localName.toLowerCase())"
              :src="previewSrc"
              width="100%"
              height="100%"
              frameborder="0"
            ></iframe>
          </div>
          <!--资料下载-->
          <div v-if="currentChapter.type == '3'" class="content-download">
            <div class="img-wr">
              <img :src="getFileImageUrl(currentChapter.content)" />
            </div>
            <div class="download-wr">
              <div class="file-name">
                {{ currentChapter.localName.toLowerCase() }}
              </div>
              <a target="_blank" :href="currentChapter.content">
                <el-button type="primary" size="medium">立即下载</el-button>
              </a>
            </div>
          </div>
          <!--作业-->
          <div v-if="currentChapter.type == '4'" class="content--test">
            <video
              v-if="video.test(currentChapter.localName.toLowerCase())"
              ref="videoRef"
              controlslist="nodownload"
              autoplay
              preload
              controls
              :src="currentChapter.content"
              style="width: 100%"
            ></video>
            <img
              v-else-if="image.test(currentChapter.localName.toLowerCase())"
              ref="currentImg"
              :src="previewImg"
              style="display: block; margin: 0 auto"
            />
            <iframe
              v-else-if="word.test(currentChapter.localName.toLowerCase())"
              :src="previewSrc"
              width="100%"
              height="100%"
              frameborder="0"
            ></iframe>
            <div v-else class=".content-download">
              <div class="img-wr">
                <img :src="getFileImageUrl(currentChapter.content)" />
              </div>
              <div class="download-wr">
                <div class="file-name">
                  {{ currentChapter.localName }}
                </div>
                <a target="_blank" :href="currentChapter.content">
                  <el-button type="primary" size="medium">立即下载</el-button>
                </a>
              </div>
            </div>
          </div>

          <!-- 视频 -->
          <div v-if="currentChapter.type == '5'" class="content--richtext">
            <video
              ref="videoRef"
              controlslist="nodownload"
              autoplay
              preload
              controls
              :src="currentChapter.content"
              style="width: 100%"
            ></video>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getReviewUrl } from '@/util/util'
import { getCourseRecord } from '@/api/course/course'
import { fileType } from '@/util/util'
export default {
  data() {
    return {
      type: ['文章', '文档', '资料下载', '作业', '视频'],
      courseContent: [],
      active: null,
      word: /\.(ppt|pptx|doc|docx|xlsx|xls|txt|pdf|wps|rtf)$/, // 文档格式
      video: /\.(avi|wmv|mp4|3gp|rm|rmvb|mov)$/, // 视频格式
      image: /\.(jpg|jpeg|png|gif|bmp)$/, // 图片
      compress: /\.(rar|zip)$/, // 压缩包
      audio: /\.(mp3|wma|wav)$/, // 音频
      currentChapter: null,
      previewSrc: '',
      previewImg: ''
    }
  },
  computed: {},
  async created() {
    this.courseContent = await this.getCourseContent()
    this.activeContent(this.$route.query.index)
  },
  methods: {
    getCourseContent() {
      return getCourseRecord({ courseId: this.$route.query.id })
    },
    activeContent(id) {
      if (this.active === id) return
      this.active = id
      const index = this.courseContent.findIndex((item) => item.contentId === id)
      if (index === -1) return this.$message.error('文件丢失,请联系管理员')
      this.previewSrc = ''
      this.currentChapter = this.courseContent[index]
      const fileName = this.currentChapter.localName.toLowerCase()
      if (this.word.test(fileName) || this.image.test(fileName)) this.preview(this.currentChapter)
    },
    // 下载资料
    getFileImageUrl(url = '') {
      const fileDict = {
        doc: 'word',
        rar: 'rar',
        zip: 'rar',
        xls: 'excel',
        xlsx: 'excel',
        ppt: 'ppt',
        pdf: 'PDF'
      }
      let ext = url.match(/\..+/)[0]
      return `/img/file/image_icon_${fileDict[ext] || 'other'}.png`
    },
    async preview(file) {
      console.log(file.localName)
      // 预览
      const name = file.localName.toLowerCase()
      let type = null
      const { flag } = fileType(name)
      if (/pdf$/.test(name)) {
        type = 20
      } else if (flag === 1) {
        type = 0
      } else if (flag === 2) {
        return (this.previewImg = file.content)
      } else {
        this.$message.warning('此文件类型无法预览，推荐下载之后打开')
        return
      }

      const { data } = await getReviewUrl({
        isDownloa: 0,
        isShowTitle: 0,
        isPrint: 0,
        isCopy: 1,
        htmlName: file.localName,
        convertType: type,
        fileUrl: file.content
      })
      this.previewSrc = data.data.viewUrl
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-aside {
  background-color: #e9e9e9;
  color: #333;
  line-height: 30px;
  padding-top: 20px;
  height: 77vh;
}
.aside {
  cursor: pointer;
  padding-left: 20px;
  display: flex;
  height: 40px;
  span {
    flex-shrink: 0;
  }
  .class-name {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: 5px;
  }
}
.active {
  background-color: #fff;
  color: #207efa;
}
.content,
.content--test {
  height: 77vh;
  width: 100%;
}
.chapter-article {
  padding: 50px;
}
.chapter-file {
  width: 100%;
  height: 100%;
}
.content-download {
  display: flex;
  margin: 40px;
  .img-wr {
    margin-right: 24px;
    img {
      margin: 0 auto;
    }
  }
  .file-name {
    font-size: 18px;
    margin-bottom: 24px;
  }
}
</style>
