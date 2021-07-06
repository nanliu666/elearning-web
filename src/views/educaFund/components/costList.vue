<template>
  <basic-container
    block
    style="padding-top: 0"
  >
    <common-table
      ref="crud"
      :config="tableConfig"
      :columns="columns"
      :loading="loading"
      :data="tableData"
      :page="page"
      @current-page-change="currentChange"
      @page-size-change="sizeChange"
    >
      <template slot="topMenu">
        <div class="operations">
          <search-popover
            ref="searchPopover"
            :require-options="searchConfig.requireOptions"
            :popover-options="searchConfig.popoverOptions"
            @submit="handleSubmitSearch"
          />
          <div class="total-cost">
            <span>累计使用：￥{{ totalMoney }}</span>
          </div>
        </div>
      </template>
      <template
        slot="handler"
        slot-scope="{ row }"
      >
        <el-button
          v-p="EDUCA_DETAIL_EDIT"
          size="medium"
          type="text"
          @click="handleEdit(row)"
        >
          编辑
        </el-button>
        <el-button
          v-p="EDUCA_DETAIL_DEL"
          size="medium"
          type="text"
          @click="handleDel(row)"
        >
          删除
        </el-button>
      </template>
    </common-table>

    <!-- 创建编辑预算费用 -->
    <el-dialog
      :close-on-click-modal="false"
      append-to-body
      :title="title[opera]"
      :visible="visible"
      width="550px"
      :modal-append-to-body="false"
      @close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="formDataRules"
        label-position="top"
        class="newOrgDailog"
      >
        <el-form-item
          label="项目名称"
          prop="projectName"
        >
          <el-input
            v-model.trim="formData.projectName"
            :disabled="formData.trainId ? true : false"
            type="text"
            :maxlength="200"
            placeholder="请输入项目名称"
          />
        </el-form-item>
        <!-- prop="budgetCatalogueId" -->
        <el-form-item label="经费类型">
          <el-select
            v-model="formData.budgetCatalogueId"
            style="width:100%;"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectType"
              :key="item.id"
              :label="item.catalogueName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="预算"
          prop="budget"
          class="inputNumber"
        >
          <el-input-number
            v-model="formData.budget"
            :disabled="formData.trainId ? true : false"
            style="width:100%;"
            controls-position="right"
            placeholder="请输入金额"
            :precision="2"
            :max="9999999999.99"
            :min="0"
          />
          <a class="inputNumber-icon">￥</a>
        </el-form-item>

        <el-form-item
          label="使用费用"
          prop="budgetUsed"
          class="inputNumber"
        >
          <el-input-number
            v-model="formData.budgetUsed"
            style="width:100%;"
            controls-position="right"
            :precision="2"
            placeholder="请输入金额"
            :max="9999999999.99"
            :min="0"
          />
          <a class="inputNumber-icon">￥</a>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="medium"
          @click="handleClose"
        >取消</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="submit"
        >确定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getCatalogueList,
  projectList,
  delProject,
  updateProject,
  addProject
} from '@/api/educaFund/educaFund'
// import { getOrgTree } from '@/api/org/org'

import { EDUCA_DETAIL_EDIT, EDUCA_DETAIL_DEL } from '@/const/privileges'
const COLUMNS = [
  {
    label: '项目名称',
    prop: 'projectName',
    minWidth: 150
  },
  {
    label: '使用费用（元）',
    prop: 'budgetUsed',
    minWidth: 150
  },
  {
    label: '预算（元）',
    prop: 'budget',
    minWidth: 150
  },
  {
    label: '经费类型',
    prop: 'catalogueName',
    minWidth: 150
  },
  {
    label: '更新时间',
    prop: 'updateTime',
    minWidth: 150
  }
]
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    type: 'input',
    field: 'projectName',
    options: [],
    config: { placeholder: '输入项目名称搜索', 'suffix-icon': 'el-icon-search' }
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    type: 'select',
    field: 'catalogueName',
    label: '经费类型',
    options: [],
    config: { optionLabel: 'catalogueName', optionValue: 'catalogueName', placeholder: '请选择' }
  },
  {
    type: 'dataPicker',
    field: 'startTime,endTime',
    placeholder: '请选择',
    label: '时间',
    config: {
      // 显示类型
      type: 'daterange'
    }
  }
]
const SEARCHCONFIG = {
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS,
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS
}
const TABLECONFIG = {
  showHandler: true,
  enablePagination: true,
  showIndexColumn: false,
  rowKey: 'id',
  handlerColumn: {
    width: '120',
    fixed: false
  }
}

