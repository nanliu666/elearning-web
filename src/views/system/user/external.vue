<template>
  <div>
    <page-header title="外部联系人">
      <template slot="rightMenu">
        <el-button
          type="primary"
          size="medium"
          @click="handlerAdd"
        >
          添加外部联系人
        </el-button>
      </template>
    </page-header>
    <div class="position">
      <div style="min-height: 100%">
        <el-container style="height: 100%">
          <el-aside
            class="aside"
            style="width: 300px;"
          >
            <div>
              <div class="aside_header">
                <el-input
                  v-model="searchInfo"
                  placeholder="分类名称"
                  prefix-icon="el-icon-search"
                  clearable
                  @input="searchCategory"
                />
              </div>
              <div>
                <ul style="max-height: 600px;overflow: auto;">
                  <li
                    v-for="(item, index) in asideList"
                    :key="index"
                    :class="[
                      item.isDefault === 1 ? 'selection' : '',
                      index === active ? 'actives' : '',
                      'base-style'
                    ]"
                    @click="handleAside(item, index)"
                  >
                    <template v-if="!item.edit">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="item.name"
                        placement="top-start"
                        :enterable="false"
                        :disabled="item.disabled"
                      >
                        <div
                          class="category__item"
                          style="width: 80%;"
                        >
                          <span
                            ref="actives_spans"
                            class="actives_spans"
                          >
                            {{ item.name }}
                          </span>
                          <span style="margin-left: 12px;">({{ item.userNum }})</span>
                        </div>
                      </el-tooltip>

                      <span class="category__item--operation">
                        <el-dropdown @command="(handler) => handler()">
                          <span class="el-dropdown-link">
                            <i class="el-icon-more" />
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                              :command="() => handleItemEditBtnClick(item)"
                              :disabled="unEditAble.includes(item.name)"
                            >编辑</el-dropdown-item>
                            <el-dropdown-item
                              :command="() => handleRemoveItemBtnClick(item)"
                              :disabled="unEditAble.includes(item.name)"
                            >删除</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </span>
                    </template>
                    <template v-else>
                      <div class="new-category">
                        <el-input
                          v-model="categoryName"
                          placeholder="请输入分类名称"
                          clearable
                          maxlength="20"
                        />
                        <el-button
                          type="text"
                          style="margin-left: 8px;"
                          :disabled="categoryName === item.name"
                          @click="handleModifyCategory(item)"
                        >
                          确定
                        </el-button>
                        <el-button
                          type="text"
                          style="color: #666666;"
                          @click="closeCategoryInput(item)"
                        >
                          取消
                        </el-button>
                      </div>
                    </template>
                  </li>
                  <li
                    v-if="showAddCategoryInput"
                    class="new-category"
                  >
                    <el-input
                      ref="categoryInput"
                      v-model="categoryName"
                      placeholder="请输入分类名称"
                      clearable
                      maxlength="20"
                    />
                    <el-button
                      type="text"
                      style="margin-left: 8px;"
                      @click="handleNewCategory"
                    >
                      确定
                    </el-button>
                    <el-button
                      type="text"
                      style="color: #666666;"
                      @click="closeCategoryInput"
                    >
                      取消
                    </el-button>
                  </li>
                </ul>
              </div>
            </div>
            <div
              v-if="!showAddCategoryInput"
              class="add-category"
            >
              <el-button
                type="text"
                icon="el-icon-circle-plus"
                @click="newCategory"
              >
                新建分类
              </el-button>
            </div>
          </el-aside>
          <el-main style="margin-left: 20px;">
            <div style="margin-top: 20px">
              <common-table
                style="width: 100%"
                :data="data"
                :page="page"
                :loading="loading"
                :config="tableConfig"
                :columns="columns"
                @page-size-change="sizeChange"
                @current-page-change="currentChange"
              >
                <template slot="topMenu">
                  <div class="flex-flow flex justify-content">
                    <div>
                      <el-input
                        v-model="form.name"
                        placeholder="姓名/账号"
                        clearable
                        style="width:200px;margin-right:12px;"
                        @input="search"
                      />
                    </div>
                    <div class="flex">
                      <el-button
                        type="text"
                        class="export-btn"
                        icon="el-icon-upload2"
                      >
                        导出
                      </el-button>
                      <div>
                        <i
                          class="icon el-icon-refresh-right"
                          @click="getUserData({ pageNo: params.pageNo })"
                        />
                      </div>
                    </div>
                  </div>
                </template>
                <template
                  slot="multiSelectMenu"
                  slot-scope="{ selection }"
                >
                  <span class="all">
                    <span
                      @click="handlerResetAll(selection)"
                    ><i class="el-icon-delete" /> 批量重置密码</span>
                    <span
                      @click="handlerSuspendAll(selection)"
                    ><i class="el-icon-delete" /> 批量冻结</span>
                    <span
                      @click="handlerUnsuspendAll(selection)"
                    ><i class="el-icon-delete" /> 批量解冻</span>
                    <span
                      @click="handlerRemoveAll(selection)"
                    ><i class="icon-export" /> 批量移出</span>
                    <span
                      @click="handlerExportAll(selection)"
                    ><i class="icon-export" /> 批量导出</span>
                  </span>
                </template>
                <template
                  slot="handler"
                  slot-scope="scope"
                >
                  <el-button
                    type="text"
                    size="medium"
                    @click.stop="handleConfig(scope.row, scope.index)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    size="medium"
                    @click.stop="handleReset(scope.row, scope.index)"
                  >
                    密码重置
                  </el-button>
                  <el-dropdown
                    style="margin-left: 15px"
                    trigger="hover"
                    @command="handleCommand($event, scope.row)"
                  >
                    <span class="el-dropdown-link">
                      <i class="el-icon-more" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-if="scope.row.userStatus === '1'"
                        command="suspend"
                      >
                        冻结
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.userStatus === '2'"
                        command="unsuspend"
                      >
                        解冻
                      </el-dropdown-item>
                      <el-dropdown-item command="remove">
                        移出
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </common-table>
            </div>
          </el-main>
        </el-container>
      </div>
    </div>
    <!-- 添加客户弹窗 -->
    <AddUser
      ref="userEdit"
      :visible.sync="userEditVisible"
      :category-list="categoryList"
      v-on="{
        submitAdd: (query, again) => handleUserEditSubmit({ query, type: 'add', again }),
        submitEdit: (query, again) => handleUserEditSubmit({ query, type: 'edit', again })
      }"
    />
  </div>
