<template>
  <div class="preview-style">
    <page-header
      title="预览试卷"
      show-back
    >
      <div slot="rightMenu">
        <el-button
          v-if="$route.query.paperType !== 'manual' && !$route.query.isManaged"
          size="medium"
          @click="deletePreview"
        >
          删除
        </el-button>
        <el-button
          size="medium"
          @click="createTestpaper"
        >
          生成笔试试卷
        </el-button>
      </div>
    </page-header>
    <basic-container>
      <preview-content
        v-loading="contentLoading"
        :has-answer="true"
        :paper-data="paperData"
      />
    </basic-container>
    <preview-dialog
      :visible.sync="previewDialogVisible"
      :paper-data="paperData"
    />
  </div>
</template>

<script>
import PreviewContent from './components/previewComs/previewContent'
import PreviewDialog from './components/previewComs/previewDialog'
import { getManualPreview, delExamPreview, createRandomPaper } from '@/api/examManage/schedule'
export default {
  components: {
    PreviewDialog,
    PreviewContent
  },
  data() {
    return {
      contentLoading: false,
      previewDialogVisible: false,
      paperData: []
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    next()
  },
  activated() {
    this.initData()
  },
  methods: {
    /**
     * 打开笔试试卷窗口
     */
    createTestpaper() {
      this.previewDialogVisible = true
    },
    deletePreview() {
      delExamPreview({ id: this.$route.query.paperId }).then(() => {
        this.$message.success('删除成功')
        this.loadTableData('del')
      })
    },
    handleData(data) {
      return _.chain(data)
        .groupBy('parentSort')
        .sortBy('parentSort')
        .map((item) => {
          return _.sortBy(item, 'sort')
        })
        .value()
    },
    initData() {
      this.contentLoading = true
      this.paperData = []
      // 手工卷子接口 getManualPreview
      // 随机卷子接口统一接口 createRandomPaper
      let loadFun = this.$route.query.paperType === 'manual' ? getManualPreview : createRandomPaper
      // 随机卷子且进来预览不显示删除接口 getRandomPreview
      // if (this.$route.query.isManaged && this.$route.query.paperType === 'random') {
      //   loadFun = getRandomPreview
      // }
      const basicParams = { paperId: this.$route.query.paperId }
      const parmas = _.assign(basicParams, { previewId: this.$route.query.previewId })
      loadFun(parmas)
        .then((res) => {
          res.questions = this.handleData(res.questions)
          this.paperData = res
        })
        .finally(() => {
          this.contentLoading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.preview-container {
  padding: 60px 80px;
  min-height: 75vh;
}
</style>
