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
              >
              </el-switch>
            </div>
          </template>
          <template #isShowScore>
            <div>
              <el-switch
                v-model="form.isShowScore"
                inactive-text="试卷上显示试题分数"
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
            <el-cascader
              :ref="'cascader' + row.id"
              v-model="row.categoryId"
              :options="cascaderOptions"
              :props="props"
              collapse-tags
              :show-all-levels="false"
              clearable
              @change="change($event, row)"
            ></el-cascader>
            <div
              v-if="
                (Array.isArray(row.categoryId) && row.categoryId.length === 0) ||
                  (valid && !row.categoryId)
              "
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
                v-else-if="valid && !row.questionNum"
                class="valid"
              >
                请输入
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
const BASE_COLUMNS = [
  {
    prop: 'name',
    itemType: 'input',
    label: '试卷名称',
    span: 11,
    maxlength: 32,
    required: false
  },
  {
    prop: 'categoryId',
    itemType: 'select',
    label: '试卷分类',
    span: 11,
    offset: 2,
    options: [
      { label: '是', value: 1 },
      { label: '否', value: 0 }
    ],
    required: true
  },
  {
    prop: 'totalScore',
    itemType: 'input',
    maxlength: 32,
    label: '计划总分',
    span: 11,
    required: true,
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
    required: true,
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
    label: '过期时间',
    type: 'datetime',
    span: 11,
    required: true,
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
    minWidth: 200
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
const OPTIONS = [
  { label: '单选题', value: 1 },
  { label: '单选题', value: 2 },
  { label: '简答题', value: 3 }
]
const cascaderOptions = [
  {
    value: 1,
    label: '东南',
    children: [
      {
        value: 2,
        label: '上海',
        children: [
          { value: 3, label: '普陀', number: 1 },
          { value: 4, label: '黄埔', number: 2 },
          { value: 5, label: '徐汇', number: 4 }
        ]
      },
      {
        value: 7,
        label: '江苏',
        children: [
          { value: 8, label: '南京', number: 1 },
          { value: 9, label: '苏州', number: 2 },
          { value: 10, label: '无锡', number: 3 }
        ]
      },
      {
        value: 12,
        label: '浙江',
        children: [
          { value: 13, label: '杭州', number: 1 },
          { value: 14, label: '宁波', number: 12 },
          { value: 15, label: '嘉兴', number: 5 }
        ]
      }
    ]
  },
  {
    value: 17,
    label: '西北',
    children: [
      {
        value: 18,
        label: '陕西',
        children: [
          { value: 19, label: '西安', number: 1 },
          { value: 20, label: '延安', number: 4 }
        ]
      },
      {
        value: 21,
        label: '新疆维吾尔族自治区',
        children: [
          { value: 22, label: '乌鲁木齐', number: 3 },
          { value: 22, label: '乌鲁木齐', number: 3 },
          { value: 23, label: '克拉玛依', number: 1 }
        ]
      }
    ]
  }
]
export default {
  name: 'RandomTestPaper',
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      TotalScore: 0,
      score: 0,
      valid: false,
      options: OPTIONS,
      cascaderOptions,
      props: { multiple: true },
      tableData: [],
      tableItem: {
        id: '1',
        type: 1,
        expiredTime: '',
        categoryId: '',
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
    this.tableData.push(_.cloneDeep(this.tableItem))
  },
  methods: {
    handleDelete(row) {
      this.tableData = this.tableData.filter((it) => it.id !== row.id)
      this.questionChange()
    },
    onSubmit() {
      this.valid = true
      this.$refs.form.validate().then((valid) => {
        if (!valid) return
        if (
          this.tableData.filter((it) => !it.categoryId || !it.questionNum || !it.score).length > 0
        )
          return
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
    change(value, data) {
      setTimeout(() => {
        let obj = this.$refs['cascader' + data.id].getCheckedNodes()
        data.totalQuestionNum = _.compact(obj.map((it) => it.data.number)).reduce((prev, cur) => {
          return prev + cur
        }, 0)
        let random = (min, max) => Math.floor(Math.random() * (max - min)) + min
        data.questionNum = random(1, data.totalQuestionNum)
      }, 200)
    },
    handleAddTopic() {
      this.tableItem.id += 1
      this.valid = false
      this.tableData.push(_.cloneDeep(this.tableItem))
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
/deep/.el-switch__label.is-active {
  color: #606266;
}
/deep/.el-switch__label {
  color: #207efa;
}

/deep/.el-table td .cell {
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
