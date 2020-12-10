<template>
  <div class="preview-style">
    <page-header
      title="预览试卷"
      show-back
    />
    <basic-container>
      <div class="preview-container">
        <div class="preview-title-box">
          <div class="preview-title">
            {{ paperData.name }}
          </div>
          <div class="preview-subhead">
            试卷总分：{{ paperData.totalScore }}分
          </div>
        </div>
        <ul>
          <li
            v-for="(item, index) in paperData.questions"
            :key="index"
          >
            <div>
              <span>{{ ChineseNumeric[index] }}、</span>
              <span>{{ item.type | typeFilter }}</span>
              <span>（每题{{ item.grade }}分，共{{ item.total }}题）</span>
            </div>
            <ul>
              <li
                v-for="(paperItem, paperIndex) in item.data"
                :key="paperIndex"
              >
                <span>{{ paperIndex + 1 }}</span>
                <QustionPreview :is-preview="true" />
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </basic-container>
  </div>
</template>

<script>
import QustionPreview from '../question/questionPreview'
import { getManualPreview } from '@/api/examManage/schedule'
const ChineseNumeric = [
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十一',
  '十二',
  '十三'
]
const TYPE_STATUS = {
  1: '单选题',
  2: '多选题',
  3: '判断题',
  4: '问答题',
  5: '填空题',
  6: '阅读理解',
  7: '单选题'
}
export default {
  filters: {
    typeFilter(data) {
      return TYPE_STATUS[data]
    }
  },
  components: {
    QustionPreview
  },
  data() {
    return {
      ChineseNumeric,
      paperData: [
        // {
        //   data: [
        //     {
        //       content: '',
        //       attachments: [],
        //       options: [],
        //       type: 1
        //     }
        //   ],
        //   total: 2,
        //   grade: 5,
        //   type: 1 //1单选 2多选 3判断 4问答 5填空 6阅读理解
        // }
      ]
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    next()
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getManualPreview({ paperId: this.$route.query.paperId }).then((res) => {
        this.paperData = res
      })
    }
  }
}
</script>

<style scoped lang="scss">
.preview-container {
  padding: 60px 80px;
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
}
</style>
