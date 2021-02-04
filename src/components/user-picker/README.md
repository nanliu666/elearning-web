# 部门/人员选择器

示例代码位于 `src\views\demo\demoTest.vue`，本地打开 [demo](http://localhost:1888/#/demo/test) 可看到demo

暂时只支持部门人员和外部人员选择

### Attributes 配置

| 参数       | 说明                                                                 |  类型   | 默认值 |
| :--------- | :------------------------------------------------------------------- | :-----: | :----: |
| title      | 标题文字                                                             | String  |   -    |
| value      | 绑定值，支持v-model双向绑定                                          | String  |   -    |
| isSingle   | 是否单选                                                             | Boolean | false  |
| visible    | 弹窗是否显示,支持.sync双向绑定                                       | Boolean | false  |
| selectType | 选择类型，用逗号分隔，可选项包括 Org(组织机构),OuterUser(外部联系人) | String  |  Org   |

### 代码示例
```html
  <user-picker
    v-model="users"
    :visible.sync="visible"
  >
  </user-picker>
```