<template>
  <div class="course-learn">
    <div class="course-learn_header">
      <page-header title="查看章节内容" show-back :back="goBack" />
    </div>

    <div class="course-learn__main">
      <div :class="['left-bar', { hidden: leftHidden }]">
        <div class="left-bar__main">
          <div class="chapters">
            <ul>
              <li
                v-for="(chapter, index) in chapters"
                :key="index"
                :class="{ 'is-active': isActive(chapter) }"
                @click="handleChapterClick(chapter)"
              >
                <div class="chapters__wrap">
                  <span
                    class="chapters__tag"
                    :style="{
                      color: _.get(COURSE_CHAPTER_TYPE_MAP, `${chapter.type}.color`, ''),
                      'border-color': _.get(COURSE_CHAPTER_TYPE_MAP, `${chapter.type}.color`, '')
                    }"
                    >{{ _.get(COURSE_CHAPTER_TYPE_MAP, `${chapter.type}.text`, '') }}</span
                  >
                  <span class="chapters__title">{{ chapter.name }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        ref="content"
        :class="['main-content', { fullwidth: leftHidden }]"
        :style="`${currentChapter.type == '5' ? 'overflow:hidden;' : ''}`"
      >
        <div class="collapse-btn" @click="collapseLeft()">
          <i v-if="!leftHidden" class="el-icon-d-arrow-left"></i>
          <i v-else class="el-icon-d-arrow-right"></i>
        </div>
        <!-- 文章类型 -->
        <div
          v-if="currentChapter.type == '1'"
          class="content--richtext"
          v-html="_.unescape(currentChapter.content)"
        ></div>
        <!-- 课件 -->
        <div v-if="currentChapter.type == '2'" class="content--iframe">
          <video
            v-if="isVideo"
            ref="video"
            preload
            controls
            :src="currentChapter.content"
            :height="contentHeight"
            :width="contentWidth"
          ></video>
          <iframe
            :src="getContentUrl(currentChapter)"
            width="100%"
            height="100%"
            frameborder="0"
          ></iframe>
        </div>
        <!--资料-->
        <div v-if="currentChapter.type == '3'" class="content--download">
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
        <!--考试-->
        <div v-if="currentChapter.type == '4'" class="content--test">
          <el-button type="primary" size="medium"> 前往考试 </el-button>
        </div>
        <!--视频-->
        <div v-if="currentChapter.type == '5'">
          <video
            ref="video"
            preload
            controls
            :src="currentChapter.content"
            :height="contentHeight"
            :width="contentWidth"
          ></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getCourseDetail,
  getLearnRecord,
  getNotesList,
  addNote,
  updateLearnRecord
} from '@/api/approvalCenter/course'
import { COURSE_CHAPTER_TYPE_MAP } from './config'
const axios = require('axios/index')

