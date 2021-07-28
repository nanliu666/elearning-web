export default {
  basicSetting: {
    icon: 'icondirectories-bicolor',
    processName: '',
    processType: '',
    categoryId: null,
    processVisible: [],
    approverDistinct: 1,
    approverNull: 0,
    isOpinion: '',
    tip: '',
    processMap: { max: '', min: '' }
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
      content: '请选择审批人',
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
