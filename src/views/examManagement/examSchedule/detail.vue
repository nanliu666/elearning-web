<template>
  <div>
    <page-header
      title="考试详情"
      show-back
    />
    <basic-container class="details-container">
      <div class="details-top">
        <header class="top-title">
          <div
            v-if="!_.isEmpty(examDetail)"
            class="title-left"
          >
            <span class="title-text">{{ examDetail.examName }}</span>
            <el-tag
              v-if="examDetail.status"
              :type="getStatusType(examDetail.status).color"
            >
              {{ getStatusType(examDetail.status).text }}
            </el-tag>
          </div>
          <div class="title-left">
            <el-button
              type="primary"
              size="medium"
              @click="edit('edit')"
            >
              编辑
            </el-button>
            <el-button
              size="medium"
              @click="deleteFun"
            >
              删除
            </el-button>
            <el-button
              size="medium"
              @click="edit('copy')"
            >
              复制
            </el-button>
          </div>
        </header>
        <ul class="details-ul">
          <li class="details-li">
            <span class="li-label">考试分类：</span>
            <span class="li-value">{{ examDetail.categoryName }}</span>
          </li>
          <li class="details-li">
            <span class="li-label">考试用卷：</span>
            <span class="li-value">
              <span>{{ examDetail.paperName }}</span>
              <!-- 随机random，手工manual -->
              <el-button
                type="text"
                style="padding: 0; margin-left: 20px"
                @click="goRelevance"
              >{{
                examDetail.paperType === 'random' ? '查看关联试卷' : '预览试卷'
              }}</el-button>
            </span>
          </li>
          <li
            v-if="!_.isEmpty(examDetail.reviewerNames)"
            class="details-li"
          >
            <span class="li-label">评卷人：</span>
            <span class="li-value">{{ examDetail.reviewerNames.join(', ') }}</span>
          </li>
          <li
            v-if="examDetail.certificateName"
            class="details-li"
          >
            <span class="li-label">证书模板：</span>
            <span class="li-value">{{ examDetail.certificateName }}</span>
          </li>
        </ul>
      </div>
    </basic-container>
    <basic-container class="details-container">
      <div class="details-bottom">
        <header class="bottom-header">
          <span class="title">详细设置</span>
          <div>
            <i :class="[isExtend ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" />
            <span
              class="handle"
              @click="extendFun"
            >{{ isExtend ? '收起' : '展开' }}</span>
          </div>
        </header>
        <ul
          v-if="isExtend"
          class="extend-ul"
        >
          <li class="extend-li">
            <div class="li-title">
              基础设置：
            </div>
            <div class="li-content">
              <div class="content">
                <span>答题模式：</span>
                <span>{{ examDetail.answerMode === 1 ? '整卷模式' : '逐卷模式' }}</span>
              </div>
              <div class="content">
                <span>考试时长：</span>
                <span>{{
                  !examDetail.reckonTime ? '不计时' : `${examDetail.reckonTimeValue}分钟`
                }}</span>
              </div>
              <div class="content">
                <span>参加次数：</span>
                <span>{{
                  !examDetail.joinNum ? '不限次数' : `不超过${examDetail.joinNumValue}次`
                }}</span>
              </div>
              <div class="content">
                <span>考试时间策略：</span>
                <span>{{
                  !examDetail.strategy
                    ? '允许进入考试的时间'
                    : '允许参考时间（到结束时间，会自动提交。）'
                }}</span>
              </div>
              <div class="content">
                <span>积分：</span>
                <span>{{
                  examDetail.integral === 0
                    ? '本考试记录系统没有积分'
                    : `本考试记录系统积分${examDetail.integral}分`
                }}</span>
              </div>
              <div class="content">
                <span>发布考试：</span>
                <span>{{
                  examDetail.publishTime === 0
                    ? '马上发布考试'
                    : `考试开始前${examDetail.publishTime}分钟发布考试信息`
                }}</span>
              </div>
            </div>
          </li>
          <li class="extend-li">
            <div class="li-title">
              考场环境：
            </div>
            <div class="li-content">
              <div class="content">
                <span>是否启用IP限制(需设定考生合法IP范围)：</span>
                <span>{{ examDetail.isLimitIp ? '是' : '否' }}</span>
              </div>
              <div class="content">
                <span>生成试卷时是否打乱试题和选项顺序：</span>
                <span>{{ examDetail.isShuffle ? '是' : '否' }}</span>
              </div>
              <div class="content">
                <span>交卷即时是否生成答案统计数据(建议大规模考试时不启用)：</span>
                <span>{{ examDetail.createAnswers ? '是' : '否' }}</span>
              </div>
              <div class="content">
                <span>是否允许迟到分钟后禁止参加考试：</span>
                <span>{{
                  examDetail.lateBanExam && examDetail.lateBanExamValue
                    ? `允许迟到${examDetail.lateBanExamValue}分钟`
                    : '否'
                }}</span>
              </div>
              <div class="content">
                <span>答卷时间过少是否禁止交卷：</span>
                <span>{{
                  examDetail.answerBanExam && examDetail.answerBanExamValue
                    ? `开始答卷${examDetail.answerBanExamValue}分钟内禁止交卷`
                    : '否'
                }}</span>
              </div>
              <div class="content">
                <span>是否启用试卷预生成服务：</span>
                <span>{{
                  examDetail.preCreate && examDetail.preCreateValue
                    ? `试卷最多预生成${examDetail.preCreateValue}份`
                    : '否'
                }}</span>
              </div>
              <div class="content">
                <span>是否自动保存答案到服务器：</span>
                <span>{{ examDetail.isHold ? '是' : '否' }}</span>
              </div>
            </div>
          </li>
          <li class="extend-li">
            <div class="li-title">
              考生权限：
            </div>
            <div class="li-content">
              <div class="content">
                <span>是否允许考生查看本机资料(开卷考试)：</span>
                <span>{{ examDetail.isDecoil ? '允许' : '不允许' }}</span>
              </div>
              <div class="content">
                <span>是否允许考生查看成绩：</span>
                <span>{{
                  examDetail.openResults
                    ? examDetail.openResultsValue === 0
                      ? '永久允许'
                      : `考生${examDetail.openResultsValue}天内可以查看成绩`
                    : '不允许'
                }}</span>
              </div>
              <div class="content">
                <span>是否允许考生查看答卷：</span>
                <span>{{ examDetail.openAnswerSheet ? '允许' : '不允许' }}</span>
              </div>
              <div class="content">
                <span>是否允许考生自己评卷：</span>
                <span>{{ examDetail.selfMarking ? '允许' : '不允许' }}</span>
              </div>
              <div class="content">
                <span>是否允许考生查看标准答案：</span>
                <span>{{ examDetail.publicAnswers ? '允许' : '不允许' }}</span>
              </div>
              <!-- <div class="content">
                <span>考生报名考试是否需要审批：</span>
                <span>{{ examDetail.openEntrance ? '需要' : '不需要' }}</span>
              </div> -->
            </div>
          </li>
          <li class="extend-li">
            <div class="li-title">
              评卷策略：
            </div>
            <div class="li-content">
              <div class="content">
                <span>是否允许评卷人修改考生答案：</span>
                <span>{{ examDetail.modifyAnswer ? '允许' : '不允许' }}</span>
              </div>
              <div
                v-if="examDetail.modifyAnswer"
                class="content"
              >
                <span>是否允许修改考生客观题答案及其评分结果：</span>
                <span>{{ examDetail.modifyLimit ? '允许' : '不允许' }}</span>
              </div>
              <div class="content">
                <span>评卷限定最高得分：</span>
                <span>{{
                  examDetail.scopeLimit ? `限定最高${examDetail.scopeLimitValue}分` : '不限制'
                }}</span>
              </div>
              <div class="content">
                <span>是否手工评卷是否显示客观题：</span>
                <span>{{ examDetail.objectiveQuestions ? '显示' : '不显示' }}</span>
              </div>
              <div class="content">
                <span>判断题是否答对得分,不答不得分,答错扣分：</span>
                <span>{{ examDetail.decideItem ? '是' : '否' }}</span>
              </div>
              <div class="content">
                <span>多选题：</span>
                <span>完全正确得分</span>
              </div>
            </div>
          </li>
          <li class="extend-li">
            <div class="li-title">
              成绩发布：
            </div>
            <div class="li-content">
              <div class="content">
                <span>是否由系统自动评定通过：</span>
                <span>{{ examDetail.autoEvaluate ? '是' : '否' }}</span>
              </div>
              <div
                v-if="examDetail.autoEvaluate"
                class="content"
              >
                <span>通过条件：</span>
                <span>
                  <span
                    v-if="examDetail.passType === 1"
                  >按成绩，成绩不低于{{ examDetail.passScope }}分</span>
                  <span
                    v-if="examDetail.passType === 2"
                  >按得分率，得分率不低于{{ examDetail.passScope }}%</span>
                </span>
              </div>
              <div class="content">
                <span>发布规则：</span>
                <span>
                  {{ examDetail.publishType === 1 ? '系统即时发布' : '定时自动发布' }}
                </span>
              </div>
              <div
                v-if="examDetail.publishType !== 1"
                class="content"
              >
                <span>发布时间：</span>
                <span>{{ examDetail.fixedTime }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </basic-container>
    <basic-container>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        :active-text-color="activeColor"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="0">
          已考试
        </el-menu-item>
        <el-menu-item index="1">
          未考试
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
          <template #name="{row}">
            <div
              class="ellipsis title"
              @click="jumpDetail(row)"
            >
              {{ row.name }}
            </div>
          </template>
          <template #batchNumber="{row}">
            第{{ Number(row.batchNumber) + 1 }}次
          </template>
          <template #isTested="{row}">
            {{ row.isTested ? '通过' : '未通过' }}
          </template>
          <template #gainCertificate="{row}">
            {{ !row.gainCertificate ? '否' : '是' }}
          </template>

          <template
            slot="multiSelectMenu"
            slot-scope="{ selection }"
          >
            <el-button
              type="text"
              icon="el-icon-sold-out"
              @click="pubulishAllAchievement(selection)"
            >
              发布成绩
            </el-button>
            <el-button
              type="text"
              icon="el-icon-s-release"
              @click="resloveCertificate(selection)"
            >
              撤回证书
            </el-button>
          </template>
          <template
            v-if="activeIndex === '0'"
            #handler="{row}"
          >
            <div class="menuClass">
              <el-button
                type="text"
                @click="pubulishAchievement({ ids: row.id })"
              >
                发布成绩
              </el-button>
            </div>
          </template>
        </common-table>
      </div>
    </basic-container>
  </div>
</template>

<script>
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'userName',
    slot: true,
    minWidth: 150
  },
  {
    label: '手机号',
    prop: 'phoneNum',
    slot: true,
    minWidth: 120
  },
  {
    label: '部门',
    prop: 'orgName',
    minWidth: 120
  },
  {
    label: '批次',
    slot: true,
    prop: 'batchNumber',
    minWidth: 120
  },
  {
    label: '考试情况',
    slot: true,
    prop: 'isTested', //true-已经通过 false-未通过
    minWidth: 120
  }
]
//未考试不存在的
const TABLE_COLUMNS_EXTENDED = [
  {
    label: '考试分数',
    prop: 'score',
    minWidth: 120
  },
  {
    label: '考试完成时间',
    prop: 'finishTime',
    minWidth: 120
  },
  {
    label: '是否获得证书',
    prop: 'gainCertificate', //0-否 1-是
    slot: true,
    minWidth: 120
  }
]
// 整体的配置
const ALL_COLUMNS = [...TABLE_COLUMNS, ...TABLE_COLUMNS_EXTENDED]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  showIndexColumn: false,
  enablePagination: true,
  enableMultiSelect: true, // TODO：关闭批量删除
  handlerColumn: {
    minWidth: 100
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
      type: 'treeSelect',
      field: 'orgId',
      label: '所属部门',
      data: '',
      config: {
        selectParams: {
          placeholder: '请输入内容',
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
      }
    },
    {
      type: 'select',
      field: 'batchNumber',
      label: '考试批次',
      data: '',
      options: []
    },
    {
      type: 'select',
      field: 'examSituation',
      label: '考试情况',
      data: '',
      options: []
    }
  ]
}
const notIsTestOptions = [
  { value: '', label: '全部' },
  { value: 1, label: '未开始' },
  { value: 2, label: '缺考' }
]
const isTestOptions = [
  { value: '', label: '全部' },
  { value: 3, label: '已通过' },
  { value: 4, label: '未通过' }
]
import SearchPopover from '@/components/searchPopOver/index'
import {
  delExamArrange,
  getExamArrange,
  getBatchList,
  putAchievement,
  putCertificate,
  getBatchNumber
} from '@/api/examManage/schedule'
import styles from '@/styles/variables.scss'
import { getOrgTreeSimple } from '@/api/org/org'
export default {
  components: { SearchPopover },
  data() {
    return {
      activeColor: styles.primaryColor,
      isExtend: false,
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
      tableColumns: ALL_COLUMNS,
      searchConfig: SEARCH_CONFIG
    }
  },
  activated() {
    this.initData()
    this.loadTableData()
  },
  methods: {
    // 发布成绩
    pubulishAchievement(ids) {
      this.$confirm('是否发布选择的考生的成绩?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        putAchievement(ids).then(() => {
          this.$message.success('发布成功')
          this.loadTableData()
        })
      })
    },
    // 批量发布
    pubulishAllAchievement(selection) {
      let ids = []
      _.each(selection, (item) => {
        ids.push(item.id)
      })
      this.pubulishAchievement({ ids: ids })
    },
    resloveCertificate(selection) {
      let examineeId = []
      _.each(selection, (item) => {
        examineeId.push(item.id)
      })
      this.$confirm('是否撤回选择的考生的证书?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        putCertificate({ examId: this.$route.query.id, examineeId }).then(() => {
          this.$message.success('撤回成功')
          this.loadTableData()
        })
      })
    },
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
    // 跳转详情
    jumpDetail(row) {
      this.$router.push({ path: '/examManagement/examSchedule/detail', query: { id: row.id } })
    },
    // 展开与收起
    extendFun() {
      this.isExtend = !this.isExtend
    },
    // 编辑和复制
    edit(type) {
      const basicQuery = { id: this.$route.query.id }
      const query = type === 'copy' ? _.assign(basicQuery, { type: 'copy' }) : basicQuery
      this.$router.push({ path: '/examManagement/examSchedule/edit', query })
    },
    deleteFun() {
      const params = { ids: this.$route.query.id }
      this.$confirm('此操作将永久删除该考试, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delExamArrange(params).then(() => {
          this.$message.success('删除成功')
          this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
          this.$nextTick(() => {
            this.$router.push({ path: '/examManagement/examSchedule/list' })
          })
        })
      })
    },
    // 前往关联试卷/预览
    goRelevance() {
      const relevanceList = '/examManagement/examSchedule/relevanceList'
      const preview = '/examManagement/examSchedule/preview'
      const path = this.examDetail.paperType === 'random' ? relevanceList : preview
      this.$router.push({
        path: path,
        query: {
          paperId: this.examDetail.testPaper,
          examId: this.$route.query.id,
          maxNum: this.examDetail.preCreateValue,
          examName: this.examDetail.examName,
          paperType: this.examDetail.paperType
        }
      })
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
      getExamArrange({ id: this.$route.query.id }).then((res) => {
        this.examDetail = res
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
        getBatchNumber({ id: this.$route.query.id }).then((res) => {
          batchNumber.options = [{ value: '', label: '全部' }, ...res]
        })
      }
    },
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableData = []
        this.tableLoading = true
        let { totalNum, data } = await getBatchList(
          _.assign(this.queryInfo, { id: this.$route.query.id })
        )
        this.tableData = data
        this.page.total = totalNum
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.tableLoading = false
      }
    },
    /**
     * 处理nav切换
     */
    handleSelect(key) {
      this.activeIndex = key
      this.tableConfig.enableMultiSelect = key === '0' ? true : false
      this.tableConfig.showHandler = key === '0' ? true : false
      this.tableColumns = key === '0' ? ALL_COLUMNS : TABLE_COLUMNS
      this.queryInfo.isTested = key
      let examSituation = _.find(this.searchConfig.popoverOptions, { field: 'examSituation' })
      examSituation.options = key === '0' ? isTestOptions : notIsTestOptions
      this.loadTableData()
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
