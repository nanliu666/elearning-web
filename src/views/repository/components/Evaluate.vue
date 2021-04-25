<template>
  <div class="Evaluate">
    <div class="Evaluate_title">
      <span class="Evaluate_title_t"> 评分 </span>
      <span>
        <el-rate
          :value="evaluateScore"
          disabled
        > </el-rate> <span>{{ evaluateScore }}分</span>
      </span>
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
          <div class="info_top">
            <div>
              <span>{{ item.userName }}</span>
              <span class="time"> {{ item.createTime }} </span>
            </div>

            <el-rate
              :value="parseFloat(item.scope)"
              disabled
            >
            </el-rate>
          </div>
          <div class="text">
            {{ item.remark }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getScopeList } from '@/api/knowledge/knowledge'
export default {
  props: ['evaluateScore'],
  data() {
    return {
      dataList: []
    }
  },
  activated() {
    this.getInfo()
  },
  created() {
    this.getInfo()
  },
  methods: {
    returnImg(img) {
      return img || require('../../../../public/img/icon-person-man.png')
    },
    async getInfo() {
      let params = {
        knowledgeId: this.$route.query.id, //  知识库id
        pageNo: 1, //  页码
        pageSize: 999 //  页面数量
      }
      let { data } = await getScopeList(params)
      this.dataList = data
    }
  }
}
</script>

<style scoped lang="scss">
.Evaluate {
  .Evaluate_title {
    .Evaluate_title_t {
      margin-right: 60px;
    }
    font-size: 22px;
    font-weight: bold;
    display: flex;
    color: #666;
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
    padding: 35px 0;
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
      .time {
        margin-left: 24px;
        color: #666;
      }
      .text {
        margin-top: 24px;
        color: #777;
      }
      margin-left: 24px;
      /deep/ .el-rate__icon {
        font-size: 16px;
      }
    }
  }
}
</style>
