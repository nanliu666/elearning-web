<template>
  <div class="stuff-study">
    <div
      v-if="data.study.length"
      class="table-list"
    >
      <el-table
        v-for="(table, i) in data.study"
        :key="i"
        :data="table.trainAttachmentVOS"
        empty-text="暂未提交"
      >
        <el-table-column
          align="center"
          header-align="left"
          :label="'课程: ' + table.name"
          prop="fileName"
          width="600"
        >
        </el-table-column>

        <el-table-column align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.fileSize + 'K' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="updateTime"
        >
        </el-table-column>

        <el-table-column align="right">
          <template slot="header">
            <el-button
              type="text"
              size="small"
              :disabled="!table.trainAttachmentVOS.length"
              @click="downloadZip"
            >
              打包下载
            </el-button>
          </template>

          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="download(scope.row)"
            >
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div
      v-else
      class="empty"
    >
      暂未提交
    </div>
  </div>
</template>

<script>
import { downLoadFile } from '@/util/util'
import { getStore } from '@/util/store.js'

export default {
  name: 'StuffStudy',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      courseName: ''
    }
  },
  methods: {
    // 打包下载
    downloadZip() {
      let params = {
        filePath: [],
        fileName: [],
        zipComment: encodeURIComponent('DownloadFiles.zip'),
        responseType: 'blob',
        emulateJSON: true
      }
      this.data.study.forEach((c) => {
        c.trainAttachmentVOS.forEach((item) => {
          let { fileName: name, filePath: path } = item
          if (!path || !name) return
          if (path.indexOf('http') !== 0) {
            path = 'https://' + path
          }
          params.filePath.push(path)
          params.fileName.push(name)
        })
      })
      params.filePath = params.filePath.join(',')
      params.fileName = params.fileName.join(',')

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
      x.onload = function() {
        let url = window.URL.createObjectURL(x.response)
        let a = document.createElement('a')
        a.href = url
        a.download = '' //可以填写默认的下载名称
        a.click()
      }
      x.send()
    },
    download(row) {
      downLoadFile(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.stuff-study {
  .table-list {
    margin-top: 12px;
  }
  .empty {
    text-align: center;
    margin: 30px auto;
  }
}
</style>
