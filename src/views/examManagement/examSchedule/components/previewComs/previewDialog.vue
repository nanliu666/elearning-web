<template>
  <!-- 因为A4纸的宽为841.89像素，取大一点就可以了 -->
  <el-dialog
    :close-on-click-modal="false"
    width="580px"
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
import { exportPaperWord } from '@/api/examManage/schedule'
import { Loading } from 'element-ui'
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
      const loadingOptions = {
        text: '生成试卷中...',
        lock: true,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      }
      const loadingInstance = Loading.service(loadingOptions)
      const { type, id } = this.paperData
      const parmas = {
        paperId: id,
        paperType: type
      }
      switch (e) {
        case 'pdf':
          this.$pdf(
            this.$refs.contentRef.$refs.testPaper,
            {
              name: this.paperData.name // 导出文件名
            },
            loadingInstance
          )
          break
        case 'word':
          exportPaperWord(parmas).then((res) => {
            loadingInstance.close()
            const { data, headers } = res
            const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
            const blob = new Blob([data], { type: headers['content-type'] })
            let dom = document.createElement('a')
            let url = window.URL.createObjectURL(blob)
            dom.href = url
            dom.download = decodeURI(fileName)
            dom.style.display = 'none'
            document.body.appendChild(dom)
            dom.click()
            dom.parentNode.removeChild(dom)
            window.URL.revokeObjectURL(url)
          })
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  font-size: 10px;
  font-variant: small-caps;
  padding: 0 0 30px 0;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-right: 20px;
}
</style>
