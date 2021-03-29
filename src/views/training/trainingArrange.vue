<template>
  <div class="trainingArrange">
    <div class="box_title">
      <div class="title">
        培训安排
      </div>
      <div>
        <el-button
          v-p="ADD_TRAIN"
          type="primary"
          size="medium"
          @click="goAdd"
        >
          &nbsp; 创建培训 &nbsp;
        </el-button>
      </div>
    </div>

    <div class="box_content">
      <div class="content_nav">
        <span
          :class="{ select: status === 0 }"
          @click="showSelect(0)"
        >已发布</span>
        <span
          :class="{ select: status === 1 }"
          @click="showSelect(1)"
        >草稿</span>
      </div>

      <!-- 内容 -->
      <div class="draft_issue">
        <div
          v-show="status === 0"
          class="issue_l"
        >
          <my-column
            :column-interface="columnInterface"
            @treeClick="treeClick"
          ></my-column>

          <!-- <div class="issue_l_tree">
            <el-input
              v-model="filterText"
              placeholder="分类名称"
              suffix-icon="el-icon-search"
            >
            </el-input>
            <div class="ungrouped">
              未分类
            </div>

            <el-tree
              ref="tree"
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
                    v-model="inputGroupingSon"
                    placeholder="请输入内容"
                    maxlength="20"
                  ></el-input>
                  <el-button
                    type="text"
                    @click="addGroupingSon"
                  >确认</el-button>&nbsp;
                  <span @click="isEdit = false"> 取消</span>
                </span>
                <span>
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
                v-model="inputGrouping"
                placeholder="请输入内容"
                maxlength="20"
              ></el-input>
              <span
                class="isShowinput_yes"
                @click="addGrouping"
              >确认</span>
              <span @click="isShowinput = false"> 取消</span>
            </div>
          </div>
          <div class="btn_bottom">
            <span
              class="btn1"
              @click="adddata"
            >新建分组</span>
          </div> -->
        </div>

        <!-- 移动选择框 -->
        <!-- <el-dialog
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
                maxlength="32"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item
              label="上级分类组"
              label-width="120px"
            >
              <el-select
                v-model="form.region"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in data"
                  :key="index"
                  :label="item.label"
                  :value="item.id"
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
              @click="ismove"
            >
              确 定
            </el-button>
          </div>
        </el-dialog> -->

        <!-- 已发布 -->
        <div
          v-if="!status"
          class="issue_r"
          :class="{ istrainingArrange: status === 1 }"
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
                      v-if="!status"
                      class="operations__btns--tooltip"
                      content="刷新"
                      effect="dark"
                      placement="top"
                      style="color: #acb3b8; cursor: pointer"
                      @click="refreshTableData"
                    >
                      <el-button
                        v-if="!status"
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
                      v-if="!status"
                      class="text_refresh"
                      style="cursor: pointer"
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
                          style="color: #acb3b8"
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
                            :disabled="item.prop === 'name' || item.prop === 'trainName'"
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
                  v-p="DELETE_TRAIN"
                  style="margin-bottom: 0"
                  type="text"
                  @click="() => handleRemoveItems(selection)"
                >
                  批量删除
                </el-button>
              </template>
              <!-- 培训名称 -->
              <template
                slot="trainName"
                slot-scope="{ row }"
              >
                <el-button
                  v-if="$p(VIEW_TRAIN)"
                  type="text"
                  @click="toTrainingDetail(row)"
                >
                  {{ row.trainName }}
                </el-button>
                <div v-else>
                  {{ row.trainName }}
                </div>
              </template>

              <!-- 状态 -->
              <template
                slot="status"
                slot-scope="{ row }"
              >
                <span v-if="row.status === 3">已结束</span>
                <span v-if="row.status === 1">未开始</span>
                <span v-if="row.status === 2">进行中</span>
              </template>
              <template
                slot="people"
                slot-scope="{ row }"
              >
                <span>{{ typeof row.people !== 'number' ? '未限制' : row.people }}</span>
              </template>
              <!--培训时间-->
              <template
                slot="trainBeginTime"
                slot-scope="{ row }"
              >
                <span>{{ `${row.trainBeginTime}~${row.trainEndTime}` }}</span>
              </template>
              <!-- 培训方式 -->
              <template
                slot="trainWay"
                slot-scope="{ row }"
              >
                <span v-if="row.trainWay === 1">在线</span>
                <span v-if="row.trainWay === 2">面授</span>
                <span v-if="row.trainWay === 3">混合</span>
              </template>
              <!-- 标签 -->
              <template
                slot="trainTagList"
                slot-scope="{ row }"
              >
                <span
                  v-for="(item, index) in row.trainTagList"
                  :key="index"
                  class="item_icon"
                >{{
                  item
                }}</span>
                <div v-if="row.trainTagList"></div>
              </template>

              <!-- 操作 -->
              <!-- 已发布 -->
              <template
                slot="handler"
                slot-scope="scope"
              >
                <div v-if="status === 0">
                  <el-button
                    v-p="NEXT_TRAIN"
                    type="text"
                    size="medium"
                    @click.stop="handleConfig(scope.row.id)"
                  >
                    开办下一期
                  </el-button>
                  <span class="decollator_span">|</span>
                  <span v-p="END_TRAIN">
                    <el-button
                      v-if="scope.row.status !== 0"
                      type="text"
                      size="medium"
                      :disabled="scope.row.status == 3"
                      @click="isstopSchedule(scope.row.id)"
                    >
                      结办
                    </el-button>
                  </span>
                  <el-dropdown
                    v-if="$p([EDIT_TRAIN, DELETE_TRAIN])"
                    trigger="hover"
                    style="color: #a0a8ae"
                    @command="handleCommand($event, scope.row)"
                  >
                    <span class="el-dropdown-link">
                      <i class="el-icon-more" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-p="EDIT_TRAIN"
                        command="edit"
                        :disabled="scope.row.status != 1"
                      >
                        编辑
                      </el-dropdown-item>

                      <el-dropdown-item
                        v-p="DELETE_TRAIN"
                        command="del"
                        :disabled="scope.row.status == 2"
                      >
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </common-table>
          </basic-container>
        </div>

        <draftComponents
          v-else
          style="width: 100%"
        />
      </div>
    </div>
  </div>
