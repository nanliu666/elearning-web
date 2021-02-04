## 通用页面容器组件

主要内容就是一个el-card组件，另外添加了高度相关的样式, 使用时组件传 block=true 时，会开启height:100%

推荐都使用这个组件作为页面容器，然后添加如下样式，可以保证页面正文内容最小高度一致,使用时参考已有页面去写

```scss
/deep/.basic-container--block {
  // 92px是page-header高度68px+底部留白的24px之和，大多数页面高度都是这个，少数不满足的页面请自行计算高度
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
}
```
