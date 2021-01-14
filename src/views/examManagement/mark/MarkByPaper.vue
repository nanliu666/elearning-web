<template>
  <div class="mark-by-paper">
    <page-header
      title="逐题评卷"
      show-back
    />
    <el-card class="examinee-card">
      <div slot="header">
        <div class="header-box">
          <span>{{ $route.query.examName }}</span>
        </div>
      </div>
      <common-form
        ref="form"
        :model="queryInfo"
        :columns="columns"
        :config="{ labelPosition: 'left', labelWidth: '70px' }"
      />
      <div class="button-box">
        <el-button
          size="medium"
          @click="reset"
        >
          重置
        </el-button>
        <el-button
          size="medium"
          type="primary"
          @click="search"
        >
          搜索
        </el-button>
      </div>
    </el-card>
    <el-card class="paper-card">
      <div class="sticky-header-box">
        <div class="card-header">
          <div class="card-left">
            <span class="title">试题答卷</span>
            <span class="sub-title">
              <span>（搜索结果：</span>
              <span>{{ `${totalQustionNum > 0 ? `共${totalQustionNum}题` : '--'}）` }}</span>
            </span>
          </div>
          <div class="card-right">
            <el-button
              size="medium"
              :disabled="currentIndex === 0"
              @click="prevQuestion"
            >
              上一题
            </el-button>
            <span class="number-box">
              <span>{{ currentIndex + 1 }}</span>
              <span>/</span>
              <span>{{ totalQustionNum }}</span>
            </span>
            <el-button
              size="medium"
              :disabled="currentIndex + 1 === totalQustionNum"
              @click="nextQuestion"
            >
              下一题
            </el-button>
          </div>
        </div>
        <div
          v-if="!_.isEmpty(questionMain)"
          class="stem-main"
        >
          <span>{{ currentIndex + 1 }}.</span>
          <span v-html="getHTML()" />
          <el-tooltip
            class="item"
            effect="dark"
            :content="`试题分析：${questionMain.analysis || '暂无'}`"
            placement="top-start"
          >
            <el-button type="text">
              [查看试题分析]
            </el-button>
          </el-tooltip>
        </div>
        <div class="dot-box">
          <div class="dot-content">
            <span class="dot"></span>
            <span>
              <span class="label">标准答案：</span>
              <span class="value is-correct">{{
                _.get(qustionList, '[0].answerQuestion', '未设置标椎答案')
              }}</span>
            </span>
          </div>
        </div>
      </div>
      <ul
        v-if="!_.isEmpty(questionMain)"
        class="card-content"
      >
        <li
          v-for="item in _.flattenDeep(totalList)"
          :key="item.id"
          class="card-li"
          :class="{ 'is-show-li': isShowQustion(item) }"
        >
          <by-paper-form
            v-show="isShowQustion(item)"
            ref="refSelect"
            :data="item"
          />
        </li>
      </ul>
      <com-empty
        v-if="_.isEmpty(qustionList)"
        height="38vh"
        :text="emptyText"
        :src="emptySrc"
      />
      <div class="pagination-box">
        <el-pagination
          :page-sizes="[10, 20, 30, 40]"
          :current-page="pageNo"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <div
      v-if="!_.isEmpty(qustionList)"
      class="handle-button"
    >
      <div class="button-box">
        <el-button
          type="primary"
          size="medium"
          @click="submit"
        >
          提交评分
        </el-button>
        <el-button
          size="medium"
          @click="goback"
        >
          返回
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
const nzhcn = require('nzh/cn')
const EventColumns = [
  {
    itemType: 'select',
    span: 7,
    required: false,
    options: [],
    prop: 'type',
    label: '试题题型'
  },
  {
    prop: 'orgId',
    itemType: 'treeSelect',
    props: {
      selectParams: {
        placeholder: '请选择',
        multiple: false
      },
      treeParams: {
        data: [],
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        filterable: false,
        props: {
          children: 'children',
          label: 'orgName',
          disabled: 'disabled',
          value: 'orgId'
        }
      }
    },
    label: '组织架构',
    span: 7,
    offset: 1,
    required: false
  },
  {
    itemType: 'select',
    span: 8,
    offset: 1,
    required: false,
    options: [
      {
        label: '全部',
        value: ''
      },
      {
        label: '未评分',
        value: '0'
      },
      {
        label: '已评分',
        value: '1'
      }
    ],
    prop: 'status',
    label: '试题状态'
  }
]

