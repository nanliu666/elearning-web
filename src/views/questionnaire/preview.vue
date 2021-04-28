<template>
  <div class="preview">
    <div
      class="header"
      @click="$router.back()"
    >
      <i class="el-icon-arrow-left"> </i>
      <span class="title">预览问卷</span>
    </div>

    <div class="preview-container">
      <div class="preview-side">
        <div class="side-item active">
          电脑预览
        </div>
        <!-- <div class="side-item">
          手机预览
        </div> -->
      </div>
      <div
        v-loading="loading"
        class="preview-wrapper"
      >
        <el-scrollbar>
          <div>
            <div class="preview-header-area">
              <div class="preview-title">
                {{ data.asqName }}
              </div>
              <div class="preview-intro">
                {{ data.remark }}
              </div>
            </div>

            <div class="preview-topic">
              <div
                v-for="(question, index) in data.asqQuestions"
                :key="question.id"
                class="question-item"
              >
                <div class="question-title">
                  <div class="question-index">
                    <span
                      v-if="question.status == 1"
                      class="request"
                    >*</span>

                    <span class="text">{{ index + 1 }}.</span>
                  </div>
                  <div class="question-name">
                    {{ question.content }}
                  </div>
                  <div class="question-type">
                    【{{ getTypeName(question) }}】
                  </div>
                  <span
                    v-if="question.type == 'multi_choice'"
                    class="question-limit"
                  >最少可选{{ question.multiMin }}项，最多可选{{ question.multiMax }}项</span>
                </div>

                <div class="question-content">
                  <el-input
                    v-if="question.type == 'short_answer'"
                    :value="questionResults[index]"
                  ></el-input>

                  <el-radio-group v-if="question.type == 'single_choice'">
                    <el-radio
                      v-for="(option, option_index) in question.asqQuestionOptions"
                      :key="option_index"
                      :label="option.content"
                    ></el-radio>
                  </el-radio-group>

                  <div v-if="question.type == 'multi_choice'">
                    <el-checkbox-group
                      v-model="questionResults[index]"
                      disabled
                    >
                      <el-checkbox
                        v-for="(option, option_index) in question.asqQuestionOptions"
                        :key="option_index"
                        :label="option.content"
                      />
                    </el-checkbox-group>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { editView } from '@/api/questionnaire'
export default {
  name: 'Preview',
  data() {
    return {
      data: {},
      questionResults: [],
      loading: false
    }
  },
  watch: {
    'data.asqQuestions': {
      handler() {
        this.$forceUpdate()
      },
      deep: true
    }
  },
  activated() {
    this.questionResults = []
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      editView({ id: this.$route.query.id })
        .then((res) => {
          const [data = {}] = res
          this.data = data
          if (!data.asqQuestions) return
          data.asqQuestions.forEach((question) => {
            this.questionResults.push(question.type == 'multi_choice' ? [] : '')
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    getTypeName(item) {
      let result = ''
      switch (item.type) {
        case 'short_answer':
          result += '简答题'
          break
        case 'single_choice':
          result += '单选题'
          break
        case 'multi_choice':
          result += '多选题'
          break
        default:
          break
      }
      return result
    }
  }
}
</script>

<style lang="scss">
.preview {
  .question-content {
    margin-left: 12px;
    width: 452px;
    .el-radio,
    .el-checkbox {
      display: block;
      line-height: 22px;
      margin-bottom: 0;
      &:not(:first-child) {
        margin-top: 16px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.preview {
  cursor: default;
  .header {
    width: fit-content;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 29px 0 21px;
    i {
      color: #8c9195;
      font-size: 16px;
    }
    .title {
      font-family: PingFangSC-Medium;
      font-size: 22px;
      color: rgba(0, 11, 21, 0.85);
      margin-left: 8px;
    }
  }
  .preview-container {
    display: flex;
    height: 100%;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    box-sizing: border-box;
    margin-bottom: 20px;
    .preview-side {
      width: 160px;
      border-right: 1px solid #ebeced;
      height: 100%;
      padding-top: 64px;
      .side-item {
        width: 100%;
        height: 42px;
        line-height: 42px;
        text-align: center;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        box-sizing: border-box;
        &.active {
          cursor: pointer;
          background-color: #f0fafe;
          border-left: 2px solid #01aafc;
        }
      }
    }
    .preview-wrapper {
      flex: 1;
      margin: 40px;
      overflow-y: auto;
      .preview-header-area {
        width: 100%;
        text-align: center;
        .preview-title {
          font-size: 18px;
          color: rgba(0, 11, 21, 0.85);
          font-weight: bold;
        }
        .preview-intro {
          font-size: 12px;
          color: rgba(0, 11, 21, 0.45);
          max-width: 800px;
          margin: 16px auto 0;
          word-break: break-all;
        }
      }
      .preview-topic {
        margin-top: 40px;
        .question-item {
          font-size: 14px;
          margin-bottom: 40px;
          .question-title {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: flex-start;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.85);
            letter-spacing: 0;
            line-height: 22px;
            margin-bottom: 8px;
            .question-index {
              font-weight: bold;
              flex-grow: 0;
              flex-shrink: 1;
              display: flex;
              align-items: center;
              margin-right: 5px;
              .request {
                margin-right: 5px;
                color: red;
              }
              .text {
                color: #000;
              }
            }
            .question-name {
              font-weight: bold;
              max-width: 500px;
            }
            .question-type {
              flex: 0 0 70px;
              width: 70px;
              font-family: emoji;
              color: rgba(0, 11, 21, 0.45);
              font-weight: bold;
            }
            .question-limit {
              font-family: emoji;
              flex-shrink: 0;
              color: rgba(0, 11, 21, 0.45);
            }
          }
        }
      }
    }
  }
}
</style>
