<template>
  <div>
    <div class="details_course_detailed">
      <div class="details_course_detailed_top">
        <div class="details_course_detailed_img">
          <img
            :src="courseData.url"
            alt=""
          />
        </div>

        <div class="details_course_detailed_r">
          <div class="details_course_detailed_r_title">
            {{ courseData.name }}
          </div>
          <ul>
            <li>
              <span class="text">讲师：</span> <span> {{ courseData.teacherName }} </span>
            </li>
            <li>
              <span class="text">所在分类：</span>
              <span> {{ courseData.catalogName }} </span>
            </li>
            <li>
              <span class="text">课程类型：</span>
              <span>
                <span v-show="courseData.type == 1">在线课程</span>
                <span v-show="courseData.type == 2">面授课程</span>
                <span v-show="courseData.type == 3">直播课程</span>
              </span>
            </li>
            <li>
              <span class="text">学时（小时）：</span>
              <span> {{ courseData.period }} </span>
            </li>
            <li>
              <span class="text">积分：</span> <span> {{ courseData.credit }} </span>
            </li>
            <li>
              <span class="text">通过条件：</span>
              <span
                v-for="(item, index) in courseData.passCondition"
                :key="index"
              >
                <span v-show="item == 'a'">教师评定 </span>
                <span
                  v-show="item == 'b'"
                >考试通过 {{ courseData.passCondition.split(',').length >= 3 ? ',' : '' }}</span>
                <span
                  v-show="item == 'c'"
                >达到课程学时
                  {{ courseData.passCondition.split(',').length >= 2 ? ',' : '' }}
                </span>
              </span>
            </li>
            <li>
              <span class="text">选修类型：</span>
              <span>
                <span v-show="courseData.electiveType == 1">开放选修</span>
                <span v-show="courseData.electiveType == 2">通过审批</span>
                <span v-show="courseData.electiveType == 3">禁止选修</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="details_course_detailed_bar">
        <span
          :class="{ pitch: pitch == 1 }"
          @click="setPitch(1)"
        >详细信息</span>
        <span
          :class="{ pitch: pitch == 2 }"
          @click="setPitch(2)"
        >课程内容</span>
      </div>
      <div
        v-show="pitch == 1"
        class="details_course_detailed_pitch1"
      >
        <div class="title">
          <i></i>
          <span>课程介绍</span>
        </div>
        <div class="content">
          <div v-html="courseData.introduction"></div>
        </div>
        <!-- <div class="title">
                <i></i>
                <span>课前思考</span>
              </div> -->
        <div class="content">
          <div v-html="courseData.thinkContent"></div>
        </div>
      </div>
      <div
        v-show="pitch == 2"
        class="details_course_detailed_pitch2"
      >
        <ul>
          <li
            v-for="(item, index) in courseData.contents"
            :key="index"
            @click="jumpToLearn(item)"
          >
            <div
              class="tooltip_"
              style="display:flex;"
            >
              <i>{{ index + 1 }}</i>
              <span style="flex:1;">
                <text-over-tooltip
                  ref-name="testName1"
                  class-name="fs20"
                  :content="item.name"
                ></text-over-tooltip>
              </span>
            </div>
            <!-- <div class="btn">查看内容</div> -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import TextOverTooltip from '../course/components/TextOverTooltip'
import { getCourseDetail } from '@/api/approvalCenter/course'
export default {
  name: 'CourseDetail',
  components: {
    TextOverTooltip
  },
  props: {
    applyDetail: {
      type: Object
    }
  },
  data() {
    return {
      // 课程详情
      courseData: {},
      pitch: 1
    }
  },
  watch: {
    applyDetail() {
      this.getCourseData()
    }
  },
  mounted() {
    // 获取课程详情
    this.$nextTick(() => {
      if (this.applyDetail.formId) {
        this.getCourseData()
      }
    })
  },
  methods: {
    // 获取课程信息
    async getCourseData() {
      let res = await getCourseDetail({ courseId: this.applyDetail.formId })
      res.introduction = _.unescape(res.introduction)
      res.thinkContent = _.unescape(res.thinkContent)
      this.courseData = res
    },
    setPitch(i) {
      this.pitch = i
    }
  }
}
</script>
<style scoped lang="scss">
.details_course {
  &_detailed {
    margin-top: 24px;
    padding: 0 24px 24px;
    background-color: #fff;
    &_top {
      display: flex;
    }
    &_img {
      width: 320px;
      height: 180px;
      border-radius: 4px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &_r {
      flex: 1;
      margin-left: 40px;
      &_title {
        font-size: 18px;
        color: #000b15;
        letter-spacing: 0;
      }
      ul {
        li {
          width: 50%;
          float: left;
          margin-top: 16px;
          opacity: 0.85;
          font-size: 14px;
          color: #000b15;
          letter-spacing: 0;
          .text {
            opacity: 0.45;
          }
        }
      }
    }
    &_bar {
      margin-top: 40px;
      height: 56px;
      line-height: 56px;
      font-size: 16px;
      color: rgba(0, 11, 21, 0.65);
      letter-spacing: 0;
      display: flex;
      border-bottom: 1px solid #ebeced;
      .pitch {
        color: #01aafc;
        border-bottom: 1px solid #01aafc;
      }
      span {
        margin-right: 40px;
        cursor: pointer;
      }
    }
    &_pitch1 {
      .title {
        margin-top: 24px;
        display: flex;
        i {
          display: inline-block;
          background: #01aafc;
          width: 4px;
          height: 16px;
          margin-right: 8px;
        }
        span {
          opacity: 0.85;
          font-size: 14px;
          color: #000b15;
          margin-top: -2px;
        }
      }
      .content {
        margin-top: 16px;
      }
    }
    &_pitch2 {
      ul {
        margin-top: 24px;
        li {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #ebeced;
          height: 48px;
          line-height: 48px;
          opacity: 0.85;
          font-size: 14px;
          color: #000b15;
          letter-spacing: 0;
          i {
            font-style: normal;
            margin-left: 24px;
          }
          span {
            margin-left: 27px;
          }
          .btn {
            opacity: 0.85;
            font-size: 14px;
            color: #01aafc;
            letter-spacing: 0;
            margin-right: 24px;
            cursor: pointer;
            display: none;
          }

          &:hover {
            background-color: #f0fafe;
            .btn {
              display: block;
            }
          }
        }
      }
    }
  }
}
</style>
