<template>
  <div class="examination">
    <div class="examination_head">
      <i class="el-icon-arrow-left"></i>
      考试详情
    </div>
    <div class="examination_title">
      <div class="examination_title_h">
        JAVA编程考试

        <span v-if="showExamDetail.status === 1">未开始</span>
        <span v-if="showExamDetail.status === 2">进行中</span>
        <span v-if="showExamDetail.status === 3">已结束</span>
      </div>
      <el-row>
        <el-col :span="6">
          <span style="color:#333;">{{ '考试日期：' }}</span>
          <span>{{ showExamDetail.examTime }}</span>
        </el-col>
        <el-col :span="6">
          <span style="color:#333;">{{ '考试时间：' }}</span>
          <span>{{ showExamDetail.period }}</span>
        </el-col>
        <el-col :span="6">
          <span style="color:#333;">{{ '关联用卷：' }}</span>
          <span>{{ showExamDetail.examTime }}</span>
        </el-col>
        <el-col :span="6">
          <span style="color:#333;">{{ '评卷人：' }}</span>
          <span>{{ showExamDetail.reviewer }}</span>
        </el-col>
      </el-row>
    </div>

    <div class="examinee_list">
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
              <div>&nbsp; 考生列表</div>
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
                        123
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-popover>
              </div>
            </div>
          </template>

          <!-- 状态 -->
          <!-- （2：已通过；3：未通过；4：未考试；5：缺考） -->
          <template
            slot="examStatus"
            slot-scope="{ row }"
          >
            <span v-if="row.electiveType === 2">已通过</span>
            <span v-if="row.electiveType === 3">未通过</span>
            <span v-if="row.electiveType === 4">未考试</span>
            <span v-if="row.electiveType === 5">缺考</span>
          </template>

          <!-- 是否及格 -->
          <template
            slot="examPass"
            slot-scope="{ row }"
          >
            <span v-if="row.examPass === 0">不及格</span>
            <span v-if="row.examPass === 1">及格</span>
          </template>
        </common-table>
      </basic-container>
    </div>
  </div>
</template>

<script>
import { getCourseListData } from '@/api/course/course'
import { examDetail, examResult } from '@/api/training/training'

// 表格属性
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'stuName',
    minWidth: 80
  },
  {
    label: '手机号',
    prop: 'phone',
    minWidth: 150
  },
  {
    label: '所属部门',
    prop: 'deptName',
    minWidth: 180
  },
  {
    label: '状态',
    prop: 'examStatus',
    slot: true
  },
  {
    label: '完成时间',
    prop: 'examTime'
  },
  {
    label: '成绩',
    prop: 'examScore'
  },
  {
    label: '是否及格',
    prop: 'examPass',
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

  data() {
    return {
      showExamDetail: [],
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
      // query: {},
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [
        {
          isRecommend: 1,
          passCondition: 'c',
          catalogId: 4,
          teacherId: 4,
          isTop: 1,
          createId: 4,
          name: 'dd',
          electiveType: 2,
          id: 4,
          type: 2,
          createName: '小红'
        },
        {
          isRecommend: 1, //是否推荐课程（0:否；1：是）
          passCondition: 'a', //通过条件（前端为多选，用a,b,c,d,...组合）a:教师评定 ，b:考试通过，c:达到课程学时
          catalogId: 1, //	课程目录id
          teacherId: 1, //课程讲师id
          isTop: 0, //是否置顶（0：否；1：是）
          createId: 1, //创建人账号
          name: 'aa', //	课程名称
          electiveType: 1, //选修类型(1:开放选修 2:通过审批 3:禁止选修)
          id: 1, //	主键id
          type: 1, //课程类型(1:在线 2:面授 3:直播)
          createName: '初始用户' //创建人
        }
      ],
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },
  created() {
    this.refreshTableData()
    // this.loadData()
    this.getInfo()
    this.isExamDetail()
    this.isExamResult()
  },
  activated() {
    this.getInfo()
  },
  methods: {
    // 查询培训考试结果列表
    isExamResult(courseName) {
      let page = {
        pageNo: '',
        pageSize: '',
        status: ''
      }
      page.pageNo = this.page.currentPage
      page.pageSize = this.page.size
      let params = { ...page, ...courseName }
      params.status = this.status
      params.trainId = 1
      examResult(params).then((res) => {
        // console.log('examResult---',res)
        this.tableData = res.data
      })
    },

    // 查询培训考试安排详情
    isExamDetail() {
      // console.log('id', this.$route.query.id)
      let id = { examId: '1332136484077338626' }
      examDetail(id).then((res) => {
        // console.log(res)
        this.showExamDetail = res
      })
    },

    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.currentPage = param
      this.isExamResult()
    },
    handlePageSizeChange(param) {
      this.page.size = param
      this.isExamResult()
    },

    handleSearch(searchParams) {
      // this.loadTableData(_.pickBy(searchParams))
      this.isExamResult(searchParams)
      // console.log(searchParams)
    },

    // 刷新列表数据
    refreshTableData() {
      this.isExamResult()
    },

    // 拿数据
    getInfo(courseName) {
      // currentPage	当前页	body	true
      // size	页面显示数量	body	true
      // status	课程状态（1：已发布；2：草稿；3：停用）	body	true
      let params = {
        currentPage: '',
        size: '',
        status: ''
      }
      params = { ...this.page, ...courseName }
      params.status = this.status
      // console.log('params', params)
      getCourseListData(params).then((res) => {
        this.tableData = res
        this.page.total = res.length
        // window.console.log(res)
      })
    },
    // 导航
    showSelect(index) {
      this.status = index
      this.getInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
.examination {
  .examination_head {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #333;
  }
  .examination_title {
    background-color: #fff;
    padding: 30px 50px;
    .examination_title_h {
      margin-bottom: 15px;
      font-size: 16px;
      span {
        font-size: 10px !important;
        padding: 2px 5px;
        background-color: #cbf5e8;
        border-radius: 2px;
        color: #09666b;
        margin-left: 15px;
      }
    }
  }
  .examinee_list {
    background-color: #fff;
    margin-top: 20px;

    // 以下是拷贝过来的
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
    /deep/.page-wrap[data-v-793409ea] {
      margin-right: 70px;
    }
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
