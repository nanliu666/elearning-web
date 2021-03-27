<template>
  <div
    v-if="tableData"
    class="courseTask"
  >
    <el-table
      v-loading="isLoading"
      :data="tableData"
      style="width: 100%"
      element-loading-text="拼命打包下载中，请稍等！！！"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-table-column
        :label="'课程: ' + rowData.courseName"
        prop="name"
        width="550px"
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
      rowData: '',
      isLoading: ''
    }
  },
  activated() {
    this.rowData = JSON.parse(this.$route.query.row)
    this.stuId = this.rowData.stuId
    this.getInfo()
  },
  created() {
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
      this.isLoading = true
      let params = {
        filePath: '',
        fileName: '',
        zipComment: encodeURIComponent('DownloadFiles.zip'),
        responseType: 'blob',
        emulateJSON: true
      }
      this.tableData.forEach((item) => {
        params.filePath += item.filePath + ',' //.push(item.filePath)
        params.fileName += item.fileName + ',' //.push(item.fileName)
      })
      let url = `api/common/oss/download/zip?filePath=${params.filePath}&fileName=${params.fileName}
      &responseType=blob&emulateJSON=true&zipComment=${params.zipComment}`
      this.repDownload(url)
    },
    repDownload(url) {
      // 下载
      let token = getStore({ name: 'token' })
      let x = new XMLHttpRequest()

      x.open('GET', url, true)
      x.setRequestHeader('accessToken', `bearer  ${token}`)
      x.responseType = 'blob'
      x.onprogress = function() {}
      x.onload = () => {
        let url = window.URL.createObjectURL(x.response)
        let a = document.createElement('a')
        a.href = url
        a.download = '打包下载文件.zip' //可以填写默认的下载名称
        a.click()
        this.isLoading = false
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
