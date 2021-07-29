<template>
  <div
    v-loading.body="loading"
    class="competition-add"
  >
    <page-header
      :title="$route.query.tagName"
      show-back
    />
    <basic-container>
      <h3 class="title">
        基础设置
      </h3>
      <el-form
        ref="competitionForm"
        :model="form"
        :rules="rules"
      >
        <div class="item">
          <el-form-item
            label="闯关竞赛名称"
            prop="name"
          >
            <el-input
              v-model="form.name"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="分类"
            prop="categoryId"
          >
            <div class="classj-btn">
              <el-button
                type="text"
                @click="goClass"
              >
                分类管理
              </el-button>
            </div>
            <lazy-select
              v-model="form.categoryId"
              :options="classData"
              :auto-text="form.categoryName"
              :tree-params="{ props: { value: 'id', label: 'name', children: 'children' } }"
            />
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item
            label="闯关时间"
            prop="date"
          >
            <el-date-picker
              v-model="form.date"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy/MM/dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="挑战模式">
            <el-radio-group
              v-model="form.raceType"
              @change="activeRadio('raceType')"
            >
              <el-radio label="0">
                逐关解锁
              </el-radio>
              <el-radio label="1">
                一站到底
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="答题时长">
            <el-radio-group
              v-model="form.timeStrategy"
              @change="activeRadio('timeStrategy')"
            >
              <el-radio label="0">
                不记时
              </el-radio>
              <el-radio label="1">
                逐题计时
              </el-radio>
              <el-radio label="2">
                逐关计时
              </el-radio>
              <el-radio
                label="3"
                :disabled="form.raceType === '0'"
              >
                整竞赛计时
              </el-radio>
            </el-radio-group>
            <span
              v-show="form.timeStrategy !== '0' && form.timeStrategy !== '1'"
              class="time-limt"
            >每关限时<input
              maxlength="4"
              :value="defaultValue.timeStrategy"
              type="text"
              name="timeStrategy"
              @input="valueChange('timeStrategy', $event)"
            />分钟</span>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item
            v-show="form.timeStrategy === '1'"
            label="逐题计时方式"
          >
            <el-radio-group v-model="form.timeStrategyByQues">
              <el-radio label="0">
                按试题原设置时间
              </el-radio>
              <el-radio label="1">
                重新设置时间
              </el-radio>
            </el-radio-group>
            <span
              class="time-limt"
            >每题限时<input
              maxlength="4"
              :value="defaultValue.timeStrategyByQues"
              type="text"
              name="timeStrategyByQues"
              :readonly="form.timeStrategyByQues === '0'"
              :class="{ disabled: form.timeStrategyByQues === '0' }"
              @input="valueChange('timeStrategyByQues', $event)"
            />分钟</span>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="计入积分">
            <el-radio-group v-model="form.integralStrategy">
              <el-radio label="1">
                逐关计入,每关<input
                  maxlength="4"
                  :value="defaultValue.integralOnce"
                  type="text"
                  name="integralOnce"
                  :readonly="form.integralStrategy === '2'"
                  :class="{ disabled: form.integralStrategy === '2' }"
                  @input="valueChange('integralOnce', $event)"
                />积分
              </el-radio>
              <el-radio label="2">
                全通关计入<input
                  maxlength="4"
                  :value="defaultValue.integralAll"
                  type="text"
                  name="integralAll"
                  :readonly="form.integralStrategy === '1'"
                  :class="{ disabled: form.integralStrategy === '1' }"
                  @input="valueChange('integralAll', $event)"
                />积分
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="答题次数">
            <el-radio-group v-model="form.joinStrategy">
              <el-radio label="0">
                不限次数
              </el-radio>
              <el-radio label="1">
                每日限制<input
                  maxlength="4"
                  :value="defaultValue.joinTimesDay"
                  type="text"
                  name="joinTimesDay"
                  :readonly="form.joinStrategy !== '1'"
                  :class="{ disabled: form.joinStrategy !== '1' }"
                  @input="valueChange('joinTimesDay', $event)"
                />次
              </el-radio>
              <el-radio label="2">
                参加总次数限制<input
                  maxlength="4"
                  :value="defaultValue.joinTimesAll"
                  type="text"
                  name="joinTimesAll"
                  :readonly="form.joinStrategy !== '2'"
                  :class="{ disabled: form.joinStrategy !== '2' }"
                  @input="valueChange('joinTimesAll', $event)"
                />次
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="通关条件">
            <el-radio-group v-model="form.passStrategy">
              <el-radio label="0">
                答错结束
              </el-radio>
              <el-radio label="1">
                按答对题数,答对<input
                  maxlength="3"
                  :value="defaultValue.passStrategy"
                  type="text"
                  name="passStrategy"
                  :readonly="form.passStrategy !== '1'"
                  :class="{ disabled: form.passStrategy !== '1' }"
                  @input="valueChange('passStrategy', $event)"
                />通关
                <span class="percent">%</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="是否显示通关答案">
            <el-radio-group v-model="form.showAnswer">
              <el-radio label="0">
                不显示答案
              </el-radio>
              <el-radio label="1">
                答完即显示答案
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
      <div class="level">
        <h3 class="title">
          关卡设置
        </h3>
        <ul>
          <li>
            <div class="th">
              <span>关卡列表</span>
              <span
                @click="handler(2)"
              ><i class="iconfont iconimage_icon_Addoptions1"></i> 添加关卡</span>
            </div>
          </li>
          <li>
            <draggable
              v-model="barrierList"
              group="a"
              animation="300"
              drag-class="dragClass"
              ghost-class="ghostClass"
              chosen-class="chosenClass"
            >
              <div
                v-for="(item, index) in barrierList"
                :key="index"
                class="td"
              >
                <div>第{{ index + 1 }}关</div>
                <div class="test">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="item.categoryTitles && item.categoryTitles.join(',')"
                    :disabled="item.categoryTitles && item.categoryTitles.join(',').length < 11"
                    placement="top-start"
                  >
                    <div class="question-from">
                      试题来源:&nbsp;&nbsp;{{
                        item.categoryTitles && item.categoryTitles.join(',')
                      }}
                    </div>
                  </el-tooltip>
                  <div class="test-num">
                    <span>{{ questionType(item.type) }}</span>
                    <span>试题数:&nbsp;&nbsp;{{ item.questionNum + '/' + item.questionNumTotal }}</span>
                  </div>
                </div>
                <div>
                  <el-button
                    type="text"
                    @click="handler(1, index)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    @click="handler(0, index)"
                  >
                    删除
                  </el-button>
                  <i class="iconfont iconimage_icon_draggable"></i>
                </div>
              </div>
            </draggable>
          </li>
        </ul>
      </div>
      <footer>
        <el-button
          size="medium"
          type="primary"
          @click="submit"
        >
          完成
        </el-button>
        <el-button
          size="medium"
          @click="cancel"
        >
          取消
        </el-button>
      </footer>
    </basic-container>
    <levelDialog
      :visible.sync="dialogVisible"
      :topic-data="levelForm"
      @submit="addSuc"
      @close="levelForm = {}"
    />
  </div>
