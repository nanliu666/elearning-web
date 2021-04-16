<template>
  <div class="arrange">
    <page-header title="问卷安排">
      <el-button slot="rightMenu" type="primary" size="medium" @click="handleEdit">
        创建问卷安排
      </el-button>
    </page-header>
    <!-- <div class="data-area">
      <div class="data-item">
        <div class="name">回收量/次</div>
        <div class="content">432</div>
      </div>
      <div class="data-item">
        <div class="name">浏览量/次</div>
        <div class="content">432</div>
      </div>
      <div class="data-item">
        <div class="name">回收率/人</div>
        <div class="content">432</div>
      </div>
      <div class="data-item">
        <div class="name">平均完成时间/分钟</div>
        <div class="content">432</div>
      </div>
    </div> -->
    <div class="body">
      <div class="filter-container">
        <div class="operate-wrapper">
          <div class="operate-left">
            <div class="input-wrapper">
              <el-input
                v-model="queryForm.subjectName"
                :disabled="loading"
                clearable
                size="medium"
                placeholder="输入问卷安排名称搜索"
                suffix-icon="el-icon-search"
              ></el-input>
            </div>

            <el-popover v-model="queryFormVisible" placement="bottom" transition="false" width="1230">
              <el-form
                label-position="left"
                :inline="true"
                :model="queryForm"
                class="filter-form"
                label-width="80px"
                style="padding: 24px"
              >
                <el-form-item label="状态">
                  <el-select v-model="queryForm.status" clearable placeholder="请选择" style="width: 217px;">
                    <el-option label="进行中" value="1"></el-option>
                    <el-option label="未开始" value="2"></el-option>
                    <el-option label="已过期" value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所在分类">
                  <tree-selector
                    style="width: 217px;"
                    class="selector"
                    :options="selectorData"
                    placeholder="请选择所在分类"
                    :props="seletorProps"
                    :value="queryForm.categoryId"
                    @getValue="(id) => queryForm.categoryId = id"
                  />
                </el-form-item>
                <el-form-item label="题目数量">
                  <el-input-number
                    v-model="queryForm.minBackCount"
                    controls-position="right"
                    clearable
                    :min="1"
                    :max="typeof queryForm.maxBackCount == 'number' ? queryForm.maxBackCount - 1 : 0"
                    placeholder="最小值"
                    width="110"
                  />
                  ~
                  <el-input-number
                    v-model="queryForm.maxBackCount"
                    controls-position="right"
                    clearable
                    :min="typeof queryForm.minBackCount == 'number' ? queryForm.minBackCount + 1 : 1"
                    placeholder="最大值"
                    width="110"
                  />
                </el-form-item>

              <el-form-item label="开始时间">
                <el-date-picker
                  style="width: 100%;"
                  v-model="queryForm.publishTime"
                  value-format="yyyy-MM-dd"
                  @change="publishTimeChange"
                  :picker-options="pickerOptionsStart"
                  placeholder="发布时间" />

              </el-form-item>
              <el-form-item label="截止时间">
                <el-date-picker
                style="width: 100%;"
                  v-model="queryForm.endTime"
                  value-format="yyyy-MM-dd"
                  @change="endTimeChange"
                  :picker-options="pickerOptionsEnd"
                  placeholder="截止时间" />

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
                    @click="queryForm = { ...initForm, subjectName: queryForm.subjectName }"
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
          <el-button type="text" style="padding: 0" @click="() => handleDelete" :loading="multipleDelLoading"
            >批量删除</el-button
          >
        </div>

        <el-table
          v-loading="loading"
          :data="data"
          height="50vh"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-if="columns['编号']"
            fixed="left"
            align="center"
            prop="planCode"
            label="编号"
            width="220"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['问卷安排名称']"
            align="center"
            prop="planName"
            :show-overflow-tooltip="true"
            label="问卷安排名称"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="toDetail(scope.row)">{{
                scope.row.planName
              }}</el-button>
            </template>
          </el-table-column>

          <el-table-column
            v-if="columns['状态']"
            align="center"
            prop="status"
            :show-overflow-tooltip="true"
            label="状态"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.state == 1 ? '未开始' : scope.row.status == 2 ?  '进行中' : '已过期' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columns['所在分类']"
            align="center"
            :show-overflow-tooltip="true"
            prop="categoryFullName"
            label="所在分类"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['回收数量']"
            align="center"
            :show-overflow-tooltip="true"
            prop="backCount"
            label="回收数量"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['关联问卷']"
            align="center"
            :show-overflow-tooltip="true"
            prop="subjectName"
            label="关联问卷"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['发布时间']"
            align="center"
            :show-overflow-tooltip="true"
            prop="publishTime"
            label="发布时间"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['截止时间']"
            align="center"
            :show-overflow-tooltip="true"
            prop="endTime"
            label="截止时间"
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

          <el-table-column prop="operate" align="center" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleEdit(scope.row)">
                编辑
              </el-button>
              <el-button type="text" size="small" @click="handleDelete(scope.row)" :loading="scope.row.deleteLoading">
                删除
              </el-button>

              <el-dropdown>
                <i class="el-icon-arrow-more"></i>
          

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled="scope.row.status == 3" @click="handleStatusChange(scope.row.status == 1 ? 2 : 1)">{{scope.row.status == 1 ? '暂停' : '开始'}}</el-dropdown-item>
                  <el-dropdown-item :disabled="scope.row.status == 0">结束</el-dropdown-item>
                  <el-dropdown-item>选项分布 </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
