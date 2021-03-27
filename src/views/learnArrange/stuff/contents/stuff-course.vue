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
      <div
        v-if="data.course.length"
        class="table-list"
      >
        <el-table
          v-for="(table, i) in data.course"
          :key="i"
          :data="table.trainAttachmentVOS"
        >
          <el-table-column
            align="left"
            :label="'作业来源: ' + table.name"
            label-class-name="course-name"
            show-overflow-tooltip
            width="600"
          >
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
                @on-error="onUploadError"
              >
                <el-button
                  :loading="loading[i + scope.$index + '']"
                  type="text"
                  size="small"
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
  </div>
</template>

<script>
import { getStore } from '@/util/store.js'
import { downLoadFile } from '@/util/util'
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
      this.$message.warning('正在上传')
      this.loading[id] = true
    },
    onUploadError() {
      this.$message.error('上传失败，请重试')
    },
    onUploadComplete(id) {
      this.$message.success('上传成功')
      this.parentVm.queryWork()
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
    // 打包下载
    downloadZip() {
      let params = {
        filePath: [],
        fileName: [],
        zipComment: encodeURIComponent('DownloadFiles.zip'),
        responseType: 'blob',
        emulateJSON: true
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

<style lang="scss">
.stuff-course {
  .course-name {
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
