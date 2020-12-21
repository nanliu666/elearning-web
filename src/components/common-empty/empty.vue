<template>
  <el-card
    shadow="never"
    style="border: 0"
  >
    <div
      :style="{ height: height }"
      class="empty-class"
    >
      <el-image
        class="empty-image"
        :src="src"
        fit="fill"
      />
      <div v-text="text" />
    </div>
  </el-card>
</template>

<script>
import nodata from '@/assets/images/nodata.png'
export default {
  name: 'ComEmpty',
  props: {
    height: {
      type: String,
      default: ''
    },
    src: {
      type: Object,
      default: () => {
        return nodata
      }
    },
    text: {
      type: String,
      default: '暂无数据~'
    }
  },
  mounted() {
    // 因为element的card组件默认padding为24px，经过多次测试，估摸着4.6倍是最佳显示比例
    const elCardPadding = 24
    if (!this.height) {
      this.height = `${this.$parent.$el.offsetHeight - elCardPadding * 4.6}px`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
.empty-class {
  background-color: #fff;
  height: 100%;
  min-height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 18px;
  color: #718199;
  box-sizing: border-box;
  // .empty-image {
  //   // max-width: 80%;
  //   img {
  //     max-width: 300px;
  //     height: 300px;
  //   }
  // }
}
</style>
