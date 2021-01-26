<template>
  <div class="details">
    <div class="details_header">
      <page-header title="课程审核详情" show-back :back="goBack" />
    </div>

    <div class="details_top_bar">
      <div class="details_top_bar_title">{{ processData.processName }}</div>
      <ul>
        <li>
          <span class="details_top_li_text">审批编号：</span> <span>{{ processData.apprNo }}</span>
        </li>
        <li>
          <span class="details_top_li_text">申请人：</span> <span>{{ processData.userName }}</span>
        </li>
        <li>
          <span class="details_top_li_text">申请时间：</span>
          <span>{{ processData.applyTime }}</span>
        </li>
      </ul>
      <div class="details_top_bar_bottom">
        <span class="details_top_bar_bottom_title">状态：</span>
        <span v-show="processData.status == 'Approve'">审批中</span>
        <span v-show="processData.status == 'Pass'">已通过</span>
        <span v-show="processData.status == 'Reject'">已拒绝</span>
        <span v-show="processData.status == 'Corvidae'">待完善</span>
        <span v-show="processData.status == 'Cancel'">已撤回</span>
      </div>
    </div>

    <div class="details_course">
      <div class="details_course_title">
        <div class="details_course_title_l">
          课程详情
        </div>
        <div class="details_course_title_r" @click="showDetailed = !showDetailed">
          <div v-show="!showDetailed"><span>展开</span> <i class="el-icon-arrow-down"></i></div>
          <div v-show="showDetailed"><span>收起</span> <i class="el-icon-arrow-up"></i></div>
        </div>
      </div>

      <div v-show="showDetailed" class="details_course_detailed">
        <div class="details_course_detailed_top">
          <div class="details_course_detailed_img">
            <img :src="courseData.url" alt="" />
          </div>

          <div class="details_course_detailed_r">
            <div class="details_course_detailed_r_title">
              {{ courseData.name }}
            </div>
            <ul>
              <li>
                <span class="text">讲师：</span> <span> {{ courseData.teacherId }} </span>
              </li>
              <li>
                <span class="text">所在分类：</span> <span> {{ courseData.catalogId }} </span>
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
                <span class="text">学时（小时）：</span> <span> {{ courseData.period }} </span>
              </li>
              <li>
                <span class="text">学分：</span> <span> {{ courseData.credit }} </span>
              </li>
              <li>
                <span class="text">通过条件：</span>
                <span v-for="(item, index) in courseData.passCondition" :key="index">
                  <span v-show="item == 'a'">教师评定 </span>
                  <span v-show="item == 'b'"
                    >考试通过 {{ courseData.passCondition.split(',').length >= 3 ? ',' : '' }}</span
                  >
                  <span v-show="item == 'c'"
                    >达到课程学时 {{ courseData.passCondition.split(',').length >= 2 ? ',' : '' }}
                  </span>
                </span>
              </li>
              <li>
                <span class="text">选修类型：</span>
                <span>
                  <span v-show="courseData.electiveType == 1">在线课程</span>
                  <span v-show="courseData.electiveType == 2">面授课程</span>
                  <span v-show="courseData.electiveType == 3">直播课程</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div class="details_course_detailed_bar">
          <span :class="{ pitch: pitch == 1 }" @click="setPitch(1)">详细信息</span>
          <span :class="{ pitch: pitch == 2 }" @click="setPitch(2)">课程内容</span>
        </div>
        <div v-show="pitch == 1" class="details_course_detailed_pitch1">
          <div class="title">
            <i></i>
            <span>课程介绍</span>
          </div>
          <div class="content">
            <div v-html="courseData.introduction"></div>
          </div>
          <div class="title">
            <i></i>
            <span>课前思考</span>
          </div>
          <div class="content">
            <div v-html="courseData.thinkContent"></div>
          </div>
        </div>
        <div v-show="pitch == 2" class="details_course_detailed_pitch2">
          <ul>
            <li v-for="(item, index) in courseData.content" :key="index" @click="jumpToLearn(item)">
              <div>
                <i>{{ index + 1 }}</i> <span>{{ item.name }}</span>
              </div>
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
        <div class="details_process_box_title">审批流程</div>

        <div class="details_process_box_steps">
          <el-steps :style="{ height: stepsheight }" direction="vertical" :active="2">
            <el-step
              v-for="(item, index) in recordData"
              :key="index"
              icon="iconiconfontdian1 iconfont"
            >
              <template slot="title">
                <div class="title">
                  <span>{{ item.nodeName }}</span> <i>1人审批</i>
                </div>
              </template>

              <template slot="description">
                <div class="course">
                  <div class="img_box">
                    <img :src="item.avatarUrl" alt="" />
                  </div>

                  <div class="name_box">
                    <div>
                      <span class="name">{{ item.userName }}</span>
                      <span class="launch" v-show="item.result == ''">发起审批</span>
                      <span class="conduct" v-show="item.result == 'Approve'">审批中</span>
                      <span class="conduct" v-show="item.result == 'Pass'">已通过</span>
                      <span class="conduct" v-show="item.result == 'Reject'">已拒绝</span>
                      <span class="conduct" v-show="item.result == 'Corvidae'">待完善</span>
                      <span class="conduct" v-show="item.result == 'Cancel'">已撤回</span>
                    </div>
                    <div class="time">
                      <el-button type="text" @click="urgeBtn"> 催一下 </el-button>
                      {{ item.createTime }}
                    </div>
                  </div>
                </div>
              </template>
            </el-step>
          </el-steps>
        </div>
      </div>

      <div class="details_comment"></div>
    </div>
  </div>
