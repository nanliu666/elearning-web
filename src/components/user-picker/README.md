# 部门/人员选择器

示例代码位于 src\views\demo\demoTest.vue，本地打开 [demo](http://localhost:1888/#/demo/test) 可看到demo

暂时只支持部门和人员选择，外部人员/角色开发中

```html
  <user-picker
    v-model="users"
    :visible.sync="visible"
  >
  </user-picker>
```