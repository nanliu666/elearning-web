<template>
  <div class="courseTask">
    <div
      v-for="(items, index) in tableData"
      :key="index"
    >
      <el-table
        :data="items.fileInfoList"
        style="width: 100%"
      >
        <el-table-column
          :label="'作业来源： ' + items.jobName"
          prop="name"
          width="780px"
        >
          <template slot-scope="scope">
            <div>
              <span v-show="scope.$index == 0"> 作业内容： </span>
              <span v-show="scope.$index == 1"> 学员作业： </span>
              <span v-show="scope.$index == 2"> 教师评改： </span>
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
              <span> {{ scope.row.fileSize + `${scope.row.fileSize == '' ? '--' : 'k'}` }} </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label=""
          prop="updateTime"
        >
        </el-table-column>
        <el-table-column align="right">
          <template slot="header">
            <el-button type="text">
              打包下载
            </el-button>
          </template>
          <template slot-scope="scope">
            <span>
              <common-upload
                v-model="uploadData"
                :before-upload="beforeUpload"
                :multiple="false"
                @input="onSuccess(scope, items.id)"
              >
                <el-button
                  type="text"
                  :disabled="items.fileInfoList[1].updateTime == '--' && scope.$index == 2"
                >
                  <span v-if="scope.$index == 1">修改作业</span>
                  <span
                    v-if="scope.$index == 2"
                  >{{ scope.row.updateTime == '--' ? '上传评改' : '重新上传' }}
                  </span>
                </el-button>
              </common-upload>
            </span>
            <el-button
              type="text"
              :disabled="scope.row.updateTime == '--'"
              @click="downLoadInfo(scope.row)"
            >
              &nbsp;&nbsp;&nbsp;&nbsp; 下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { downLoadFile } from '@/util/util'
import { listCourseJob, saveCourseLinkedStudentOrTeacher } from '@/api/course/course'
export default {
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload')
  },
  data() {
    return {
      tableData: [],
      uploadData: [],
      stuId: ''
    }
  },
  activated() {
    let rowData = JSON.parse(this.$route.query.row)
    this.stuId = rowData.stuId
    this.getInfo()
  },
  created() {
    let rowData = JSON.parse(this.$route.query.row)
    this.stuId = rowData.stuId
    this.getInfo()
  },
  methods: {
    // 上传校验
    beforeUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 20MB!')
        return false
      }
      return true
    },
    // 上传回调
    onSuccess(scope, id) {
      let params = {
        courseId: this.$route.query.courseId, //课程id
        fileCategory: scope.$index == 1 ? 'user' : 'teacher', //文件归类：用户提交的附件user、还是讲师评改的附件teacher
        fileName: this.uploadData[this.uploadData.length - 1].localName, //文件名称，包括扩展名
        filePath: this.uploadData[this.uploadData.length - 1].fileUrl, //文件所在路径
        fileSize: (this.uploadData[this.uploadData.length - 1].size / 1024).toFixed(1), //文件大小   //大小单位KB
        id: scope.row.id, //对应FileInfoList里的Id，有则回传，没有则传空
        jobId: id, //对应课程作业Id
        userId: this.stuId //学员id
      }
      saveCourseLinkedStudentOrTeacher(params).then(() => {
        this.getInfo()
      })
    },

    // 下载
    downLoadInfo(data) {
      downLoadFile(data)
    },
    async getInfo() {
      let params = { courseId: this.$route.query.courseId, stuId: this.stuId }
      let res = await listCourseJob(params)
      let pushData = {
        fileName: '未提交',
        filePath: '',
        fileSize: '',
        id: '',
        source: '',
        updateTime: '--',
        userFileId: ''
      }
      this.tableData = res
      this.tableData.forEach((item, index) => {
        if (item.fileInfoList.length == 1) {
          this.tableData[index].fileInfoList.push(pushData)
          this.tableData[index].fileInfoList.push(pushData)
          return
        } else if (item.fileInfoList.length == 2) {
          this.tableData[index].fileInfoList.push(pushData)
        }
      })
    },
    handleUpload(index, row) {
      console.log(index, row)
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
