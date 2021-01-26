<template>
  <div class="mark-by-examinee">
    <mark-header-card :data="examineeAchievementDO" />
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
                <span>（{{ conItem.scoreQuestion }}分）</span>
                <QustionPreview
                  v-if="QUESTION_TYPE_GROUP !== conItem.type"
                  :data="conItem"
                  type="view"
                />
                <span v-else>
                  <span
                    class="right-title"
                    v-html="getHTML(conItem.content)"
                  ></span>
                  <ul>
                    <li
                      v-for="(paperItem, paperIndex) in conItem.subQuestions"
                      :key="paperIndex"
                      class="content-li"
                    >
                      <span>({{ paperIndex + 1 }}).</span>
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
</template>

<script>
// 逐人评卷列表查看答卷跳转进来的页面
const nzhcn = require('nzh/cn')
import { getExamineePaperDetail, getExamineePaperDetailist } from '@/api/examManage/mark'
import { mapGetters } from 'vuex'
import QustionPreview from './components/questionPreview'
import ComEmpty from '@/components/common-empty/empty'
import MarkHeaderCard from './components//MarkHeaderCard'
import { addLine } from '@/util/util'
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
    MarkHeaderCard,
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
      isView: true,
      examData: {},
      examineeAchievementDO: {},
      questionList: [],
      queryInfo: {
        userId: '',
        type: '',
        id: '',
        flag: '' //0 全队，1全错
      }
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
    getHTML(content) {
      return addLine(content)
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
      this.getViewData(paperData)
    },
    getViewData(paperData) {
      this.questionList = _.chain(_.cloneDeep(paperData))
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
