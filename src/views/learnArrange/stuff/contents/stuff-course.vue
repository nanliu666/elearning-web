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
        v-for="item in [{ course: '', courseName: '全部课程' }, ...data.courseOptions]"
        :key="item.course || item.courseId"
        :label="item.courseName"
        :value="item.course || item.courseId"
      >
      </el-option>
    </el-select>
    <div class="table-list">
      <div
        v-if="data.course.length"
        class="table-list"
      >
        <el-table
          v-for="(table, i) in data.course"
          :key="i"
          v-loading="table.loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          element-loading-spinner="el-icon-loading"
          :data="table"
        >
          <el-table-column
            align="left"
            width="500"
            class-name="course-title"
          >
            <template slot="header">
              <el-tooltip
                :content="'作业来源: ' + table[0].name"
                placement="top"
              >
                <div class="course-title">
                  {{ '作业来源: ' + table[0].name }}
                </div>
              </el-tooltip>
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
                :disabled="!table.length"
                @click="downloadZip(table)"
              >
                打包下载
              </el-button>
            </template>

            <template slot-scope="scope">
              <common-upload
                v-if="scope.row.fileCategory"
                :disabled="
                  scope.row.fileCategory === 'teacher' && !table[scope.$index - 1].fileName
                "
                need-handler
                :on-upload-start="() => onUploadStart(table)"
                :on-upload-complete="
                  (file, url) => onUploadComplete(table, scope.row, file, url, scope.$index)
                "
                @on-error="() => onUploadError(table)"
              >
                <el-button
                  type="text"
                  size="small"
                  :disabled="
                    scope.row.fileCategory === 'teacher' && !table[scope.$index - 1].fileName
                  "
                >
                  {{
                    scope.row.fileName
                      ? scope.row.fileCategory === 'user'
                        ? '修改作业'
                        : '修改评改'
                      : scope.row.fileCategory === 'user'
                        ? '上传作业'
                        : '上传评改'
                  }}
                </el-button>
              </common-upload>

              <el-button
                type="text"
                size="small"
                :disabled="!scope.row.fileName"
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
  </div>
</template>

<script>
import { getStore } from '@/util/store.js'
import { downLoadFile } from '@/util/util'
import { saveCourseLinkedStudentOrTeacher } from '@/api/learnArrange'
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
    onUploadStart(table) {
      this.$message.warning('正在上传')
      table.loading = true
      this.$forceUpdate()
    },
    onUploadError(table) {
      table.loading = false
      this.$message.error('上传失败，请重试')
      this.$forceUpdate()
    },

    onUploadComplete(table, item, file, url) {
      const { fileCategory, id, bizId: jobId, fileName, courseId } = item
      const { size: fileSize, name } = file.file
      const data = {
        courseId,
        fileCategory,
        fileName: name,
        filePath: url,
        fileSize,
        jobId,
        id: fileName ? id : '',
        userId: this.parentVm.data.stuId
      }
      table.loading = true
      const message = fileName ? '修改成功' : '上传成功'
      saveCourseLinkedStudentOrTeacher(data)
        .then(() => {
          this.$message.success(message)
          this.parentVm.queryWork()
        })
        .finally(() => {
          table.loading = false
          this.$forceUpdate()
        })
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
    // 打包下载
    downloadZip(table) {
      table.loading = true
      this.$forceUpdate()
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

      let url = `api/common/oss/download/zip?filePath=${params.filePath}&fileName=${params.fileName}&responseType=blob&emulateJSON=true&zipComment=${params.zipComment}`
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

<style lang="scss">
.stuff-course {
  .course-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
<style lang="scss" scoped>
.stuff-course {
  .table-list {
    margin-top: 12px;
  }
  .course-selector {
    width: auto !important;
  }
  .edit-upload {
    display: block;
  }
  .empty {
    text-align: center;
    margin: 30px auto;
  }
}
</style>
