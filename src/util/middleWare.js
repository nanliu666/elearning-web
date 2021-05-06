import { getUserList, getPositionUserList, getUsergroupList } from '@/api/examManage/schedule'
/**
 * 组织架构/岗位下所有人员拉取回来
 * @param {string} html
 */
export const orgOrPositionToPerson = async (data) => {
  // 非人员且部门下员工不为0
  let examList = _.filter(data, (item) => {
    return item.type === 'Org'
  })
  // 外部人员
  let outUserList = _.filter(data, (item) => {
    return item.type === 'User'
  })
  // 岗位员工不为0
  const positionList = _.filter(data, (item) => {
    return item.type === 'Position'
  })
  // 分组员工不为0
  const groupList = _.filter(data, (item) => {
    return item.type === 'Group'
  })
  // 如果是部门/公司（org）需要把当前部门的直属人员拉回来处理
  let orgResult = []
  if (!_.isEmpty(examList)) {
    const orgIdList = _.join(_.map(examList, 'id'), ',')
    orgResult = await getUserList({
      orgId: orgIdList
    })
  }
  // 岗位人数校验
  let positionResult1 = [],
    positionResult = []
  if (!_.isEmpty(positionList)) {
    const positionIdList = _.join(_.map(positionList, 'bizId'), ',')
    positionResult1 = await getPositionUserList({
      parentId: positionIdList
    })
    positionResult = positionResult1.users
  }
  // 分组
  let groupResult = []
  if (!_.isEmpty(groupList)) {
    const groupIdList = _.join(_.map(groupList, 'bizId'), ',')
    groupResult = await getUsergroupList({
      ids: groupIdList
    })
  }
  const target = _.uniqBy(
    [
      ...outUserList,
      ..._.flattenDeep(orgResult),
      ..._.flattenDeep(positionResult),
      ..._.flattenDeep(groupResult)
    ],
    'userId'
  )
  return target
}
