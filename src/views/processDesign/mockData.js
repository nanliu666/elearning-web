export default {
  basicSetting: {
    processName: '入职',
    processType: 1,
    approverDistinct: 1,
    isOpinion: true,
    tip: '这里是填写提示',
    initiator: [
      {
        hasChildren: false,
        id: '1257943561580855298',
        name: '后端组',
        orgId: '1257943561580855298',
        orgName: '后端组',
        parentId: '1252523599903072261'
      }
    ]
  },
  processData: {
    type: 'start',
    content: '所有人',
    properties: {
      title: '发起人',
      initiator: 'ALL'
    },
    nodeId: 'Gb2',
    childNode: {
      type: 'approver',
      content: '发起人自选',
      properties: {
        title: '审批人',
        assigneeType: 'optional',
        counterSign: true,
        optionalMultiUser: false,
        optionalRange: 'ALL'
      },
      nodeId: 'Nb2',
      prevId: 'Gb2'
    }
  }
}
