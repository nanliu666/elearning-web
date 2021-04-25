<template>
  <span class="qustion">
    <span v-if="data.type !== QUESTION_TYPE_BLANK">
      <span
        class="qustion-content-box"
        v-html="getHTML(data.content)"
      ></span>
      <!-- 简答题、填空题不显示（） -->
      <span v-if="!hasAnswer && data.type !== QUESTION_TYPE_SHOER">
        （ ）
      </span>
    </span>
    <div
      v-if="!_.isEmpty(data.attachments)"
      class="qustion__attachments"
    >
      <div
        v-for="(attachment, index) in data.attachments"
        :key="index"
        class="qustion__attachment"
      >
        <question-view :url="attachment.fileUrl" />
      </div>
    </div>
    <!-- 考试用来可编辑的状态 -->
    <div :class="{ 'blank-box': [QUESTION_TYPE_BLANK].includes(data.type) }">
      <!-- 判断题、单选题、多选题 -->
      <div
        v-if="
          [QUESTION_TYPE_SINGLE, QUESTION_TYPE_MULTIPLE, QUESTION_TYPE_JUDGE].includes(data.type)
        "
        class="qustion__options__box"
      >
        <li
          v-for="(option, index) in data.options"
          :key="option.key"
        >
          <div class="wrap">
            <el-radio
              v-if="[QUESTION_TYPE_SINGLE, QUESTION_TYPE_JUDGE].includes(data.type)"
              :class="{ hidden__pre: !hasAnswer }"
              :value="hasAnswer ? option.isCorrect : 0"
              :label="1"
              :disabled="true"
            >
              {{ '' }}
            </el-radio>
            <el-checkbox
              v-if="QUESTION_TYPE_MULTIPLE === data.type"
              :value="hasAnswer ? option.isCorrect : 0"
              :true-label="1"
              :class="{ hidden__pre: !hasAnswer }"
              :false-label="0"
              :disabled="true"
            >
              {{ '' }}
            </el-checkbox>
            <span>
              <span
                v-if="[QUESTION_TYPE_SINGLE, QUESTION_TYPE_MULTIPLE].includes(data.type)"
                style="margin-right: 4px"
              >{{ QUESTION_PREFACE[index] }}.</span>
              <span>{{ _.unescape(option.content) }}</span>
            </span>
            <question-view
              v-if="option.url"
              :url="option.url"
            />
          </div>
        </li>
      </div>
      <div
        v-if="[QUESTION_TYPE_SHOER].includes(data.type)"
        style="height: 50px; width: 100%"
      ></div>
      <ul
        v-if="[QUESTION_TYPE_BLANK].includes(data.type)"
        class="blank-ul"
      >
        <li
          v-for="(item, index) in blankList"
          :key="index"
        >
          <el-input
            v-if="item == '$'"
            :disabled="true"
            style="display: inline;"
            maxlength="32"
          >
          </el-input>
          <span
            v-else
            v-html="getHTML(item)"
          />
        </li>
      </ul>
    </div>
  </span>
</template>

<script>
import { deleteHTMLTag } from '@/util/util'
import questionView from './questionView'
import { addLine } from '@/util/util'
import {
  QUESTION_PREFACE,
  QUESTION_TYPE_MAP,
  QUESTION_TYPE_MULTIPLE,
  QUESTION_TYPE_SINGLE,
  QUESTION_TYPE_JUDGE,
  QUESTION_TYPE_SHOER,
  QUESTION_TYPE_BLANK,
  QUESTION_TYPE_GROUP
} from '@/const/examMange'
export default {
  name: 'QustionPreview',
  components: {
    questionView
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    hasAnswer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      blankList: []
    }
  },
  computed: {
    QUESTION_PREFACE: () => QUESTION_PREFACE,
    QUESTION_TYPE_MULTIPLE: () => QUESTION_TYPE_MULTIPLE,
    QUESTION_TYPE_SINGLE: () => QUESTION_TYPE_SINGLE,
    QUESTION_TYPE_JUDGE: () => QUESTION_TYPE_JUDGE,
    QUESTION_TYPE_BLANK: () => QUESTION_TYPE_BLANK,
    QUESTION_TYPE_SHOER: () => QUESTION_TYPE_SHOER,
    QUESTION_TYPE_MAP: () => QUESTION_TYPE_MAP,
    QUESTION_TYPE_GROUP: () => QUESTION_TYPE_GROUP
  },
  watch: {
    data: {
      handler(value) {
        switch (value.type) {
          case QUESTION_TYPE_BLANK:
            this.handleBlankValue(value)
            break
          case QUESTION_TYPE_MULTIPLE:
            this.handleMulipleValue(value)
            break
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getHTML(content) {
      return addLine(content)
    },
    handleMulipleValue(value) {
      const temp = _.cloneDeep(value.answerModel)
      let target = _.map(temp, (item) => {
        if (!_.isEmpty(item)) {
          return item.id
        }
      })
      value.answer = _.compact(target).join(',')
    },
    handleBlankValue(value) {
      // 手动将___转换成数组以_$_来分隔，通过$定位input，精髓在通过$前后的下划线来进行切分
      const content = deleteHTMLTag(_.unescape(value.content)).replace(/[_]{3}/g, '_$_')
      this.blankList = _.filter(_.split(content, '_'))
      let tempValue = []
      _.forIn(value, (forValue, key) => {
        if (key.includes('answerModel')) {
          let temp = { [key]: forValue }
          let WhetherIn = _.findIndex(tempValue, (item) => {
            return _.findKey(item) === _.findKey(temp)
          })
          if (WhetherIn === -1) {
            tempValue.push(temp)
          }
        }
      })
      const target = _.map(tempValue, (item) => {
        return _.get(item, _.findKey(item))
      })
      value.answer = target.join(',')
    }
  }
}
</script>

<style lang="scss" scoped>
.qustion__options__box {
  margin-top: 4px;
}
.hidden__pre {
  display: none;
}
/deep/ .el-radio {
  margin-right: 0;
}
/deep/ .el-input.is-disabled .el-input__inner {
  background-color: #fff;
}
.qustion {
  width: 100%;
}
.blank-box {
  display: inline-block;
}
.blank-ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  li {
    padding-bottom: 10px;
    /deep/ .el-input__inner {
      border-color: transparent;
      border-bottom-color: #303133;
      border-radius: 0;
      line-height: 20px;
      height: 20px;
      &:hover {
        border-color: transparent;
        border-bottom-color: #303133;
      }
    }
  }
}
.qustion {
  &__attachments {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    .el-image {
      vertical-align: middle;
    }
  }
  &__attachment {
    &:hover {
      .upload__cover {
        display: flex;
      }
    }
  }
  .upload__cover {
    width: 100%;
    height: 100%;
    position: absolute;
    display: none;
    top: 0;
    background-color: rgba(0, 0, 0, 0.6);
    align-items: center;
    justify-content: space-evenly;
    i {
      cursor: pointer;
      color: #fff;
    }
  }
  &__options {
    margin-top: 12px;
  }
}
</style>
