## 通用上传组件

内置七牛云上传方法

### Attributes 配置, 另外支持el-upload组件的所有参数

| 参数  | 说明                |  类型   | 默认值 |
| :---- | :------------------ | :-----: | :----: |
| value | 绑定值, 支持v-model | Boolean | false  |

### Table-column Scoped Slot

| name | 说明              |
| :--- | :---------------- |
| -    | 自定义内容,无参数 |
| tip  | 说明,无参数       |

```html
  <common-upload
    v-model="form.resume"
    :multiple="false"
  >
    <el-button
      v-if="form.resume.length===0"
      size="medium"
    >
      上传简历
    </el-button>
    <el-button
      v-else
      size="medium"
      type="text"
    >
      {{ form.resume[0].localName }}
    </el-button>
  </common-upload>
```

js

```js
{
  data(){
    return {
      form:{
        resume:[
          {
            fileUrl:"",//文件url
            fileName:"",// 文件名
            localName:"" // 原始文件名
          }
        ]
      }
    }
  }
}
```