<template>
  <div class="mark-by-examinee">
    <page-header
      title="评卷详情"
      show-back
    />
    <el-card
      v-if="!_.isEmpty(examineeAchievementDO)"
      class="examinee-card"
    >
      <div class="heder">
        <span>{{ examineeAchievementDO.examName }}</span>
        <el-tag
          :type="getTag(examineeAchievementDO.status).type"
          style="margin-left: 10px"
        >
          {{ getTag(examineeAchievementDO.status).label }}
        </el-tag>
      </div>
      <ul class="card-ul">
        <li class="card-li">
          <span class="li-label">考试名称：</span>
          <span class="li-value">******</span>
        </li>
        <li class="card-li">
          <span class="li-label">手机号码：</span>
          <span class="li-value">******</span>
        </li>
        <li class="card-li">
          <span class="li-label">归属组织：</span>
          <span class="li-value">{{ examineeAchievementDO.dept }}</span>
        </li>
        <li class="card-li">
          <span class="li-label">考试用卷：</span>
          <span class="li-value">{{ examineeAchievementDO.paperName }}</span>
        </li>
        <li class="card-li">
          <span class="li-label">考试时间：</span>
          <span class="li-value">
            <span>{{ examineeAchievementDO.examBeginTime }}</span>
            <span>~</span>
            <span>{{ examineeAchievementDO.examEndTime }}</span>
          </span>
        </li>
        <li class="card-li">
          <span class="li-label">考试用时：</span>
          <span class="li-value">
            {{ getExamUseTime() }}
          </span>
        </li>
        <li class="card-li">
          <span class="li-label">试卷总分：</span>
          <span class="li-value">{{ examineeAchievementDO.totalScore }}</span>
        </li>
      </ul>
    </el-card>
    <div v-if="!isView">
      <el-card
        v-if="examData.keguan"
        class="paper-card"
      >
        <div
          class="card-header"
          :style="{ 'padding-bottom': isShowImpersonality ? '16px' : '' }"
        >
          <div class="card-left">
            <span class="title">客观题部分</span>
            <span class="sub-title">
              <span>（共{{ examData.keguan }}题</span>
              <span v-if="examData.scoreKeguan">共{{ examData.scoreKeguan }}分）</span>
            </span>
          </div>
          <div
            class="card-right"
            @click="isShowImpersonality = !isShowImpersonality"
          >
            <i :class="`el-icon-arrow-${isShowImpersonality ? 'up' : 'down'}`" />
            <span
              class="expand-text"
              style="margin-left:8px"
            >{{
              isShowImpersonality ? '收起' : '展开'
            }}</span>
          </div>
        </div>
        <ul
          v-if="isShowImpersonality"
          class="card-content"
        >
          <li
            v-for="(item, index) in impersonalityList"
            :key="index"
            class="card-li"
          >
            <div class="card-title">
              <span>{{ (index + 1) | number2zhcn }}、</span>
              <span>{{ _.get(item, '[0].type', null) | typeFilter }}</span>
              <span>（共{{ _.size(item) }}题, 共{{ getItemTotalScore(item) }}分）</span>
            </div>
            <div class="card-sub-title">
              {{ _.get(item, '[0].title', null) }}
            </div>
            <ul class="content-box">
              <li
                v-for="(conItem, conIndex) in item"
                :key="conItem.id"
                class="content-li"
              >
                <span>{{ conIndex + 1 }}.</span>
                <span>（{{ conItem.scoreQuestion }}分）</span>
                <QustionPreview
                  :data="conItem"
                  type="view"
                />
              </li>
            </ul>
          </li>
        </ul>
      </el-card>
      <el-card
        v-if="examData.zhuguan"
        class="paper-card object-card"
      >
        <div
          class="card-header"
          :style="{ 'padding-bottom': '16px' }"
        >
          <div class="card-left">
            <span class="title">主观题部分</span>
            <span class="sub-title">
              <span>（共{{ examData.zhuguan }}题</span>
              <span v-if="examData.scoreZhuguan">共{{ examData.scoreZhuguan }}分）</span>
            </span>
          </div>
        </div>
        <ul class="card-content">
          <li
            v-for="(item, index) in subjectivityList"
            :key="index"
            class="card-li"
          >
            <div class="card-title">
              <span>{{ (index + 1) | number2zhcn }}、</span>
              <span>{{ _.get(item, '[0].type', null) | typeFilter }}</span>
              <span>（共{{ _.size(item) }}题, 共{{ getItemTotalScore(item) }}分）</span>
            </div>
            <div class="card-sub-title">
              {{ _.get(item, '[0].title', null) }}
            </div>
            <ul class="content-box">
              <li
                v-for="(conItem, conIndex) in item"
                :key="conItem.id"
                class="content-li"
              >
                <span>{{ conIndex + 1 }}.</span>
                <span>（{{ conItem.scoreQuestion }}分）</span>
                <QustionPreview
                  v-if="QUESTION_TYPE_GROUP !== conItem.type"
                  ref="refSelect"
                  :data="conItem"
                  type="view"
                />
                <span v-else>
                  <span
                    class="right-title"
                    v-html="_.unescape(conItem.content)"
                  ></span>
                  <ul>
                    <li
                      v-for="(paperItem, paperIndex) in conItem.subQuestions"
                      :key="paperIndex"
                      class="content-li"
                    >
                      <span>{{ paperIndex + 1 }}.</span>
                      <QustionPreview
                        :ref="`refSelect`"
                        :data="paperItem"
                        type="view"
                      />
                    </li>
                  </ul>
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </el-card>
      <div class="handle-button">
        <div class="button-box">
          <el-button
            type="primary"
            size="medium"
            @click="submit"
          >
            提交评分
          </el-button>
          <el-button
            size="medium"
            @click="submitAndNext"
          >
            提交且评下一个
          </el-button>
          <el-button
            size="medium"
            @click="save"
          >
            保存
          </el-button>
          <el-button
            size="medium"
            @click="refreshSubmit"
          >
            重新评分
          </el-button>
        </div>
      </div>
    </div>
    <div v-else>
      <el-card class="paper-card">
        <div class="card-header view-header">
          <div class="card-left">
            <span class="title">答卷详情</span>
            <span class="sub-title">
              <span>（共{{ examData.keguan + examData.zhuguan }}题</span>
              <span>共{{ examData.scoreKeguan + examData.scoreZhuguan }}分）</span>
            </span>
          </div>
          <div class="card-right">
            <span class="right-title">查看试题范围</span>
            <el-radio-group
              v-model="queryInfo.flag"
              @change="getPaperData"
            >
              <el-radio label="">
                全部试题
              </el-radio>
              <el-radio label="0">
                仅显示答对试题
              </el-radio>
              <el-radio label="1">
                仅显示答错试题
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <com-empty
          v-if="_.isEmpty(questionList)"
          height="38vh"
          text="暂无试题"
        />
        <ul
          v-else
          class="question-ul"
        >
          <li
            v-for="(item, index) in questionList"
            :key="index"
            class="question-li"
          >
            <div class="title-box">
              <div class="question-li-title">
                <span>{{ (index + 1) | number2zhcn }}、</span>
                <span>{{ item[0].type | typeFilter }}</span>
                <span>（共{{ _.size(item) }}题, 共{{ getItemTotalScore(item) }}分)</span>
              </div>
              <div class="sub-title">
                {{ item[0].title }}
              </div>
            </div>
            <div class="content-box">
              <ul class="content-ul">
                <li
                  v-for="(conItem, conIndex) in item"
                  :key="conItem.id"
                  class="content-li"
                >
                  <span>{{ conIndex + 1 }}.</span>
                  <QustionPreview
                    v-if="QUESTION_TYPE_GROUP !== conItem.type"
                    :data="conItem"
                    type="view"
                  />
                  <span v-else>
                    <span
                      class="right-title"
                      v-html="_.unescape(conItem.content)"
                    ></span>
                    <ul>
                      <li
                        v-for="(paperItem, paperIndex) in conItem.subQuestions"
                        :key="paperIndex"
                        class="content-li"
                      >
                        <span>{{ paperIndex + 1 }}.</span>
                        <QustionPreview
                          :data="paperItem"
                          type="view"
                        />
                      </li>
                    </ul>
                  </span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </el-card>
    </div>
  </div>
