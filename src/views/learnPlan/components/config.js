const getDateTime = (time) => {
  return '2021.01.01 ' + time
}
import moment from 'moment'

// 学习计划时间段校验
export function validateTimeList(rule, value, callback) {
  // 取出所有的时间段
  const rangeList = []
  _.forEach(value, (item) => {
    if (
      _.chain(item.list)
        .filter((time) => time !== '')
        .size()
        .value() == 2
    ) {
      rangeList.push(item.list)
    }
  })

  let strs = _.map(rangeList, (item) => JSON.stringify(item))
  if (new Set(strs).size !== rangeList.length) {
    callback(new Error('允许时间段不能有完全相同的'))
    return
  }

  // 两两比较 判断前者的开始和结束时间有没有落在后者的时间范围之内
  if (rangeList.length > 1) {
    let crossed = false,
      first,
      second
    for (let i = 0; i < rangeList.length; i++) {
      for (let j = 0; j < rangeList.length; j++) {
        if (i !== j) {
          first = rangeList[i]
          second = rangeList[j]
          crossed = _.some(
            first,
            (time) =>
              moment(getDateTime(time)).isAfter(getDateTime(second[0])) &&
              moment(getDateTime(time)).isBefore(getDateTime(second[1]))
          )
          if (crossed) {
            callback(new Error('允许时间段时间不能有重叠'))
            return
          }
        }
      }
    }
  }
  callback()
}