import { queryQuestionnaireList, deleteQuestionnaire, end, suspend, start } from '@/api/questionnaire'
import { queryCategoryOrgList } from '@/api/resource/classroom'
import TreeSelector from '@/components/tree-selector'

export default {
  name: "management",
  components: {
    Pagination,
    TreeSelector
  },
  data() {
    return {
      queryFormVisible: false,
      columns: {
        编号: true,
        问卷安排名称: true,
        状态: true,
        所在分类: true,
        回收数量: true,
        关联问卷: true,
        发布时间: true,
        截止时间: true,
        创建时间: true,
      },
      initForm: {
        pageNo: 1,
        pageSize: 10,
        categoryId: '',
        subjectName: '',
        publishTime: '',
        endTime: '',
        minBackCount: '',
        maxBackCount: '',
        status: '',
      },
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        categoryId: '',
        subjectName: '',
        publishTime: '',
        endTime: '',
        minBackCount: '',
        maxBackCount: '',
        status: '',
      },
      loading: false,
      multipleDelLoading: false,
      data: [],
      multipleSelection: [],
      total: 0,
      selectorData: [],
      seletorProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      pickerOptionsStart: {},
      pickerOptionsEnd: {},
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async handleStatusChange(type) {
      if (type === 3) {
        const result = await this.confirmFinish()
        if (!result) return
      }
      let api, loading
      switch (type) {
        case 'pause':
          api = suspend
          loading = 'btn1Loading'
          break;
        case 'start':
          api = start
          loading = 'btn1Loading'
          break;
        case 'finish':
          api = end
          loading = 'btn2Loading'
      }
      this[loading] = true
      api({ id: "1381777442804695041" }).then(() => {
        this.$message.success('操作成功')
        if (type === 'finish') {
          this.data.status = 2
        } else {
          this.data.isSuspend = type === 'start' ? 1 : 2
        }
      }).finally(() => {
        this[loading] = false
      })
    },
    confirmFinish() {
      return this.$confirm('是否结束该问卷安排?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {})
    },
    publishTimeChange() { // 限制开始时间
      this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
        disabledDate: (time) => {
          if (this.queryForm.publishTime) {
            const publishTime = new Date(this.queryForm.publishTime)
            return time.getTime() < publishTime.getTime() - 86400000
          }
        }
      })
    },
    endTimeChange() { // 限制结束时间
      this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
        disabledDate: (time) => {
          if (this.queryForm.endTime) {
            const endTime = new Date(this.queryForm.endTime)
            return time.getTime() > endTime.getTime() - 86400000
          }
        }
      })
    },
    resetPageAndGetList() {
      this.queryForm.pageNo = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    toDetail(item) {
      const query = {};
      Object.keys(item).forEach((key) => {
        query[key] = item[key];
      });
      this.$router.push({
        path: "/questionnaire/arrange/detail",
        query,
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(edit) {
      const params = {}
      if (!(edit instanceof MouseEvent)) {
        Object.keys(edit).forEach(key => {
          params[key] = edit[key]
        })
      }
      this.$router.push({
        name: 'questionnaire-arrange',
        params
      })
    },
    handleDelete(target) {
      const message = target ? '您确定删除选中的问卷吗？' : "您确定要批量删除选中的问卷吗？"
      this.$confirm(message, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let ids = target ? [target] : this.multipleSelection
      
        ids = ids.map(item => item.id).join('')
        if (target) {
          target.deleteLoading = true
        } else {
          this.multipleDelLoading = true
        }
        deleteQuestionnaire(ids).then(() => {
          this.$message.success('删除成功')
        }).finally(() => {
          if (target) {
            target.deleteLoading = false
          } else {
            this.multipleDelLoading = false
          }
        })
      });
    },
    getData() {
      this.getList()

      queryCategoryOrgList({ source: 'questionnaire' }).then(res => {
        this.selectorData = res
      })
    },
    getList() {
      if (this.loading) return;
      this.loading = true
      queryQuestionnaireList(this.queryForm).then(res => {
        const {totalNum = 0, data = []} = res
        this.total = totalNum
        this.data = data
      }).finally(() => this.loading = false)
    },
    resetFormAndGetList() {
      this.queryForm = { ...this.initForm };
      this.getList();
    },
    pagination({page, limit}) {
      this.queryForm.pageNo = page
      this.queryForm.pageSize = limit
      this.getList()
    },
  },
  watch: {
    'queryForm.subjectName': _.debounce(function() {
      this.getList()
    }, 1000)
  }
};
</script>
<style lang="scss">
.arrange {
  .el-form-item {
    margin-right: 20px;
  }
  .el-form--inline .el-form-item {
    margin-right: 22px !important;
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
.arrange {
  .data-area {
    cursor: default;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    margin-bottom: 16px;
    padding: 24px 0;
    box-sizing: border-box;
    .data-item {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      &:not(:last-child) {
        border-right: 1px solid #EBECED;
      }
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
