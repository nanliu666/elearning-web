<template>
  <div class="stuff-study">
    <div class="table-list">
      <el-table
        v-for="(table, i) in data.study"
        :key="i"
        :data="table.trainAttachmentVOS"
        empty-text="暂未提交"
      >
        <el-table-column
          align="center"
          header-align="left"
          :label="table.name"
          prop="fileName"
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
  </div>
</template>

<script>
import { downloadZip } from '@/api/learnArrange'

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
    downloadZip() {
      const data = {
        filePath: [],
        fileName: [],
        zipComment: '打包下载'
      }
      this.data.course.forEach((c) => {
        c.trainAttachmentVOS.forEach((item) => {
          const { fileName, filePath } = item
          if (!filePath || !fileName) return
          data.filePath.push(filePath)
          data.fileName.push(fileName)
        })
      })
      downloadZip(data).then(() => {
        // todo
      })
    },
    download(row) {
      const { fileName } = row
      const link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      link.href = `http://172.16.4.243:8080/g1/learn/${fileName}?download=1`
      link.download = fileName
      var event = document.createEvent('MouseEvents')
      event.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      )
      link.dispatchEvent(event)
    }
  }
}
</script>

<style lang="scss" scoped>
.stuff-study {
  .table-list {
    margin-top: 12px;
  }
}
</style>
