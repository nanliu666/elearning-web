# 部门/人员选择器

示例代码位于 `src\views\course\components\catalogEdit.vue`，本地打开 [新建分类](http://localhost:1888/#/course/catalog) 可看到demo

暂时只支持部门人员和外部人员选择

### Attributes 配置

| 参数               | 说明                                                                        |  类型   | 默认值 |
| selectedValue      | 返回选中的数组                                                              |  function |   -    |
| idList             | 回显的id                                                                    |  list |   -    |

### 代码示例
```html
   <OrgTree :idList="idList" @selectedValue="getUserList"></OrgTree>
```