</template>

<script>
import levelDialog from './components/addLevel'
import draggable from 'vuedraggable'
import { getcategoryTree } from '@/api/examManage/category'
import lazySelect from '@/components/tree-selectorNew'
import {
  getScoreRule,
  addLevel,
  details,
  getBarrierList,
  upDateLevel
} from '@/api/examManage/competition'
export default {
  components: {
    levelDialog,
    draggable,
    lazySelect
  },
  data() {
    return {
      categorys: [],
      defaultValue: {
        timeStrategy: '',
        timeStrategyByQues: '1',
        integralOnce: '2',
        integralAll: '2',
        joinTimesDay: '2',
        joinTimesAll: '2',
        passStrategy: '80'
      },
      form: {
        date: [],
        name: '',
        categoryId: '',
        raceType: '0',
        timeStrategy: '0',
        timeStrategyByQues: '0',
        integralStrategy: '1',
        joinStrategy: '0',
        passStrategy: '0',
        showAnswer: '0'
      },
      rules: {
        name: [{ required: true, message: '请输入闯关竞赛名称', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        date: [{ required: true, message: '请选择有限期限', trigger: 'blur' }]
      },
      barrierList: [],
      dialogVisible: false,
      levelForm: {},
      startIndex: null,
      timer: null,
      classData: [],
      loading: false
    }
  },
  created() {
    getcategoryTree({
      type: 1,
      parentId: 0
    }).then((res) => {
      this.classData = res
    })
    getScoreRule().then((res) => {
      this.defaultValue.integralAll = res.byRace
    })
    if (!this.$route.query.id) return
    getBarrierList({ id: this.$route.query.id }).then((res) => {
      this.barrierList = res.filter((item) => {
        item.categoryId = item.categoryId.split(',')
        item.categoryIds = item.categoryId
        item.categoryTitles = item.categoryName.split(',')
        return true
      })
    })
    details({ id: this.$route.query.id }).then((res) => {
      for (const key in this.form) {
        this.form[key] = String(res[key])
      }
      this.form.categoryName = res.categoryName
      this.form.date = [res.beginTime.split(' ')[0], res.endTime.split(' ')[0]]
      this.form.id = res.id
      this.form.timeStrategy !== '0'
        ? this.form.timeStrategy === '1'
          ? (this.defaultValue.timeStrategyByQues = res.timeStrategyValue)
          : (this.defaultValue.timeStrategy = res.timeStrategyValue)
        : ''
      this.form.integralStrategy === '1'
        ? (this.defaultValue.integralOnce = res.integralValue)
        : (this.defaultValue.integralAll = res.integralValue)
      this.form.joinStrategy !== '0'
        ? this.form.joinStrategy === '1'
          ? (this.defaultValue.joinTimesDay = res.joinTimes)
          : (this.defaultValue.joinTimesAll = res.joinTiems)
        : ''
      this.form.passStrategy === '1' ? (this.defaultValue.passStrategy = res.passStrategyValue) : ''
    })
  },
  methods: {
    valueChange(key, e) {
      const inputValue = e.target.value
      if (inputValue[0] === '0' && inputValue.length >= 2) {
        e.target.value = inputValue.slice(1)
      }
      if (isNaN(Number(inputValue)) || +inputValue < 0) {
        e.target.value = this.defaultValue[key]
      } else {
        if (key === 'passStrategy' && +inputValue > 100) this.defaultValue[key] = 100
        else this.defaultValue[key] = e.target.value
      }
    },
    // 跳转到分类管理
    goClass() {
      this.$router.push('/examManagement/category/management')
    },
    /**
     * 增删改
     * @param  {Number}type 0:删,1:改,2:增.
     * @param {Object}index 对应的下标
     */
    handler(type, index) {
      if (type === 0) {
        this.barrierList.splice(index, 1)
      } else if (type === 1) {
        this.dialogVisible = true
        this.levelForm = this.barrierList[index]
        this.levelForm.arrIndex = index
      } else {
        this.dialogVisible = true
      }
    },

    activeRadio(key) {
      let value = this.form[key]
      switch (key) {
        case 'timeStrategy':
          if (value !== '0') this.defaultValue[key] = value - 1 ? value * value + 1 : 1
          break
        case 'timeStrategyByQues':
          if (value === '1') this.defaultValue[key] = 1
          else this.defaultValue[key] = ''
          break
        case 'raceType':
          if (value === '0') this.form.timeStrategy = '0'
      }
    },
    addSuc(data, index) {
      data.handlerType ? this.barrierList.push(data) : this.barrierList.splice(index, 1, data)
    },
    questionType(questionType) {
      let type = ''
      switch (questionType) {
        case 'single_choice':
          type = '单选题'
          break
        case 'multi_choice':
          type = '多选题'
          break
        case 'not_sure_choice':
          type = '不定项题'
          break
        default:
          type = '单选题'
      }
      return type
    },
    async submit() {
      if (this.barrierList.length === 0) return this.$message.warning('关卡数最少为一')
      try {
        this.loading = true
        await this.$refs.competitionForm.validate()
      } catch {
        this.loading = false
      }

      this.form.timeStrategy !== 0
        ? this.form.timeStrategy !== '1'
          ? (this.form.timeStrategyValue = this.defaultValue.timeStrategy)
          : this.form.timeStrategyByQues === '1'
          ? (this.form.timeStrategyValue = this.defaultValue.timeStrategyByQues)
          : ''
        : ''
      this.form.integralValue =
        this.form.integralStrategy === '1'
          ? this.defaultValue.integralOnce
          : this.defaultValue.integralAll
      this.form.joinStrategy === '1'
        ? (this.form.joinTimes = this.defaultValue.joinTimesDay)
        : this.form.joinStrategy === '2'
        ? (this.form.joinTimes = this.defaultValue.joinTimesAll)
        : ''
      this.form.passStrategyValue = this.defaultValue.passStrategy
      this.form.barrierList = this.barrierList.map(
        (item, index) =>
          (item = {
            seq: index + 1,
            type: item.type,
            categoryId: item.categoryIds.join(','),
            questionNum: item.questionNum
          })
      )
      this.form.beginTime = this.form.date[0]
      this.form.endTime = this.form.date[1]
      delete this.form.date
      try {
        this.$route.query.id ? await upDateLevel(this.form) : await addLevel(this.form)
      } finally {
        this.loading = false
      }
      this.$router.push('/examManagement/competition/list')
    },
    cancel() {
      this.$router.push('/examManagement/competition/list')
    }
  },
  beforeRouteEnter(to, form, next) {
    form.meta.$keepAlive = false
    next()
  }
}
</script>

<style lang="scss" scoped>
.competition-add {
  .title {
    font-size: 18px;
    color: rgba(0, 11, 21, 0.85);
  }
  .item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20%;
    &:nth-of-type(-n + 2) ::v-deep.el-form-item__content {
      width: 380px;
    }
    &:nth-of-type(n + 2) {
      input {
        width: 72px;
        height: 36px;
        background: #fff;
        border: 1px solid #d9dbdc;
        border-radius: 4px;
        color: #242d36;
        padding-left: 16px;
      }
      .disabled {
        background: #f2f2f2;
      }
    }
    ::v-deep span.el-radio__label {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
      padding-left: 8px;
    }
    .time-limt {
      margin-left: 40px;
    }
  }
  ::v-deep .el-form-item {
    flex: 1;
    flex-shrink: 0;
    input.el-input__inner {
      width: 380px;
      height: 36px;
    }
    .el-input-number.is-controls-right {
      width: 380px;
    }
    .el-date-editor.el-range-editor.el-input__inner.el-date-editor--datetimerange {
      width: 100%;
      height: 36px;
    }
    .el-select {
      width: 380px;
    }
    .el-input-number.is-controls-right {
      display: block;
    }
  }
  ::v-deep label.el-form-item__label {
    position: relative;
    float: none;
  }
  .classj-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
  .label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    ::v-deep button.el-button.el-button--text {
      padding: 0;
    }
  }
  .level {
    padding: 0 20%;
    ul li {
      padding: 0 24px;
      & > div {
        width: 100%;
      }
    }
    .th {
      flex: 1;
      display: flex;
      border-bottom: 1px solid #ebeced;
      height: 48px;
      align-items: center;
      justify-content: space-between;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.45);
      letter-spacing: 0;
      i {
        font-size: 14px;
        margin-right: 9px;
      }
      span:nth-of-type(2) {
        cursor: pointer;
      }
    }
  }
  .percent {
    position: absolute;
    top: 12px;
    right: 45px;
  }
  ::v-deep .el-dialog__body {
    padding: 24px 20px;
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
  }
  .el-icon-question {
    position: absolute;
    top: 0;
    left: 0;
  }
}
.iconimage_icon_draggable {
  cursor: move;
}
.question-from {
  max-width: 210px;
  min-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 5px;
}
::v-deep .el-tooltip.question-from.item {
  padding: 0;
}
footer {
  padding: 16px 20%;
  text-align: center;
}

::v-deep .td {
  border-bottom: 1px solid #ebeced;
  height: 66px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: rgba(0, 11, 21, 0.85);
  div {
    flex-shrink: 0;
  }
  & > div:first-of-type {
    margin-right: 102px;
  }
  & > div:last-of-type {
    text-align: right;
    min-width: 110px;
    flex: 1;
    ::v-deep button.el-button.el-button--text:last-of-type {
      margin: 0 16px;
    }
    i {
      font-size: 16px;
    }
  }
  .test-num {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: rgba(0, 11, 21, 0.45);
    letter-spacing: 0;
    line-height: 26px;
    span:last-of-type {
      margin-left: 14px;
    }
  }
}
</style>