</template>

<script>
import { listTeacher, getCourse, getCatalog } from '@/api/course/course'
import { detail, record, urge } from '@/api/approvalCenter/approvalCenter'
export default {
  data() {
    return {
      stepsheight: '300px',
      pitch: 1,
      showDetailed: false,
      textarea: '',
      // 最上面的审核数据
      processData: {},
      // 课程详情
      courseData: {},
      // 审批记录
      recordData: []
    }
  },
  activated() {
    this.getCourseData()
    this.getdetail()
    this.getrecord()
  },
  methods: {
    id() {
      return this.$route.query.id
    },
    apprNo() {
      return this.$route.query.apprNo
    },
    centerPitch() {
      return this.$route.query.pitch
    },
    // 催一下
    urgeBtn() {
      urge({ processInstanceId: this.processData.processInstanceId, apprNo: this.apprNo() }).then(
        () => {
          this.$message({
            message: '催办成功',
            type: 'success'
          })
        }
      )
    },
    // 最上面的审核数据
    async getdetail() {
      let res = await detail({ apprNo: this.apprNo() })
      this.processData = res
    },
    // 流程节点
    async getrecord() {
      let res = await record({ apprNo: this.apprNo() })
      this.recordData = res.data
    },
    // 查看内容
    jumpToLearn(item) {
      this.$router.push({
        path: '/approvalCenter/chapter',
        query: { courseId: item.courseId, chapterId: item.id }
      })
    },
    // 拿课程信息
    async getCourseData() {
      let res = await getCourse({ courseId: this.id() })
      res.introduction = _.unescape(res.introduction)
      res.thinkContent = _.unescape(res.thinkContent)
      this.courseData = res
      // 讲师
      listTeacher().then((teacherRes) => {
        teacherRes.map((item) => {
          if (this.courseData.teacherId == item.idStr) this.courseData.teacherId = item.name
        })
      })
      // 所在分类
      getCatalog().then((Catalog) => {
        let CatalogData = this.findPathByLeafId(this.courseData.catalogId, Catalog)
        this.courseData.catalogId = CatalogData[0]
      })
    },
    //递归实现
    //@leafId  查找的id，
    //@nodes   原始Json数据
    //@path    供递归使用
    findPathByLeafId(leafId, nodes, path) {
      if (path === undefined) {
        path = []
      }
      for (let i = 0; i < nodes.length; i++) {
        let tmpPath = path.concat()
        tmpPath.push(nodes[i].name)
        if (leafId == nodes[i].id) {
          return tmpPath
        }
        if (nodes[i].children) {
          let findResult = this.findPathByLeafId(leafId, nodes[i].children, tmpPath)
          if (findResult) {
            return findResult
          }
        }
      }
    },
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
      border-left: 1px solid #ebeced;
      padding-left: 24px;
      margin-top: 20px;
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
          .img_box {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-color: pink;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
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
              margin-left: 8px;
            }
            .conduct {
              font-size: 12px;
              color: #00b061;
              display: inline-block;
              padding: 1px 8px;
              background: #e7ffee;
              border-radius: 4px;
              margin-left: 8px;
            }
            .time {
              margin-top: 10px;
              font-size: 14px;
              color: rgba(0, 11, 21, 0.45);
            }
          }
        }
      }
    }
  }
  &_comment {
    height: 60px;
  }
}
</style>
