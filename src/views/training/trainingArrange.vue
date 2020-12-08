<template>
  <div class="trainingArrange">
    <div class="box_title">
      <div class="title">
        培训安排
      </div>
      <div>
        <el-button
          type="primary"
          size="small"
          @click="goAdd"
        >
          &nbsp; 创建培训 &nbsp;
        </el-button>
      </div>
    </div>

    <div class="box_content">
      <div class="content_nav">
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
      <div class="draft_issue">
        <div
          v-show="status === 1"
          class="issue_l"
        >
          <div class="issue_l_tree">
            <el-input
              v-model="filterText"
              placeholder="分类名称"
              suffix-icon="el-icon-search"
            >
            </el-input>
            <div class="ungrouped">
              未分类（6）
            </div>

            <el-tree
              :data="data"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              @node-click="treeClickNode"
            >
              <span
                slot-scope="{ node, data }"
                class="custom-tree-node"
              >
                <span v-show="!isEdit || data.id !== isEditId">{{ node.label }}</span>
                <span
                  v-show="isEdit && data.id === isEditId"
                  class="tree_input"
                >
                  <el-input
                    v-model="input"
                    placeholder="请输入内容"
                  ></el-input>
                  <el-button type="text">确认</el-button>&nbsp;
                  <span @click="isEdit = false"> 取消</span>
                </span>
                <span>
                  <!-- 编辑&删除 -->
                  <el-dropdown
                    trigger="hover"
                    style="color: #a0a8ae;"
                    @command="handleCommandSide($event, data)"
                  >
                    <span class="el-dropdown-link">
                      <i class="el-icon-more" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-show="data.btnshow"
                        command="add"
                      >
                        新增分类
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-show="!data.btnshow"
                        command="move"
                      >
                        移动
                      </el-dropdown-item>
                      <el-dropdown-item command="edit">
                        编辑
                      </el-dropdown-item>
                      <el-dropdown-item command="del">
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
              </span>
            </el-tree>

            <div
              v-show="isShowinput"
              class="isShowinput"
            >
              <el-input
                v-model="input"
                placeholder="请输入内容"
              ></el-input>
              <span class="isShowinput_yes">确认</span>
              <span @click="isShowinput = false"> 取消</span>
            </div>
          </div>
          <div class="btn_bottom">
            <span
              class="btn1"
              @click="adddata"
            >新建分组</span>
            <span class="btn2">新建分类</span>
          </div>
        </div>

        <!-- 移动选择框 -->
        <el-dialog
          title="收货地址"
          :visible.sync="dialogFormVisible"
          :modal-append-to-body="false"
        >
          <el-form :model="form">
            <el-form-item
              label="分类名称"
              label-width="120px"
            >
              <el-input
                v-model="form.name"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="上级分类组"
              label-width="120px"
            >
              <el-select
                v-model="form.region"
                placeholder="请选择活动区域"
              >
                <el-option
                  label="区域一"
                  value="shanghai"
                ></el-option>
                <el-option
                  label="区域二"
                  value="beijing"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dialogFormVisible = false">
              取 消
            </el-button>
            <el-button
              type="primary"
              @click="dialogFormVisible = false"
            >
              确 定
            </el-button>
          </div>
        </el-dialog>

        <div
          class="issue_r"
          :class="{ istrainingArrange: status === 2 }"
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
              <!-- 培训名称 -->
              <template
                slot="name"
                slot-scope="{ row }"
              >
                <el-button type="text">
                  {{ row.name }}
                </el-button>
              </template>

              <!-- 状态 -->
              <template
                slot="status"
                slot-scope="{ row }"
              >
                <span v-if="row.status === 0">已办结</span>
                <span v-if="row.status === 1">未开始</span>
                <span v-if="row.status === 2">进行中</span>
              </template>
              <!-- 培训方式 -->
              <template
                slot="trainWay"
                slot-scope="{ row }"
              >
                <span v-if="row.trainWay === 1">面授</span>
                <span v-if="row.trainWay === 2">混合</span>
                <span v-if="row.trainWay === 3">在线</span>
              </template>

              <!-- 标签 -->
              <template
                slot="a"
                slot-scope="{ row }"
              >
                {{ row }}
              </template>

              <!-- 操作 -->
              <template
                slot="handler"
                slot-scope="scope"
              >
                <el-button
                  type="text"
                  size="medium"
                  @click.stop="handleConfig(scope.row, scope.index, 0)"
                >
                  开办下一期
                </el-button>
                <span style="color: #a0a8ae;"> &nbsp;&nbsp;|&nbsp;</span>
                <el-button
                  type="text"
                  size="medium"
                >
                  结办
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
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </common-table>
          </basic-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteMenuInfo } from '@/api/system/menu'
