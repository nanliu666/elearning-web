<template>
  <div class="study-state">
    <div class="filter-wrapper">
      <div class="input-wrapper">
        <el-input
          v-model="filterForm.userName"
          :disabled="tableLoading"
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
          style="padding: 24px;"
        >
          <el-form-item label="所属部门">
            <el-cascader
              v-model="filterForm.deptName"
              style="width: 202px;"
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
              v-model="filterForm.isFinish"
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
          <div style="text-align: right; margin-right: 75px;">
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
    </div>

    <div class="table-container">
      <el-table
        :loading="tableLoading"
        :data="data['study-state'].data"
        border
      >
        <el-table-column
          fixed
          align="center"
          prop="name"
          header-align="center"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="phonenum"
          align="center"
          header-align="center"
          label="手机号"
        >
        </el-table-column>
        <el-table-column
          prop="deptName"
          align="center"
          header-align="center"
          label="所属部门"
        >
        </el-table-column>
        <el-table-column
          prop="progress"
          align="center"
          header-align="center"
          label="学习进度"
        >
          <template slot-scope="scope">
            <el-progress
              v-if="typeof scope.row.progress === 'number'"
              :percentage="scope.row.progress"
            ></el-progress>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          label="作业提交率"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.jobPercent }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="materials"
          label="上报材料"
        >
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="coursePassStatus"
          label="课程通过状态"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="isFinish"
          header-align="center"
          label="考试情况"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.isFinish === 'yes' ? '已通过' : '未通过' }}
            </div>
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
              查看上报材料
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :total="data['study-state'].total"
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
  name: 'StudyState',
  components: {
    Pagination
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
      tableLoading: false,
      initForm: {
        deptName: '',
        progress: 'Yes',
        jobPercent: 'Yes',
        isFinish: 'Yes',
        isExaimPass: 'Yes',
        coursePassStatus: 'Yes',
        pageNo: 1,
        pageSize: 10
      },
      categoryData: [],
      filterFormVisible: false,
      filterForm: {
        deptName: '',
        progress: 'Yes',
        jobPercent: 'Yes',
        isFinish: 'Yes',
        isExaimPass: 'Yes',
        coursePassStatus: 'Yes',
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    searchValWatcher() {
      return this.filterForm.userName
    }
  },
  watch: {
    searchValWatcher() {
      if (this.tableLoading) return
      this.tableLoading = true
      this.parentVm.queryStudyList(this.filterForm).finally(() => (this.tableLoading = false))
    }
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
