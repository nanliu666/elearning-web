export const commonParams = {
  // type: 'treeSelect',
  // field: 'orgId',
  // label: '部门',
  // data: '',
  // config: {
  //   selectParams: {
  //     placeholder: '请选择',
  //     multiple: false
  //   },
  //   treeParams: {
  //     data: [],
  //     'check-strictly': true,
  //     'default-expand-all': false,
  //     'expand-on-click-node': false,
  //     clickParent: true,
  //     filterable: false,
  //     props: {
  //       children: 'children',
  //       label: 'orgName',
  //       disabled: 'disabled',
  //       value: 'orgId'
  //     }
  //   }
  // },

  label: '部门',
  disabled: false,
  field: 'orgId',
  data: '',
  placeholder: '请选择部门',
  type: 'lazycascader',
  filterMethod: () => {},
  filterProps: {},
  options: [],
  change: () => {},
  props: {}
}