</template>

<script>
// 逐人评卷
const nzhcn = require('nzh/cn')
import {
  getExamineePaperDetail,
  getExamineePaperDetailist,
  postSubmitByOne
} from '@/api/examManage/mark'
import { mapGetters } from 'vuex'
import moment from 'moment'
import QustionPreview from './components/questionPreview'
import ComEmpty from '@/components/common-empty/empty'
const STATUS_STATUS = [
  { value: '3', label: '待评卷', type: 'success' },
  { value: '4', label: '阅卷中', type: 'danger' },
  { value: '5', label: '已评卷', type: 'info' }
]
import {
  QUESTION_TYPE_MAP,
  QUESTION_TYPE_MULTIPLE,
  QUESTION_TYPE_SINGLE,
  QUESTION_TYPE_JUDGE,
  QUESTION_TYPE_SHOER,
  QUESTION_TYPE_BLANK,
  QUESTION_TYPE_GROUP
} from '@/const/examMange'
export default {
  name: 'MarkByExaminee',
  components: {
    QustionPreview,
    ComEmpty
  },
  provide() {
    return {
      mark: this
    }
  },
  filters: {
    typeFilter(data) {
      return QUESTION_TYPE_MAP[data]
    },
    number2zhcn(index) {
      return nzhcn.encodeS(index)
    }
  },
  data() {
    return {
      isShowImpersonality: false,
      examData: {},
      examineeAchievementDO: {},
      formDataList: [],
      questionList: [],
      queryInfo: {
        userId: '',
        type: '',
        id: '',
        flag: '' //0 全队，1全错
      },
      isView: false,
      impersonalityList: [], //客观题
      subjectivityList: [] // 主观题
    }
  },
  computed: {
    ...mapGetters(['userId']),
    QUESTION_TYPE_MULTIPLE: () => QUESTION_TYPE_MULTIPLE,
    QUESTION_TYPE_SINGLE: () => QUESTION_TYPE_SINGLE,
    QUESTION_TYPE_JUDGE: () => QUESTION_TYPE_JUDGE,
    QUESTION_TYPE_BLANK: () => QUESTION_TYPE_BLANK,
    QUESTION_TYPE_SHOER: () => QUESTION_TYPE_SHOER,
    QUESTION_TYPE_MAP: () => QUESTION_TYPE_MAP,
    QUESTION_TYPE_GROUP: () => QUESTION_TYPE_GROUP
  },
  activated() {
    this.initData()
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    this.clearMarkForm()
    next()
  },
  methods: {
    // 重新评分
    refreshSubmit() {
      this.$confirm('您确定重新对该考卷进行评分吗？确定后考卷的所有评分信息将会被清空！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.clearMarkForm()
      })
    },
    // 保存
    save() {
      this.submit()
    },
    // 提交且评下一个
    submitAndNext() {
      this.isNext = true
    },
    // 提交
    submit() {
      this.checkRequired()
    },
    // 具体提交函数
    submitFun() {
      const targetRefs = this.getTargetRefs()
      this.formDataList = _.map(targetRefs, 'model')
      const list = _.chain(this.formDataList)
        .cloneDeep()
        .filter((item) => {
          return item.result
        })
        .value()
      if (_.isEmpty(list)) {
        this.$message.error('您未对该考卷进行评分，请评分后再提交！')
      } else {
        const params = {
          id: this.examineeAchievementDO.id,
          list
        }
        postSubmitByOne(params)
          .then(() => {
            this.$router.go(-1)
          })
          .catch(() => {
            window.console.error(JSON.stringify(params))
          })
      }
    },
    // 检测提交前的逻辑
    checkRequired() {
      const checkList = this.getTargetRefs()
      Promise.all(
        _.map(checkList, (item) => {
          return item.validate()
        })
      )
        .then(() => {
          this.submitFun()
        })
        .catch(() => {
          this.$message.error('请为所有已评出结果的试题输入得分！')
        })
    },
    // 获取当前所有的refs
    getTargetRefs() {
      const targetRefs = _.chain(this.$refs.refSelect)
        .map('$refs')
        .filter((item) => {
          return !_.isEmpty(item)
        })
        .map((item) => {
          return item.gapAndShorRef.$refs.form
        })
        .value()
      return targetRefs
    },
    //清空所有的表格校验以及表格数据
    clearMarkForm() {
      const targetRefs = this.getTargetRefs()
      _.map(targetRefs, (item) => {
        return item.resetFields()
      })
    },
    getItemTotalScore(data) {
      const addScore = (args) => {
        return args.reduce((prev, curr) => {
          return prev + curr
        })
      }
      const scoreList = _.map(data, (item) => {
        return Number(item.scoreQuestion)
      })
      const totalScore = addScore(scoreList)

      return totalScore
    },
    // 获取考试用时
    getExamUseTime() {
      const diffTime = moment(this.examineeAchievementDO.answerEndTime).diff(
        moment(this.examineeAchievementDO.answerBeginTime),
        'ms'
      )
      return this.createCountdown(diffTime)
    },
    /**
     * 入参：差异时间
     * 返回：倒计时
     * 作用：创建一个倒计时
     */
    createCountdown(diffTime) {
      const hoursTime = moment.duration(diffTime).hours()
      const minutesTime = moment.duration(diffTime).minutes()
      const secondsTime = moment.duration(diffTime).seconds()
      const formatHours = `${hoursTime < 10 ? `0${hoursTime}` : hoursTime}`
      const formatMinutes = `${minutesTime < 10 ? `0${minutesTime}` : minutesTime}`
      const formatSeconds = `${secondsTime < 10 ? `0${secondsTime}` : secondsTime}`
      const targetTime = `${formatHours} : ${formatMinutes} : ${formatSeconds}`
      return targetTime
    },
    getTag(status) {
      return _.find(STATUS_STATUS, (item) => {
        return item.value === status
      })
    },
    moment,
    async initData() {
      const examData = await getExamineePaperDetail({ id: this.$route.query.id })
      this.handleExamData(examData)
      this.getPaperData()
    },
    handleExamData(examData) {
      this.examData = examData
      const { examineeAchievementDO } = examData
      this.examineeAchievementDO = examineeAchievementDO
    },
    async getPaperData() {
      _.assign(this.queryInfo, {
        userId: this.examineeAchievementDO.examineeId,
        id: this.$route.query.id
      })
      const paperData = await getExamineePaperDetailist(this.queryInfo)
      this.isView = _.get(this.$route, 'query.isView', false)
      if (this.isView) {
        this.getViewData(paperData)
      } else {
        this.getEditData(paperData)
      }
    },
    getEditData(paperData) {
      let targetList = []
      _.each(paperData, (item) => {
        if (!_.isEmpty(item.subQuestions)) {
          targetList.push(...item.subQuestions)
        } else {
          targetList.push(item)
        }
      })
      const tempPaperData = _.groupBy(targetList, 'state')
      _.forIn(tempPaperData, (value, key) => {
        switch (key) {
          case '0':
            this.impersonalityList = this.initQuestionList(value)
            break
          case '1':
            this.subjectivityList = this.initQuestionList(value)
            break
        }
      })
    },
    getViewData(paperData) {
      this.questionList = _.chain(_.cloneDeep(paperData))
        .groupBy('parentSort')
        .sortBy('parentSort')
        .map((item) => {
          return _.sortBy(item, 'sort')
        })
        .value()
    },
    initQuestionList(data) {
      return _.chain(_.cloneDeep(data))
        .groupBy('parentSort')
        .sortBy('parentSort')
        .map((item) => {
          return _.sortBy(item, 'sort')
        })
        .value()
    }
  }
}
</script>

