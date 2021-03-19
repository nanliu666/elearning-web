<template>
  <div
    v-if="tableData"
    class="courseTask"
  >
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        :label="'课程: ' + rowData.courseName"
        prop="name"
        width="480px"
      >
        <template slot-scope="scope">
          <div>
            <span> {{ scope.row.fileName }} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label=""
        prop="fileSize"
      >
        <template slot-scope="scope">
          <div>
            <span> {{ scope.row.fileSize + 'k' }} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label=""
        prop="updateTime"
      >
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-button
            type="text"
            @click="handleUpload()"
          >
            打包下载
          </el-button>
        </template>
        <template slot-scope="scope">
          <!-- <el-button type="text">
              下载  {{scope.row.filePath}}
            </el-button> -->
          <a
            style="color:#01aafc; cursor:pointer;"
            @click="downLoadInfo(scope.row)"
          > 下载 </a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { courseFeelListByUserId } from '@/api/course/course'
import { downLoadFile } from '@/util/util'
import { getStore } from '@/util/store.js'
// import axios from 'axios'
export default {
  data() {
    return {
      tableData: [],
      stuId: '',
      rowData: ''
    }
  },
  activated() {
    this.rowData = JSON.parse(this.$route.query.row)
    this.stuId = this.rowData.stuId
    this.getInfo()
  },
  methods: {
    downLoadInfo(data) {
      // 下载
      downLoadFile(data)
    },
    async getInfo() {
      let params = { courseId: this.$route.query.courseId, stuId: this.stuId }
      let res = await courseFeelListByUserId(params)
      this.tableData = res
    },
    // 打包下载
    handleUpload() {
      let params = {
        filePath: '',
        fileName: '',
        zipComment: '89898.zip',
        responseType: 'blob',
        emulateJSON: true
      }
      this.tableData.forEach((item) => {
        params.filePath += item.filePath + ',' //.push(item.filePath)
        params.fileName += item.fileName + ',' //.push(item.fileName)
      })
      let url = `api/common/oss/download/zip?filePath=${params.filePath}&fileName=${params.fileName}
      &responseType=blob&emulateJSON=true&zipComment=${params.zipComment}`
      // axios.get('/api/common/oss/download/zip', {
      //   responseType: 'blob',
      //   headers: {
      //     accessToken: `bearer  ${token}`
      //   },
      //   params
      // }).then((res)=>{
      //   debugger
      // })
      // axios.get('/api/common/oss/download/zip',params).then((res)=>{
      //   debugger
      // })
      // zip(params).then((res) => {
      //   console.log(res)
      //   this.repDownload(res)
      // })
      this.repDownload(url)
    },
    repDownload(url) {
      //url = 'http://localhost:1888/api/common/oss/download/zip?filePath=https:%2F%2Foa-file-dev.bestgrand.com.cn%2F000c3bd2fa7b4d379d6a3e5e64c7bcba.png,https:%2F%2Foa-file-dev.bestgrand.com.cn%2Fbed127b60e13423e9bccd36eb6384f0b.txt,https:%2F%2Foa-file-dev.bestgrand.com.cn%2Fd466a8f6e9dd4b118ec759be3be6c347.png,https:%2F%2Foa-file-dev.bestgrand.com.cn%2Fbd506f5ce4ce46c2bbf788efdf596ca9.png,&fileName=bg.png,git.txt,bg.png,123.png,&zipComment=%E6%B5%8B%E8%AF%95%E8%81%94%E8%B0%83%E5%A4%9A%E4%B8%AA%E4%BD%9C%E4%B8%9A.zip&responseType=blob&emulateJSON=true'

      // if (!url) {
      //   this.$message.error('视频路径不存在')
      //   return
      // }
      // 下载
      let token = getStore({ name: 'token' })
      let x = new XMLHttpRequest()

      x.open('GET', url, true)
      x.setRequestHeader('accessToken', `bearer  ${token}`)
      x.responseType = 'blob'
      x.onprogress = function() {}
      x.onload = function() {
        let url = window.URL.createObjectURL(x.response)
        let a = document.createElement('a')
        a.href = url
        a.download = '' //可以填写默认的下载名称
        a.click()
      }
      x.send()
    }
  }
}
</script>
<style lang="scss" scoped>
.courseTask {
  border: 1px solid #dcdee3;
  /deep/.el-table tr {
    height: 50px !important;
  }
}
</style>
