<template>
  <div class="PlayBackListSingleC">
    <div class="crumbs">
      <span class="title">查看直播回放</span><!-- class="title iconfont  iconimage_icon_leftarrow" -->
      <span class="tip">直播回放回传到平台需要一段时间，请耐心等待。</span>
    </div>
    <div>
      <div
        v-for="item in playBackListData"
        :key="item.id"
        class="PBLS"
      >
        <div class="img">
          <img
            :src="item.coverImageUrl ? item.coverImageUrl : '/img/autol.png'"
            alt=""
            width="220"
            height="124"
          />
        </div>
        <div class="text">
          <h3>直播回放：{{ item.channelName }}</h3>
          <span>直播分类：{{ item.fullName }}</span>
          <span>讲师：{{ item.lecturerName }}</span>
          <span>直播时间：{{ item.startTime }}</span>
        </div>
        <div class="operation">
          <span @click="repRecover(item)">恢复</span>
          <span @click="repRelease(item)">发布</span>
          <span @click="repDownload(item)">下载</span>
          <span @click="repDelete(item)">删除</span>
          <span @click="repOffShelf(item)">下架</span>
        </div>
      </div>
      <!-- <div class="PBLS">
        <div class="img">
          <img
            src="/img/autol.png"
            alt=""
            width="220"
            height="124"
          />
        </div>
        <div class="text">
          <h3>直播回放：20200315 设计能力专项提升</h3>
          <span>直播分类：研发能力中心 > UCD中心</span>
          <span>讲师：小明</span>
          <span>直播时间：2020/03/15 08:00:00</span>
        </div>
        <div class="operation">
          <span>恢复</span>
          <span>发布</span>
          <span>下载</span>
          <span>删除</span>
          <span>下架</span>
        </div>
      </div>
      <div class="PBLS">
        <div class="img">
          <img
            src="/img/autol.png"
            alt=""
            width="220"
            height="124"
          />
        </div>
        <div class="text">
          <h3>直播回放：20200315 设计能力专项提升</h3>
          <span>直播分类：研发能力中心 > UCD中心</span>
          <span>讲师：小明</span>
          <span>直播时间：2020/03/15 08:00:00</span>
        </div>
        <div class="operation">
          <span>下载</span>
          <span>删除</span>
          <span>下架</span>
        </div>
      </div> -->
    </div>
    <div class="pagePbls">
      <el-pagination
        background
        :page-sizes="PBLPageObj.pageSizes"
        :page-size="5"
        :current-page="PBLPageObj.currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="PBLPageObj.totalNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { liveReplayList, setReplayStatus } from '@/api/live/liveReplay'
export default {
  name: 'PlayBackListSingle',
  data() {
    return {
      playBackListData: [],
      PBLParmas: {
        sourceType: '1',
        livePlanId: this.$route.query.liveId,
        pageNo: 1,
        pageSize: 5
      },
      PBLPageObj: {
        pageSizes: [5, 10],
        currentPage: 0,
        totalNum: 0
      }
    }
  },
  activated() {
    this.initPlayBackData()
  },
  methods: {
    //  <span @click="repRecover">恢复</span>
    //       <span @click="repRelease">发布</span>
    //       <span @click="repDownload">下载</span>
    //       <span @click="repDelete">删除</span>
    //       <span @click="repOffShelf">下架</span>
    repRecover(item) {
      // 恢复
      let sendPar = { videoId: item.id.toString(), lecturerDeleted: '0' }
      setReplayStatus(sendPar).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    repRelease(item) {
      // 发布
      let sendPar = { videoId: item.id.toString(), lecturerDeleted: '0' }
      setReplayStatus(sendPar).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    // repDownload(item) {
    //   // 下载
    // },
    // repDelete(item) {
    //   // 删除
    // },
    // repOffShelf(item) {
    //   // 下架
    // },
    initPlayBackData() {
      // 初始化直播回放列表
      liveReplayList(this.PBLParmas).then((res) => {
        let { data, totalNum, totalPage } = res.result
        this.playBackListData = data
        this.PBLPageObj.totalNum = totalNum
        this.PBLPageObj.totalPage = totalPage
      })
    },
    handleSizeChange(val) {
      // 改变分页回调
      this.PBLParmas.pageSize = val
      this.initPlayBackData()
    },
    handleCurrentChange(val) {
      // 改变每页显示条数回调
      this.PBLParmas.pageNo = val
      this.initPlayBackData()
    }
  }
}
</script>
<style scoped lang="scss">
.crumbs {
  overflow: hidden;
  margin: 0 0 20px 0;
}
.crumbs span {
  float: left;
}
.crumbs .title {
  font-size: 22px;
  color: #000b15;
  opacity: 0.85;
}
.crumbs .tip {
  font-size: 12px;
  color: #000b15;
  opacity: 0.45;
  padding: 6px 0 0 10px;
}
.PlayBackListSingleC {
  background: #fff;
  padding-top: 23px;
}
.PBLS {
  display: flex;
  height: 124px;
  margin: 0 0 40px 0;
}
.PBLS .img {
  width: 220px;
  border-radius: 4px;
}
.PBLS .text {
  flex: 1;
  padding: 0 20px 0 27px;
}
.PBLS .text h3 {
  color: #000b15;
  font-size: 16px;
  opacity: 0.85;
  margin: 0;
  padding: 5px 0 15px 0;
}
.PBLS .text span {
  display: block;
  color: #000b15;
  opacity: 0.65;
  padding: 4px 0;
  font-size: 12px;
}
.PBLS .operation {
  width: 300px;
  text-align: right;
}
.PBLS .operation span {
  color: #01aafc;
  font-size: 12px;
  padding: 2px 15px;
  border-right: solid 1px #ebeced;
  cursor: pointer;
}
.PBLS .operation span:last-child {
  border: 0;
}
.PlayBackListSingleC .pagePbls {
  float: right;
}
</style>
