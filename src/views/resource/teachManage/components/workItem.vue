<template>
  <div class="work-box">
    <!--工作经历详情-->
    <div class="work-title">
      <div class="work-title-name">
        <i class="work-title-icon"></i>
        <span>工作经历（{{ workNum + 1 }}）</span>
      </div>
      <div
        v-if="isShowBtn"
        class="work-title-btn"
      >
        <!-- <span class="work-title-active"></span> -->
        <el-button
          type="text"
          @click="handleEdit"
        >
          编辑
        </el-button>
        <el-button
          type="text"
          @click="handleDel"
        >
          删除
        </el-button>
      </div>
    </div>

    <div class="work-list">
      <el-row :gutter="60">
        <el-col :span="8">
          <label class="work-label">单位名称：</label>
          <span class="work-content">{{ itemData.workUnit || '--' }}</span>
        </el-col>
        <el-col :span="8">
          <label class="work-label">在职时间：</label>
          <span
            class="work-content"
          >{{ itemData.workStartTime }} 至 {{ itemData.workEndTime }}</span>
        </el-col>
        <el-col :span="8">
          <label class="work-label">职位名称：</label>
          <span class="work-content">{{ itemData.jobName || '--' }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="60">
        <el-col :span="8">
          <label class="work-label">证明人：</label>
          <span class="work-content">{{ itemData.witness || '--' }}</span>
        </el-col>
        <el-col :span="8">
          <label class="work-label">证明人联系电话：</label>
          <span class="work-content">{{ itemData.witnessPhone || '--' }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <label class="work-label">工作内容：</label>
          <span class="work-content">{{ itemData.workContent || '--' }}</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkItem',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    isShowBtn: {
      //是否显示操作按钮
      type: Boolean,
      default: true
    },
    workNum: {
      type: Number,
      default: 0
    },
    itemData: {
      //工作经历数据
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },

  methods: {
    //编辑
    handleEdit() {
      this.$emit('on-workEdit', this.itemData, this.workNum)
    },
    //删除
    handleDel() {
      this.$emit('on-workDel', this.workNum)
    }
  }
}
</script>

<style lang="scss" scoped>
.work-title-name {
  display: flex;
  align-items: center;
  span {
    font-size: 15px;
    color: rgba(0, 11, 21, 0.85);
  }
  .work-title-icon {
    width: 4px;
    height: 16px;
    background: #01aafc;
    margin-right: 8px;
  }
}
.work-box {
  padding: 8px 20px;
  margin-bottom: 16px;
  .work-title {
    display: flex;
    align-items: center;
    height: 42px;
    .work-title-btn {
      flex: 1;
      display: flex;
      align-items: center;
      margin-left: 20px;
    }
    .work-title-active {
      flex: 1;
      border-bottom: 1px dashed #ccc;
      margin: 0 12px 0 4px;
    }
  }
  .work-list {
    margin-top: 12px;
    .work-label {
      min-width: 80px;
      white-space: nowrap;
      color: rgba(0, 11, 21, 0.45);
    }
    .work-content {
      flex: 1;
      word-break: break-all;
    }
    /deep/.el-col {
      margin-bottom: 16px;
      display: flex;
    }
  }
}
</style>
