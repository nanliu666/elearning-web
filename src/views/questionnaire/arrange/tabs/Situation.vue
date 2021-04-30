<template>
  <div class="situation">
    <div class="data-area">
      <div class="data-item">
        <div class="name">
          回收量/次
        </div>
        <div class="content">
          {{ count.backCount }}
        </div>
      </div>
      <div class="data-item">
        <div class="name">
          浏览量/次
        </div>
        <div class="content">
          {{ count.viewCount }}
        </div>
      </div>
      <div class="data-item">
        <div class="name">
          回收率/%
        </div>
        <div class="content">
          {{ count.backRate }}
        </div>
      </div>
      <div class="data-item">
        <div class="name">
          平均提交时间/分钟
        </div>
        <div class="content">
          {{ count.avgTime }}
        </div>
      </div>
    </div>
    <div class="table-wrapper">
      <div class="filter-container">
        <div class="operate-wrapper">
          <div class="operate-left">
            <div class="input-wrapper">
              <el-input
                v-model="queryForm.userName"
                clearable
                size="medium"
                placeholder="输入学员姓名搜索"
                suffix-icon="el-icon-search"
              ></el-input>
            </div>

            <el-popover
              v-model="queryFormVisible"
              :offset="200"
              placement="bottom"
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
                <el-form-item label="所属部门">
                  <tree-selector
                    class="selector"
                    :options="treeData"
                    placeholder="请选择组织"
                    :props="seletorProps"
                    :value="queryForm.dept"
                    @getValue="(name) => (queryForm.dept = name)"
                  />
                </el-form-item>
                <el-form-item label="提交时间">
                  <el-date-picker
                    v-model="queryForm.subTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>

                <el-form-item label="提交情况">
                  <el-select
                    v-model="queryForm.status"
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      label="已提交"
                      :value="1"
                    ></el-option>
                    <el-option
                      label="未提交"
                      :value="0"
                    ></el-option>
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
        <div
          v-if="multipleSelection.length"
          style="margin-bottom: 8px"
        >
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
          <el-button
            type="text"
            style="padding: 0"
            @click="handleDelete"
          >
            批量删除
          </el-button>
        </div>

        <el-table
          v-loading="loading"
          :data="tableData"
          height="45vh"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column
            type="selection"
            width="55"
          /> -->
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
            <template slot-scope="scope">
              <div>
                {{ scope.row.dept || '--' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="state"
            :show-overflow-tooltip="true"
            label="提交情况"
          >
            <template slot-scope="scope">
              {{ scope.row.status == 0 ? '未提交' : '已提交' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :show-overflow-tooltip="true"
            label="提交时间"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.subTime || '--' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                :disabled="scope.row.status == 0"
                @click="showPreview(scope.row)"
              >
                查看问卷
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

    <el-dialog
      :visible.sync="dialogVisible"
      class="question-dialog"
      destroy-on-close
      :show-close="false"
    >
      <div
        v-loading="dialogLoading"
        class="preview-wrapper"
      >
        <el-scrollbar>
          <div>
            <div class="preview-header-area">
              <div class="preview-title">
                {{ questionData.planName }}
              </div>
              <div class="preview-intro">
                {{ questionData.remark }}
              </div>
            </div>

            <div class="preview-topic">
              <div
                v-for="(question, index) in questionData.questionCpList"
                :key="question.questionId"
                class="question-item"
              >
                <div class="question-title">
                  <div class="question-index">
                    <span
                      v-if="question.status == 1"
                      class="request"
                    >*</span>

                    <span class="text">{{ index + 1 }}.</span>
                  </div>
                  <div class="question-name">
                    {{ question.content }}<span class="question-type">
                    【{{ getTypeName(question) }}】
                  </span>
                  </div>
  
                  <span
                    v-if="question.type == 'multi_choice'"
                    class="question-limit"
                  >最少可选{{ question.multiMin }}项，最多可选{{ question.multiMax }}项</span>
                </div>

                <div class="question-content">
                  <el-input
                    v-if="question.type == 'short_answer'"
                    :value="questionResults[index]"
                  ></el-input>

                  <el-radio-group
                    v-if="question.type == 'single_choice'"
                    v-model="questionResults[index]"
                    disabled
                  >
                    <el-radio
                      v-for="(option, option_index) in question.optionCpList"
                      :key="option_index"
                      :label="option.content"
                    ></el-radio>
                  </el-radio-group>

                  <div v-if="question.type == 'multi_choice'">
                    <el-checkbox-group
                      v-model="questionResults[index]"
                      disabled
                    >
                      <el-checkbox
                        v-for="(option, option_index) in question.optionCpList"
                        :key="option_index"
                        :label="option.content"
                      />
                    </el-checkbox-group>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TreeSelector from '@/components/tree-selector'

import Pagination from '@/components/common-pagination'
import { students, count, viewAnswer } from '@/api/questionnaire'
import { getOrgTreeSimple } from '@/api/org/org'

export default {
  name: 'Situation',
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
      dialogLoading: false,
      seletorProps: {
        value: 'orgName',
        label: 'orgName',
        children: 'children'
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
        subTime: ''
      },
      queryForm: {
        pageSize: 10,
        pageNo: 1,
        userName: '',
        status: '',
        dept: '',
        subTime: ''
      },
      treeData: [],
      count: {},
      questionData: {
        asqQuestions: []
      },
      dialogVisible: false,
      questionResults: []
    }
  },
  watch: {
    id() {
      this.initData()
    },
    'queryForm.userName': _.debounce(function() {
      this.getData()
    }, 1000)
  },
  methods: {
    getTypeName(item) {
      let result = ''
      switch (item.type) {
        case 'short_answer':
          result += '简答题'
          break
        case 'single_choice':
          result += '单选题'
          break
        case 'multi_choice':
          result += '多选题'
          break
        default:
          break
      }
      return result
    },
    showPreview(item) {
      this.dialogVisible = true
      this.dialogLoading = true
      viewAnswer({ subjectCpId: item.subjectCpId })
        .then((res) => {
          this.questionData = res
          if (!res.questionCpList) return
          res.questionCpList.forEach((question) => {
            const { optionCpList = [], answerUser = '', type } = question

            this.questionResults.push(
              type == 'short_answer'
                ? answerUser
                : type == 'single_choice' ? optionCpList.filter(option => option.questionOptionId == answerUser).map(option => option.content).join('')
                : optionCpList
                    .filter((option) => answerUser.split(',').includes(option.questionOptionId))
                    .map((option) => option.content)
            )
          })
        })
        .finally(() => (this.dialogLoading = false))
    },
    initData() {
      this.initForm.id = this.queryForm.id = this.id
      this.getData()
      this.getOrgTree()
    },
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
      students(this.queryForm)
        .then((res) => {
          const { data, totalNum } = res
          this.tableData = data
          this.total = totalNum
        })
        .finally(() => {
          this.loading = false
        })

      const data = JSON.parse(JSON.stringify(this.queryForm))
      delete data.pageNo
      delete data.pageSize
      count(data).then((res = {}) => {
        Object.keys(res).forEach((key) => {
          this.count[key] = res[key] || 0
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
    // handleDelete(target) {
    //   this.$confirm('您确定要批量删除选中的问卷吗？', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       if (!Array.isArray(target)) target = [target]
    //       const ids = target.map((item) => item.id)
    //       this.confirmDelete(ids)
    //     })
    //     .catch(() => {})
    // },
    // confirmDelete(target) {}
  }
}
</script>
<style lang="scss">
.situation {
  .preview-wrapper {
    margin: 40px;
    overflow-y: auto;
    height: 550px;
    .preview-header-area {
      width: 100%;
      text-align: center;
      .preview-title {
        font-size: 18px;
        color: rgba(0, 11, 21, 0.85);
        font-weight: bold;
      }
      .preview-intro {
        font-size: 12px;
        color: rgba(0, 11, 21, 0.45);
        max-width: 800px;
        margin: 16px auto 0;
      }
    }
    .question-content {
      margin-left: 12px;
      width: 452px;
      .el-radio,
      .el-checkbox {
        display: block;
        line-height: 22px;
        margin-bottom: 0;
        &:not(:first-child) {
          margin-top: 16px;
        }
      }
    }
    .preview-topic {
      margin-top: 40px;
      .question-item {
        font-size: 14px;
        margin-bottom: 40px;
        .question-title {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: flex-start;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          letter-spacing: 0;
          line-height: 22px;
          margin-bottom: 8px;
          .question-index {
            font-weight: bold;
            flex-grow: 0;
            flex-shrink: 1;
            display: flex;
            align-items: center;
            margin-right: 5px;
            .request {
              margin-right: 5px;
              color: red;
            }
            .text {
              color: #000;
            }
          }
          .question-name {
            font-weight: bold;
            max-width: 500px;
          }
          .question-type {
            width: 70px;
            font-family: emoji;
            color: rgba(0, 11, 21, 0.45);
            font-weight: bold;
          }
          .question-limit {
            font-family: emoji;
            flex-shrink: 0;
            color: rgba(0, 11, 21, 0.45);
          }
        }
      }
    }
  }
  .el-dialog__footer {
    border-top: 1px solid #ddd;
  }
}
</style>
<style lang="scss" scoped>
.situation {
  .data-area {
    background-color: #fafafa;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 0;
    box-sizing: border-box;
    margin-bottom: 24px;
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