import { getCourseListData, delCourseInfo } from '@/api/course/course'
// training
import { queryClassify } from '@/api/training/training'

// 侧栏数据
const data = [
  {
    id: 1,
    label: '一级 1',
    btnshow: 1,
    children: [
      {
        id: 4,
        label: '二级 1-1',
        btnshow: 0
      }
    ]
  },
  {
    id: 2,
    label: '一级 2',
    btnshow: 1,
    children: [
      {
        id: 5,
        label: '二级 2-1',
        btnshow: 0
      },
      {
        id: 6,
        label: '二级 2-2',
        btnshow: 0
      }
    ]
  }
]

// 表格属性
const TABLE_COLUMNS = [
  {
    label: '培训名称',
    prop: 'name',
    width: '200',
    slot: true
  },
  {
    label: '编号',
    minWidth: 140,
    prop: 'trainNO'
  },
  {
    label: '状态',
    prop: 'status',
    minWidth: 80,
    slot: true
  },
  {
    label: '培训时间',
    prop: 'trainTime',
    minWidth: 180
  },
  {
    label: '计划人数',
    prop: 'people',
    minWidth: 80
  },
  {
    label: '培训方式',
    prop: 'trainWay',
    slot: true,
    minWidth: 80
  },
  {
    label: '主办单位',
    prop: 'sponsor',
    minWidth: 130
  },
  {
    label: '承办单位',
    prop: 'organizer',
    minWidth: 130
  },
  {
    label: '评分',
    prop: 'evaluateScore',
    minWidth: 130
  },
  {
    label: 'tags',
    prop: 'a',
    slot: true,
    minWidth: 200
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
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '请输入培训名称搜索' },
    data: '',
    field: 'name',
    label: '',
    type: 'input'
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'status',
    label: '状态',
    type: 'select',
    options: [
      { value: 1, label: '已办结' },
      { value: 2, label: '未开始' },
      { value: 3, label: '进行中' }
    ]
  },
  {
    type: 'numInterval',
    field: 'peopleMin,peopleMax',
    data: { min: '', max: '' },
    label: '计划人数'
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'trainWay',
    label: '培训方式',
    type: 'select',
    options: [
      { value: 1, label: '面授' },
      { value: 2, label: '混合' },
      { value: 3, label: '在线' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'sponsor',
    label: '主办单位',
    type: 'input'
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'address',
    label: '培训地点',
    type: 'input'
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
      // nav
      status: 1,
      // tree
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      // tree
      filterText: '',
      // 侧栏数据
      data: JSON.parse(JSON.stringify(data)),
      input: '',
      isShowinput: false, //显示分组——输入框
      isEdit: false, //显示分类——输入框
      isEditId: '', //显示分类——输入框id
      btnshow: 'false', //新增分类&移动

      defaultProps: {
        children: 'children',
        label: 'label'
      },
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
          name: '', //[string]	是	培训名称
          trainNO: '', //[string]	是	培训编号
          status: '', //[number]	是	状态
          trainTime: '', //[string]	是	培训时间
          people: '', //[number]	是	计划人数
          trainWay: '', //[number]	是	培训方式
          sponsor: '', //[string]	是	主办单位
          organizer: '', //[string]	是	承办单位
          evaluateScore: '', //[double]	是	评分
          tags: '', //[array]	是	标签
          id: '' //[number]	是	标签id
          // name: '' //[string]	是	标签名称
        }
      ],
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.refreshTableData()
    // this.loadData()
    this.getInfo()

    // 下拉筛选框
    // this.tableData.forEach((item) => {
    //   SEARCH_POPOVER_POPOVER_OPTIONS[1].options.push({
    //     value: item.teacherId,
    //     label: item.teacherId
    //   }) //讲师
    //   SEARCH_POPOVER_POPOVER_OPTIONS[2].options.push({
    //     value: item.catalogId,
    //     label: item.catalogId
    //   })
    // })

    this.isgetCatalogs()
    this.isqueryClassify()
  },
  activated() {
    // this.loadData()
    this.getInfo()
  },
  methods: {
    goAdd() {
      this.$router.push({ path: '/training/edit' })
    },
    isqueryClassify() {
      queryClassify().then(() => {
        // console.log(res)
      })
    },
    //   tree节点点击
    // treeClickNode(data, node, h) {
    //   console.log('data----------', data)
    //   console.log('node----------', node)
    //   console.log('h----------', h)
    // },
    // 底部btn
    adddata() {
      this.isShowinput = true
    },
    handleCommandSide($event, data) {
      // window.console.log($event, data)
      //   编辑
      if ($event === 'edit') {
        this.isEdit = true
        this.isEditId = data.id
      }
      //   新增
      if ($event === 'add') {
        let i = this.data.indexOf(data)
        // console.log(i)
        let idNum = Math.floor(Math.random() * 10000)
        this.data[i].children.push({
          label: 'add',
          btnshow: 0,
          id: idNum
        })
        this.isEdit = true
        this.isEditId = idNum
      }
      //移动
      if ($event === 'move') {
        this.dialogFormVisible = true
      }
    },

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
      this.getInfo()
    },
    handlePageSizeChange(param) {
      this.page.size = param
      this.getInfo()
    },

    // handleSearch(searchParams) {
    //   // this.loadTableData(_.pickBy(searchParams))
    //   // this.getInfo(searchParams)
    //   // console.log(searchParams)
    // },
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

    // 拿数据
    getInfo(courseName) {
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
      })
    },

    // 拿左侧数据
    isgetCatalogs() {
      // getCatalogs().then(res=>{
      //   // console.log('--------------',res);
      // })
      // console.log(getCatalogs());
    },

    // 已发布&草稿nav
    showSelect(index) {
      this.status = index
    },
    // tree
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>

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
<style lang="scss" scoped>
.trainingArrange {
  .box_title {
    height: 60px;
    display: flex;
    justify-content: space-between;
    line-height: 60px;
  }
  .box_content {
    background-color: #fff;
    .content_nav {
      height: 50px;
      border-bottom: 1px solid #ccc;
      display: flex;
      span {
        height: 50px;
        line-height: 50px;
        margin-left: 30px;
      }
      .select {
        border-bottom: 3px solid #1677ff;
      }
    }
    .draft_issue {
      padding-top: 25px;
      display: flex;
      height: 600px;

      .issue_l {
        position: relative;
        width: 20%;
        border-right: 1px solid #ccc;
        .issue_l_tree {
          padding: 0 25px;
          /deep/.el-input {
            margin-bottom: 15px;
          }
          .ungrouped {
            color: #606266;
            margin: 0 0 5px 22px;
            font-size: 14px;
          }
        }
        .btn_bottom {
          position: absolute;
          bottom: 0;
          height: 50px;
          width: 100%;
          display: flex;
          border-top: 1px solid #ccc;
          span {
            flex: 1;
            line-height: 50px;
            text-align: center;
            color: #1677ff;
          }
          .btn1 {
            border-right: 1px solid #ccc;
          }
        }
      }
      .issue_r {
        width: 80%;
        padding: 0 40px;
      }
      .istrainingArrange {
        width: 100%;
      }
    }

    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;

      /deep/ .el-icon-more {
        transform: rotate(-90deg);
      }
    }
    .tree_input {
      width: 55%;
      font-size: 12px;
      padding-top: 3px;

      /deep/ input {
        height: 25px;
        margin-left: -15px;
      }
    }
    /deep/ .el-tree-node__content {
      margin-top: 10px;
    }

    .isShowinput {
      margin-top: 25px;
      display: flex;
      line-height: 35px;
      /deep/ .el-input {
        width: 60%;
      }
      .isShowinput_yes {
        color: #2092fb;
        padding: 0 12px;
      }
      /deep/ input {
        height: 25px;
      }
    }
  }
  /deep/.el-card,
  /deep/.is-never-shadow {
    border: none;
  }
}
/deep/ .el-popover {
  width: 60% !important;
  margin-left: 300px !important;
}
</style>
