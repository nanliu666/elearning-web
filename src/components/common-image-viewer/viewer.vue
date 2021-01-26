<template>
  <div class="image-li">
    <el-image
      class="el-image"
      :src="url"
    />
    <image-viewer
      :url-list="previewSrcList"
      :visible.sync="viewing"
      :initial-index="viewIndex"
    ></image-viewer>
    <div
      v-if="fileName"
      class="image-name"
    >
      <span class="ellipsis">
        {{ fileName }}
      </span>
    </div>
    <div class="handle-box">
      <span
        v-if="isDownload"
        @click.stop="downloadFile(url)"
      ><i class="el-icon-download"></i></span>
      <span @click.stop="handlePreviewImage([url])"><i class="el-icon-view" /></span>
    </div>
  </div>
</template>

<script>
import ImageViewer from '@/components/image-viewer/ImageViewer'
export default {
  name: 'CommonImageView',
  components: {
    ImageViewer
  },
  props: {
    isDownload: {
      type: Boolean,
      default: false
    },
    // 文件名称
    fileName: {
      type: String,
      default: ''
    },
    // 获取的时候预先获取预览的url路径列表
    previewSrcList: {
      type: Array,
      default: () => []
    },
    // 当前展示的url
    url: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      viewing: false,
      viewIndex: 0
    }
  },
  methods: {
    downloadFile(url) {
      this.$emit('downloadFile', url)
    },
    handlePreviewImage(list, index = 0) {
      this.viewing = true
      this.viewingImages = list
      this.viewIndex = index
    }
  }
}
</script>

<style scoped lang="scss">
.image-li {
  position: relative;
  margin-right: 40px;
  width: 240px;
  border: 1px solid #ebeced;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  border-radius: 4px;
  .el-image {
    width: 100%;
    height: 180px;
  }
  .image-name {
    height: 36px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #000b15;
  }
  .handle-box {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    span {
      cursor: pointer;
      margin-left: 8px;
      background-color: rgba(#000000, 0.45);
      width: 28px;
      height: 28px;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        color: #ffffff;
      }
    }
  }
}
</style>
