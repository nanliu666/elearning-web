<template>
  <div>
    <page-header
      title="评卷详情"
      show-back
    />
    <el-card
      v-if="!_.isEmpty(data)"
      class="examinee-card"
    >
      <div class="heder">
        <span>{{ data.examName }}</span>
        <el-tag
          :type="getTag(data.status).type"
          style="margin-left: 10px"
        >
          {{ getTag(data.status).label }}
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
          <span class="li-value">{{ data.dept }}</span>
        </li>
        <li class="card-li">
          <span class="li-label">考试用卷：</span>
          <span class="li-value">{{ data.paperName }}</span>
        </li>
        <li class="card-li">
          <span class="li-label">考试时间：</span>
          <span class="li-value">
            <span>{{ data.examBeginTime }}</span>
            <span>~</span>
            <span>{{ data.examEndTime }}</span>
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
          <span class="li-value">{{ data.totalScore }}</span>
        </li>
      </ul>
    </el-card>
  </div>
</template>
<script>
// 抽离查看评卷的与编辑评卷的公用头部
import moment from 'moment'
const STATUS_STATUS = [
  { value: '3', label: '待评卷', type: 'success' },
  { value: '4', label: '阅卷中', type: 'danger' },
  { value: '5', label: '已评卷', type: 'info' }
]
export default {
  name: 'MarkHeaderCard',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    getTag(status) {
      return _.find(STATUS_STATUS, (item) => {
        return item.value === status
      })
    },
    // 获取考试用时
    getExamUseTime() {
      const diffTime = moment(this.data.answerEndTime).diff(moment(this.data.answerBeginTime), 'ms')
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
    }
  }
}
</script>
<style scoped lang="scss">
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
</style>
