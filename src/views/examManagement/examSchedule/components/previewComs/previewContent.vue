<template>
  <div
    ref="testPaper"
    v-loading="loading"
    class="preview-container pdf-screen"
  >
    <div class="preview-title-box">
      <div class="preview-title">
        {{ paperData.name }}
        <span v-if="$route.query.previewSort">（{{ $route.query.previewSort }}）</span>
      </div>
      <div
        v-if="paperData.totalScore"
        class="preview-subhead"
      >
        试卷总分：{{ paperData.totalScore }}分
      </div>
    </div>
    <ul>
      <li
        v-for="(item, index) in paperData.questions"
        :key="index"
        class="main-question-li"
      >
        <div class="li__title">
          <span>{{ (index + 1) | number2zhcn }}、</span>
          <span>{{ item[0].type | typeFilter }}</span>
          <span>（共{{ _.size(item) }}题, 共{{ getItemTotalScore(item) }}分）</span>
        </div>
        <div style="margin-bottom: 10px; margin-top: 4px;color: #bfc2c4">
          {{ _.get(item, '[0]title', '') }}
        </div>
        <div
          v-for="(sonitem, sonindex) in item"
          :key="sonindex"
          class="sub-question-li"
          :class="[!hasAnswer ? 'low__bottom' : 'height__bottom']"
        >
          <div v-if="QUESTION_TYPE_GROUP !== sonitem.type">
            <span>{{ sonindex + 1 }}.</span>
            <span v-show="paperData.isShowScore === 1">（{{ sonitem.score }}分）</span>
            <QustionPreview
              :data="sonitem"
              :has-answer="hasAnswer"
            />
          </div>
          <div v-else>
            <span>{{ sonindex + 1 }}</span>
            <span>
              <span v-html="getHTML(sonitem.content)" />
              <ul class="sub__ul">
                <li
                  v-for="(paperItem, paperIndex) in sonitem.subQuestions"
                  :key="paperIndex"
                  class="sub__li"
                >
                  <span>({{ paperIndex + 1 }}).</span>
                  <QustionPreview
                    :data="paperItem"
                    :has-answer="hasAnswer"
                  />
                </li>
              </ul>
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import QustionPreview from './questionPreview'
import { QUESTION_TYPE_MAP_TOTAL, QUESTION_TYPE_GROUP } from '@/const/examMange'
import { addLine } from '@/util/util'
const nzhcn = require('nzh/cn')
export default {
  name: 'PreviewContent',
  components: {
    QustionPreview
  },
  filters: {
    typeFilter(data) {
      return QUESTION_TYPE_MAP_TOTAL[data]
    },
    number2zhcn(index) {
      return nzhcn.encodeS(index)
    }
  },
  props: {
    hasAnswer: {
      type: Boolean,
      default: false
    },
    paperData: {
      type: [Array, Object],
      default: () => []
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    QUESTION_TYPE_GROUP: () => QUESTION_TYPE_GROUP
  },

  methods: {
    addScore(args) {
      return args.reduce((prev, curr) => {
        return prev + curr
      })
    },
    getItemTotalScore(data) {
      const scoreList = _.map(data, (item) => {
        return item.score
      })
      const totalScore = this.addScore(scoreList)
      return totalScore
    },
    getHTML(content) {
      return addLine(content)
    }
  }
}
</script>
<style scoped lang="scss">
.preview-container {
  padding: 20px;
  overflow: auto;
}
.preview-title-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .preview-title {
    font-weight: 550;
    font-size: 18px;
    margin-bottom: 10px;
    color: rgba(0, 11, 21, 0.85);
  }
  .preview-subhead {
    font-size: 12px;
    color: #9c9e9c;
  }
}
.main-question-li {
  padding: 20px 0;
  border-bottom: 1px solid #e4e7e9;
  .li__title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: rgba(0, 11, 21, 0.85);
    font-weight: 550;
    margin-bottom: 4px;
  }
  .sub-question-li {
    &:last-child {
      margin-bottom: 0;
    }
    .sub__ul {
      .sub__li {
        margin-bottom: 20px;
      }
    }
  }
}
.low__bottom {
  margin-bottom: 10px;
}
.height__bottom {
  margin-bottom: 40px;
}
</style>
