<template>
  <div>
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
      <template #name="{ row }">
        <div
          class="ellipsis title"
          @click="jumpDetail(row)"
        >
          {{ row.name }}
        </div>
      </template>
      <template #batchNumber="{ row }">
        第{{ Number(row.batchNumber) + 1 }}次
      </template>
      <template #isTested="{ row }">
        {{ row.isPass ? '通过' : '未通过' }}
      </template>
      <template #gainCertificate="{ row }">
        {{ !row.gainCertificate ? '否' : '是' }}
      </template>

      <template
        slot="multiSelectMenu"
        slot-scope="{ selection }"
      >
        <el-button
          v-if="!paperDetail.examDetail.autoEvaluate"
          type="text"
          icon="el-icon-sold-out"
          @click="pubulishAllAchievement(selection)"
        >
          发布成绩
        </el-button>
        <el-button
          type="text"
          icon="el-icon-s-release"
          @click="handleCertificate(selection, 'revoke', 'all')"
        >
          撤回证书
        </el-button>
        <el-button
          type="text"
          icon="el-icon-s-release"
          @click="handleCertificate(selection, 'grant', 'all')"
        >
          发放证书
        </el-button>
      </template>
      <template
        v-if="hasExamHandle"
        #handler="{ row }"
      >
        <div class="menuClass">
          <!-- 发布规则为手动发布的时候显示发布成绩的按钮 -->
          <!-- 手动修改过成绩后（已自动发布）不许再手动发布成绩 isPublish 是否已经发布过成绩 true-发布 false-未发布-->
          <!-- 成绩未出，不许发布成绩 status 答卷状态: 1-已发布 2-考试中 3-已提交 4-阅卷中 5-已阅卷-->
          <el-button
            v-if="paperDetail.examDetail.publishType == 3"
            type="text"
            :disabled="row.status == 5 && row.isPublish"
            @click="pubulishAchievement(row.id)"
          >
            {{ !row.isPublish ? '' : '已' }}发布成绩
          </el-button>
          <!-- 显示条件：开启发放证书功能 -->
          <!-- 置灰条件：考试未通过 -->
          <el-button
            v-if="paperDetail.examDetail.certificate"
            :disabled="!row.isPass"
            type="text"
            @click="handleCertificate([row], row.gainCertificate ? 'revoke' : 'grant', 'single')"
          >
            {{ row.gainCertificate ? '撤回证书' : '发放证书' }}
          </el-button>
        </div>
      </template>
    </common-table>
  </div>
