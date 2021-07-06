<template>
  <div class="study-state">
    <!-- <div class="filter-wrapper">
      <div class="input-wrapper">
        <el-input
          v-model="filterForm.userName"
          clearable
          size="medium"
          placeholder="输入学员姓名搜索"
        ></el-input>
      </div>

      <el-popover
        v-model="filterFormVisible"
        placement="bottom"
        width="725"
        transition="false"
      >
        <el-form
          label-position="left"
          :inline="true"
          :model="filterForm"
          class="filter-form"
          label-width="100px"
          style="padding: 24px"
        >
          <el-form-item label="所属部门">
            <el-cascader
              v-model="filterForm.deptName"
              style="width: 202px"
              placeholder="请选择所属部门"
              :options="data['study-state'].orgData"
              :props="{ checkStrictly: true, label: 'orgName', value: 'orgName' }"
              clearable
            ></el-cascader>
          </el-form-item>

          <el-form-item label="学习进度">
            <el-select
              v-model="filterForm.progress"
              clearable
              placeholder="请选择状态"
            >
              <el-option
                label="已通过"
                value="Yes"
              ></el-option>
              <el-option
                label="未通过"
                value="No"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="作业提交率">
            <el-select
              v-model="filterForm.jobPercent"
              clearable
              placeholder="请选择状态"
            >
              <el-option
                label="全部提交"
                value="Yes"
              ></el-option>
              <el-option
                label="未完成"
                value="No"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程通过状态">
            <el-select
              v-model="filterForm.isOnlineCourse"
              clearable
              placeholder="请选择状态"
            >
              <el-option
                label="已通过"
                value="Yes"
              ></el-option>
              <el-option
                label="未通过"
                value="No"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考试情况">
            <el-select
              v-model="filterForm.isExaimPass"
              clearable
              placeholder="请选择状态"
            >
              <el-option
                label="已通过"
                value="Yes"
              ></el-option>
              <el-option
                label="未通过"
                value="No"
              ></el-option>
              <el-option
                label="未开始"
                value="Init"
              ></el-option>
            </el-select>
          </el-form-item>
          <div style="text-align: right; margin-right: 75px">
            <el-button
              type="primary"
              size="medium"
              :disabled="tableLoading"
              @click.native="resetPageAndGetList"
            >
              搜索
            </el-button>
            <el-button
              size="medium"
              @click="
                filterForm = {
                  ...initForm,
                  titleOrNo: filterForm.deptName
                }
              "
            >
              重置
            </el-button>
          </div>
        </el-form>

        <el-button
          slot="reference"
          size="medium"
          icon="icon-basics-filter-outlined"
          :disabled="tableLoading"
        >
          筛选
        </el-button>
      </el-popover>
    </div> -->

    <div class="table-container">
      <el-table
        :loading="tableLoading"
        :data="data['exam-state'].data"
        border
      >
        <el-table-column
          fixed
          align="center"
          prop="examName"
          header-align="center"
          label="考试名称"
        >
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          label="考试日期"
        >
          <template slot-scope="scope">
            <span> {{ scope.row.startTime }}~{{ scope.row.endTime }} </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          label="状态"
        >
          <template slot-scope="scope">
            <span v-show="scope.row.status == 1">未开始</span>
            <span v-show="scope.row.status == 2">进行中</span>
            <span v-show="scope.row.status == 3">已结束</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          label="考试时长(分钟)"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.reckonTime">{{ scope.row.reckonTimeValue || '--' }}</span>
            <span v-else> 无限制 </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          label="通过率"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.passRate">{{ scope.row.passRate }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="toStuffDetail(scope.row)"
            >
              考试详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :total="data['exam-state'].total"
        :page="filterForm.pageNo"
        :limit="filterForm.pageSize"
        @pagination="pagination"
      ></pagination>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/common-pagination'
export default {
  name: 'ExamState',
  components: {
    Pagination
  },
  props: {
    data: {
      type: Object,
      default() {
        return {
          data: []
        }
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
      tableLoading: false,
      initForm: {
        deptName: '',
        progress: '',
        jobPercent: '',
        isOnlineCourse: '',
        isExaimPass: '',
        coursePassStatus: '',
        pageNo: 1,
        pageSize: 10
      },
      categoryData: [],
      filterFormVisible: false,
      filterForm: {
        deptName: '',
        progress: '',
        jobPercent: '',
        isOnlineCourse: '',
        isExaimPass: '',
        coursePassStatus: '',
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    searchValWatcher() {
      return (this.filterForm.userName + '').trim()
    }
  },
  watch: {
    searchValWatcher: _.debounce(function() {
      if (this.tableLoading) return
      this.tableLoading = true
      this.filterForm.pageNo = 1
      this.parentVm.queryStudyList(this.filterForm).finally(() => (this.tableLoading = false))
    }, 1000)
  },
  methods: {
    pagination({ page, limit }) {
      if (this.tableLoading) return
      this.tableLoading = true
      this.filterForm.pageNo = page
      this.filterForm.pageSize = limit
      this.parentVm.queryStudyList(this.filterForm).finally(() => (this.tableLoading = false))
    },

    resetPageAndGetList() {
      if (this.tableLoading) return
      this.tableLoading = true
      this.filterForm.pageNo = 1
      this.filterForm.pageSize = 10
      this.parentVm.queryStudyList(this.filterForm).finally(() => (this.tableLoading = false))
    },
    toStuffDetail(row) {
      this.$router.push({
        path: '/learnArrange/plan/examDetail',
        query: {
          examId: row.id
        }
      })
    }
  }
}
</script>

<style lang="scss">
.study-state {
  .filter-wrapper .input-wrapper {
    .el-input__inner {
      height: 34px;
      line-height: 34px;
    }
  }
  .icon-basics-filter-outlined {
    font-size: 14px;
  }

  .filter-form {
    .el-form-item__label {
      text-align: center;
    }
  }
}
</style>
<style lang="scss" scoped>
.study-state {
  .filter-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    .input-wrapper {
      width: 202px;
      margin-right: 10px;
    }
    .filter-btn {
      width: 85px;
    }
  }
}
</style>
