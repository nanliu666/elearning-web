<template>
  <div class="trainingDetail">
    <div
      class="trainingDetail_title"
      @click="toTrainingArrange"
    >
      <i class="el-icon-arrow-left"></i> 培训详情
    </div>

    <div class="title_box">
      <div class="title_box_headline">
        <div class="title_box_headline_l">
          Java编程十大核心思维
          <span>未开始</span>
        </div>
        <div class="title_box_headline_r">
          <el-button
            type="primary"
            size="mini"
            :disabled="issueStatus"
            @click="handleConfig"
          >
            开办下一期
          </el-button>
          <el-button
            size="mini"
            :disabled="issueStatus"
            @click="isstopSchedule"
          >
            结办
          </el-button>

          <el-dropdown class="isel-dropdown">
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>编辑</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- showTrainDetail -->
      <div class="title_box_rows">
        <el-row>
          <el-col :span="2">
            <div class="col_title">
              {{ '分类:' }}
            </div>
          </el-col>
          <el-col :span="5">
            <div class="col_content">
              {{ showTrainDetail.categoryName }}
            </div>
          </el-col>
          <el-col :span="2">
            <div class="col_title">
              {{ '培训时间:' }}
            </div>
          </el-col>
          <el-col :span="5">
            <div class="col_content">
              {{ showTrainDetail.trainTime }}
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2">
            <div class="col_title">
              {{ '计划人数:' }}
            </div>
          </el-col>
          <el-col :span="5">
            <div class="col_content">
              {{ showTrainDetail.people }}
            </div>
          </el-col>
          <el-col :span="2">
            <div class="col_title">
              {{ '培训对象:' }}
            </div>
          </el-col>
          <el-col :span="5">
            <div class="col_content">
              {{ showTrainDetail.object }}
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2">
            <div class="col_title">
              {{ '培训方式：' }}
            </div>
          </el-col>
          <el-col :span="5">
            <!-- trainWay:'',	//培训方式（1：面授；2：混合；3：在线）	integer(int32) -->
            <div class="col_content">
              <span v-if="showTrainDetail.trainWay === 1">面授</span>
              <span v-if="showTrainDetail.trainWay === 2">混合</span>
              <span v-if="showTrainDetail.trainWay === 3">在线</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="col_title">
              {{ '培训地点：' }}
            </div>
          </el-col>
          <el-col :span="5">
            <div class="col_content">
              {{ showTrainDetail.address }}
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2">
            <div class="col_title">
              {{ '联系人：' }}
            </div>
          </el-col>
          <el-col :span="5">
            <div class="col_content">
              {{ showTrainDetail.contactName }}
            </div>
          </el-col>
          <el-col :span="2">
            <div class="col_title">
              {{ '联系电话：' }}
            </div>
          </el-col>
          <el-col :span="5">
            <div class="col_content">
              {{ showTrainDetail.contactPhone }}
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2">
            <div class="col_title">
              {{ '主办单位：' }}
            </div>
          </el-col>
          <el-col :span="5">
            <div class="col_content">
              {{ showTrainDetail.sponsor }}
            </div>
          </el-col>
          <el-col :span="2">
            <div class="col_title">
              {{ '承办单位：  ' }}
            </div>
          </el-col>
          <el-col :span="5">
            <div class="col_content">
              {{ showTrainDetail.organizer }}
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2">
            <div class="col_title">
              {{ '班主任： ' }}
            </div>
          </el-col>
          <el-col :span="5">
            <div class="col_content">
              {{ showTrainDetail.headTeacher }}
            </div>
          </el-col>
          <el-col :span="2">
            <div class="col_title">
              {{ '助教：    ' }}
            </div>
          </el-col>
          <el-col :span="5">
            <div class="col_content">
              {{ showTrainDetail.teachAssistant }}
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="introduce">
      <div class="introduce_title">
        <div class="introduce_title_l">
          培训介绍
        </div>
        <div class="introduce_title_r">
          <span
            v-show="isShowIntroduce"
            @click="isShowIntroduce = false"
          >
            <i class="el-icon-arrow-up"></i>&nbsp;收起</span>
          <span
            v-show="!isShowIntroduce"
            @click="isShowIntroduce = true"
          >
            <i class="el-icon-arrow-down"></i>&nbsp;展开</span>
        </div>
      </div>
      <div
        v-show="isShowIntroduce"
        class="introduce_content"
      >
        <div class="introduce_content_t">
          <div v-html="showTrainDetail.introduction"></div>
        </div>
        <!-- <div class="introduce_content_img">
          <img
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1606197580956&di=f8a17064ea1c3ef1ac53a82ecbc7ccdd&imgtype=0&src=http%3A%2F%2Fi3.3conline.com%2Fimages%2Fpiclib%2F201011%2F11%2Fbatch%2F1%2F74221%2F1289443294111o66qdard53.jpg"
            alt=""
          />
        </div> -->
      </div>
    </div>

    <div class="trainingDetail_nav">
      <div class="select_bar">
        <span
          :class="{ select: status === 1 }"
          @click="status = 1"
        >学员概况</span>
        <span
          :class="{ select: status === 2 }"
          @click="status = 2"
        >培训安排</span>
        <span
          :class="{ select: status === 3 }"
          @click="status = 3"
        >评估结果</span>
      </div>

      <!-- 学员概况 -->
      <div
        v-show="status === 1"
        class="general"
      >
        <!-- 表格内容 -->
        <basic-container block>
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
            <template #topMenu>
              <div class="operations">
                <seach-popover
                  :popover-options="searchPopoverConfig.popoverOptions"
                  :require-options="searchPopoverConfig.requireOptions"
                  @submit="handleSearch"
                />
                <div class="operations__btns">
                  <el-tooltip
                    class="operations__btns--tooltip"
                    content="刷新"
                    effect="dark"
                    placement="top"
                    style="color:#acb3b8;"
                  >
                    <el-button
                      class="operations__btns--item"
                      size="mini"
                      icon="el-icon-refresh-right"
                      type="text"
                      @click="refreshTableData"
                    >
                      <!-- <i class="iconfont iconicon_refresh" /> -->
                    </el-button>
                  </el-tooltip>
                  <span class="text_refresh">刷新</span>
                  <el-popover
                    placement="bottom"
                    width="40"
                    trigger="click"
                  >
                    <el-tooltip
                      slot="reference"
                      class="operations__btns--tooltip"
                      content="显隐"
                      effect="dark"
                      placement="top"
                    >
                      <el-button
                        class="operations__btns--item"
                        size="mini"
                        type="text"
                        icon="el-icon-setting"
                        style="color:#acb3b8;"
                      >
                        <!-- <i class="iconfont iconicon_setting" /> -->
                      </el-button>
                    </el-tooltip>

                    <!-- 设置表格列可见性 -->
                    <div class="operations__column--visible">
                      <el-checkbox-group v-model="columnsVisible">
                        <el-checkbox
                          v-for="item of tableColumns"
                          :key="item.prop"
                          :disabled="item.prop === 'name'"
                          :label="item.prop"
                          class="operations__column--item"
                        >
                          {{ item.label }}
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </el-popover>
                </div>
              </div>
            </template>

            <template #multiSelectMenu="{ selection }">
              <el-button
                style="margin-bottom:0;"
                type="text"
                @click="() => handleRemoveItems(selection)"
              >
                批量删除
              </el-button>
            </template>

            <!-- 姓名 -->
            <template
              slot="stuName"
              slot-scope="{ row }"
            >
              <el-button type="text">
                {{ row.stuName }}
              </el-button>
            </template>
            <!-- 选修学习进度 -->
            <template
              slot="electiveProgress"
              slot-scope="{ row }"
            >
              <el-progress :percentage="row.electiveProgress"></el-progress>
            </template>
            <!-- 在线学习进度(必修) -->
            <template
              slot="onlineProgress"
              slot-scope="{ row }"
            >
              <el-progress :percentage="row.onlineProgress"></el-progress>
            </template>

            <!-- 考试情况 // 1：已通过；2：未通过；3：未开始）-->
            <template
              slot="examStatus"
              slot-scope="{ row }"
            >
              <span v-if="row.examStatus === 1">已通过</span>
              <span v-if="row.examStatus === 2">未通过</span>
              <span v-if="row.examStatus === 3">未开始</span>
            </template>
            <!-- 评估情况 // （1：已评估；2：未评估；3：未开始）-->
            <template
              slot="evaluate"
              slot-scope="{ row }"
            >
              <span v-if="row.evaluate === 1">已评估</span>
              <span v-if="row.evaluate === 2">未评估</span>
              <span v-if="row.evaluate === 3">未开始</span>
            </template>
            <!-- 证书状态 // （1：已获得；2：未获得；3：未开始）-->
            <template
              slot="certificate"
              slot-scope="{ row }"
            >
              <span v-if="row.certificate === 1">已获得</span>
              <span v-if="row.certificate === 2">未获得</span>
              <span v-if="row.certificate === 3">未开始</span>
            </template>

            <!-- 操作 -->
            <template
              slot="handler"
              slot-scope="scope"
            >
              <el-button
                v-if="scope.row.onlineProgress == 100 && row.examStatus == 1"
                type="text"
                size="medium"
                @click.stop="isgrantCertificate(scope.row.id)"
              >
                发放证书
              </el-button>
              <el-button
                v-else-if="scope.row.certificate == 1"
                type="text"
                size="medium"
                @click.stop="isrevokeCertificate(scope.row.id)"
              >
                撤回证书
              </el-button>

              <span
                v-else
                style="color:#ccc;"
              >发送证书</span>
            </template>
          </common-table>
        </basic-container>
      </div>

      <!-- 培训安排 -->
      <div
        v-show="status === 2"
        class="arrange"
      >
        <p class="offline_title">
          线下日程
        </p>
        <el-collapse
          v-model="activeNames"
          @change="handleChange"
        >
          <el-collapse-item
            v-for="(itemb, value, index) in isOfflineTodo"
            :key="index"
            :name="index + 1"
          >
            <template slot="title">
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 第{{ index + 1 }}天 {{ value }}
            </template>

            <div
              v-for="(item, index) in itemb"
              :key="index"
              class="arrange_schedule_i"
            >
              <span>{{ item.todoTime }}</span>
              <span>
                <span v-if="item.type === 1">【面授课程】</span><span v-else>【活动】</span>
                {{ item.course }}</span>
              <span>
                <span v-if="item.type === 1">讲师：</span><span v-else>主持人：</span>
                {{ item.lecturerName }}</span>

              <span> 地点： {{ item.address }}</span>

              <!-- 状态（1：已结束；2：进行中；3：未开始） -->
              <span>
                状态：<span v-if="item.status === 1">未开始</span>
                <span v-if="item.status === 2">进行中</span><span v-if="item.status === 3">已结束</span></span>
            </div>
          </el-collapse-item>
        </el-collapse>

        <p class="course_title offline_title">
          在线课程
        </p>
        <el-table
          :data="showOnlineCourse"
          style="width: 100%"
        >
          <el-table-column
            prop="classTime"
            label="上课日期"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="course"
            label="关联课程"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="lecturerName"
            label="讲师"
          >
          </el-table-column>
          <el-table-column
            prop="studyType"
            label="修读类型"
          >
            <template slot-scope="{ row }">
              <span v-if="row.studyType === 1">选修</span>
              <span v-else> 必修 </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
          >
            <template slot-scope="{ row }">
              <!-- status	状态（1：已结束；2：进行中；3：未开始） -->
              <span v-if="row.status === 1">已结束</span>
              <span v-if="row.status === 2">进行中</span>
              <span v-if="row.status === 3">未开始</span>
            </template>
          </el-table-column>
        </el-table>
        <p class="course_title offline_title">
          考试安排
        </p>
        <el-table
          :data="showExamList"
          style="width: 100%"
        >
          <el-table-column
            prop="examTime"
            label="考试日期"
            width="280"
          >
          </el-table-column>
          <el-table-column
            prop="examName"
            label="关联考试"
            width="280"
          >
          </el-table-column>
          <el-table-column
            prop="period"
            label="考试时间(分钟)"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
          >
            <template slot-scope="{ row }">
              <!-- status	状态（1：已结束；2：进行中；3：未开始） -->
              <span v-if="row.status === 1">未开始</span>
              <span v-if="row.status === 2">进行中</span>
              <span v-if="row.status === 3">已结束</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                @click="toexamDetail(row.id)"
              >
                考试详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 评估结果 -->
      <div
        v-show="status === 3"
        class="result"
      >
        <div>
          <div class="result_rate1">
            <span>培训班整体满意度：</span>
            <span>
              <el-rate
                v-model="showTrainEvaluate.composite"
                disabled
                show-score
                text-color="#333"
                score-template="{value} 分"
              >
              </el-rate>
            </span>
          </div>
          <div class="result_rate">
            <span>内容符合预期：</span>
            <span>
              <el-rate
                v-model="showTrainEvaluate.fifth"
                disabled
                show-score
                text-color="#333"
                score-template="{value} 分"
              >
              </el-rate>
            </span>
          </div>
          <div class="result_rate">
            <span>课程设置合理：</span>
            <span>
              <el-rate
                v-model="showTrainEvaluate.first"
                disabled
                show-score
                text-color="#333"
                score-template="{value} 分"
              >
              </el-rate>
            </span>
          </div>
          <div class="result_rate">
            <span>培训所有收获：</span>
            <span>
              <el-rate
                v-model="showTrainEvaluate.fourth"
                disabled
                show-score
                text-color="#333"
                score-template="{value} 分"
              >
              </el-rate>
            </span>
          </div>
          <div class="result_rate">
            <span>教材容易理解：</span>
            <span>
              <el-rate
                v-model="showTrainEvaluate.second"
                disabled
                show-score
                text-color="#333"
                score-template="{value} 分"
              >
              </el-rate>
            </span>
          </div>
          <div class="result_rate">
            <span>形式利于掌握：</span>
            <span>
              <el-rate
                v-model="showTrainEvaluate.third"
                disabled
                show-score
                text-color="#333"
                score-template="{value} 分"
              >
              </el-rate>
            </span>
          </div>
        </div>

        <div class="result_bottom">
          <div
            v-for="(item, index) in showTrainEvaluate.teachersEvaluate"
            :key="index"
            class="result_bottom_box"
          >
            <div class="result_bottom_l">
              <span>
                <img
                  src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3952183824,1808487741&fm=26&gp=0.jpg"
                  alt=""
                />
              </span>
              <span>
                {{ item.teacher_name }}
              </span>
            </div>
            <div class="result_bottom_r">
              <span>授课质量：</span>
              <span>
                <el-rate
                  v-model="item.teacherScore"
                  disabled
                  show-score
                  text-color="#333"
                  score-template="{value} 分"
                >
                </el-rate>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 培训详情
