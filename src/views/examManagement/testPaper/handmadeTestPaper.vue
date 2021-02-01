<template>
  <div
    ref="HandmadeTestPaper"
    class="HandmadeTestPaper"
  >
    <page-header
      :title="_.get(form, 'id', null) && !copy ? '编辑手工试卷' : '新建手工试卷'"
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
              <span>（当前总分：{{ form.totalScore == 0 ? 0 : form.totalScore }}分</span>
              <span v-if="surplusScore">，剩余分数：{{ surplusScore }}分</span>）
            </span>
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
    prop: 'planScore',
    itemType: 'inputNumber',
    min: 0,
    precision: 1,
    step: 0.1,
    maxlength: 32,
    span: 11,
    label: '计划总分'
  },
  {
    prop: 'expiredTime',
    itemType: 'datePicker',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    label: '过期时间',
    type: 'datetime',
    span: 11,
    offset: 2,
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
export default {
  name: 'HandmadeTestPaper',
  components: {
    themeBlock
  },
  data() {
    return {
      copy: '',
      loading: false,
      valid: false,
      columns: BASE_COLUMNS,
      surplusScore: '',
      form: {
        name: '',
        categoryId: '',
        expiredTime: '',
        totalScore: 0,
        planScore: 0,
        remark: '',
        isScore: '',
        isShowScore: '',
        isMulti: ''
      },
      typeList: [],
      themeBlockData: {
        key: 1,
        type: '',
        title: '',
        tableData: []
      },
      testPaper: []
    }
  },
  watch: {
    /**
     * @author guanfenda
     * @desc 如果改变了计划分数 重新计算剩余分数
     * */
    'form.planScore'() {
      this.count()
    },
    'form.isScore'() {
      let planScoreConfig = this.columns.find((it) => it.prop == 'planScore')
      if (this.form.isScore) {
        planScoreConfig.required = true
      } else {
        planScoreConfig.required = false
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.form && this.$refs.form.resetFields()
    this.testPaper = []
    this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    next()
  },
  activated() {
    this.copy = this.$route.query.copy
    this.testPaper = [_.cloneDeep(this.themeBlockData)]
    this.getTestPaperCategory()
    if (_.get(this, '$route.query.id', null)) {
      this.getData()
    }
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
      this.columns.find((it) => it.prop === 'name').disabled = false
      if (!this.$route.query.id) return
      let params = {
        id: this.$route.query.id
      }
      this.loading = true
      getTestPaper(params)
        .then((res) => {
          this.form = res
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
          !this.copy && (this.columns.find((it) => it.prop === 'name').disabled = true)
          this.count()
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSubmit() {
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
              score: item.score,
              sort: i + 1,
              title: it.title,
              type: it.type
            })
          })
      })
      let form = _.cloneDeep(this.form)
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
        .catch(() => {
          window.console.error(JSON.stringify(params))
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
        if (this.surplusScore === '' || this.surplusScore === '0') {
          this.handleSubmit()
        } else {
          this.$confirm(
            '您设置试卷的当前总分与计划分数不一致，试卷创建后以当前设置的分数为准。是否继续创建试卷？',
            '提示',
            {
              confirmButtonText: '继续创建',
              cancelButtonText: '返回修改',
              type: 'warning'
            }
          ).then(() => {
            this.handleSubmit()
          })
        }
      })
    },
    /**
     * @author guanfenda
     * @desc 双向数据绑定（因为for的对象它是引用类型，所以不能通过v-modle，或者$emit('update')，重新指定引用方向）
     * */
    update(data) {
      if (data) {
        this.testPaper.map((it) => {
          it.key === data.key && (it = Object.assign(it, data))
        })
        this.count()
      }
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
      let totalScoreTemp = 0
      scoreList = list
      scoreList.length &&
        (totalScoreTemp = scoreList.reduce((prev, cur) => {
          return Number(prev) + Number(cur)
        }, 0))
      this.form.totalScore = totalScoreTemp.toFixed(1)
      if (this.form.totalScore) {
        let score = this.form.planScore - this.form.totalScore
        this.surplusScore = Math.round(score).toString()
      }
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
          this.$message.success('已成功删除该题型')
        })
      }
    },
    /**
     * @author guanfenda
     * @desc  添加大题
     *
     * */
    handleAddType() {
      this.themeBlockData.key += 1
      this.testPaper.push(_.cloneDeep(this.themeBlockData))
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
