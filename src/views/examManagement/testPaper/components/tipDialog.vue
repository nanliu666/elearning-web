<template>
  <el-dialog
    title="提醒"
    :visible.sync="Visible"
    width="500px"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :before-close="onClose"
    @opened="onOpened"
  >
    <div v-loading="loading">
      <div>
        您选中试卷有正在关联的考试，请调整后再进行删除！
      </div>
      <div
        class="test"
        @click="handleisHide"
      >
        <el-button type="text">
          查看关联考试 <span
            v-if="!ishide"
            class="el-icon-arrow-up"
          ></span>
          <span
            v-else
            class="el-icon-arrow-down"
          ></span>
        </el-button>
        <div
          v-if="!ishide"
          class="content"
        >
          <div
            v-for="(item, i) in listData"
            :key="i"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <div></div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="medium"
          @click="onClose"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          size="medium"
          @click="onClose"
        >
          确定
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'TipDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      Visible: true,
      ishide: false
    }
  },
  computed: {
    listData() {
      return this.tableData[0].examname.split(',')
    }
  },
  watch: {
    Visible: {
      handler: function() {
        this.$emit('update:visible', false)
        this.$emit('update:tableData', [])
      }
    }
  },
  mounted() {},
  methods: {
    handleisHide() {
      this.ishide = !this.ishide
    },
    onOpened() {},
    onClose() {
      this.Visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__header {
  padding: 16px 0;
  margin: 0 24px;
  /*border-bottom: 1px solid rgba(208, 211, 214, 0.44);*/
  font-size: 18px;
  color: #202940;
  line-height: 24px;
}

/deep/ .el-dialog__body {
  padding: 4px 24px 10px 24px;
}

/deep/ .el-dialog__footer {
  padding: 0px 24px 24px;
}

/deep/ .el-form-item__label {
  line-height: 20px;
  font-size: 14px;
  color: #0f0000;
}

/deep/ .el-form-item {
  margin-bottom: 24px;
}

.dialog-footer {
  text-align: right;
}

/deep/ .is-error {
  .tree-button {
    border-color: #f56c6c;
  }
}

/deep/ .el-radio {
  margin-right: 20px;
}

/deep/ .el-input__icon .el-input__validateIcon .el-icon-circle-close {
  display: none;
}

.answerTime {
  font-size: 14px;
  margin-right: 5px;
}
.test {
  margin-top: 15px;
  margin-bottom: 20px;
}
.content {
  max-height: 100px;
  overflow-y: auto;
  line-height: 20px;
}
</style>
