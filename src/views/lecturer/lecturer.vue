<template>
  <div class="trainingArrange">
    <div class="box_title">
      <div class="title">
        讲师管理
      </div>
      <div>
        <el-button
          type="primary"
          size="medium"
          @click="toAddLecturer"
        >
          &nbsp; 添加讲师 &nbsp;
        </el-button>
      </div>
    </div>

    <div class="box_content">
      <!-- 内容 -->
      <div class="draft_issue">
        <div class="issue_l">
          <!-- <leftColumn
            :search="true"
            :data="data"
            :current-node-key="currentNodeKey"
            :more-menu="['edit', 'add', 'delete', 'move']"
            :interface-list="interfaceList"
            lazy
            :load="loadNode"
            @refreshTree="islistTeacherCategory"
            @node-click="nodeClick"
          ></leftColumn> -->

          <div class="issue_l_tree">
            <el-input
              v-model="filterText"
              placeholder="分类名称"
              suffix-icon="el-icon-search"
              maxlength="32"
            >
            </el-input>

            <!-- <div class="ungrouped">
              未分类
            </div> -->

            <el-tree
              ref="tree"
              :data="data"
              node-key="id"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              :props="props"
              lazy
              :load="loadNode"
              class="tree"
              :default-expanded-keys="expandedKeysData"
              @node-click="treeClickNode"
            >
              <span
                slot-scope="{ node, data }"
                class="custom-tree-node"
              >
                <span
                  v-show="!isEdit || data.id !== isEditId"
                >{{ node.label }}&nbsp;{{ `(${data.count})` }}</span>
                <span
                  v-show="isEdit && data.id === isEditId"
                  class="tree_input"
                >
                  <el-input
                    id="addSon"
                    v-model="dataAddCatalog.input"
                    placeholder="请输入分类名称"
                    maxlength="20"
                  ></el-input>
                  <el-button
                    type="text"
                    @click="isaddCatalog(data)"
                  >确认</el-button>&nbsp;
                  <span @click="isEditFn(data)"> 取消</span>
                  <!-- <span @click="isEdit = false"> 取消</span> -->
                </span>
                <span>
                  <!-- 编辑&删除 -->
                  <el-dropdown
                    v-show="data.label !== '未分类'"
                    trigger="hover"
                    style="color: #a0a8ae;"
                    class="right-content"
                    @command="handleCommandSide($event, data)"
                  >
                    <span class="el-dropdown-link more-column">
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
                id="/lecturer/lecturer"
                v-model="dataAddCatalog.input"
                class="isShowinput_input"
                placeholder="请输入分组名称"
                maxlength="20"
              ></el-input>
              <span
                class="isShowinput_yes"
                @click="isaddCatalog(data)"
              >确认</span>
              <span @click="isShowinputFn"> 取消</span>
              <!-- <span @click="isShowinput = false"> 取消</span> -->
            </div>
          </div>
          <div
            v-show="!isShowinput"
            class="btn_bottom"
          >
            <a
              class="btn1"
              href="#/lecturer/lecturer"
              @click="adddata"
            >新建分组</a>
            <!-- <span class="btn2">新建分类</span> -->
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
        </el-dialog>

        <div class="issue_r">
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
                    <!-- <i class="el-icon-upload2"></i>
                    &nbsp; &nbsp;
                    <span>导出</span> -->
                    &nbsp; &nbsp;
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
                      @click="islistTeacher"
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
              <!-- 培训名称 -->
              <template
                slot="name"
                slot-scope="{ row }"
              >
                <el-button
                  type="text"
                  @click="toParticularsLecturer(row)"
                >
                  {{ row.name }}
                </el-button>
              </template>

              <!-- 状态 -->
              <template
                slot="status"
                slot-scope="{ row }"
              >
                <span v-if="row.status == 0">停用</span>
                <span v-if="row.status == 1">正常</span>
              </template>

              <!-- 性别 -->
              <template
                slot="sex"
                slot-scope="{ row }"
              >
                <span v-if="row.sex == 0">女</span>
                <span v-if="row.sex == 1">男</span>
              </template>

              <!-- '讲师类型（1：内训，2：外聘）',-->
              <template
                slot="type"
                slot-scope="{ row }"
              >
                <span v-if="row.type == 1">内训</span>
                <span v-if="row.type == 2">外聘</span>
              </template>

              <!--  是否推荐（1：是，0：否）',-->
              <template
                slot="is_recommend"
                slot-scope="{ row }"
              >
                <span v-if="row.is_recommend == 1">是</span>
                <span v-if="row.is_recommend == 0">否</span>
              </template>

              <!-- '是否最新讲师（1：是，0：否）', -->

              <template
                slot="is_latest_teacher"
                slot-scope="{ row }"
              >
                <span v-if="row.is_latest_teacher == 1">是</span>
                <span v-if="row.is_latest_teacher == 0">否</span>
              </template>
              <!-- '是否热门讲师（1：是，0：否）', -->
              <template
                slot="is_popular_teacher"
                slot-scope="{ row }"
              >
                <span v-if="row.is_popular_teacher == 1">是</span>
                <span v-if="row.is_popular_teacher == 0">否</span>
              </template>

              <!-- 操作 -->
              <template
                slot="handler"
                slot-scope="scope"
              >
                <el-button
                  v-if="scope.row.status == false"
                  type="text"
                  size="medium"
                  @click.stop="iseditSysRulus(scope.row.idStr, 1)"
                >
                  停用
                </el-button>
                <span
                  v-else
                  style=" cursor:pointer; "
                  size="medium"
                  @click.stop="iseditSysRulus(scope.row.idStr, 0)"
                >
                  启用
                </span>
                &nbsp;
                <i style="color:#ccc;">|</i>
                &nbsp;
                <el-button
                  type="text"
                  size="medium"
                  @click.stop="tocompileLecturer(scope.row)"
                >
                  编辑
                </el-button>
                &nbsp;
                <i style="color:#ccc;">|</i>
                &nbsp;
                <el-button
                  type="text"
                  size="medium"
                  @click.stop="isTeacherdelete(scope.row.idStr)"
                >
                  删除
                </el-button>
              </template>
            </common-table>
          </basic-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { delCourseInfo } from '@/api/course/course'
