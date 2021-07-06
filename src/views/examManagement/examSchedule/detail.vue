<template>
  <div>
    <page-header
      title="考试详情"
      show-back
    />
    <basic-container class="details-container">
      <div class="details-top">
        <header class="top-title">
          <div
            v-if="!_.isEmpty(examDetail)"
            class="title-left"
          >
            <span class="title-text">{{ examDetail.examName }}</span>
            <!-- 草稿数据不用显示状态 -->
            <el-tag
              v-if="examDetail.status && examDetail.type == 0"
              :type="getStatusType(examDetail.status).color"
            >
              {{ getStatusType(examDetail.status).text }}
            </el-tag>
          </div>
          <div class="title-left">
            <el-button
              type="primary"
              size="medium"
              @click="edit('edit')"
            >
              编辑
            </el-button>
            <el-button
              :disabled="examDetail.status === '2'"
              size="medium"
              @click="deleteFun"
            >
              删除
            </el-button>
            <el-button
              size="medium"
              @click="edit('copy')"
            >
              复制
            </el-button>
          </div>
        </header>
        <ul class="details-ul">
          <li class="details-li">
            <span class="li-label">考试分类：</span>
            <span class="li-value">{{
              examDetail.categoryName ? examDetail.categoryName : '未分类'
            }}</span>
          </li>
          <li class="details-li">
            <span class="li-label">考试用卷：</span>
            <span class="li-value">
              <span>{{ examDetail.paperName }}</span>
              <!-- 随机random，手工manual -->
              <el-button
                type="text"
                style="padding: 0; margin-left: 20px"
                @click="goRelevance"
              >{{
                examDetail.paperType === 'random' ? '查看关联试卷' : '预览试卷'
              }}</el-button>
            </span>
          </li>
          <li
            v-if="!_.isEmpty(examDetail.reviewerNames)"
            class="details-li"
          >
            <span class="li-label">评卷人：</span>
            <span class="li-value">{{ examDetail.reviewerNames.join(', ') }}</span>
          </li>
          <li
            v-if="examDetail.certificateName"
            class="details-li"
          >
            <span class="li-label">证书模板：</span>
            <span class="li-value">{{ examDetail.certificateName }}</span>
          </li>
          <li
            v-if="examDetail.totalScore"
            class="details-li"
          >
            <span class="li-label">总分：</span>
            <span class="li-value">{{ examDetail.totalScore }}</span>
          </li>
          <li
            v-if="examDetail.passScope"
            class="details-li"
          >
            <span class="li-label">及格分：</span>
            <span class="li-value">{{ examDetail.passScope }}</span>
          </li>
          <li
            v-if="examDetail.maxUserScore"
            class="details-li"
          >
            <span class="li-label">最高分：</span>
            <span class="li-value">{{ examDetail.maxUserScore }}</span>
          </li>
        </ul>
      </div>
    </basic-container>
    <basic-container class="details-container">
      <div class="details-bottom">
        <header class="bottom-header">
          <span class="title">详细设置</span>
          <div>
            <i :class="[isExtend ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" />
            <span
              class="handle"
              @click="extendFun"
            >{{ isExtend ? '收起' : '展开' }}</span>
          </div>
        </header>
        <ul
          v-if="isExtend"
          class="extend-ul"
        >
          <li class="extend-li">
            <div class="li-title">
              基础设置：
            </div>
            <div class="li-content">
              <div class="content">
                <span>答题模式：</span>
                <span>{{ examDetail.answerMode === 1 ? '整卷模式' : '逐题考试' }}</span>
              </div>
              <div class="content">
                <span>考试时长：</span>
                <span>{{
                  !examDetail.reckonTime ? '不计时' : `${examDetail.reckonTimeValue}分钟`
                }}</span>
              </div>
              <div class="content">
                <span>参加次数：</span>
                <span>{{
                  !examDetail.joinNum ? '不限次数' : `不超过${examDetail.joinNumValue}次`
                }}</span>
              </div>
              <div class="content">
                <span>考试时间策略：</span>
                <span>{{
                  !examDetail.strategy
                    ? '允许进入考试的时间'
                    : '允许参考时间（到结束时间，会自动提交。）'
                }}</span>
              </div>
              <div class="content">
                <span>积分：</span>
                <span>{{
                  !examDetail.integral
                    ? '本考试记录系统没有积分'
                    : `本考试记录系统积分${examDetail.integralValue}分`
                }}</span>
              </div>
              <div class="content">
                <span>发布考试：</span>
                <span>{{
                  !examDetail.publishTime
                    ? '马上发布考试'
                    : `考试开始前${examDetail.publishTimeValue}分钟发布考试信息`
                }}</span>
              </div>
            </div>
          </li>
          <li class="extend-li">
            <div class="li-title">
              考场环境：
            </div>
            <div class="li-content">
              <!-- <div class="content">
                <span>是否启用IP限制(需设定考生合法IP范围)：</span>
                <span>{{ examDetail.isLimitIp ? '是' : '否' }}</span>
              </div>
              <div class="content">
                <span>生成试卷时是否打乱试题和选项顺序：</span>
                <span>{{ examDetail.isShuffle ? '是' : '否' }}</span>
              </div>
              <div class="content">
                <span>交卷即时是否生成答案统计数据(建议大规模考试时不启用)：</span>
                <span>{{ examDetail.createAnswers ? '是' : '否' }}</span>
              </div> -->
              <div class="content">
                <span>是否允许迟到分钟后禁止参加考试：</span>
                <span>{{
                  examDetail.lateBanExam && examDetail.lateBanExamValue
                    ? `允许迟到${examDetail.lateBanExamValue}分钟`
                    : '否'
                }}</span>
              </div>
              <div class="content">
                <span>答卷时间过少是否禁止交卷：</span>
                <span>{{
                  examDetail.answerBanExam && examDetail.answerBanExamValue
                    ? `开始答卷${examDetail.answerBanExamValue}分钟内禁止交卷`
                    : '否'
                }}</span>
              </div>
              <!-- <div class="content">
                <span>是否启用试卷预生成服务：</span>
                <span>{{
                  examDetail.preCreate && examDetail.preCreateValue
                    ? `试卷最多预生成${examDetail.preCreateValue}份`
                    : '否'
                }}</span>
              </div> -->
              <!-- <div class="content">
                <span>是否自动保存答案到服务器：</span>
                <span>{{ examDetail.isHold ? '是' : '否' }}</span>
              </div> -->
            </div>
          </li>
          <li class="extend-li">
            <div class="li-title">
              考生权限：
            </div>
            <div class="li-content">
              <div class="content">
                <span>是否允许考生查看本机资料(开卷考试)：</span>
                <span>{{ examDetail.isDecoil ? '允许' : '不允许' }}</span>
              </div>
              <div class="content">
                <span>是否允许考生查看成绩：</span>
                <span>{{
                  examDetail.openResults
                    ? examDetail.openResultsValue === 0
                      ? '永久允许'
                      : `考生${examDetail.openResultsValue}天内可以查看成绩`
                    : '不允许'
                }}</span>
              </div>
              <div class="content">
                <span>是否允许考生查看答卷：</span>
                <span>{{ examDetail.openAnswerSheet ? '允许' : '不允许' }}</span>
              </div>
              <!-- <div class="content">
                <span>是否允许考生自己评卷：</span>
                <span>{{ examDetail.selfMarking ? '允许' : '不允许' }}</span>
              </div> -->
              <div class="content">
                <span>是否允许考生查看标准答案：</span>
                <span>{{ examDetail.publicAnswers ? '允许' : '不允许' }}</span>
              </div>
              <!-- <div class="content">
                <span>考生报名考试是否需要审批：</span>
                <span>{{ examDetail.openEntrance ? '需要' : '不需要' }}</span>
              </div> -->
            </div>
          </li>
          <li class="extend-li">
            <div class="li-title">
              评卷策略：
            </div>
            <div class="li-content">
              <!-- <div class="content">
                <span>是否允许评卷人修改考生答案：</span>
                <span>{{ examDetail.modifyAnswer ? '允许' : '不允许' }}</span>
              </div>
              <div
                v-if="examDetail.modifyAnswer"
                class="content"
              >
                <span>是否允许修改考生客观题答案及其评分结果：</span>
                <span>{{ examDetail.modifyLimit ? '允许' : '不允许' }}</span>
              </div> -->
              <div class="content">
                <span>评卷限定最高得分：</span>
                <span>{{
                  examDetail.scopeLimit ? `限定最高${examDetail.scopeLimitValue}分` : '不限制'
                }}</span>
              </div>
              <div class="content">
                <span>是否手工评卷是否显示客观题：</span>
                <span>{{ examDetail.objectiveQuestions ? '显示' : '不显示' }}</span>
              </div>
              <div class="content">
                <span>判断题是否答对得分,不答不得分,答错扣分：</span>
                <span>{{ examDetail.decideItem ? '是' : '否' }}</span>
              </div>
              <div class="content">
                <span>多选题：</span>
                <span>{{ MUTI_TEXT_MAP[examDetail.multipleChoice] }}</span>
              </div>
            </div>
          </li>
          <li class="extend-li">
            <div class="li-title">
              成绩发布：
            </div>
            <div class="li-content">
              <div class="content">
                <span>是否由系统自动评定通过：</span>
                <span>{{ examDetail.autoEvaluate ? '是' : '否' }}</span>
              </div>
              <div
                v-if="examDetail.autoEvaluate"
                class="content"
              >
                <span>通过条件：</span>
                <span>
                  <span
                    v-if="examDetail.passType === 1"
                  >按成绩，成绩不低于{{ examDetail.passScope }}分</span>
                  <span
                    v-if="examDetail.passType === 2"
                  >按得分率，得分率不低于{{ examDetail.passScope }}%</span>
                </span>
              </div>
              <div class="content">
                <span>发布规则：</span>
                <span>
                  {{ examDetail.publishType === 1 ? '系统即时发布' : '定时自动发布' }}
                </span>
              </div>
              <div
                v-if="examDetail.publishType !== 1"
                class="content"
              >
                <span>发布时间：</span>
                <span>{{ examDetail.fixedTime }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </basic-container>
    <basic-container>
      <el-tabs v-model="activeIndex">
        <!-- 只有公开报名的才能显示报名情况 -->
        <!-- publicFlag开启了公开报名 -->
        <!--  joinApproveFlag === '1' 报名需要审批-->
        <el-tab-pane
          v-if="hasSign"
          label="报名情况"
          name="1"
        >
          <apply-list />
        </el-tab-pane>
        <el-tab-pane
          label="已考试"
          name="2"
        >
          <exam-info
            :has-exam-handle="hasExamHandle"
            :is-finished="true"
          />
        </el-tab-pane>
        <el-tab-pane
          label="未考试"
          name="3"
        >
          <exam-info
            :has-exam-handle="hasExamHandle"
            :is-finished="false"
          />
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import { delExamArrange, getExamArrange } from '@/api/examManage/schedule'
const MUTI_TEXT_MAP = {
  0: '完全正确得分',
  1: '按正确选项个数计分',
  2: '每项得扣分',
  3: '每项答错扣分',
  4: '每正确项得分'
}
export default {
  components: {
    applyList: () => import('./components/detailComponets/applyList'),
    examInfo: () => import('./components/detailComponets/examInfo')
  },
  provide() {
    return {
      paperDetail: this
    }
  },
  data() {
    return {
      hasExamHandle: true,
      isExtend: false,
      activeIndex: '2',
      examDetail: {}
    }
  },
  computed: {
    hasSign() {
      const { publicFlag, joinApproveFlag } = this.examDetail
      return publicFlag && joinApproveFlag == 1
    },
    MUTI_TEXT_MAP: () => MUTI_TEXT_MAP
  },
  watch: {
    hasSign: {
      handler() {
        this.activeIndex = this.hasSign ? '1' : '2'
      },
      deep: true
    }
  },
  activated() {
    this.initData()
  },
  methods: {
    // 展开与收起
    extendFun() {
      this.isExtend = !this.isExtend
    },
    getEditTitle(examPattern, type) {
      const examPatternText = examPattern === 'general' ? '在线' : '线下'
      let handleText = ''
      switch (type) {
        case 'copy':
          handleText = '复制'
          break
        case 'edit':
          handleText = '编辑'
          break
        default:
          handleText = '创建'
          break
      }
      return `${handleText}${examPatternText}考试`
    },
    // 编辑和复制
    edit(type) {
      const basicQuery = {
        id: this.$route.query.id,
        tagName: this.getEditTitle(this.examDetail.examPattern, 'edit'),
        isDraft: this.examDetail.type, // 0-已发布，1-草稿箱
        examType: this.examDetail.examType,
        examPattern: this.examDetail.examPattern
      }
      const query =
        type === 'copy'
          ? _.assign(basicQuery, { type: 'copy' })
          : _.assign(basicQuery, { type: 'edit', source: 'mark' })
      this.$router.push({ path: '/examManagement/examSchedule/edit', query })
    },
    deleteFun() {
      const params = { ids: this.$route.query.id }
      this.$confirm('此操作将永久删除该考试, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delExamArrange(params).then(() => {
          this.$message.success('删除成功')
          this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
          this.$nextTick(() => {
            this.$router.push({ path: '/examManagement/examSchedule/list' })
          })
        })
      })
    },
    // 前往关联试卷/预览
    goRelevance() {
      const relevanceList = '/examManagement/examSchedule/relevanceList'
      const preview = '/examManagement/examSchedule/preview'
      const path = this.examDetail.paperType === 'random' ? relevanceList : preview
      this.$router.push({
        path: path,
        query: {
          paperId: this.examDetail.testPaper,
          examId: this.$route.query.id,
          maxNum: this.examDetail.preCreateValue,
          examName: this.examDetail.examName,
          paperType: this.examDetail.paperType
        }
      })
    },
    /**
     * 标识状态
     */
    getStatusType(status) {
      const TYPE_STATUS = {
        '1': {
          color: 'success',
          text: '未开始'
        },
        '2': {
          color: 'warning',
          text: '进行中'
        },
        '3': {
          color: 'danger',
          text: '已结束'
        }
      }
      return TYPE_STATUS[status]
    },
    /**
     * 初始数据，并处理附件
     */
    initData() {
      getExamArrange({ id: this.$route.query.id }).then((res) => {
        this.examDetail = res
        // 未开启发放证书并且是自动评分，关闭操作列
        this.hasExamHandle = !(this.examDetail.autoEvaluate && !this.examDetail.certificate)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.details-container {
  background-color: #fff;
  margin-bottom: 16px;
  .details-top {
    .top-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      .title-left {
        display: flex;
        align-items: center;
      }
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
          color: rgba(0, 11, 21, 0.45);
        }
        .li-value {
          color: rgba(0, 11, 21, 0.85);
        }
      }
    }
  }
  .details-bottom {
    .bottom-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 16px;
        font-weight: 550;
      }
      .handle {
        cursor: pointer;
        margin-left: 4px;
        color: #000b15;
      }
    }
    .extend-ul {
      padding-top: 24px;
      .extend-li {
        padding-bottom: 24px;
        &:last-child {
          padding-bottom: 0;
        }
        .li-title {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #000b15;
          position: relative;
          padding-left: 12px;
          margin-bottom: 16px;
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 10%;
            width: 4px;
            height: 80%;
            background-color: $primaryColor;
          }
        }
        .li-content {
          display: flex;
          flex-wrap: wrap;
          .content {
            width: 50%;
            margin-bottom: 16px;
            span {
              &:first-child {
                color: rgba(0, 11, 21, 0.45);
              }
              &:last-child {
                color: rgba(0, 11, 21, 0.85);
              }
            }
          }
        }
      }
    }
  }
}
.image-ul {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  .image-li {
    margin-right: 10px;
    border: 1px solid #ccc;
  }
}
.file-title {
  cursor: pointer;
  margin-bottom: 10px;
}
</style>
