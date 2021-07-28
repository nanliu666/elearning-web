import { getAllUserList } from '@/api/system/user'
import { getCertificateList } from '@/api/examManage/schedule'
export const ONLINE_COLUMNS = [
  {
    prop: 'basicTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'input',
    span: 11,
    required: true,
    disabled: false,
    maxLength: 50,
    prop: 'examName',
    label: '考试名称'
  },
  {
    itemType: 'treeSelect',
    span: 11,
    offset: 2,
    required: true,
    disabled: false,
    options: [],
    prop: 'categoryId',
    label: '考试分类',
    props: {
      selectParams: {
        placeholder: '请选择分类',
        multiple: false
      },
      treeParams: {
        data: [],
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        filterable: true,
        props: {
          children: 'children',
          label: 'name',
          disabled: 'disabled',
          value: 'id'
        }
      }
    }
  },
  {
    itemType: 'slot',
    span: 11,
    required: true,
    options: [],
    prop: 'testPaper',
    label: '考试用卷'
  },
  {
    itemType: 'lazySelect',
    span: 11,
    offset: 2,
    required: false,
    prop: 'reviewer',
    label: '评卷人',
    load: (params) => {
      return getAllUserList(params)
    },
    optionProps: {
      label: 'name',
      value: 'userId',
      key: 'userId'
    },
    firstOption: [],
    searchable: true,
    multiple: true
  },
  {
    itemType: 'lazySelect',
    span: 11,
    hasLabelSwitch: true,
    labelSwitchConfig: {
      prop: 'certificate',
      disabled: false
    },
    required: false,
    prop: 'certificateId',
    load: (params) => {
      return getCertificateList(_.assign(params, { status: '1' }))
    },
    optionProps: {
      label: 'name',
      value: 'id',
      key: 'id'
    },
    searchable: true,
    label: '证书模板'
  },
  {
    itemType: 'select',
    span: 11,
    offset: 2,
    hasLabelSwitch: true,
    labelSwitchConfig: {
      prop: 'publicFlag',
      disabled: false
    },
    required: false,
    prop: 'joinApproveFlag',
    label: '公开报名',
    options: [
      { label: '需要审批', value: 1 },
      { label: '不需要审批', value: 0 }
    ]
  },
  {
    prop: 'joinEndDate',
    disabled: false,
    itemType: 'datePicker',
    label: '报名截止日期',
    span: 11
  },
  {
    prop: 'basicInfoTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'radio',
    prop: 'answerMode',
    label: '答题模式',
    span: 24,
    options: [
      { label: '整卷模式', value: 1 },
      { label: '逐题考试', value: 2 }
    ]
  },
  {
    itemType: 'slot',
    prop: 'reckonTimeValue',
    label: '考试时长',
    span: 24
  },
  {
    itemType: 'slot',
    prop: 'questionTimeLimitType',
    label: '逐题计时',
    span: 24
  },
  {
    itemType: 'radio',
    prop: 'strategy',
    label: '考试时间策略',
    span: 24,
    options: [
      { label: '允许进入考试的时间', value: false },
      { label: '允许参考时间（到结束时间，会自动提交。）', value: true }
    ]
  },
  {
    itemType: 'slot',
    prop: 'joinNumValue',
    label: '参加次数',
    span: 24
  },
  {
    itemType: 'slot',
    prop: 'integral',
    label: '积分',
    span: 24
  },
  {
    itemType: 'slot',
    prop: 'publishTime',
    label: '发布考试',
    span: 24
  },
  {
    prop: 'environment',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  // {
  //   itemType: 'switch',
  //   span: 11,
  //   prop: 'isLimitIp',
  //   label: '启用IP限制(需设定考生合法IP范围)'
  // },
  // {
  //   itemType: 'switch',
  //   prop: 'isShuffle',
  //   label: '生成试卷时打乱试题和选项顺序',
  //   offset: 2,
  //   span: 11
  // },
  // {
  //   itemType: 'switch',
  //   span: 11,
  //   prop: 'createAnswers',
  //   label: '交卷即时生成答案统计数据(建议大规模考试时不启用)'
  // },
  {
    itemType: 'slotout',
    prop: 'lateBanExam',
    label: '迟到后禁止考试',
    span: 24
  },
  {
    itemType: 'slotout',
    span: 24,
    prop: 'answerBanExam',
    label: '答卷时间过少禁止交卷'
  },
  // {
  //   itemType: 'slot',
  //   span: 11,
  //   offset: 2,
  //   prop: 'preCreate',
  //   label: '启用试卷预生成服务'
  // },
  // {
  //   itemType: 'switch',
  //   span: 11,
  //   offset: 2,
  //   prop: 'isHold',
  //   label: '自动保存答案到服务器'
  // },
  {
    prop: 'privilegeTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'slotout',
    span: 24,
    prop: 'isDecoil',
    label: '允许考生查看本机资料(开卷考试)'
  },
  {
    itemType: 'slotout',
    span: 24,
    prop: 'openResults',
    label: '允许考生查看成绩'
  },
  {
    itemType: 'slotout',
    span: 24,
    prop: 'openAnswerSheet',
    label: '允许考生查看答卷'
  },
  //TODO: 暂时隐藏
  // {
  //   itemType: 'switch',
  //   span: 11,
  //   offset: 2,
  //   prop: 'selfMarking',
  //   label: '允许考生自己评卷'
  // },
  {
    itemType: 'slotout',
    span: 24,
    prop: 'publicAnswers',
    label: '允许考生查看标准答案'
  },
  //TODO: 暂时隐藏
  // {
  //   itemType: 'switch',
  //   span: 11,
  //   offset: 2,
  //   prop: 'openEntrance',
  //   label: '允许考生报名参加考试'
  // },
  // {
  //   itemType: 'switch',
  //   span: 11,
  //   prop: 'isExamine',
  //   label: '考生报名考试需要审批'
  // },
  {
    prop: 'strategyTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  //TODO: 暂时隐藏
  // {
  //   itemType: 'switch',
  //   span: 24,
  //   prop: 'modifyAnswer',
  //   label: '允许评卷人修改考生答案'
  // },
  // {
  //   itemType: 'switch',
  //   span: 11,
  //   offset: 2,
  //   prop: 'modifyLimit',
  //   label: '不允许修改考生客观题及其评分结果'
  // },
  {
    itemType: 'slotout',
    span: 24,
    prop: 'scopeLimit',
    label: '评卷限定最高得分'
  },
  {
    itemType: 'slotout',
    span: 24,
    prop: 'objectiveQuestions',
    label: '手工评卷是否显示客观题'
  },
  {
    itemType: 'slotout',
    span: 24,
    prop: 'decideItem',
    label: '判断题答对得分，不答或答错扣分'
  },
  {
    prop: 'multipleTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'slot',
    prop: 'answerMode1',
    label: '',
    span: 24
  },
  {
    prop: 'branchTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'slotout',
    span: 24,
    prop: 'autoEvaluate',
    label: '自动评定是否通过'
  },
  {
    itemType: 'slot',
    span: 24,
    isHidden: true,
    prop: 'passType',
    label: '通过条件'
  },
  {
    itemType: 'radio',
    span: 11,
    prop: 'publishType',
    label: '发布规则',
    options: [
      { label: '手动发布', value: 3 },
      { label: '系统即时发布', value: 1 },
      { label: '定时自动发布', value: 2 }
    ]
  },
  {
    itemType: 'datePicker',
    isVisible: false,
    span: 11,
    offset: 2,
    type: 'datetime',
    required: true,
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    prop: 'fixedTime',
    label: '定时发布日期时间'
  }
]
export const OFFLINE_COLUMNS = [
  {
    prop: 'basicTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'input',
    span: 11,
    required: true,
    disabled: false,
    maxLength: 50,
    prop: 'examName',
    label: '考试名称'
  },
  {
    itemType: 'treeSelect',
    span: 11,
    offset: 2,
    required: true,
    disabled: false,
    options: [],
    prop: 'categoryId',
    label: '考试分类',
    props: {
      selectParams: {
        placeholder: '请选择分类',
        multiple: false
      },
      treeParams: {
        data: [],
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        filterable: true,
        props: {
          children: 'children',
          label: 'name',
          disabled: 'disabled',
          value: 'id'
        }
      }
    }
  },
  {
    itemType: 'slot',
    span: 11,
    required: true,
    options: [],
    prop: 'testPaper',
    label: '考试用卷'
  },
  {
    itemType: 'lazySelect',
    span: 11,
    offset: 2,
    hasLabelSwitch: true,
    labelSwitchConfig: {
      prop: 'certificate',
      disabled: false
    },
    required: false,
    prop: 'certificateId',
    load: (params) => {
      return getCertificateList(_.assign(params, { status: '1' }))
    },
    optionProps: {
      label: 'name',
      value: 'id',
      key: 'id'
    },
    searchable: true,
    label: '证书模板'
  },
  {
    itemType: 'select',
    span: 11,
    hasLabelSwitch: true,
    labelSwitchConfig: {
      prop: 'publicFlag',
      disabled: false
    },
    required: false,
    prop: 'joinApproveFlag',
    label: '公开报名',
    options: [
      { label: '需要审批', value: 1 },
      { label: '不需要审批', value: 0 }
    ]
  },
  {
    prop: 'joinEndDate',
    disabled: false,
    itemType: 'datePicker',
    offset: 2,
    label: '报名截止日期',
    span: 11
  },
  {
    prop: 'basicInfoTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'slot',
    prop: 'reckonTimeValue',
    label: '考试时长',
    span: 24
  },
  {
    itemType: 'slot',
    prop: 'integral',
    label: '积分',
    span: 24
  },
  {
    itemType: 'slot',
    prop: 'publishTime',
    label: '发布考试',
    span: 24
  },
  {
    prop: 'privilegeTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'slotout',
    span: 24,
    prop: 'isDecoil',
    label: '允许考生查看本机资料(开卷考试)'
  },
  {
    itemType: 'slotout',
    span: 24,
    prop: 'openResults',
    label: '允许考生查看成绩'
  },
  {
    prop: 'branchTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'slotout',
    span: 24,
    prop: 'autoEvaluate',
    label: '自动评定是否通过'
  },
  {
    itemType: 'slot',
    span: 24,
    isHidden: true,
    prop: 'passType',
    label: '通过条件'
  },
  {
    itemType: 'radio',
    span: 11,
    prop: 'publishType',
    label: '发布规则',
    options: [
      { label: '手动发布', value: 3 },
      { label: '系统即时发布', value: 1 },
      { label: '定时自动发布', value: 2 }
    ]
  },
  {
    itemType: 'datePicker',
    isVisible: false,
    span: 11,
    offset: 2,
    type: 'datetime',
    required: true,
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    prop: 'fixedTime',
    label: '定时发布日期时间'
  }
]
