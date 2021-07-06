<template>
  <div class="fill">
    <page-header
      :title="title"
      show-back
      :back="goBack"
    >
    </page-header>
    <basic-container block>
      <common-table
        ref="table"
        :columns="columns"
        :config="tableConfig"
        :data="tableData"
        :loading="loading"
      >
        <template #year="{ row }">
          <div class="ellipsis title">
            {{ row.year }}
          </div>
        </template>

        <template
          slot="handler"
          slot-scope="scope"
        >
          <el-button
            v-p="EDUCA_INFO_EDIT"
            type="text"
            size="medium"
            @click.stop="handleAdd(scope.row, scope.$index)"
          >
            编辑
          </el-button>
          <el-button
            v-p="EDUCA_INFO_DEL"
            type="text"
            size="medium"
            @click.stop="handleDel(scope.row)"
          >
            删除
          </el-button>
        </template>
      </common-table>
    </basic-container>

    <el-dialog
      :close-on-click-modal="false"
      append-to-body
      title="编辑经费"
      :visible="visible"
      width="550px"
      :modal-append-to-body="false"
      @close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :model="typeFormData"
        :rules="typeFormrules"
        label-position="top"
        class="newOrgDailog"
      >
        <el-form-item
          label="类型名称"
          prop="catalogueName"
        >
          <el-autocomplete
            v-model.trim="typeFormData.catalogueName"
            style="width:100%;"
            :fetch-suggestions="querySearch"
            placeholder="请输入或选择教育经费类型名称"
          ></el-autocomplete>
        </el-form-item>

        <el-form-item
          class="form-item-des"
          label="类型描述"
        >
          <el-input
            v-model.trim="typeFormData.catalogueDesc"
            type="textarea"
            :rows="3"
            :maxlength="200"
            placeholder="请输入"
            show-word-limit
          />
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
  </div>
</template>

<script>
import { getEducatList, delCatalogue, updateCatalogue } from '@/api/educaFund/educaFund'
import { EDUCA_INFO_EDIT, EDUCA_INFO_DEL } from '@/const/privileges'

const TABLE_CONFIG = {
  showHandler: true, //是否显示操作列
  rowKey: 'id',
  handlerColumn: {
    //操作列配置
    width: 110,
    fixed: false
  }
}
const COLUMNS = [
  {
    label: '类型名称',
    prop: 'catalogueName',
    minWidth: 120
  },
  {
    label: '类型描述',
    prop: 'catalogueDesc',
    minWidth: 200
  },
  {
    label: '年度预算（元）',
    prop: 'catalogueBudget',
    width: 130
  },
  {
    label: '使用费用（元）',
    prop: 'catalogueBudgetUsed',
    width: 130
  },
  {
    label: '剩余费用（元）',
    prop: 'id',
    width: 130,
    formatter: (row) => {
      const money = row.catalogueBudget - row.catalogueBudgetUsed
      return (money && money.toFixed(2)) || '--'
    }
  },
  {
    label: '创建时间',
    prop: 'updateTime'
  },
  {
    label: '创建人',
    prop: 'userName'
  }
]

export default {
  name: 'EducaInfo',
  components: {},
  data() {
    return {
      title: '',
      query: {},
      loading: false,
      tableData: [],
      page: {
        size: 10,
        currentPage: 1,
        total: 0
      },
      columns: COLUMNS,
      tableConfig: TABLE_CONFIG,
      selectType: [
        { label: '外购培训费用', value: '外购培训费用' },
        { label: '外派培训费用', value: '外派培训费用' },
        { label: '课程开发及授课费用', value: '课程开发及授课费用' },
        { label: '培训教学用品费用', value: '培训教学用品费用' },
        { label: '技能大师工作室建设费用', value: '技能大师工作室建设费用' },
        { label: '市级及以上职业技能竞赛费用', value: '市级及以上职业技能竞赛费用' }
      ],
      visible: false,
      typeFormData: {
        catalogueName: '',
        catalogueDesc: ''
      },
      typeFormrules: {
        catalogueName: [{ required: true, message: '请选择教育经费类型名称', trigger: 'change' }]
      }
    }
  },
  computed: {
    EDUCA_INFO_EDIT: () => EDUCA_INFO_EDIT,
    EDUCA_INFO_DEL: () => EDUCA_INFO_DEL
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([EDUCA_INFO_EDIT, EDUCA_INFO_DEL])
      },
      deep: true
    }
  },
  mounted() {
    const data = this.$route.query
    this.title = data.year + '年度经费'
    this.query.id = data.id
    this.loadData()
  },
  methods: {
    goBack() {
      this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
      this.$router.back(-1)
    },
    sizeChange(val) {
      this.page.size = val
      this.loadData(true)
    },
    pageChange(val) {
      this.page.currentPage = val
      this.loadData()
    },

    querySearch(queryString, cb) {
      var results = queryString
        ? this.selectType.filter(this.createFilter(queryString))
        : this.selectType
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    //关闭弹出层
    handleClose() {
      this.typeFormData = {
        catalogueName: '',
        catalogueDesc: ''
      }
      this.$refs.ruleForm.resetFields()
      this.visible = false
    },
    //添加经费
    handleAdd(val, index) {
      this.$set(this.typeFormData, 'catalogueName', val.catalogueName)
      this.$set(this.typeFormData, 'catalogueDesc', val.catalogueDesc)
      this.$set(this.typeFormData, 'id', val.id)
      this.$set(this.typeFormData, 'index', index)
      this.visible = true
    },
    //经费删除
    handleDel(row) {
      const id = row.id
      delCatalogue({ id })
        .then(() => {
          this.$message.success('删除成功')
          this.tableData = this.tableData.filter((val) => val.id != id)
        })
        .catch(() => {
          this.$message.error('删除失败')
        })
    },

    //编辑经费类型弹窗
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const params = {
            catalogueName: this.typeFormData.catalogueName,
            catalogueDesc: this.typeFormData.catalogueDesc,
            id: this.typeFormData.id
          }
          this.loading = true
          updateCatalogue(params).then(() => {
            this.loading = false
            this.tableData[this.typeFormData.index].catalogueName = this.typeFormData.catalogueName
            this.tableData[this.typeFormData.index].catalogueDesc = this.typeFormData.catalogueDesc

            this.$message.success('修改成功')
            this.handleClose()
          })
        }
      })
    },

    // 加载分组数据
    loadData(isLoad) {
      if (isLoad) {
        this.$set(this.page, 'currentPage', 1)
      }
      const params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        id: this.query.id
      }
      this.loading = true
      getEducatList(params)
        .then((res) => {
          this.tableData = res.data[0].type
          this.page.total = res.data[0].type.length
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
  .title {
    color: $primaryColor;
    cursor: pointer;
  }
}
.form-item-des {
  margin-bottom: 0;
  /deep/.el-form-item__content {
    line-height: 1;
  }
}
</style>
