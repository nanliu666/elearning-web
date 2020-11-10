<template>
  <div>
    <page-header title="技能管理">
      <template slot="rightMenu">
        <el-button
          type="primary"
          size="medium"
          @click="handlerAdd"
        >
          新建技能
        </el-button>
      </template>
    </page-header>
    <nav
      v-if="show"
      class="nav"
    >
      <span>使用指南：技能是在岗位基础上，对相同工作职责不同负责方向和所属能力的区分，如：开发工程师技能包括JAVA、C++等</span>
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
            <!--<div>-->
            <!--<div class="aside_header">-->

            <!--</div>-->
            <!--</div>-->
            <div class="aside_header">
              <span>岗位</span>
              <el-tooltip
                content="岗位设置"
                placement="right-end"
                effect="dark"
              >
                <i
                  class="el-icon-setting"
                  @click="jump"
                />
              </el-tooltip>
              <!--              <span-->
              <!--                class="el-icon-setting"-->
              <!--                @click="jump"-->
              <!--              />-->
            </div>
            <div class="aside_header">
              <el-input
                v-model="form.jobName"
                placeholder="岗位名称"
                prefix-icon="el-icon-search"
                clearable
                @input="searchJob"
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
                  <i
                    v-if="index === 0"
                    class="el-icon-folder-opened icon"
                  />{{ item.title }}
                </li>
              </ul>
            </div>
          </el-aside>
          <el-main>
            <div style="margin-top: 20px;height: calc(100vh - 292px);overflow: auto">
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
                        v-model="form.skillName"
                        placeholder="技能名称"
                        clearable
                        style="width:200px;margin-right:12px;"
                        @input="searchSkill"
                      />
                    </div>
                    <div>
                      <i
                        class="icon  el-icon-refresh-right"
                        @click="getJobList()"
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
                    @click.stop="handleCommand($event, scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </common-table>
            </div>
          </el-main>
        </el-container>
      </div>
      <skill-dialog
        v-if="positionDialog"
        :dialog-visible.sync="positionDialog"
        :row.sync="row"
        :title="title"
        :is-edit="isEdit"
        :org-tree="jobTree"
        @onsubmit="positionOnsubmit"
      />
    </div>
  </div>
</template>

<script>
// import { getCategoryList, gotV1Job, deleteV1Job, getJobTree } from '@/api/organize/position'
import { getJobList, getSkillList, deleteSkill } from '@/api/gradeTree/skill'
import { getToken } from '@/util/auth'
import skillDialog from '../compoents/skillDialog'

export default {
  name: 'Index',
  components: {
    skillDialog
  },
  data() {
    return {
      selectionList: [],
      row: {},
      number: '',
      jobTree: [],
      isBatch: false,
      isEdit: false,
      title: '新建技能',
      positionDialog: false,
      show: true,
      form: {
        skillName: '',
        jobName: ''
      },
      loading: false,
      active: 0,
      asideList: [],
      data: [],
      tableConfig: {
        showHandler: true,
        enableMultiSelect: true,
        enablePagination: true,
        showIndexColumn: false,
        rowKey: 'id',
        handlerColumn: {
          width: 110
        }
      },
      columns: [
        {
          label: '技能编码',
          prop: 'id'
        },
        {
          label: '技能名称',
          prop: 'name'
        },
        {
          label: '岗位',
          prop: 'jobName'
        },
        {
          label: '技能职责',
          prop: 'duty',
          slot: true
        },
        {
          label: '技能要求',
          prop: 'requirement'
        }
      ],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 1
      },
      skillParams: {
        pageNo: 1,
        pageSize: 10,
        skillName: '',
        jobId: ''
      },
      jobParams: {
        jobName: ''
      }
    }
  },

  mounted() {
    this.getJobList()
    this.getSkillData()
    // this.getTree()
  },
  activated() {
    this.getJobList()
    this.getSkillData()
    // this.getTree()
  },
  methods: {
    jump() {
      this.$router.push({ path: '/gradeTree/position/index' })
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
        this.$confirm(`很抱歉，您选中的技能 ${name} 下存在员工，请先将员工调整后再删除`, {
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

      this.$confirm('您确定要删除你所选中的技能吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          ids: list.map((i) => i.id).join(',')
        }
        deleteSkill(params).then(() => {
          this.getJobList()
          this.getSkillData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    closeBatch() {
      this.isBatch = false
    },
    handlerAdd() {
      this.isEdit = false
      this.title = '新增技能'
      this.positionDialog = true
      this.row = {}
    },
    positionOnsubmit() {
      this.getJobList()
      this.getSkillData()
    },
    close() {
      this.show = false
    },
    //技能数据
    getSkillData() {
      this.loading = true
      this.skillParams.skillName = this.form.skillName
      this.skillParams = {
        ...this.skillParams,
        ...this.page
      }
      getSkillList(this.skillParams).then((res) => {
        this.loading = false
        this.data = res.data
        this.page.currentPage = this.skillParams.pageNo
        this.page.total = res.totalNum
      })
    },
    //岗位名称数据
    getJobList() {
      getJobList(this.jobParams).then((res) => {
        this.asideList = res
        let all = {
          name: '',
          title: '全部',
          jobId: null,
          skillNum: 0
        }
        this.asideList.map((it) => {
          all.skillNum += it.skillNum
          it.title = it.jobName + '(' + it.skillNum + ')'
        })
        all.title = all.title + `(${all.skillNum})`
        this.asideList.unshift(all)
        let newArr = JSON.parse(JSON.stringify(this.asideList))
        this.jobTree = newArr.splice(0, 1)
      })
    },
    //岗位名称搜索
    searchJob: _.debounce(function() {
      this.jobParams.jobName = this.form.jobName
      this.getJobList()
    }, 500),
    //技能名称搜索
    searchSkill: _.debounce(function() {
      this.skillParams.skillName = this.form.skillName
      this.getSkillData()
    }, 500),
    sizeChange(val) {
      this.page.pageNo = 1
      this.page.pageSize = val
      this.getJobList()
    },
    currentChange(val) {
      this.page.pageNo = val
      this.getJobList()
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
    handleConfig(row) {
      // this.configVisible = !this.configVisible
      this.row = JSON.parse(JSON.stringify(row))
      this.isEdit = false
      this.title = '新建子岗位'
      this.positionDialog = true
    },
    handleAside(item, index) {
      this.active = index
      this.skillParams.jobId = item.jobId
      this.page.pageNo = 1
      // console.log('this.skillParams', this.skillParams)
      this.getSkillData()
    },
    //编辑技能
    handleCheck(row) {
      this.row = JSON.parse(JSON.stringify(row))
      this.isEdit = true
      this.title = '编辑技能'
      this.positionDialog = true
    },
    //单删
    handleCommand(event, row) {
      if (row.workNum) {
        this.$confirm('很抱歉，您选中的技能下存在员工，请先将员工调整后再删除', {
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
      this.$confirm('您确定要删除该技能吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            ids: row.id
          }
          deleteSkill(params).then(() => {
            this.getJobList()
            this.getSkillData()
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
.el-aside.aside {
  height: calc(100vh - 292px);
  overflow: auto;
}
.position {
  margin-top: 16px;
  background: #ffffff;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 24px !important;
  min-height: calc(100% - 204px);
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
.aside {
  width: 200px;
  border-right: 1px solid #efefef;
  height: 100%;
  box-sizing: border-box;
  margin-right: 20px;
  margin-top: 20px;
  ul {
    list-style: none;
    padding: 0 10px 0 0;
    margin-top: 10px;
    line-height: 34px;
    li {
      cursor: pointer;
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
