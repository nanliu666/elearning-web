<template>
  <span class="qustion">
    <span
      v-if="data.type !== QUESTION_TYPE_BLANK || type === 'view'"
      class="qustion-content-box"
      v-html="getHTML(data.content)"
    ></span>
    <el-tooltip
      class="item"
      effect="dark"
      :content="`试题分析：${_.get(data, 'analysis') || '暂无'}`"
      placement="top-start"
    >
      <el-button type="text">
        [查看试题分析]
      </el-button>
    </el-tooltip>
    <div
      v-if="!_.isEmpty(data.attachments)"
      class="qustion__attachments"
    >
      <div
        v-for="(attachment, index) in data.attachments"
        :key="index"
        class="qustion__attachment"
      >
        <common-image-view
          v-if="attachment.fileUrl"
          :url="attachment.fileUrl"
          :file-name="attachment.fileName"
          :preview-src-list="[attachment.fileUrl]"
        />
      </div>
    </div>
    <!-- 考试用来可编辑的状态 -->
    <div v-if="type === 'edit'">
      <!-- 判断题、单选题 -->
      <div
        v-if="[QUESTION_TYPE_SINGLE, QUESTION_TYPE_JUDGE].includes(data.type)"
        class="qustion__options"
      >
        <el-radio-group
          v-model="data.answer"
          class="group-container"
        >
          <el-radio
            v-for="option in data.examinationPaperUserOptionREQS"
            :key="option.key"
            class="radio"
            :label="option.id"
          >
            <span>{{ _.unescape(option.contentOption) }}</span>
            <common-image-view
              v-if="option.url"
              :url="option.url"
              :file-name="option.fileName"
              :preview-src-list="[option.url]"
            />
          </el-radio>
        </el-radio-group>
      </div>
      <!-- 多选题 -->
      <div
        v-if="
          [QUESTION_TYPE_MULTIPLE].includes(data.type) &&
            !_.isEmpty(data.examinationPaperUserOptionREQS)
        "
        class="qustion__options"
      >
        <li class="group-container">
          <el-checkbox
            v-for="option in data.examinationPaperUserOptionREQS"
            :key="option.id"
            v-model="option.answerModel"
            :disabled="disabled"
            :label="option.id"
            class="qustion-checkbox"
            @change="changeMultiple(option)"
          >
            <span>{{ _.unescape(option.contentOption) }}</span>
            <common-image-view
              v-if="option.url"
              :url="option.url"
              :file-name="option.fileName"
              :preview-src-list="[option.url]"
            />
          </el-checkbox>
        </li>
      </div>
      <el-input
        v-if="[QUESTION_TYPE_SHOER].includes(data.type)"
        v-model="data.answer"
        :disabled="disabled"
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
      >
      </el-input>
      <ul
        v-if="[QUESTION_TYPE_BLANK].includes(data.type)"
        class="blank-ul"
      >
        <li
          v-for="(item, index) in blankList"
          :key="index"
        >
          <el-input
            v-if="item === ''"
            v-model="data[`answerModel${index}`]"
            :disabled="disabled"
            style="display: inline;"
            placeholder="请输入内容"
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
    <div
      v-else
      class="view-contain-box"
    >
      <select-view
        v-if="
          [
            QUESTION_TYPE_MULTIPLE,
            QUESTION_TYPE_SINGLE,
            QUESTION_TYPE_JUDGE,
            QUESTION_TYPE_RANDOM
          ].includes(data.type)
        "
        :data="data"
      />
      <gap-and-short
        v-if="[QUESTION_TYPE_BLANK, QUESTION_TYPE_SHOER].includes(data.type)"
        ref="gapAndShorRef"
        :data="data"
      />
    </div>
  </span>
</template>

<script>
import { deleteHTMLTag } from '@/util/util'
import CommonImageView from '@/components/common-image-viewer/viewer'
import SelectView from './SelectView'
import GapAndShort from './GapAndShort'
import { addLine } from '@/util/util'
import {
  QUESTION_TYPE_MULTIPLE,
  QUESTION_TYPE_SINGLE,
  QUESTION_TYPE_JUDGE,
  QUESTION_TYPE_SHOER,
  QUESTION_TYPE_BLANK,
  QUESTION_TYPE_GROUP,
  QUESTION_TYPE_RANDOM
} from '@/const/examMange'
export default {
  name: 'QustionPreview',
  components: {
    CommonImageView,
    SelectView,
    GapAndShort
  },
  props: {
    type: {
      type: String,
      default: 'edit'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    isPreview: {
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
    QUESTION_TYPE_MULTIPLE: () => QUESTION_TYPE_MULTIPLE,
    QUESTION_TYPE_SINGLE: () => QUESTION_TYPE_SINGLE,
    QUESTION_TYPE_JUDGE: () => QUESTION_TYPE_JUDGE,
    QUESTION_TYPE_BLANK: () => QUESTION_TYPE_BLANK,
    QUESTION_TYPE_SHOER: () => QUESTION_TYPE_SHOER,
    QUESTION_TYPE_GROUP: () => QUESTION_TYPE_GROUP,
    QUESTION_TYPE_RANDOM: () => QUESTION_TYPE_RANDOM
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
      const content = deleteHTMLTag(_.unescape(value.content))
      this.blankList = content.split('___')
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
    },
    changeMultiple() {
      const dataValue = _.map(this.data.examinationPaperUserOptionREQS, (item) => {
        if (item.answerModel) {
          return item
        }
      })
      this.data.answerModel = dataValue
    }
  }
}
</script>

<style lang="scss" scoped>
.blank-ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  li {
    // display: inline-block
    /deep/ .el-input__inner {
      border-color: transparent;
      border-bottom-color: #303133;
      border-radius: 0;
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
    .el-image {
      vertical-align: middle;
    }
  }
  &__attachment {
    display: inline-block;
    position: relative;
    margin-right: 10px;
    width: calc(20% - 10px);

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
    .group-container {
      .el-radio {
        margin-right: 0px;
        margin-bottom: 16px;
        display: block;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .qustion-checkbox {
        margin-bottom: 16px;
        display: flex;
        align-items: flex-start;
        &:last-child {
          margin-bottom: 0;
        }
        /deep/ .el-checkbox__label {
          margin-top: -2px;
        }
      }
    }
  }
}
</style>
