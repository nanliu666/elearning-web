<template>
  <div class="materials">
    <page-header
      title="查看上报材料"
      show-back
    />
    <div class="materials_top">
      <div class="materials_top_title">
        这是一个寂寞的天，没有下雨
      </div>
      <div class="materials_top_box">
        <div class="materials_top_box_item">
          <span>手机</span>
          <span>12312312312</span>
        </div>
        <div class="materials_top_box_item">
          <span>手机</span>
          <span>12312312312</span>
        </div>
        <div class="materials_top_box_item">
          <span>手机</span>
          <span>12312312312</span>
        </div>
        <div class="materials_top_box_item">
          <span>手机</span>
          <span>12312312312</span>
        </div>
        <div class="materials_top_box_item">
          <span>手机</span>
          <span>12312312312</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.materials {
  &_top {
    background-color: #fff;
    padding: 25px;
    &_title {
      font-size: 18px;
      font-weight: bold;
    }
    &_box {
      display: flex;
      flex-wrap: wrap;
      &_item {
        width: 33%;
      }
    }
  }
}
</style>
