<template>
  <div class="image-uploader">
    <common-upload
      v-model="uploadFileList"
      style="margin-bottom:20px"
      :before-upload="beforeUpload"
      multiple
      :limit="5"
    >
      <template #default>
        <el-button
          size="medium"
          type="text"
          :style="`padding: 0; ${uploadFileList.length >= 5 ? 'color:#C0C4CC;' : ''}`"
          @click="handleUpload($event)"
        >
          添加图片
        </el-button>
        <ul
          v-if="_.size(uploadFileList) > 0"
          class="upload__files"
          @click="handleUpload($event)"
        >
          <li
            v-for="(item, index) in uploadFileList"
            :key="index"
          >
            <el-image
              style="width: 64px; height: 64px"
              :src="item.url"
            >
            </el-image>
            <div class="upload__cover">
              <i
                class="iconimage_icon_Preview1 iconfont"
                @click.stop="handlePreviewImage(index)"
              ></i>
              <i
                class="iconimage_icon_delete iconfont"
                @click.stop="handleRemoveAttachment(index)"
              ></i>
            </div>
          </li>
        </ul>
      </template>
    </common-upload>
    <image-viewer
      :url-list="_.map(uploadFileList, 'url')"
      :visible.sync="viewing"
      :initial-index="viewIndex"
    ></image-viewer>
  </div>
</template>

<script>
import CommonUpload from '@/components/common-upload/commonUpload'
import ImageViewer from '@/components/image-viewer/ImageViewer'
export default {
  name: 'ImageUploader',
  components: {
    CommonUpload,
    ImageViewer
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      viewing: false,
      viewIndex: 0
    }
  },

  computed: {
    uploadFileList: {
      get() {
        return _.map(this.value, (item) => ({
          url: item.fileUrl,
          localName: item.fileName
        }))
      },
      set(val) {
        this.$emit(
          'input',
          val.map((item) => ({ fileUrl: item.url, fileName: item.localName }))
        )
      }
    }
  },
  methods: {
    handleUpload(e) {
      if (this.uploadFileList.length >= 5) {
        e.stopPropagation()
      }
    },
    beforeUpload(file) {
      const regx = /^.*\.(png|jpg|jpeg)$/
      const isLt5M = file.size / 1024 / 1024 < 5
      if (this.uploadFileList.length >= 5) {
        this.$message.error('上传附件不能超过5张')
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
    handleRemoveAttachment(index) {
      this.uploadFileList = _.filter(this.uploadFileList, (_, i) => i !== index)
    },
    handlePreviewImage(index) {
      this.viewing = true
      this.viewIndex = index
    }
  }
}
</script>

<style lang="scss" scoped>
.image-uploader {
  /deep/ .el-upload {
    text-align: left;
    display: block;
  }
}
.upload__files {
  display: flex;
  margin-top: 8px;
  font-size: 16px;
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
</style>
