<template>
  <div>
    <page-header
      :title="form.id && !copy ? '编辑随机试卷' : '新建随机试卷'"
      show-back
    />
    <basic-container
      v-loading="loading"
      block
    >
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
            <span class="tip">
              <span>（当前总分数{{ totalScore == 0 ? 0 : totalScore }}分</span>
              <span v-if="form.totalScore">，剩余分数：{{ surplusScore }}分</span>）
            </span>
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
              <el-input-number
                v-model="row.questionNum"
                style="width: 120px"
                controls-position="right"
                :min="0"
                :step="1"
                :precision="0"
                @change="questionChange($event, row)"
              />
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
            <el-input-number
              v-model="row.score"
              style="width: 120px"
              controls-position="right"
              :min="0"
              :step="1"
              :precision="1"
              @change="questionChange($event, row)"
            />
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
          <el-button
            size="medium"
            @click="handleBack"
          >
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
import { getQuestionList } from '@/api/examManage/question'
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
    itemType: 'inputNumber',
    min: 0,
    precision: 1,
    step: 0.1,
    maxlength: 32,
    required: false,
    span: 11,
    label: '计划总分'
  },
  {
    prop: 'isScore',
    itemType: 'radio',
    type: 'radio',
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
    maxlength: 200,
    required: false
  }
]
const TABLE_COLUMNS = [
  {
    label: '试题类型',
    prop: 'type',
    slot: true,
    minWidth: 120
  },
  {
    label: '试题来源',
    prop: 'categoryId',
    slot: true,
    minWidth: 220
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
    minWidth: 145
  },
  {
    label: '单题分数',
    slot: true,
    prop: 'score',
    minWidth: 145
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
    minWidth: 100
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
      copy: '',
      form: {
        name: '',
        categoryId: '',
        expiredTime: '',
        totalScore: undefined,
        remark: '',
        isScore: '',
        isShowScore: '',
        isMulti: ''
      },
      loading: false,
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
        label: '试题来源',
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
      totalScore: 0,
      surplusScore: 0,
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
      columns: BASE_COLUMNS
    }
  },
  watch: {
    /**
     * @author guanfenda
     * @desc 如果改变了计划分数 重新计算剩余分数
     * */
    'form.totalScore'() {
      this.questionChange()
    },
    'form.isScore'() {
      let totalScore = this.columns.find((it) => it.prop == 'totalScore')
      if (this.form.isScore) {
        totalScore.required = true
      } else {
        totalScore.required = false
      }
    }
  },
  activated() {
    this.form = {
      name: '',
      categoryId: '',
      expiredTime: '',
      totalScore: undefined,
      remark: '',
      isScore: '',
      isShowScore: '',
      isMulti: ''
    }
    this.tableData = []
    this.options = []
    this.valid = false
    this.totalScore = 0
    this.surplusScore = 0
    this.form.isScore = 0
    for (let key in QUESTION_TYPE_MAP) {
      //这里是格式化题目类型结构
      this.options.push({ value: key, label: QUESTION_TYPE_MAP[key] })
    }
    this.copy = this.$route.query.copy
    this.getData()
    this.getTestPaperCategory()
    if (!this.$route.query.id) {
      this.pushItem()
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    next()
  },
  methods: {
    /**
     * @author guanfenda
     * @desc  试题类型改变，试题来源重新请求
     * @params data 类型的值，row 当前行改变的数据
     * */
    handeleTestQuestions(data, row) {
      row.categoryIds = []
      row.totalQuestionNum = ''
      row.questionNum = ''
      this.getTopicCategory(data, row.column)
    },
    /**
     * @author fuanfenda
     * treeSelect 属性格式化（过滤）
     * */
    itemAttrs(column) {
      const copy = { ...defaultAttrs[column.itemType] }
      for (const key in column) {
        if (!noneItemAttrs.includes(key)) {
          copy[key] = column[key]
        }
      }

      return copy
    },
    /**
     * @author guanfenda
     * @desc 获取试题来源，并绑定试题来源数据
     * @param relateType 试题类型 column 试题来源potions
     * */
    getTopicCategory(relateType = '', column) {
      //single_choice
      let params = {
        type: '0',
        relateType: relateType,
        expireStatus: '1'
      }
      getcategoryTree(params).then(async (res) => {
        this.column.props.treeParams.data = res

        let categoryObject = await this.category(relateType)
        column.props.treeParams.data = [
          { id: 0, name: '未分类', relatedNum: categoryObject.totalNum },
          ...res
        ]
      })
    },
    /***
     * @author guanfendca
     * @desc 获取未分类
     *
     * */
    category(relateType) {
      let params = {
        status: 'normal',
        pageNo: 1,
        pageSize: 1,
        type: relateType
      }

      return new Promise((resolve, reject) => {
        getQuestionList(params)
          .then((res) => {
            resolve(res)
          })
          .finally(() => {
            reject()
          })
      })
    },
    /**
     * @author guanfenda
     * @desc 添加试题
     * */
    pushItem() {
      let tableItem = _.cloneDeep(this.tableItem)
      tableItem.column = _.cloneDeep(this.column)
      this.tableData.push(tableItem)
      this.getTopicCategory(tableItem.type, tableItem.column)
    },
    /**
     * @author guanfenda
     * @desc 获取试卷分类
     * */
    getTestPaperCategory() {
      let params = {
        type: '1',
        expireStatus: '1'
      }
      getcategoryTree(params).then((res) => {
        this.columns.find((it) => it.prop === 'categoryId').props.treeParams.data = res
      })
    },
    /**
     * @author guanfenda
     * @desc 查找试卷详情
     * */
    getData() {
      this.columns.find((it) => it.prop === 'name').disabled = false
      if (!this.$route.query.id) return //如果没有试卷id，终止下面代码
      let params = {
        id: this.$route.query.id
      }
      this.loading = true
      getTestPaper(params)
        .then((res) => {
          let {
            id,
            expiredTime,
            categoryId,
            totalScore,
            remark,
            name,
            isScore,
            isShowScore,
            randomSettings,
            isMulti
          } = res
          //后台要精确到一位小数，返回是乘以10
          totalScore = totalScore / 10
          this.form = {
            id,
            name,
            categoryId,
            expiredTime,
            totalScore,
            remark,
            isScore,
            isShowScore,
            isMulti
          }
          randomSettings.map((data) => {
            data.column = _.cloneDeep(this.column)
            this.getTopicCategory(data.type, data.column)
          })
          this.tableData = randomSettings.map((it) => ({ ...it, score: it.score / 10 }))
          !this.copy && (this.columns.find((it) => it.prop === 'name').disabled = true)
        })
        .finally(() => {
          this.loading = false
        })
    },
    /**
     * @author guanfenda
     * @desc 试题设置里的行操作删除
     * */
    handleDelete(row) {
      this.tableData = this.tableData.filter((it) => it.id !== row.id)
      this.questionChange()
    },
    /***
     * @author gaunfenda
     * @desc 提交试卷（添加或者修改）
     * */
    onSubmit() {
      this.valid = true
      if (!this.surplusScore || this.surplusScore == '0') {
        this.$refs.form.validate().then((valid) => {
          if (!valid) return
          if (
            this.tableData.filter(
              (it) =>
                !it.categoryIds || !it.questionNum || !it.totalQuestionNum || !parseInt(it.score)
            ).length > 0
          ) {
            //检查行是否选择了试题来源，试卷试题是否配置，是否选择了题库试题有试题数的，是否给了分数
            this.$message.warning('请检查试题设置')
            return
          }
          //后台要精确到一位小数，提交是乘以10
          let randomSettings = this.tableData.map((it) => ({ ...it, score: it.score * 10 }))
          let form = _.cloneDeep(this.form)
          form.totalScore = form.totalScore * 10
          let params = {
            ...form,
            randomSettings: randomSettings,
            type: 'random'
          }
          let testPaperMether =
            this.$route.query.id && !this.$route.query.copy ? putTestPaper : postTestPaper
          this.loading = true
          testPaperMether(params)
            .then(() => {
              this.$message.success('提交成功')
              this.handleBack()
            })
            .finally(() => {
              this.loading = false
            })
        })
      } else {
        this.$message.error('请正确分配剩余分数')
      }
    },
    /**
     * @author guanfenda
     * @desc 试题改变或者分数改变都会触发，重新计算剩余分数，和当前总分数
     * */
    questionChange() {
      let scoreList = _.compact(this.tableData.map((it) => it.score * it.questionNum))
      scoreList.length === 0 && (this.surplusScore = this.form.totalScore)
      let totalScore = 0
      scoreList.length &&
        (totalScore = scoreList.reduce((prev, cur) => {
          return Number(prev) + Number(cur)
        }, 0))
      this.totalScore = totalScore.toFixed(1)
      if (this.form.totalScore) {
        let score = (this.form.totalScore - this.totalScore) * 10
        this.surplusScore = (Math.round(score) / 10).toString()
      }
    },
    /**
     * @author guanfenda
     * @desc 试题来源改变触发的事件
     * @params row 当前触发行的数据，data 选中的节点数据
     * */
    check(data, row) {
      row.totalQuestionNum = _.compact(data.map((it) => it.relatedNum)).reduce((prev, cur) => {
        return prev + cur
      }, 0)
      let random = (min, max) => Math.floor(Math.random() * (max - min)) + min
      row.questionNum = random(1, row.totalQuestionNum)
      this.questionChange()
    },
    /**
     * @author guanfenda
     * @desc 添加行
     * */
    handleAddTopic() {
      this.tableItem.id += 1
      this.valid = false
      this.pushItem()
    },
    /**
     * @author guanfenda
     * @desc 返回上一页
     * */
    handleBack() {
      this.$router.back()
      this.$store.commit('DEL_TAG', this.tag)
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
