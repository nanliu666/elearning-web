<template>
  <div>
    <div class="formContent">
      <div class="flex flex-justify-between">
        <div>
          <label class="label"> <span class="islabel">*</span>试题类型</label>
          <el-select
            v-model="form.type"
            style="width: 200px"
            placeholder="请选择试题类型"
            @visible-change="visibleChange"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="flex flex-flow">
          <div
            class="add"
            @click="handleAddTheme"
          >
            <el-button
              size="mini"
              type="text"
              style="font-size: 14px"
            >
              添加试题
            </el-button>
          </div>
          <div @click="handleDeleteBlock">
            <el-button
              size="mini"
              type="text"
              :class="[length === 1 ? 'delete' : 'add']"
              :disabled="length < 2"
            >
              删除试题
            </el-button>
          </div>
        </div>
      </div>
      <div class="flex flex-flow flexcenter">
        <label class="label">大题标题</label>
        <el-input
          v-model="form.title"
          maxlength="200"
          placeholder="请填写大题标题"
        ></el-input>
      </div>
      <div>
        <common-table
          id="demo"
          ref="table"
          class="table"
          :columns="columnsVisible"
          :config="tableConfig"
          :data="tableData"
        >
          <template #index="{$index}">
            {{ $index + 1 }}
          </template>
          <template #content="{row}">
            {{ getContent(row.content) }}
          </template>
          <template #score="{row}">
            <el-input-number
              v-model="row.score"
              controls-position="right"
              :min="0"
              :step="1"
              :precision="1"
              @change="scoreChange"
            />
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
              :disabled="getUpDisabled(row)"
              @click="handleUp(row)"
            >
              上移
            </el-button>
            <el-button
              type="text"
              :disabled="getDowmDisabled(row)"
              @click="handleDown(row)"
            >
              下移
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </common-table>
        <div
          v-if="hasFix"
          class="score-origin-tips"
        >
          <i class="el-icon-warning" />
          <span
            style="padding-left: 6px"
          >检测到你添加试题的分数与原分数值不一致（该分数只对本试卷有效），可</span>
          <el-button
            type="text"
            @click="resetOrigin"
          >
            点击恢复原分值
          </el-button>
        </div>
        <stemContent
          v-if="visible"
          v-model="stemList"
          :data="tableData"
          :type="form.type"
          :visible.sync="visible"
          :title="'添加' + title"
        ></stemContent>
      </div>
    </div>
  </div>
</template>

