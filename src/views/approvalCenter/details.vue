<template>
  <div class="details">
    <div class="details_header">
      <page-header
        title="课程审核详情"
        show-back
        :back="goBack"
      />
    </div>

    <div class="details_top_bar">
      <div class="details_top_bar_title">
        黄浩的课程审批
      </div>
      <ul>
        <li>
          <div class="details_top_li_text">
            审批编号：
          </div>
          <span>20200916000012</span>
        </li>
        <li>
          <div class="details_top_li_text">
            申请人：
          </div>
          <span>黄浩</span>
        </li>
        <li>
          <div class="details_top_li_text">
            申请时间：
          </div>
          <span>2020-04-26 14:00:00</span>
        </li>
        <li>
          <div class="details_top_bar_bottom">
            <div class="details_top_bar_bottom_title">
              状态：
            </div>
            <span class="details_top_bar_bottom_text">审批中</span>
            <span class="details_top_bar_bottom_text">已通过</span>
            <span class="details_top_bar_bottom_text">已拒绝</span>
            <span class="details_top_bar_bottom_text">已撤回</span>
          </div>
        </li>
      </ul>
    </div>

    <div class="details_course">
      <div class="details_course_title">
        <div class="details_course_title_l">
          课程详情
        </div>
        <div
          class="details_course_title_r"
          @click="showDetailed = !showDetailed"
        >
          <div v-show="!showDetailed">
            <span>展开</span> <i class="el-icon-arrow-down"></i>
          </div>
          <div v-show="showDetailed">
            <span>收起</span> <i class="el-icon-arrow-up"></i>
          </div>
        </div>
      </div>

      <div
        v-show="showDetailed"
        class="details_course_detailed"
      >
        <div class="details_course_detailed_top">
          <div class="details_course_detailed_img">
            img
          </div>

          <div class="details_course_detailed_r">
            <div class="details_course_detailed_r_title">
              Java函数式编程
            </div>
            <ul>
              <li><span class="text">讲师：</span> <span> 李文 </span></li>
              <li><span class="text">所在分类：</span> <span> 李文 </span></li>
              <li><span class="text">课程类型：</span> <span> 李文 </span></li>
              <li><span class="text">学时（小时）：</span> <span> 李文 </span></li>
              <li><span class="text">学分：</span> <span> 李文 </span></li>
              <li><span class="text">通过条件：</span> <span> 李文 </span></li>
              <li><span class="text">选修类型：</span> <span> 李文 </span></li>
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
            content\content\content\content\contentcontentcontent
          </div>
          <div class="title">
            <i></i>
            <span>课前思考</span>
          </div>
          <div class="content">
            content\content\content\content\contentcontentcontent
          </div>
        </div>
        <div
          v-show="pitch == 2"
          class="details_course_detailed_pitch2"
        >
          <ul>
            <li>
              <div><i>1</i> <span>【课件】社区的分类与定位</span></div>
              <div class="btn">
                查看内容
              </div>
            </li>
            <li>
              <div><i>1</i> <span>【课件】社区的分类与定位</span></div>
              <div class="btn">
                查看内容
              </div>
            </li>
            <li>
              <div><i>1</i> <span>【课件】社区的分类与定位</span></div>
              <div class="btn">
                查看内容
              </div>
            </li>
            <li>
              <div><i>1</i> <span>【课件】社区的分类与定位</span></div>
              <div class="btn">
                查看内容
              </div>
            </li>
            <li>
              <div><i>1</i> <span>【课件】社区的分类与定位</span></div>
              <div class="btn">
                查看内容
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="details_process">
      <div class="details_process_box">
        <div class="details_process_box_title">
          审批记录
        </div>

        <div class="details_process_box_steps">
          <el-steps
            style="height: 300px;"
            direction="vertical"
            :active="2"
          >
            <el-step
              v-for="(item, index) in 3"
              :key="index"
              icon="iconiconfontdian1 iconfont"
            >
              <template slot="title">
                <div class="title">
                  <span>这是一个寂寞的天</span> <i>1人审批</i>
                </div>
              </template>

              <template slot="description">
                <div class="course">
                  <div class="img_box"></div>

                  <div class="name_box">
                    <div>
                      <span class="name">下着有些骚气的雨</span>
                      <span class="time"> 职位 </span>
                      <span class="time">2020-04-26 14:00:00</span>
                      <i></i>
                    </div>
                    <div>
                      <span class="launch">发起审批</span>
                      <span class="conduct">审批中</span>
                    </div>
                  </div>
                </div>
              </template>
            </el-step>
          </el-steps>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pitch: 1,
      showDetailed: false,
      textarea: ''
    }
  },
  methods: {
    setPitch(i) {
      this.pitch = i
    },
    goBack() {
      this.$router.back(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.details {
  &_top_bar {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    height: 156px;
    padding: 24px;
    &_title {
      font-size: 18px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
      line-height: 28px;
      font-weight: bold;
    }
    ul {
      display: flex;
      margin-top: 18px;
      li {
        width: 33.3%;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
        border-left: 1px solid #ebeced;
        padding-left: 24px;
        .details_top_li_text {
          margin-bottom: 8px;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.45);
          letter-spacing: 0;
        }
      }
    }
    &_bottom {
      &_title {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        letter-spacing: 0;
        margin-bottom: 8px;
      }
      &_text {
        opacity: 0.85;
        font-size: 14px;
        color: #01aafc;
        margin-right: 10px;
      }
    }
  }
  &_course {
    margin-top: 20px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    &_title {
      display: flex;
      justify-content: space-between;
      padding: 24px;
      &_l {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
        line-height: 22px;
      }
      &_r {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        letter-spacing: 0;
        line-height: 22px;
        cursor: pointer;
        span {
          margin-right: 8px;
        }
      }
    }
    &_detailed {
      padding: 0 24px 24px;
      &_top {
        display: flex;
      }
      &_img {
        width: 320px;
        height: 180px;
        border-radius: 4px;
        background-color: #1e8cff;
        overflow: hidden;
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
  &_process {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    margin-top: 20px;
    padding: 24px;
    &_box {
      height: 400px;
      &_title {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
      }
      &_steps {
        padding: 16px;
        .title {
          span {
            font-size: 14px;
            color: rgba(0, 11, 21, 0.85);
          }
          i {
            font-style: normal;
            font-size: 12px;
            color: rgba(0, 11, 21, 0.25);
            display: inline-block;
            margin-left: 8px;
          }
        }
        .course {
          padding: 18px;
          display: flex;
          background-color: #fafafa;
          .img_box {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-color: pink;
          }
          .name_box {
            margin-left: 16px;
            .name {
              font-size: 14px;
              color: rgba(0, 11, 21, 0.85);
            }
            .launch {
              font-size: 12px;
              color: #01aafc;
              display: inline-block;
              padding: 1px 8px;
              background: #e7fbff;
              border-radius: 4px;
              margin-right: 8px;
              margin-top: 8px;
            }
            .conduct {
              font-size: 12px;
              color: #00b061;
              display: inline-block;
              padding: 1px 8px;
              background: #e7ffee;
              border-radius: 4px;
              margin-right: 8px;
            }
            .time {
              margin-left: 16px;
              margin-top: 10px;
              font-size: 14px;
              color: rgba(0, 11, 21, 0.45);
            }
          }
        }
      }
    }
  }
}
</style>