const SOURCE = [
  {
    label: '填空题',
    value: QUESTION_TYPE_BLANK
  },
  {
    label: '问答题',
    value: QUESTION_TYPE_SHOER
  },
  {
    label: '试题组（阅读理解）',
    value: QUESTION_TYPE_GROUP
  }
]
import {
  QUESTION_TYPE_MAP,
  QUESTION_TYPE_BLANK,
  QUESTION_TYPE_SHOER,
  QUESTION_TYPE_GROUP
} from '@/const/examMange'
import { getOrgTreeSimple } from '@/api/org/org'
import {
  getByPaper,
  listExamineePaperOnce,
  actionExamineePaperIngUser
} from '@/api/examManage/mark'
// 逐人评卷
import addPng from '@/assets/images/add.jpg'
import noData from '@/assets/images/noData.jpg'
import ComEmpty from '@/components/common-empty/empty'
import ByPaperForm from './components/ByPaperForm.vue'
import { addLine } from '@/util/util'
export default {
  name: 'MarkByPaper',
  components: {
    ComEmpty,
    ByPaperForm
  },
  filters: {
    typeFilter(data) {
      return QUESTION_TYPE_MAP[data]
    },
    number2zhcn(index) {
      return nzhcn.encodeS(index)
    }
  },
  data() {
    return {
      autoCommitTimer: {}, // 自动提交的定时器
      currentSize: 10, // 每页几条
      pageNo: 1, //第几页
      totalNum: 0, // 考生总条数
      currentTotalList: [], // 当前题目下的所有的考生答卷
      currentIndex: 0, //第几题
      emptySrc: noData,
      emptyText: '请搜索需要评分的考生试题~',
      columns: EventColumns,
      queryInfo: {
        type: '',
        status: '', //默认显示全部
        lastId: '',
        examId: '',
        orgId: ''
      },
      totalQustionNum: 0, //此类型一共有几题
      questionMain: {},
      formDataList: [],
      qustionList: [],
      totalList: []
    }
  },
  computed: {
    QUESTION_TYPE_BLANK: () => QUESTION_TYPE_BLANK,
    QUESTION_TYPE_SHOER: () => QUESTION_TYPE_SHOER,
    QUESTION_TYPE_MAP: () => QUESTION_TYPE_MAP,
    QUESTION_TYPE_GROUP: () => QUESTION_TYPE_GROUP
  },
  activated() {
    this.initSearchForm()
    this.initAutoCommit()
    this.loadData()
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    this.clearActiveData()
    next()
  },
  methods: {
    // 获取当前的答卷显示列表
    isShowQustion(data) {
      const index = _.findIndex(this.qustionList, (item) => {
        return item.id === data.id
      })
      return index > -1
    },
    async loadData() {
      _.assign(this.queryInfo, {
        examId: this.$route.query.id,
        lastId: _.get(this.questionMain, 'id', '')
      })
      const res = await listExamineePaperOnce(this.queryInfo)
      const { totalNum, list } = res
      this.totalQustionNum = totalNum
      this.questionMain = list
      //此题目未被记录在数据内
      if (_.isEmpty(this.totalList[this.currentIndex])) {
        this.getPaperData()
      } else {
        this.setQuestionList()
      }
    },
    // 一次将当前题目的所有考生答卷拉取回来
    // 前端做分页
    async getPaperData() {
      const { totalNum, list } = await getByPaper({
        id: this.questionMain.id,
        size: 100000,
        currentPage: 1
      })
      this.totalNum = totalNum
      this.currentTotalList = list
      this.totalList.push(_.chunk(this.currentTotalList, this.currentSize))
      this.setQuestionList()
    },
    setQuestionList() {
      // 获取到当前的展示数组
      // 第几题的第几页的数据
      this.qustionList = this.totalList[this.currentIndex][this.pageNo - 1]
    },
    // 页数改变
    handleSizeChange(val) {
      this.currentSize = val
      this.setQuestionList()
    },
    // 页码改变
    handleCurrentChange(val) {
      this.pageNo = val
      this.setQuestionList()
    },
    // 10分钟自动提交
    initAutoCommit() {
      const TEN_MINUTES = 1000
      // const TEN_MINUTES = 10 * 60 * 1000
      this.autoCommitTimer = setInterval(() => {
        // console.log(11)
      }, TEN_MINUTES)
    },
    getHTML() {
      return addLine(this.questionMain.content)
    },
    // 离开后清除页面数据?为啥这个页面不能自定清除？
    clearActiveData() {
      this.questionMain = {}
      this.totalList = []
      this.qustionList = []
      this.currentIndex = 0
      clearInterval(this.autoCommitTimer)
    },
    // 上一题
    prevQuestion() {
      this.currentIndex -= 1
      this.queryInfo.direction = 0
      this.loadData()
    },
    // 下一题
    nextQuestion() {
      this.currentIndex += 1
      this.queryInfo.direction = 1
      this.loadData()
    },
    submit() {
      this.checkRequired()
    },
    // 检测提交前的逻辑
    checkRequired() {
      const checkList = this.getTargetRefs()
      Promise.all(
        _.map(checkList, (item) => {
          return item.validate()
        })
      )
        .then(() => {
          this.submitFun()
        })
        .catch(() => {
          this.$message.error('请为所有已评出结果的试题输入得分！')
        })
    },
    // 具体提交函数
    submitFun() {
      const targetRefs = this.getTargetRefs()
      this.formDataList = _.map(targetRefs, 'model')
      const list = _.chain(this.formDataList)
        .cloneDeep()
        .filter((item) => {
          return item.result
        })
        .value()
      if (_.isEmpty(list)) {
        this.$message.error('您未对该考卷进行评分，请评分后再提交！')
      } else {
        actionExamineePaperIngUser({ list: list })
          .then(() => {
            this.$router.push({ path: 'examManagement/mark/MarkList' })
          })
          .catch((err) => {
            window.console.error('err==', err)
            window.console.error(JSON.stringify({ list: list }))
          })
      }
    },
    // 获取当前所有的refs
    getTargetRefs() {
      const targetRefs = _.chain(this.$refs.refSelect)
        .map('$refs')
        .filter((item) => {
          return !_.isEmpty(item)
        })
        .map((item) => {
          return item.form
        })
        .value()
      return targetRefs
    },
    goback() {
      this.$router.go(-1)
    },
    //初始化搜索表单的数据
    initSearchForm() {
      _.set(this.columns, '[0].options', SOURCE)
      getOrgTreeSimple({ parentOrgId: 0 }).then((res) => {
        _.set(this.columns, '[1].props.treeParams.data', res)
      })
    },
    reset() {
      this.$refs.form.resetFields()
    },
    search() {
      this.totalList = []
      this.qustionList = []
      this.loadData()
    },
    isEmpty() {
      this.emptySrc = addPng
      this.emptyText = '暂无搜索结果~'
    }
  }
}
</script>

