<template>
  <div class="text-over-tooltip-components">
    <el-tooltip
      :effect="effect"
      :disabled="isDisabledTooltip"
      :content="content"
      :placement="placement"
    >
      <div
        class="ellipsis"
        :class="className"
        @mouseover="onMouseOver(refName)"
      >
        <span :ref="refName">{{ content }}</span>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'TextOverTooltip',
  props: {
    // 显示的文字内容
    content: String,
    // 设置父元素的样式：比如宽度字体等，需可以自己在组件内部配置样式比如字体大小20：fs20
    className: String,
    // 子元素标识（如在同一页面中调用多次组件，此参数不可重复）
    refName: String,
    // 默认提供的主题 dark/light
    effect: {
      type: String,
      default: () => {
        return 'dark'
      }
    },
    // Tooltip 的出现位置top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end
    placement: {
      type: String,
      default: () => {
        return 'top'
      }
    }
  },
  data() {
    return {
      isDisabledTooltip: true // 是否需要禁止提示
    }
  },
  methods: {
    // 移入事件: 判断内容的宽度contentWidth是否大于父级的宽度
    onMouseOver(str) {
      let parentWidth = this.$refs[str].parentNode.offsetWidth
      let contentWidth = this.$refs[str].offsetWidth
      // 判断是否禁用tooltip功能
      this.isDisabledTooltip = contentWidth <= parentWidth
    }
  }
}
</script>

<style lang="scss" scoped>
.text-over-tooltip-components {
  /* 文字超出宽度显示省略号 单行 */
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* 自定义样式 */
  //   .fs20 {
  //     font-size: 20px;
  //     font-weight: 600;
  //     color: green;
  //     line-height: 22px;
  //   }
  .blueColor {
    color: #53c9fe;
  }
}
</style>
