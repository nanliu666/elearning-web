<template>
  <div>
    <page-header
      title="教室详情"
      show-back
    />
    <basic-container class="details-container">
      <div class="details-top">
        <header class="top-title">
          <div
            v-if="!_.isEmpty(examDetail)"
            class="title-left"
          >
            <span class="title-text">学术报告厅（2020101022012）</span>
            <el-tag
              v-if="examDetail.status"
              :type="getStatusType(examDetail.status).color"
            >
              {{ getStatusType(examDetail.status).text }}
            </el-tag>
          </div>
        </header>
        <ul class="details-ul">
          <li class="details-li">
            <span class="li-label">教室分类：</span>
            <span class="li-value">{{ examDetail.categoryName }}</span>
          </li>
          <li class="details-li">
            <span class="li-label">最大容纳人数：</span>
            <span class="li-value">
              <span>{{ examDetail.paperName }}</span>
            </span>
          </li>
          <li class="details-li">
            <span class="li-label">所属组织：</span>
            <span class="li-value">马赛</span>
          </li>
          <li class="details-li">
            <span class="li-label">面积：</span>
            <span class="li-value">{{ examDetail.certificateName }}</span>
          </li>
          <li class="details-li">
            <span class="li-label">地址：</span>
            <span class="li-value">马赛</span>
          </li>
          <li class="details-li">
            <span class="li-label">投影仪：</span>
            <span class="li-value">有</span>
          </li>
        </ul>
      </div>
    </basic-container>
    <basic-container>
      <el-menu
        :default-active="activeIndex"
        style="margin-top: -20px"
        class="el-menu-demo"
        :active-text-color="activeColor"
        mode="horizontal"
      >
        <el-menu-item index="0">
          使用情况
        </el-menu-item>
      </el-menu>
      <div style="padding: 20px; min-height:32vh">
        <common-table
          id="demo"
          ref="table"
          :columns="tableColumns"
          :config="tableConfig"
          :data="tableData"
          :loading="tableLoading"
          :page-config="tablePageConfig"
          :page="page"
          @current-page-change="handleCurrentPageChange"
          @page-size-change="handlePageSizeChange"
        >
          <template #topMenu>
            <search-popover
              ref="searchPopover"
              :require-options="searchConfig.requireOptions"
              :popover-options="searchConfig.popoverOptions"
              @submit="handleSearch"
            />
          </template>
        </common-table>
      </div>
    </basic-container>
  </div>
</template>

