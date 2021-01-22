<template>
  <div class="PlayBackListSingleC">
    <div class="crumbs">
      <span class="title">查看直播回放</span><!-- class="title iconfont  iconimage_icon_leftarrow" -->
      <span class="tip">直播回放回传到平台需要一段时间，请耐心等待。</span>
    </div>
    <div>
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
          <span @click="recover">恢复</span>
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
      </div>
    </div>
    <div class="pagePbls">
      <el-pagination
        background
        :page-sizes="pageObj.pageSizes"
        :page-size="5"
        :current-page="pageObj.currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageObj.totalNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { getCategoryTree } from '@/api/live/editLive'
export default {
  name: 'PlayBackListSingle',
  data() {
    return {
      playBackListData: [],
      pageObj: {
        pageSizes: [5, 10],
        currentPage: 0,
        totalNum: 0,
        parmas: {
          sourceType: '1',
          livePlanId: this.$router.query.liveId,
          pageNo: 1,
          pageSize: 5
        }
      }
    }
  },
  activated() {
    this.initPlayBackData()
  },
  methods: {
    recover() {
      // 恢复
    },

    initPlayBackData() {
      // 初始化直播回放列表
      getCategoryTree(this.pageObj.parmas).then((res) => {
        let { data, totalNum, totalPage } = res
        this.playBackListData = data
        this.pageObj.totalNum = totalNum
        this.pageObj.totalPage = totalPage
      })
      // getNoticeCenterList(this.parmas).then((res) => {
      //   let { data, totalNum, totalPage } = res
      //   this.noticeList = data
      //   this.totalNum = totalNum
      //   this.totalPage = totalPage
      // })
    },
    handleSizeChange(val) {
      this.pageObj.parmas.pageSize = val
      this.initPlayBackData()
    },
    handleCurrentChange(val) {
      this.pageObj.parmas.pageNo = val
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
