<template>
  <div class="knowledge-course">
    <div class="filter-wrapper">
      <div class="input-wrapper">
        <el-input
          v-model="filterForm.courseName"
          clearable
          size="medium"
          placeholder="输入课程名称搜索"
        ></el-input>
      </div>
      <el-popover
        v-model="filterFormVisible"
        placement="bottom"
        width="1050"
        :offset="316"
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
          <el-form-item label="状态">
            <el-select
              v-model="filterForm.status"
              clearable
              placeholder="请选择状态"
            >
              <el-option
                v-for="option in statusOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="讲师">
            <lazy-select v-model="filterForm.teacherId" />
          </el-form-item>
          <el-form-item label="所在分类">
            <tree-selector
              v-model="filterForm.catalogId"
              :options="categoryData"
              placeholder="请选择"
              :props="{
                value: 'id',
                label: 'name',
                children: 'children'
              }"
            />
          </el-form-item>

          <el-form-item label="课程类型">
            <el-select
              v-model="filterForm.courseType"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="option in typeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="选修类型">
            <el-select
              v-model="filterForm.electiveType"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="option in electiveOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
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
                  ...initialFilterForm,
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
      <div
        v-if="multipleSelection.length"
        class="multipleSelection"
      >
        <span>{{ `已选中${multipleSelection.length}项` }}</span><el-button
          type="text"
          size="small"
        >
          全部删除
        </el-button>
      </div>
      <el-table
        :loading="tableLoading"
        :data="data"
        height="35vh"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column
          type="index"
          width="55"
        />

        <el-table-column
          fixed="left"
          prop="courseNo"
          min-width="150"
          show-overflow-tooltip
          label="课程编号"
        >
        </el-table-column>

        <el-table-column
          fixed="left"
          prop="courseName"
          min-width="220"
          show-overflow-tooltip
          label="课程名称"
        >
        </el-table-column>

        <el-table-column
          label="状态"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.status | getStatus }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="teacherName"
          min-width="120"
          show-overflow-tooltip
          label="讲师"
        >
        </el-table-column>

        <el-table-column
          label="所在分类"
          prop="catalogName"
          min-width="120"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          label="课程类型"
          prop="courseType"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.courseType | getCourseType }}
          </template>
        </el-table-column>
        <el-table-column
          label="选修类型"
          prop="electiveType"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.electiveType | getElectiveType }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          fixed="right"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="cancel(scope.row)"
            >
              取消关联
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :page="filterForm.pageNo"
        :limit="filterForm.pageSize"
        @pagination="pagination"
      ></pagination>
    </div>
  </div>
</template>

<script>
import { getCourseListData } from '@/api/course/course'
import Pagination from '@/components/common-pagination'
import lazySelect from '@/components/el-lazy-select'
import TreeSelector from '@/components/tree-selector'

export default {
  name: 'KnowledgeCourse',
  components: {
    Pagination,
    lazySelect,
    TreeSelector
  },
  filters: {
    getStatus(status) {
      switch (status) {
        case 0:
          return '审核中'
        case 1:
          return '已发布'
        case 2:
          return '草稿'
        case 3:
          return '已停用'
        case 11:
          return '已拒绝'
        case 12:
          return '已撤回'
      }
    },
    getCourseType(type) {
      switch (type) {
        case 1:
          return '在线课程'
        case 2:
          return '面授课程'
        case 3:
          return '直播课程'
      }
    },
    getElectiveType(type) {
      switch (type) {
        case 1:
          return '开放选修'
        case 3:
          return '禁止选修'
      }
    }
  },
  props: {
    relevanceBtn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      data: [],
      categoryData: [],
      multipleSelection: [],
      tableLoading: false,
      filterFormVisible: false,
      initialFilterForm: {},
      filterForm: {
        courseName: '',
        status: '1',
        teacherId: '',
        catalogId: '',
        courseType: '',
        electiveType: '',
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      statusOptions: [
        { value: 0, label: '审核中' },
        { value: 1, label: '已发布' },
        { value: 2, label: '草稿' },
        { value: 3, label: '已停用' },
        { value: 12, label: '已撤回' },
        { value: 11, label: '已拒绝' }
      ],
      typeOptions: [
        { value: 1, label: '在线课程' },
        { value: 2, label: '面授课程' },
        { value: 3, label: '直播课程' }
      ],
      electiveOptions: [
        { value: '1', label: '开放选修' },
        { value: '3', label: '禁止选修' }
      ]
    }
  },
  methods: {
    cancel(target) {
      const message = target ? '确定要对该课程取消关联吗？' : '确定要对所选课程取消关联吗？'

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {})
        .catch(() => {})
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    pagination({ page: pageNo, limit: pageSize }) {
      Object.assign(this.filterForm, { pageNo, pageSize })
      this.getData()
    },
    getData() {
      if (this.tableLoading) return
      this.tableLoading = true
      getCourseListData(this.filterForm).then((res) => {
        const { data } = res
      })
    },
    resetPageAndGetList() {
      Object.assign(this.filterForm, { pageNo: 1, pageSize: 10 })
      this.getData()
    }
  }
}
</script>
<style lang="scss" scoped>
.knowledge-detail {
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

  .table-container {
    .multipleSelection {
      margin-bottom: 12px;
      font-size: 13px;
      color: #6b6b6b;
      margin-left: 3px;
      span {
        &:first-child {
          font-size: 14px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
