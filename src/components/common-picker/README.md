## common-picker
可能是这个项目，最好用的通用选择组件
左边加上你想选的东西，右边是选择结果
```html
  <common-picker
    v-model="personList"
    :visible.sync="personPickerVisible"
    :options="personPickerOptions"
  />
```

### Attributes 配置
```js
{
  props: {
    props: {
      label: 'bizName', // 右边已选择列表的label
      value: 'bizId', // 右边已选择列表的key
      select: ['bizId', 'bizName', 'orgName', 'positionName', 'workNo', 'phoneNum'] // 要提取到已选择列表的值的key
    },
    options: [  // 传入一个对象 代表一个tab
      {
        name: '组织机构',  // tab名
        request: getOrgUserChild, // tab请求接口
        type: 'tree', // tab的类型 tree 和 table(checkbox)
        placeholder: '搜索组织部门或成员姓名', // 搜索placeholder
        checkRequest: { // tree类型的opiton。非tree 不用 点击复选框时自定义接口请求
          condition: function(node) { // 点击请求的条件 返回值 布尔值
            return !node.userId
          },
          api: function(node, resolve) { // 点击请求的api 使用resolve（data）把最终datg传出去 。ps：可以先做下数据处理
            getUserList({ orgId: node.id }).then((res = []) => {
              resolve(res)
            })
          }
        },
        treeOption: { // tree类型的opiton。非tree 不用
          checkStrictly: false, // 官方文档一致
          props: {
            label: 'name', // tree显示label的key 官方文档一致
            children: 'children' // tree显示children的key 官方文档一致
          },
          nodeKey: 'userId', // tree的node-key 官方文档一致 必须使用和props一样的value
        },
        query: { // load数据的参数
          search: { // 搜索框的
            key: 'search', // 参数的key
            value: '' //参数的初始默认值
          },
          id: { // load数据的id
            key: 'parentId',
            value: '0',
            from: 'orgId'  // 取自左边数据列表的哪个字段。必需
          }
        },
        response: {
            props: {
                data: 'data', // 要取得数据key 。可以为string也可以为array  比如 返回的数据是这样：{orgs=: [],users: []},如果你只需要orgs，那只写orgs。
                total: 'totalNum' // 后端返回数据总页数的的key 
            }
        },
        resolveRequest: { // tree类型的opiton。非tree 不用 用于树展开的时候进行自定义请求
          condition: function(node) { // 请求条件，返回为true才进行请求
            // node 是el-tree的node
            return !node.data.userId
          },
          handler: function (node, resolve) {
            // node 是el-tree的node
            getUsergroupList({ ids: node.data.id }).then(res => {
              resolve(res)
            })
          }
        },
        props: { // 长得和上面props一样（注意不是options里面的props）。理所当然是一一对应的。这里配置tab要被选择的字段。label会作为选择的label的key。value作为userId的key。select是选择时会提取出来的值的key。要求位置和上面props一一对应
          value: 'userId',
          select: ['userId', 'name', 'orgName', 'positionName', 'workNo', 'phoneNum']
        },
      }
    ],
    selectedStyle: {
      icon: 'icon-approval-checkin-bicolor', // 右边选择列表的icon
      label: function(node) { // 可以是函数也可以字符串
            const { bizName, phoneNum } = node
            if (phoneNum) {
              return bizName + '(' + phoneNum + ')'
            }
            return bizName
      } // 右边选择列表的label格式化方法
    },
    visible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String, 
      default: '添加人员'  // 选择框标题
    },
    headerTitle: {
      type: String,
      default: '请选择人员' // 二级标题
    },
    reserve: {
      type: Boolean,  // 是否保留默认的options 二个tab 。一个是选组织机构 一个是选外部人员
      default: true
    }
  }
}
```
