<template>
  <div class="management">
    <page-header title="问卷管理">
      <el-button
        slot="rightMenu"
        type="primary"
        size="medium"
        @click="handleEdit"
      >
        创建问卷
      </el-button>
    </page-header>

    <div class="body">
      <div class="filter-container">
        <div class="operate-wrapper">
          <div class="operate-left">
            <div class="input-wrapper">
              <el-input
                v-model="queryForm.asqName"
                :disabled="loading"
                clearable
                size="medium"
                placeholder="输入问卷名称搜索"
                suffix-icon="el-icon-search"
                :maxlength="32"
              ></el-input>
            </div>

            <el-popover
              v-model="queryFormVisible"
              placement="bottom-end"
              transition="false"
            >
              <el-form
                label-position="left"
                :inline="true"
                :model="queryForm"
                class="filter-form"
                label-width="80px"
                style="padding: 24px"
              >
                <el-form-item label="问卷分类">
                  <tree-selector
                    class="selector"
                    :options="treeData"
                    placeholder="请选择"
                    :props="seletorProps"
                    :value="queryForm.categoryId"
                    @getValue="(id) => (queryForm.categoryId = id)"
                  />
                </el-form-item>
                <el-form-item label="创建人">
                  <el-select
                    v-model="queryForm.creatorId"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in creatorList"
                      :key="item.creatorId"
                      :label="item.name"
                      :value="item.creatorId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="题目数量">
                  <el-form-item
                    prop="minNum"
                    style="margin-right: 0"
                  >
                    <el-input-number
                      v-model="queryForm.minNum"
                      controls-position="right"
                      clearable
                      placeholder="最小值"
                      width="110"
                    />
                  </el-form-item>
                  <span style="display: inline-block; margin: 0 5px;">~</span>
                  <el-form-item prop="maxNum">
                    <el-input-number
                      v-model="queryForm.maxNum"
                      controls-position="right"
                      clearable
                      placeholder="最大值"
                      width="110"
                    />
                  </el-form-item>
                </el-form-item>
                <div style="text-align: right; margin-right: 75px">
                  <el-button
                    type="primary"
                    size="medium"
                    :disabled="loading"
                    @click.native="resetPageAndGetList"
                  >
                    搜索
                  </el-button>
                  <el-button
                    size="medium"
                    @click="queryForm = { ...initForm, asqName: queryForm.asqName }"
                  >
                    重置
                  </el-button>
                </div>
              </el-form>
              <el-button
                slot="reference"
                size="medium"
                icon="icon-basics-filter-outlined"
                :disabled="loading"
              >
                筛选
              </el-button>
            </el-popover>
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
        <div style="margin-bottom: 8px; height:21px;">
          <!-- <div v-if="multipleSelection.length">
            <span>{{ `已选中${multipleSelection.length}项` }}</span>
            <span
              style="
                display: inline-block;
                width: 1px;
                margin: 0 8px;
                vertical-align: middle;
                background-color: #dcdfe6;
              "
            ></span>
            <el-button
              type="text"
              style="padding: 0"
              @click="() => handleDelete()"
            >
              批量删除
            </el-button>
        </div> -->
        </div>

        <el-table
          v-loading="loading"
          :data="data"
          height="60vh"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column
            type="selection"
            width="55"
          /> -->
          <el-table-column
            v-if="columns['问卷名称']"
            fixed="left"
            align="center"
            label="问卷名称"
            show-overflow-tooltip
            width="220"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="toPreview(scope.row)"
              >
                {{ scope.row.asqName }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columns['问卷分类']"
            align="center"
            prop="categoryName"
            :show-overflow-tooltip="true"
            label="问卷分类"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['问卷简介']"
            align="center"
            prop="remark"
            :show-overflow-tooltip="true"
            label="问卷简介"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['题目数量']"
            align="center"
            prop="questionNum"
            :show-overflow-tooltip="true"
            label="题目数量"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['创建时间']"
            align="center"
            :show-overflow-tooltip="true"
            prop="createTime"
            label="创建时间"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['创建人']"
            align="center"
            :show-overflow-tooltip="true"
            prop="name"
            label="创建人"
          >
          </el-table-column>

          <el-table-column
            prop="operate"
            align="center"
            label="操作"
            fixed="right"
            width="180"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
              <el-button
                type="text"
                size="small"
                :loading="scope.row.copyLoading"
                @click="handleCopy(scope.row)"
              >
                复制
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="page-container">
        <pagination
          :total="total"
          :page="queryForm.currentPage"
          :limit="queryForm.size"
          @pagination="pagination"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/common-pagination'
import {
  questionnaireList,
  listCreatorId,
  questionnaireDelete,
  questionnaireCopy
} from '@/api/questionnaire'
import TreeSelector from '@/components/tree-selector'
import { queryCategoryOrgList } from '@/api/resource/classroom'

export default {
  name: 'Management',
  components: {
    Pagination,
    TreeSelector
  },
  data() {
    return {
      queryFormVisible: false,
      columns: {
        问卷名称: true,
        问卷分类: true,
        问卷简介: true,
        题目数量: true,
        创建时间: true,
        创建人: true
      },
      seletorProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      initForm: {
        currentPage: 1,
        size: 10,
        creatorId: '',
        minNum: '',
        maxNum: '',
        categoryId: '',
        asqName: ''
      },
      queryForm: {
        currentPage: 1,
        size: 10,
        creatorId: '',
        minNum: '',
        maxNum: '',
        categoryId: '',
        asqName: ''
      },
      loading: false,
      data: [],
      treeData: [],
      multipleSelection: [],
      creatorList: [],
      total: 0
    }
  },
  computed: {
    minInit() {
      const maxNum = this.queryForm.maxNum
      if (typeof maxNum === 'number') {
        return maxNum
      }
      return 0
    },
    maxInit() {
      const minNum = this.queryForm.minNum
      if (typeof minNum === 'number') {
        return minNum + 1
      }
      return 0
    }
  },
  watch: {
    'queryForm.asqName': _.debounce(function() {
      this.resetPageAndGetList()
    }, 1000)
  },
  activated() {
    this.getData()
  },
  methods: {
    resetPageAndGetList() {
      this.queryForm.currentPage = 1
      this.queryForm.size = 10
      this.getList()
    },
    toPreview(item) {
      this.$router.push({
        path: '/questionnaire/preview',
        query: {
          id: item.id
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleEdit(item) {
      this.$router.push({
        path: '/questionnaire/edit',
        query: {
          id: item.id
        }
      })
    },
    handleDelete(target) {
      const message = target ? '您确定删除选中的问卷吗？' : '您确定要批量删除选中的问卷吗？'
      this.$confirm(message, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          target = (target && [target]) || this.multipleSelection
          const ids = target.map((item) => item.id)
          const formData = new FormData()
          formData.append('id', ids.join(','))
          questionnaireDelete(formData).then(() => {
            this.$message.success(`已成功删除${ids.length}条问卷`)
            this.getList()
          })
        })
        .catch(() => {})
    },
    handleCopy(target) {
      questionnaireCopy({ id: target.id }).then(() => {
        this.getList()
      })
    },
    getData() {
      this.getList()
      queryCategoryOrgList({ source: 'questionnaire' }).then((res) => {
        this.treeData = res
      })
      listCreatorId({ id: '' }).then((res) => {
        this.creatorList = res
      })
    },
    getList() {
      if (this.loading) return
      this.loading = true
      questionnaireList(this.queryForm)
        .then((res) => {
          const { list, totalNum } = res
          this.data = list
          this.total = totalNum
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
      this.queryForm.currentPage = page
      this.queryForm.size = limit
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.management {
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
.management {
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
