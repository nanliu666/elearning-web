import { getUserList, getPositionUserList } from '@/api/examManage/schedule'
/**
 * 组织架构/岗位下所有人员拉取回来
 * @param {string} html
 */
export const orgOrPositionToPerson = async (data) => {
  // 非人员且部门下员工不为0
  let examList = _.groupBy(data, (item) => {
    return item.type === 'Org'
  })
  // 岗位员工不为0
  const positionList = _.groupBy(data, (item) => {
    return item.type === 'Position'
  })
  // 如果是部门/公司（org）需要把当前部门的直属人员拉回来处理
  let orgResult = []
  if (examList.true) {
    orgResult = await Promise.all(
      examList.true.map(async (item) => {
        return (async () => {
          return await getUserList({
            orgId: _.get(item, 'bizId') ? _.get(item, 'bizId') : item.id
          })
        })()
      })
    )
  }
  // 岗位人数校验
  let positionResult = []
  if (positionList.true) {
    positionResult = await Promise.all(
      positionList.true.map(async (item) => {
        return (async () => {
          await getPositionUserList({
            parentId: _.get(item, 'bizId') ? _.get(item, 'bizId') : item.positionId
          })
        })()
      })
    )
  }
  const target = [
    ..._.get(examList, 'false', []),
    ..._.flattenDeep(orgResult),
    ..._.flattenDeep(positionResult)
  ]
  return target
}
