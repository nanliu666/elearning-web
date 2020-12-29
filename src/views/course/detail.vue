<template>
  <div class="examination">
    <page-header
      title="学习情况"
      show-back
    />

    <div class="compileLecturerr_head_box">
      <div class="imgBox">
        <img
          :src="userData.url"
          alt=""
        />
        <div
          v-show="userData.isRecommend"
          class="icon"
        >
          推荐
        </div>
      </div>
      <div class="rBox">
        <el-row>
          <el-col :span="12">
            <div>
              <span class="rBox_title">{{ userData.name }}</span>
              <span class="myicon">{{ userData.isRecommend ? '已上架' : '已上架' }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="colbox">
              <span class="text_title">讲师：</span>
              <span class="text">{{ userData.teacherName }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="colbox">
              <span class="text_title">所在目录：</span>
              <span class="text">{{ userData.catalogName }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="colbox">
              <span class="text_title">课程类型：</span>
              <span
                v-show="userData.type == 1"
                class="text"
              >在线课程</span>
              <span
                v-show="userData.type == 2"
                class="text"
              >面授课程</span>
              <span
                v-show="userData.type == 3"
                class="text"
              >直播课程</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="colbox">
              <span class="text_title">学时（小时）：</span>
              <span class="text">{{ userData.period }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="colbox">
              <span class="text_title">学分：</span>
              <span class="text">{{ userData.credit }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="colbox">
              <span class="text_title">通过条件：</span>
              <span
                v-show="userData.passCondition == 'a'"
                class="text"
              >教师评定</span>
              <span
                v-show="userData.passCondition == 'b'"
                class="text"
              >考试通过</span>
              <span
                v-show="userData.passCondition == 'c'"
                class="text"
              >达到课程学时</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="colbox">
              <span class="text_title">选修类型：</span>
              <span
                v-show="userData.electiveType == 1"
                class="text"
              >开放选修</span>
              <span
                v-show="userData.electiveType == 2"
                class="text"
              >通过审批</span>
              <span
                v-show="userData.electiveType == 3"
                class="text"
              >禁止选修</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="data_bar_box">
      <div class="data_bar">
        <div class="bar_item">
          <div class="item_top">
            学习人数
          </div>
          <div class="item_bottom">
            {{ userData.studyPeople }}
          </div>
        </div>
        <div class="bar_item">
          <div class="item_top">
            完成人数
          </div>
          <div class="item_bottom">
            {{ userData.finishPeople }}
          </div>
        </div>
        <div class="bar_item">
          <div class="item_top">
            收藏人数
          </div>
          <div class="item_bottom">
            {{ userData.collectedPeople }}
          </div>
        </div>
        <div class="bar_item">
          <div class="item_top">
            评论人数
          </div>
          <div class="item_bottom">
            {{ userData.commentPeople }}
          </div>
        </div>
        <div class="bar_item">
          <div class="item_top">
            评分
          </div>
          <div class="item_bottom">
            {{ userData.scope }}
          </div>
        </div>
      </div>
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
              <div class="table_title">
                &nbsp; 学习人员列表
              </div>
              <div class="operations__btns">
                <el-tooltip
                  class="operations__btns--tooltip"
                  content="刷新"
                  effect="dark"
                  placement="top"
                  style="color:#acb3b8;"
                  @click="refreshTableData"
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
                <span
                  class="text_refresh"
                  style="cursor:pointer;"
                  @click="refreshTableData"
                >刷新</span>
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

          <!-- 状态 -->
          <!-- （2：已通过；3：未通过；4：未考试；5：缺考） -->
          <template
            slot="examStatus"
            slot-scope="{ row }"
          >
            <el-progress :percentage="row.examStatus"></el-progress>
          </template>

          <!-- 是否及格 -->
          <!-- <template slot="examPass" slot-scope="{ row }">
            <span v-if="row.examPass === 0">不及格</span>
            <span v-if="row.examPass === 1">及格</span>
          </template> -->
        </common-table>
      </basic-container>
    </div>
  </div>
</template>

<script>
import { getCourseStudyDetail, getStudyList } from '@/api/course/course'
// 表格属性
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
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
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
  created() {
    this.getUserList()
  },
  activated() {
    this.getUserList()
    this.getInfo()
  },
  methods: {
    async getInfo() {
      this.userData = await getCourseStudyDetail({ courseId: this.$route.query.id })
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
  padding: 0 24px;
  background-color: #fff;
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
    width: 320px;
    height: 180px;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    .icon {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 40px;
      height: 20px;
      background-color: #fff;
      background: #fcba00;
      border-radius: 4px;
      font-size: 12px;
      color: #ffffff;
      line-height: 20px;
      text-align: center;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .rBox {
    flex: 1;
    margin-left: 40px;
    .rBox_title {
      opacity: 0.85;
      font-size: 16px;
      color: #000b15;
      letter-spacing: 0;
      line-height: 24px;
      font-weight: bold;
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
      width: 98px;
      display: inline-block;
      opacity: 0.45;
      font-size: 14px;
      color: #000b15;
      letter-spacing: 0;
      line-height: 22px;
    }
    .text {
      opacity: 0.85;
      font-size: 14px;
      color: #000b15;
      letter-spacing: 0;
      line-height: 22px;
    }
    .colbox {
      margin-top: 8px;
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
