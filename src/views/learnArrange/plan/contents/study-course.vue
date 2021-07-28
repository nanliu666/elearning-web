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
        :data="data['study-course'].data"
        border
      >
        <el-table-column
          fixed
          align="center"
          prop="courseName"
          header-align="center"
          label="课程名称"
        >
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          label="授课日期"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.startTime }}~{{ scope.row.endTime }}</span>
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
            <span v-show="scope.row.status == 4">草稿</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="passRule"
          header-align="center"
          label="通过条件"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.passRules">{{ scope.row.passRules | getPassRule }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          label="学习通过率"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.studyPassingRate">{{ scope.row.studyPassingRate + '%' }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          header-align="center"
          label="作业提交率"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.jobSubmitRate">{{
              scope.row.feelTimes + '次/' + scope.row.feelPercent + '%'
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          label="课程评分"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.composite">{{ scope.row.composite }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :total="data['study-course'].total"
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
  name: 'CourseState',
  components: {
    Pagination
  },
  filters: {
    getPassRule(val) {
      if (val.length <= 0) return '--'
      let o = {
        a: '教师评定',
        b: '考试通过',
        c: '达到课程学时'
      }
      let arr = val.reduce((pre, cur) => {
        pre.push(o[cur])
        return pre
      }, [])
      return arr.join(';')
    }
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
      const data = { ...row }
      data.type = 'plan'
      data.studyName = this.data.studyName
      const query = {}
      Object.keys(data).forEach((key) => {
        query[key] = data[key]
      })

      this.$router.push({
        path: '/learnArrange/stuff/index',
        query
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
