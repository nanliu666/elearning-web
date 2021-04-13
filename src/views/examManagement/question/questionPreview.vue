<template>
  <span class="qustion">
    <span class="qustion__content">
      <span class="qustion__label">题目: </span>
      <span v-html="getHTML(data.content)" />
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
        <el-image :src="attachment.fileUrl"></el-image>
        <div class="upload__cover">
          <i
            class="iconimage_icon_Preview1 iconfont"
            @click.stop="handlePreviewImage(_.map(data.attachments, 'fileUrl'), index)"
          ></i>
        </div>
      </div>
    </div>
    <div
      v-if="[QUESTION_TYPE_SINGLE, QUESTION_TYPE_MULTIPLE, QUESTION_TYPE_JUDGE].includes(data.type)"
      class="qustion__options"
    >
      <li
        v-for="(option, index) in data.options"
        :key="option.key"
      >
        <div class="wrap">
          <el-radio
            v-if="[QUESTION_TYPE_SINGLE, QUESTION_TYPE_JUDGE].includes(data.type)"
            :value="option.isCorrect"
            :label="1"
            :disabled="true"
          >
            {{ '' }}
          </el-radio>
          <el-checkbox
            v-if="QUESTION_TYPE_MULTIPLE === data.type"
            :value="option.isCorrect"
            :true-label="1"
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
          <div
            v-if="option.url"
            class="qustion__options-image"
          >
            <el-image :src="option.url"></el-image>
            <div class="upload__cover">
              <i
                class="iconimage_icon_Preview1 iconfont"
                @click.stop="handlePreviewImage([option.url])"
              ></i>
            </div>
          </div>
        </div>
      </li>
    </div>
    <div v-if="!isPreview">
      <div
        v-if="data.type === QUESTION_TYPE_BLANK"
        class="qustion__correct-answer"
      >
        <span class="qustion__label">标准答案：</span>
        <span class="qustion__text">{{ data.answer }}</span>
      </div>
      <div class="qustion__analysis">
        <span class="qustion__label">试题分析：</span>
        <span class="qustion__text">{{ data.analysis }}</span>
      </div>
    </div>
    <image-viewer
      :url-list="viewingImages"
      :visible.sync="viewing"
      :initial-index="viewIndex"
    ></image-viewer>
  </span>
</template>

<script>
import ImageViewer from '@/components/image-viewer/ImageViewer'
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
import { addLine } from '@/util/util'

export default {
  name: 'QustionPreview',
  components: { ImageViewer },
  props: {
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
      viewingImages: [],
      viewing: false,
      viewIndex: 0
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
  methods: {
    getHTML(content) {
      return addLine(content)
    },
    handlePreviewImage(list, index = 0) {
      this.viewing = true
      this.viewingImages = list
      this.viewIndex = index
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-radio__label {
  padding-left: 0px;
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
    li {
      margin-bottom: 12px;
      .el-radio {
        margin-right: 10px;
      }
    }
  }
  &__options-image {
    display: inline-block;
    position: relative;
    width: 20%;
    &:hover {
      .upload__cover {
        display: flex;
      }
    }
  }
}
</style>
