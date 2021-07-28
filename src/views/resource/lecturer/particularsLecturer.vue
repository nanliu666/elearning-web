<template>
  <div
    v-if="teacherData"
    class="compileLecturer"
  >
    <page-header
      title="讲师详情"
      :back="() => toLecturer()"
      show-back
    />

    <div class="compileLecturerr_head_box">
      <div class="head_box_img">
        <img
          :src="teacherImg"
          alt=""
        />
        <div
          v-if="teacherData.isRecommend === 1"
          class="in_img_icon"
        >
          推荐
        </div>
      </div>
      <div class="head_box_content">
        <el-row>
          <el-col
            :span="24"
            style="color: #333; font-size: 18px"
          >
            {{ name ? name : '--' }}
            <span
              v-if="teacherData.status == 1"
              style="margin-left: 10px"
              class="box_content_icon content_icon1"
            >正常</span>
            <span
              v-if="teacherData.status == 0"
              style="margin-left: 10px"
              class="box_content_icon content_icon2"
            >冻结</span>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="5"
            style="color: #898989"
          >
            联系方式:
          </el-col>
          <el-col :span="7">
            {{ teacherData.phonenum ? teacherData.phonenum : '--' }}
          </el-col>
          <el-col
            :span="5"
            style="color: #898989"
          >
            讲师类型:
          </el-col>
          <el-col :span="7">
            {{ teacherData.teacherType ? teacherType[+teacherData.teacherType] : '--' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="5"
            style="color: #898989"
          >
            性别:
          </el-col>
          <el-col :span="7">
            <span v-if="teacherData.sex === '1'">男</span>
            <span v-else-if="teacherData.sex === '0'">女</span>
            <span v-else>--</span>
          </el-col>
          <el-col
            :span="5"
            style="color: #898989"
          >
            专业分类:
          </el-col>
          <el-col :span="7">
            <span>{{
              teacherData.professionalCata ? professionalCata[+teacherData.professionalCata] : '--'
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="5"
            style="color: #898989"
          >
            讲师等级:
          </el-col>
          <el-col :span="7">
            {{ teacherData.teacherLevel ? teacherLevel[+teacherData.teacherLevel] : '--' }}
          </el-col>
          <el-col
            :span="5"
            style="color: #898989"
          >
            聘用类型:
          </el-col>
          <el-col :span="7">
            {{ teacherData.type ? type[+teacherData.type] : '--' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="5"
            style="color: #898989"
          >
            授课课时费(元):
          </el-col>
          <el-col :span="7">
            {{ teacherData.courseCost }}
          </el-col>
          <el-col
            :span="5"
            style="color: #898989"
          >
            讲师职称:
          </el-col>
          <el-col :span="7">
            {{ teacherData.teacherTitle ? teacherTitle[+teacherData.teacherTitle] : '--' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="5"
            style="color: #898989"
          >
            擅长领域：
          </el-col>
          <el-col :span="7">
            <div class="skilledFields">
              <span
                v-for="(item, index) in teacherData.skilledFields"
                :key="index"
                class="box_content_icon"
              >{{ item }}</span>
            </div>
          </el-col>
          <el-col
            :span="5"
            style="color: #898989"
          >
            评分:
          </el-col>
          <el-col :span="7">
            <el-rate
              v-model="teacherData.teacherScore"
              :score-template="`${teacherData.teacherScore}分`"
              show-score
              disabled
            ></el-rate>
          </el-col>
        </el-row>
      </div>
      <div class="head_box_btns">
        <el-button
          type="primary"
          size="medium"
          @click="tocompileLecturer"
        >
          编辑
        </el-button>
        <el-button
          v-show="teacherData.status == 1"
          size="medium"
          @click="iseditSysRulus(0)"
        >
          冻结
        </el-button>
        <el-button
          v-show="teacherData.status == 0"
          size="medium"
          type="primary"
          @click="iseditSysRulus(1)"
        >
          解冻
        </el-button>
        <el-button
          size="medium"
          @click="isTeacherdelete"
        >
          删除
        </el-button>
      </div>
    </div>
    <basic-container style="margin-top: 20px">
      <el-menu
        :default-active="activeIndex"
        style="margin-top: -20px"
        class="el-menu-demo"
        :active-text-color="activeColor"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="0">
          讲师介绍
        </el-menu-item>
        <el-menu-item index="1">
          授课情况
        </el-menu-item>
      </el-menu>
      <div style="padding: 20px; min-height: 32vh">
        <div
          v-if="activeIndex === '0'"
          class="ntroduce_content"
        >
          <div v-html="teacherData.introduction"></div>
        </div>
        <common-table
          v-if="activeIndex === '1'"
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
          <template #index="{ $index }">
            {{ $index + 1 }}
          </template>
          <template #courseName="{ row }">
            <el-link
              type="primary"
              @click="toClassInfo(row.id)"
            >
              {{ row.courseName }}
            </el-link>
          </template>
          <template
            slot="multiSelectMenu"
            slot-scope="{ selection }"
          >
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="exportSelected(selection)"
            >
              批量导出
            </el-button>
          </template>
        </common-table>
      </div>
    </basic-container>
    <!-- 停用弹框 -->
    <el-dialog
      title="提醒"
      :visible.sync="blockDialogVisible"
      append-to-body
      width="420px"
    >
      <div class="dialog_box">
        <i class="el-icon-warning dialog_box_icon-warning"></i>
        <span>您选中讲师名下有正在进行或未开始的面授课程或线下培训，
          <span>{{ showBtnDel ? '删除' : '停用' }}</span>后需尽快对课程进行调整。 你确定要<span>{{ showBtnDel ? '删除' : '停用' }}</span>该讲师吗？</span>
        <div>
          <div
            class="showBtn"
            @click="showBtnData = !showBtnData"
          >
            查看关联课程 <i
              v-show="!showBtnData"
              class="el-icon-arrow-down"
            ></i>
            <i
              v-show="showBtnData"
              class="el-icon-arrow-up"
            ></i>
          </div>
          <div
            v-for="(item, index) in CourseList"
            v-show="showBtnData"
            :key="index"
            class="item_box"
          >
            {{ item.courseName }}
          </div>
        </div>
      </div>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="blockDialogVisible = false">
          取 消
        </el-button>
        <el-button
          v-show="!showBtnDel"
          type="primary"
          @click="RulusFn(0)"
        >
          确 定
        </el-button>
        <el-button
          v-show="showBtnDel"
          type="primary"
          @click="TeacherdeleteFn()"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCourseListData } from '@/api/course/course'
import { getTeacher, Teacherdelete, editSysRulus, getCourseList } from '@/api/lecturer/lecturer'
import SearchPopover from '@/components/searchPopOver/index'
import styles from '@/styles/variables.scss'
import { classList } from '@/api/course/course'
const TABLE_COLUMNS = [
  {
    label: '课程编号',
    prop: 'rowNum',
    minWidth: 80
  },
  {
    label: '课程名称',
    prop: 'courseName',
    slot: true,
    minWidth: 150
  },
  {
    label: '所在分类',
    prop: 'catalogName',
    formatter: (row) => (row.catalogName ? row.catalogName : '--'),
    slot: true,
    minWidth: 120
  },
  {
    label: '课程类型',
    prop: 'typeName',
    minWidth: 120
  },
  {
    label: '授课时间',
    slot: true,
    prop: 'courseTime',
    formatter: (row) => (row.courseTime ? row.courseTime : '--'),
    minWidth: 120
  }
]
const TABLE_CONFIG = {
  showHandler: false,
  showIndexColumn: false,
  enablePagination: true,
  handlerColumn: {
    minWidth: 150
  }
}
const SEARCH_CONFIG = {
  requireOptions: [
    {
      type: 'input',
      field: 'courseName',
      label: '',
      data: '',
      options: [],
      config: { placeholder: '请输入课程名称搜索', 'suffix-icon': 'el-icon-search' }
    }
  ],
  popoverOptions: [
    {
      type: 'treeSelect',
      field: 'catalogId',
      label: '所在分类',
      data: '',
      config: {
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
            label: 'name',
            disabled: 'disabled',
            value: 'id'
          }
        }
      }
    },
    {
      type: 'select',
      field: 'courseType',
      label: '课程类型',
      data: '',
      options: [
        { label: '全部', value: '' },
        { label: '在线', value: 1 },
        { label: '面授', value: 2 },
        { label: '直播', value: 3 }
      ]
    },
    {
      type: 'dataPicker',
      label: '日期范围',
      data: '',
      field: 'startTime,endTime',
      config: {
        type: 'datetimerange',
        'range-separator': '至',
        'value-format': 'yyyy-MM-dd HH:mm:ss'
      }
    }
  ]
}
export default {
  components: { SearchPopover },
  data() {
    return {
      CourseList: '',
      blockDialogVisible: false,
      showBtnData: false,
      showBtnDel: false,
      activeIndex: '0',
      activeColor: styles.primaryColor,
      tableLoading: false,
      tableData: [],
      tablePageConfig: {},
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS,
      searchConfig: SEARCH_CONFIG,
      teacherType: ['内部讲师', '外部讲师'],
      professionalCata: ['--', '技术类', '管理类', '营销类', '技能类'],

      teacherLevel: ['预备级', '助理级', '初级', '中级', '高级', '资深级', '专家级', '非讲师'],
      type: ['--', '内训', '外聘'],
      teacherTitle: ['--', '助理级', '初级', '中级', '高级', '研究员级', '无'],
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      queryInfo: {
        teacherId: this.$route.query.user_id_str,
        pageNo: 1,
        pageSize: 10,
        courseName: '',
        courseType: '',
        catalogId: '',
        startTime: '',
        endTime: ''
      },
      teacherData: null,
      name: ''
    }
  },
  computed: {
    teacherImg() {
      return this.teacherData.photo
        ? this.teacherData.photo
        : require('@/assets/images/defaultTeacher.png')
    }
  },
  created() {
    this.isgetTeacher()
  },
  activated() {
    this.isgetTeacher()
    this.loadTableData()
    let categoryIdType = _.find(this.searchConfig.popoverOptions, { field: 'catalogId' })
    classList().then((res) => {
      categoryIdType.config.treeParams.data = _.concat(
        [
          {
            name: '全部',
            id: ''
          }
        ],
        res
      )
    })
  },
  methods: {
    toClassInfo(id) {
      this.$router.push({
        path: '/course/detail',
        query: {
          id
        }
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
    /**
     * 处理nav切换
     */
    handleSelect(key) {
      this.activeIndex = key
    },
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableData = []
        this.tableLoading = true
        let { totalNum, data } = await getCourseList(this.queryInfo)
        this.tableData = data
        this.page.total = totalNum
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.tableLoading = false
      }
    },
    // 删除讲师fn
    TeacherdeleteFn() {
      let params = {
        ids: this.$route.query.id
      }
      Teacherdelete(params).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.toLecturer()
        this.blockDialogVisible = false
      })
    },

    // 删除讲师按钮
    isTeacherdelete(id) {
      getCourseListData({ teacherId: this.teacherData.userId, pageNo: 1, pageSize: 999 }).then(
        (res) => {
          // 过滤在线课程
          let countIndex = 0
          res.data.map((item) => {
            if (item.type == 1) {
              // 在线课程
              ++countIndex
            }
          })
          // 如果没有课程&在线课程
          if (res.data.length == 0 || res.data.length == countIndex) {
            this.$confirm('您确定要删除该讲师吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.TeacherdeleteFn(id)
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
          } else {
            // 如果有课程
            this.blockDialogVisible = true
            // teacherId
            this.CourseList = res.data
            this.showBtnDel = true
          }
        }
      )
    },
    // 启动/停用方法
    RulusFn(i) {
      let params = {
        id: '',
        status: '' // '0 停用 1 正常',
      }
      params.id = this.$route.query.id
      params.status = i
      editSysRulus(params).then(() => {
        this.$message({
          message: `${i ? '解冻' : '冻结'}成功`,
          type: 'success'
        })
        //刷新
        this.isgetTeacher()
        this.blockDialogVisible = false
      })
    },

    // 启动/停用按钮
    iseditSysRulus(i) {
      // 启用弹框
      if (i) {
        this.$confirm('您确定要解冻该讲师吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.RulusFn(i)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        // 停用弹框
        // 先查讲师下面有没有课程
        // 再弹框

        getCourseListData({ teacherId: this.teacherData.userId, pageNo: 1, pageSize: 999 }).then(
          (res) => {
            // 过滤在线课程
            let countIndex = 0
            res.data.map((item) => {
              if (item.type == 1) {
                // 在线课程
                ++countIndex
              }
            })
            // 如果没有课程&在线课程
            if (res.data.length == 0 || res.data.length == countIndex) {
              this.$confirm('您确定要冻结该讲师吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {
                  this.RulusFn(i)
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  })
                })
            } else {
              // 如果有课程
              this.blockDialogVisible = true
              this.CourseList = res.data
              this.showBtnDel = false
            }
          }
        )
      }
    },

    // 去编辑
    tocompileLecturer() {
      let row = {}
      row.idStr = this.$route.query.id
      row.name = this.$route.query.name
      row.user_email = this.$route.query.userEmail
      row.sex = this.$route.query.sex
      row.phonenum = this.$route.query.phonenum
      row.user_id_str = this.$route.query.user_id_str

      this.$router.push({
        path: '/resource/lecturer/compileLecturer',
        query: {
          id: row.idStr,
          name: row.name,
          userEmail: row.user_email,
          sex: row.sex,
          phonenum: row.phonenum,
          user_id_str: row.user_id_str
        }
      })
    },
    // 去讲师列表
    toLecturer() {
      this.$router.push({ path: '/resource/lecturer/lecturer' })
    },
    // 拿数据
    isgetTeacher() {
      let params = { id: '' }
      params.id = this.$route.query.id
      params.id = params.id.trim()
      this.name = this.$route.query.name
      getTeacher(params).then((res) => {
        this.teacherData = res.teacherInfo
        this.teacherData.teacherScore =
          this.teacherData.teacherScore === '' ? 0 : this.teacherData.teacherScore
        this.teacherData.introduction = _.unescape(this.teacherData.introduction)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-menu--horizontal {
  border-bottom: 1px solid #cccccc !important;
}
.dialog-footer {
  display: flex;
  padding-left: 25%;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
.dialog_box {
  padding: 0 10px;
  color: #606266;
  font-size: 14px;
  .dialog_box_icon-warning {
    color: #e6a23c;
    font-size: 24px !important;
    margin-right: 12px;
  }
  .showBtn {
    color: #227ffa;
    margin-top: 20px;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .item_box {
    color: #606266;
    margin-top: 5px;
  }
}
.compileLecturer {
  .compileLecturerr_head {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  .compileLecturerr_head_box {
    padding: 25px 20px;
    background-color: #fff;
    display: flex;
    .head_box_img {
      margin: 15px 0;
      position: relative;
      overflow: hidden;
      padding-right: 55px;
      width: 400px;
      height: 220px;
      img {
        width: 100%;
        height: 100%;
      }
      .in_img_icon {
        position: absolute;
        top: 8px;
        right: 63px;
        // background-color: #d6dcff;
        // width: 137px;
        // height: 57px;
        // color: #090e7a;
        // line-height: 76px;
        // text-align: center;
        // transform: rotate(-45deg);
        // font-size: 16px;
        background: #fcba00;
        border-radius: 4px;
        width: 40px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: 12px;
        color: #ffffff;
      }
    }
    .head_box_content {
      width: 55%;
      margin: 20px 25px 0 55px;
      font-size: 16px;
      /deep/ .el-row {
        margin-top: 12px;
      }
      .box_content_icon {
        padding: 5px 12px;
        color: #666;
        margin-right: 15px;
        font-size: 12px;
        border-radius: 2px;
        background-color: #f0f2f4;
      }
      .content_icon1 {
        background-color: #cbf5e8;
        color: #09666b;
      }
      .content_icon2 {
        background-color: #ffe0db;
        color: #cf637c;
      }
      .content_icon3 {
        background-color: #c4e6ff;
      }
    }
    .head_box_btns {
      width: 20%;
      display: flex;
      justify-content: flex-end;
      height: 35px;
    }
  }
  .compileLecturerr_introduce {
    padding: 24px;
    background-color: #fff;
    margin-top: 25px;
    .introduce_title {
      font-size: 18px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
    }
    .ntroduce_content {
      padding-top: 16px;
    }
    .ntroduce_img {
      padding: 0 45px;
    }
  }
  .skilledFields {
    display: flex;
    flex-wrap: wrap;
    .box_content_icon {
      flex-shrink: 0;
    }
  }
}
</style>
