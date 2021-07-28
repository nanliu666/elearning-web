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
            <el-tag :type="getStatusType(konwledgeDetail.status)">
              {{ konwledgeDetail.status | statusFilterer }}
            </el-tag>
          </div>

          <el-row :gutter="20">
            <el-col :span="8">
              <span class="li-label">创建人：</span>
              <span class="li-value">{{ konwledgeDetail.creatorName || '--' }}</span>
            </el-col>
            <el-col :span="8">
              <span class="li-label">更新时间：</span>
              <span class="li-value">{{ konwledgeDetail.updateTime || '--' }}</span>
            </el-col>
            <el-col :span="8">
              <span class="li-label">提供人：</span>
              <span class="li-value">{{
                konwledgeDetail.providerName ? konwledgeDetail.providerName : '--'
              }}</span>
            </el-col>
            <el-col :span="8">
              <span class="li-label">所在分类：</span>
              <span class="li-value">{{ konwledgeDetail.catalogName || '--' }}</span>
            </el-col>
            <el-col :span="8">
              <span class="li-label">知识体系：</span>
              <span class="li-value">{{ konwledgeDetail.knowledgeSystemFullName || '--' }}</span>
            </el-col>
            <el-col :span="8">
              <span class="li-label">提供人岗位：</span>
              <span class="li-value">{{ konwledgeDetail.providerPosition || '--' }}</span>
            </el-col>
            <el-col :span="8">
              <span class="li-label">知识类型：</span>
              <span class="li-value">{{
                konwledgeDetail.type == '1'
                  ? '视频'
                  : konwledgeDetail.type == '2'
                    ? '文档'
                    : '资料下载'
              }}</span>
            </el-col>
            <el-col :span="8">
              <span class="li-label">是否允许下载：</span>
              <span class="li-value">{{ konwledgeDetail.allowDownload === 0 ? '是' : '否' }}</span>
            </el-col>
            <el-col :span="8">
              <span class="li-label">提供人部门：</span>
              <span class="li-value">{{ konwledgeDetail.providerOrgName || '--' }}</span>
            </el-col>

            <el-col :span="8">
              <span class="li-label">上传模式：</span>
              <span class="li-value">{{
                konwledgeDetail.uploadType === 0 ? '本地文件' : '链接文件'
              }}</span>
            </el-col>

            <!-- <el-col :span="24" v-if="konwledgeDetail.uploadType === 1">
              <span class="li-label">链接地址：</span>
              <span class="li-value">{{ konwledgeDetail.resUrl }}</span>
            </el-col> -->
          </el-row>

          <!-- <ul class="details-ul">
            <li class="details-li">
              <span class="li-label">创建人：</span>
              <span class="li-value">{{ konwledgeDetail.creatorName }}</span>
            </li>
            <li class="details-li">
              <span class="li-label">更新时间：</span>
              <span class="li-value">{{ konwledgeDetail.updateTime }}</span>
            </li>

            <li class="details-li">
              <span class="li-label">提供人：</span>
              <span class="li-value">{{
                konwledgeDetail.providerName ? konwledgeDetail.providerName : '--'
              }}</span>
            </li>

            <li class="details-li">
              <span class="li-label">所在分类：</span>
              <span class="li-value">{{ konwledgeDetail.catalogName }}</span>
            </li>
            
            <li class="details-li">
              <span class="li-label">知识体系：</span>
              <span class="li-value">{{ konwledgeDetail.catalogName }}</span>
            </li>
            <li class="details-li">
              <span class="li-label">提供人岗位：</span>
              <span class="li-value">{{ konwledgeDetail.catalogName }}</span>
            </li>
            <li class="details-li">
              <span class="li-label">知识类型：</span>
              <span class="li-value">{{ konwledgeDetail.catalogName }}</span>
            </li>
            <li
              v-if="konwledgeDetail.uploadType === 0"
              class="details-li"
            >
              <span class="li-label">是否允许下载：</span>
              <span class="li-value">{{ konwledgeDetail.allowDownload === 0 ? '是' : '否' }}</span>
            </li>

            <li class="details-li">
              <span class="li-label">提供人部门：</span>
              <span class="li-value">{{ konwledgeDetail.catalogName }}</span>
            </li>

            <li class="details-li">
              <span class="li-label">上传模式：</span>
              <span class="li-value">{{
                konwledgeDetail.uploadType === 0 ? '本地文件' : '链接文件'
              }}</span>
            </li>
            
            <li
              v-if="konwledgeDetail.uploadType === 1"
              class="details-li"
              style="width: 100%;"
            >
              <span class="li-label">链接地址：</span>
              <span class="li-value">{{ konwledgeDetail.resUrl }}</span>
            </li>
          </ul> -->
        </div>
        <div class="details-bottom">
          <li class="bottom-li">
            <div class="bottom-li-title">
              查看人数
            </div>
            <div class="bottom-li-value">
              {{ konwledgeDetail.watchNum }}
            </div>
          </li>
          <li class="bottom-li">
            <div class="bottom-li-title">
              收藏人数
            </div>
            <div class="bottom-li-value">
              {{ konwledgeDetail.collectNum }}
            </div>
          </li>
          <li class="bottom-li">
            <div class="bottom-li-title">
              评论人数
            </div>
            <div class="bottom-li-value">
              {{ konwledgeDetail.commentNum }}
            </div>
          </li>
          <li
            v-if="konwledgeDetail.allowDownload == 0"
            class="bottom-li"
          >
            <div class="bottom-li-title">
              下载人数
            </div>
            <div class="bottom-li-value">
              {{ konwledgeDetail.downloadNum }}
            </div>
          </li>
        </div>
      </div>
    </basic-container>
    <basic-container class="basic-container-tab">
      <el-tabs v-model="activeIndex">
        <el-tab-pane
          name="1"
          label="知识介绍"
        >
          <KnowledgeInfo
            v-if="activeIndex == '1' && konwledgeDetail"
            :konwledge-detail="konwledgeDetail"
          />
        </el-tab-pane>
        <el-tab-pane
          name="2"
          label="评价"
        >
          <Evaluate
            v-if="activeIndex == '2'"
            :evaluate-score="konwledgeDetail.evaluateScore"
          />
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import { getKnowledgeManageDetails } from '@/api/knowledge/knowledge'
// import CommonImageView from '@/components/common-image-viewer/viewer'
import styles from '@/styles/variables.scss'
import Evaluate from './components/Evaluate'
import KnowledgeInfo from './components/knowledgeInfo'
export default {
  filters: {
    statusFilterer(data) {
      return data === '0' ? '已发布' : '已停用'
    }
  },
  components: {
    // CommonImageView,
    Evaluate,
    KnowledgeInfo
  },
  data() {
    return {
      activeColor: styles.primaryColor,
      previewSrcList: [],
      activeIndex: '1',
      konwledgeDetail: ''
    }
  },
  activated() {
    this.initData()
  },
  methods: {
    /**
     * 标识状态
     */
    getStatusType(status) {
      const TYPE_STATUS = {
        '0': 'success',
        '1': 'danger'
      }
      return TYPE_STATUS[status]
    },
    /**
     * 初始数据，并处理附件
     */
    initData() {
      getKnowledgeManageDetails({ id: this.$route.query.id }).then((res) => {
        res.evaluateScore = Number(res.evaluateScore)
        this.konwledgeDetail = res
      })
    }
  }
}
</script>

<style scoped lang="scss">
/deep/.el-card {
  border: none;
}
.li-label {
  min-width: 80px;
  display: inline-block;
  color: rgba(0, 11, 21, 0.45);
}
.li-value {
  color: #1e1e1e;
  word-break: break-all;
}
.basic-container-tab {
  margin-top: 20px;
  min-height: 42vh;
  background: #fff;
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
    }
    .details-ul {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      .details-li {
        width: 50%;
        display: flex;
        margin-bottom: 10px;
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
