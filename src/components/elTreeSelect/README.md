## 下拉树选择器

基于el-select和el-tree组件封装，从网上找的写好的组件


主要是下面两个参数，selectParams是传递给el-select组件的参数，treeParams是传递给el-tree的参数
```js
{
  selectParams: {
    default() {
      return {
        clearable: true,
        disabled: false,
        placeholder: '请选择',
        multiple: false
      }
    },
  },
  treeParams: {
    default() {
      return {
        clickParent: false,
        filterable: false,
        data: [],
        props: {
          children: 'children',
          label: 'name',
          code: 'code',
          value: 'flowId',
          disabled: 'disabled'
        }
      }
    }
  }
}
```

最常用的部门选择配置如下
```js
{
  selectParams: {
    placeholder: '请选择部门',
    multiple: true
  },
  treeParams: {
    data: [],
    'check-strictly': true,
    'default-expand-all': false,
    'expand-on-click-node': false,
    clickParent: true,
    filterable: false,
    props: {
      children: 'children',
      label: 'orgName',
      disabled: 'disabled',
      value: 'orgId'
    }
  }
}
```