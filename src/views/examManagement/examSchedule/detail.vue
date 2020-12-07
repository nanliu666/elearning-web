<template>
  <div>
    <page-header
      title="考试详情"
      show-back
    />
    <basic-container class="details-container">
      <div class="details-top">
        <header class="top-title">
          <div class="title-left">
            <span class="title-text">{{ examDetail.resName }}</span>
            <el-tag :type="getStatusType(examDetail.status).color">
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
              <span>{{ examDetail.testPaper }}</span>
              <el-button
                type="text"
                style="padding: 0; margin-left: 20px"
                @click="goRelevance"
              >查看关联试卷</el-button>
            </span>
          </li>
          <li class="details-li">
            <span class="li-label">评卷人：</span>
            <span class="li-value">{{ examDetail.reviewer }}</span>
          </li>
          <li class="details-li">
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
              @click="extend"
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
                <span>整卷答题</span>
              </div>
              <div class="content">
                <span>考试时长：</span>
                <span>整卷答题</span>
              </div>
              <div class="content">
                <span>参加次数：</span>
                <span>不限次数</span>
              </div>
              <div class="content">
                <span>考试时间策略：</span>
                <span>允许进入考试的时间</span>
              </div>
              <div class="content">
                <span>积分：</span>
                <span>本考试记录系统积分2分</span>
              </div>
              <div class="content">
                <span>发布考试：</span>
                <span>考试开始前5分钟发布考试信息</span>
              </div>
              <div class="content">
                <span>补考次数：</span>
                <span>3次</span>
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
                <span>是</span>
              </div>
              <div class="content">
                <span>是否允许迟到分钟后禁止参加考试：</span>
                <span>不允许</span>
              </div>
              <div class="content">
                <span>生成试卷时是否打乱试题和选项顺序：</span>
                <span>是</span>
              </div>
              <div class="content">
                <span>交卷即时是否生成答案统计数据(建议大规模考试时不启用)：</span>
                <span>否</span>
              </div>
              <div class="content">
                <span>是否迟到后禁止考试：</span>
                <span>是</span>
              </div>
              <div class="content">
                <span>答卷时间过少是否禁止交卷：</span>
                <span>是</span>
              </div>
              <div class="content">
                <span>是否启用试卷预生成服务：</span>
                <span>是</span>
              </div>
              <div class="content">
                <span>是否自动保存答案到服务器：</span>
                <span>是</span>
              </div>
            </div>
          </li>
          <li class="extend-li">
            <div class="li-title">
              考生权限：
            </div>
            <div class="li-content">
              <div class="content">
                <span>是否允许考生查看成绩：</span>
                <span>永久查看</span>
              </div>
              <div class="content">
                <span>是否允许考生查看本机资料(开卷考试)：</span>
                <span>不允许</span>
              </div>
              <div class="content">
                <span>是否允许考生查看答卷：</span>
                <span>是</span>
              </div>
              <div class="content">
                <span>是否允许考生自己评卷：</span>
                <span>否</span>
              </div>
              <div class="content">
                <span>是否允许考生查看标准答案：</span>
                <span>是</span>
              </div>
            </div>
          </li>
          <li class="extend-li">
            <div class="li-title">
              评卷策略：
            </div>
            <div class="li-content">
              <div class="content">
                <span>是否允许评卷人修改考生答案：</span>
                <span>是</span>
              </div>
              <div class="content">
                <span>是否允许修改考生客观题答案及其评分结果：</span>
                <span>不允许</span>
              </div>
              <div class="content">
                <span>评卷限定最高得分：</span>
                <span>不限制</span>
              </div>
              <div class="content">
                <span>是否手工评卷是否显示客观题：</span>
                <span>否</span>
              </div>
              <div class="content">
                <span>判断题是否答对得分,不答不得分,答错扣分：</span>
                <span>是</span>
              </div>
              <div class="content">
                <span>多选题：</span>
                <span>完全正确得分</span>
              </div>
            </div>
          </li>
          <li class="extend-li">
            <div class="li-title">
              成绩分布：
            </div>
            <div class="li-content">
              <div class="content">
                <span>是否由系统自动评定通过：</span>
                <span>是</span>
              </div>
              <div class="content">
                <span>通过条件：</span>
                <span>按成绩，成绩不低于60分</span>
              </div>
              <div class="content">
                <span>发布规则：</span>
                <span>定时自动发布</span>
              </div>
              <div class="content">
                <span>发布时间：</span>
                <span>2020-10-10 21:00:00</span>
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
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          已考试
        </el-menu-item>
        <el-menu-item index="2">
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
          <template
            slot="multiSelectMenu"
            slot-scope="{ selection }"
          >
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="deleteSelected(selection)"
            >
              发布成绩
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="deleteSelected(selection)"
            >
              发放证书
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="deleteSelected(selection)"
            >
              撤回证书
            </el-button>
          </template>
          <template
            v-if="activeIndex === '1'"
            #handler="{row}"
          >
            <div class="menuClass">
              <el-button
                type="text"
                @click="handleStatus(row)"
              >
                发布成绩
              </el-button>
              <el-button
                type="text"
                @click="handleAuth(row)"
              >
                发放证书
              </el-button>
            </div>
          </template>
        </common-table>
      </div>
    </basic-container>
  </div>