</template>

<script>
// training
import {
  addCatalog,
  getCatalogs,
  move,
  delCatalogs,
  updateCatalogs,
  getScheduleList,
  delTrain,
  stopSchedule
} from '@/api/training/training'
import {
  ADD_TRAIN,
  ADD_GROUNP_TRAIN,
  DELETE_TRAIN,
  EDIT_TRAIN,
  END_TRAIN,
  NEXT_TRAIN,
  VIEW_TRAIN
} from '@/const/privileges'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '培训名称',
    prop: 'trainName',
    width: '180',
    slot: true,
    fixed: 'left'
  },
  {
    label: '编号',
    minWidth: 200,
    prop: 'trainNo'
  },
  {
    label: '状态',
    prop: 'status',
    minWidth: 80,
    slot: true
  },
  {
    label: '培训时间',
    prop: 'trainBeginTime',
    minWidth: 180,
    slot: true
  },
  {
    label: '计划人数',
    prop: 'people',
    minWidth: 80,
    slot: true
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
    prop: 'composite',
    minWidth: 130
  }
  // {
  //   label: '标签',
  //   prop: 'trainTagList',
  //   slot: true,
  //   minWidth: 200
  // }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 200
  },
  enableMultiSelect: true,
  enablePagination: true,
  showHandler: true,
  showIndexColumn: false
  // rowKey: (d) => {
  //   Object.keys(d).forEach((key) => {
  //     d[key] = d[key] || '--'
  //   })
  // }
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '请输入培训名称搜索' },
    data: '',
    field: 'trainName',
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
      { value: 3, label: '已办结' },
      { value: 1, label: '未开始' },
      { value: 2, label: '进行中' },
      { value: '', label: '全部' }
    ]
  },
  {
    type: 'numInterval',
    field: 'peopleMin,peopleMax',
    data: { min: '', max: '' },
    label: '计划人数',
    required: false
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'trainWay',
    label: '培训方式',
    type: 'select',
    options: [
      { value: 2, label: '面授' },
      { value: 3, label: '混合' },
      { value: 1, label: '在线' },
      { value: '', label: '全部' }
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
import { mapGetters } from 'vuex'

export default {
  // 搜索组件
  components: {
    SeachPopover: () => import('@/components/searchPopOver'),
    // 草稿
    draftComponents: () => import('./draftComponents'),
    MyColumn: () => import('./components/MyColumn')
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      searchParams: '',
      // 接口
      columnInterface: {
        listTeacherCategory: getCatalogs, //查询讲师分类列表
        addCatalog: addCatalog, //新增分组/分类
        deleteTeacherCatalog: delCatalogs, //删除分组/分类
        move: move, //移动
        editTeacherCatalog: updateCatalogs //编辑
      },
      idSchedule: '',
      compileNewly: '',
      addId: '',
      // 新建分组&分类
      inputGroupingSon: '',
      inputGrouping: '',
      // nav
      status: 0,
      // tree
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        optionData: ''
      },
      // tree
      filterText: '',
      // 侧栏数据
      data: [],
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
      tableData: [],
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },
  computed: {
    VIEW_TRAIN: () => VIEW_TRAIN,
    ADD_TRAIN: () => ADD_TRAIN,
    ADD_GROUNP_TRAIN: () => ADD_GROUNP_TRAIN,
    DELETE_TRAIN: () => DELETE_TRAIN,
    EDIT_TRAIN: () => EDIT_TRAIN,
    NEXT_TRAIN: () => NEXT_TRAIN,
    END_TRAIN: () => END_TRAIN,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([NEXT_TRAIN, END_TRAIN, EDIT_TRAIN, DELETE_TRAIN])
      },
      deep: true
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    status() {
      if (this.status) {
        // 草稿
        SEARCH_POPOVER_CONFIG.popoverOptions = []
        TABLE_CONFIG.handlerColumn.width = 120
      } else {
        // 发布
        SEARCH_POPOVER_CONFIG.popoverOptions = SEARCH_POPOVER_POPOVER_OPTIONS
        TABLE_CONFIG.handlerColumn.width = 200
      }
    }
  },
  created() {
    this.refreshTableData()
    this.isgetCatalogs()
  },
  activated() {},
  methods: {
    treeClick(val) {
      (this.page.pageNo = 1),
        (this.page.pageSize = 10),
        (this.page.total = 0),
        (this.idSchedule = val)
      this.isgetScheduleList()
    },
    // 去开办下一期
    handleConfig(id) {
      this.$router.push({ path: '/training/edit', query: { id: id, type: 'next' } })
    },
    // 去创建培训
    toCreateTraining() {},
    goAdd() {
      this.$router.push({ path: '/training/edit' })
    },
    // 去培训详情
    toTrainingDetail(row) {
      this.$router.push({
        path: '/training/trainingDetail?id=' + row.id + '&status=' + row.status
      })
    },
    // 草稿删除
    isDraftDel(scope) {
      let params = { ids: scope.row.id }
      delTrain(params).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.isgetScheduleList()
      })
    },
    isstopSchedule(id) {
      stopSchedule(id).then(() => {
        this.isgetScheduleList()
      })
    },
    // 查询培训安排
    isgetScheduleList(param) {
      let params = {
        categoryId: '', //分类id
        type: '' //0.已发布、1.草稿
      }
      params.type = this.status
      params.categoryId = this.idSchedule
      params = { ...params, ...this.page, ...param, ...this.searchParams }
      getScheduleList(params).then((res) => {
        // console.log(res);
        this.tableData = res.data.map((item) => {
          if (!item.organizer) {
            item.organizer = '--'
          }
          if (!item.composite) {
            item.composite = '--'
          }
          return item
        })
        this.page.total = res.totalNum
      })
    },

    // 编辑分组分类
    isupdateCatalogs(params) {
      updateCatalogs(params).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.isgetCatalogs()
      })
    },

    // 删除分组分类
    isdelCatalogs(params) {
      delCatalogs(params).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.isgetCatalogs()
      })
    },

    // 移动
    ismove() {
      this.dialogFormVisible = false
      this.form
      let params = {
        id: '', //讲师所属分类ID
        parentId: '' //讲师所属分组ID
      }
      params.id = this.form.optionData.id
      params.parentId = this.form.region
      move(params).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.isgetCatalogs()
      })
    },

    // 拿左侧列表数据
    isgetCatalogs() {
      getCatalogs().then((res) => {
        let datar = []
        for (let i = 0; i < res.length; i++) {
          let d = {
            id: 1,
            label: '一级 1',
            btnshow: 1,
            children: []
          }
          d.id = res[i].id
          d.label = res[i].name
          d.btnshow = 1
          d.children = []
          datar.push(d)

          for (let f = 0; f < res[i].list.length; f++) {
            let c = {
              id: 1,
              label: '一级 1',
              btnshow: 1,
              parentId: ''
            }
            c.id = res[i].list[f].id
            c.label = res[i].list[f].name
            c.btnshow = 0
            c.parentId = res[i].list[f].parentId
            datar[i].children.push(c)
          }
        }
        this.data = datar
        // this.idSchedule = datar[0].children[0].id || ''
        this.isgetScheduleList()
      })
    },

    // 新建&编辑分类
    addGroupingSon() {
      if (this.compileNewly) {
        let params = {
          id: this.addId,
          name: this.inputGroupingSon
        }
        this.isupdateCatalogs(params)
        this.isEdit = false
      } else {
        this.isAddCatalog(this.addId, this.inputGroupingSon)
        this.isEdit = false
        this.inputGroupingSon = ''
        this.isgetCatalogs()
      }
    },

    // 新建&编辑分组
    addGrouping() {
      if (this.compileNewly) {
        let params = {
          id: this.addId,
          name: this.inputGrouping
        }
        this.isupdateCatalogs(params)
        this.isShowinput = false
      } else {
        this.isAddCatalog('', this.inputGrouping)
        this.isShowinput = false
        this.inputGrouping = ''
        this.isgetCatalogs()
      }
    },

    // 新增
    isAddCatalog(id, name) {
      let params = {
        id,
        name
      }
      addCatalog(params).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },

    //   tree节点点击
    treeClickNode(data) {
      if (data.btnshow) {
        this.idSchedule = data.children[0] ? data.children[0].id : data.id
      } else {
        this.idSchedule = data.id
      }
      this.isgetScheduleList()
    },
    // 底部btn
    adddata() {
      this.isShowinput = true
    },
    handleCommandSide($event, data) {
      // window.console.log($event, data)
      this.addId = data.id
      //   编辑
      if ($event === 'edit') {
        this.isEdit = true
        this.isEditId = data.id
        this.compileNewly = 1
      }
      //   新增
      if ($event === 'add') {
        this.compileNewly = 0
        let i = this.data.indexOf(data)
        let idNum = Math.floor(Math.random() * 10000)
        this.data[i].children.push({
          label: '',
          btnshow: 0,
          id: idNum
        })
        this.isEdit = true
        this.isEditId = idNum
      }
      //移动
      if ($event === 'move') {
        this.dialogFormVisible = true
        this.form.name = data.label
        this.form.optionData = data
      }
      // 删除
      if ($event === 'del') {
        this.$confirm('此操作将删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // console.log(data);
            if (!data.children) {
              let params = {
                classifyId: '', //讲师所属分类ID
                id: '' //讲师所属分组ID
              }
              if (data.btnshow) {
                params.id = data.id
              } else {
                params.classifyId = data.id
              }
              this.isdelCatalogs(params)
            } else {
              this.$message.error('你选中的分类下存在数据，请先调整后再删除')
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },

    // 编辑&删除&移动
    handleCommand(e, row) {
      if (e === 'edit') {
        // 编辑
        this.$router.push({ path: '/training/edit', query: { id: row.id } })
      }
      if (e === 'del') {
        // 删除

        this.$confirm('此操作将删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let params = { ids: row.id }
            delTrain(params).then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.isgetCatalogs()
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
      this.page.pageNo = param
      this.isgetScheduleList()
    },
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.isgetScheduleList()
    },

    handleSearch(searchParams) {
      let { peopleMin, peopleMax } = searchParams
      if (peopleMin && peopleMax) {
        if (peopleMin > peopleMax) return
      }
      this.page.pageNo = 1
      this.searchParams = searchParams
      this.isgetScheduleList()
    },
    handleRemoveItems(selection) {
      if (!selection.length) return
      if (selection.some((item) => item.status == 2)) {
        this.$confirm(
          '你所选择的数据包含正在进行的培训，不能进行删除操作，是否忽略继续删除其它培训？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.handleRemoveItems(selection.filter((item) => item.status != 2))
          })
          .catch((e) => console.log(e))
        return
      }
      this.$confirm('此操作将删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = { ids: '' }
          selection.forEach((item) => {
            params.ids += item.id + ','
          })
          delTrain(params).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.isgetCatalogs()
            this.isgetScheduleList()
            this.$refs.table.clearSelection()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 刷新列表数据
    refreshTableData() {
      this.isgetScheduleList()
    },

    // 已发布&草稿nav
    showSelect(index) {
      this.status = index
      this.isgetScheduleList()
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
.item_icon {
  padding: 5px;
  background-color: #ccc;
  color: #333;
  margin-left: 10px;
}
.decollator_span {
  margin: 0 5px;
  color: #ebeced;
}
.trainingArrange {
  .box_title {
    height: 60px;
    display: flex;
    justify-content: space-between;
    line-height: 60px;
    font-size: 18px;
    font-weight: bold;
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
        cursor: pointer;
      }
      .select {
        border-bottom: 3px solid #1677ff;
      }
    }
    .draft_issue {
      padding-top: 25px;
      display: flex;
      height: 700px;
      .issue_l {
        position: relative;
        width: 20%;
        overflow: hidden;
        height: 700px;
        .issue_l_tree {
          padding: 0 25px;
          /deep/.el-input {
            margin-bottom: 15px;
          }
          .ungrouped {
            color: #606266;
            margin: 0 0 5px 22px;
            font-size: 14px;
            cursor: pointer;
          }
        }
        .btn_bottom {
          position: absolute;
          bottom: 0;
          height: 50px;
          width: 100%;
          display: flex;
          border-top: 1px solid #ccc;
          z-index: 999;
          background-color: #fff;
          cursor: pointer;
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
        // padding: 0 40px;
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
        z-index: 99999;
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
