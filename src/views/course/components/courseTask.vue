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
          width="480px"
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
          <template slot="header">
            <el-button type="text">
              打包下载
            </el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleUpload(scope.$index, scope.row)"
            >
              <span v-show="scope.$index == 1"> 修改作业 </span>
              <span v-show="scope.$index == 2"> 上传评改 </span>
            </el-button>
            <!-- <a
              :href="scope.row.filePath"
              download
              style="color:#01aafc;"
            > 下载 </a> -->

            <a
              style="color:#01aafc; cursor:pointer;"
              @click="downLoadInfo(scope.row)"
            > 下载 </a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { downLoadFile } from '@/util/util'
import { listCourseJob } from '@/api/course/course'
export default {
  data() {
    return {
      tableData: [],
      search: ''
    }
  },
  activated() {
    this.getInfo()
  },
  methods: {
    downLoadInfo(data) {
      // 下载
      downLoadFile(data)
    },
    async getInfo() {
      let params = { courseId: this.$route.query.courseId, stuId: this.$route.query.row.stuId }
      // let params = { courseId: '1369562437399535618', stuId: '123' }
      let res = await listCourseJob(params)
      this.tableData = res
      console.log(res)
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