<script>
const TABLE_COLUMNS = [
  {
    label: '申请人',
    prop: 'userName',
    slot: true,
    minWidth: 150
  },
  {
    label: '联系方式',
    prop: 'phoneNum',
    slot: true,
    minWidth: 120
  },
  {
    label: '培训名称',
    prop: 'orgName',
    minWidth: 120
  },
  {
    label: '占用日期',
    slot: true,
    prop: 'batchNumber',
    minWidth: 120
  },
  {
    label: '占用时段',
    slot: true,
    prop: 'isTested', //true-已经通过 false-未通过
    minWidth: 120
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: false,
  showIndexColumn: false,
  enablePagination: true,
  enableMultiSelect: true,
  handlerColumn: {
    minWidth: 150
  }
}
const SEARCH_CONFIG = {
  requireOptions: [
    {
      type: 'input',
      field: 'name',
      label: '',
      data: '',
      options: [],
      config: { placeholder: '请输入学员名称搜索', 'suffix-icon': 'el-icon-search' }
    }
  ],
  popoverOptions: [
    {
      type: 'select',
      field: 'batchNumber',
      label: '申请人',
      data: '',
      options: []
    },
    { type: 'dataPicker', field: 'entryDate', label: '占用日期' },
    {
      type: 'dataPicker',
      label: '占用时间',
      data: '',
      field: 'startTime,endTime',
      config: {
        type: 'datetimerange',
        'range-separator': '至',
        'value-format': 'yyyy-MM-dd HH:mm:ss'
      }
    }
  ]
}
const isTestOptions = [
  { value: '', label: '全部' },
  { value: 3, label: '已通过' },
  { value: 4, label: '未通过' }
]
import SearchPopover from '@/components/searchPopOver/index'
import { getExamArrange, getBatchList, getBatchNumber } from '@/api/examManage/schedule'
import styles from '@/styles/variables.scss'
import { getOrgTreeSimple } from '@/api/org/org'
export default {
  components: { SearchPopover },
  filters: {
    textFilter(key) {
      const TEXT = {
        0: '完全正确得分',
        1: '按正确选项个数计分',
        2: '每项得扣分',
        3: '每项答错扣分',
        4: '每正确项得分'
      }
      return TEXT[key]
    }
  },
  data() {
    return {
      activeColor: styles.primaryColor,
      activeIndex: '0',
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      // 请求参数
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        isTested: '0'
      },
      examDetail: {},
      tableLoading: false,
      tableData: [],
      tablePageConfig: {},
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS,
      searchConfig: SEARCH_CONFIG
    }
  },
  computed: {
    id() {
      return _.get(this.$route, 'query.id', 1364828900076654594)
    }
  },
  activated() {
    this.initData()
    this.loadTableData()
  },
  methods: {
    /**
     * 处理页码改变
     */
    handleCurrentPageChange(param) {
      this.queryInfo.pageNo = param
      this.loadTableData()
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.queryInfo.pageSize = param
      this.loadTableData()
    },
    // 搜索
    handleSearch(params) {
      this.queryInfo = _.assign(this.queryInfo, params)
      this.loadTableData()
    },
    /**
     * 标识状态
     */
    getStatusType(status) {
      const TYPE_STATUS = {
        '1': {
          color: 'success',
          text: '未开始'
        },
        '2': {
          color: 'warning',
          text: '进行中'
        },
        '3': {
          color: 'danger',
          text: '已结束'
        }
      }
      return TYPE_STATUS[status]
    },
    /**
     * 初始数据，并处理附件
     */
    initData() {
      getExamArrange({ id: this.id }).then((res) => {
        this.examDetail = res
        // 未开启发放证书并且是自动评分，关闭操作列
        if (this.examDetail.autoEvaluate && !this.examDetail.certificate) {
          this.tableConfig.showHandler = false
        }
      })
      let fieldOrgId = _.find(this.searchConfig.popoverOptions, { field: 'orgId' })
      let examSituation = _.find(this.searchConfig.popoverOptions, { field: 'examSituation' })
      let batchNumber = _.find(this.searchConfig.popoverOptions, { field: 'batchNumber' })
      if (fieldOrgId) {
        getOrgTreeSimple({ parentOrgId: 0 }).then(
          (res) =>
            (fieldOrgId.config.treeParams.data = _.concat(
              [
                {
                  orgName: '全部',
                  orgId: ''
                }
              ],
              res
            ))
        )
      }
      if (examSituation) {
        examSituation.options = isTestOptions
      }
      if (batchNumber) {
        getBatchNumber({ id: this.id }).then((res) => {
          batchNumber.options = [{ value: '', label: '全部' }, ...res]
        })
      }
    },
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableData = []
        this.tableLoading = true
        let { totalNum, data } = await getBatchList(_.assign(this.queryInfo, { id: this.id }))
        this.tableData = data
        this.page.total = totalNum
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.tableLoading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-menu--horizontal {
  border-bottom: 1px solid #cccccc !important;
}
.details-container {
  background-color: #fff;
  margin-bottom: 16px;
  .details-top {
    .top-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      .title-left {
        display: flex;
        align-items: center;
      }
      .title-text {
        font-size: 18px;
        font-weight: 550;
        margin-right: 10px;
      }
    }
    .details-ul {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      .details-li {
        width: 50%;
        display: flex;
        margin-bottom: 10px;
        .li-label {
          min-width: 80px;
          display: inline-block;
          color: rgba(0, 11, 21, 0.45);
        }
        .li-value {
          color: rgba(0, 11, 21, 0.85);
        }
      }
    }
  }
  .details-bottom {
    .bottom-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 16px;
        font-weight: 550;
      }
      .handle {
        cursor: pointer;
        margin-left: 4px;
        color: #000b15;
      }
    }
    .extend-ul {
      padding-top: 24px;
      .extend-li {
        padding-bottom: 24px;
        &:last-child {
          padding-bottom: 0;
        }
        .li-title {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #000b15;
          position: relative;
          padding-left: 12px;
          margin-bottom: 16px;
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 10%;
            width: 4px;
            height: 80%;
            background-color: $primaryColor;
          }
        }
        .li-content {
          display: flex;
          flex-wrap: wrap;
          .content {
            width: 50%;
            margin-bottom: 16px;
            span {
              &:first-child {
                color: rgba(0, 11, 21, 0.45);
              }
              &:last-child {
                color: rgba(0, 11, 21, 0.85);
              }
            }
          }
        }
      }
    }
  }
}
.image-ul {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  .image-li {
    margin-right: 10px;
    border: 1px solid #ccc;
  }
}
.file-title {
  cursor: pointer;
  margin-bottom: 10px;
}
</style>
