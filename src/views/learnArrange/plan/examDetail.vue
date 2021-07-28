<template>
  <div class="examinationDetail">
    <div
      class="back-btn"
      @click="back"
    >
      <i class="icon el-icon-arrow-left"></i>
      <span class="text">考试详情</span>
    </div>

    <div class="title_top">
      <div class="title">
        <span>{{ ExamDetail.examName }}</span>

        <ul>
          <li
            v-if="ExamDetail.status === 1"
            class="status_1"
          >
            未开始
          </li>
          <li
            v-if="ExamDetail.status === 3"
            class="status_3"
          >
            已结束
          </li>
          <li
            v-if="ExamDetail.status === 2"
            class="status_2"
          >
            进行中
          </li>
        </ul>
      </div>
      <ul class="text">
        <li>
          <span>考试日期：</span>
          <span>{{ `${ExamDetail.startTime || ''}-${ExamDetail.endTime || '-'}` }}</span>
        </li>
        <li>
          <!-- <span>考试时间：</span> <span>{{ ExamDetail.examPeriod }}分钟</span> -->

          <span>考试时间：</span>
          <span v-if="ExamDetail.reckonTime">{{ ExamDetail.reckonTimeValue || 0 }}分钟</span>
          <span v-else> 无限制 </span>
        </li>
        <li>
          <span>关联用卷：</span> <span>{{ ExamDetail.testPaperName }}</span>
        </li>
        <li>
          <span>评卷人：</span> <span>{{ ExamDetail.reviewerNames }}</span>
        </li>
      </ul>
    </div>

    <div class="table">
      <div class="table_title_box">
        <span>
          考生列表
        </span>

        <!-- <span style="cursor:pointer;" @click="getInfo">
          刷新
        </span> -->
      </div>
      <common-table
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :page-config="tablePageConfig"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <!-- 完成时间: 0-否 1-是 -->
        <template
          slot="finishTime"
          slot-scope="{ row }"
        >
          <span> {{ row.finishTime || '--' }} </span>
        </template>

        <template
          slot="handler"
          slot-scope="scope"
        >
          <el-button
            type="text"
            @click="toAnswer(scope.row)"
          >
            考试详情
          </el-button>
        </template>
      </common-table>
    </div>
  </div>
</template>

<script>
import { getExamineeList, getExamDetail } from '@/api/learnArrange'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'userName'
  },
  {
    label: '手机号',
    prop: 'phoneNum'
  },
  {
    label: '所属部门',
    prop: 'orgName'
  },
  {
    label: '状态',
    prop: 'examStatus',
    formatter: (row) => {
      const END_STATUS = {
        0: '未开始',
        1: '缺考',
        2: '已考试'
      }
      return END_STATUS[row.examStatus]
    }
  },
  {
    label: '完成时间',
    prop: 'finishTime',
    slot: true
  },
  {
    label: '成绩',
    prop: 'score',
    slot: true
  },
  {
    label: '是否通过',
    prop: 'isPass',
    formatter: (row) => {
      const END_STATUS = {
        true: '通过',
        false: '未通过'
      }
      return END_STATUS[row.examStatus]
    }
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 200
  },
  enableMultiSelect: false, //复选框
  enablePagination: true,
  showHandler: false,
  showIndexColumn: false
}
const TABLE_PAGE_CONFIG = {}

export default {
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },

  data() {
    return {
      searchInput: '',
      pitch: 'CurrencyExam',
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },

      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      // query: {},
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tablePageConfig: TABLE_PAGE_CONFIG,
      ExamDetail: {}
    }
  },

  created() {
    this.getInfo()
  },
  // activated() {
  //   this.getInfo()
  // },
  methods: {
    back() {
      this.$router.back()
    },
    toAnswer() {},
    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.pageNo = param
      this.getInfo()
    },
    handlePageSizeChange(param) {
      this.page.pageNo = 1
      this.page.pageSize = param
      this.getInfo()
    },

    // 拿数据
    async getInfo() {
      let params = {
        examId: `${this.$route.query.examId}`,
        ...this.page
      }
      let { totalNum, data } = await getExamineeList(params)
      this.tableData = data
      this.page.total = totalNum
      this.ExamDetail = await getExamDetail(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.examinationDetail {
  .back-btn {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: fit-content;
    margin: 16px 0;
    font-size: 16px;
    color: rgba(0, 11, 21, 0.85);
    .icon {
      font-weight: 700;
      margin-right: 4px;
    }
  }
  .breadcrumb {
    padding: 20px 0;
    span {
      cursor: pointer;
    }
  }
  .title_top {
    margin: 0 0 24px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    padding: 30px 80px;
    .title {
      font-size: 18px;
      font-weight: bold;
      color: #666;
      display: flex;
      ul {
        font-size: 12px;
        display: flex;
        li {
          padding: 5px 10px;
          border-radius: 4px;
          margin-left: 20px;
        }
      }
    }
    .text {
      display: flex;
      margin-top: 24px;
      color: #666;
      li {
        margin-right: 80px;
        &:nth-child(4) {
          margin: 0;
        }
      }
    }
  }
  .table {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    padding: 24px;

    .table_title_box {
      color: #666;
      font-weight: bold;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
    }
  }
  .status_1 {
    background: #e7ffee;
    color: #00b061;
  }
  .status_2 {
    background: #fffce6;
    color: #fcba00;
  }
  .status_3 {
    background: #e7fbff;
    color: #01aafc;
  }

  /deep/.cell:empty::before {
    content: '--';
    color: gray;
  }
}
</style>
