<template>
  <div>
    <page-header title="职级管理">
      <template slot="rightMenu">
        <el-button
          type="primary"
          size="medium"
          @click="handlerAdd"
        >
          新建职级
        </el-button>
      </template>
    </page-header>
    <nav
      v-if="show"
      class="nav"
    >
      <span>使用指南：员工在岗位上的任职资格等级</span>
      <span
        class="el-icon-close"
        style="color:#207EFA;font-size: 20px"
        @click="close"
      />
    </nav>
    <div class="position">
      <div style="height: 100%">
        <el-container style="height: 100%">
          <el-aside
            class="aside"
            style="width: 230px;"
          >
            <!--            <div class="aside_header">
              <span>职级类别</span>
              <el-tooltip
                content="职级类别设置"
                placement="right-end"
                effect="dark"
              />
            </div> -->
            <div>
              <el-input
                v-model="form.catName"
                placeholder="分类名称"
                clearable
                style="width:200px;margin-right:12px;"
                @input="catogorySearch"
              />
            </div>

            <div>
              <ul>
                <li
                  v-for="(item, index) in asideList"
                  :key="index"
                  :class="[index === 0 ? 'selection' : '', index === active ? 'actives' : '']"
                  @click="handleAside(item, index)"
                >
                  <template v-if="!item.edit">
                    <i
                      v-if="index === 0"
                      class="el-icon-folder-opened icon"
                    />
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.title"
                      placement="top"
                      :enterable="false"
                      :disabled="item.disabled"
                    >
                      <div style="display: flex;align-items: center; width: 84%;">
                        <span
                          ref="actives_spans"
                          class="actives_spans"
                        >{{ item.title }} </span>
                        <span>{{ index === 0 ? '' : `(${item.jobLevelNum})` }}</span>
                      </div>
                    </el-tooltip>

                    <span
                      v-if="index !== 0"
                      style="float: right;margin-right: 10px;"
                    >
                      <el-dropdown @command="(handler) => handler()">
                        <span class="el-dropdown-link">
                          <i class="el-icon-more" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            :command="() => handleItemEditBtnClick(item)"
                          >编辑</el-dropdown-item>
                          <el-dropdown-item
                            :command="() => handleRemoveItemBtnClick(item)"
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
                      />
                      <el-button
                        type="text"
                        style="margin-left: 8px;"
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
            <div class="bottom-button flex align-items box-pack-center">
              <el-button
                type="text"
                icon="el-icon-circle-plus-outline"
                @click.stop="showAddNewCat"
              >
                新建分类
              </el-button>
            </div>
          </el-aside>
          <el-main>
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
                  <div class="flex-flow flex justify-content align-items ">
                    <div>
                      <el-input
                        v-model="form.name"
                        placeholder="职级名称"
                        clearable
                        style="width:200px;margin-right:12px;"
                        @input="search"
                      />
                    </div>
                    <div>
                      <i
                        class="icon  el-icon-refresh-right"
                        @click="getClassPositionList({ pageNo: params.pageNo })"
                      />
                    </div>
                  </div>
                </template>
                <template
                  slot="multiSelectMenu"
                  slot-scope="{ selection }"
                >
                  <span class="all">
                    <span
                      @click="handlerDeleteAll(selection)"
                    ><i class="el-icon-delete" /> 批量删除</span>
                  </span>
                </template>
                <template
                  slot="handler"
                  slot-scope="scope"
                >
                  <el-button
                    type="text"
                    size="medium"
                    @click.stop="handleCheck(scope.row, scope.index)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    size="medium"
                    @click.stop="handleCommand(scope.row, scope.index)"
                  >
                    删除
                  </el-button>
                </template>
              </common-table>
            </div>
          </el-main>
        </el-container>
      </div>
      <position-dialog
        v-if="positionDialog"
        :dialog-visible.sync="positionDialog"
        :cat-list="asideList"
        :title="title"
        :is-edit="isEdit"
        :org-tree="orgTree"
        @onsubmit="positionOnsubmit"
      />
    </div>
    <cat-dialog
      v-if="catDialog"
      :title="catDialogTitle"
      :dialog-visible.sync="catDialog"
      :is-edit="catEdit"
      :current="currentSelectCat"
      @onsubmit="catOnsubmit"
    />
  </div>
</template>

<script>
import {
  getClassCategoryList,
  deleteV1jobLevel,
  getClassList,
  putCategoryCategory,
  delCategoryCategory,
  addCategoryCategory
} from '@/api/organize/position'
import { getToken } from '@/util/auth'
import positionDialog from '../compoents/classDialog'
import catDialog from '../compoents/classCatDialog'

