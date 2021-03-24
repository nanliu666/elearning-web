<template>
  <div class="stuff-course">
    <el-select
      v-model="courseId"
      placeholder="请选择课程"
      class="course-selector"
      size="medium"
      @change="courseChange"
    >
      <el-option
        v-for="item in [{ course: '', courseName: '全部课程' }, ...data.courseOpitons]"
        :key="item.course || item.courseId"
        :label="item.courseName"
        :value="item.course || item.courseId"
      >
      </el-option>
    </el-select>
    <div class="table-list">
      <el-table
        v-for="(table, i) in data.course"
        :key="i"
        :data="table.trainAttachmentVOS"
      >
        <el-table-column
          align="left"
        >
          <template slot="header">
            {{'课程: ' + table.name}}
          </template>

          <template slot-scope="scope">
            <div>
              {{ getFileName(scope.row) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center">
          <template slot-scope="scope">
            <div>
              {{ !scope.row.fileSize ? '--' : scope.row.fileSize + 'K' }}
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
            <common-upload
              v-if="scope.row.fileCategory"
              need-handler
              :disabled="loading[i + scope.$index + '']"
              :on-upload-start="() => onUploadStart(i + scope.$index + '')"
              :on-upload-complete="() => onUploadComplete(i + scope.$index + '')"
            >
              <el-button
                :loading="loading[i + scope.$index + '']"
                type="text"
                size="small"
              >
                {{ scope.row.fileCategory === 'user' ? '修改作业' : '修改评改' }}
              </el-button>
            </common-upload>
            <el-button
              type="text"
              size="small"
              :disabled="!scope.row.fileName"
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
  name: 'StuffCourse',
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload')
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    parentVm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      courseId: '',
      loading: {}
    }
  },
  methods: {
    onUploadStart(id) {
      this.loading[id] = true
    },
    onUploadComplete(id) {
      this.loading[id] = false
    },
    getFileName(row) {
      const fileName = row.fileName || '未提交'
      switch (row.fileCategory) {
        case 'teacher':
          return '教师评改：' + fileName
        case 'user':
          return '学员作业：' + fileName
        default:
          return '作业内容：' + fileName
      }
    },
    courseChange(courseId) {
      this.parentVm.queryWork(courseId)
    },
    downloadZip() {
      const params = {
        filePath: [],
        fileName: [],
        zipComment: '打包下载.zip'
      }
      this.data.course.forEach((c) => {
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
      let p = ''
      Object.keys(params).forEach((key) => {
        const value = params[key]
        p += `&${decodeURIComponent(key)}=${decodeURIComponent(value)}`
      })

      p = '?' + p.slice(1)
      downloadZip(p).then(() => {
        // console.log(res)
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
.stuff-course {
  .table-list {
    margin-top: 12px;
  }
  .edit-upload {
    display: block;
  }
}
</style>
