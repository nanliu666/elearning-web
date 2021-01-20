<template>
  <div class="view-contain-box">
    <div class="options-box">
      <div class="options-content">
        <div class="dot-box">
          <div class="dot-content">
            <span class="dot"></span>
            <span class="label">选项：</span>
          </div>
        </div>
        <ul class="select-ul value">
          <li
            v-for="(option, index) in data.examinationPaperUserOptionREQS"
            :key="index"
            class="select-li"
            :class="{ 'is-correct': option.isCorrect, 'is-fault': getFault(option) }"
          >
            <span>{{ _.unescape(option.contentOption) }}</span>
            <common-image-view
              :url="option.url"
              :file-name="option.fileName"
              :preview-src-list="[option.url]"
            />
          </li>
        </ul>
      </div>
      <div class="correct-answer-box">
        <span class="label">正确答案：</span>
        <span class="value is-correct">{{ getCorrect() }}</span>
      </div>
    </div>
    <div class="answer-box common-box">
      <div class="answer">
        <span class="label">考生答案：</span>
        <span
          class="value"
          :class="[
            Number(data.scoreUser) === Number(data.scoreQuestion) ? 'is-correct' : 'is-fault'
          ]"
        >{{ getAnswerValue() }}</span>
      </div>
      <div class="answer">
        <span class="label">得分：</span>
        <span class="value">{{ data.scoreUser }}分</span>
      </div>
    </div>
  </div>
</template>

<script>
import CommonImageView from '@/components/common-image-viewer/viewer'
export default {
  name: 'SelectView',
  components: {
    CommonImageView
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      correctContent: ''
    }
  },
  methods: {
    // 当前选项被选且未错误答案
    getFault(item) {
      return this.data.answerUser.includes(item.id) && !item.isCorrect
    },
    // 获取正确答案
    getCorrect() {
      const target = _.chain(this.data.examinationPaperUserOptionREQS)
        .filter((item) => {
          return item.isCorrect === 1
        })
        .map('contentOption')
        .join(' ')
        .value()
      this.correctContent = target
      return target
    },
    // 获取考生答案
    getAnswerValue() {
      const target = _.chain(this.data.examinationPaperUserOptionREQS)
        .find((item) => {
          return item.optionId === this.data.answerQuestion
        })
        .get('contentOption', '考生未作答')
        .value()
      return target
    }
  }
}
</script>

<style scoped lang="scss">
.view-contain-box {
  .label {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.25);
  }
  .value {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
  }
  .is-correct {
    color: #00b061;
  }
  .is-fault {
    color: #ff4329;
  }
  .options-box {
    margin-top: 24px;
    .options-content {
      display: flex;
      .dot-box {
        .dot-content {
          min-width: 60px;
          display: flex;
          align-items: center;
          .dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: rgba(0, 11, 21, 0.25);
            margin-right: 6px;
          }
        }
      }
      .select-ul {
        .select-li {
          margin-bottom: 16px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    .correct-answer-box {
      margin-top: 16px;
      padding-left: 24px;
    }
  }
  .analysis-box {
    margin-top: 8px;
  }
  .common-box {
    padding: 24px;
    background-color: #fafafa;
  }
  .answer-box {
    margin-top: 16px;
    display: flex;
    justify-content: flex-start;
    .answer {
      margin-right: 70px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
