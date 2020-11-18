export const COLUMNS = [
  {
    label: '姓名',
    prop: 'name'
  },
  {
    label: '账号',
    prop: 'account'
  },
  //状态，1-正常，2-禁用
  {
    label: '状态',
    prop: 'userStatus',
    filters: [
      {
        text: '正常',
        value: '1'
      },
      {
        text: '禁用',
        value: '2'
      }
    ],
    filterMethod: (value, row) => {
      return row.userStatus == value
    },
    formatter(record) {
      return (
        {
          '1': '正常',
          '2': '禁用'
        }[record.userStatus] || ''
      )
    }
  },
  {
    label: '角色',
    prop: 'roleName',
    formatter(record) {
      let roleNames = record.roles.map((role) => {
        return role.roleName
      })
      return roleNames.join(';')
    }
  },
  {
    label: '电话',
    prop: 'phonenum'
  },
  {
    label: '邮箱',
    prop: 'userEmail'
  }
]

export const USERSTATUS = {
  suspend: '2',
  unsuspend: '1'
}

export const FORM_COLUMNS = [
  {
    label: '姓名',
    itemType: 'input',
    prop: 'name',
    span: 24,
    offset: 0,
    required: true,
    props: {
      hideColon: true
    }
  },
  {
    label: '账号',
    itemType: 'slot',
    prop: 'account',
    span: 24,
    offset: 0,
    maxlength: 20,
    required: true,
    props: {
      hideColon: true
    }
  },
  {
    label: '角色',
    itemType: 'slot',
    prop: 'roles',
    span: 24,
    offset: 0,
    required: true,
    options: [],
    props: {
      label: 'roleName',
      value: 'roleId',
      hideColon: true
    }
  },
  {
    label: '分类',
    itemType: 'slot',
    prop: 'categoryId',
    span: 24,
    offset: 0,
    required: true,
    options: [],
    props: {
      label: 'name',
      value: 'value',
      hideColon: true
    }
  },
  {
    itemType: 'slot',
    label: '手机号码',
    offset: 0,
    prop: 'phonenum',
    required: true,
    span: 24,
    maxlength: 11,
    props: {
      hideColon: true
    },
    rules: [
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      { pattern: /^1[3|4|5|8][0-9]\d{4,8}$/, message: '手机格式有误', trigger: 'blur' }
    ]
  },
  {
    itemType: 'input',
    label: '邮箱',
    offset: 0,
    prop: 'userEmail',
    span: 24,
    props: {
      hideColon: true
    },
    rules: [
      { message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱格式有误', trigger: ['blur', 'change'] },
      { validator: checkEmail, trigger: 'blur' }
    ]
  }
]

const checkEmail = (rule, value, callback) => {
  const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  setTimeout(() => {
    if (!value || mailReg.test(value)) {
      callback()
    } else {
      callback(new Error('邮箱格式有误'))
    }
  }, 100)
}
