export default {
  basicSetting: {
    processName: '入职',
    processType: 1,
    approverDistinct: 1,
    isOpinion: true,
    tip: '这里是填写提示'
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
        assigneeType: 'user',
        counterSign: true,
        optionalMultiUser: false,
        optionalRange: 'ALL'
      },
      nodeId: 'Nb2',
      prevId: 'Gb2'
    }
  }
}
