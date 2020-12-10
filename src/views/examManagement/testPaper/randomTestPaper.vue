<template>
  <div>
    <page-header
      title="新建随机试卷"
      show-back
    />
    <basic-container block>
      <div class="content">
        <div class="title">
          基础信息
        </div>
        <commonForm
          ref="form"
          :model="form"
          class="form"
          :columns="columns"
        >
          <template #isMulti>
            <div>
              <el-switch
                v-model="form.isMulti"
                inactive-text="单项变为不定项选择"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </div>
          </template>
          <template #isShowScore>
            <div>
              <el-switch
                v-model="form.isShowScore"
                inactive-text="试卷上显示试题分数"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </div>
          </template>
        </commonForm>
        <div class="title flex flex-justify-between">
          <div>
            试题设置:
            <span
              class="tip"
            >（当前总分数{{ TotalScore }}分<span
              v-if="form.totalScore"
            >，剩余分数：{{ score }}分</span>）</span>
          </div>
          <div>
            <el-button
              size="medium"
              type="primary"
              @click="handleAddTopic"
            >
              添加题目
            </el-button>
          </div>
        </div>
        <common-table
          id="demo"
          ref="table"
          class="table"
          :columns="columnsVisible | columnsFilter"
          :config="tableConfig"
          :data="tableData"
        >
          <template #type="{row}">
            <el-select
              v-model="row.type"
              placeholder="请选择"
              @change="handeleTestQuestions($event, row)"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
          <template #categoryId="{row}">
            <el-tree-select
              :ref="'cascader' + row.id"
              v-model="row.categoryIds"
              :select-params="row.column.props && row.column.props.selectParams"
              :tree-params="row.column.props && row.column.props.treeParams"
              v-bind="itemAttrs(row.column)"
              :placeholder="
                row.column.placeholder ? row.column.placeholder : `请选择${row.column.label}`
              "
              @valueChange="check($event, row)"
            />
            <div
              v-if="valid && row.categoryIds.length === 0"
              class="valid"
            >
              请选择
            </div>
          </template>
          <template #totalQuestionNum="{row}">
            <div v-if="row.totalQuestionNum">
              {{ row.totalQuestionNum }}
            </div>
            <div v-else>
              一 一
            </div>
          </template>
          <template #questionNum="{row}">
            <div>
              <el-input
                v-model="row.questionNum"
                placeholder="请输入内容"
                type="Number"
              >
              </el-input>
              <div
                v-if="row.questionNum > row.totalQuestionNum"
                class="valid"
              >
                不能大于题库总数
              </div>
              <div
                v-else-if="(valid && row.questionNum == 0) || (valid && !row.questionNum)"
                class="valid"
              >
                不能为小于等于0
              </div>
            </div>
          </template>
          <template #score="{row}">
            <el-input
              v-model="row.score"
              placeholder="请输入内容"
              type="Number"
              @change="questionChange($event, row)"
            >
            </el-input>
            <div
              v-if="valid && !row.score"
              class="valid"
            >
              请输入
            </div>
            <div
              v-else-if="valid && row.score == 0"
              class="valid"
            >
              不能输入为0
            </div>
          </template>
          <template #handler="{row}">
            <el-button
              type="text"
              :disabled="tableData.length === 1"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </common-table>
        <div class="flex flexcenter footer">
          <el-button
            type="primary"
            size="medium"
            @click="onSubmit"
          >
            完成
          </el-button>
          <el-button size="medium">
            取消
          </el-button>
        </div>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { postTestPaper, putTestPaper, getTestPaper } from '@/api/examManagement/achievement'
import { getcategoryTree } from '@/api/examManage/category'
import { defaultAttrs, noneItemAttrs } from '@/components/common-form/config'
import { QUESTION_TYPE_MAP } from '@/const/examMange'

