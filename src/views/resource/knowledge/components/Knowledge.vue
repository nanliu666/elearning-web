<template>
  <div class="knowledge-knowledge">
    <div class="filter-wrapper">
      <div class="input-wrapper">
        <el-input
          v-model="filterForm.resName"
          clearable
          size="medium"
          placeholder="输入知识库名称搜索"
        ></el-input>
      </div>
      <el-popover
        v-model="filterFormVisible"
        placement="bottom"
        width="960"
        :offset="316"
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
            <el-cascader
              ref="cascader"
              v-model="filterForm.catalogId"
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

          <el-form-item label="上传模式">
            <el-select
              v-model="filterForm.uploadType"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="option in uploadTypeOptions"
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
                  resName: filterForm.resName
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
          type="index"
          label="序号"
          fixed="left"
          width="55"
        >
        </el-table-column>

        <el-table-column
          fixed="left"
          prop="resName"
          min-width="120"
          show-overflow-tooltip
          label="资源名称"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="
                $router.push({ path: '/repository/knowledgeDetail', query: { id: scope.row.id } })
              "
            >
              {{ scope.row.resName }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
          prop="status"
          min-width="65"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ getStatus(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          label="所在分类"
          prop="catalogName"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.catalogName || '--' }}
          </template>
        </el-table-column>

        <el-table-column
          label="上传模式"
          prop="updateType"
          min-width="70"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ getUploadType(scope.row.uploadType) }}
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          prop="updateTime"
          min-width="80"
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
import { getKnowledgeCatalogList, getKnowledgeList, removeKnowledgeSystem } from '@/api/knowledge'

export default {
  name: 'KnowledgeCourse',
  components: {
    Pagination
  },
  props: {
    knowledgeSystemId: {
      type: String,
      default: ''
    },
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
        resName: '',
        status: '',
        knowledgeSystemId: this.knowledgeSystemId,
        catalogId: '',
        uploadType: '',
        pageNo: 1,
        pageSize: 10
      },
      filterForm: {
        resName: '',
        status: '',
        knowledgeSystemId: this.knowledgeSystemId,
        catalogId: '',
        uploadType: '',
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      statusOptions: [
        { value: '1', label: '上架' },
        { value: '2', label: '下架' },
        { value: '3', label: '审批中' },
        { value: '4', label: '已拒绝' },
        { value: '5', label: '已撤回' }
      ],
      uploadTypeOptions: [
        { value: '1', label: '本地文件' },
        { value: '2', label: '链接文件' }
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
    handleCategoryChange(data) {
      if (!data) return
      this.filterForm.catalogId = data[data.length - 1]
      if (this.$refs.cascader) {
        this.$refs.cascader.dropDownVisible = false
      }
    },
    getStatus(row) {
      switch (row.approveStatus) {
        case 0:
          return '审核中'
        case 1:
          return row.status == 0 ? '已发布' : '未发布'
        case 2:
          return '审批驳回'
        case 3:
          return '已撤回'
      }
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
    getUploadType(type) {
      switch (type) {
        case 0:
          return '本地文件'
        case 1:
          return '链接文件'
      }
    },
    cancel(target) {
      let params = [],
        message
      if (target) {
        message = '确定要对该知识库取消关联吗？'
        params = [target.id]
      } else {
        message = '确定要对所选知识库取消关联吗？'
        params = this.multipleSelection.map((item) => item.id)
      }

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          removeKnowledgeSystem({ knowledgeIds: params.join(',') }).then(() => {
            this.$message.success('操作成功')
            this.getData()
          })
        })
        .catch(() => {})
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    resetPageAndGetList() {
      Object.assign(this.filterForm, { pageNo: 1, pageSize: 10 })
      this.getData()
    },
    getCategoryData() {
      getKnowledgeCatalogList({ status: 0 }).then((res) => {
        this.categoryData = res
      })
    },
    getData() {
      if (this.tableLoading) return
      this.tableLoading = true
      getKnowledgeList(this.filterForm)
        .then((res = {}) => {
          const { data = [], totalNum = 0 } = res
          this.data = data
          this.total = totalNum
        })
        .finally(() => (this.tableLoading = false))
    }
  },
  watch: {
    knowledgeSystemId() {
      this.getData()
    },
    'filterForm.resName': _.debounce(function() {
      this.resetPageAndGetList()
    }, 1000)
  }
}
</script>
<style lang="scss">
.knowledge-knowledge {
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
