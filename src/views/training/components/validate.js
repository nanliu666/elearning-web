import moment from 'moment'
import { Message } from 'element-ui'
import _ from 'lodash'
export class Validate {
  constructor() {}
  /**
   * 比较弹窗内的时间与培训时间的关系
   * @param {*} callback 当前form表单的回调函数
   * @param {*} trainTime  培训日期
   * @param {*} date  弹窗传入的选择的日期
   * @param {*} title 弹窗所比较的标题
   * @param {*} entryCName 因为考试的新建的弹窗学习与培训共用，这里也会输入学习
   */
  static validateLegalTime(callback, trainTime, date, title, entryCName = '培训') {
    if (_.isEmpty(trainTime)) {
      callback(new Error('请先选择培训时间'))
    } else {
      const isLegalTime = this.isLegalTimeFun(date, trainTime, title)
      const timeLegalTips = `${title}日期要在${entryCName}日期（${trainTime[0]}至${trainTime[1]}）之间`
      if (isLegalTime) {
        callback()
      } else {
        callback(new Error(timeLegalTips))
      }
    }
  }
  /**
   * 是否在培训时间期间并且比较与培训开始日期或结束日期相同
   * @param {*} time 当前比较日期
   * trainTime 培训时间
   * title 用来区分是在线/线下/考试
   * @returns 当前日期是否符合时间格式, true为符合格式，false为不符合格式
   */
  static isLegalTimeFun(time, trainTime, title) {
    // 考试与线下的弹窗需要比较到秒，在线的需要比较到天
    const typeParmas = title === '在线课程' || title === '上课日期' ? 'days' : 'seconds'
    // 2个日期介于两个日期之间
    // 培训开始时间需要在之前
    const isLegalBeginTime = moment(trainTime[0]).isSameOrBefore(moment(time[0]), typeParmas)
    // 培训结束时间需要在之后
    const isLegalEndTime = moment(trainTime[1]).isSameOrAfter(moment(time[1]), typeParmas)
    return isLegalBeginTime && isLegalEndTime
  }
  // 错误提示
  static $message(tips) {
    Message({
      message: tips,
      type: 'error',
      showClose: true
    })
  }
  // 提交检验线下日程列表是否与培训时间相同
  /**
   * 在提交时，校验线下日程/在线课程/考试安排内的所有数据是否符合当前的培训时间
   * @param {*} dateList editArrangement内的三个列表的数据
   * @param {*} title 线下日程/在线课程/考试安排
   * @param {*} propKey 三个列表用来比较的属性，例如线下日程是比较todoDate
   * @returns 返回当前是否通过校验
   */
  static validateSchedule(dateList, title, propKey, trainTime) {
    return new Promise((resolve, reject) => {
      // 如果无线下日程的数据直接返回
      if (_.isEmpty(dateList)) {
        resolve(true)
      } else {
        let legalTime = []
        _.each(dateList, (item) => {
          const isLegalTime = this.isLegalTimeFun(item[propKey], trainTime, title)
          if (!isLegalTime) {
            legalTime.push(item[propKey])
          }
        })
        if (_.isEmpty(legalTime)) {
          resolve(true)
        } else {
          this.$message(`${title}以下时间：${_.join(legalTime, ',')}与培训时间冲突！`)
          reject(false)
        }
      }
    })
  }
}