</template>
<script>
// 已考试与未考试共有的
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
    formatter: (row) => (row.orgName ? row.orgName : '无部门'),
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
  },
  {
    label: '考试时限',
    prop: 'reckonTimeValue',
    minWidth: 120,
    formatter: (row) =>
      row.reckonTime && row.reckonTimeValue ? `${row.reckonTimeValue}分钟` : '不限时'
  }
]
//未考试不存在的
const TABLE_COLUMNS_EXTENDED = [
  {
    label: '进入考试时间',
    prop: 'answerBeginTime',
    minWidth: 120
  },
  {
    label: '考试结束时间',
    prop: 'answerEndTime',
    minWidth: 120
  },
  {
    label: '通过状态统计',
    prop: 'isPass',
    minWidth: 120,
    formatter: (row) => (row.isPass ? '通过' : '未通过')
  },
  {
    label: '提交次数',
    prop: 'submitCount',
    minWidth: 120
  },
  {
    label: '最高得分',
    prop: 'maxScore',
    minWidth: 120
  },
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
  showIndexColumn: false,
  enablePagination: true,
  showHandler: true,
  enableMultiSelect: true,
  handlerColumn: {
    minWidth: 150
  }
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
  putAchievement,
  putCertificate,
  getBatchList,
  getBatchNumber
} from '@/api/examManage/schedule'
// import { getOrgTreeSimple } from '@/api/org/org'
import { getorganizationNew } from '@/api/org/org'
export default {
  name: 'ExamInfo',
  inject: ['paperDetail'],
  components: { SearchPopover },
  props: {
    // 是否存在操作列
    hasExamHandle: {
      type: Boolean,
      default: () => true
    },
    // 是否考试
    isFinished: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
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
      tableLoading: false,
      tableData: [],
      tablePageConfig: {},
      tableConfig: _.cloneDeep(TABLE_CONFIG),
      tableColumns: [],
      searchConfig: _.cloneDeep({
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
            type: 'treeSelectNew',
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
                load: this.loadSelectTreeFn,
                lazy: true,
                filterable: false,
                props: {
                  isLeaf: (data) => {
                    return !data.hasChildren
                  },
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
      })
    }
  },
  computed: {},
  watch: {
    hasExamHandle: {
      handler(val) {
        this.setTableConfig(val)
      },
      deep: true,
      immediate: true
    },
    isFinished: {
      handler(val) {
        this.setTableConfig(val)
        this.tableColumns = val ? ALL_COLUMNS : TABLE_COLUMNS
        this.queryInfo.isTested = val ? '0' : '1'
        let examSituation = _.find(this.searchConfig.popoverOptions, { field: 'examSituation' })
        this.$nextTick(() => {
          examSituation.options = val ? isTestOptions : notIsTestOptions
        })
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.initSetting()
    this.loadTableData()
  },
  methods: {
    async loadSelectTreeFn(node, resolve) {
      //  懒加载下拉树数据
      if (this.$refs.tree != undefined) this.checkedKeys = this.$refs.tree.getCheckedKeys()
      let params = { parentId: node.data && node.data.id ? node.data.id : '0' }
      getorganizationNew(params).then((res) => {
        // res.map(val=>val.hasChildren=true)
        resolve(res)
      })
      if (this.$refs.tree != undefined) this.$refs.tree.setCheckedKeys(this.checkedKeys)
    },

    setTableConfig(val) {
      this.tableConfig.enableMultiSelect = val
      this.tableConfig.showHandler = val
    },
    // 初始化设置
    initSetting() {
      let fieldOrgId = _.find(this.searchConfig.popoverOptions, { field: 'orgId' })
      let examSituation = _.find(this.searchConfig.popoverOptions, { field: 'examSituation' })
      let batchNumber = _.find(this.searchConfig.popoverOptions, { field: 'batchNumber' })
      if (fieldOrgId) {
        // getOrgTreeSimple({ parentOrgId: 0 }).then(
        //   (res) =>
        //     (fieldOrgId.config.treeParams.data = _.concat(
        //       [
        //         {
        //           orgName: '全部',
        //           orgId: ''
        //         }
        //       ],
        //       res
        //     ))
        // )
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
    // 跳转详情
    jumpDetail(row) {
      this.$router.push({ path: '/examManagement/examSchedule/detail', query: { id: row.id } })
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
      this.queryInfo.pageNo = 1
      this.queryInfo = _.assign(this.queryInfo, params)
      this.loadTableData()
    },
    // 发布成绩
    pubulishAchievement(ids) {
      this.$confirm('是否发布选择的考生的成绩?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        putAchievement({ ids: ids, examId: this.$route.query.id }).then(() => {
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
      this.pubulishAchievement(ids)
    },
    // 发放与撤回证书操作放一起
    handleCertificate(selection, operation, type) {
      // 以发放状态分组，gainCertificate：true为已发放，否则为未发放
      const certificateGroup = _.groupBy(selection, 'gainCertificate')
      // 以通过与否分组，isPass为true通过了，false为未进入发放证书状态(未通过)
      const passGroup = _.groupBy(selection, 'isPass')
      let source = []
      // 批量操作
      if (type === 'all') {
        // 考试已通过，且未发放可以发放
        const grantSource = _.intersection(
          _.get(passGroup, 'true', []),
          _.get(certificateGroup, 'false', [])
        )
        // 考试通过，且已发放可以撤回
        const revokeSource = _.intersection(
          _.get(passGroup, 'true', []),
          _.get(certificateGroup, 'true', [])
        )
        if (operation === 'grant') {
          source = grantSource
          if (_.size(grantSource) === 0) {
            this.$message.error('所选考生全不满足发放证书的功能！')
            return
          }
        } else {
          source = revokeSource
          if (_.size(revokeSource) === 0) {
            this.$message.error('所选考生全不满足撤回证书的功能！')
            return
          }
        }
      } else {
        // 单个操作
        source =
          operation === 'grant'
            ? _.get(certificateGroup, 'false', [])
            : _.get(certificateGroup, 'true', [])
      }
      // grant发放 revoke撤回
      let examineeId = []
      _.each(source, (item) => {
        examineeId.push(item.id)
      })
      const handleSuccessTips = operation === 'grant' ? '发放' : '撤回'
      let beforeTips = ''
      // 选择发放或者撤回证书的提示语句
      // 所选学员全部进入发放证书阶段，且未获得证书
      if (_.isEmpty(_.get(certificateGroup, operation === 'grant' ? 'true' : 'false', []))) {
        beforeTips = `您确定要为${_.get(source, '[0].userName')}等${_.size(
          source
        )}个学员${handleSuccessTips}证书吗？`
      } else {
        // 发放操作需要提示：所选学员包含未进入可发放证书阶段(未通过考试)或已获得证书
        // 撤回操作需要提示：所选学员包含未进入可发放证书阶段(未通过考试)或已撤回证书
        const needTipsList = _.union(
          _.get(passGroup, 'false', []),
          _.get(certificateGroup, operation === 'grant' ? 'true' : 'false', [])
        )
        beforeTips = `您所选择的学员中包含${_.get(needTipsList, '[0].userName')}等${_.size(
          needTipsList
        )}人未进入发放证书阶段或已获得证书阶段，因此不能对其执行“${handleSuccessTips}证书”操作，是否忽略这些人员继续${handleSuccessTips}证书？`
      }
      this.$confirm(beforeTips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        putCertificate({
          examId: this.$route.query.id,
          examineeId: _.join(examineeId, ','),
          operation
        }).then(() => {
          this.$message.success(`${handleSuccessTips}成功`)
          this.$refs.table.clearSelection()
          this.loadTableData()
        })
      })
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
    }
  }
}
</script>
<style scoped lang="scss"></style>
