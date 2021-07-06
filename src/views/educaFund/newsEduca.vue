<template>
  <div class="fill">
    <page-header
      :title="yTit"
      show-back
      :back="goBack"
    />
    <basic-container block>
      <el-form
        ref="basicForm"
        :model="formData"
        :rules="basicFormRules"
        label-position="top"
      >
        <el-row :gutter="60">
          <el-col :span="10">
            <el-form-item
              label="年度"
              prop="year"
            >
              <el-select
                v-model="formData.year"
                style="width:100%;"
                placeholder="请选择年度"
              >
                <el-option
                  v-for="item in yearOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="年度预算"
              prop="budget"
              class="inputNumber"
            >
              <el-input-number
                v-model="formData.budget"
                style="width:100%;"
                controls-position="right"
                placeholder="请输入金额"
                :precision="2"
                :min="0"
                :max="9999999999.99"
              />
              <a class="inputNumber-icon">￥</a>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item>
              <div style="display:flex;align-items: center;justify-content:space-between">
                <h3 class="title">
                  经费类型
                </h3>
                <el-button
                  size="medium"
                  type="primary"
                  @click="handleAdd('add')"
                >
                  添加经费
                </el-button>
              </div>
              <common-table
                ref="table"
                :loading="loading"
                :columns="columns"
                :config="tableConfig"
                :data="tableData"
              >
                <template
                  slot="handler"
                  slot-scope="scope"
                >
                  <el-button
                    type="text"
                    size="medium"
                    @click.stop="handleAdd(scope.row, scope.$index)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    size="medium"
                    @click.stop="handleDel(scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </common-table>
            </el-form-item>
          </el-col>
          <el-col>
            <el-button
              type="primary"
              size="medium"
              @click="handleSubmit"
            >
              完成
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </basic-container>

    <el-dialog
      :close-on-click-modal="false"
      append-to-body
      :title="title[mTit]"
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
      >
        <el-form-item
          label="类型名称"
          prop="catalogueName"
        >
          <el-autocomplete
            v-model.trim="typeFormData.catalogueName"
            style="width:100%;"
            :maxlength="32"
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
import {
  addEducat,
  updateEducat,
  addCatalogue,
  delCatalogue,
  updateCatalogue,
  repeatCatalogue,
  yearsList
} from '@/api/educaFund/educaFund'
const FORM_TABLE = [
  {
    label: '类型名称',
    prop: 'catalogueName',
    width: 300
  },
  {
    label: '类型描述',
    prop: 'catalogueDesc'
  }
]
const TABLE_CONFIG = {
  maxHeight: 360,
  showHandler: true, //是否显示操作列
  showIndexColumn: false, //是否显示序号列
  rowKey: 'id',
  handlerColumn: {
    //操作列配置
    width: 110,
    fixed: false
  }
}
export default {
  name: 'NewsEduca',
  components: {},
  data() {
    return {
      title: { edit: '编辑年度经费', add: '创建年度经费', j_add: '添加经费', j_edit: '编辑经费' },
      yTit: '',
      mTit: 'j_add',
      operation: 'add',
      loading: false,
      tableData: [],
      tableConfig: TABLE_CONFIG,
      columns: FORM_TABLE,
      formData: {
        year: '' //年度
      },
      yearOptions: [],
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
      basicFormRules: {
        year: [{ required: true, message: '请选择年度', trigger: 'change' }],
        budget: [{ required: true, message: '请输入年度预算', trigger: ['blur', 'change'] }]
      },
      typeFormrules: {
        catalogueName: [{ required: true, message: '请选择教育经费类型名称', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.operation = this.$route.query.operation
    const TAG_LABEL = this.title[this.operation]
    this.$store.commit('SET_TAG_LABEL', TAG_LABEL)
    document.title = TAG_LABEL
    this.setYear()
    this.getYear()
    if (this.operation == 'edit') {
      //编辑
      const data = this.$route.query.operData
      this.tableData = data.type || [] //经费类型
      this.$set(this.formData, 'year', data.year)
      this.$set(this.formData, 'budget', data.budget)
      this.$set(this.formData, 'educationFundId', data.id)
    } else {
      //新增
      this.tableData = []
    }
    this.yTit = this.title[this.operation]
  },

  methods: {
    goBack() {
      this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
      this.$refs.basicForm.clearValidate()
      this.$router.back(-1)
    },
    setYear() {
      //设置年度
      this.yearOptions = []
      const y = new Date().getFullYear()
      const q = y - 2020
      for (let i = 0; i < q + 3; i++) {
        this.yearOptions.push({ label: 2020 + i, value: 2020 + i, disabled: false })
      }
    },
    getYear() {
      //设置年度
      yearsList().then((res) => {
        const year = res || []
        this.yearOptions.forEach((item) => {
          if (year.join(',').indexOf(item.label) > -1) {
            item.disabled = true
          }
        })
        if (this.operation == 'edit') {
          this.yearOptions.forEach((val) => {
            if (val.value == this.formData.year) {
              val.disabled = false
            }
          })
        }
      })
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
      if (val === 'add') {
        //新增
        this.mTit = 'j_add'
      } else {
        //编辑
        this.$set(this.typeFormData, 'catalogueName', val.catalogueName)
        this.$set(this.typeFormData, 'catalogueDesc', val.catalogueDesc)
        this.$set(this.typeFormData, 'id', val.id)
        this.$set(this.typeFormData, 'index', index)
        this.mTit = 'j_edit'
      }
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
    //经费类型校验重复
    handleRepeat() {
      const catalogueIds = this.tableData.map((val) => val.id).join(',')
      const params = {
        name: this.typeFormData.catalogueName,
        catalogueIds
      }
      if (this.operation === 'edit') {
        params.educationFundId = this.formData.educationFundId
      }
      return params
    },

    //编辑和新增经费类型弹窗
    async submit() {
      if (this.mTit === 'j_add') {
        await repeatCatalogue(this.handleRepeat())
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const params = {
            catalogueName: this.typeFormData.catalogueName,
            catalogueDesc: this.typeFormData.catalogueDesc
          }
          let func = updateCatalogue
          let successTxt = '修改成功'
          if (this.mTit === 'j_add') {
            func = addCatalogue
            successTxt = '新增成功'
          } else {
            params.id = this.typeFormData.id
          }
          this.loading = true
          func(params).then((res) => {
            this.loading = false
            if (this.mTit === 'j_add') {
              //新增
              const obj = {
                catalogueName: this.typeFormData.catalogueName,
                catalogueDesc: this.typeFormData.catalogueDesc,
                id: res
              }
              this.tableData.push(obj)
            } else {
              //编辑
              this.tableData[
                this.typeFormData.index
              ].catalogueName = this.typeFormData.catalogueName
              this.tableData[
                this.typeFormData.index
              ].catalogueDesc = this.typeFormData.catalogueDesc
            }
            this.$message.success(successTxt)
            this.handleClose()
          })
        }
      })
    },

    // 完成操作
    handleSubmit() {
      this.$refs.basicForm.validate((valid) => {
        if (valid) {
          let successTxt = '修改成功'
          const fun = this.operation === 'add' ? addEducat : updateEducat
          const id = this.tableData.map((val) => val.id).join(',')
          const params = {
            year: this.formData.year,
            budget: this.formData.budget,
            ids: id
          }
          if (this.operation === 'add') {
            successTxt = '新建成功'
          } else {
            params.id = this.formData.educationFundId
          }
          this.loading = true
          fun(params)
            .then(() => {
              this.$message.success(successTxt)
              this.loading = false
              this.goBack()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
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
}
.form-item-des {
  margin-bottom: 0;
  .typeDes-num {
    text-align: right;
    margin: 0;
  }
  /deep/.el-form-item__content {
    line-height: 1;
  }
}
</style>
