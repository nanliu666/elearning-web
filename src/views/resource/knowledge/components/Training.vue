<template>
  <div class="knowledge-training">
    <div class="filter-wrapper">
      <div class="input-wrapper">
        <el-input
          v-model="filterForm.trainName"
          clearable
          size="medium"
          placeholder="输入培训名称搜索"
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
          label-width="80px"
          style="padding: 24px"
        >
          <el-form-item
            label="分类"
            style="margin-right: 35px;"
          >
            <el-cascader
              ref="cascader"
              v-model="filterForm.categoryId"
              clearable
              filterable
              filter
              style="width: 100%"
              placeholder="请选择所在分类"
              :options="categoryData"
              :props="{ checkStrictly: true, label: 'name', value: 'id' }"
              :show-all-levels="false"
              @change="handleCategoryChange"
            ></el-cascader>
          </el-form-item>

          <el-form-item
            label="状态"
            style="margin-right: 35px;"
          >
            <el-select
              v-model="filterForm.status"
              placeholder="请选择"
              clearable=""
            >
              <el-option
                v-for="item in [
                  { value: '1', label: '未开始' },
                  { value: '2', label: '进行中' },
                  { value: '3', label: '已结束' },
                  { value: '4', label: '草稿' }
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="培训类别"
            style="margin-right: 35px;"
          >
            <el-select
              v-model="filterForm.trainScope"
              placeholder="请选择"
              clearable=""
            >
              <el-option
                v-for="item in [
                  { value: 'inside', label: '内训' },
                  { value: 'outer', label: '外训' }
                ]"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="培训方式"
            style="margin-right: 35px;"
          >
            <el-select
              v-model="filterForm.trainWay"
              placeholder="请选择"
            >
              <el-option
                v-for="item in trainWayOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              >
              </el-option>
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
                  trainName: filterForm.trainName
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
          label="序号"
          type="index"
          fixed="left"
          width="55"
        >
        </el-table-column>

        <el-table-column
          fixed="left"
          min-width="140"
          show-overflow-tooltip
          label="培训名称"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="toDetail(scope.row)"
            >
              {{ scope.row.trainName }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
          prop="status"
          min-width="60"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ getStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column
          label="所在分类"
          prop="categoryName"
          min-width="80"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          label="培训时间"
          min-width="190"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.startTime + '~' + scope.row.endTime }}
          </template>
        </el-table-column>

        <el-table-column
          label="类型"
          prop="trainScope"
          min-width="65"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.trainScope === 'inside' ? '内训' : '外训' }}
          </template>
        </el-table-column>

        <el-table-column
          label="培训方式"
          prop="trainWay"
          min-width="90"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ getTrainWay(scope.row.trainWay) }}
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
import { getScheduleList } from '@/api/training/training'
import { getCategoryTree } from '@/api/train/train'
import { trainCancelRelation } from '@/api/knowledge'
export default {
  name: 'Training',
  components: {
    Pagination
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
        categoryId: '',
        status: '',
        trainScope: '',
        knowledgeSystemId: this.knowledgeSystemId,
        catalogId: '',
        trainWay: '',
        pageNo: 1,
        pageSize: 10
      },
      filterForm: {
        categoryId: '',
        status: '',
        trainScope: '',
        knowledgeSystemId: this.knowledgeSystemId,
        catalogId: '',
        trainWay: '',
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
  computed: {
    trainWayOptions() {
      if (this.filterForm.trainScope === 'inside') {
        return [
          { label: '线上培训', value: 1 },
          { label: '线下培训', value: 2 },
          { label: '混合培训', value: 3 }
        ]
      } else {
        return [
          { label: '非脱产培训', value: 11 },
          { label: '脱产培训', value: 12 },
          { label: '业余培训', value: 13 }
        ]
      }
    }
  },
  created() {
    this.getCategoryData()
    if (this.knowledgeSystemId) {
      this.getData()
    }
  },
  methods: {
    toDetail(row) {
      const { id, status } = row
      this.$router.push({ path: '/training/trainingDetail', query: { id, status } })
    },
    getCategoryData() {
      getCategoryTree({ addFlag: 1 }).then((res) => {
        this.categoryData = res
      })
    },
    getTrainWay(way) {
      switch (way) {
        case 1:
          return '线上培训'
        case 2:
          return '线下培训'
        case 3:
          return '混合培训'
        case 11:
          return '非脱产培训'
        case 12:
          return '脱产培训'
        case 13:
          return '业余培训'
      }
    },
    getStatus(status) {
      switch (status) {
        case 1:
          return '未开始'
        case 2:
          return '进行中'
        case 3:
          return '已结束'
        case 4:
          return '草稿'
      }
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
        message = '确定要对该培训取消关联吗？'
        params = [target.id]
      } else {
        message = '确定要对所选培训取消关联吗？'
        params = this.multipleSelection.map((item) => item.id)
      }

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          trainCancelRelation({ source: 'train', trainIds: params.join(',') }).then(() => {
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
      getScheduleList(this.filterForm)
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
    'filterForm.trainScope'() {
      this.filterForm.trainWay = ''
    },
    'filterForm.trainName': _.debounce(function() {
      this.resetPageAndGetList()
    }, 1000)
  }
}
</script>
<style lang="scss">
.knowledge-training {
  .el-form--inline .el-form-item {
    margin-right: 20px;
  }
}
</style>
<style lang="scss" scoped>
.knowledge-training {
  .el-form--inline .el-form-item {
    margin-right: 20px;
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
