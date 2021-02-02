## 分页下拉选择器

基于el-select进行二次封装,下拉选项支持分页加载

### Attributes 配置


| 参数        | 说明                                                                           |   类型   |            默认值             |
| :---------- | :----------------------------------------------------------------------------- | :------: | :---------------------------: |
| load        | 接口调用函数，返回Promise                                                      | Function |               -               |
| pageSize    | 每页条数                                                                       |  Number  |              10               |
| value       | 绑定值,支持 v-model双向绑定                                                    |  Object  |               -               |
| searchable  | 是否可搜索，调用接口搜索，搜索传参为search                                     | Boolean  |               -               |
| optionProps | 选项配置，见下                                                                 |  Object  | {label:'label',value:'value'} |
| firstOption | 默认选项,解决初始已选中的值没有被翻译的问题,相当于手动在选项列表里添加一个选项 |  Object  |               -               |
| allowCreate | 允许创建条目，详见el-select组件的allowCreate                                   |  Object  |             false             |
| disable     | 是否禁用                                                                       | Boolean  |             false             |
| multiple    | 多选                                                                           | Boolean  |             false             |
| placeholder | 占位                                                                           |  String  |            请选择             |

### optionProps 配置

| 参数     | 说明                                             |   类型   | 默认值 |
| :------- | :----------------------------------------------- | :------: | :----: |
| label    | label用的字段                                    |  String  | label  |
| value    | value用的字段                                    |  String  | value  |
| key      | 选项数组的唯一key字段,不填时默认用value做唯一key |  String  |   -    |
| fomatter | 格式化函数，用于自定义选项的渲染                 | Function |   -    |

### Events 

| 事件名称 | 说明         |    回调参数    |
| :------- | :----------- | :------------: |
| change   | 选择时的回调 |  选项的value   |
| select   | 选择时的回调 | 完整的选项对象 |

### 示例代码

```html
  <lazy-select  
    v-model="form.userId"
    :load="loadUser"
    placeholder="请选择组织负责人"
    :option-props="{
      label:'name',
      value:'userId',
      key:'userId'
    }"
  />
```
```js
  {
    data(){
      return {
        form:{
          userId:null
        }
      }
    },
    methods:{
      loadUser(params) {
        return getUserWorkList(params)
      },
    }
  }
```