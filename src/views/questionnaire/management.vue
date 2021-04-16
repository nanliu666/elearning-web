<template>
  <div class="management">
    <page-header title="问卷管理">
      <el-button slot="rightMenu" type="primary" size="medium" @click="handleEdit">
        创建问卷
      </el-button>
    </page-header>

    <div class="body">
      <div class="filter-container">
        <div class="operate-wrapper"> 
          <div class="operate-left">
            <div class="input-wrapper">
              <el-input
                v-model="queryForm.name"
                :disabled="loading"
                clearable
                size="medium"
                placeholder="输入问卷名称搜索"
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
                <el-form-item label="问卷分类">
                  <el-select v-model="queryForm.isUsed" clearable placeholder="请选择">
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="禁用" value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="创建人">
                  <el-input
                    v-model="queryForm.creatorId"
                    clearable
                    style="width: 202px"
                    placeholder="请输入创建人"
                  >
                  </el-input>
                </el-form-item>

                <el-form-item label="题目数量">
                  <el-input
                    v-model="queryForm.min"
                    clearable
                    style="width: 100px"
                    placeholder="最小值"
                  />
                  ~
                  <el-input
                    v-model="queryForm.max"
                    clearable
                    style="width: 100px"
                    placeholder="最大值"
                  />
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
                    @click="queryForm = { ...initForm, name: queryForm.name }"
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
                <i class="el-icon-refresh-right" style="margin-right: 2px"></i>刷新
              </div>
            </div>
            <el-dropdown :hide-on-click="false" trigger="click">
              <i class="el-icon-setting set-btn"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(val, key) in columns" :key="key">
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
          :data="data"
          height="60vh"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-if="columns['问卷名称']"
            fixed="left"
            prop="name"
            align="center"
            label="问卷名称"
            :show-overflow-tooltip="true"
            width="180"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="toPreview(scope.row)">{{ scope.row.name }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columns['问卷分类']"
            align="center"
            prop="catalog"
            :show-overflow-tooltip="true"
            label="问卷分类"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['问卷简介']"
            align="center"
            prop="intro"
            :show-overflow-tooltip="true"
            label="问卷简介"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['题目数量']"
            align="center"
            prop="count"
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
            prop="creator"
            label="创建人"
          >
          </el-table-column>

          <el-table-column prop="operate" align="center" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleEdit(scope.row)">
                编辑
              </el-button>
              <el-button type="text" size="small" @click="handleDelete(scope.row)">
                删除
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="handleCopy(scope.row, scope.$index)"
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
          :page="queryForm.pageNo"
          :limit="queryForm.pageSize"
          @pagination="pagination"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/common-pagination";
import { deepClone } from "@/util/util";
export default {
  name: "management",
  components: {
    Pagination,
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
        创建人: true,
      },
      queryForm: {
        pageNo: 1,
        pageSize: 10,
      },
      loading: false,
      data: [],
      multipleSelection: [],
      total: 0,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    toPreview(item) {
      this.$router.push({
        path:'/questionnaire/preview'
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit() {
      this.$router.push({
        path: '/questionnaire/edit'
      })
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
    handleCopy(target, index) {
      const newItem = deepClone(target);
      newItem.name = newItem.name + '(副本)'
      this.data.splice(index + 1, 0, newItem)
    },
    getData() {
      this.data = [
        {
          name: "网购用户满意度调查",
          catalog: "问卷调查组>市场部门内部>推广组>A推广人员",
          intro:
            "为了了解网购相关问题，提高网购为了了解网购相关问题，提高网购为了了解网购相关问题，提高网购",
          count: "题目数量",
          createTime: "创建时间",
          creator: "tom",
        },
      ];
    },
    resetFormAndGetList() {
      if (this.loading) return;
      this.filterForm = { ...this.initForm };
      this.getData();
    },
    pagination() {},
  },
};
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
