import { getOrgChild } from '@/api/train/train'
import { getPostionUserChild2, getGroup } from '@/api/system/user'
import { getUsergroupList, getPositionUserList1 } from '@/api/examManage/schedule'
import { getStationParent } from '@/api/system/station'
export const COLUMNS_CONFIGS = [
  {
    prop: 'examTime',
    itemType: 'datePicker',
    type: 'datetimerange',
    rules: [
      { required: true, message: '请选择考试时间', trigger: 'blur' },
      { validator: () => {}, trigger: 'change' }
    ],
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    span: 11,
    label: '考试时间'
  },
  {
    itemType: 'slot',
    span: 11,
    offset: 2,
    hasLabelSolt: true,
    hasLabelRight: true,
    required: false,
    disabled: true,
    prop: 'classroomId',
    label: '',
    searchable: true
  }
]
export const PERSON_OPTIONS = [
  {
    name: '岗位',
    request: getStationParent,
    type: 'scroll-tree',
    placeholder: '搜索岗位名称',
    response: {
      props: {
        data: 'data',
        total: 'totalNum'
      }
    },
    treeOption: {
      props: {
        label: 'name',
        children: 'children'
      },
      'check-strictly': false,
      nodeKey: 'userId'
    },
    props: {
      value: 'userId',
      select: [
        'userId',
        'name',
        'orgName',
        'positionName',
        'workNo',
        'phoneNum',
        'orgId',
        'positionId'
      ]
    },
    label: function(data) {
      const { name } = data
      return name
    },
    query: {
      search: {
        key: 'name',
        value: ''
      },
      page: {
        key: 'pageNo',
        value: 1
      },
      pageSize: {
        key: 'pageSize',
        value: 50
      }
    },
    resolveRequest: {
      handler() {
        return false
      }
    },
    checkRequest: {
      handler: function($data, resolve) {
        getPositionUserList1({ parentId: $data.id }).then((res = {}) => {
          if (Array.isArray(res)) {
            resolve(res)
          } else {
            let data = []
            Object.keys(res).forEach((key) => {
              data = data.concat(res[key])
            })
            resolve(data)
          }
        })
      }
    }
  },
  // {
  //   name: '岗位',
  //   response: {
  //     props: {
  //       data: ['positions', 'users']
  //     }
  //   },
  //   request: getPostionUserChild2,
  //   type: 'tree',
  //   placeholder: '搜索岗位名称',
  //   checkRequest: {
  //     condition: function($data) {
  //       return !$data.userId
  //     },
  //     handler: function($data, resolve) {
  //       getPositionUserList1({ parentId: $data.positionId }).then((res = {}) => {
  //         if (Array.isArray(res)) {
  //           resolve(res)
  //         } else {
  //           let data = []
  //           Object.keys(res).forEach((key) => {
  //             data = data.concat(res[key])
  //           })
  //           resolve(data)
  //         }
  //       })
  //     }
  //   },
  //   treeOption: {
  //     props: {
  //       label: function(node) {
  //         if (node.positionId) {
  //           return node.positionName
  //         }
  //         return node.name
  //       },
  //       children: 'children',
  //       selectLabel: 'name'
  //     },
  //     nodeKey: 'userId'
  //   },
  //   query: {
  //     search: {
  //       key: 'search',
  //       value: ''
  //     },
  //     id: {
  //       key: 'parentId',
  //       value: '0',
  //       initialValue: '0',
  //       from: 'positionId'
  //     }
  //   },
  //   props: {
  //     value: 'userId',
  //     select: ['userId', 'name', 'orgName', 'positionName', 'workNo', 'phoneNum', 'orgId']
  //   }
  // },
  {
    name: '分组',
    request: getGroup,
    resolveRequest: {
      condition: function(node) {
        // node 是el-tree的node
        return !node.data.userId
      },
      handler: function(node, resolve) {
        // node 是el-tree的node
        getUsergroupList({ ids: node.data.id }).then((res) => {
          resolve(res)
        })
      }
    },
    type: 'tree',
    placeholder: '搜索分组名称',
    treeOption: {
      props: {
        label: 'name',
        children: 'children'
      },
      'check-strictly': false,
      nodeKey: 'userId'
    },
    checkRequest: {
      condition: function(data) {
        return !data.userId
      },
      handler: function(data, resolve) {
        getUsergroupList({ ids: data.id }).then((res) => {
          resolve(res)
        })
      }
    },
    props: {
      value: 'userId',
      select: ['userId', 'name', 'orgName', 'positionName', 'workNo', 'phoneNum', 'orgId']
    },
    response: {
      props: {
        data: 'records',
        total: 'totalNum'
      }
    },
    label: function(node) {
      const { name } = node
      return name
    },
    query: {
      search: {
        key: 'search',
        value: ''
      }
    }
  }
]
export const ORG_OPTIONS = [
  {
    name: '部门',
    request: getOrgChild,
    type: 'tree',
    placeholder: '搜索部门名称',
    treeOption: {
      'check-strictly': true,
      props: {
        label: 'name',
        children: 'children'
      },
      nodeKey: 'id'
    },
    resolveRequest: {
      handler: function(node, resolve) {
        const {
          data: { id, parentIds }
        } = node
        getOrgChild({ parentId: id }).then((res) => {
          const { orgs = [] } = res
          orgs.forEach((org) => {
            org.parentIds = parentIds ? [id].concat(parentIds) : [id]
          })
          resolve(orgs)
        })
      }
    },
    query: {
      search: {
        key: 'search',
        value: ''
      },
      id: {
        key: 'parentId',
        value: '0',
        initialValue: '0',
        from: 'id'
      }
    },
    response: {
      props: {
        data: 'orgs'
      }
    },
    props: {
      value: 'id',
      select: ['id', 'name', 'workNum', 'parentIds']
    }
  }
]
export const POSITION_OPTIONS = [
  {
    name: '岗位',
    request: getStationParent,
    type: 'scroll-tree',
    placeholder: '搜索岗位名称',
    response: {
      props: {
        data: 'data',
        total: 'totalNum'
      }
    },
    treeOption: {
      props: {
        label: 'name',
        children: 'children'
      },
      'check-strictly': false,
      nodeKey: 'id'
    },
    props: {
      value: 'id',
      select: ['id', 'name', 'workNum']
    },
    label: function(data) {
      const { name } = data
      return name
    },
    query: {
      search: {
        key: 'name',
        value: ''
      },
      page: {
        key: 'pageNo',
        value: 1
      },
      pageSize: {
        key: 'pageSize',
        value: 50
      }
    },
    resolveRequest: {
      handler() {
        return false
      }
    }
  }
]
export const ORG_PROPS = {
  label: 'name',
  value: 'id',
  select: ['id', 'name', 'workNum']
}
export const POSITION_PROPS = {
  label: 'positionName',
  value: 'positionId',
  select: ['positionId', 'positionName', 'workNum']
}
export const POSITION_STYLE = {
  icon: 'icon-usercircle2',
  label: function(node) {
    const { positionName } = node
    return positionName
  }
}
export const ORG_STYLE = {
  icon: 'icon-usercircle2',
  label: 'name'
}
export const ERROR_MAP = {
  phonenum: '账号（用户手机号码）填写错误或不存在',
  workNo: '用户编号填写错误或不存在',
  userName: '姓名填写错误或不存在',
  orgName: '所在部门填写错误或不存在',
  positionName: '用户岗位填写错误或不存在'
}
