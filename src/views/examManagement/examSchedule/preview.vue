<template>
  <div class="preview-style">
    <page-header
      title="预览试卷"
      show-back
    >
      <el-button
        v-if="$route.query.paperType !== 'manual' && !$route.query.isManaged"
        slot="rightMenu"
        size="medium"
        @click="deletePreview"
      >
        删除
      </el-button>
    </page-header>
    <basic-container>
      <div
        v-loading="loading"
        class="preview-container"
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
            <div style="margin-bottom: 10px">
              <span>{{ (index + 1) | number2zhcn }}、</span>
              <span>{{ item[0].type | typeFilter }}</span>
              <span
                v-if="paperData.type === 'manual'"
              >（共{{ _.size(item) }}题, 共{{ getItemTotalScore(item) }}分）</span>
            </div>
            <div
              v-for="(sonitem, sonindex) in item"
              :key="sonindex"
              class="sub-question-li"
            >
              <div v-if="QUESTION_TYPE_GROUP !== sonitem.type">
                <span>{{ sonindex + 1 }}.</span>
                <QustionPreview
                  :data="sonitem"
                  :is-preview="true"
                />
              </div>
              <div v-else>
                <span>{{ sonindex + 1 }}.</span>
                <span>
                  <span v-html="getHTML(sonitem.content)" />
                  <ul>
                    <li
                      v-for="(paperItem, paperIndex) in sonitem.subQuestions"
                      :key="paperIndex"
                      class=""
                    >
                      <span>({{ paperIndex + 1 }}).</span>
                      <QustionPreview
                        :data="paperItem"
                        :is-preview="true"
                      />
                    </li>
                  </ul>
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </basic-container>
  </div>
</template>

<script>
import QustionPreview from '../question/questionPreview'
import {
  getManualPreview,
  getRandomPreview,
  delExamPreview,
  createRandomPaper
} from '@/api/examManage/schedule'
import {
  QUESTION_TYPE_MAP,
  QUESTION_TYPE_MULTIPLE,
  QUESTION_TYPE_SINGLE,
  QUESTION_TYPE_JUDGE,
  QUESTION_TYPE_SHOER,
  QUESTION_TYPE_BLANK,
  QUESTION_TYPE_GROUP
} from '@/const/examMange'
import { addLine } from '@/util/util'
const nzhcn = require('nzh/cn')
export default {
  filters: {
    typeFilter(data) {
      return QUESTION_TYPE_MAP[data]
    },
    number2zhcn(index) {
      return nzhcn.encodeS(index)
    }
  },
  components: {
    QustionPreview
  },
  data() {
    return {
      loading: false,
      paperData: []
    }
  },
  computed: {
    QUESTION_TYPE_MULTIPLE: () => QUESTION_TYPE_MULTIPLE,
    QUESTION_TYPE_SINGLE: () => QUESTION_TYPE_SINGLE,
    QUESTION_TYPE_JUDGE: () => QUESTION_TYPE_JUDGE,
    QUESTION_TYPE_BLANK: () => QUESTION_TYPE_BLANK,
    QUESTION_TYPE_SHOER: () => QUESTION_TYPE_SHOER,
    QUESTION_TYPE_MAP: () => QUESTION_TYPE_MAP,
    QUESTION_TYPE_GROUP: () => QUESTION_TYPE_GROUP
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    next()
  },
  created() {
    this.initData()
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
    },
    deletePreview() {
      delExamPreview({ id: this.$route.query.paperId }).then(() => {
        this.$message.success('删除成功')
        this.loadTableData('del')
      })
    },
    initData() {
      this.loading = true
      let loadFun = this.$route.query.paperType === 'manual' ? getManualPreview : getRandomPreview
      if (this.$route.query.isManaged && this.$route.query.paperType === 'random') {
        loadFun = createRandomPaper
      }
      const basicParams = { paperId: this.$route.query.paperId }
      const parmas =
        this.$route.query.paperType === 'manual' || this.$route.query.isManaged
          ? basicParams
          : _.assign(basicParams, { previewId: this.$route.query.previewId })
      loadFun(parmas)
        .then((res) => {
          res.questions = this.handleData(res.questions)
          this.paperData = res
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleData(data) {
      return _.chain(data)
        .groupBy('parentSort')
        .sortBy('parentSort')
        .map((item) => {
          return _.sortBy(item, 'sort')
        })
        .value()
    }
  }
}
</script>

<style scoped lang="scss">
.preview-container {
  padding: 60px 80px;
  min-height: 75vh;
  .preview-title-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .preview-title {
      font-weight: 550;
      font-size: 18px;
      margin-bottom: 10px;
    }
    .preview-subhead {
      font-size: 12px;
      color: #9c9e9c;
    }
  }
  .main-question-li {
    padding: 40px 0;
    border-bottom: 1px solid #e4e7e9;
    .sub-question-li {
      margin-bottom: 40px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