<style lang="scss" scoped>
.mark-by-paper {
  position: relative;
  .examinee-card {
    .header-box {
      padding: 18px 0 10px;
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: rgba(0, 11, 21, 0.85);
      font-weight: 550;
    }
    /deep/ .el-form-item {
      margin-bottom: 8px;
    }
    .button-box {
      display: flex;
      justify-content: flex-end;
    }
  }
  .paper-card {
    margin-top: 16px;
    margin-bottom: 24px;
    padding-bottom: 76px;
    position: relative;
    .card-header {
      padding-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ebeced;
      .card-left {
        display: flex;
        align-items: flex-end;
        .title {
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: rgba(0, 11, 21, 0.85);
          font-weight: 550;
        }
        .sub-title {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: rgba(0, 11, 21, 0.45);
        }
      }
      .card-right {
        .number-box {
          margin: 0 10px;
        }
      }
    }
    .sticky-header-box {
      position: sticky;
      top: 0;
      .stem-main {
        margin: 0 13.5%;
        padding-top: 16px;
      }
      .dot-box {
        margin: 0 13.5%;
        padding-bottom: 16px;
        .dot-content {
          min-width: 60px;
          display: flex;
          align-items: center;
          .dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: rgba(0, 11, 21, 0.25);
            margin-right: 6px;
          }
        }
      }
    }
    .card-content {
      .card-li {
        margin: 0 13.5%;
      }
      .is-show-li {
        margin-bottom: 32px;
      }
    }
    .label {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.25);
    }
    .value {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.85);
    }
    .is-correct {
      color: #00b061;
    }
    .is-fault {
      color: #ff4329;
    }
    .analysis-box {
      margin-top: 8px;
    }
    .common-box {
      padding: 24px;
      background-color: #fafafa;
    }

    .pagination-box {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
  .handle-button {
    position: fixed;
    z-index: 1;
    bottom: 0;
    right: 40px;
    width: calc(100vw - 16.5vw - 72px);
    background-color: #fff;
    box-shadow: 0 -6px 12px 0 rgba(0, 61, 112, 0.08);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 76px;
    .button-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(104px * 4 + 3 * 16px);
    }
  }
}
</style>
