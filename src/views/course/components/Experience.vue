<template>
  <div class="courseTask">
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
          <span> {{ scope.row.name }} </span>
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
            @click="handleDownload(scope.$index, scope.row)"
          >
            下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '课程学习心得1',
          content: '12.5K'
        },
        {
          date: '2016-05-02',
          name: '课程学习心得2',
          content: '12.5K'
        },
        {
          date: '2016-05-02',
          name: '课程学习心得3',
          content: '12.5K'
        }
      ],
      search: ''
    }
  },
  methods: {
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