</template>

<script>
import {
  getAllCategory,
  addCategory,
  deleteCategory,
  editCategory,
  getExternalContactDatas,
  resetPwd,
  modifyUserStatus,
  deleteExternalContact,
  addExternalContact,
  editExternalContact
} from '@/api/system/user'
import AddUser from './addUser'
import { COLUMNS, USERSTATUS } from './config'

export default {
  name: 'External',
  components: {
    AddUser
  },
  data() {
    return {
      userEditVisible: false, // 用户编辑弹窗
      showAddCategoryInput: false, // 分类输入框
      categoryName: '', // 分类名称
      searchInfo: '', // 查询分类名称
      categoryObj: {}, // 选中的分类
      userInfo: {}, // 编辑的用户信息
      form: {
        name: ''
      },
      loading: false,
      active: 0,
      asideList: [],
      categoryList: [], // 新增外部联系人需要的分类数组
      data: [],
      tableConfig: {
        showHandler: true,
        enableMultiSelect: true,
        enablePagination: true,
        showIndexColumn: false,
        emptyText: '暂无联系人，赶快添加一个吧',
        rowKey: 'userId',
        handlerColumn: {
          width: 200
        }
      },
      columns: COLUMNS,
      page: {
        pageSize: 10,
        pageNo: 1,
        total: 1
      },
      params: {
        pageNo: 1,
        pageSize: 5,
        search: '',
        categoryId: ''
      },
      userStatus: USERSTATUS,
      unEditAble: ['全部', '未分类']
    }
  },
  mounted() {
    this.getCategory(this.getUserData)
  },
  activated() {
    this.getCategory()
  },
  methods: {
    handleUserEditSubmit({ query, type, again }) {
      const userEdit = this.$refs.userEdit
      let message = ''
      let api = null
      switch (type) {
        case 'add':
          api = addExternalContact
          message = '添加成功'
          break
        case 'edit':
          api = editExternalContact
          message = '修改成功'
          break
        default:
          return
      }
      userEdit.loading = true
      api(query)
        .then(() => {
          // 重新设置分类的数量
          if (type === 'add') {
            this.asideList.forEach((item, index) => {
              if (item.id === query.categoryId || index === 0) {
                item.userNum += 1
              }
            })
          } else if (type === 'edit') {
            this.asideList.forEach((item) => {
              if (item.id === query.categoryId) {
                item.userNum += 1
              }
              if (item.id === this.userInfo.categoryId) {
                item.userNum -= 1
              }
            })
          }
          this.$message.success(message)
          this.$refs.userEdit.close()
          this.getUserData()
          // 继续添加联系人
          if (again) {
            this.handlerAdd()
          }
        })
        .catch((err) => {
          this.$message.warning(err.resMsg)
        })
    },
    handleItemEditBtnClick(row) {
      // 处理全部这个分类不能被编辑
      if (!row.id) {
        this.$message.error('默认分类不可编辑')
        return
      }
      this.closeCategoryInput()
      this.asideList.forEach((item) => {
        if (item.id !== row.id) {
          item.edit = false
        } else {
          item.edit = true
        }
      })
      this.categoryName = row.name
      this.$forceUpdate()
    },
    // 弹窗函数抽取
    confirmDialog(textInfo, type, callback, params) {
      const h = this.$createElement
      let newDatas = [
        h(
          'span',
          {
            class: `el-icon-${type}`,
            style: 'color:#ffbf00;font-size:20px;dispaly:inline-block;margin-right:10px;'
          },
          ''
        ),
        h('span', null, `确认${textInfo.target}？`),
        h(
          'div',
          { style: 'margin-left: 30px;margin-top:10px;line-height:20px;' },
          `你确定要将已选中${textInfo.category}${textInfo.target}吗？`
        )
      ]
      this.$confirm('', {
        message: h('div', null, newDatas),
        confirmButtonText: '确 定',
        cancelButtonText: '取 消'
      })
        .then(() => {
          if (callback) callback(params)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消${textInfo.target}`
          })
        })
    },
    handleRemoveItemBtnClick(row) {
      let textInfo = {
        target: '删除',
        category: '分类'
      }
      this.confirmDialog(textInfo, 'warning', this.deleteCategory, row)
    },
    deleteCategory(row) {
      if (['全部', '未分类'].includes(row.name)) {
        this.$message.error('默认分类不可删除')
        return
      }
      if (row.userNum > 0) {
        this.$message.warning('您选中的分类下存在联系人，请先将联系人调整后再删除')
        return
      }
      deleteCategory({ ids: row.id })
        .then(() => {
          this.$message.success('删除成功')
          this.closeCategoryInput()
          this.getCategory()
        })
        .catch((error) => {
          this.$message.error(error.resMsg)
        })
    },
    handleModifyCategory(data) {
      if (this.categoryName === '全部') {
        this.$message.warning('该分类已存在')
        return
      }
      let params = {
        id: data.id,
        name: this.categoryName
      }
      editCategory(params)
        .then(() => {
          this.$message.success('保存成功')
          this.getCategory()
        })
        .catch((error) => {
          this.$message.error(error.resMsg)
        })
    },
    handleNewCategory() {
      if (this.categoryName === '全部') {
        this.$message.warning('该分类已存在')
        return
      }
      let params = {
        name: this.categoryName
      }
      addCategory(params)
        .then(() => {
          this.$message.success('新建成功')
          this.closeCategoryInput()
          this.getCategory()
        })
        .catch((error) => {
          this.$message.error(error.resMsg)
        })
    },
    closeCategoryInput(row) {
      if (row) row.edit = false
      this.showAddCategoryInput = false
      this.categoryName = ''
    },
    newCategory() {
      this.showAddCategoryInput = true
      this.categoryName = ''
      this.asideList.forEach((item) => {
        item.edit = false
      })
      this.$nextTick(() => {
        this.$refs.categoryInput.focus()
      })
    },
    handlerExportAll() {},
    handlerRemoveAll(list) {
      let textInfo = {
        target: '移出',
        category: '的联系人'
      }
      this.confirmDialog(textInfo, 'warning', this.handlerRemoveAllConfirm, list)
    },
    handlerRemoveAllConfirm(list) {
      let userList = _.cloneDeep(list)
      let queryArray = list.map((item) => {
        return item.userId
      })
      let userIds = queryArray.join(',')
      deleteExternalContact({ ids: userIds })
        .then(() => {
          list.length = 0
          this.$message.success('移出成功')
          // 计算分类统计数量
          this.asideList.forEach((item, index) => {
            if (index === 0) {
              item.userNum -= userList.length
            }
            userList.forEach((user) => {
              if (user.categoryId === item.id) {
                item.userNum -= 1
              }
            })
          })
          this.getUserData()
        })
        .catch(() => {
          this.$message.error('移出失败')
        })
    },
    handlerSuspendAll(list) {
      let textInfo = {
        target: '冻结',
        category: '联系人的账号'
      }
      this.confirmDialog(textInfo, 'warning', this.handlerSuspendAllConfirm, list)
    },
    handlerSuspendAllConfirm(list) {
      let queryArray = list
        .filter((user) => {
          return user.userStatus == this.userStatus.unsuspend
        })
        .map((item) => {
          return item.userId
        })
      if (_.isEmpty(queryArray)) {
        this.$message.warning('选中的联系人账号均已冻结')
        return
      }
      let userId = queryArray.join(',')
      modifyUserStatus(userId, this.userStatus.suspend)
        .then(() => {
          list.length = 0
          this.getUserData()
          this.$message.success('冻结成功')
        })
        .catch(() => {})
    },
    handlerUnsuspendAll(list) {
      let textInfo = {
        target: '解冻',
        category: '联系人的账号'
      }
      this.confirmDialog(textInfo, 'warning', this.handlerUnsuspendAllConfirm, list)
    },
    handlerUnsuspendAllConfirm(list) {
      let queryArray = list
        .filter((user) => {
          return user.userStatus == this.userStatus.suspend
        })
        .map((item) => {
          return item.userId
        })
      if (_.isEmpty(queryArray)) {
        this.$message.warning('选中的联系人账号均为正常')
        return
      }
      let userId = queryArray.join(',')
      modifyUserStatus(userId, this.userStatus.unsuspend)
        .then(() => {
          this.$message.success('解冻成功')
          list.length = 0
          this.getUserData()
        })
        .catch(() => {})
    },
    handlerResetAll(list) {
      this.handleReset(list)
    },
    handlerAdd() {
      this.$refs.userEdit.init()
    },
    getUserData() {
      this.loading = true
      this.params.search = this.form.name

      let params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      }
      this.params.categoryId ? (params.categoryId = this.params.categoryId) : ''
      this.params.search ? (params.search = this.params.search) : ''
      getExternalContactDatas(params).then((res) => {
        this.loading = false
        this.data = res.data
        this.page.total = res.totalNum
        this.$forceUpdate()
      })
    },
    getCategory(callback) {
      let params = {}
      this.searchInfo ? (params.name = this.searchInfo) : ''
      getAllCategory(params).then((res) => {
        this.asideList = _.cloneDeep(res)
        this.categoryList = _.cloneDeep(res)

        let all = {
          id: '',
          name: '全部',
          userNum: 0,
          isDefault: 1,
          createTime: '',
          updateTme: '',
          edit: false
        }
        this.asideList.forEach((it) => {
          all.userNum += it.userNum
          it.edit = false
        })

        this.categoryObj = all

        this.asideList.unshift(all)
        var dom = this.$refs.actives_spans
        dom !== undefined &&
          dom.forEach((item, index) => {
            if (this.isEllipsis(item)) {
              this.asideList[index].disabled = false
            } else {
              this.asideList[index].disabled = true
            }
          })
        if (callback) callback()
      })
    },
    isEllipsis(dom) {
      var checkDom = dom.cloneNode(),
        parent,
        flag
      checkDom.style.width = dom.offsetWidth + 'px'
      checkDom.style.height = dom.offsetHeight + 'px'
      checkDom.style.overflow = 'auto'
      checkDom.style.position = 'absolute'
      checkDom.style.zIndex = -1
      checkDom.style.opacity = 0
      checkDom.style.whiteSpace = 'nowrap'
      checkDom.innerHTML = dom.innerHTML

      parent = dom.parentNode
      parent.appendChild(checkDom)
      flag = checkDom.scrollWidth > checkDom.offsetWidth
      parent.removeChild(checkDom)
      return flag
    },
    searchCategory: _.debounce(function() {
      this.getCategory()
    }, 500),
    search: _.debounce(function() {
      this.getUserData()
    }, 500),
    sizeChange(val) {
      this.page.pageNo = 1
      this.page.pageSize = val
      this.getUserData()
    },
    currentChange(val) {
      this.page.pageNo = val
      this.getUserData()
    },
    handleConfig(row) {
      this.userInfo = _.cloneDeep(row)
      this.$refs.userEdit.init(row)
    },
    handleAside(item, index) {
      this.active = index
      this.params.categoryId = item.id
      this.page.pageNo = 1
      this.getUserData()
    },
    handleReset(data) {
      let cloneData = _.cloneDeep(data)
      let ids
      if (Array.isArray(data)) {
        ids = cloneData.map((item) => item.userId).join(',')
      } else {
        ids = cloneData.userId
      }
      this.$confirm('你确定将已选中联系人的账号密码重置为123456?', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      })
        .then(() => {
          this.resetPwd(ids, data)
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: '重置成功'
          })
        })
    },
    // 重置密码
    resetPwd(ids, data) {
      resetPwd(ids).then(() => {
        Array.isArray(data) ? (data.length = 0) : ''
        this.getUserData()
      })
    },
    handleCommand(command, row) {
      let status = null
      let that = this
      switch (command) {
        case 'suspend':
          status = 2
          that.modifyUserStatus(row.userId, status)
          break
        case 'unsuspend':
          status = 1
          that.modifyUserStatus(row.userId, status)
          break
        case 'remove':
          that.deleteUserConfirm(row)
          break
      }
    },
    deleteUserConfirm(data) {
      const h = this.$createElement
      let newDatas = [
        h(
          'span',
          {
            class: 'el-icon-warning',
            style: 'color:#ffbf00;font-size:20px;dispaly:inline-block;margin-right:10px;'
          },
          ''
        ),
        h('span', null, '确认移出？'),
        h(
          'div',
          { style: 'margin-left: 30px;margin-top:10px;line-height:20px;' },
          `你确定要将${data.name}从联系人中移出吗？`
        )
      ]
      this.$confirm('', {
        message: h('div', null, newDatas),
        confirmButtonText: '确 定',
        cancelButtonText: '取 消'
      })
        .then(() => {
          this.deleteUser(data)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消移出'
          })
        })
    },
    deleteUser(data) {
      this.userInfo = _.cloneDeep(data)
      let userIds = null
      if (Array.isArray(data)) {
        userIds = data.map((item) => item.userId).join(',')
      } else {
        userIds = data.userId
      }
      deleteExternalContact({ ids: userIds })
        .then(() => {
          this.$message.success('移出成功')
          this.asideList.forEach((item, index) => {
            if (item.id === this.userInfo.categoryId || index === 0) {
              item.userNum -= 1
            }
          })
          this.getUserData()
        })
        .catch((error) => {
          this.$message.error(error.resMsg)
        })
    },
    modifyUserStatus(userId, userStatus) {
      let msg = ''
      if (userStatus === 2) {
        msg = '您确定要冻结该用户吗？\n冻结后，该用户将不能登录系统'
      } else {
        msg = '您确定要解冻该用户吗？'
      }
      this.$confirm(msg, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          modifyUserStatus(userId, userStatus)
          this.getUserData()
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.loadData()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
