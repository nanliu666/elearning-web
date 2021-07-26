<template>
  <el-dialog
    :close-on-click-modal="false"
    width="450px"
    append-to-body
    :visible="innerVisible"
    :modal-append-to-body="false"
    @close="handleClose"
  >
    <div
      slot="title"
      class="title__container"
    >
      <span class="main__title">导出</span>
      <span class="sub__title">
        （提示：由于系统限制，每次最多能导出5000条数据）
      </span>
    </div>
    <div class="dialog__main">
      <div class="main__title">
        <span>共</span>
        <span>{{ totalNum }}</span>
        <span>条数据，请选择你需要导出的数据范围：</span>
      </div>
      <el-radio-group
        v-model="activeRadio"
        class="radio__grounp"
      >
        <el-radio
          v-for="(item, index) in rangeList"
          :key="index"
          :label="item.key"
          class="radio__li"
        >
          {{ item.value }}
        </el-radio>
      </el-radio-group>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        v-loading="exportLoading"
        type="primary"
        size="medium"
        @click="submit"
      >确定</el-button>
      <el-button
        size="medium"
        @click="handleClose"
      >取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
const MAX_NUMBER = 5000
import { exportToExcel } from '@/util/util'
export default {
  name: 'ExportDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    totalNum: {
      type: Number,
      default: MAX_NUMBER
    },
    exportApi: {
      type: [Function, Object],
      default: () => {}
    },
    exportParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      exportLoading: false,
      activeRadio: 0
    }
  },
  computed: {
    rangeList() {
      const { totalNum } = this
      let temp = totalNum / MAX_NUMBER
      const times = _.floor(temp)
      const lastNumNotInteger = !_.isInteger(totalNum / MAX_NUMBER) // 总数不能被5000整除
      let target = []
      for (let i = 0; i < times; i++) {
        const TIMES_NODE = (i + 1) * MAX_NUMBER
        const start = i === 0 ? 1 : TIMES_NODE + 1
        const end = TIMES_NODE
        const range = `${start} ~ ${end}`
        target.push({
          key: i,
          value: range
        })
      }
      if (lastNumNotInteger) {
        const TIMES_NODE = times * MAX_NUMBER
        const start = TIMES_NODE + 1
        const end = this.totalNum
        const range = `${start} ~ ${end}`
        target.push({
          key: times,
          value: range
        })
      }
      return target
    },
    innerVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  created() {},
  methods: {
    submit() {
      this.exportLoading = true
      // 导出起始位置, 导出数量
      const parasmOne = {
        start: this.activeRadio, // 导出开始位置
        size: MAX_NUMBER // 导出数量 固定5000
      }
      // 去除导出起始位置, 导出数量与原列表接口字段相同时的冲突
      const paramsTwo = _.omit(this.exportParams, ['start', 'size'])
      const params = _.assign(parasmOne, paramsTwo)
      this.exportApi(params)
        .then((res) => {
          exportToExcel(res)
        })
        .finally(() => {
          this.exportLoading = false
          setTimeout(() => {
            this.handleClose()
          }, 1000)
        })
    },
    handleClose() {
      this.innerVisible = false
    }
  }
}
</script>
<style scoped lang="scss">
/deep/ .el-dialog__header {
  padding: 0;
}
/deep/ .el-dialog__body {
  padding: 20px;
}
.title__container {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eeeeee;
  .main__title {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    line-height: 22px;
    font-weight: 500;
  }
  .sub__title {
    opacity: 0.45;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: rgba(0, 11, 21, 0.85);
    line-height: 18px;
    font-weight: 400;
  }
}
.dialog__main {
  height: 30vh;
  .main__title {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    line-height: 22px;
    font-weight: 500;
    margin-bottom: 20px;
  }
  .radio__grounp {
    display: flex;
    flex-direction: column;
    border: 1px solid #eeeeee;
    padding: 20px;
    height: 90%;
    overflow: auto;
    .radio__li {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
