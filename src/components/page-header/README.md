## 通用页头组件

统一使用这个组件作为页面标题，以保证样式统一

### Attributes 配置

| 参数     | 说明             |   类型   | 默认值 |
| :------- | :--------------- | :------: | :----: |
| title    | 标题文字         |  String  |   -    |
| showBack | 是否显示返回箭头 | Boolean  |  true  |
| back     | 自定义返回方法   | Function |   -    |

### Slot

| name      | 说明           |
| :-------- | :------------- |
| title     | 自定义标题     |
| rightMenu | 自定义右侧菜单 |

### 示例

```js
    <page-header
      title="添加候选人"
      show-back
    >
      <template slot="rightMenu">
        <el-button
          type="primary"
          size="medium"
        >
          添加
        </el-button>
      </template>
    </page-header>
```