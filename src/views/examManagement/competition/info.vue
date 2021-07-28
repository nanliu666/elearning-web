<template>
  <div class="competition-info">
    <page-header
      title="闯关竞赛"
      show-back
    />
    <el-card
      v-if="competitionInfo"
      shadow="never"
    >
      <header>
        <div class="left">
          <h2>{{ competitionInfo.name }}</h2>
          <div
            :class="{
              'no-start': competitionStatu === '未开始',
              start: competitionStatu === '进行中',
              end: competitionStatu === '已结束'
            }"
            class="status"
          >
            {{ competitionStatu }}
          </div>
        </div>
        <div class="right">
          <el-button
            type="primary"
            size="medium"
            :disabled="isEdit"
            @click="edit"
          >
            编辑
          </el-button>
          <el-button
            size="medium"
            @click="del"
          >
            删除
          </el-button>
        </div>
      </header>
      <ul class="list">
        <li
          v-for="(item, index) in infoRow"
          :key="index"
        >
          <span>{{ item.label }}:</span>
          <span>{{ competitionInfo[item.value] }}</span>
        </li>
      </ul>
    </el-card>
    <el-card shadow="never">
      <common-table
        ref="table"
        :columns="tableColumns"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page="tablePage"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #topMenu>
          <div class="top-input">
            <span class="students">参与学员</span><el-input
              type="text"
              placeholder="输入姓名/手机号/部门搜索"
              suffix-icon="el-icon-search"
              :value="queryParams.name"
              @input="search"
            />
          </div>
        </template>
        <template #userName="{row}">
          <div>
            <el-button
              type="text"
              @click="goUserInfo(row.userId)"
            >
              {{ row.userName }}
            </el-button>
          </div>
        </template>
      </common-table>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'userName',
    slot: true
  },
  {
    label: '手机号',
    prop: 'phonenum'
  },
  {
    label: '所属部门',
    prop: 'dept',
    minWidth: '120px'
  },
  {
    label: '闯关次数',
    prop: 'joinNum'
  },
  {
    label: '通关次数',
    prop: 'joinPassNum'
  },
  {
    label: '获得积分',
    prop: 'integral'
  }
]
const TABLE_CONFIG = {
  rowKey: 'id'
}
import { COMPETITION_EDIT, COMPETITION_DEL } from '@/const/privileges'
import { details, detailsStudens, delCompetition } from '@/api/examManage/competition'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false,
      competitionInfo: null,
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        id: '',
        name: ''
      },
      tablePage: {
        size: 10,
        currentPage: 1,
        total: 0
      },
      infoRow: [
        {
          label: '分类',
          value: 'categoryName'
        },
        {
          label: '有效时间',
          value: 'date'
        },
        {
          label: '关卡数',
          value: 'barrierNum'
        },
        {
          label: '挑战模式',
          value: 'raceType'
        },
        {
          label: '答题时长',
          value: 'timeStrategy'
        },
        {
          label: '积分计入',
          value: 'integralStrategy'
        },
        {
          label: '答题次数',
          value: 'joinStrategy'
        },
        {
          label: '通关条件',
          value: 'passStrategy'
        },
        {
          label: '答案显示',
          value: 'showAnswer'
        },
        {
          label: '创建人',
          value: 'creatorName'
        },
        {
          label: '创建时间',
          value: 'updateTime'
        }
      ]
    }
  },
  created() {
    this.queryParams.id = this.$route.query.id
    this.getData()
    details({ id: this.$route.query.id }).then((res) => {
      res.raceType = res.raceType === 0 ? '逐关解锁' : '一站到底'
      res.barrierNum = `共${res.barrierNum}关`
      res.date =
        res.beginTime.split(' ')[0].replaceAll('-', '/') +
        ' ~ ' +
        res.endTime.split(' ')[0].replaceAll('-', '/')
      if (res.timeStrategy !== 0) {
        const textArr = ['逐题计时/每题', '逐关计时/每关', '整竞赛计时/竞赛全程']
        res.timeStrategy = `${textArr[res.timeStrategy - 1]}${res.timeStrategyValue}分钟`
      } else {
        res.timeStrategy = '不记时'
      }
      res.integralStrategy =
        res.integralStrategy === 1
          ? `逐关计分,每关${res.integralValue}积分`
          : `全通关计分,全通关${res.integralValue}积分`
      if (res.joinStrategy !== 0) {
        res.joinStrategy =
          res.joinStrategy === 1 ? `每日限制${res.joinTimes}次` : `参加总次数${res.joinTimes}次`
      } else {
        res.joinStrategy = '不限次数'
      }
      res.passStrategy = res.passStrategy === 0 ? '答错结束' : `答对${res.passStrategyValue}%通关`
      res.showAnswer = res.showAnswer === 0 ? '不显示答案' : '答完即显示答案'

      this.competitionInfo = res
    })
  },
  methods: {
    handleCurrentPageChange(params) {
      this.tablePage.currentPage = params
      this.queryParams.pageNo = params
      this.getData()
    },
    handlePageSizeChange(params) {
      this.tablePage.currentPage = 1
      this.tablePage.pageSize = params
      this.queryParams.pageNo = 1
      this.queryParams.pageSize = params
      this.getData()
    },
    handleSearch() {
      this.searchParams = {
        ...this.searchParams
      }
      this.classflyParams.pageNo = 1
      this.getData()
    },
    getData() {
      detailsStudens(this.queryParams).then((res) => {
        this.tableData = res.records
        this.tablePage.total = res.total
      })
    },
    async del() {
      await this.$confirm('您确定要删除选中的闯关竞赛吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await delCompetition(this.$route.query.id)
      this.$message.success('删除成功')
      this.$router.push('/examManagement/competition/list')
    },
    edit() {
      this.$router.push({
        path: '/examManagement/competition/addAndEdit',
        query: {
          tagName: '编辑闯关竞赛',
          id: this.$route.query.id
        }
      })
    },
    search(e) {
      this.queryParams.name = e
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getData()
      }, 200)
    },
    goUserInfo(userId) {
      this.$router.push({
        path: '/system/userDetail',
        query: {
          userId
        }
      })
    }
  },
  computed: {
    COMPETITION_EDIT: () => COMPETITION_EDIT,
    COMPETITION_DEL: () => COMPETITION_DEL,
    ...mapGetters(['privileges']),
    competitionStatu() {
      const day = moment().valueOf()
      const start = moment(this.competitionInfo.beginTime).valueOf()
      const end =
        moment(this.competitionInfo.endTime)
          .add(1, 'd')
          .valueOf() - 1000
      return day < start ? '未开始' : day > end ? '已结束' : '进行中'
    },
    isEdit() {
      return moment().valueOf() > moment(this.competitionInfo.beginTime).valueOf()
    }
  },
  beforeRouteEnter(to, form, next) {
    form.meta.$keepAlive = false
    next()
  }
}
</script>

<style lang="scss" scoped>
.competition-info {
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .left {
      display: flex;
      align-items: center;
      .no-start {
        background-color: #cbf5e8;
        color: #09666b;
      }
      .start {
        background-color: #fff491;
        color: #8c6200;
      }
      .end {
        background-color: #c4e6ff;
        color: #588ad1;
      }
      .status {
        margin-left: 10px;
        border-radius: 4px;
        padding: 3px 5px;
      }
      h2 {
        margin: 0;
      }
    }
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 33%;
      flex-shrink: 0;
      display: flex;
      margin-bottom: 12px;
      span:first-of-type {
        width: 70px;
      }
    }
  }
  /deep/ .el-card.is-never-shadow:nth-of-type(3) {
    margin-top: 20px;
  }
  /deep/.students {
    font-size: 16px;
    font-weight: 600;
    margin-right: 10px;
  }
  /deep/ .top-input {
    display: flex;
    align-items: center;
    width: 300px;
    span {
      flex-shrink: 0;
    }
  }
}
</style>