import { deleteMenuInfo, getMenuInfo } from '@/api/system/menu'
import { delCourseInfo } from '@/api/course/course'
import { getOfflineTodo } from '@/api/training/training'
import {
  studentList,
  getOnlineCourse,
  getTrainDetail,
  getTrainEvaluate,
  grantCertificate,
  revokeCertificate,
  examList,
  stopSchedule
} from '@/api/training/training'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'stuName',
    slot: true
  },
  {
    label: '手机号码',
    prop: 'phone',
    minWidth: 180
  },
  {
    label: '所属部门',
    prop: 'deptName',
    minWidth: 240
  },
  {
    label: '在线学习进度(必修)',
    prop: 'onlineProgress',
    minWidth: 220,
    slot: true
  },
  {
    label: '选修学习进度',
    prop: 'electiveProgress',
    slot: true,
    minWidth: 220
  },
  // 1：已通过；2：未通过；3：未开始）
  {
    label: '考试情况',
    prop: 'examStatus',
    slot: true
  },
  // （1：已评估；2：未评估；3：未开始）
  {
    label: '评估情况',
    prop: 'evaluate',
    slot: true
  },
  // （1：已获得；2：未获得；3：未开始）
  {
    label: '证书状态',
    prop: 'certificate',
    slot: true
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 100
  },
  enableMultiSelect: true,
  enablePagination: true,
  showHandler: true,
  showIndexColumn: false,

  // 树形结构懒加载
  lazy: true,
  load: async (row, treeNode, resolve) => {
    try {
      let items = await getMenuInfo(row.menuId)
      resolve(_.map(items, (i) => ({ ...i, hasChildren: true })))
    } catch (err) {
      resolve([])
    }
  },
  rowKey: 'menuId',
  treeProps: { hasChildren: 'hasChildren', children: 'children' }
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '请输入目录名称搜索' },
    data: '',
    field: 'stuName',
    label: '',
    type: 'input'
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    config: { placeholder: 'deptId' },
    data: '',
    field: 'deptId',
    label: '所属部门',
    type: 'select',
    options: []
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'onlineProgress',
    label: '在线学习进度(必修)',
    type: 'select',
    options: [
      { value: 1, label: '已完成' },
      { value: 2, label: '未完成' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'examStatus',
    label: '考试情况',
    type: 'select',
    options: [
      { value: 1, label: '已通过' },
      { value: 2, label: '未通过' },
      { value: 3, label: '未开始' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'evaluate',
    label: '评估情况',
    type: 'select',
    options: [
      { value: 1, label: '已评估' },
      { value: 2, label: '未评估' },
      { value: 3, label: '未开始' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'certificate',
    label: '证书状态',
    type: 'select',
    options: [
      { value: 1, label: '已获得' },
      { value: 2, label: '未获得' },
      { value: 3, label: '未开始' }
    ]
  }
]
const SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}

export default {
  // 搜索组件
  components: {
    SeachPopover: () => import('@/components/searchPopOver')
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      // 是否是已发布页过来的
      issueStatus: this.$route.query.status,
      showExamList: [],
      showTrainEvaluate: {},
      isOfflineTodo: '',
      // 查询培训线上课程  在线课程
      showOnlineCourse: [],
      showTrainDetail: {
        draft: '', //草稿：0.已发布、1.草稿	integer(int32)
        id: '', //id	integer(int64)
        organizer: '', //承办单位	string
        people: '', //'计划人数'	integer(int32)
        sponsor: '', //主办单位	string
        status: '', //培训状态（0：已办结；1：未开始；2：进行中）	integer(int32)
        trainName: '', //'培训名称'	string
        trainNo: '', //培训编号	string
        trainTime: '', //培训时间	string
        trainWay: '' //培训方式（1：面授；2：混合；3：在线）	integer(int32)
      },

      // 评估结果
      resultValue: 2.8,
      // 线下日程表格
      activeNamesTableData: [],

      // 线下日程
      activeNames: 1,

      isShowIntroduce: false,
      // Dialog无数据
      dialogVisible: false,
      // 导航
      status: 1,
      // 表格
      query: {
        name: ''
      },
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },

      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      // query: {},
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },

  created() {
    this.refreshTableData()
    this.isStudentList({ trainId: 1 })
    this.isGetOnlineCourse()
    // this.isGetCatalogs()
    this.isGetOfflineTodo()
    this.isGetTrainDetail()
    this.isgetTrainEvaluate()
    this.isExamList()
  },
  activated() {
    // this.loadData()
    // this.getInfo()
  },
  methods: {
    // 去开办下一期
    handleConfig() {
      this.$router.push({ path: '/training/trainingEdit?id=' + this.$route.query.id })
    },
    // 结办
    isstopSchedule() {
      let id = this.$route.query.id
      stopSchedule(id).then(() => {
        this.issueStatus = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    // 去列表页
    toTrainingArrange() {
      this.$router.push({ path: '/training/trainingArrange' })
    },
    // 跳转考试详情
    toexamDetail(id) {
      this.$router.push({ path: '/training/examination?id=' + id })
    },

    // 查询培训考试安排
    isExamList() {
      let id = this.$route.query.id
      // let id = '1332236640693030914'
      examList({ trainId: id }).then((res) => {
        this.showExamList = res
      })
    },

    //发放学员证书
    isgrantCertificate(id) {
      grantCertificate([id]).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.isStudentList()
      })
    },
    // 撤回学员证书
    isrevokeCertificate(id) {
      revokeCertificate([id]).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.isStudentList()
      })
    },

    //获取今天日期，格式YYYY-MM-DD
    getNowFormatDate() {
      let date = new Date()
      let seperator1 = '-'
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    },
    // 查询培训线下日程
    isGetOfflineTodo() {
      // console.log('id', this.$route.query.id)
      // let id = '1332138220456259585'
      let id = this.$route.query.id
      getOfflineTodo({ trainId: id }).then((res) => {
        this.isOfflineTodo = res
        let index = 1
        for (const key in res) {
          ++index
          if (key == this.getNowFormatDate()) {
            this.activeNames = index
          }
        }
      })
    },
    // 查询培训线上课程
    isGetOnlineCourse() {
      // console.log('id', this.$route.query.id)
      // let id = '1331882612830322689'
      let id = this.$route.query.id
      getOnlineCourse({ trainId: id }).then((res) => {
        // console.log('------------+',res)
        this.showOnlineCourse = res
      })
    },
    // 查询培训详情
    isGetTrainDetail() {
      // console.log('id', this.$route.query.id)
      let id = this.$route.query.id
      // let id = '1332136482139570178'
      getTrainDetail({ trainId: id }).then((res) => {
        this.showTrainDetail = res
      })
    },

    // 学员培训列表
    isStudentList(courseName) {
      // console.log('id', this.$route.query.id)
      let page = {
        pageNo: '',
        pageSize: '',
        status: ''
      }
      page.pageNo = this.page.currentPage
      page.pageSize = this.page.size
      let params = { ...page, ...courseName }
      params.status = this.status
      // params.trainId = 1
      params.trainId = this.$route.query.id
      studentList(params).then((res) => {
        this.tableData = res.data
        SEARCH_POPOVER_POPOVER_OPTIONS[0].options = []
        this.tableData.forEach((item) => {
          // console.log(item.id,item.deptName);
          SEARCH_POPOVER_POPOVER_OPTIONS[0].options.push({
            value: item.id,
            label: item.deptName
          })
        })
      })
    },

    isgetTrainEvaluate() {
      // console.log('id', this.$route.query.id)
      let params = { trainId: this.$route.query.id++ }
      getTrainEvaluate(params).then((res) => {
        this.showTrainEvaluate = res
      })
    },

    // 线下日程
    handleChange() {},

    // 编辑&删除&移动
    handleCommand(e, row) {
      if (e === 'edit') {
        // 编辑
      }
      if (e === 'del') {
        // 删除
        this.$confirm('此操作将删除该课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delCourseInfo({ courseId: row.catalogId }).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
      if (e === 'move') {
        // 移动
      }
    },
    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.currentPage = param
      this.isStudentList()
    },
    handlePageSizeChange(param) {
      this.page.size = param
      this.isStudentList()
    },

    handleSearch(searchParams) {
      // this.loadTableData(_.pickBy(searchParams))
      this.isStudentList(searchParams)
    },

    handleRemoveItems(selection) {
      this.$confirm('确定将选择数据删除?', {
        type: 'warning'
      })
        .then(() => deleteMenuInfo(_.map(selection, ({ menuId }) => menuId).join(',')))
        .then(() => {
          // 删除完成后更新视图
          this.$refs.table.clearSelection()
          this.refreshTableData()
        })
    },

    // 刷新列表数据
    refreshTableData() {},

    // 导航
    showSelect(index) {
      this.status = index
    },

    // 查询培训详情数据获取
    getTrainingInfo() {}
  }
}
</script>

<style lang="scss" scoped>
.col_content {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: rgba(0, 11, 21, 0.85);
  letter-spacing: 0;
}
.trainingDetail {
  color: #333333;
  .trainingDetail_title {
    height: 60px;
    line-height: 60px;
    color: #111;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
  }
  .title_box {
    background-color: #fff;
    padding: 10px 35px 25px 55px;
    .title_box_headline {
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      .isel-dropdown {
        margin-left: 15px;
        border: 1px solid #ccc;
        border-radius: 3px;
        height: 28px;
        line-height: 28px;
        padding: 0 10px;
        .el-dropdown-link {
          cursor: pointer;
        }
        .el-icon-arrow-down {
          font-size: 12px;
        }
      }
      .title_box_headline_l {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
        line-height: 28px;
        span {
          background-color: #cbf5e8;
          font-size: 12px;
          padding: 3px 5px;
          margin-left: 10px;
        }
      }
    }
    .title_box_rows {
      margin-top: 10px;
      .col_title {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        letter-spacing: 0;
      }
      /deep/.el-row {
        margin-top: 8px;
      }
    }
  }
  .introduce {
    color: #333333;
    background-color: #fff;
    margin-top: -15px;
    padding: 25px;
    .introduce_title {
      border-top: 1px solid #ebeced;
      padding-top: 25px;
      .introduce_title_l {
        padding-left: 25px;
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
      }
      display: flex;
      justify-content: space-between;
      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        letter-spacing: 0;
        i {
          font-weight: 900;
        }
      }
    }
    .introduce_content {
      margin: 0 80px;
    }
    .introduce_content_t {
      margin: 15px 0;
    }
    .introduce_content_img {
      img {
        width: 100%;
      }
    }
  }
  .trainingDetail_nav {
    margin-top: 20px;
    background-color: #fff;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.65);
    letter-spacing: 0;
    .select_bar {
      height: 60px;
      border-bottom: 1px solid #ebeced;
      display: flex;
      margin: 0 30px;
      span {
        height: 60px;
        line-height: 60px;
        margin-right: 30px;
      }
      .select {
        border-bottom: 2px solid #01aafc;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #01aafc;
        letter-spacing: 0;
      }
    }
    .general {
      // padding: 25px 45px;
      #isdialog_show {
        width: 100%;
        height: 100px;
        background-color: #6b6b6b;
        border-radius: 5px;
        margin-bottom: 20px;
        padding: 20px;
        color: #fff;
        position: relative;
        span {
          color: #a0b5fd;
        }
        i {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 22px;
        }
      }
      .addUser {
        font-size: 14px;
        display: inline-block;
        color: #757c85;
        line-height: 14px;
        cursor: pointer;
        padding-right: 12px;
        border-right: 0.5px solid #e9e9e9;
      }
      .icon {
        margin-left: 12px;
        font-size: 18px;
        color: #a0a8ae;
        cursor: pointer;
      }
      .course_in {
        position: relative;
        background-color: #fff;
        .select_bar {
          height: 50px;
          border-bottom: 1px solid #ccc;
          display: flex;
          span {
            height: 50px;
            line-height: 50px;
            margin-left: 30px;
          }
          .select {
            border-bottom: 2px solid #1677ff;
          }
        }
        .draft {
          padding: 25px;
        }
      }
      .dialog {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 999;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        .el-icon-close {
          position: absolute;
          top: 35px;
          right: 35px;
          font-size: 35px;
          color: #fff;
        }
        .guide {
          p {
            font-size: 20px;
            text-align: center;
            margin-bottom: 45px;
          }
          .box_all {
            display: flex;
            .bxo {
              position: relative;
              width: 150px;
              height: 150px;
              border: 1px solid #fff;
              .bxo_x {
                position: absolute;
                top: -30px;
                right: 75px;
                width: 1px;
                height: 210px;
                background-color: #fff;
                transform: rotate(45deg);
              }
              .bxo_y {
                position: absolute;
                top: -30px;
                right: 74px;
                width: 1px;
                height: 210px;
                background-color: #fff;
                transform: rotate(135deg);
              }
              .number {
                position: absolute;
                top: 65px;
                right: 65px;
                background-color: #616263;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                text-align: center;
                line-height: 20px;
              }
            }
            .arrows {
              position: relative;
              width: 220px;
              height: 150px;
              .el-icon-caret-right {
                font-size: 30px;
                position: absolute;
                top: 65px;
                right: 28px;
              }
              .wire {
                position: absolute;
                top: 78px;
                right: 45px;
                width: 130px;
                height: 5px;
                background-color: #fff;
              }
            }
          }
          .describe {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            span {
              width: 150px;
              text-align: center;
            }
          }
          .btn_b {
            margin-top: 45px;
            text-align: center;
          }
        }
      }
      /deep/ #recommend {
        position: relative;
        /deep/ .icon_rec {
          position: absolute;
          top: 0;
          left: 0;
          transform: rotate(-45deg);
          font-size: 10px !important;
          text-align: center;
          line-height: 24px;
        }
        /deep/ #triangle_topleft {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-top: 30px solid #d6dcfd;
          border-right: 30px solid transparent;
        }
        /deep/ #recommend_info {
          padding-left: 15px;
        }
      }
    }
    .arrange {
      .offline_title {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #000b15;
        letter-spacing: 0;
      }
      padding: 15px 55px;
      .arrange_schedule_i {
        height: 55px;
        line-height: 55px;
        border-bottom: 1px solid #ccc;
        display: flex;
        span {
          &:nth-child(1) {
            padding-left: 20px;
            width: 15%;
          }
          &:nth-child(2) {
            width: 35%;
          }
          &:nth-child(3) {
            width: 20%;
          }
          &:nth-child(4) {
            width: 20%;
          }
          &:nth-child(5) {
            width: 20%;
          }
        }
      }
      .course_title {
        margin-top: 45px;
      }
    }
    .result {
      padding: 25px 35px;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.45);
      letter-spacing: 0;
      text-align: right;
      /deep/ .el-rate {
        font-size: 14px !important;
      }
      .result_rate1 {
        display: flex;
        span {
          &:nth-child(1) {
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: rgba(0, 11, 21, 0.85);
            letter-spacing: 0;
            text-align: right;
            font-weight: 700;
            margin-right: 10px;
          }
        }
      }
      .result_rate {
        margin-top: 15px;
        display: flex;
        span {
          &:nth-child(1) {
            text-align: right;
            margin-right: 10px;
          }
        }
      }
      .result_bottom {
        margin-top: 20px;

        border-top: 1px solid #ccc;

        .result_bottom_box {
          height: 65px;
          display: flex;
        }

        .result_bottom_l {
          display: flex;
          img {
            margin-top: 20px;
            margin-left: 30px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
          span {
            &:nth-child(2) {
              margin-top: 30px;
              margin-left: 15px;
            }
          }
        }
        .result_bottom_r {
          display: flex;
          padding-top: 30px;
          span {
            &:nth-child(1) {
              margin: 0 10px 0 45px;
            }
          }
        }
      }
    }
  }
}

