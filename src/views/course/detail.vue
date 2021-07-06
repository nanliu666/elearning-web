<template>
  <div class="examination">
    <page-header
      title="学习情况"
      show-back
    />

    <div class="compileLecturerr_head_box">
      <div class="imgBox">
        <img :src="userData.url" />
        <div
          v-show="userData.isRecommend == 1"
          class="icon"
        ></div>
        <span
          v-if="userData.isRecommend === 1"
          class="text"
        >推荐</span>
      </div>
      <div class="rBox">
        <ul>
          <li>
            <div class="title">
              <span class="rBox_title">{{ userData.name }}</span>
              <span class="myicon"> {{ status(userData.status) }} </span>
            </div>
          </li>
          <li>
            <div class="colbox">
              <span class="text_title">讲师：</span>
              <span class="text">{{ userData.teacherName ? userData.teacherName : '--' }}</span>
            </div>
            <div class="colbox">
              <span class="text_title">课程分类：</span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="userData.catalogName"
                placement="top-start"
                :disabled="userData.catalogName && userData.catalogName.length < 32"
              >
                <span
                  ref="courseClass"
                  class="text"
                >{{
                  userData.catalogName ? userData.catalogName : '--'
                }}</span>
              </el-tooltip>
            </div>
          </li>
          <li>
            <div class="colbox">
              <span class="text_title">授课方式：</span>
              <span
                v-if="userData.type == 1"
                class="text"
              >在线课程</span>
              <span
                v-else-if="userData.type == 2"
                class="text"
              >面授课程</span>
              <span
                v-else-if="userData.type == 3"
                class="text"
              >直播课程</span>
              <span
                v-else
                class="text"
              >--</span>
            </div>
            <div class="colbox">
              <span class="text_title">标准课时（分钟）：</span>
              <span class="text">{{ userData.period ? userData.period : '--' }}</span>
            </div>
          </li>
          <li>
            <div class="colbox">
              <span class="text_title">积分：</span>
              <span class="text">{{ userData.credit ? userData.credit : '--' }}</span>
            </div>
            <div class="colbox">
              <span class="text_title">通过条件：</span>
              <span> {{ userData.passCondition === 'c' ? '达到课程学时' : '--' }} </span>
            </div>
          </li>
          <li>
            <div class="colbox">
              <span class="text_title">选修类型：</span>
              <span
                v-if="userData.electiveType == 1"
                class="text"
              >开放选修</span>
              <span
                v-else-if="userData.electiveType == 2"
                class="text"
              >通过审批</span>
              <span
                v-else-if="userData.electiveType == 3"
                class="text"
              >禁止选修</span>
              <span
                v-else
                class="text"
              >--</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="data_bar_box">
      <div class="data_bar">
        <div class="bar_item">
          <div class="item_top">
            学习人数
          </div>
          <div class="item_bottom">
            {{ userData.studyPeople || '--' }}
          </div>
        </div>
        <div class="bar_item">
          <div class="item_top">
            通过人数
          </div>
          <div class="item_bottom">
            {{ userData.finishPeople || '--' }}
          </div>
        </div>
        <div class="bar_item">
          <div class="item_top">
            收藏人数
          </div>
          <div class="item_bottom">
            {{ userData.collectedPeople || '--' }}
          </div>
        </div>
        <div class="bar_item">
          <div class="item_top">
            评论人数
          </div>
          <div class="item_bottom">
            {{ userData.commentPeople || '--' }}
          </div>
        </div>
      </div>
    </div>
    <div class="examinee_list">
      <div class="litle_bar">
        <el-tabs
          v-model="tabsName"
          lazy
          @tab-click="tabsActive"
        >
          <el-tab-pane
            label="学习情况"
            name="studyInfo"
          >
            <detailList />
          </el-tab-pane>
          <el-tab-pane
            label="课程介绍"
            name="courseIntroduction"
            lazy
          >
            <div
              v-if="userData.introduction"
              class="courseIntroduction"
              style="word-break: break-all"
              v-html="_.unescape(userData.introduction)"
            ></div>
            <div
              v-else
              style="text-align: center"
            >
              <img src="../../assets/images/nodata.png" />
              <div>暂无数据</div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="课程内容"
            name="courseContent"
            lazy
          >
            <ul
              v-if="courseContent.length"
              class="courseContent"
            >
              <li
                v-for="(item, index) in courseContent"
                :key="index"
              >
                <span class="index">{{ index + 1 }}</span>
                <span class="centent">{{ `【${type[item.type - 1]}】 ${item.name}` }}</span>
                <span
                  style="color: #207efa"
                  @click="lookContent($route.query.id, item.contentId)"
                >查看内容</span>
              </li>
            </ul>
            <div
              v-else
              style="text-align: center"
            >
              <img src="../../assets/images/nodata.png" />
              <div>暂无数据</div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="课程评价"
            name="courseEvaluation"
            lazy
          >
            <div
              v-if="courseEvaluation.length > 0"
              class="courseEvaluation"
            >
              <div class="score">
                <span>课程评分:</span>
                <el-rate
                  v-model="rate"
                  allow-half
                  disabled
                ></el-rate>
                <span> {{ rate }}分</span>
              </div>
              <ul>
                <li
                  v-for="(item, index) in courseEvaluation"
                  :key="index"
                >
                  <img :src="item.avatarUrl" />
                  <div class="content">
                    <div class="top">
                      <span>{{ item.userName }}</span>
                      <span>{{ item.createTime }}</span>
                    </div>
                    <el-rate
                      allow-half
                      disabled
                      :value="parseFloat(item.scope)"
                    ></el-rate>
                    <div class="footer">
                      {{ item.remark }}
                    </div>
                  </div>
                </li>
              </ul>
              <el-pagination
                :current-page="evaluationPage.pageNo"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="evaluationPage.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="evaluationPage.totalPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              >
              </el-pagination>
            </div>
            <div
              v-else
              style="text-align: center"
            >
              <img src="../../assets/images/nodata.png" />
              <div>暂无数据</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCourseStudyDetail,
  getStudyList,
  courseEvaluation,
  getCourseRecord
} from '@/api/course/course'
import detailList from './detailComponents/detailList'
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'name'
  },
  {
    label: '手机号',
    prop: 'phonenum'
  },
  {
    label: '所属部门',
    prop: 'deptName'
  },
  {
    label: '学习进度',
    prop: 'progress',
    slot: true
  }
]
const TABLE_CONFIG = {
  enableMultiSelect: false,
  enablePagination: true,
  showHandler: false,
  showIndexColumn: false,

  // 树形结构懒加载
  lazy: true,
  rowKey: 'menuId',
  treeProps: { hasChildren: 'hasChildren', children: 'children' }
}
const TABLE_PAGE_CONFIG = {}

