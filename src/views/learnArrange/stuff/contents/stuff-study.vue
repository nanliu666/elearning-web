<template>
  <div class="stuff-study">
    <div
      v-if="data.study.length"
      class="table-list"
    >
      <el-table
        v-for="(table, i) in data.study"
        :key="i"
        v-loading="table.loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-spinner="el-icon-loading"
        :data="table.vos"
        empty-text="暂未提交"
      >
        <el-table-column
          align="left"
          width="500"
          class-name="course-title"
        >
          <template slot="header">
            <el-tooltip
              :content="'课程: ' + table.name"
              placement="top"
            >
              <div class="course-title">
                {{ '课程: ' + table.name }}
              </div>
            </el-tooltip>
          </template>

          <template slot-scope="scope">
            <div>
              {{ scope.row.fileName }}
            </div>
          </template>
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
          width="210"
          show-overflow-tooltip
          prop="updateTime"
        >
        </el-table-column>

        <el-table-column align="right">
          <template slot="header">
            <el-button
              type="text"
              size="small"
              :disabled="!table.vos.length"
              @click="downloadZip(table)"
            >
              打包下载
            </el-button>
          </template>

          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="download(scope.row, table)"
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
    downloadZip(table) {
      table.loading = true
      let params = {
        filePath: [],
        fileName: [],
        zipComment: encodeURIComponent('DownloadFiles.zip'),
        responseType: 'blob',
        emulateJSON: true
      }
      table.forEach((item) => {
        let { fileName: name, filePath: path } = item
        if (!path || !name) return
        if (path.indexOf('http') !== 0) {
          path = 'https://' + path
        }
        params.filePath.push(path)
        params.fileName.push(name)
      })
      params.filePath = params.filePath.join(',')
      params.fileName = params.fileName.join(',')

      let url = `api/common/oss/download/zip?filePath=${params.filePath}&fileName=${params.fileName}
      &responseType=blob&emulateJSON=true&zipComment=${params.zipComment}`
      this.repDownload(url).then(() => {
        table.loading = false
        this.$forceUpdate()
      })
    },
    repDownload(url) {
      return new Promise((resolve) => {
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
          a.download = '打包下载文件.zip' //可以填写默认的下载名称
          a.click()
          resolve()
        }
        x.send()
      })
    },
    download(row, table) {
      table.loading = true
      downLoadFile(row).then(() => (table.loading = false))
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
