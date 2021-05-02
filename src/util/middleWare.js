import { getUserList, getPositionUserList, getUsergroupList } from '@/api/examManage/schedule'
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
  // 分组员工不为0
  const groupList = _.groupBy(data, (item) => {
    return item.type === 'Group'
  })
  // 如果是部门/公司（org）需要把当前部门的直属人员拉回来处理
  let orgResult = []
  if (examList.true) {
    const orgIdList = _.join(_.map(examList.true, 'id'), ',')
    orgResult = await getUserList({
      orgId: orgIdList
    })
  }
  // 岗位人数校验
  let positionResult = []
  if (positionList.true) {
    const positionIdList = _.join(_.map(positionList.true, 'bizId'), ',')
    positionResult = await getPositionUserList({
      parentId: positionIdList
    })
  }
  // 分组
  let groupResult = []
  if (groupList.true) {
    const groupIdList = _.join(_.map(groupList.true, 'bizId'), ',')
    groupResult = await getUsergroupList({
      ids: groupIdList
    })
  }
  const target = _.uniqBy(
    [
      ..._.get(examList, 'false', []),
      ..._.flattenDeep(orgResult),
      ..._.flattenDeep(positionResult),
      ..._.flattenDeep(groupResult)
    ],
    'userId'
  )
  return target
}
