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
      <div
        slot="header"
        class="card-header"
      >
        <div class="card-left">
          <span class="title">试题答卷</span>
          <span class="sub-title">
            <span>（搜索结果：</span>
            <span>{{ `${totalNum > 0 ? `共${totalNum}题` : '--'}）` }}</span>
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
            <span>{{ totalNum }}</span>
          </span>
          <el-button
            size="medium"
            :disabled="currentIndex + 1 === totalNum"
            @click="nextQuestion"
          >
            下一题
          </el-button>
        </div>
      </div>
      <ul
        v-if="!_.isEmpty(questionMain)"
        class="card-content"
      >
        <li class="card-li">
          <div class="stem-main">
            <span>{{ currentIndex + 1 }}.</span>
            <span v-html="_.unescape(questionMain.content)" />
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
          <ul class="question-ul">
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
            <li
              v-for="(item, index) in qustionList"
              :key="item.id"
              class="question-li"
            >
              <by-paper-form
                :ref="`refSelect${index}`"
                :data="item"
              />
            </li>
          </ul>
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
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
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
        value: '0'
      },
      {
        label: '未评分',
        value: '1'
      },
      {
        label: '已评分',
        value: '2'
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
      currentIndex: 0,
      emptySrc: noData,
      emptyText: '请搜索需要评分的考生试题~',
      columns: EventColumns,
      queryInfo: {
        type: '',
        status: '2', //默认显示已评分
        lastId: '',
        examId: '',
        orgId: ''
      },
      totalNum: 0,
      totalPage: 0, // 考生总条数
      pageQuery: {
        id: '',
        size: 10,
        currentPage: 1
      },
      questionMain: {},
      formDataList: [],
      qustionList: []
    }
  },
  computed: {
    QUESTION_TYPE_BLANK: () => QUESTION_TYPE_BLANK,
    QUESTION_TYPE_SHOER: () => QUESTION_TYPE_SHOER,
    QUESTION_TYPE_MAP: () => QUESTION_TYPE_MAP,
    QUESTION_TYPE_GROUP: () => QUESTION_TYPE_GROUP
  },
  activated() {
    this.initForm()
    this.loadData()
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    this.clearActiveData()
    next()
  },
  methods: {
    clearActiveData() {
      this.questionMain = []
      this.qustionList = []
      this.currentIndex = 0
    },
    prevQuestion() {
      this.currentIndex -= 1
      this.queryInfo.direction = 0
      this.loadData()
    },
    nextQuestion() {
      this.currentIndex += 1
      this.queryInfo.direction = 1
      this.loadData()
    },
    pageChange() {
      this.getFormData()
      const isAllPass = _.every(this.formDataList, (item) => {
        return _.get(item, 'result') && _.get(item, 'scoreUser') && _.get(item, 'reviewRemark')
      })
      if (isAllPass) {
        this.getPaperData()
      } else {
        this.needTips()
      }
    },
    needTips() {
      this.$confirm('当前页面还有试题未进行评价，是否忽略进入下一页？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loadData()
      })
    },
    submit() {
      this.checkRequired()
    },
    // 检测提交前的逻辑
    async checkRequired() {
      const targetRefs = this.getTargetRefs()
      let checkList = await this.asyncGetValidate(targetRefs)
      let finalList = []
      _.each(checkList, (item) => {
        item.then((value) => {
          finalList.push(value)
          if (_.size(checkList) === _.size(finalList)) {
            if (_.every(finalList, Boolean)) {
              this.submitFun()
            }
          }
        })
      })
    },
    // 具体提交函数
    submitFun() {
      this.getFormData()
      const list = _.chain(this.formDataList)
        .cloneDeep()
        .filter((item) => {
          return item.result
        })
        .value()
      if (_.isEmpty(list)) {
        this.$message.error('您未对该考卷进行评分，请评分后再提交！')
      } else {
        actionExamineePaperIngUser(list)
          .then(() => {
            // console.log('res==', res)
          })
          .catch(() => {
            window.console.error(JSON.stringify(list))
          })
      }
    },
    // 获取表格的数据
    getFormData() {
      const targetRefs = this.getTargetRefs()
      this.formDataList = this.getFormDataFun(targetRefs)
    },
    // 获取表格数据的具体处理函数
    getFormDataFun(targetRefs) {
      let temp = []
      _.forIn(targetRefs, (value) => {
        _.each(value, (item) => {
          const tempFormData = _.get(item, 'formData', null)
          temp.push(_.assign(tempFormData, { id: _.get(item, 'data.id', null) }))
        })
      })
      return temp
    },
    // 获取当前所有的refs
    getTargetRefs() {
      let targetRefs = {}
      _.forIn(this.$refs, (value, key) => {
        if (_.includes(key, 'refSelect')) {
          _.assign(targetRefs, { [key]: value })
        }
      })
      return targetRefs
    },
    // 异步验证表格
    asyncGetValidate(targetRefs) {
      this.formDataList = []
      let checkList = []
      return new Promise((resolve) => {
        _.forIn(targetRefs, (value) => {
          _.each(value, (item) => {
            const tempRef = _.get(item, '$refs.form', null)
            if (tempRef) {
              checkList.push(this.validateByOne(tempRef))
            }
          })
        })
        resolve(checkList)
      })
    },
    // 一个接一个验证表格
    validateByOne(tempRef) {
      return new Promise((resolve) => {
        tempRef
          .validate()
          .then(() => {
            resolve(true)
          })
          .catch(() => {
            this.$message.error('请为所有已评出结果的试题输入得分！')
            resolve(false)
          })
      })
    },
    goback() {
      this.$router.go(-1)
    },
    handleSizeChange(val) {
      this.pageQuery.size = val
      this.getPaperData()
    },
    handleCurrentChange(val) {
      this.pageQuery.currentPage = val
      this.pageChange()
    },
    initForm() {
      _.set(this.columns, '[0].options', SOURCE)
      getOrgTreeSimple({ parentOrgId: 0 }).then((res) => {
        _.set(this.columns, '[1].props.treeParams.data', res)
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.search()
    },
    search() {
      this.loadData()
    },
    async loadData() {
      _.assign(this.queryInfo, {
        examId: this.$route.query.id,
        lastId: _.get(this.questionMain, 'id', '')
      })
      const res = await listExamineePaperOnce(this.queryInfo)
      const { totalNum, list } = res
      this.totalNum = totalNum
      if (list) {
        this.questionMain = list
        this.getPaperData()
      } else {
        this.questionMain = Object.create(null)
        this.qustionList = []
        this.isEmpty()
      }
    },
    async getPaperData() {
      const { totalNum, list } = await getByPaper(
        _.assign(this.pageQuery, { id: this.questionMain.id })
      )
      this.qustionList = list
      this.totalPage = totalNum
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
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
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
    .card-content {
      .card-li {
        margin: 0 13.5%;
        .card-title {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: rgba(0, 11, 21, 0.85);
          font-weight: 550;
        }
        .card-sub-title {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba(0, 11, 21, 0.25);
          margin: 10px 0 18px;
        }
        .stem-main {
        }
        .standard-class {
          position: relative;
          padding-left: 34px;
          margin-bottom: 8px;
          &::before {
            content: '';
            position: absolute;
            left: 24px;
            bottom: 6px;
            width: 6px;
            height: 6px;
            background-color: rgba(0, 11, 21, 0.25);
            border-radius: 100%;
          }
          .standard-label {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.25);
          }
          .standard-value {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.85);
          }
        }
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
    .question-ul {
      .dot-box {
        padding-left: 24px;
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
      .question-li {
        margin-bottom: 32px;
      }
    }
    .pagination-box {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
  .handle-button {
    position: fixed;
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
