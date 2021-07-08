<template>
  <div ref="HandmadeTestPaper">
    <page-header
      :title="pageTitle"
      show-back
    />
    <basic-container
      v-loading="pageLoading"
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
          :columns="formColumns"
        />
        <div class="title flex flex-justify-between">
          <div>
            试题设置:
            <span class="tip">
              <span>（当前总分：{{ form.totalScore }}分</span>
              <span v-if="surplusScore">，剩余分数：{{ _.round(surplusScore, 1) }}分</span>）
            </span>
          </div>
          <div>
            <el-button
              size="medium"
              type="primary"
              @click="handleAddTopic"
            >
              {{ isRandomPaper ? '添加题目' : '添加题型' }}
            </el-button>
          </div>
        </div>
        <randomTable
          v-if="isRandomPaper"
          ref="randomTable"
          @countScore="countScore"
        />
        <div v-else>
          <div
            v-for="block in testPaper"
            :key="block.id"
            class="block"
          >
            <themeBlock
              :block-data="block"
              :length="testPaper.length"
              @delete="handleDeleteBlock"
              @update="update"
            ></themeBlock>
          </div>
        </div>
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
            @click="cancel"
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
import randomTable from './components/randomTable'
import themeBlock from './components/themeBlock'
import { getcategoryTree } from '@/api/examManage/category'
const BASE_COLUMNS = [
  {
    prop: 'name',
    itemType: 'input',
    label: '试卷名称',
    span: 11,
    disabled: false,
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
    prop: 'planScore',
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
    prop: 'expiredTime',
    itemType: 'datePicker',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    label: '过期时间',
    type: 'datetime',
    offset: 2,
    span: 11,
    required: false,
    props: {
      label: 'label',
      value: 'value'
    }
  },
  {
    prop: 'isShowScore',
    itemType: 'switch',
    label: '试卷上显示试题分数',
    span: 11,
    activeValue: 1,
    inactiveValue: 0,
    required: false,
    props: {}
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
const BASIC_THEME_DATA = {
  key: 1,
  type: 'single_choice',
  title: '',
  tableData: []
}
export default {
  name: 'RandomTestPaper',
  components: {
    randomTable,
    themeBlock
  },
  data() {
    return {
      formColumns: BASE_COLUMNS,
      form: {
        name: '',
        categoryId: '',
        totalScore: 0,
        planScore: 0,
        remark: '',
        isShowScore: 0
      },
      testPaper: [_.cloneDeep(BASIC_THEME_DATA)],
      surplusScore: 0,
      pageLoading: false
    }
  },
  computed: {
    // 是否是编辑状态
    isEdit() {
      return this.$route.query.id
    },
    // 是否复制,另类的新增
    isCopy() {
      return this.$route.query.copy
    },
    isRandomPaper() {
      return _.get(this.$route, 'query.paperType', 'random') === 'random'
    },
    pageTitle() {
      const randomOrMuan = this.isRandomPaper ? '随机' : '手工'
      let handleText = ''
      if (this.isCopy) {
        handleText = '复制'
      } else {
        // 存在id并非copy的为编辑
        handleText = this.isEdit ? '编辑' : '创建'
      }
      return `${handleText}${randomOrMuan}试卷`
    },
    // 随机试卷的表格数据
    randomTopicList() {
      return _.get(this.$refs, 'randomTable.tableData', [])
    }
  },
  watch: {
    /**
     * @desc 如果改变了计划分数 重新计算剩余分数
     * */
    'form.planScore': {
      handler() {
        this.countScore()
      },
      deep: true
    }
  },
  mounted() {
    this.$set(this.formColumns[0], 'disabled', false)
    this.getTestPaperCategory()
    if (!this.$route.query.id) return //新建无需加载试卷数据
    this.getData()
    // 编辑需要置灰
    if (!this.isCopy && this.isEdit) {
      this.$set(this.formColumns[0], 'disabled', true)
    }
  },
  beforeRouteEnter(to, from, next) {
    to.meta.$keepAlive = false // 禁用页面缓存
    next()
  },
  beforeRouteLeave(to, from, next) {
    _.assign(this.$data, this.$options.data())
    this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    next()
  },
  methods: {
    /**
     * @desc 双向数据绑定（因为for的对象它是引用类型，所以不能通过v-modle，或者$emit('update')，重新指定引用方向）
     * */
    update(data) {
      if (data) {
        this.testPaper.map((it) => {
          it.key === data.key && (it = Object.assign(it, data))
        })
        this.countScore()
      }
    },
    /**
     * @desc 试题改变或者分数改变都会触发，重新计算剩余分数，和当前总分数
     * */
    countScore() {
      let randomScore = 0
      const manualScoreList = _.flatten(_.map(this.testPaper, 'tableData'))
      let manualScore = 0
      // 随机试卷的计算方式
      if (this.isRandomPaper) {
        if (_.isEmpty(this.randomTopicList)) return
        randomScore = _.sum(_.map(this.randomTopicList, (it) => it.score * it.questionNum))
      } else {
        // 手工试卷的计算方式
        if (_.isEmpty(manualScoreList)) return
        manualScore = _.sum(_.map(manualScoreList, (it) => _.get(it, 'score', 0)))
      }
      this.form.totalScore = this.isRandomPaper ? randomScore : manualScore
      this.surplusScore = this.form.planScore - this.form.totalScore
    },
    /**
     * @desc 删除当前手工试卷的行
     *
     * */
    handleDeleteBlock(data) {
      if (this.testPaper.length > 1) {
        this.$confirm('您确定要删除选中的题型吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.testPaper = this.testPaper.filter((it) => {
            return it.key !== data.key
          })
          this.$message.success('已成功删除该题型')
        })
      }
    },
    /**
     * @desc  添加大题
     *
     * */
    handleAddType() {
      BASIC_THEME_DATA.key += 1
      this.testPaper.push(_.cloneDeep(BASIC_THEME_DATA))
      this.$nextTick(() => {
        let scroll = this.$refs.HandmadeTestPaper
        scroll.scrollTop = scroll.scrollHeight
      })
    },
    /**
     * 获取试卷分类
     */
    getTestPaperCategory() {
      let params = {
        type: '1',
        expireStatus: '1'
      }
      getcategoryTree(params).then((res) => {
        this.formColumns.find((it) => it.prop === 'categoryId').props.treeParams.data = res
      })
    },
    /**
     * @desc 添加题目
     * */
    handleAddTopic() {
      if (this.isRandomPaper) {
        this.$refs.randomTable.handleAddTopic()
      } else {
        this.handleAddType()
      }
    },
    /**
     * @desc 查找试卷详情
     * */
    getData() {
      this.pageLoading = true
      getTestPaper({ id: this.$route.query.id })
        .then(async (res) => {
          this.form = _.cloneDeep(res)
          if (this.isRandomPaper) {
            _.set(this.$refs, 'randomTable.tableData', res.randomSettings)
          } else {
            const manualSettings = res.manualSettings.map((it) => ({
              ...it,
              score: it.score,
              Original: it.score
            }))
            const list = _.groupBy(manualSettings, (it) => it.parentSort)
            this.testPaper = []
            for (let key in list) {
              this.testPaper.push({
                type: list[key][0].type,
                title: list[key][0].title,
                key: list[key][0].id,
                tableData: list[key]
              })
            }
          }
          this.countScore()
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    checkSubmit() {
      let isPass = true
      if (!this.isRandomPaper) {
        // 手工试卷的题型有一个表格为空或者有一个表格下的题目分数未设置
        const list = this.testPaper.filter(
          (it) => it.tableData.length === 0 || it.tableData.filter((item) => !item.score).length
        )
        if (list.length > 0) {
          let text = ''
          list[0].tableData.length == 0 &&
            (text = `请检查试题设置 ${list[0].title} 的题目列表是否选择`)
          list[0].tableData.length !== 0 &&
            (text = `请检查试题设置 ${list[0].title} 的题目是否填写分数`)
          this.$message.warning(text)
          isPass = false
        }
      } else {
        if (_.isEmpty(this.randomTopicList)) {
          this.$message.error('试题设置最少需要存在一条')
          isPass = false
        }
      }
      return isPass
    },
    handleParams() {
      const randomSettings = this.isRandomPaper
        ? _.map(this.randomTopicList, (item, index) => {
            return { ...item, sort: index }
          })
        : []
      let manualSettings = []
      this.testPaper.map((it, index) => {
        it.tableData &&
          it.tableData.map((item, i) => {
            manualSettings.push({
              parentSort: index + 1,
              questionId: item.questionId,
              content: item.content,
              timeLimit: item.timeLimit,
              score: item.score,
              sort: i + 1,
              title: it.title,
              type: it.type
            })
          })
      })
      const params = {
        ..._.cloneDeep(this.form),
        randomSettings,
        manualSettings,
        type: _.get(this.$route, 'query.paperType', 'random')
      }
      return params
    },
    handleSubmit() {
      if (!this.checkSubmit()) return
      const params = this.handleParams()
      // 复制与新增接口一致
      let testPaperMether = this.isEdit && !this.isCopy ? putTestPaper : postTestPaper
      this.pageLoading = true
      testPaperMether(params)
        .then(() => {
          this.$message.success(`已成功${this.isEdit ? '修改' : '创建'}试卷`)
          this.handleBack()
        })
        .catch(() => {
          window.console.error(JSON.stringify(params))
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    /***
     * @author gaunfenda
     * @desc 提交试卷（添加或者修改）
     * */
    onSubmit() {
      this.$refs.form.validate().then(() => {
        // 无剩余分数直接提交，否则需要进行一次提示
        if (this.surplusScore == 0) {
          this.handleSubmit()
        } else {
          this.$confirm(
            '您设置试卷的当前总分与计划分数不一致，试卷创建后以当前设置的分数为准。是否继续创建试卷？',
            '提示',
            {
              confirmButtonText: `继续${this.isEdit ? '保存' : '创建'}`,
              cancelButtonText: '返回修改',
              type: 'warning'
            }
          ).then(() => {
            this.handleSubmit()
          })
        }
      })
    },

    cancel() {
      this.$message.warning('创建试卷已取消')
      this.handleBack()
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
