<template>
  <div
    v-if="tableData"
    class="courseTask"
  >
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        :label="'课程: ' + rowData.courseName"
        prop="name"
        width="480px"
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
import { courseFeelListByUserId, zip } from '@/api/course/course'
import { downLoadFile } from '@/util/util'
export default {
  data() {
    return {
      tableData: [],
      stuId: '',
      rowData: ''
    }
  },
  activated() {
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
      let params = {
        filePath: [],
        fileName: [],
        zipComment: this.rowData.courseName + '->学习心得->打包下载'
      }
      this.tableData.forEach((item) => {
        params.filePath.push(item.filePath)
        params.fileName.push(item.fileName)
      })
      zip(params).then((res) => {
        console.log(res)
      })
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
