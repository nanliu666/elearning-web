<template>
  <div class="data-block">
    <div
      v-if="title"
      class="header"
    >
      <span class="title">{{ title }}</span>
    </div>
    <div class="body">
      <ul class="data-list">
        <li
          v-for="(item, i) in data"
          :key="i"
          class="data-item"
        >
          <div class="data-desc">
            {{ item.name }}
          </div>
          <div class="data-content">
            <count-to
              :start-val="0"
              :end-val="item.content"
            />
            <span v-show="item.isPercent">%</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import countTo from 'vue-count-to'

export default {
  name: 'DataBlock',
  components: {
    countTo
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    thousands(num) {
      if (typeof num !== 'number') return num
      var str = num.toString()
      var reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
      return str.replace(reg, '$1,')
    }
  }
}
</script>

<style lang="scss" scoped>
.data-block {
  width: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  border-radius: 4px;
  background-color: #fff;
  cursor: default;
  .header {
    height: 56px;
    line-height: 56px;
    .title {
      margin-left: 24px;
      font-size: 16px;
      color: #596067;
    }
  }
  .body {
    background: rgba(245, 245, 245, 0.4);
    padding: 24px 0;
    .data-list {
      display: flex;
      align-items: center;
      .data-item {
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        box-sizing: border-box;
        &:not(:last-child) {
          border-right: 1px solid #ebeced;
        }
        .data-desc {
          margin-bottom: 8px;
          opacity: 0.45;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #000b15;
        }
        .data-content {
          font-size: 32px;
          color: #000b15;
        }
      }
    }
  }
}
</style>
