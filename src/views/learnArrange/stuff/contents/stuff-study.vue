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
          :label="'课程: ' + table.name"
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
import { downLoadFile } from '@/util/util'

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
          let { fileName, filePath } = item
          if (!filePath || !fileName) return
          if (filePath.indexOf('http') !== 0) {
            filePath = 'https://' + filePath
          }
          data.filePath.push(filePath)
          data.fileName.push(fileName)
        })
      })
      downloadZip(data).then(() => {
        // todo
      })
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
}
</style>
