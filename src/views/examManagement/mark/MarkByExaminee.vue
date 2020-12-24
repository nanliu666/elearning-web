<template>
  <div class="mark-by-examinee">
    <page-header
      title="评卷详情"
      show-back
    />
    <el-card
      v-if="!_.isEmpty(paperData.examineeAchievementDO)"
      class="examinee-card"
    >
      <div class="heder">
        <span>{{ paperData.examineeAchievementDO.examName }}</span>
        <el-tag
          :type="getTag(paperData.examineeAchievementDO.status).type"
          style="margin-left: 10px"
        >
          {{ getTag(paperData.examineeAchievementDO.status).label }}
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
          <span class="li-value">{{ paperData.examineeAchievementDO.dept }}</span>
        </li>
        <li class="card-li">
          <span class="li-label">考试用卷：</span>
          <span class="li-value">{{ paperData.examineeAchievementDO.paperName }}</span>
        </li>
        <li class="card-li">
          <span class="li-label">考试时间：</span>
          <span class="li-value">
            <span>{{ paperData.examineeAchievementDO.examBeginTime }}</span>
            <span>~</span>
            <span>{{ paperData.examineeAchievementDO.examEndTime }}</span>
          </span>
        </li>
        <li class="card-li">
          <span class="li-label">考试用时：</span>
          <span class="li-value">
            {{
              moment(paperData.examineeAchievementDO.examEndTime).diff(
                moment(paperData.examineeAchievementDO.examBeginTime),
                'minutes'
              )
            }}
          </span>
        </li>
        <li class="card-li">
          <span class="li-label">试卷总分：</span>
          <span class="li-value">{{ paperData.examineeAchievementDO.totalScore }}</span>
        </li>
      </ul>
    </el-card>
    <el-card
      v-if="paperData.keguan"
      class="paper-card"
    >
      <div
        slot="header"
        class="card-header"
      >
        <div class="card-left">
          <span class="title">客观题部分</span>
          <span class="sub-title">
            <span>（共{{ paperData.keguan }}题</span>
            <span>共{{ paperData.scoreKeguan }}分）</span>
          </span>
        </div>
        <div class="card-right">
          <i class="el-icon-arrow-down" />
          <span style="margin-left:8px">展开</span>
        </div>
      </div>
      <ul class="card-content">
        <li
          v-for="(item, index) in markDetails.qustionList"
          :key="index"
          class="card-li"
        >
          <div class="card-title">
            <span>{{ (index + 1) | number2zhcn }}、</span>
            <span>{{ item.type | typeFilter }}</span>
            <span>（每题{{ item.score / 10 }}分，共{{ item.length }}题）</span>
          </div>
          <div class="card-sub-title">
            {{ item.subTitle }}
          </div>
          <div class="stem-main">
            <span>{{ index + 1 }}.</span>
            <span v-html="item.qustionStem" />
            <el-tooltip
              class="item"
              effect="dark"
              :content="`试题分析：${item.tips || '暂无'}`"
              placement="top-start"
            >
              <el-button type="text">
                [查看试题分析]
              </el-button>
            </el-tooltip>
          </div>
          <div class="standard-class">
            <span class="standard-label"> 标准答案：</span>
            <span class="standard-value">{{ item.standard }}</span>
          </div>
          <mark-com :answer="item.answer" />
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script>
// 逐人评卷
const nzhcn = require('nzh/cn')
import { QUESTION_TYPE_MAP } from '@/const/examMange'
import MarkCom from './components/MarkCom'
import { getExamineePaperDetail, getExamineePaperDetailist } from '@/api/examManage/mark'
import { mapGetters } from 'vuex'
import moment from 'moment'
const STATUS_STATUS = [
  { value: '3', label: '待评卷', type: 'success' },
  { value: '4', label: '阅卷中', type: 'danger' },
  { value: '5', label: '已评卷', type: 'info' }
]
export default {
  name: 'MarkByExaminee',
  components: {
    MarkCom
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
      paperData: {},
      markDetails: {
        name: 'EHS全员硬质考试',
        examName: '',
        status: '0',
        orgName: '广州分公司',
        testPaper: 'EHS用卷',
        time: '2010-10-10 12:13',
        useTime: 52,
        totalScore: 120,
        qustionList: [
          {
            type: 'blank',
            score: 50,
            subTitle: '大题副标题',
            standard: '春秋|战国',
            qustionStem:
              '____时期出现了老子、孔子、孙子等为代表的学派。 ______时期形成了墨家、儒家、道家、法家等学派的“百家争鸣”。',
            tips: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  activated() {
    this.initData()
  },
  methods: {
    getTag(status) {
      return _.find(STATUS_STATUS, (item) => {
        return item.value === status
      })
    },
    moment,
    async initData() {
      this.paperData = await getExamineePaperDetail({ id: this.$route.query.id })
      this.examData = await getExamineePaperDetailist({
        userId: this.userId,
        examineeBatchId: this.$route.query.examineeBatchId,
        examId: this.$route.query.examId
      })
      // console.log('paperData, examData', this.paperData, examData)
    }
  }
}
</script>

<style lang="scss" scoped>
.mark-by-examinee {
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
        }
      }
    }
  }
  .paper-card {
    margin-top: 16px;
    .card-header {
      padding: 18px 0 10px;
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
      }
    }
    .card-content {
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
}
</style>
