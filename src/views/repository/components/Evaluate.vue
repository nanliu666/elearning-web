<template>
  <div
    v-loading="loading"
    class="Evaluate"
  >
    <template v-if="dataList.length > 0">
      <div class="Evaluate_title">
        <span class="Evaluate_title_t"> 评分: </span>
        <span style="flex:1;">
          <el-rate
            :value="evaluateScore"
            disabled
          > </el-rate> <span>{{ evaluateScore }}分</span>
        </span>
        <div
          v-if="dataList.length > 0"
          class="export-comment"
          @click="exportComment"
        >
          <img
            src="../../../assets/images/image_icon_export.svg"
            alt=""
          />
          导出评论
        </div>
      </div>

      <ul>
        <li
          v-for="(item, index) in dataList"
          :key="index"
        >
          <div class="infoImg">
            <img
              :src="returnImg(item.avatarUrl)"
              alt=""
            />
          </div>
          <div class="info">
            <div class="info-data">
              <span>{{ item.userName }}</span>
              <span class="time"> {{ item.createTime }} </span>
            </div>
            <el-rate
              :value="parseFloat(item.scope)"
              disabled
            />
            <div class="text">
              {{ item.remark }}
            </div>
          </div>
          <div>
            <el-button
              type="text"
              @click="delComment(item.id)"
            >
              删除
            </el-button>
          </div>
        </li>
      </ul>
    </template>
    <template v-else>
      <div style="text-align:center;">
        <img
          src="../../../assets/images/nodata.png"
          alt=""
        />
        <div style="color:#718199;">
          暂无评论
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getScopeList, deleteScope, exportScopeList } from '@/api/knowledge/knowledge'
import { exportToExcel } from '@/util/util'
export default {
  props: {
    evaluateScore: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dataList: [],
      scopeId: '',
      loading: false
    }
  },
  mounted() {
    this.scopeId = this.$route.query.id
    this.getInfo()
  },
  methods: {
    returnImg(img) {
      return img || require('../../../../public/img/icon-person-man.png')
    },
    async getInfo() {
      let params = {
        knowledgeId: this.scopeId, //  知识库id
        pageNo: 1, //  页码
        pageSize: 999 //  页面数量
      }
      this.loading = true
      let { data } = await getScopeList(params)
      data.forEach((val) => {
        val.scope = Number(val.scope)
      })
      this.dataList = data
      this.loading = false
    },
    delComment(id) {
      this.$confirm('你确定要删除该评论吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteScope({ id }).then(() => {
            this.$message.success('删除成功')
            this.getInfo()
          })
        })
        .catch(() => {})
    },
    exportComment() {
      exportScopeList({ knowledgeId: this.scopeId }).then((res) => {
        exportToExcel(res)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.Evaluate {
  .Evaluate_title {
    font-size: 22px;
    font-weight: bold;
    display: flex;
    align-items: center;
    color: #666;
    .Evaluate_title_t {
      margin-right: 56px;
    }
    .export-comment {
      font-size: 14px;
      font-weight: normal;
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        margin-right: 4px;
      }
    }
    span:nth-child(2) {
      font-size: 16px;
      line-height: 30px;
      font-weight: 300;
      display: flex;
      color: #737a75;
      /deep/ .el-rate__icon {
        font-size: 28px;
      }
    }
  }

  li {
    display: flex;
    padding: 20px 0;
    border-bottom: 1px solid #efefef;
    .infoImg {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #ccc;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      flex: 1;
      margin-left: 20px;
      margin-right: 10px;
      /deep/ .el-rate__icon {
        font-size: 16px;
      }
      .info-data {
        margin-bottom: 2px;
      }
      .time {
        margin-left: 24px;
        color: #666;
      }
      .text {
        margin-top: 16px;
        color: #777;
        word-break: break-all;
      }
    }
  }
}
</style>
