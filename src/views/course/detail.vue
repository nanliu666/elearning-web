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
          v-show="userData.isRecommend == 1"
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
              <span
                v-if="userData.isPutaway"
                class="myicon"
              >已上架</span>
              <span
                v-else
                class="myicon"
              >已下架</span>
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
      <div class="litle_bar">
        学习情况
      </div>
      <detailList />
    </div>
  </div>
</template>

<script>
import { getCourseStudyDetail, getStudyList } from '@/api/course/course'
// 表格属性
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
    .litle_bar {
      font-size: 18px;
      font-weight: bold;
      padding: 25px 25px 0;
    }
  }
}
</style>
