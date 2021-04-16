<template>
  <div class="situation">
    <div class="table-wrapper">
      <div class="filter-container">
        <div class="operate-wrapper">
          <div class="operate-left">
            <div class="input-wrapper">
              <el-input
                v-model="queryForm.userName"
                :disabled="loading"
                clearable
                size="medium"
                placeholder="输入学员姓名搜索"
                suffix-icon="el-icon-search"
              ></el-input>
            </div>

            <el-popover v-model="queryFormVisible" placement="bottom" transition="false">
              <el-form
                label-position="left"
                :inline="true"
                :model="queryForm"
                class="filter-form"
                label-width="80px"
                style="padding: 24px"
              >
                <el-form-item label="所属部门">
                  <tree-selector
                    class="selector"
                    :options="treeData"
                    placeholder="请选择组织"
                    :props="seletorProps"
                    @getValue="(name) => queryForm.dept = name"
                  />

                </el-form-item>
                <el-form-item label="完成时间">
                  <el-date-picker
                    v-model="queryForm.subTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>

                <el-form-item label="完成情况">
                  <el-select v-model="queryForm.status" clearable placeholder="请选择">
                    <el-option label="已完成" :value="1"></el-option>
                    <el-option label="未完成" :value="0"></el-option>
                  </el-select>
                </el-form-item>

                <div style="text-align: right; margin-right: 35px">
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
                    @click="queryForm = { ...initForm, name: queryForm.userName }"
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
        </div>
      </div>

      <div class="table-container">
        <div style="margin-bottom: 8px" v-if="multipleSelection.length">
          <span>{{ `已选中${multipleSelection.length}项` }}</span>
          <span
            style="
              display: inline-block;
              width: 1px;
              height: 1em;
              margin: 0 8px;
              vertical-align: middle;
              background-color: #dcdfe6;
            "
          ></span>
          <el-button type="text" style="padding: 0" @click="handleDelete"
            >批量删除</el-button
          >
        </div>

        <el-table
          v-loading="loading"
          :data="tableData"
          height="45vh"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            fixed="left"
            align="center"
            label="姓名"
            :show-overflow-tooltip="true"
            width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.userName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="userPhone"
            :show-overflow-tooltip="true"
            label="手机号"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="dept"
            :show-overflow-tooltip="true"
            label="所属部门"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="state"
            :show-overflow-tooltip="true"
            label="完成情况"
          >
            <template slot-scope="scope">
              {{ scope.row.status == 0 ? '未完成' : '已完成' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="subTime"
            :show-overflow-tooltip="true"
            label="完成时间"
          >
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
import TreeSelector from '@/components/tree-selector'

import Pagination from "@/components/common-pagination";
import { students } from '@/api/questionnaire'
import { getOrgTreeSimple } from '@/api/org/org'

export default {
  name: "situation",
  components: {
    Pagination,
    TreeSelector
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      seletorProps: {
        value: 'orgName',
        label: 'orgName',
        children: 'children'
      },
      queryForm: {
        pageNo: 1,
        pageSize: 10,
      },
      tableData: [],
      multipleSelection: [],
      total: 0,
      loading: false,
      queryFormVisible: false,
      initForm: {
        pageSize: 10,
        pageNo: 1,
        userName: '',
        status: '',
        dept: '',
        subTime: '',
      },
      queryForm: {
        pageSize: 10,
        pageNo: 1,
        userName: '',
        status: '',
        dept: '',
        subTime: '',
      },
      treeData: []
    };
  },
  activated() {
    this.initForm.id = this.queryForm.id = this.id
    this.getData();
    this.getOrgTree();
  },
  methods: {
    resetPageAndGetList() {
      this.queryForm.pageSize = 10
      this.queryForm.pageNo = 1
      this.getData()
    },
    getOrgTree() {
      getOrgTreeSimple({ parentOrgId: 0 }).then((res) => {
        this.treeData = res
      })
    },
    resetFormAndGetList() {},
    pagination({ value, limit }) {
      this.queryForm.pageNo = value
      this.queryForm.pageSize = limit
      this.getData()
    },
    getData() {
      this.loading = true
      students(this.queryForm).then(res => {
        const { data, totalNum } = res
        this.tableData = data
        this.total = totalNum
      }).finally(() => {
        this.loading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete(target) {
      this.$confirm("您确定要批量删除选中的问卷吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (!Array.isArray(target)) target = [target];
          const ids = target.map((item) => item.id);
          this.confirmDelete(ids);
        })
        .catch(() => {});
    },
    confirmDelete(target) {},
  },
  watch: {
    'queryForm.userName': _.debounce(function() {
      this.getData()
    }, 1000),
  }
};
</script>

<style lang="scss" scoped>
.situation {
  .data-area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 0;
    box-sizing: border-box;
    .data-item {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      .name {
        opacity: 0.45;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #000b15;
      }
      .content {
        margin-top: 8px;
        font-family: PingFangSC-Medium;
        font-size: 28px;
        color: #000b15;
        line-height: 42px;
      }
    }
  }
  .table-wrapper {
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
  }
}
</style>
