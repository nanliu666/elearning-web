<template>
  <div class="course">
    <!-- 头部 -->
    <page-header title="课程管理">
      <el-button
        slot="rightMenu"
        size="medium"
        type="primary"
        @click="toEstablishCourse"
      >
        创建课程
      </el-button>
    </page-header>

    <!-- Dialog无数据 -->
    <div
      v-if="!tableData"
      id="isdialog_show"
    >
      <div>如何创建课程：</div>
      <div>1.先在 <span @click="toCatalog">【课程中心-分类管理】</span> 完善展示的分类配置；</div>
      <div>
        2.开始创建课程。
      </div>
      <i class="el-icon-close"></i>
    </div>

    <div class="course_in">
      <!-- 导航 -->
      <div class="select_bar">
        <span
          :class="{ select: status === 1 }"
          @click="showSelect(1)"
        >已发布</span>
        <span
          :class="{ select: status === 2 }"
          @click="showSelect(2)"
        >草稿</span>
      </div>

      <!-- 内容 -->
      <div class="draft">
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
                  <span
                    class="text_refresh"
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

            <template #multiSelectMenu="{ selection }">
              <el-button
                style="margin-bottom:0;"
                type="text"
                @click="() => handleRemoveItems(selection)"
              >
                批量删除
              </el-button>
            </template>
            <!-- //序号 -->
            <template
              slot="index"
              slot-scope="{ row }"
            >
              <span>{{ tableData.indexOf(row) + 1 }}</span>
            </template>

            <!-- 课程名称 -->
            <template
              slot="courseName"
              slot-scope="{ row }"
            >
              <el-button
                type="text"
                @click="todetail(row)"
              >
                {{ row.courseName }}
              </el-button>
            </template>
            <!-- 课程类型 -->
            <template
              slot="courseType"
              slot-scope="{ row }"
            >
              <span v-if="row.courseType === 1">在线课程</span>
              <span v-if="row.courseType === 2">面授课程</span>
              <span v-if="row.courseType === 3">直播课程</span>
            </template>
            <!-- //通过条件（前端为多选，用a,b,c,d,...组合）a:教师评定 ，b:考试通过，c:达到课程学时 -->
            <template
              slot="passCondition"
              slot-scope="{ row }"
            >
              <span v-if="row.passCondition === 'a'">教师评定</span>
              <span v-if="row.passCondition === 'b'">考试通过</span>
              <span v-if="row.passCondition === 'c'">达到课程学时</span>
            </template>
            <!-- electiveType: 2, //选修类型 (1:开放选修 2:通过审批 3:禁止选修) -->
            <template
              slot="electiveType"
              slot-scope="{ row }"
            >
              <span v-if="row.electiveType === 1">开放选修</span>
              <span v-if="row.electiveType === 2">通过审批</span>
              <span v-if="row.electiveType === 3">禁止选修</span>
            </template>
            <!-- 标签 -->
            <!-- <template slot="atags" slot-scope="{ row }">
              s
              <span v-for="(item, index) in row.atags" :key="index" class="atags_icon">{{
                item
              }}</span>
            </template> -->
            <!-- // isRecommend: 1, //是否推荐课程（0:否；1：是） -->
            <template
              slot="isRecommend"
              slot-scope="{ row }"
            >
              <span v-if="row.isRecommend === 0">否</span>
              <span v-if="row.isRecommend === 1">是</span>
            </template>
            <!-- // isPutaway	是否上架 (0：下架；1：上架) -->
            <template
              slot="isPutaway"
              slot-scope="{ row }"
            >
              <span v-if="row.isPutaway === 0">下架</span>
              <span v-if="row.isPutaway === 1">上架</span>
            </template>

            <!-- isTop: 0, //是否置顶（0：否；1：是） -->
            <template
              slot="handler"
              slot-scope="scope"
            >
              <el-button
                v-if="scope.row.isTop == 0"
                type="text"
                size="medium"
                @click.stop="handleConfig(scope.row, 1)"
              >
                &nbsp;&nbsp; 置顶&nbsp;
              </el-button>
              <el-button
                v-if="scope.row.isTop == 1"
                type="text"
                size="medium"
                @click.stop="handleConfig(scope.row, 0)"
              >
                已置顶
              </el-button>
              <span style="color: #a0a8ae;"> &nbsp;&nbsp;|&nbsp;</span>
              <el-button
                v-if="scope.row.isPutaway === 1"
                type="text"
                size="medium"
                @click="alterIsPutaway(scope.row.id, 0)"
              >
                下架
              </el-button>
              <el-button
                v-if="scope.row.isPutaway === 0"
                type="text"
                size="medium"
                @click="alterIsPutaway(scope.row.id, 1)"
              >
                上架
              </el-button>
              <span style="color: #a0a8ae;"> &nbsp;&nbsp;|&nbsp;</span>
              <el-dropdown
                trigger="hover"
                style="color: #a0a8ae;"
                @command="handleCommand($event, scope.row)"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="edit">
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item command="del">
                    删除
                  </el-dropdown-item>
                  <el-dropdown-item command="move">
                    移动
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </common-table>
        </basic-container>
      </div>
    </div>

    <el-dialog
      title="移动目录"
      :visible.sync="dialogFormVisible"
      append-to-body
      width="500px"
    >
      <div style="margin-bottom: 15px">
        所在目录：{{ moveKnowledgeRow.catalogName }}
      </div>
      <common-form
        ref="form"
        :columns="formColumns"
        :model="formData"
      >
      </common-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="isMoveCourse"
        >
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCourseListData,
  delCourseInfo,
  putawayOperate,
  getCatalog,
  updateCourseTop,
  moveCourse
} from '@/api/course/course'

