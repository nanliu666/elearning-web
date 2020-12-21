<template>
  <div class="image-li">
    <el-image
      class="el-image"
      :src="url"
      :preview-src-list="previewSrcList"
    />
    <div class="image-name">
      {{ fileName }}
    </div>
    <div class="handle-box">
      <span
        v-if="isDownload"
        @click.stop="downloadFile(url)"
      ><i class="el-icon-download"></i></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommonImageView',
  props: {
    isDownload: {
      type: Boolean,
      default: true
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
    return {}
  },
  methods: {
    downloadFile(url) {
      this.$emit('downloadFile', url)
    }
  }
}
</script>

<style scoped lang="scss">
.image-li {
  position: relative;
  margin-right: 40px;
  margin-bottom: 40px;
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
    padding-left: 16px;
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