<script>
import stemContent from './stemContent'
import { QUESTION_TYPE_MAP } from '@/const/examMange'
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  defaultExpandAll: false,
  showIndexColumn: false,
  enablePagination: false,
  enableMultiSelect: false, // TODO：关闭批量删除
  handlerColumn: {
    headerAlign: 'center',
    align: 'center',
    minWidth: 100
  }
}
const TABLE_COLUMNS = [
  {
    label: '序号',
    prop: 'index',
    slot: true,
    minWidth: 50
  },
  {
    label: '题目名称',
    prop: 'content',
    slot: true,
    minWidth: 120
  },
  {
    label: '分数',
    prop: 'score',
    slot: true,
    headerAlign: 'center',
    align: 'center',
    minWidth: 150
  },
  {
    label: '答题限时',
    prop: 'timeLimit',
    align: 'center',
    formatter(row) {
      return row.timeLimit ? row.timeLimit + 's' : '不限时'
    },
    minWidth: 120
  }
]
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
    maxlength: 200,
    required: false
  }
]
import { deleteHTMLTag } from '@/util/util'
export default {
  name: 'ThemeBlock',
  components: {
    stemContent
  },
  props: {
    blockData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    valid: {
      type: Boolean,
      default: false
    },
    length: {
      type: Number,
      default: () => {
        return 1
      }
    }
  },

  data() {
    return {
      hasFix: false,
      totalScore: '',
      title: '',
      visible: false,
      form: {
        type: 'single_choice',
        title: ''
      },
      stemList: [],
      typeList: [],
      tableConfig: TABLE_CONFIG,
      columnsVisible: TABLE_COLUMNS,
      columns: BASE_COLUMNS,
      tableData: []
    }
  },
  watch: {
    blockData: {
      handler(val) {
        const { tableData, type, title } = val
        this.$nextTick(() => {
          this.tableData = tableData
          this.form.type = type
          this.form.title = title
        })
      },
      deep: true,
      immediate: true
    },
    stemList: {
      handler(val) {
        let obj = val.map((it) => {
          return {
            score: Number(it.score),
            content: it.content,
            timeLimit: it.timeLimit,
            type: it.type,
            id: it.id,
            questionId: it.questionId
          }
        })

        this.tableData = obj.map((it) => ({
          key: it.id,
          content: it.content,
          type: it.type,
          questionId: it.questionId,
          score: it.score || undefined,
          Original: it.score || undefined,
          timeLimit: it.timeLimit ? it.timeLimit : '0'
        }))
        this.countScore()
      },
      deep: true
    },
    totalScore() {
      this.newData()
    },
    form: {
      handler() {
        this.newData()
      },
      deep: true
    }
  },
  mounted() {
    this.typeList = []
    this.tableData = []
    for (let key in QUESTION_TYPE_MAP) {
      this.typeList.push({ value: key, label: QUESTION_TYPE_MAP[key] })
    }
  },
  methods: {
    getContent(data) {
      const contentText = deleteHTMLTag(_.unescape(data))
      return contentText.length > 200 ? `${contentText.slice(0, 200)}...` : contentText
    },
    /**
     *  @author guenfenda
     *  @desc 计算分数
     *
     * */
    countScore() {
      let scoreList = _.compact(this.tableData.map((it) => it.score))
      this.totalScore = scoreList.reduce((prev, cur) => {
        return Number(prev) + Number(cur)
      }, 0)
    },
    /**
     *@author guanfenda
     * @desc 试题类型修改如果提交了试题，要给提示，并删除之前添加的试题
     **/
    visibleChange(data) {
      if (!data) return
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.tableData.length > 0) {
            this.$confirm(
              '您已添加试题，若更改题型，已添加的试题将会被删除！您是否继续更改题型？',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            ).then(() => {
              this.tableData = []
              this.countScore()
            })
          }
        }, 300)
      })
    },
    /**
     * @author guanfenda
     * @desc 弹出试题选择框
     * */
    handleAddTheme() {
      this.visible = true
      this.title = ''
    },
    /**
     * @author guanfenda
     * @Desc 删除大题
     * */
    handleDeleteBlock() {
      let block = {
        key: this.blockData.key,
        type: this.form.type,
        title: this.form.title,
        tableData: this.tableData,
        totalScore: this.totalScore
      }
      this.$emit('delete', block)
    },
    /***
     * @author guanfenda
     * @desc 删除当前行
     *
     * */
    handleDelete(row) {
      this.tableData = this.tableData.filter((it) => {
        if (it.id && row.id !== it.id) return true
        if (it.key && row.key !== it.key) return true
      })
      this.$message.success('删除成功')
      this.newData()
    },
    newData() {
      let block = {
        key: this.blockData.key || this.blockData.id,
        type: this.form.type,
        title: this.form.title,
        tableData: this.tableData,
        totalScore: this.totalScore
      }
      this.$emit('update', _.cloneDeep(block))
    },
    getUpDisabled(row) {
      let index = _.findIndex(this.tableData, (item) => {
        return item.key === row.key
      })
      return index === 0
    },
    getDowmDisabled(row) {
      let index = _.findIndex(this.tableData, (item) => {
        return item.key === row.key
      })
      return _.size(this.tableData) === index + 1
    },
    /***
     * @author guanfenda
     * @desc 下移
     * */
    handleDown(row) {
      let index = _.findIndex(this.tableData, (item) => {
        return item.key === row.key
      })
      if (index !== this.tableData.length - 1) {
        this.tableData[index] = this.tableData.splice(index + 1, 1, this.tableData[index])[0]
      }
    },
    /***
     * @author guanfenda
     * @desc 上移
     * */
    handleUp(row) {
      let index = _.findIndex(this.tableData, (item) => {
        return item.key === row.key
      })
      if (index !== 0) {
        this.tableData[index] = this.tableData.splice(index - 1, 1, this.tableData[index])[0]
      }
    },
    /**
     * @author guanfenda
     * @desc 提示分数修改
     *
     * */
    scoreChange() {
      this.countScore()
      this.hasFix = _.some(this.tableData, (item) => {
        return item.Original !== item.score
      })
    },
    // 将表格中的所有的值恢复成原值
    resetOrigin() {
      _.each(this.tableData, (item) => {
        item.score = item.Original
      })
      this.hasFix = false
    }
  }
}
</script>

<style lang="scss" scoped>
.score-origin-tips {
  color: #7a7a7a;
}
.formContent {
  background: #fafafa;
  padding: 24px;
  > div {
    margin-bottom: 22px;
  }
}
.islabel {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
label {
  margin-right: 20px;
  min-width: 70px;
  text-align: right;
  display: inline-block;
}
.add {
  font-size: 14px;
  color: #01aafc;
  letter-spacing: 0;
  /*line-height: 22px;*/
  cursor: pointer;
  margin-left: 17px;
}
.delete {
  font-size: 14px;
  color: rgba(0, 11, 21, 0.25);
  letter-spacing: 0;
  /*line-height: 22px;*/
  cursor: pointer;
  margin-left: 17px;
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
</style>
