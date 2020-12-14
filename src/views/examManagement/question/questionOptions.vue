<template>
  <ul class="question-options">
    <li
      v-for="(option, index) in value"
      :key="option.key"
    >
      <div class="wrap">
        <el-radio
          v-if="!isCheckBox"
          v-model="option.isCorrect"
          :label="1"
          @change="(val) => handleRadioCheck(val, option)"
        >
          {{ '' }}
        </el-radio>
        <el-checkbox
          v-if="isCheckBox"
          v-model="option.isCorrect"
          :true-label="1"
        >
          {{ '' }}
        </el-checkbox>
        <el-input
          v-model="option.content"
          maxlength="150"
          placeholder="请输入选项内容"
        ></el-input>
        <i
          v-if="value.length > 2"
          class="iconimage_icon_deletetheselectedentry1 iconfont"
          @click="handleRemoveOption(option)"
        ></i>
        <i
          v-if="index === value.length - 1 && value.length < 10"
          class="iconimage_icon_Addoptions1 iconfont"
          @click="handleAddOption"
        ></i>
      </div>
      <div class="upload__wrapper">
        <common-upload
          :value="option.fileList"
          :before-upload="(file) => beforeUpload(file, option)"
          :limit="1"
          @input="(val) => handleUpload(val, option)"
        >
          <template #default>
            <el-button
              size="medium"
              type="text"
              class="upload__btn"
              :style="`${_.size(option.fileList) !== 0 ? 'color:#C0C4CC;' : ''}`"
              @click="handleClick($event, option)"
            >
              添加图片
            </el-button>
            <ul
              v-if="_.size(option.fileList) > 0"
              class="upload__files"
              @click="handleClick($event, option)"
            >
              <li
                v-for="(item, i) in option.fileList"
                :key="i"
              >
                <el-image
                  style="width: 64px; height: 64px"
                  :src="item.url"
                >
                </el-image>
                <div class="upload__cover">
                  <i
                    class="iconimage_icon_Preview1 iconfont"
                    @click.stop="handlePreviewImage(option)"
                  ></i>
                  <i
                    class="iconimage_icon_delete iconfont"
                    @click.stop="handleRemoveAttachment(option)"
                  ></i>
                </div>
              </li>
            </ul>
          </template>
        </common-upload>
      </div>
    </li>
    <image-viewer
      :url-list="[viewingUrl]"
      :visible.sync="viewing"
    ></image-viewer>
  </ul>
</template>

<script>
import { createUniqueID } from '@/util/util'
import Emitter from '@/mixins/elFormEmitter'
import CommonUpload from '@/components/common-upload/commonUpload'
import ImageViewer from '@/components/image-viewer/ImageViewer'
export default {
  name: 'QuestionOptions',
  components: {
    CommonUpload,
    ImageViewer
  },
  mixins: [Emitter],
  props: {
    value: {
      type: Array,
      default: () => []
    },
    isCheckBox: {
      type: Boolean,
      default: false
    },
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      viewing: false,
      viewingUrl: ''
    }
  },
  methods: {
    handleClick(e, item) {
      if (_.size(item.fileList) !== 0) {
        e.stopPropagation()
      }
    },
    handleUpload(val, item) {
      item.fileList = val
      item.url = _.head(val).url
    },
    beforeUpload(file, option) {
      const regx = /^.*\.(png|jpg|jpeg)$/
      const isLt5M = file.size / 1024 / 1024 < 5
      if (option.fileList.length !== 0) {
        this.$message.error('选项图片只能上传一张')
        return false
      }
      if (!isLt5M) {
        this.$message.error('上传附件大小不能超过 5MB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传附件只支持png、jpg、jpge格式文件')
        return false
      }
      return true
    },
    handleRemoveAttachment(option) {
      option.fileList = []
      option.url = ''
    },
    handlePreviewImage(option) {
      this.viewing = true
      this.viewingUrl = option.url
    },
    handleRadioCheck(val, option) {
      this.value.forEach((item) => {
        if (item.key !== option.key) {
          item.isCorrect = 0
        }
      })
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', this.value)
      }
    },
    handleRemoveOption(option) {
      this.$emit(
        'input',
        _.filter(this.value, (item) => item.key !== option.key)
      )
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', this.value)
      }
    },
    handleAddOption() {
      this.value.push({
        key: createUniqueID(),
        content: '',
        isCorrect: 0,
        fileList: [],
        url: ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.question-options {
  li {
    margin-bottom: 12px;
    &:last-of-type {
      margin-bottom: 0;
    }
    .wrap {
      width: 100%;
      display: flex;
      align-items: center;
      i {
        margin-left: 10px;
        color: #8c9195;
        font-size: 20px;
        cursor: pointer;
      }
    }
    .el-radio {
      margin-right: 10px;
    }
    .el-checkbox {
      margin-right: 10px;
    }
    .el-input {
      width: 60%;
    }
  }
  .upload__wrapper {
    padding-left: 34px;
    line-height: 16px;
  }
  .upload__btn {
    margin-top: 6px;
    padding: 0;
  }
  .upload__files {
    display: flex;
    margin-top: 8px;

    li {
      margin-right: 10px;
      position: relative;
      height: 64px;
      width: 64px;
      border-radius: 4px;
      overflow: hidden;
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
          color: #fff;
        }
      }
      &:hover {
        .upload__cover {
          display: flex;
        }
      }
    }
  }
}
</style>