export default {
  name: 'CostList',
  components: {
    SearchPopover: () => import('@/components/searchPopOver/index')
  },
  props: {
    activeOrg: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: { edit: '编辑', add: '创建费用预算' },
      opera: 'edit',
      visible: false,
      formData: {
        projectName: '',
        budgetCatalogueId: ''
      },
      formDataRules: {
        projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        // budgetCatalogueId: [{ required: true, message: '请选择经费类型', trigger: 'change' }],
        budget: [{ required: true, message: '请输入金额', trigger: ['blur', 'change'] }],
        budgetUsed: [{ required: true, message: '请输入金额', trigger: ['blur', 'change'] }]
      },
      columns: COLUMNS,
      searchConfig: SEARCHCONFIG,
      tableConfig: TABLECONFIG,
      selectType: [], //经费类型
      tableData: [],
      totalMoney: 0,
      loading: false,
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      searchParams: {
        orgIds: '',
        startTime: '',
        endTime: '',
        catalogueName: '',
        projectName: ''
      }
    }
  },
  computed: {
    EDUCA_DETAIL_EDIT: () => EDUCA_DETAIL_EDIT,
    EDUCA_DETAIL_DEL: () => EDUCA_DETAIL_DEL
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([EDUCA_DETAIL_EDIT, EDUCA_DETAIL_DEL])
      },
      deep: true
    },
    activeOrg(val) {
      this.searchParams.orgIds = val.join(',')
      this.loadData(true)
    }
  },

  mounted() {
    this.getAllType()
    this.loadData()
  },
  methods: {
    sizeChange(pageSize) {
      this.page.size = pageSize
      this.loadData(true)
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage
      this.loadData()
    },
    //列表数据
    loadData(isLoad) {
      if (isLoad) {
        this.page.currentPage = 1
      }
      this.loading = true
      const param = {
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        ...this.searchParams
      }
      projectList(param)
        .then((res) => {
          const list = res.list || {}
          this.totalMoney = res.allBudgetUsed || 0
          this.page.total = list.totalNum
          this.tableData = list.data || []
        })
        .finally(() => {
          this.loading = false
          this.visible = false
        })
    },
    //经费类型集合
    async getAllType(year = '') {
      await getCatalogueList({ year }).then((res) => {
        if (year) {
          this.selectType = res
        } else {
          this.searchConfig.popoverOptions.forEach((val) => {
            if (val.field == 'catalogueName') {
              val.options = res
            }
          })
        }
      })
    },

    //关闭弹出层
    handleClose() {
      this.formData = {
        projectName: '',
        budgetCatalogueId: '',
        isTrain: '',
        trainId: ''
      }
      this.$refs.ruleForm.resetFields()
      this.visible = false
    },
    //编辑
    async handleEdit(row) {
      const y = new Date().getFullYear()
      await this.getAllType(row.year || y)
      const catalogueId = this.selectType.find((item) => item.id == row.catalogueId)
      this.formData = {
        id: row.id,
        projectName: row.projectName,
        budget: row.budget || 0,
        budgetUsed: row.budgetUsed || 0,
        trainId: row.trainId,
        isTrain: row.isTrain,
        people: row.people || 0
      }
      if (catalogueId) {
        this.formData.budgetCatalogueId = row.catalogueId
      }
      this.opera = 'edit'
      this.visible = true
    },
    //删除
    handleDel(row) {
      const content = '您确定要删除该明细记录吗？'
      this.$confirm(content, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delProject({ id: row.id }).then(() => {
            this.$message.success('删除成功')
            this.loadData(true)
          })
        })
        .catch(() => {})
    },
    //计算服务年限
    calcuSerive(budget) {
      if (budget >= 3000 && budget < 5000) {
        return 1
      } else if (budget >= 5000 && budget < 10000) {
        return 2
      } else if (budget >= 10000 && budget < 20000) {
        return 3
      } else if (budget >= 20000 && budget < 50000) {
        return 5
      }
      return 10
    },
    //编辑和新增提交
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          //此处需要调用接口做校验
          if (this.opera === 'edit') {
            if (this.formData.isTrain && Number(this.formData.isTrain) >= 1) {
              const budgetUsed = parseFloat(
                (this.formData.budgetUsed / this.formData.people).toFixed(2)
              )
              if (budgetUsed >= 3000 && parseInt(this.formData.people) > 0) {
                this.$confirm('实际费用达到额度，是否需要员工签订协议', '提醒', {
                  distinguishCancelAndClose: true,
                  confirmButtonText: '需要',
                  cancelButtonText: '不需要',
                  type: 'warning'
                })
                  .then(() => {
                    const serviceYear = this.calcuSerive(budgetUsed)
                    const query = {
                      projectName: this.formData.projectName,
                      trainId: this.formData.trainId,
                      serviceYear,
                      costBudgetAvg: budgetUsed
                    }
                    this.$router.push({
                      //跳转【培训协议管理】-创建协议
                      path: '/agreement/edit',
                      query: query
                    })
                    this.editFunc('agree')
                  })
                  .catch((e) => {
                    if (e === 'cancel') {
                      this.editFunc()
                    }
                  })
                return
              }
            }
            this.editFunc()
          } else {
            this.addFunc()
          }
        }
      })
    },

    //编辑
    editFunc(name) {
      const param = {
        budgetCatalogueId: this.formData.budgetCatalogueId,
        projectName: this.formData.projectName,
        budget: this.formData.budget,
        budgetUsed: this.formData.budgetUsed,
        id: this.formData.id
      }
      updateProject(param).then(() => {
        if (name !== 'agree') {
          this.$message.success('修改成功')
        }
        this.loadData(true)
      })
    },
    //新增
    addFunc() {
      const param = {
        budgetCatalogueId: this.formData.budgetCatalogueId || '',
        projectName: this.formData.projectName,
        budget: this.formData.budget,
        budgetUsed: this.formData.budgetUsed,
        educationFundId: ''
      }
      this.selectType.forEach((val) => {
        if (val.id == this.formData.budgetCatalogueId) {
          param.educationFundId = val.educationFundId
        }
      })
      addProject(param).then(() => {
        this.$message.success('创建成功')
        this.loadData(true)
      })
    },
    //筛选确认
    handleSubmitSearch(params) {
      _.assign(this.searchParams, params)
      this.loadData(true)
    }
  }
}
</script>

<style lang="scss" scoped>
$color_icon: #a0a8ae;
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
.inputNumber {
  position: relative;
  /deep/.el-input__inner {
    padding-left: 22px;
  }
  .inputNumber-icon {
    font-size: 15px;
    position: absolute;
    left: 6px;
    top: 0;
    bottom: 0;
    margin: auto;
  }
}
.operations {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /deep/.el-dialog__body {
    padding: 10px 20px;
  }
  .total-cost {
    font-size: 15px;
    color: $color_icon;
  }
}
</style>