<style lang="scss" scoped>
.mark-by-examinee {
  position: relative;
  .examinee-card {
    .heder {
      display: flex;
      align-items: center;
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: rgba(0, 11, 21, 0.85);
      font-weight: 550;
      margin-bottom: 19px;
    }
    /deep/ .el-card__body {
      padding-bottom: 8px;
    }
    .card-ul {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      &::after {
        content: '';
        flex: auto;
      }
      .card-li {
        width: calc(100% / 3);
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        .li-label {
          min-width: 84px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.45);
        }
        .li-value {
          flex: 1;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          max-width: 350px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .paper-card {
    margin-top: 16px;
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .card-left {
        display: flex;
        align-items: flex-end;
        .title {
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: rgba(0, 11, 21, 0.85);
          font-weight: 550;
        }
        .sub-title {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: rgba(0, 11, 21, 0.45);
        }
      }
      .card-right {
        cursor: pointer;
        .expand-text {
          color: #000b15;
          opacity: 0.65;
        }
      }
    }
    .view-header {
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeced;
      margin-bottom: 16px;
      .right-title {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(0, 11, 21, 0.65);
        margin-right: 16px;
      }
    }
    .card-content {
      padding-top: 16px;
      border-top: 1px solid #ebeced;
      .card-li {
        margin: 0 13.5%;
        .card-title {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: rgba(0, 11, 21, 0.85);
          font-weight: 550;
        }
        .card-sub-title {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba(0, 11, 21, 0.25);
          margin: 10px 0 18px;
        }
        .stem-main {
        }
        .standard-class {
          position: relative;
          padding-left: 34px;
          margin-bottom: 8px;
          &::before {
            content: '';
            position: absolute;
            left: 24px;
            bottom: 6px;
            width: 6px;
            height: 6px;
            background-color: rgba(0, 11, 21, 0.25);
            border-radius: 100%;
          }
          .standard-label {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.25);
          }
          .standard-value {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.85);
          }
        }
      }
    }
  }
  .question-ul {
    .question-li {
      .title-box {
        margin-bottom: 24px;
        .question-li-title {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: rgba(0, 11, 21, 0.85);
          font-weight: 550;
          margin-bottom: 4px;
        }
        .sub-title {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba(0, 11, 21, 0.25);
        }
      }
      .content-box {
        .content-li {
          margin-bottom: 32px;
        }
      }
    }
  }
  .content-box {
    .content-li {
      margin-bottom: 32px;
    }
  }
  .object-card {
    position: relative;
    .card-content {
      padding-bottom: 76px;
    }
  }
  .handle-button {
    position: fixed;
    bottom: 0;
    right: 40px;
    width: calc(100vw - 16.5vw - 72px);
    background-color: #fff;
    box-shadow: 0 -6px 12px 0 rgba(0, 61, 112, 0.08);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 76px;
    .button-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(104px * 4 + 3 * 16px);
    }
  }
}
</style>
