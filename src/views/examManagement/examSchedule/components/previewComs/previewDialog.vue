<template>
  <el-dialog
    :close-on-click-modal="false"
    width="70%"
    append-to-body
    :visible="innerVisible"
    :modal-append-to-body="false"
    @close="handleClose"
  >
    <div>
      <preview-content
        ref="contentRef"
        :has-answer="false"
        :paper-data="paperData"
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-dropdown
          size="medium"
          style="margin-right: 20px"
          @command="dropdownClick"
        >
          <el-button
            type="primary"
            size="medium"
          >
            下载试卷<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="word">下载word</el-dropdown-item>
            <el-dropdown-item command="pdf">下载PDF</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          size="medium"
          @click="innerVisible = false"
        >关闭</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import PreviewContent from './previewContent'
export default {
  name: 'PreviewDialog',
  components: {
    PreviewContent
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    paperData: {
      type: [Array, Object],
      default: () => []
    }
  },
  data() {
    return {}
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    handleClose() {
      this.innerVisible = false
    },
    dropdownClick(e) {
      switch (e) {
        case 'pdf':
          this.$nextTick(() => {
            this.$pdf(this.$refs.contentRef.$refs.testPaper, {
              name: this.paperData.name // 导出文件名
            })
          })
          break
        case 'word':
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