const BASE_COLUMNS = [
  {
    prop: 'name',
    itemType: 'input',
    label: '试卷名称',
    span: 11,
    maxlength: 32,
    required: true
  },
  {
    itemType: 'treeSelect',
    label: '试卷分类',
    prop: 'categoryId',
    props: {
      selectParams: {
        placeholder: '请选择分类',
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
          value: 'id',
          disabled: true
        },
        required: true
      }
    },
    required: false,
    span: 11,
    offset: 2
  },
  {
    prop: 'totalScore',
    itemType: 'input',
    maxlength: 32,
    label: '计划总分',
    span: 11,
    required: false,
    props: {
      onlyNumber: true
    }
  },
  {
    prop: 'isScore',
    itemType: 'radio',
    label: '是否折算成计划分数',
    span: 11,
    offset: 2,
    required: false,
    options: [
      { label: '是', value: 1 },
      { label: '否', value: 0 }
    ]
  },
  {
    prop: 'isMulti',
    itemType: 'slot',
    label: '',
    span: 11,
    required: false
  },
  {
    prop: 'isShowScore',
    itemType: 'slot',
    label: '',
    span: 11,
    offset: 2,
    required: false,
    props: {}
  },
  {
    prop: 'expiredTime',
    itemType: 'datePicker',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    label: '过期时间',
    type: 'datetime',
    span: 11,
    required: false,
    props: {
      label: 'label',
      value: 'value'
    }
  },
  {
    prop: 'remark',
    itemType: 'input',
    label: '备注',
    type: 'textarea',
    span: 24,
    maxlength: 32,
    required: false
  }
]
const TABLE_COLUMNS = [
  {
    label: '试题类型',
    prop: 'type',
    slot: true,
    minWidth: 150
  },
  {
    label: '试题来源',
    prop: 'categoryId',
    slot: true,
    minWidth: 250
  },
  {
    label: '题库试题总数',
    prop: 'totalQuestionNum',
    align: 'center',
    slot: true,
    minWidth: 120
  },
  {
    label: '试卷试题数',
    prop: 'questionNum',
    slot: true,
    minWidth: 120
  },
  {
    label: '单题分数',
    slot: true,
    prop: 'score',
    minWidth: 120
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  defaultExpandAll: false,
  showIndexColumn: true,
  enablePagination: false,
  enableMultiSelect: false, // TODO：关闭批量删除
  handlerColumn: {
    minWidth: 150
  }
}

export default {
  name: 'RandomTestPaper',
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  components: {
    elTreeSelect: () => import('@/components/elTreeSelect/elTreeSelect')
  },
  data() {
    return {
      column: {
        page: {
          currentPage: 1,
          pageSize: 10,
          pageNo: 1,
          total: 0
        },
        span: 20,
        prop: 'orgId',
        itemType: 'treeSelect',
        label: '请选择上级组织',
        required: true,
        offset: 2,
        props: {
          selectParams: {
            placeholder: '请选择试题来源',
            multiple: true,
            collapseTags: true
          },
          treeParams: {
            data: [],
            'show-checkbox': true,
            'check-strictly': true,
            'default-expand-all': false,
            'expand-on-click-node': false,
            clickParent: true,
            multiple: true,
            filterable: false,
            props: {
              children: 'children',
              label: 'name',
              value: 'id'
            }
          }
        }
      },
      TotalScore: 0,
      score: 0,
      valid: false,
      options: QUESTION_TYPE_MAP,
      props: { multiple: true },
      tableData: [],
      tableItem: {
        id: '1',
        type: 'single_choice',
        expiredTime: '',
        categoryIds: [],
        totalQuestionNum: '',
        questionNum: '',
        score: '',
        isShowScore: '',
        isMulti: ''
      },
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS,
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      columns: BASE_COLUMNS,
      form: {}
    }
  },
  watch: {
    TotalScore(val) {
      if (this.form.totalScore) {
        this.score = this.form.totalScore - val
      }
    },
    'form.totalScore'() {
      this.questionChange()
    }
  },
  mounted() {
    this.options = []
    for (let key in QUESTION_TYPE_MAP) {
      this.options.push({ value: key, label: QUESTION_TYPE_MAP[key] })
    }
    this.getData()
    this.getTestPaperCategory()
    if (!this.$route.query.id) {
      this.pushItem()
    }
  },
  methods: {
    handeleTestQuestions(data, row) {
      this.getTopicCategory(data, row.column)
    },
    itemAttrs(column) {
      const copy = { ...defaultAttrs[column.itemType] }
      for (const key in column) {
        if (!noneItemAttrs.includes(key)) {
          copy[key] = column[key]
        }
      }

      return copy
    },
    getTopicCategory(relateType = '', column) {
      //single_choice
      let params = {
        type: '0',
        relateType: relateType
      }
      getcategoryTree(params).then((res) => {
        this.column.props.treeParams.data = res
        column.props.treeParams.data = res
      })
    },
    pushItem() {
      let tableItem = _.cloneDeep(this.tableItem)
      tableItem.column = _.cloneDeep(this.column)
      this.tableData.push(tableItem)
      this.getTopicCategory(tableItem.type, tableItem.column)
    },
    getTestPaperCategory() {
      let params = {
        type: '1'
      }
      getcategoryTree(params).then((res) => {
        this.columns.find((it) => it.prop === 'categoryId').props.treeParams.data = res
      })
    },
    getData() {
      if (!this.$route.query.id) return
      let params = {
        id: this.$route.query.id
      }
      getTestPaper(params).then((res) => {
        let {
          id,
          expiredTime,
          categoryId,
          totalScore,
          remark,
          name,
          isScore,
          isShowScore,
          randomSettings
        } = res
        this.form = { id, name, categoryId, expiredTime, totalScore, remark, isScore, isShowScore }
        randomSettings.map((data) => {
          data.column = _.cloneDeep(this.column)
          this.getTopicCategory(data.type, data.column)
        })
        this.tableData = randomSettings
      })
    },
    handleDelete(row) {
      this.tableData = this.tableData.filter((it) => it.id !== row.id)
      this.questionChange()
    },
    onSubmit() {
      this.valid = true
      this.$refs.form.validate().then((valid) => {
        if (!valid) return
        if (
          this.tableData.filter(
            (it) =>
              !it.categoryIds || !it.questionNum || !it.totalQuestionNum || !parseInt(it.score)
          ).length > 0
        )
          return
        let testPaperMether =
          this.$route.query.id && !this.$route.query.copy ? putTestPaper : postTestPaper
        let params = {
          ...this.form,
          randomSettings: this.tableData,
          type: 'random'
        }
        testPaperMether(params).then(() => {
          this.$message.success('提交成功')
        })
      })
    },
    questionChange() {
      let scoreList = _.compact(this.tableData.map((it) => it.score))
      scoreList.length === 0 && (this.score = this.form.totalScore)
      scoreList.length &&
        (this.TotalScore = scoreList.reduce((prev, cur) => {
          return Number(prev) + Number(cur)
        }, 0))
    },
    check(data, row) {
      row.totalQuestionNum = _.compact(data.map((it) => it.relatedNum)).reduce((prev, cur) => {
        return prev + cur
      }, 0)
      let random = (min, max) => Math.floor(Math.random() * (max - min)) + min
      row.questionNum = random(1, row.totalQuestionNum)
    },
    handleAddTopic() {
      this.tableItem.id += 1
      this.valid = false
      this.pushItem()
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
}

.title {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 20px;
  padding-right: 30px;

  .tip {
    /*font-weight: 400;*/
    font-size: 14px;
  }
}

.content {
  max-width: 896px;
  margin: 0 auto;

  .form {
  }

  .table {
  }
}

/deep/ .el-switch__label.is-active {
  color: #606266;
}

/deep/ .el-switch__label {
  color: #207efa;
}

/deep/ .el-table td .cell {
  line-height: 60px !important;
}

.valid {
  position: absolute;
  line-height: 18px !important;
  bottom: -3px;
  font-size: 12px;
  color: #f56c6c;
}

.footer {
  margin-top: 30px;
}
</style>
