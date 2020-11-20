<template>
  <div>
    <page-header
      title="学习情况"
      show-back
    />
    <basic-container>
      <div class="details-container">
        <div class="details-top">
          <div class="top-title">
            <span class="title-text">{{ konwledgeDetail.resName }}</span>
            <span class="title-status">{{ konwledgeDetail.status | statusFilterer }}</span>
          </div>
          <ul class="details-ul">
            <li class="details-li">
              <span class="li-label">创建人：</span>
              <span class="li-value">{{ konwledgeDetail.createName }}</span>
            </li>
            <li class="details-li">
              <span class="li-label">更新时间：</span>
              <span class="li-value">{{ konwledgeDetail.updateTime || new Date() }}</span>
            </li>
            <li class="details-li">
              <span class="li-label">所在目录：</span>
              <span class="li-value">{{ konwledgeDetail.catalogName }}</span>
            </li>
            <li class="details-li">
              <span class="li-label">提供人：</span>
              <span class="li-value">{{ konwledgeDetail.provideName }}</span>
            </li>
            <li class="details-li">
              <span class="li-label">上传模式：</span>
              <span class="li-value">{{
                konwledgeDetail.uploadType === 0 ? '本地文件' : '链接文件'
              }}</span>
            </li>
            <li
              v-if="konwledgeDetail.uploadType !== 0"
              class="details-li"
            >
              <span class="li-label">资源地址：</span>
              <span class="li-value">{{ konwledgeDetail.resUrl }}</span>
            </li>
          </ul>
        </div>
        <div class="details-bottom">
          <li class="bottom-li">
            <div class="bottom-li-title">
              查看人数
            </div>
            <div class="bottom-li-value">
              {{ konwledgeDetail.view || 20 }}
            </div>
          </li>
          <li class="bottom-li">
            <div class="bottom-li-title">
              收藏人数
            </div>
            <div class="bottom-li-value">
              {{ konwledgeDetail.start || 20 }}
            </div>
          </li>
          <li class="bottom-li">
            <div class="bottom-li-title">
              评论人数
            </div>
            <div class="bottom-li-value">
              {{ konwledgeDetail.comment || 20 }}
            </div>
          </li>
          <li class="bottom-li">
            <div class="bottom-li-title">
              下载人数
            </div>
            <div class="bottom-li-value">
              {{ konwledgeDetail.download || 20 }}
            </div>
          </li>
        </div>
      </div>
    </basic-container>
    <basic-container style="margin-top: 20px">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          资源介绍
        </el-menu-item>
        <el-menu-item
          v-if="_.size(konwledgeDetail.attachments) > 0"
          index="2"
        >
          附件
        </el-menu-item>
      </el-menu>
      <div style="padding: 20px">
        <div
          v-if="activeIndex === '1'"
          v-html="konwledgeDetail.introduction"
        />
        <div v-if="activeIndex === '2'"></div>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { getKnowledgeManageDetails } from '@/api/knowledge/knowledge'
export default {
  filters: {
    statusFilterer(data) {
      return data === 0 ? '已上架' : '已下架'
    }
  },
  data() {
    return {
      activeIndex: '1',
      konwledgeDetail: {}
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getKnowledgeManageDetails({ id: this.$route.query.id }).then((res) => {
        this.konwledgeDetail = res
      })
    },
    handleSelect(key) {
      this.activeIndex = key
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-menu--horizontal {
  border-bottom: 1px solid #cccccc !important;
}
.details-container {
  background-color: #fff;
  .details-top {
    padding: 20px;
    border-bottom: 1px solid #e3e7e9;
    .top-title {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .title-text {
        font-size: 18px;
        font-weight: 550;
        margin-right: 10px;
      }
      .title-status {
        background-color: #d2f5e7;
        color: #2a666b;
        padding: 4px;
      }
    }
    .details-ul {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      .details-li {
        width: 50%;
        display: flex;
        margin-bottom: 10px;
        .li-label {
          min-width: 20%;
          display: inline-block;
          color: #666666;
        }
        .li-value {
          color: #1e1e1e;
        }
      }
    }
  }
  .details-bottom {
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    .bottom-li {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 25%;
      .bottom-li-title {
        color: #666666;
        font-size: 16px;
      }
      .bottom-li-value {
        font-size: 18px;
        color: #1e1e1e;
        font-weight: 500;
        margin-top: 10px;
      }
    }
  }
}
</style>
