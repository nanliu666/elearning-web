<template>
  <header>
    <page-header :title="title" />
    <el-button
      v-if="needExportBtn"
      type="primary"
      class="export"
      @click="showDialogs"
    >
      导出
    </el-button>
    <el-dialog
      v-loading="loading"
      element-loading-text="正在导出..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      title="请选择导出范围"
      :visible.sync="showDialog"
      width="30%"
      custom-class="range"
      center
    >
      <div class="option">
        <el-select
          v-model="range"
          placeholder="请选择"
        >
          <el-option
            v-for="item in exportRange"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closeDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="sureExport"
        >确 定</el-button>
      </span>
    </el-dialog>
  </header>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      require: true,
      default: 0
    },
    title: {
      type: String,
      require: true,
      default: ''
    },
    needExportBtn: {
      type: Boolean,
      default: false
    },
    exportLoading: {
      type: Boolean,
      default: false
    },
    changePage: {
      type: Number,
      default: 5000
    }
  },
  data() {
    return {
      loading: false,
      showDialog: false,
      range: ''
    }
  },
  computed: {
    exportRange() {
      let n = 1,
        arr = [],
        isGo = true
      const pageNum = this.changePage || 5000
      while (isGo) {
        if (n * pageNum < this.total) {
          arr.push({
            label: `${(n - 1) * pageNum + 1}~${n * pageNum}`,
            value: n
          })
          n++
        } else {
          arr.push({
            label: `${(n - 1) * pageNum + 1}~${n * pageNum}`,
            value: n
          })
          isGo = false
        }
      }
      return arr
    }
  },
  watch: {
    showDialog(val) {
      if (!val) {
        this.range = ''
      }
    },
    exportLoading(val) {
      this.loading = val
      if (!val) {
        this.closeDialog()
      }
    }
  },
  methods: {
    sureExport() {
      if (!this.range) {
        this.$message({
          message: '请选择一个范围',
          type: 'warning'
        })
        return
      }
      let r = this.exportRange[this.range - 1]
      this.loading = true
      this.$emit('expoerdata', {
        size: this.changePage,
        start: parseInt(r.label.split('~')[0]) - 1
      })
    },
    closeDialog() {
      this.showDialog = false
      this.range = ''
    },
    showDialogs() {
      if (this.total <= 0) {
        this.$message.error('暂时无法导出，请先查询数据')
        return
      }
      this.showDialog = !this.showDialog
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .export {
    padding: 0px 26px;
    line-height: 42px;
  }
  .range {
    text-align: center;
    .option {
      text-align: center;
    }
  }
}
</style>