// 表格属性
const TABLE_COLUMNS = [
  {
    label: '序号',
    prop: 'index',
    width: '70',
    slot: true
  },
  {
    label: '课程名称',
    minWidth: 140,
    prop: 'courseName',
    slot: true
  },
  {
    label: '讲师',
    prop: 'teacherName'
  },
  {
    label: '状态',
    prop: 'isPutaway',
    slot: true
  },
  {
    label: '所在分类',
    prop: 'catalogName'
  },
  {
    label: '课程类型',
    prop: 'type',
    slot: true
  },
  {
    label: '通过条件',
    prop: 'passCondition',
    slot: true
  },
  {
    label: '选修类型',
    prop: 'electiveType',
    slot: true
  },

  // {
  //   label: '标签',
  //   prop: 'atags',
  //   slot: true
  // },
  {
    label: '是否推荐',
    prop: 'isRecommend',
    slot: true
  },
  {
    label: '创建人',
    prop: 'creatorName'
  },
  {
    label: '更新时间',
    prop: 'updateTime'
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 200
  },
  enableMultiSelect: true,
  enablePagination: true,
  showHandler: true,
  showIndexColumn: false

  // 树形结构懒加载
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '请输入课程名称搜索' },
    data: '',
    field: 'courseName',
    label: '',
    type: 'input'
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'isPutaway',
    label: '状态',
    type: 'select',
    options: [
      { value: 0, label: '下架' },
      { value: 1, label: '上架' },
      { value: '', label: '全部' }
    ]
  },
  {
    data: '',
    field: 'teacherName',
    label: '讲师',
    type: 'select',
    options: [],
    config: { optionLabel: 'teacherName', optionValue: 'teacherName', placeholder: '请选择' }
  },
  {
    data: '',
    field: 'catalogName',
    label: '所在分类',
    type: 'select',
    options: [],
    config: { optionLabel: 'catalogName', optionValue: 'catalogName', placeholder: '请选择' }
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'courseType',
    label: '课程类型',
    type: 'select',
    options: [
      { value: 1, label: '在线课程' },
      { value: 2, label: '面授课程' },
      { value: 3, label: '直播课程' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'passCondition',
    label: '通过条件',
    type: 'select',
    options: [
      { value: 'a', label: '教师评定' },
      { value: 'b', label: '考试通过' },
      { value: 'c', label: '达到课程学时' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'electiveType',
    label: '选修类型',
    type: 'select',
    options: [
      { value: 1, label: '开放选修' },
      { value: 2, label: '通过审批' },
      { value: 3, label: '禁止选修' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'isRecommend',
    label: '是否推荐',
    type: 'select',
    options: [
      { value: 1, label: '是' },
      { value: 0, label: '否' }
    ]
  },
  {
    data: '',
    field: 'creatorName',
    label: '创建人',
    type: 'select',
    options: [],
    config: { optionLabel: 'creatorName', optionValue: 'creatorName', placeholder: '请选择' }
  }
  // {
  //   config: { placeholder: '请选择' },
  //   data: '',
  //   field: 'tags',
  //   label: '标签',
  //   type: 'select',
  //   options: [
  //     { value: 1, label: '标签1' },
  //     { value: 2, label: '标签2' },
  //     { value: 3, label: '标签3' }
  //   ]
  // }
]
const SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
const FORM_COLUMNS = [
  {
    label: '移动到新目录',
    itemType: 'treeSelect',
    prop: 'catalogId',
    required: true,
    span: 24,
    props: {
      selectParams: {
        placeholder: '请选择所在目录',
        multiple: false
      },
      treeParams: {
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        data: [],
        filterable: false,
        props: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        required: true
      }
    }
  }
]
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
      formData: {
        catalogId: ''
      },
      formColumns: FORM_COLUMNS,
      moveKnowledgeRow: {},
      // 移动数据
      CourseNameBarData: [], //显示
      CourseNameBar: [],
      moveId: '',
      // 移动dialog
      dialogFormVisible: false,
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

      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
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
        }
      ],
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },
  created() {
    this.refreshTableData()
    // this.loadData()
    this.getInfo()
    this.isgetCatalog()
  },
  activated() {
    // this.loadData()
    this.getInfo()
  },
  methods: {
    // 去详情
    todetail() {
      // console.log(row)
      this.$router.push({ path: '/course/detail' })
    },

    // 打开移动弹窗
    moveFun(row) {
      this.dialogFormVisible = true
      this.moveKnowledgeRow = row
    },

    toEstablishCourse() {
      this.$router.push({ path: '/course/establishCourse' })
    },
    // 移动
    // isMoveCourse() {
    //   let params = {
    //     catalogId: this.CourseNameBar[this.CourseNameBar.length - 1], //目录课程
    //     courseId: this.moveId //课程
    //   }
    //   moveCourse(params).then(() => {
    //     this.dialogFormVisible = false
    //   })
    // },
    // 保存移动
    async isMoveCourse() {
      this.$refs.form.validate().then((data) => {
        if (data) {
          this.dialogFormVisible = false
          moveCourse({
            courseId: this.moveKnowledgeRow.id,
            catalogId: this.formData.catalogId
          }).then(() => {
            this.$message.success('移动成功')
            this.getInfo()
          })
        }
      })
    },
    // 拿到移动数据
    getCategoryList() {
      return getCatalog().then((res) => {
        return _.concat(
          [
            {
              id: '',
              name: '全部'
            }
          ],
          res
        )
      })
    },
    async isgetCatalog() {
      // getCatalog().then((res) => {
      //   // console.log(res)
      //   this.CourseNameBarData = res
      // })

      let catalogId = _.find(this.searchPopoverConfig.popoverOptions, { field: 'catalogId' })
      let moveCatalogId = _.find(this.formColumns, { prop: 'catalogId' })
      // let tagId = _.find(this.searchPopoverConfig.popoverOptions, { field: 'tagId' })
      // if (tagId) {
      //   getKnowledgeManageTaglist().then(
      //     (res) =>
      //       (tagId.options = _.concat(
      //         [
      //           {
      //             id: '',
      //             name: '全部'
      //           }
      //         ],
      //         res
      //       ))
      //   )
      // }
      let catalogList = await this.getCategoryList()
      if (catalogId) {
        catalogId.config.treeParams.data = catalogList
      }
      if (moveCatalogId) {
        moveCatalogId.props.treeParams.data = _.drop(catalogList)
      }
    },
    // 移动data
    handleChange() {
      // console.log(val)
      // console.log(this.CourseNameBar)
    },

    toTrainDetail() {
      // console.log(row)
      // this.$router.push('')
    },

    // 上架&下架
    alterIsPutaway(id, i) {
      // console.log({ id })
      let lang = ''
      if (!i) {
        lang = '您确定要下架该课程吗？下架后，该课程将不能访问。'
      } else {
        lang = '您确定要上架该课程吗？'
      }
      this.$confirm(lang, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          putawayOperate({ courseIds: [id], choice: i }).then(() => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getInfo()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '操作已取消'
          })
        })
    },

    // 去目录管理
    toCatalog() {
      this.$router.push({ path: '/course/catalog' })
    },
    // isTop: 0, //是否置顶（0：否；1：是）
    handleConfig(row, i) {
      // console.log({ courseId: row.id, choice: i })
      updateCourseTop({ courseId: row.id, choice: i }).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getInfo()
      })
    },
    // 编辑&删除&移动
    handleCommand(e, row) {
      if (e === 'edit') {
        // 去编辑
        this.$router.push({ path: '/course/compileCourse?id=' + row.id })
      }
      if (e === 'del') {
        // 删除
        this.$confirm('此操作将删除该课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delCourseInfo({ courseIds: row.id }).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getInfo()
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
        // this.dialogFormVisible = true
        // this.moveId = row.id
        this.moveFun(row)
      }
    },
    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.pageNo = param
      this.getInfo()
    },
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.getInfo()
    },

    handleSearch(searchParams) {
      this.getInfo(searchParams)
    },

    handleRemoveItems(selection) {
      // 批量删除
      let params = ''
      selection.forEach((item) => {
        params += item.id + ','
      })
      this.$confirm('此操作将删除选中课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delCourseInfo({ courseIds: params }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$refs.table.clearSelection()
            this.getInfo()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      this.refreshTableData()
    },

    // 刷新列表数据
    refreshTableData() {
      this.getInfo()
    },

    // 去重
    arrayUnique(arr, name) {
      var hash = {}
      return arr.reduce(function(item, next) {
        hash[next[name]] ? '' : (hash[next[name]] = true && item.push(next))
        return item
      }, [])
    },

    // 拿数据
    getInfo(courseName) {
      let params = {
        currentPage: '',
        size: '',
        status: ''
      }
      params = { ...this.page, ...courseName }
      params.status = this.status
      getCourseListData(params).then((res) => {
        this.tableData = res.data
        this.page.total = res.totalNum
        // 下拉筛选框
        let data1 = JSON.parse(JSON.stringify(res.data))
        data1 = this.arrayUnique(data1, 'teacherName')
        SEARCH_POPOVER_POPOVER_OPTIONS[1].options = []
        let data2 = JSON.parse(JSON.stringify(res.data))
        data2 = this.arrayUnique(data2, 'catalogName')
        SEARCH_POPOVER_POPOVER_OPTIONS[2].options = []
        let data7 = JSON.parse(JSON.stringify(res.data))
        data7 = this.arrayUnique(data7, 'creatorName')
        SEARCH_POPOVER_POPOVER_OPTIONS[7].options = []
        SEARCH_POPOVER_POPOVER_OPTIONS[1].options.push(...data1)
        SEARCH_POPOVER_POPOVER_OPTIONS[2].options.push(...data2)
        SEARCH_POPOVER_POPOVER_OPTIONS[7].options.push(...data7)
        // this.tableData.forEach((item) => {
        //   SEARCH_POPOVER_POPOVER_OPTIONS[1].options.push({
        //     value: item.teacherName,
        //     label: item.teacherName
        //   }) //讲师
        //   SEARCH_POPOVER_POPOVER_OPTIONS[2].options.push({
        //     value: item.catalogName,
        //     label: item.catalogName
        //   }) //所在目录
        //   SEARCH_POPOVER_POPOVER_OPTIONS[7].options.push({
        //     value: item.creatorName,
        //     label: item.creatorName
        //   }) //创建人
        // })
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
.atags_icon {
  display: inline-block;
  padding: 5px;
  background-color: #ccc;
  margin-left: 10px;
}
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
      cursor: pointer;
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
