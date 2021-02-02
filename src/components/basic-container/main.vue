<template>
  <div
    class="basic-container"
    :class="{ 'basic-container--block': block }"
  >
    <el-card shadow="never">
      <slot />
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'BasicContainer',
  props: {
    block: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.basic-container {
  box-sizing: border-box;

  &--block {
    min-height: 100%;
    height: 100%;
    .el-card {
      min-height: 100%;
      box-sizing: border-box;
      margin-bottom: 24px;
    }
    .el-card__body {
      min-height: 100%;
      box-sizing: border-box;
    }
  }
  .el-card {
    width: 100%;
  }
  &:first-child {
    padding-top: 0;
  }
}
</style>
