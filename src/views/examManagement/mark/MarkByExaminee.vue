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
                    class=""
                  >
                    <span>{{ paperIndex + 1 }}.</span>
                    <QustionPreview
                      :ref="`refSelect${paperIndex}${conIndex}`"
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
    </el-card>
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
    QustionPreview
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
      this.getFormData()
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
    async checkRequired() {
      const targetRefs = this.getTargetRefs()
      let checkList = await this.asyncGetValidate(targetRefs)
      let finalList = []
      _.each(checkList, (item) => {
        item.then((value) => {
          finalList.push(value)
          if (_.size(checkList) === _.size(finalList)) {
            if (_.every(finalList, Boolean)) {
              this.submitFun()
            }
          }
        })
      })
    },
    // 获取当前所有的refs
    getTargetRefs() {
      let targetRefs = {}
      _.forIn(this.$refs, (value, key) => {
        if (_.includes(key, 'refSelect')) {
          _.assign(targetRefs, { [key]: value })
        }
      })
      return targetRefs
    },
    // 获取表格的数据
    getFormData() {
      const targetRefs = this.getTargetRefs()
      this.formDataList = this.getFormDataFun(targetRefs)
    },
    //清空所有的表格校验以及表格数据
    clearMarkForm() {
      const targetRefs = this.getTargetRefs()
      _.forIn(targetRefs, (value) => {
        _.each(value, (item) => {
          // 清空
          const tempRef = _.get(item, '$refs.gapAndShorRef.$refs.form', null)
          tempRef && tempRef.resetFields()
        })
      })
    },
    // 获取表格数据的具体处理函数
    getFormDataFun(targetRefs) {
      let temp = []
      _.forIn(targetRefs, (value) => {
        _.each(value, (item) => {
          const tempFormData = _.get(item, '$refs.gapAndShorRef.formData', null)
          temp.push(_.assign(tempFormData, { id: _.get(item, 'data.id', null) }))
        })
      })
      return temp
    },
    // 异步验证表格
    asyncGetValidate(targetRefs) {
      this.formDataList = []
      let checkList = []
      return new Promise((resolve) => {
        _.forIn(targetRefs, (value) => {
          _.each(value, (item) => {
            const tempRef = _.get(item, '$refs.gapAndShorRef.$refs.form', null)
            if (tempRef) {
              checkList.push(this.validateByOne(tempRef))
            }
          })
        })
        resolve(checkList)
      })
    },
    // 一个接一个验证表格
    validateByOne(tempRef) {
      return new Promise((resolve) => {
        tempRef
          .validate()
          .then(() => {
            resolve(true)
          })
          .catch(() => {
            this.$message.error('请为所有已评出结果的试题输入得分！')
            resolve(false)
          })
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
      const paperData = await getExamineePaperDetailist({
        userId: this.examineeAchievementDO.examineeId,
        type: '',
        id: this.$route.query.id
      })
      const tempPaperData = _.groupBy(paperData, 'state')
      _.forIn(tempPaperData, (value, key) => {
        if (key === '0') {
          this.impersonalityList = this.initQuestionList(value)
        } else {
          this.subjectivityList = this.initQuestionList(value)
        }
      })
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
    .handle-button {
      position: absolute;
      bottom: 0;
      width: calc(100% + 24px);
      left: -24px;
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
}
</style>