export default {
  name: 'Index',
  components: {
    positionDialog,
    catDialog
  },
  data() {
    return {
      showAddCategoryInput: false,
      categoryName: '',
      selectionList: [],
      row: {},
      number: '',
      orgTree: [],
      isBatch: false,
      isEdit: false,
      catEdit: false,
      title: '新建职级',
      catDialogTitle: '',
      positionDialog: false,
      catDialog: false,
      show: true,
      form: {
        name: '',
        catName: ''
      },
      currentSelectCat: { id: 0, name: '', remark: '' },
      loading: false,
      active: 0,
      asideList: [],
      data: [],
      tableConfig: {
        showHandler: true,
        enableMultiSelect: true,
        enablePagination: true,
        showIndexColumn: false,
        rowKey: 'jobId',
        handlerColumn: {
          width: 100
        }
      },
      columns: [
        {
          label: '职级编号',
          prop: 'jobLevelId'
        },
        {
          label: '职级名称',
          prop: 'jobLevelName'
        },
        {
          label: '职级类别',
          prop: 'categoryName'
        },
        {
          label: '描述',
          prop: 'remark'
        }
      ],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 1
      },
      params: {
        pageNo: 1,
        pageSize: 5,
        jobName: '',
        categoryId: ''
      }
    }
  },

  mounted() {
    this.getCategory()
    this.getClassPositionList()
    // this.getJobData()
  },
  activated() {
    this.getCategory()
    // this.getClassPositionList()
    // this.getJobData()
    // this.getTree()
  },

  methods: {
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
    // 保存
    handleModifyCategory(data) {
      data.id = data.categoryId
      data.name = this.categoryName
      putCategoryCategory(data)
        .then(() => {
          this.$message.success('修改成功')
          this.catOnsubmit()
          this.closeCategoryInput()
        })
        .catch(() => {
          this.$message.success('修改失败')
        })
    },
    // 取消保存
    closeCategoryInput(row) {
      if (row) row.edit = false
      this.showAddCategoryInput = false
      this.categoryName = ''
    },

    catogorySearch: _.debounce(function() {
      this.params.catName = this.form.catName
      this.getCategory()
      // 职级分类搜索
    }, 500),
    //新建分类
    handleNewCategory() {
      let params = {
        name: this.categoryName
      }
      addCategoryCategory(params)
        .then(() => {
          this.$message.success('分类创建成功')
          this.getCategory()
          this.closeCategoryInput()
        })
        .catch(() => {
          this.$message.error('分类创建失败!')
        })
    },
    jump() {
      this.$router.push({ path: '/gradeTree/position/category' })
    },
    handlerDeleteAll(list) {
      let name = ''
      list.map((item) => {
        if (item.workNum > 0) {
          name += ' ' + item.jobName
        }
      })
      if (name) {
        name = name.length > 18 ? name.substr(0, 18) + '...' : name
        this.$confirm(`很抱歉，您选中的职级 ${name} 下存在员工，请先将员工调整后再删除`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message({
              type: 'info',
              message: '取消操作!'
            })
          })
          .catch(() => {})
        return
      }
      this.$confirm('您确定要删除你所选中的职级吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: list.map((i) => i.jobLevelId).join(',')
        }
        deleteV1jobLevel(params).then(() => {
          this.getClassPositionList()
          this.getCategory()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    handleItemEditBtnClick(row) {
      this.asideList.forEach((item) => {
        if (item.categoryId !== row.categoryId) {
          item.edit = false
        } else {
          item.edit = true
        }
      })
      this.categoryName = row.categoryName
      this.$forceUpdate()
    },
    handleRemoveItemBtnClick(row) {
      if (row.jobLevelNum > 0) {
        this.$confirm('您选中的分类下存在联系人，请先将联系人调整后再删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'info',
            message: '取消操作!'
          })
        })
        return
      }
      this.$confirm('您确定要删除选中的分类么？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            ids: row.categoryId
          }

          delCategoryCategory(params).then(() => {
            this.getClassPositionList()
            this.getCategory()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .then(() => {})
      // delCategoryCategory()
    },

    closeBatch() {
      this.isBatch = false
    },
    handlerAdd() {
      this.isEdit = false
      this.title = '新建职级'
      this.positionDialog = true
      this.row = {}
      this.orgTree = {}
    },
    positionOnsubmit() {
      this.getClassPositionList()
      this.getCategory()
    },
    catOnsubmit() {
      this.getClassPositionList()
      this.getCategory()
    },
    close() {
      this.show = false
    },
    showAddNewCat() {
      //新建类别
      this.showAddCategoryInput = true
    },
    getCategory() {
      let params = {
        categoryName: this.form.catName
      }
      getClassCategoryList(params).then((res) => {
        this.asideList = res

        let all = {
          name: '',
          title: '全部',
          categoryId: null,
          jobLevelNum: 0,
          disabled: true
        }
        this.asideList.map((it) => {
          all.jobLevelNum += it.jobLevelNum
          it.title = it.categoryName
          it.disabled = true
        })
        all.title = all.title + `(${all.jobLevelNum})`

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
      })
    },
    getClassPositionList() {
      //jobLevelName=&categoryId=1319100450372354049&pageNo=1&pageSize=10
      let params = {
        jobLevelName: this.form.name,
        categoryId: this.params.categoryId,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      getClassList(params).then((res) => {
        this.loading = false
        this.data = res.data
        this.page.currentPage = this.params.pageNo
        this.page.total = res.totalNum
      })
    },
    search: _.debounce(function() {
      this.params.jobName = this.form.name
      this.getClassPositionList()
    }, 500),
    sizeChange(val) {
      this.page.pageNo = 1
      this.page.pageSize = val
      this.getClassPositionList()
    },
    currentChange(val) {
      this.page.pageNo = val
      this.getClassPositionList()
    },
    handleExport() {
      this.$confirm('是否导出数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const searchForm = this.form
        window.open(
          `/api/blade-user/export-user?Blade-Auth=${getToken()}&account=${
            searchForm.account
          }&realName=${searchForm.realName}`
        )
      })
    },
    onLoad() {},
    handleAside(item, index) {
      this.loading = true
      this.active = index
      this.params.categoryId = item.categoryId
      this.page.pageNo = 1
      this.currentSelectCat = this.asideList[index]
      this.getClassPositionList()
    },
    handleCheck(row) {
      this.row = JSON.parse(JSON.stringify(row))
      this.orgTree = row
      this.isEdit = true
      this.title = '编辑职级'
      this.positionDialog = true
    },
    handleCommand(row) {
      if (row.workNum) {
        this.$confirm('很抱歉，您选中的职级下存在员工，请先将员工调整后再删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'info',
            message: '取消操作!'
          })
        })
        return
      }
      this.$confirm('您确定要删除该职级吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            ids: row.jobLevelId
          }

          deleteV1jobLevel(params).then(() => {
            this.getClassPositionList()
            this.getCategory()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .then(() => {})
    },
    toggleSelection(val) {
      this.$refs.crud.toggleSelection(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.position {
  margin-top: 16px;
  background: #ffffff;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 24px !important;
  min-height: calc(100% - 204px);
  height: 0;
  .form_ {
    padding-top: 40px;
    width: 400px;
    margin: 0 auto;
    font-size: 14px;
    .label_ {
      /*display: inline-block;*/
      /*margin-top:24px;*/
      /*margin-bottom:8px;*/
    }
    .tip {
      font-size: 12px;
      line-height: 14px;
      color: #a0a8ae;
    }
    .bt {
      /*margin-top: 40px;*/
    }
  }
}
.container > div {
  height: 100%;
}
.aside {
  width: 200px;
  border-right: 1px solid #efefef;
  height: 100%;
  box-sizing: border-box;
  margin-right: 20px;
  margin-top: 20px;
  position: relative;

  ul {
    list-style: none;
    padding: 0 10px 0 0;
    margin-top: 10px;
    line-height: 34px;
    li {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    li:nth-child(n + 2) {
      justify-content: space-between;
    }
    li:not(.selection) {
      line-height: 34px;
      font-size: 14px;
      padding-left: 30px;
    }
    .selection {
      .icon {
        display: inline-block;
        margin: 0 6px 0 6px;
        font-size: 18px;
      }
    }
    .actives {
      border-right: 4px solid #1e9fff;
      background: #efefef;
    }
    .new-category {
      display: flex;
      align-items: center;
      margin-left: -10px;
    }
    .actives_spans {
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      white-space: nowrap;
    }
  }
  .bottom-button {
    width: 100%;
    height: 70px;
    background: transparent;
    position: absolute;
    bottom: 0;
    left: 0;
    box-shadow: 0 -3px 5px rgb(180, 180, 180);
    .el-button {
      width: 100%;
      height: 100%;
    }
  }
}

.nav {
  display: flex;
  display: -ms-flex;
  display: -moz-box;
  display: -webkit-flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  line-height: 26px;
  padding: 5px 20px;
  margin-top: -6px;
  background: #edf8ff;
  border: 1px solid #73b9ff;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}
.aside_header {
  display: flex;
  display: -ms-flex;
  display: -moz-box;
  display: -webkit-flex;
  align-items: center;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 0 10px 0px 0px;
  padding-bottom: 10px;
  font-size: 18px;
  border-bottom: 1px solid #efefef;
  /*line-height: 40px;*/
}
.flex {
  display: flex;
  display: -ms-flex;
  display: -moz-box;
  display: -webkit-flex;
}
.flex-flow {
  flex-flow: row nowrap;
}
.justify-content {
  justify-content: space-between;
}
.align-items {
  align-items: center;
}
.box-pack-center {
  /*子元素主轴居中*/
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.input-with-select {
  width: 250px;
}
.condition {
  margin: 20px 0 10px 0;
}

.all {
  /*border: 1px solid #efefef;*/
  cursor: pointer;
  padding: 10px;
  span:first-child {
    /*border-right: 1px solid #999;*/
    padding-right: 15px;
  }
  span {
    margin-right: 20px;
  }
}

/deep/ .el-card__body {
  padding-bottom: 0 !important;
}

/deep/ .avue-crud__menu {
  min-height: 0;
}
.handler {
  width: 200px;
}
.icon {
  font-size: 18px;
  color: #a0a8ae;
  cursor: pointer;
}
</style>
