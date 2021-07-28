## 简介

易宝内训前端后台项目， 框架源码来自：[Saber](https://saber.bladex.vip) (基于 Vue、Element-UI)

## 依赖

* 主要依赖：vue vuex vue-router element-ui 

* MockJS [参考](https://juejin.im/post/5cf726b5e51d454fbf5409bc),[官方示例](http://mockjs.com/examples.html)

* 富文本编辑器[tinymce](https://github.com/tinymce/tinymce-vue)

* 拖拽组件[vue-draggable](https://github.com/SortableJS/Vue.Draggable)

* 时间处理库[moment](http://momentjs.cn/docs/#/use-it/)

* [lodash](https://www.lodashjs.com/),整合了常用的工具函数，熟练使用可以加快开发效率
  
* vue-common-table通用表格组件,封装了el-table、el-pagination，另外添加了顶部菜单栏等功能详见[api文档](https://github.com/kingqi/vue-common-table/blob/master/README.md)
## 启动

* 建议使用yarn作为包管理器，yarn命令使用更简洁，依赖加载速度更快

* 执行`yarn pre`安装依赖,本地启动使用`yarn serve`,打包使用`yarn build`

* `yarn build`会自动生成压缩包到根路径

## 开发注意事项

### 路由

* 项目使用动态路由，菜单和路由都是通过接口数据动态添加,请不要私自把业务页面路由添加到router文件夹内,router文件夹只用于放置一些不需要权限控制的路由，例如登录个人中心

* 为了方便开发页面菜单接口的Mock是默认开启的，添加新页面时请到`src/mock/modules/menu`文件夹下对应的模块添加菜单，如果是新模块可以在这个文件夹下添加新文件，格式统一按下面示例：
```js
export default {
  sort: 7,// 排序
  menuId: '1590112075691',// 菜单ID需要保证唯一
  menuName: '流程管理',// 菜单名称
  menuType: 'Dir', // 菜单类型，Dir：目录，Menu：菜单；Button：按钮
  isOwn: 1, // 是否拥有 0：否，1：是
  isEnabled: 1,// 是否停用 0停用 1启用
  isShow: 1, // 是否显示在菜单栏 0：否，1：是
  code: 'approval',// 目前没用上
  alias: 'approval',// 目前没用上
  path: '',// 菜单路径，目录类型的菜单不需要填路径
  icon: 'iconfont iconicon_setting',// 菜单图标，mock可以不填
  children: [
    {
      menuId: '15901120756913',
      menuName: '审批流程',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, 
      isShow: 1,
      code: 'approval_approval',
      alias: 'approval',
      path: '/apprProcess/approvalList',// path跟实际文件的相对路径一致
      icon: 'iconfont iconicon_compile'
    },
  ]
}
```
* 注意菜单类型的路由的children里不能放菜单类型的路由，只能放按钮类型的路由
### MOCK

* 项目引入了MockJS,可以对所有接口进行模拟

* Mock代码位于`/src/mock`文件夹,文件夹下的`knowledge.js`是mock主入口，这里可以控制所有mock的打开和关闭,文件夹下的`modules`文件夹下是各个业务对应MOCK文件，一般一个模块写一个js文件

* 写法统一按下面示例
```js
/* eslint-disable no-console */
import Mock from 'mockjs'
export default ({ mock }) => {
  if (!mock) return
   // 发起人指定角色查询接口
  Mock.mock(new RegExp('/appr/v2/appr/user/role' + '(\\?.*)?$'), 'get', (req) => {
    let obj = Mock.mock({
      ccNum: '@integer(1,100)',// 随机生成1到100中间的整数
      myNum: '@integer(1,100)',
      waitNum: '@integer(1,100)'
    })
    return {
      resCode: 200,
      resMsg: '',
      response: obj
    }
}
```

* 例如上面的`@integer`,MockJS有很多类似Api用于生成随机数据,详见[官方示例](http://mockjs.com/examples.html)

* 强烈建议所有前端在开发页面时拿到接口文档后就要根据文档对接MOCK，可以大幅缩短联调的时间 

* 注意MockJS会跟七牛云上传有冲突，如果遇到本地上传不了时，把`main.js`最上面的MockJS引入注释掉就可以了，注意不用把注释这个操作提交到git


### lint

* 项目添加eslint+commitLint，eslint用于提高代码质量，commitLint用于限制commit消息格式

* git commit消息格式按照 `.commitlintrc.js`文件中的关键词＋＇:＇＋提交信息，否则将无法提交代码，请仔细看一下`.commitlintrc.js`中的注释，使用正确的关键词

* 项目加了commit触发的格式化工作流，每次提交前会检查并格式化所有提交的代码，遇到报错请解决掉对应的问题再提交代码


### 公共组件

* 公共组件位于`/src/components/`文件夹下，常用组件文件夹内都有对应的详细文档`README.md`，使用时注意先看文档，下面列出常用的公共组件

* common-form 通用表单组件 开发表单建议都使用common-form组件，这个组件对el-form和多种输入组件进行了封装，并且支持自定义渲染，已全局注册

* common-table 通用表格组件 这个组件不在这个文件夹下,它放在npm上，[api文档](https://github.com/kingqi/vue-common-table/blob/master/README.md),已全局注册直接使用即可，一般的列表页都应该使用这个组件编写，比直接使用el-table可以大幅提高开发效率

* common-upload 通用上传组件

* searchPopOver 列表通用筛选组件

* page-header 页头组件

* elTreeSelect 下拉树选择器

* lazySelect 分页下拉选择器,基于el-select开发，添加滚动翻页功能

* image-viewer 图片预览组件，包括放大缩小旋转等功能

* user-picker 人员选择器
### 风格规范

* 尽量使用ES6语法，[参考](https://es6.ruanyifeng.com/#docs/style)

* 开发vue相关要按照vue[官方代码规范](https://cn.vuejs.org/v2/style-guide/index.html)开发

* vue文件使用首字母大写的驼峰式命名，例如 `ElTreeSelect.vue`
  
* js文件和文件夹使用短横线命名，例如 `el-tree-select`

* js命名规范按照[AlloyTeam规范文档](http://alloyteam.github.io/CodeGuide/#js-variable-naming)
### 其他

* axios已封装，`/src/router/axios.js`中提供了get/put/post/del方法，接口调用成功后只返回接口数据的response字段，其他字段仅做全局使用

* 字典组调用已在vuex写好，使用时请调用dispatch CommonDict,传对应的字典组名,将返回一个Promise对象，代码示例如下
  ```js
    this.$store.dispatch('CommonDict', 'WorkProperty').then((res) => {
        this.workPropertyList = res
    })
  ```

* 开发前看一下util文件夹下的函数，常用的校验正则，cookie,store等工具函数都有，不要自己造轮子

## 主要代码结构

```
├── vue.config.js // Vue配置文件
├── public 静态文件
└── src
    ├──api // 接口定义
    ├──components // 公共组件 (多个模块都会用到的组件)
    │    ├──treeSelect // 下拉树选择
    │    ├──base-container // 通用容器组件
    │    ├──base-container // 通用容器组件
    │    ├──common-upload // 通用上传组件
    │    ├──common-form // 通用表单组件
    │    └──searchPopover // 通用弹窗筛选组件
    ├──directive // 自定义指令
    │    ├──loadmore.js //v-loadmore elementUI select选项滚动加载更多
    │    └──pcheck.js //v-p 权限校验，不通过则隐藏
    ├──mock // mock代码
    │    ├──knowledge.js // mock总开关
    │    ├──menu.js // 菜单mock
    │    └──。。。 // 其他接口mock，分模块放置接口mock
    ├──page // 基础布局组件
    ├──router // 路由
    │    ├──page // 基础路由，不鉴权路由
    │    └──axios.js // axios封装，请求拦截
    ├──store // vuex
    │    ├──modules 
    │    │   ├──dict.js // 字典组
    │    │   └──user.js // 用户信息
    │    └──getters.js
    ├──style // 全局样式
    │    ├──oa-custom // 自定义element-ui样式
    │    └──common.css // 全局样式
    ├──util // 工具
    │    ├──uploadQiniu.js // 上传到七牛云
    │    └──。。。 // 常用工具类
    ├──views // 业务页面
    │    ├──system // 系统管理
    │    ├──orgs // 组织机构
    │    └──personnel // 花名册
    └──main.js // 项目入口
```