</template>

<script>
// import { getKnowledgeManageDetails } from '@/api/knowledge/knowledge'
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'examineeName',
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
    prop: 'status', //1-已经通过 2-未通过 3-未开始
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
      type: 'select',
      field: 'status',
      label: '状态',
      data: '',
      options: [
        { value: '', label: '全部' },
        { value: 0, label: '启用' },
        { value: 1, label: '停用' }
      ]
    },
    {
      type: 'select',
      field: 'status1',
      label: '考试分类',
      data: '',
      options: [
        { value: '', label: '全部' },
        { value: 0, label: '启用' },
        { value: 1, label: '停用' }
      ]
    },
    {
      type: 'select',
      field: 'status2',
      label: '考试类型',
      data: '',
      options: [
        { value: '', label: '全部' },
        { value: 0, label: '启用' },
        { value: 1, label: '停用' }
      ]
    },
    {
      type: 'select',
      field: 'status3',
      label: '关联试卷',
      data: '',
      options: [
        { value: '', label: '全部' },
        { value: 0, label: '启用' },
        { value: 1, label: '停用' }
      ]
    },
    {
      type: 'select',
      field: 'userId',
      data: '',
      label: '创建人',
      options: [],
      config: { optionLabel: 'name', optionValue: 'userId' }
    }
  ]
}
import SearchPopover from '@/components/searchPopOver/index'
import { getKnowledgeManageList } from '@/api/knowledge/knowledge'
export default {
  components: { SearchPopover },
  data() {
    return {
      isExtend: false,
      activeIndex: '1',
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      // 请求参数
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        resName: '',
        catalogId: '',
        uploadType: '',
        tagId: '',
        status: ''
      },
      examDetail: {
        resName: 'EHS应知会全员考试',
        status: '0',
        categoryName: 'JAVA技能课程/Java高级培训',
        testPaper: 'EHS应知会试卷',
        reviewer: '王华丽',
        certificateName: '一个模板'
      },
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
      this.queryInfo = params
      this.loadTableData()
    },
    // 跳转详情
    jumpDetail(row) {
      this.$router.push({ path: '/examManagement/examSchedule/detail', query: { id: row.id } })
    },
    // 展开与收起
    extend() {
      this.isExtend = !this.isExtend
    },
    // 编辑和复制
    edit(type) {
      const basicQuery = { id: this.examDetail.id }
      const query = type === 'copy' ? _.assign(basicQuery, { type: 'copy' }) : basicQuery
      this.$router.push({ path: '/examManagement/examSchedule/edit', query })
    },
    deleteFun() {
      // const params = {id: this.examDetail.id}
      this.$message.success('删除成功')
      this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
      this.$nextTick(() => {
        this.$router.push({ path: '/examManagement/examSchedule/list' })
      })
    },
    // 前往关联试卷
    goRelevance() {
      this.$router.push({ path: '/examManagement/examSchedule/relevanceList' })
    },
    /**
     * 标识状态
     */
    getStatusType(status) {
      const TYPE_STATUS = {
        '0': {
          color: 'success',
          text: '未开始'
        },
        '1': {
          color: 'warning',
          text: '进行中'
        },
        '2': {
          color: '',
          text: '已过期'
        }
      }
      return TYPE_STATUS[status]
    },
    /**
     * 初始数据，并处理附件
     */
    initData() {
      // getKnowledgeManageDetails({ id: this.$route.query.id }).then((res) => {
      //   this.examDetail = res
      // })
    },
    async loadTableData() {
      if (this.tableLoading) {
        return
      }
      try {
        this.tableLoading = true
        let { totalNum, data } = await getKnowledgeManageList(this.queryInfo)
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
      this.tableConfig.enableMultiSelect = key === '1' ? true : false
      this.tableConfig.showHandler = key === '1' ? true : false
      this.tableColumns = key === '1' ? ALL_COLUMNS : TABLE_COLUMNS
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
