<template>
  <div class="center">
    <page-header title="课程审核">
    </page-header>

    <div class="center_table">
      <div class="search_bar">
        <div class="search_bar_btn">
          <span
            :class="{ pitch: pitch == 1 }"
            @click="setPitch(1)"
          >待审核</span>
          <span
            class="pitch_icon"
            @click="setPitch(1)"
          >（{{ sonTotalNum || 0 }}）</span>
          <span
            :class="{ pitch: pitch == 2 }"
            @click="setPitch(2)"
          >已审核</span>
        </div>
      </div>

      <div class="search_bar_input">
        <div
          v-show="pitch == 2"
          class="search_bar_select"
        >
          <el-select
            v-model="statusValue"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <div
          v-show="pitch == 2"
          class="search_bar_searchInput"
        >
          <el-input
            v-model="searchInput"
            class="searchInput"
            placeholder="输入课程名称"
            suffix-icon="el-icon-search"
          >
          </el-input>
        </div>

        <div class="search_bar_Refresh">
          <span @click="upData"><i class="el-icon-refresh-right"></i>刷新</span>
        </div>
      </div>
      <!-- 第一页 -->
      <Reviewed
        v-show="pitch == 1"
        @titleTotalNum="titleTotalNum"
      />
      <!-- 第二页 -->
      <common-table
        v-show="pitch == 2"
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :page-config="tablePageConfig"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <!--  -->
        <template
          slot="apprNo"
          slot-scope="{ row }"
        >
          <el-button
            type="text"
            @click="toDetails(row)"
          >
            {{ row.apprNo }}
          </el-button>
        </template>
        <!-- 状态 -->
        <template #status="{ row }">
          <span
            class="status-span"
            :style="{
              color: statusToText(row.status).color,
              backgroundColor: statusToText(row.status).backgroundColor
            }"
            v-text="statusToText(row.status).text"
          />
        </template>
        <!-- 当前审批人 -->
        <template
          slot="approveUser"
          slot-scope="{ row }"
        >
          <span v-if="row.approveUser.length == 0"> - - </span>
          <span v-else>
            <span
              v-for="(item, index) in row.approveUser"
              :key="index"
            >{{ item.userName }}
              {{ index != row.approveUser.length - 1 ? ',' : '' }}
            </span>
          </span>
        </template>

        <template
          slot="handler"
          slot-scope="scope"
        >
          <!-- <el-button type="text" @click="againFn()"> 重新申请 </el-button>
      <el-button type="text" @click="withdrawFn(scope.row)"> 撤回 </el-button> -->
          <el-button
            type="text"
            @click="toDetails(scope.row)"
          >
            查看
          </el-button>
        </template>
      </common-table>
    </div>
  </div>
</template>

<script>
import { fulllist } from '@/api/approvalCenter/approvalCenter'
import { STATUS_TO_TEXT } from '@/const/approve'
import Reviewed from './components/Reviewed'
// 表格属性
let TABLE_COLUMNS = [
  {
    label: '审批单号',
    prop: 'apprNo',
    slot: true
  },
  {
    label: '课程标题',
    prop: 'formTitle'
  },
  {
    label: '申请人',
    prop: 'userName'
  },
  {
    label: '审核时间',
    prop: 'applyTime'
  },
  {
    label: '完成时间',
    prop: 'completeTime'
  },
  {
    label: '状态',
    prop: 'status',
    slot: true
  },
  {
    label: '审核人',
    prop: 'approveUser',
    slot: true
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    // width: 100
  },
  enablePagination: true,
  showHandler: true,
  showIndexColumn: false
}
const TABLE_PAGE_CONFIG = {}
export default {
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  components: { Reviewed },
  data() {
    return {
      sonTotalNum: '',
      searchInput: '',
      pitch: 1,
      options: [
        {
          value: 'Pass,Reject',
          label: '全部'
        },
        {
          value: 'Pass',
          label: '已通过'
        },
        {
          value: 'Reject',
          label: '已拒绝'
        }
      ],
      statusValue: 'Pass,Reject',

      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tablePageConfig: TABLE_PAGE_CONFIG,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },

  watch: {
    searchInput: function() {
      this.setPitch(this.pitch)
    },
    statusValue: function() {
      this.setPitch(this.pitch)
    }
  },

  activated() {
    this.setPitch(1)
  },
  methods: {
    upData() {
      this.setPitch(this.pitch)
    },
    statusToText(status) {
      return STATUS_TO_TEXT[status]
    },
    titleTotalNum(data) {
      this.sonTotalNum = data
    },
    //   导航栏btn
    setPitch(i) {
      if (this.pitch != i) this.searchInput = ''
      this.pitch = i || 1
      fulllist({
        ...this.page,
        categoryId: '1',
        status: this.statusValue,
        formTitle: this.searchInput
      }).then((res) => {
        this.tableData = res.data
        this.page.total = res.totalNum
      })
    },
    // 去详情
    toDetails(item) {
      this.$router.push({
        path: '/apprProcess/apprDetail',
        query: { apprNo: item.apprNo }
      })
    },
    // 重新申请
    againFn() {
      // window.console.log(id)
      this.$router.push({ path: '/course/establishCourse' })
    },
    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.pageNo = param
      this.setPitch(this.pitch)
    },
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.setPitch(this.pitch)
    }
  }
}
</script>

<style lang="scss" scoped>
.center {
  font-family: PingFangSC-Medium;
  .center_table {
    padding: 24px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    .search_bar {
      .search_bar_btn {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #d7d7d7;
        display: flex;
        span {
          cursor: pointer;
          font-size: 16px;
          color: rgba(0, 11, 21, 0.65);
          letter-spacing: 0;
          margin-right: 30px;
        }
        .pitch {
          font-size: 16px;
          color: #01aafc;
          letter-spacing: 0;
          border-bottom: 2px solid #01aafc;
        }
        .pitch_icon {
          margin-right: 20px;
          margin-left: -35px;
          font-size: 12px;
        }
      }
    }
    .search_bar_input {
      display: flex;
      padding: 24px 0;
      height: 80px;
      .search_bar_select {
        width: 100px;
        margin-right: 40px;
      }
      .search_bar_searchInput {
        width: 380px;
      }
      .search_bar_Refresh {
        line-height: 40px;
        font-size: 16px;
        color: rgba(0, 11, 21, 0.65);
        letter-spacing: 0;
        flex: 1;
        display: flex;
        justify-content: flex-end;
        i,
        span {
          margin-right: 5px;
          cursor: pointer;
        }
      }
    }
    .status1 {
      background: #e7fbff;
      border-radius: 4px;
      display: inline-block;
      padding: 1px 8px;
      font-size: 12px;
      color: #01aafc;
      text-align: center;
    }
    .status2 {
      background: #e7ffee;
      border-radius: 4px;
      display: inline-block;
      padding: 1px 8px;
      font-size: 12px;
      color: #00b061;
      text-align: center;
    }
    .status3 {
      background: #fff4f0;
      border-radius: 4px;
      display: inline-block;
      padding: 1px 8px;
      font-size: 12px;
      color: #d92919;
      text-align: center;
    }
    .status4 {
      background: #f5f5f6;
      border-radius: 4px;
      display: inline-block;
      padding: 1px 8px;
      font-size: 12px;
      color: rgba(0, 11, 21, 0.45);
      text-align: center;
    }
  }
}
</style>
