<template>
  <div class="image-viewer">
    <el-image-viewer
      v-if="visible"
      :initial-index="initialIndex"
      :url-list="urlList"
      :on-close="onClose"
    />
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'ImageViewer',
  components: {
    ElImageViewer
  },
  props: {
    urlList: {
      type: Array,
      default: () => []
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-image-viewer__mask {
  opacity: 0.75;
}

/deep/ .el-icon-circle-close {
  color: #fff;
}
</style>
