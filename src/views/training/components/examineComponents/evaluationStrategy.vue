<template>
  <div class="evaluate-container">
    <div>
      <CustomSwitch
        :config="switchConfig"
        :data.sync="switchForm"
        @changeSwitch="changeSwitch"
      />
      <div>
        <div class="group-title">
          多选题
        </div>
        <el-radio-group
          v-model="currentRadio"
          class="radio-group"
        >
          <el-radio
            v-for="(item, index) in radioList"
            :key="index"
            class="radio-li"
            :label="index"
          >
            {{ item.value }}
            <el-tooltip
              v-if="item.des"
              effect="dark"
              width="400px"
              :content="item.des"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="footer-tips">
      提示：客观题指单选题、多选题、判断题、单选测评题、多选测评题
    </div>
  </div>
</template>

<script>
import CustomSwitch from './customSwitch'
const insertConfig = {
  label: '不允许修改考生客观题及其评分结果',
  prop: 'modifyLimit'
}
const switchConfig = [
  {
    label: '允许评卷人修改考生答案',
    prop: 'modifyAnswer'
  },

  {
    label: '评卷限定最高得分',
    prop: 'scopeLimit'
  },
  {
    label: '手工评卷是否显示客观题',
    prop: 'objectiveQuestions'
  },
  {
    label: '判断题答对得分，不答不得分，答错扣分',
    prop: 'decideItem'
  }
]
export default {
  name: 'EvaluationStrategy',
  components: {
    CustomSwitch
  },
  data() {
    return {
      radioList: [
        { value: '完全正确得分' },
        { value: '按正确选项个数计分' },
        {
          value: '每项得扣分',
          des:
            '每道题答对一个得设置的分数，如设置为0.3分，则答对一选项得0.3，答错扣0.3，且每道题得分不低于0分'
        },
        {
          value: '完全正确得分',
          des:
            '（题目的分数/正确答案的选项的个数）*答对的个数 - 错误分数*答错错个数 不完全正确时，答错扣分（每项扣分少于每项得分，总扣分减去得分不小于0，例如设置每项答错扣分0.3，试题分数为8，答案为ABCD，答题为ABC,则得分为（8 / 4）*3-0*0.3=6分；设置每项答错扣分0.3，试题分数为8，答案为ABD，答题为ABC,则得分为（8 / 4）*2-1*0.3=5.7分'
        },
        {
          value: '完全正确得分',
          des:
            '只有答对的选项中对的个数计分，如设置为0.4，正确答案是ABC，如果考生答题AB，答对两个，则得0.8分，如果答题ABD，则得0分'
        }
      ],
      currentRadio: 1,
      insertConfig,
      switchConfig: switchConfig,
      switchForm: {
        modifyAnswer: 0,
        modifyLimit: 0,
        scopeLimit: 0,
        objectiveQuestions: 0,
        decideItem: 0
      }
    }
  },
  methods: {
    changeSwitch(args, data) {
      if (data.prop === 'modifyAnswer') {
        if (args) {
          this.switchConfig.splice(1, 0, this.insertConfig)
        } else {
          let index = _.findIndex(this.switchConfig, (item) => {
            return item.prop === 'modifyLimit'
          })
          this.switchConfig.splice(index, 1)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.evaluate-container {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .footer-tips {
    margin: 20px 0;
    color: #767c85;
    font-size: 12px;
  }
  .group-title {
    margin-top: 30px;
  }
  .radio-group {
    display: flex;
    flex-direction: column;
    margin: 20px 0;
    .radio-li {
      margin: 10px 0;
    }
  }
}
</style>