/deep/.page-wrap[data-v-793409ea] {
  margin-right: 70px;
}
/deep/.el-collapse-item__header {
  background-color: #f7f8fa;
  position: relative;
  margin-bottom: 2px;
  /deep/.el-collapse-item__arrow {
    position: absolute;
    left: 10px;
    top: 14px;
    font-size: 20px;
  }
}
</style>

<style lang="sass" scoped>

/deep/.el-input
  width: 100%
/deep/.el-select
  width: 100%
/deep/.el-input

.operations__btns
    color: #acb3b8
    display: flex;
.text_refresh
    color: #acb3b8
    margin-right: 20px
$color_icon: #A0A8AE

.basic-container--block
  height: calc(100% - 92px)
  min-height: calc(100% - 92px)
.operations
  align-items: center
  display: flex
  justify-content: space-between
  &__column--item
    height: 25px
  &__column--visible
    height: 200px
    overflow: scroll
  &__btns
    align-items: center
    display: flex
    height: 24px
    justify-content: flex-start
  &__btns--item
    margin: 0
    margin-right: 4px
    padding: 0
    height: 24px
    width: 24px
    line-height: 24px
    &:last-child
      margin: 0
    // margin-bottom: 8px
    // margin-right: 8px
  .iconfont
    color: $color_icon
    font-weight: bold
    font-size: 16px

.Menu
  // 添加一个分隔号 "｜"
  .table__handler
    display: flex
    justify-content: flex-end
    > .el-button--text
      text-align: center
      padding: 0 8px
      margin-left: 0px
      position: relative
      &:not(:last-child)::after
        background-color: #e3e7e9
        content: ''
        height: 10px
        position: absolute
        right: 0
        top: 50%
        transform: translateY(-50%)
        width: 1px
</style>
