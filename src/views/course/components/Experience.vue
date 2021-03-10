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
          :label="items.jobName"
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
            <!-- <el-button type="text">
              下载  {{scope.row.filePath}}
            </el-button> -->
            <a
              :href="scope.row.filePath"
              :download="scope.row.fileName"
              style="color:#01aafc;"
            >
              下载
            </a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { courseFeelListByUserId } from '@/api/course/course'
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
    async getInfo() {
      let params = { courseId: this.$route.query.courseId, stuId: this.$route.query.row.stuId }
      // let params = { courseId: '1369562437399535618', stuId: '123' }
      let res = await courseFeelListByUserId(params)
      this.tableData = res
      // console.log(res)
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
