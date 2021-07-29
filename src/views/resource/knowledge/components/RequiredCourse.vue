<template>
  <div class="knowledge-required-course">
    <div class="filter-wrapper">
      <div class="input-wrapper">
        <el-input
          v-model="filterForm.coursePlanName"
          clearable
          size="medium"
          placeholder="输入线上必修名称搜索"
        ></el-input>
      </div>
      <el-popover
        v-model="filterFormVisible"
        placement="bottom"
        width="680"
        :offset="270"
        transition="false"
      >
        <el-form
          label-position="left"
          :inline="true"
          :model="filterForm"
          class="filter-form"
          label-width="75px"
          style="padding: 24px"
        >
          <el-form-item
            label="状态"
            style="margin-right: 30px"
          >
            <el-select
              v-model="filterForm.status"
              clearable
              placeholder="请选择"
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
            <el-cascader
              ref="cascader"
              v-model="filterForm.categoryId"
              :options="categoryData"
              clearable
              filterable
              filter
              style="width: 100%"
              placeholder="请选择"
              :props="{ checkStrictly: true, label: 'name', value: 'id' }"
              :show-all-levels="false"
              @change="handleCategoryChange"
            ></el-cascader>
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
                  coursePlanName: filterForm.coursePlanName
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
          @click="() => cancel()"
        >
          取消关联
        </el-button>
      </div>
      <el-table
        v-loading="tableLoading"
        :data="data"
        height="55vh"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column
          fixed="left"
          prop="coursePlanName"
          min-width="150"
          show-overflow-tooltip
          label="线上必修名称"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="toDetail(scope.row)"
            >
              {{ scope.row.coursePlanName }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ getStatus(scope.row.status) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="所在分类"
          prop="categoryName"
          min-width="120"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          label="学习时间"
          min-width="190"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.startTime + '~' + scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.updateTime || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          v-p="relevanceBtn"
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
import Pagination from '@/components/common-pagination'
import { commonCancelRelation, queryPlan } from '@/api/knowledge'
import { getCategoryTree } from '@/api/learnPlan'
export default {
  name: 'KnowledgeRequiredCourse',
  components: {
    Pagination
  },
  props: {
    relevanceBtn: {
      type: String,
      default: ''
    },
    knowledgeSystemId: {
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
      initialFilterForm: {
        coursePlanName: '',
        status: '',
        categoryId: '',
        knowledgeSystemId: this.knowledgeSystemId,
        pageNo: 1,
        pageSize: 10
      },
      filterForm: {
        coursePlanName: '',
        status: '',
        categoryId: '',
        knowledgeSystemId: this.knowledgeSystemId,
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      statusOptions: [
        { value: 1, label: '未开始' },
        { value: 2, label: '进行中' },
        { value: 3, label: '已结束' }
      ]
    }
  },
  created() {
    this.getCategoryData()
    if (this.knowledgeSystemId) {
      this.getData()
    }
  },
  methods: {
    toDetail(data) {
      const query = {}
      Object.keys(data).forEach((key) => {
        query[key] = data[key]
      })
      this.$router.push({
        path: '/learnArrange/plan/detail',
        query: {
          data: JSON.stringify(data)
        }
      })
    },
    handleCategoryChange(data) {
      if (!data) return
      this.filterForm.categoryId = data[data.length - 1]
      if (this.$refs.cascader) {
        this.$refs.cascader.dropDownVisible = false
      }
    },
    getCategoryData() {
      getCategoryTree({ addFlag: '1' }).then((res) => {
        this.categoryData = res
      })
    },
    getStatus(status) {
      switch (status) {
        case 1:
          return '未开始'
        case 2:
          return '进行中'
        case 3:
          return '已结束'
      }
    },
    cancel(target) {
      let params = [],
        message
      if (target) {
        message = '确定要对该线上必修安排取消关联吗？'
        params = [target.id]
      } else {
        message = '确定要对所选线上必修安排取消关联吗？'
        params = this.multipleSelection.map((item) => item.id)
      }

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          commonCancelRelation({ source: 'requiredCourse', ids: params.join(',') }).then(() => {
            this.$message.success('操作成功')
            this.getData()
          })
        })
        .catch(() => {})
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    pagination({ page, limit }) {
      if (limit !== this.filterForm.pageSize) {
        this.filterForm.pageNo = 1
      } else {
        this.filterForm.pageNo = page
      }
      this.filterForm.pageSize = limit
      this.getData()
    },
    getData() {
      if (this.tableLoading) return
      this.tableLoading = true
      queryPlan(this.filterForm)
        .then((res = {}) => {
          const { data = [], totalNum = 0 } = res
          this.data = data
          this.total = totalNum
        })
        .finally(() => (this.tableLoading = false))
    },
    resetPageAndGetList() {
      Object.assign(this.filterForm, { pageNo: 1, pageSize: 10 })
      this.getData()
    }
  },
  watch: {
    knowledgeSystemId() {
      this.getData()
    },
    'filterForm.coursePlanName': _.debounce(function() {
      this.resetPageAndGetList()
    }, 1000)
  }
}
</script>
<style lang="scss">
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
