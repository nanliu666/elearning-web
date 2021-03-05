<template>
  <div class="courseTask">
    <div
      v-for="(item, index) in 3"
      :key="index"
    >
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          label="作业来源：消防知识学习 > 第一章"
          prop="name"
          width="480px"
        >
          <template slot-scope="scope">
            <div>
              <span v-show="scope.$index == 0"> 作业内容： </span>
              <span v-show="scope.$index == 1"> 学员作业： </span>
              <span v-show="scope.$index == 2"> 教师评改： </span>
              <span> {{ scope.row.name }} </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label=""
          prop="content"
        >
        </el-table-column>
        <el-table-column
          label=""
          prop="date"
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
              上传评改
            </el-button>
            <el-button
              type="text"
              @click="handleDownload(scope.$index, scope.row)"
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
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: 'Java培训练习1.doc',
          content: '12.5K'
        },
        {
          date: '2016-05-02',
          name: 'Java培训练习2.doc',
          content: '12.5K'
        },
        {
          date: '2016-05-02',
          name: 'Java培训练习3.doc',
          content: '12.5K'
        }
      ],
      search: ''
    }
  },
  methods: {
    handleUpload(index, row) {
      console.log(index, row)
    },
    handleDownload(index, row) {
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
