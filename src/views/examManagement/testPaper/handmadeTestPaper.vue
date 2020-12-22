<template>
  <div
    ref="HandmadeTestPaper"
    class="HandmadeTestPaper"
  >
    <page-header
      title="新建手工试卷"
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
              @click="handleAddType"
            >
              添加题型
            </el-button>
          </div>
        </div>
        <div
          v-for="block in testPaper"
          :key="block.id"
          class="block"
        >
          <themeBlock
            :block-data="block"
            :length="testPaper.length"
            :valid="valid"
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
          @click="handleBack"
        >
          取消
        </el-button>
      </div>
    </basic-container>
  </div>
</template>

<script>
import themeBlock from './components/themeBlock'
import { getTestPaper, postTestPaper, putTestPaper } from '@/api/examManagement/achievement'
import { getcategoryTree } from '@/api/examManage/category'

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
    span: 11,
    label: '计划总分'
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
export default {
  name: 'HandmadeTestPaper',
  components: {
    themeBlock
  },
  data() {
    return {
      loading: false,
      valid: false,
      columns: BASE_COLUMNS,
      TotalScore: '',
      score: '',
      form: {},
      typeList: [],
      themeBlock: {
        key: 1,
        type: '',
        title: '',
        tableData: [],
        totalScore: ''
      },
      testPaper: []
    }
  },
  watch: {
    /***
     * @author guanfenda
     * @desc 修改了试题设置，修改分数重新计算剩余分数
     * */
    TotalScore(val) {
      if (this.form.totalScore) {
        this.score = this.form.totalScore - val
      }
    },
    /**
     * @author guanfenda
     * @desc 如果改变了计划分数 重新计算剩余分数
     * */
    'form.totalScore'() {
      this.count()
    }
  },
  mounted() {},
  activated() {
    this.form = {
      name: '',
      categoryId: '',
      expiredTime: '',
      totalScore: '',
      remark: '',
      isScore: '',
      isShowScore: '',
      isMulti: ''
    }
    this.TotalScore = ''
    this.score = ''
    this.form.isScore = 0

    this.testPaper = []
    this.score = ''
    !this.$route.query.id && this.testPaper.push(_.cloneDeep(this.themeBlock))
    this.getData()
    this.getTestPaperCategory()
  },
  methods: {
    /**
     * @author guanfenda
     * @desc 获取试卷分类
     * */
    getTestPaperCategory() {
      let params = {
        type: '1'
      }
      getcategoryTree(params).then((res) => {
        this.columns.find((it) => it.prop === 'categoryId').props.treeParams.data = res
      })
    },
    /**
     * @author guanfenda
     * @desc 获取试卷详情
     * */
    getData() {
      if (!this.$route.query.id) return
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
            manualSettings,
            isMulti
          } = res
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
          manualSettings = manualSettings.map((it) => ({
            ...it,
            score: it.score / 10,
            Original: it.score / 10
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
          this.count()
        })
        .finally(() => {
          this.loading = false
        })
    },
    /**
     * @author guenfenda
     * @desc 提交试卷（添加或者修改）
     *
     * */
    onSubmit() {
      this.valid = true
      this.$refs.form.validate().then((valid) => {
        if (!valid) return
        let list = this.testPaper.filter(
          (it) => it.tableData.length === 0 || it.tableData.filter((item) => !item.score).length
        )
        if (list.length > 0) {
          let text = ''
          list[0].tableData.length == 0 &&
            (text = `请检查试题设置 ${list[0].title} 的题目列表是否选择`)
          list[0].tableData.length !== 0 &&
            (text = `请检查试题设置 ${list[0].title} 的题目是否填写分数`)
          this.$message.warning(text)
          return
        }
        let testPaperMether =
          this.$route.query.id && !this.$route.query.copy ? putTestPaper : postTestPaper

        let manualSettings = []
        this.testPaper.map((it, index) => {
          it.tableData &&
            it.tableData.map((item, i) => {
              manualSettings.push({
                parentSort: index + 1,
                questionId: item.questionId,
                content: item.content,
                timeLimit: item.timeLimit,
                score: item.score * 10,
                sort: i + 1,
                title: it.title,
                type: it.type
              })
            })
        })
        let form = _.cloneDeep(this.form)
        form.totalScore = form.totalScore * 10
        let params = {
          ...form,
          manualSettings: manualSettings,
          type: 'manual'
        }
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
    },
    /**
     * @author guanfenda
     * @desc 双向数据绑定（因为for的对象它是引用类型，所以不能通过v-modle，或者$emit('update')，重新指定引用方向）
     * */
    update(data) {
      this.testPaper.map((it) => {
        it.key === data.key && (it = Object.assign(it, data))
      })
      this.count()
    },
    /**
     * @author guanfenda
     * @desc 计算剩余分数，和当前总分数
     * */
    count() {
      let scoreList = _.compact(
        this.testPaper.map(
          (it) => it.tableData && it.tableData.length > 0 && it.tableData.map((item) => item.score)
        )
      )
      let list = []
      scoreList.map((it) => {
        let newData = _.compact(it)
        list.push(...newData)
      })
      scoreList = list
      scoreList.length &&
        (this.TotalScore = scoreList.reduce((prev, cur) => {
          return Number(prev) + Number(cur)
        }, 0))
      this.score = this.form.totalScore - this.TotalScore
    },
    /**
     * @author guanfenda
     * @desc 删除当前行
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
        })
      }
    },
    /**
     * @author guanfenda
     * @desc  添加大题
     *
     * */
    handleAddType() {
      this.themeBlock.key += 1
      this.testPaper.push(_.cloneDeep(this.themeBlock))
      this.$nextTick(() => {
        let scroll = this.$refs.HandmadeTestPaper
        scroll.scrollTop = scroll.scrollHeight
      })
    },
    /**
     * @author guanfendad
     * @desc 返回
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
.block {
  margin-bottom: 60px;
}
.footer {
  margin-top: 30px;
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
</style>
