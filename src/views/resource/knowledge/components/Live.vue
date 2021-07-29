<template>
  <div class="knowledge-live">
    <div class="filter-wrapper">
      <div class="input-wrapper">
        <el-input
          v-model="filterForm.titleOrNo"
          clearable
          size="medium"
          placeholder="输入直播名称搜索"
        ></el-input>
      </div>
      <el-popover
        v-model="filterFormVisible"
        placement="bottom"
        width="800"
        transition="false"
        :offset="300"
      >
        <el-form
          label-position="left"
          :inline="true"
          :model="filterForm"
          class="filter-form"
          label-width="100px"
          style="padding: 24px"
        >
          <el-form-item
            label="状态"
            style="margin-right: 50px;"
          >
            <el-select
              v-model="filterForm.isUsed"
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
            <el-cascader
              ref="cascader"
              v-model="filterForm.categoryId"
              :options="categoryData"
              clearable
              filterable
              filter
              style="width: 100%"
              placeholder="请选择所在分类"
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
                  ...initFilterForm,
                  titleOrNo: filterForm.titleOrNo
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
        <span class="tips">{{ `已选中${multipleSelection.length}项` }}</span>
        <el-button
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
          type="index"
          label="序号"
          fixed="left"
          width="55"
        >
        </el-table-column>

        <el-table-column
          fixed="left"
          min-width="120"
          show-overflow-tooltip
          label="直播名称"
        >
          <template slot-scope="scope">
            {{ scope.row.channelName }}
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
          min-width="60"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ (statusOptions.find((o) => o.value === scope.row.isUsed) || { label: '--' }).label }}
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
          label="包含课程"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.courses || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          prop="updateTime"
          min-width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          v-p="relevanceBtn"
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
import { cancelKnowledgeSystem } from '@/api/knowledge'
import { getLiveList } from '@/api/live/liveList'
import { getCategoryTree } from '@/api/live'
export default {
  name: 'Live',
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
      initFilterForm: {
        categoryId: '',
        isUsed: '',
        titleOrNo: '',
        knowledgeSystemId: this.knowledgeSystemId,
        pageNo: 1,
        pageSize: 10
      },
      filterForm: {
        categoryId: '',
        isUsed: '',
        titleOrNo: '',
        knowledgeSystemId: this.knowledgeSystemId,
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      statusOptions: [
        { value: 0, label: '停用' },
        { value: 1, label: '正常' },
        { value: 2, label: '草稿' }
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
    getCategoryData() {
      getCategoryTree({ source: 'live' }).then((res) => {
        this.categoryData = res
      })
    },
    handleCategoryChange(data) {
      if (!data) return
      this.filterForm.categoryId = data[data.length - 1]
      if (this.$refs.cascader) {
        this.$refs.cascader.dropDownVisible = false
      }
    },
    cancel(target) {
      let params = [],
        message
      if (target) {
        message = '确定要对该直播取消关联吗？'
        params = [target.liveId]
      } else {
        message = '确定要对所选直播取消关联吗？'
        params = this.multipleSelection.map((item) => item.liveId)
      }

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          cancelKnowledgeSystem({ liveIds: params.join(',') }).then(() => {
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
      getLiveList(this.filterForm)
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
    'filterForm.titleOrNo': _.debounce(function() {
      this.resetPageAndGetList()
    }, 1000)
  }
}
</script>
<style lang="scss" scoped>
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
      .tips {
        display: inline-block;
        font-size: 14px;
        margin-right: 10px;
      }
      .el-button--text {
        padding: 0;
      }
    }
  }
}
</style>
