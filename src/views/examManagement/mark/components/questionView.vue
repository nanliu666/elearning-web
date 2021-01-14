<template>
  <div>
    <div
      v-if="url"
      class="qustion__options-image"
    >
      <el-image
        class="image-box"
        :src="url"
      ></el-image>
      <div class="upload__cover">
        <i
          class="iconimage_icon_Preview1 iconfont"
          @click.stop="handlePreviewImage([url])"
        ></i>
      </div>
    </div>
    <image-viewer
      :url-list="viewingImages"
      :visible.sync="viewing"
      :initial-index="viewIndex"
    ></image-viewer>
  </div>
</template>

<script>
import ImageViewer from '@/components/image-viewer/ImageViewer'
export default {
  name: 'QustionPreview',
  components: { ImageViewer },
  props: {
    url: { type: String, default: '' }
  },
  data() {
    return {
      viewingImages: [],
      viewing: false,
      viewIndex: 0
    }
  },
  created() {},
  methods: {
    handlePreviewImage(list, index = 0) {
      this.viewing = true
      this.viewingImages = list
      this.viewIndex = index
    }
  }
}
</script>

<style scoped lang="scss">
.qustion__options-image {
  display: inline-block;
  position: relative;
  width: 120px;
  max-height: 120px;
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
</style>