import {
  listTeacherCategory,
  addCatalog,
  listTeacher,
  editSysRulus,
  deleteTeacherCatalog,
  Teacherdelete,
  move,
  editTeacherCatalog
} from '@/api/lecturer/lecturer'
// import { delete } from 'vue/types/umd'
// 侧栏数据

// 表格属性
const TABLE_COLUMNS = [
  {
    label: '讲师姓名',
    prop: 'name',
    width: '180',
    slot: true,
    fixed: 'left'
  },
  {
    label: '手机号码',
    minWidth: 140,
    prop: 'phonenum'
  },
  {
    label: '电子邮箱',
    prop: 'user_email',
    minWidth: 80
  },
  {
    label: '状态',
    prop: 'status',
    minWidth: 180,
    slot: true
  },
  {
    label: '性别',
    prop: 'sex',
    minWidth: 80,
    slot: true
  },
  {
    label: '讲师类型',
    prop: 'type',
    slot: true,
    minWidth: 80
  },
  // {
  //   label: '擅长领域',
  //   prop: 'lingyu',
  //   minWidth: 130
  // },
  {
    label: '讲师级别',
    prop: 'teacher_title',
    minWidth: 130
  },
  {
    label: '讲师职称',
    prop: 'organizer',
    minWidth: 130
  },
  {
    label: '是否推荐',
    prop: 'is_recommend',
    slot: true,
    minWidth: 200
  },
  {
    label: '是否最新讲师',
    prop: 'is_latest_teacher',
    slot: true,
    minWidth: 200
  },
  {
    label: '是否热门讲师',
    prop: 'is_popular_teacher',
    slot: true,
    minWidth: 200
  },
  {
    label: '创建人',
    prop: 'creator_id',
    minWidth: 200
  },
  {
    label: '创建时间',
    prop: 'create_time',
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
    config: { placeholder: '请输入姓名/手机号码搜索' },
    data: '',
    field: 'likeQuery',
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
      { value: 0, label: '停用' },
      { value: 1, label: '正常' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'trainWay',
    label: '讲师类型',
    type: 'select',
    options: [
      { value: 1, label: '内训' },
      { value: 2, label: '外聘' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'lingyu',
    label: '擅长领域',
    type: 'select',
    options: []
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'teacher_level',
    label: '讲师级别',
    type: 'input'
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'teacher_title',
    label: '讲师职称',
    type: 'input'
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'is_recommend',
    label: '是否推荐',
    type: 'select',
    options: [
      { value: 1, label: '是' },
      { value: 0, label: '否' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'is_latest_teacher',
    label: '是否最新',
    type: 'select',
    options: [
      { value: 1, label: '是' },
      { value: 0, label: '否' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'is_popular_teacher',
    label: '是否热门',
    type: 'select',
    options: [
      { value: 1, label: '是' },
      { value: 0, label: '否' }
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
      inputAddMark: false,
      expandedKeysData: [],
      interfaceList: {
        addCatalog: addCatalog, //新增树单元接口
        delCatalogs: deleteTeacherCatalog, //删除树单元接口
        getCatalogs: listTeacherCategory, //获取树单元接口
        moveCatalogs: move, //移动树单元接口
        updateCatalogs: listTeacherCategory //更新树单元接口
      },
      currentNodeKey: '',

      compileNewly: '',
      // 保存左栏点过的的id或者默认id
      clickId: '',
      props: {
        lazy: true,
        isLeaf: (data, node) => {
          if (node.level === 2 || data.label == '未分类') {
            return true
          }
        }
      },

      dataAddCatalog: { input: '' },
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

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.islistTeacherCategory()
  },
  activated() {},
  methods: {
    // 输入框取消按钮
    isShowinputFn() {
      this.isShowinput = false
      this.dataAddCatalog.input = ''
    },
    isEditFn(data) {
      this.isEdit = false
      this.dataAddCatalog.input = ''
      // this.data.forEach((item, index) => {
      //   if (item.id == data.myid) {
      //     // this.data[index].children.splice(item.children.length - 1, 1)
      //     delete this.data[index].children[item.children.length - 1]
      //     // this.expandedKeysData = []
      //     // this.expandedKeysData.push(item.id)
      //   }
      // })
      this.expandedKeysData = []
      this.expandedKeysData.push(data.myid)
      this.islistTeacherCategory()
    },

    nodeClick(data) {
      // if (data.hasOwnProperty('children') && data.children.length > 0) return
      // this.islistTeacherCategory(data.id)
      this.islistTeacher(data.id)
    },
    isgetCatalogs() {},
    async loadNode(node, resolve) {
      // 树数据懒加载
      // if (node.level > 1) return;
      // this.islistTeacherCategory().then((res) => {
      //   resolve([
      //     {
      //       id: '123123',
      //       label: '123123'
      //     }
      //   ])
      // })
      if (node.level === 0) {
        return resolve([{ name: 'region' }])
      }
      if (node.level > 1) return resolve([])

      let res = await listTeacherCategory({ parentId: node.data.id })
      let filterArr = res.son.map((item) => {
        return {
          id: item.idStr,
          parent_id: item.parentStr,
          label: item.name,
          btnshow: 0,
          count: item.count,
          leaf: true
        }
      })

      node.data.children = filterArr
      resolve(filterArr)

      if (this.inputAddMark) {
        this.inputAddMark = false
        this.addSonInput(this.addSonInputData)
      }
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
        this.islistTeacherCategory()
      })
    },

    // 去添加
    toAddLecturer() {
      this.$router.push({ path: '/lecturer/addLecturer' })
    },
    // 去详情
    toParticularsLecturer(row) {
      this.$router.push({
        path: '/lecturer/particularsLecturer',
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
    // 去编辑
    tocompileLecturer(row) {
      // this.$router.push({ path: `/lecturer/compileLecturer?id= ${row.user_id_str}&name =${row.name}&userEmail=${row.user_email}&sex=${row.sex}` })
      this.$router.push({
        path: '/lecturer/compileLecturer',
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

    // 删除讲师
    isTeacherdelete(id) {
      let params = {
        ids: id
      }
      Teacherdelete(params).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.islistTeacherCategory()
      })
    },

    // 删除分组/分类
    iddeleteTeacherCatalog(id) {
      deleteTeacherCatalog({ id: id }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.islistTeacherCategory()
      })
    },

    // 启动/停用系统规则列表
    iseditSysRulus(id, i) {
      let params = {
        id: '',
        status: '' // '0 停用 1 正常',
      }
      params.id = id
      params.status = i
      editSysRulus(params).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        //刷新
        this.islistTeacherCategory()
      })
    },

    // 查询讲师列表
    islistTeacher(id, searchParams) {
      let categoryId = {
        categoryId: id
      }

      if (!id) {
        categoryId.categoryId = this.clickId
      }

      let params = { ...categoryId, ...searchParams, ...this.page }
      listTeacher(params).then((res) => {
        this.tableData = res.teacherInfos
        this.page.total = res.totalNum || 0
        // 下拉筛选框
        this.tableData.forEach((item) => {
          SEARCH_POPOVER_POPOVER_OPTIONS[2].options.push({
            value: item.lingyu,
            label: item.lingyu
          })
        })
      })
    },
    // 新增分组/分类&编辑
    isaddCatalog(node) {
      if (this.compileNewly == 1) {
        // 编辑
        let params = {
          id: '',
          name: ''
        }
        params.id = node.id
        params.name = this.dataAddCatalog.input
        if (params.name.trim() == '') {
          this.$message({
            message: '名称不能为空',
            type: 'warning'
          })
          return
        }
        editTeacherCatalog(params).then(() => {
          this.islistTeacherCategory()
          this.isEdit = false
          this.dataAddCatalog.input = ''
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        })
      } else {
        // 新增
        let params = {
          // creatorId: '', //	分组id	query	false
          name: '', //	名称	query	false
          parentId: '' //	类id	query	false
        }
        if (node) {
          params.id = node.myid
          // params.parentId = node.parentId
        }
        params.name = this.dataAddCatalog.input
        if (params.name.trim() == '') {
          this.$message({
            message: '名称不能为空',
            type: 'warning'
          })
          return
        }
        addCatalog(params).then(() => {
          this.islistTeacherCategory()
          this.isShowinput = false
          this.dataAddCatalog.input = ''
          this.$message({
            message: '新增成功',
            type: 'success'
          })
        })
      }
    },
    // 查询讲师分类列表
    islistTeacherCategory(id) {
      let params = {}
      if (id) {
        params = {
          test: '123',
          parentId: '' // 父ID
        }
        params.parentId = id
      } else {
        params = {
          test: '123'
        }
      }
      return listTeacherCategory(params).then((res) => {
        this.data = []
        res.group.forEach((item) => {
          let i = {
            id: 1,
            label: '一级 1',
            btnshow: 1,
            children: [],
            num: 1,
            count: 0
          }
          i.id = item.idStr
          i.label = item.name
          i.btnshow = 1
          i.children = []
          i.count = item.count
          this.data.push(i)
        })
        this.data.forEach((item) => {
          let filterArr = res.son.filter((list) => list.parentStr == item.id) || []
          filterArr = filterArr.map((item) => {
            return {
              id: item.idStr,
              parent_id: item.parentStr,
              label: item.name,
              btnshow: 0,
              count: item.count
            }
          })
          filterArr.length > 0 ? (item.children = filterArr) : ''
        })

        this.clickId = this.data[0].id
        this.islistTeacher(this.data[0].id)
      })
    },

    //   tree节点点击
    treeClickNode(data) {
      this.clickId = data.id
      if (data.num === 1) {
        // this.islistTeacherCategory(data.id)
      }
      this.islistTeacher(data.id)
    },
    // 底部btn
    adddata() {
      this.isShowinput = true
    },
    handleCommandSide($event, data) {
      //   编辑
      if ($event === 'edit') {
        this.isEdit = true
        this.isEditId = data.id
        this.compileNewly = 1
        this.dataAddCatalog.input = data.label
      }
      //   新增
      if ($event === 'add') {
        this.addSonInputData = data
        // 展开
        this.expandedKeysData = []
        this.expandedKeysData.push(data.id)

        this.inputAddMark = true
        this.addSonInput(data)
      }
      //移动
      if ($event === 'move') {
        this.dialogFormVisible = true
        this.form.name = data.label
        this.form.optionData = data
      }
      // 删除
      if ($event === 'del') {
        if (data.count) {
          this.$message({
            message: `您选择的${data.btnshow ? '分组' : '分类'}下存在数据，请调整后再删除！`,
            type: 'error'
          })
          return
        }

        this.$confirm(`确定要删除选中的${data.btnshow ? '分组' : '分类'}么?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.iddeleteTeacherCatalog(data.id)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },

    // 新增子类输入框
    addSonInput(data) {
      this.compileNewly = 0
      let i = this.data.indexOf(data)
      let idNum = Math.floor(Math.random() * 10000)
      if (i == '-1') return
      this.data[i].children.push({
        label: '- -',
        btnshow: 0,
        id: idNum,
        myid: data.id
      })
      this.isEdit = true
      this.isEditId = idNum
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
      this.islistTeacher()
    },
    handlePageSizeChange(param) {
      this.page.size = param
      this.islistTeacher()
    },

    // 搜索
    handleSearch(searchParams) {
      this.islistTeacher('', searchParams)
    },
    // 批量删除
    handleRemoveItems(selection) {
      this.$confirm('确定将选择数据删除?', {
        type: 'warning'
      })
        .then(() => {
          let params = {
            ids: ''
          }

          for (let i = 0; i < selection.length; i++) {
            params.ids += selection[i].idStr + ','
          }
          Teacherdelete(params).then(() => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.islistTeacherCategory()
          })
        })
        .then(() => {
          // 删除完成后更新视图
          this.$refs.table.clearSelection()
          this.islistTeacherCategory()
        })
    },

    // 刷新列表数据
    refreshTableData() {},

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
      }
      .select {
        border-bottom: 3px solid #1677ff;
      }
    }
    .draft_issue {
      padding-top: 25px;
      display: flex;
      height: 600px;
      overflow: hidden;
      .issue_l {
        position: relative;
        width: 20%;
        border-right: 1px solid #ccc;
        padding: 20px;
        height: 600px;
        .issue_l_tree {
          // padding: 0 25px;
          width: 100%;
          height: 100%;
          padding-bottom: 200px;
          overflow: auto;
          &::-webkit-scrollbar {
            display: none;
          }
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
          left: 0;
          height: 50px;
          width: 100%;
          border-top: 1px solid #ccc;
          .btn1 {
            display: block;
            background-color: #fff;
            cursor: pointer;
            line-height: 50px;
            height: 100%;
            width: 100%;
            text-align: center;
            color: #1677ff;
          }
        }
      }
      .issue_r {
        width: 75%;
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

      // /deep/ .el-icon-more {
      //   transform: rotate(-90deg);
      // }
      .right-content {
        display: none;
      }

      &:hover {
        .right-content {
          display: inline-block;
        }
      }
      .more-column {
        display: inline-block;
        transform: rotate(90deg);
        -ms-transform: rotate(90deg); /* IE 9 */
        -moz-transform: rotate(90deg); /* Firefox */
        -webkit-transform: rotate(90deg); /* Safari 和 Chrome */
        -o-transform: rotate(90deg);
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
      margin-top: 5px;
      display: flex;
      line-height: 35px;
      .isShowinput_input {
        width: 65%;
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
}
/deep/.el-card,
/deep/.is-never-shadow {
  border: none;
}

/deep/ .el-popover {
  width: 60% !important;
  margin-left: 300px !important;
}
::v-deep .el-popover {
  width: 60% !important;
  margin-left: 300px !important;
}

.el-popover {
  width: 60% !important;
  margin-left: 300px !important;
}

/deep/.el-pagination {
  padding-right: 50px;
  /deep/ .el-input {
    width: 65px;
  }
}
</style>
