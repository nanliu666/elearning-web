<template>
  <div class="knowledge-live">
    <div class="filter-wrapper">
      <div class="input-wrapper">
        <el-input
          v-model="filterForm.liveName"
          clearable
          size="medium"
          placeholder="输入直播名称搜索"
        ></el-input>
      </div>
      <el-popover
        v-model="filterFormVisible"
        placement="bottom"
        width="1050"
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
          fixed="left"
          width="55"
        >
        </el-table-column>

        <el-table-column
          fixed="left"
          prop="sourceName"
          min-width="220"
          show-overflow-tooltip
          label="直播名称"
        >
        </el-table-column>

        <el-table-column
          label="状态"
          prop="status"
          min-width="120"
          show-overflow-tooltip
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
          label="包含课程"
          prop="course"
          min-width="120"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="更新时间"
          prop="updateTime"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.updateTime }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-P="relevanceBtn"
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
import TreeSelector from '@/components/tree-selector'

export default {
  name: 'KnowledgeCourse',
  components: {
    Pagination,
    TreeSelector
  },
  filters: {
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
    getUpdateType(type) {
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
        { value: 0, label: '已发布' },
        { value: 1, label: '已停用' },
        { value: 2, label: '审批中' },
        { value: 3, label: '审批结束' }
      ],
      uploadTypeOptions: [
        { value: '1', label: '本地文件' },
        { value: '2', label: '链接文件' }
      ]
    }
  },
  methods: {
    cancel() {},
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
      getCourseListData(this.filterForm).then((res = {}) => {
        const { data = [], totalNum = 0 } = res
        this.data = data
        this.total = totalNum
      })
    },
    resetPageAndGetList() {
      Object.assign(this.filterForm, { pageNo: 1, pageSize: 10 })
      this.getData()
    }
  }
}
</script>
<style lang="scss">
.knowledge-live {
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
