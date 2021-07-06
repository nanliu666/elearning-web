<template>
  <div class="approve">
    <div class="approve-title">
      <div class="pprove-title-t">
        黄浩提交的知识库申请
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <label class="approve-label">审批编号：</label>
          <span class="approve-value">20200916000012</span>
        </el-col>
        <el-col :span="6">
          <label class="approve-label">申请人：</label>
          <span class="approve-value">黄浩</span>
        </el-col>
        <el-col :span="6">
          <label class="approve-label">申请时间：</label>
          <span class="approve-value">2020-04-26 14:00:00</span>
        </el-col>
        <el-col :span="6">
          <label class="approve-label">状态：</label>
          <span class="approve-value">审批中</span>
        </el-col>
      </el-row>
    </div>
    <div>
      <div class="pprove-title-t">
        审批流程
      </div>
    </div>
  </div>
</template>

<script>
import { record } from '@/api/approvalCenter/approvalCenter'
export default {
  components: {},
  props: {},
  data() {
    return {}
  },
  mounted() {
    const id = this.$route.query.id
    this.getApproveList(id)
  },
  methods: {
    returnImg(img) {
      return img || require('../../../../public/img/icon-person-man.png')
    },
    getApproveList(apprNo) {
      record({ apprNo }).then(() => {})
      //this.dataList = data
    }
  }
}
</script>

<style scoped lang="scss">
.approve-title {
  padding: 0 0 16px;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.pprove-title-t {
  font-size: 16px;
  font-weight: bold;
  color: #666;
  margin-bottom: 16px;
}
.approve-label {
  color: rgba(0, 11, 21, 0.45);
}
</style>