export default {
  name: 'CourseLearn',
  data() {
    return {
      timer: null,
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      activeIndex: '1',
      submitting: false,
      course: {},
      chapters: [],
      currentChapter: {},
      notes: [],
      note: '',
      leftHidden: false
    }
  },
  computed: {
    courseId() {
      return this.$route.query.courseId
    },
    chapterId() {
      return this.$route.query.chapterId
    },
    contentWidth() {
      return this.$refs.content.offsetWidth
    },
    contentHeight() {
      return this.$refs.content.offsetHeight
    },
    isVideo() {
      const regx = /^.*\.(avi|wmv|mp4|3gp|rm|rmvb|mov)$/
      return regx.test(this.currentChapter.content)
    },
    COURSE_CHAPTER_TYPE_MAP: () => COURSE_CHAPTER_TYPE_MAP,
    ...mapGetters(['userInfo'])
  },
  watch: {
    currentChapter(newVal, oldVal) {
      if (this.isChapterVideo(oldVal) && oldVal.duration) {
        this.updateVideoProgress(oldVal)
      } else {
        oldVal.progress = 100
      }
      this.submitLearnRecords()
    }
  },
  activated() {
    this.reset()
    this.loadCourseDetail()
    this.loadChapters()
    this.loadNoteList()
    this.setTimer()
  },
  beforeRouteLeave(from, to, next) {
    this.updateVideoProgress(this.currentChapter)
    this.submitLearnRecords()
    clearInterval(this.timer)
    next()
  },
  methods: {
    /**
     * 更新视频播放进度
     */
    updateVideoProgress(chapter) {
      if (!this.isChapterVideo(chapter) || !chapter.duration) {
        return
      }
      let progress = Number(((this.$refs.video.currentTime / chapter.duration) * 100).toFixed())
      chapter.progress = progress > chapter.progress ? progress : chapter.progress
    },
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
    getContentUrl(chapter) {
      const office = /.*\.(doc|xls|xlsx|ppt|pptx)$/
      if (office.test(chapter.content)) {
        return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURI(chapter.content)}`
      }
      return chapter.content
    },
    setTimer() {
      this.timer = setInterval(() => {
        this.submitLearnRecords()
      }, 5 * 60 * 1000)
    },
    reset() {
      this.leftHidden = false
      this.activeIndex = '1'
    },
    collapseLeft() {
      this.leftHidden = !this.leftHidden
    },
    handleMenuChange(index) {
      this.activeIndex = index
    },
    isActive(chapter) {
      return this.currentChapter.contentId === chapter.contentId
    },
    isChapterVideo(chapter) {
      const regx = /^.*\.(avi|wmv|mp4|3gp|rm|rmvb|mov)$/
      return regx.test(chapter.content)
    },
    handleChapterClick(chapter) {
      this.currentChapter = chapter
    },
    calcProcess(chapter) {
      if (!this.isChapterVideo(chapter)) {
        if (chapter.progress == 1) {
          return 100
        } else {
          return 0
        }
      } else {
        return parseInt(chapter.progress)
      }
    },
    getChapterStatus(chapter) {
      if (this.isActive(chapter)) {
        return '正在学'
      }
      if (!this.isChapterVideo(chapter)) {
        if (chapter.progress == 100) {
          return '已学习'
        } else {
          return '未学习'
        }
      } else {
        if (chapter.progress == '0') {
          return '未学习'
        } else if (chapter.progress == 100) {
          return '已学习'
        } else {
          return '学习中'
        }
      }
    },
    loadCourseDetail() {
      if (!this.courseId) {
        return
      }
      getCourseDetail({ courseId: this.courseId }).then((res) => {
        this.course = res
      })
    },
    submitLearnRecords() {
      let params = { period: 5, courseId: this.courseId }
      params.contentRecords = _.map(
        this.chapters,
        (chapter) => `${chapter.contentId}:${chapter.progress}`
      ).join(',')
      if (!params.contentRecords) {
        return
      }
      updateLearnRecord(params).then().catch()
    },
    loadChapters() {
      if (!this.courseId) {
        return
      }
      getLearnRecord({ courseId: this.courseId }).then((res) => {
        this.chapters = _.sortBy(res, 'sort')
        _.forEach(this.chapters, (chapter) => {
          if (this.isChapterVideo(chapter)) {
            // chapter.content =
            //   'https://oa-file-dev.bestgrand.com.cn/b8a6256a5a31464fa28a3ae46992e850.mp4'
            this.setDuration(chapter).catch()
          }
          // if (chapter.type == '2') {
          // chapter.content = 'http://ieee802.org:80/secmail/docIZSEwEqHFr.doc'
          // chapter.content =
          //   'https://oa-file-dev.bestgrand.com.cn/7f6c5943b4d14733b61f7efaa7b4ec30.txt'
          // }
          if (chapter.contentId == this.chapterId) {
            this.currentChapter = chapter
          }
        })
      })
    },
    // 请求七牛云获取视频时长(单位秒)
    setDuration(chapter) {
      return new Promise((resolve, reject) => {
        axios
          .get(chapter.content + '?avinfo')
          .then((res) => {
            const duration = _.get(res, 'data.format.duration', null)
            chapter.duration = parseInt(duration)
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    loadNoteList() {
      if (!this.courseId) {
        return
      }
      getNotesList({ courseId: this.courseId }).then((res) => {
        this.notes = res
      })
    },
    submitNote() {
      if (!this.note) {
        return
      }
      this.submitting = true
      addNote({ courseId: this.courseId, remark: this.note })
        .then(() => {
          this.note = ''
          this.loadNoteList()
        })
        .finally(() => {
          this.submitting = false
        })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.course-learn {
  // 主颜色
  $primaryColor: #01aafc;

  // 标准文字颜色
  $primaryFontColor: #000b15;

  // 主背景灰色
  $mainBackGray: #fafafa;

  // 标准线条色
  $mainLineGray: #ebeced;

  // 顶部栏高度
  $headerHeight: 64px;

  &__header {
    height: 57px;
    line-height: 57px;
    ul {
      display: flex;
      li {
        margin-right: 5px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
      }
      .text_color {
        color: rgba(0, 11, 21, 0.85);
      }
    }
  }
  &__main {
    height: calc(100vh - #{$headerHeight} - 40px);
    .left-bar {
      width: 384px;
      margin-right: 4px;
      display: inline-block;
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
      border-radius: 4px 0 0 4px;
      background: #ffffff;
      height: 100%;
      overflow: hidden;
      transition: width 0.3s;
      &.hidden {
        width: 0;
        margin-right: 0;
        border: none;
      }
      /deep/ .el-menu {
        display: flex;
        justify-content: center;
      }
      /deep/ .el-menu-item {
        padding: 0;
        margin: 0 20px;
        color: $primaryFontColor;
      }
      /deep/ .el-menu--horizontal > .el-menu-item.is-active {
        color: $primaryColor;
      }
      /deep/ .el-menu.el-menu--horizontal {
        border-bottom: 1px solid $mainLineGray;
      }
      &__main {
        height: calc(100% - 61px);
        width: 384px;
      }

      .chapters {
        height: 100%;
        ul {
          height: 100%;
          overflow: auto;
        }
        li {
          display: flex;
          height: 44px;
          align-items: center;
          padding-left: 24px;
          padding-right: 21px;
          justify-content: space-between;
          cursor: pointer;
          border-bottom: 1px solid $mainLineGray;
          &:hover {
            background-color: rgba($primaryFontColor, 0.02);
          }
          &.is-active {
            color: $primaryColor;
            background-color: rgba($primaryColor, 0.05);
            .chapters__status {
              color: $primaryColor;
            }
          }
        }
        &__tag {
          font-size: 12px;
          letter-spacing: 0;
          border-radius: 4px;
          padding: 0 4px;
          color: $primaryFontColor;
          border: 1px solid $primaryFontColor;
          margin-right: 8px;
        }
        &__status {
          font-size: 12px;
          color: rgba($primaryFontColor, 0.45);
          margin-left: 8px;
        }
        &__handler {
          display: flex;
          align-items: center;
          i {
            font-size: 16px;
            color: $primaryColor;
          }
        }
      }
      &__notes {
        padding: 24px;
        height: 100%;
        .el-button {
          margin-top: 13px;
          float: right;
        }
        .notes-list {
          overflow: auto;
          clear: both;
          padding-top: 20px;
          max-height: calc(100% - 164px);
        }
        .note {
          margin-bottom: 24px;
          &__top {
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          &__user {
            display: flex;
            align-items: center;
          }
          &__username {
            margin-left: 8px;
          }
        }
      }
    }
    .main-content {
      display: inline-block;
      width: calc(100% - 388px);
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
      // border-radius: 0 4px 4px 0;
      background: #ffffff;
      height: 100%;
      overflow: auto;
      position: relative;
      transition: width 0.3s;
      &.fullwidth {
        width: 100%;
      }
      .collapse-btn {
        z-index: 10;
        cursor: pointer;
        position: absolute;
        height: 48px;
        width: 24px;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        text-align: center;
        background-color: rgba($primaryFontColor, 0.3);
        border-radius: 0 4px 4px 0;
        i {
          font-size: 14px;
          line-height: 48px;
          color: #fff;
        }
      }
      .content {
        &--richtext {
          padding: 40px;
        }
        &--test {
          margin: 40px;
        }
        &--download {
          display: flex;
          margin: 40px;
          .img-wr {
            margin-right: 24px;
          }
          .file-name {
            color: $primaryFontColor;
            font-size: 18px;
            margin-bottom: 24px;
          }
        }
        &--iframe {
          height: 100%;
        }
      }
    }
  }
}
</style>