export default {
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  components: {
    detailList
  },

  data() {
    return {
      type: ['文章', '文档', '资料下载', '作业', '视频'],
      courseContent: [],
      showExamDetail: [],
      // Dialog无数据
      dialogVisible: false,
      rate: 0,
      // 表格
      query: {
        name: ''
      },
      // 评价数据
      courseEvaluation: [],
      evaluationPage: {
        pageNo: 1,
        pageSize: 10,
        totalPage: 0
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      tabsName: 'studyInfo',
      userData: {},
      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      // query: {},
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },
  computed: {
    status() {
      return (status) => {
        let str = '--'
        switch (status) {
          case 0:
            str = '审核中'
            break
          case 1:
            str = '已发布'
            break
          case 2:
            str = '草稿'
            break
          case 3:
            str = '已停用'
            break
          case 11:
            str = '已拒绝'
            break
          case 12:
            str = '已撤回'
            break
        }
        return str
      }
    }
  },
  created() {
    this.getUserList()
  },
  activated() {
    this.getUserList()
    this.getInfo()
  },
  methods: {
    async getInfo() {
      let res = await getCourseStudyDetail({ courseId: this.$route.query.id })
      res.scope = res.scope ? parseFloat(res.scope).toFixed(1) : 0
      this.userData = res
      this.rate = parseFloat(res.scope)
    },

    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.pageNo = param
      this.getUserList()
    },
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.getUserList()
    },

    handleSearch(searchParams) {
      this.getUserList(searchParams)
    },

    // 刷新列表数据
    refreshTableData() {
      this.getUserList()
    },

    // 拿数据
    async getUserList() {
      let res = await getStudyList({ courseId: this.$route.query.id, ...this.page })
      this.tableData = res.data
      this.page.total = res.totalNum
    },

    // tabs页切换
    tabsActive({ index }) {
      if (index === '3' && this.courseEvaluation.length === 0) {
        this.getCourseEvaluation()
      } else if (index === '2' && this.courseContent.length === 0) {
        this.getCourseContent()
      }
    },
    // 获取课程评论
    getCourseEvaluation() {
      courseEvaluation({ courseId: this.$route.query.id, ...this.evaluationPage }).then((res) => {
        this.evaluationPage.totalPage = res.totalNum
        this.courseEvaluation = res.data
      })
    },
    handleSizeChange(pageSize) {
      this.evaluationPage.pageSize = pageSize
      this.getCourseEvaluation()
    },
    handleCurrentChange(page) {
      this.evaluationPage.pageNo = page
      this.getCourseEvaluation()
    },
    getCourseContent() {
      getCourseRecord({ courseId: this.$route.query.id }).then((res) => {
        this.courseContent = res
      })
    },
    lookContent(id, index) {
      this.$router.push({
        path: '/course/chapterContent',
        query: {
          id,
          index
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table_title {
  font-size: 18px;
  color: #000b15;
  letter-spacing: 0;
}
.data_bar_box {
  background-color: #fff;
  .item_bottom {
    font-size: 28px;
    color: #000b15;
    letter-spacing: 0;
    text-align: center;
    line-height: 42px;
    font-weight: 500;
  }
  .item_top {
    opacity: 0.45;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #000b15;
    letter-spacing: 0;
    text-align: center;
    line-height: 22px;
    font-weight: 400;
  }
  .data_bar {
    display: flex;
    justify-content: space-around;
  }
}
.data_bar {
  display: flex;
  width: 100%;
  background-color: #fff;
  border-top: 1px solid #ebeced;
  .bar_item {
    width: 20%;
    margin-top: 24px;
    text-align: center;

    font-size: 14px;
    color: #000b15;
    letter-spacing: 0;
    text-align: center;
    line-height: 22px;
    .item_top {
      opacity: 0.45;
    }
    .item_bottom {
      font-size: 28px;
      letter-spacing: 0;
      text-align: center;
      line-height: 42px;
      padding-bottom: 24px;
    }
  }
}
.compileLecturerr_head_box {
  background-color: #fff;
  display: flex;
  padding: 24px;
  .imgBox {
    width: 480px;
    height: 270px;
    position: relative;
    border-radius: 4px;
    flex-shrink: 0;
    .icon {
      position: absolute;
      top: -33px;
      left: -33px;
      width: 0;
      height: 0;
      border: 34px solid rgba(213, 220, 254, 0);
      border-top: 34px solid #d5dcfe;
      transform: rotate(135deg);
    }
    .text {
      position: absolute;
      top: 7px;
      left: 4px;
      color: #000;
      transform: rotate(313deg);
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .rBox {
    width: 100%;
    padding-left: 24px;
    overflow: hidden;
    .rBox_title {
      font-size: 18px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
      line-height: 28px;
      font-weight: 600;
    }
    .title {
      margin-bottom: 40px;
    }
    .myicon {
      margin-left: 8px;
      width: 52px;
      height: 20px;
      background-color: #e7ffee;
      font-size: 12px;
      color: #00b061;
      line-height: 20px;
      text-align: center;
      display: inline-block;
      margin-bottom: 3px;
    }
    .text_title {
      display: inline-block;
      line-height: 22px;
      margin-right: 20px;
      flex-shrink: 0;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.45);
      letter-spacing: 0;
      line-height: 22px;
      font-weight: 400;
    }
    .text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
      line-height: 22px;
      font-weight: 400;
    }
    .colbox {
      margin-top: 8px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    & > ul li {
      display: flex;
      justify-content: space-between;
      & > div {
        width: 50%;
      }
    }
  }
}
.examination {
  .examination_head {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #333;
  }

  .examinee_list {
    background-color: #fff;
    margin-top: 20px;
    .litle_bar {
      font-size: 18px;
      padding: 25px 40px 0;
    }
  }
}
.courseEvaluation {
  padding-bottom: 60px;
  word-break: break-all;
  .score {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-bottom: 23px;
    span:first-of-type {
      font-weight: 600;
      padding-right: 20px;
      font-size: 18px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
      line-height: 24px;
      font-weight: 600;
    }
    span:last-of-type {
      padding-left: 10px;
    }
  }
  ul {
    margin-bottom: 24px;
    li {
      width: 800px;
      display: flex;
      margin-top: 40px;
      div {
        width: 100%;
        overflow: hidden;
      }
      img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 8px;
      }
      .content {
        .top {
          padding-bottom: 8px;
          span:first-of-type {
            font-size: 14px;
            color: rgba(0, 11, 21, 0.85);
            letter-spacing: 0;
            line-height: 22px;
            font-weight: 600;
            margin-right: 16px;
          }
          span:last-of-type {
            font-size: 12px;
            color: rgba(0, 11, 21, 0.45);
            letter-spacing: 0;
            line-height: 18px;
          }
        }
        .footer {
          padding-top: 8px;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.65);
          letter-spacing: 0;
          line-height: 22px;
          font-weight: 400;
        }
      }
    }
  }
  ::v-deep .el-pagination {
    display: flex;
    justify-content: flex-end;
  }
}
.courseContent {
  li {
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 48px;
    font-size: 14px;
    padding: 0 24px;
    border-top: 1px solid #ebeced;
    border-bottom: 1px solid #ebeced;
    span:nth-child(2) {
      margin-left: 20px;
    }
    span:last-of-type {
      float: right;
      visibility: hidden;
    }
    .centent {
      flex: 1;
      padding-right: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .index {
      width: 20px;
      text-align: center;
    }
  }
  li:hover span:last-of-type {
    visibility: visible;
  }
  li:hover {
    background: #f0f9ff;
    box-shadow: inset 0 -1px 0 0 rgba(0, 11, 21, 0.02);
  }
}
/deep/ .el-tabs__header.is-top {
  margin-bottom: 25px;
}
</style>
