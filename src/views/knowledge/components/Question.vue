<template>
  <div class="knowledge-question">
    <div class="filter-wrapper">
      <div class="input-wrapper">
        <el-input
          v-model="filterForm.search"
          clearable
          size="medium"
          placeholder="输入题干内容搜索"
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

          <el-form-item label="类型">
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
          label="题目列表"
          min-width="320"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.content }}
            <div class="question-info">
              <span>{{ getType(scope.row.type) }}</span><span>状态: {{ getStatus(scope.row.status) }}</span><span>关联试卷数: {{ scope.row.examNum }}</span>
            </div>
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
import { cancelKnowledgeRel } from '@/api/knowledge'
import { getQuestionList } from '@/api/examManage/question'
export default {
  name: 'KnowledgeQuestion',
  components: {
    Pagination
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
      initialFilterForm: {
        search: '',
        status: '',
        type: '',
        pageNo: 1,
        pageSize: 10
      },
      filterForm: {
        search: '',
        status: '',
        type: '',
        pageNo: 1,
        pageSize: 10
      },
      total: 0,

      statusOptions: [
        { value: 'normal', label: '正常' },
        { value: 'expired', label: '已过期' }
      ],
      typeOptions: [
        { value: 'single_choice', label: '单选题' },
        { value: 'multi_choice', label: '多选题' },
        { value: 'judgment', label: '判断题' },
        { value: 'short_answer', label: '简答题' },
        { value: 'blank', label: '填空题' },
        { value: 'question_group', label: '试题组(阅读题)' }
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getStatus(status) {
      return (this.statusOptions.find((s) => s.value == status) || { label: '--' }).label
    },
    getType(type) {
      return (this.typeOptions.find((s) => s.value == type) || { label: '--' }).label
    },
    cancel(target) {
      let params = [],
        message
      if (target) {
        message = '确定要对该题目取消关联吗？'
        params = [target.id]
      } else {
        message = '确定要对所选题目取消关联吗？'
        params = this.multipleSelection.map((item) => item.id)
      }

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          cancelKnowledgeRel({ questionIds: params.join(',') }).then(() => {
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
      getQuestionList(this.filterForm)
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
    'filterForm.search': _.debounce(function() {
      this.resetPageAndGetList()
    }, 1000)
  }
}
</script>
<style lang="scss">
.knowledge-question {
  .question-info {
    display: flex;
    align-items: center;
    color: #6d6d6d;
    font-size: 0;
    span {
      padding-right: 12px;
      font-size: 12px;
      margin-bottom: 12px;
      line-height: 12px;
      &:not(:last-child) {
        border-right: 1px solid #e4e4e4;
      }
      &:not(:first-child) {
        padding-left: 12px;
      }
    }
  }
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
