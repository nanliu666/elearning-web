// const validate = (rule, value, callback) => {
//   callback()
// }
export const columns = [
  {
    span: 24,
    prop: 'processName',
    itemType: 'input',
    maxlength: 20,
    label: '审批名称',
    required: true
  },
  {
    span: 24,
    prop: 'processType',
    itemType: 'select',
    label: '流程类型',
    required: true,
    options: [
      {
        label: '课程审批',
        value: 1
      }
    ]
  },
  {
    span: 24,
    prop: 'approverDistinct',
    itemType: 'select',
    label: '审批人去重',
    placeholder: '请选择去重类型',
    options: [
      {
        label: '仅对连续出现的审批人去重',
        value: 1
      },
      {
        label: '仅保留流程中的第一个',
        value: 2
      },
      {
        label: '不做任何处理',
        value: 0
      }
    ]
  },
  {
    span: 24,
    prop: 'isOpinion',
    label: '审批意见',
    itemType: 'slot',
    props: {
      label: 'label',
      value: 'value'
    }
  },

  {
    span: 24,
    prop: 'tip',
    itemType: 'input',
    type: 'textarea',
    label: '审批意见填写提示',
    clearable: true,
    maxlength: 200,
    showWordLimit: true,
    autosize: {
      minRows: 6,
      maxRows: 10
    }
  }
]
