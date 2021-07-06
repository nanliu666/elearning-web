<template>
  <div class="agreement">
    <page-header title="培训协议管理">
      <el-button
        slot="rightMenu"
        v-p="EDIT_AGREEMENT"
        type="primary"
        size="medium"
        @click="handleCreate"
      >
        创建培训协议
      </el-button>
    </page-header>

    <div class="body">
      <div class="filter-container">
        <div class="operate-wrapper">
          <div class="operate-left">
            <div class="input-wrapper">
              <el-input
                v-model="queryForm.name"
                clearable
                size="medium"
                placeholder="输入培训协议名称"
                suffix-icon="el-icon-search"
                :maxlength="32"
              ></el-input>
            </div>
          </div>

          <div class="operate-right">
            <div class="fresh-wrap">
              <div
                class="fresh-btn"
                :style="{ cursor: loading ? 'not-allowed' : 'pointer' }"
                @click="resetFormAndGetList"
              >
                <i
                  class="el-icon-refresh-right"
                  style="margin-right: 2px"
                ></i>刷新
              </div>
            </div>
            <el-dropdown
              :hide-on-click="false"
              trigger="click"
            >
              <i class="el-icon-setting set-btn"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(val, key) in columns"
                  :key="key"
                >
                  <el-checkbox v-model="columns[key]">
                    {{ key }}
                  </el-checkbox>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>

      <div class="table-container">
        <el-table
          ref="table"
          v-loading="loading"
          :data="data"
          height="60vh"
        >
          <el-table-column
            v-if="columns['培训协议名称']"
            fixed="left"
            align="left"
            :show-overflow-tooltip="true"
            label="培训协议名称"
            prop="name"
            min-width="180"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['签订人数']"
            align="left"
            prop="signNum"
            :show-overflow-tooltip="true"
            label="签订人数"
            min-width="180"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['完成人数']"
            align="left"
            prop="remark"
            :show-overflow-tooltip="true"
            label="完成人数"
            min-width="180"
          >
            <template slot-scope="scope">
              <div class="column-title">
                {{ scope.row.completeNum }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columns['关联培训']"
            align="left"
            prop="trainName"
            :show-overflow-tooltip="true"
            label="关联培训"
            min-width="180"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['创建时间']"
            align="left"
            :show-overflow-tooltip="true"
            prop="createTime"
            label="创建时间"
            min-width="180"
          >
          </el-table-column>

          <el-table-column
            align="left"
            label="操作"
            fixed="right"
            width="180"
          >
            <template slot-scope="scope">
              <el-button
                v-p="DETAIL_AGREEMENT"
                type="text"
                size="medium"
                @click="toView(scope.row)"
              >
                管理
              </el-button>
              <el-button
                v-p="DELETE_AGREEMENT"
                type="text"
                size="medium"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="page-container">
        <pagination
          :total="total"
          :page="queryForm.pageNo"
          :limit="queryForm.pageSize"
          @pagination="pagination"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/common-pagination'
import { listTrainAgreement, del } from '@/api/agreement'
import { EDIT_AGREEMENT, DELETE_AGREEMENT, DETAIL_AGREEMENT } from '@/const/agreement'

export default {
  name: 'Agreement',
  components: {
    Pagination
  },
  data() {
    return {
      queryFormVisible: false,
      columns: {
        培训协议名称: true,
        签订人数: true,
        完成人数: true,
        关联培训: true,
        创建时间: true
      },
      initForm: {
        pageNo: 1,
        pageSize: 10,
        name: ''
      },
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        name: ''
      },
      loading: false,
      data: [],
      multipleSelection: [],
      total: 0
    }
  },
  computed: {
    DETAIL_AGREEMENT: () => DETAIL_AGREEMENT,
    EDIT_AGREEMENT: () => EDIT_AGREEMENT,
    DELETE_AGREEMENT: () => DELETE_AGREEMENT
  },
  watch: {
    columns: {
      handler() {
        this.$nextTick(() => {
          this.$refs.table.doLayout()
          this.$refs.table.$forceUpdate()
        })
      },
      deep: true
    },
    'queryForm.name': _.debounce(function() {
      this.resetPageAndGetList()
    }, 1000)
  },
  activated() {
    this.getData()
  },
  methods: {
    toView(item) {
      const query = {}
      Object.keys(item).forEach((key) => {
        query[key] = item[key]
      })
      this.$router.push({
        path: '/agreement/view',
        query
      })
    },
    resetPageAndGetList() {
      this.queryForm.pageNo = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    handleCreate() {
      this.$router.push({
        path: '/agreement/edit'
      })
    },
    handleDelete(target) {
      this.$confirm('您确定删除选中的培训协议吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          del({
            id: target.id
          }).then(() => {
            this.$message.success('操作成功')
            this.getList()
          })
        })
        .catch(() => {})
    },
    getData() {
      this.getList()
    },
    getList() {
      if (this.loading) return
      this.loading = true
      listTrainAgreement(this.queryForm)
        .then((res) => {
          const { records, total } = res
          this.data = records
          this.total = total
        })
        .finally(() => {
          this.loading = false
        })
    },
    resetFormAndGetList() {
      this.queryForm = { ...this.initForm }
      this.getList()
    },
    pagination({ page, limit }) {
      this.queryForm.pageNo = page
      this.queryForm.pageSize = limit
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.agreement {
  .column-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-table th.gutter {
    display: table-cell !important;
  }

  .el-table colgroup.gutter {
    display: table-cell !important;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .el-form-item {
    margin-right: 20px;
  }
  .operate-wrapper .operate-left .input-wrapper {
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
.agreement {
  .body {
    background-color: #fff;
    padding: 24px;
    margin-bottom: 24px;
    .filter-container {
      .operate-wrapper {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        .operate-left {
          display: flex;
          align-items: center;
          .input-wrapper {
            width: 202px;
            margin-right: 10px;
          }
          .filter-btn {
            width: 85px;
          }
        }
        .operate-right {
          display: flex;
          align-items: center;
          height: 36px;
          margin-right: 10px;
          color: #a0a8ae;
          .fresh-wrap {
            padding-right: 10px;
            border-right: 1px solid #a0a8ae;
            .fresh-btn {
              cursor: pointer;
            }
          }
          .set-btn {
            cursor: pointer;
            margin-left: 10px;
            margin-top: 2px;
          }
        }
      }
    }
    .table-container {
    }
  }
}
</style>
