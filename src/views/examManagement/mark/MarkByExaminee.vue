<template>
  <div class="mark-by-examinee">
    <page-header
      title="评卷详情"
      show-back
    />
    <el-card class="examinee-card">
      <div class="heder">
        <span>{{ markDetails.name }}</span>
        <el-tag
          type="success"
          style="margin-left: 10px"
        >
          标签二
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
          <span class="li-value">{{ markDetails.orgName }}</span>
        </li>
        <li class="card-li">
          <span class="li-label">考试用卷：</span>
          <span class="li-value">{{ markDetails.testPaper }}</span>
        </li>
        <li class="card-li">
          <span class="li-label">考试时间：</span>
          <span class="li-value">{{ markDetails.time }}</span>
        </li>
        <li class="card-li">
          <span class="li-label">考试用时：</span>
          <span class="li-value">{{ markDetails.useTime }}</span>
        </li>
        <li class="card-li">
          <span class="li-label">试卷总分：</span>
          <span class="li-value">{{ markDetails.totalScore }}</span>
        </li>
      </ul>
    </el-card>
    <el-card class="paper-card">
      <div
        slot="header"
        class="card-header"
      >
        <div class="card-left">
          <span class="title">客观题部分</span>
          <span class="sub-title">（共20题，共60分）</span>
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
