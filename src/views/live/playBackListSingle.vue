<template>
  <div class="PlayBackListSingleC">
    <div class="crumbs">
      <span
        class="back-btn"
        @click="gotoPlayBack"
      > <i class="el-icon-arrow-left"></i></span>
      <span class="title">查看直播回放</span><!-- class="title iconfont  iconimage_icon_leftarrow" -->
      <span class="tip">直播回放回传到平台需要一段时间，请耐心等待。</span>
    </div>
    <div>
      <div
        v-for="item in playBackListData"
        :key="item.id"
        class="PBLS"
        @click="goReplay(item)"
      >
        <div class="img">
          <img
            :src="item.coverImageUrl ? item.coverImageUrl : '/img/autol.png'"
            alt=""
            width="220"
            height="124"
          />
          <div class="header__play">
            <span class="play-icon"></span>
          </div>
          <div class="playback">
            直播回放
          </div>
          <div class="amount-play">
            <i class="el-icon-video-camera-solid"></i>{{ formatNumber(item.people || 0) }}
          </div>
        </div>
        <div class="text">
          <h3>直播回放：{{ item.channelName }}</h3>
          <span>直播分类：{{ item.fullName }}</span>
          <span>讲师：{{ item.lecturerName }}</span>
          <span>直播时间：{{ item.startTime }}</span>
        </div>
        <div class="operation">
          <!--讲师删除后 管理员可以进行恢复-->
          <span
            v-if="item.lecturerDeleted === 1 && identityType === 0"
            v-p="PUBLISH_LIVE_BACK"
            @click.stop="repRecover(item)"
          >恢复</span>
          <span
            v-p="PUTAWAY_LIVE_BACK"
            @click.stop="repRelease(item)"
          >{{
            item.shelfStatus === 0 ? '下架' : '发布'
          }}</span>
          <span
            v-p="DOWNLOAD_LIVE_BACK"
            @click.stop="repDownload(item.localUrl)"
          >下载</span>
          <span
            v-p="DELETE_LIVE_BACK"
            @click.stop="repDelete(item)"
          >删除</span>
        </div>
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
  </div>
</template>
<script>
import { liveReplayList, setReplayStatus } from '@/api/live/liveReplay'
import {
  PUBLISH_LIVE_BACK,
  PUTAWAY_LIVE_BACK,
  DELETE_LIVE_BACK,
  DOWNLOAD_LIVE_BACK
} from '@/const/privileges'
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
      },
      identityType: ''
    }
  },
  computed: {
    PUBLISH_LIVE_BACK: () => PUBLISH_LIVE_BACK,
    PUTAWAY_LIVE_BACK: () => PUTAWAY_LIVE_BACK,
    DELETE_LIVE_BACK: () => DELETE_LIVE_BACK,
    DOWNLOAD_LIVE_BACK: () => DOWNLOAD_LIVE_BACK
  },
  activated() {
    this.initPlayBackData()
  },
  methods: {
    goReplay(obj) {
      this.$router.push({
        path: '/live/replay',
        query: {
          id: this.$route.query.liveId,
          currentId: obj.id
        }
      })
    },
    repRecover(item) {
      // 恢复
      this.$confirm('讲师已删除该直播回放，您确定要恢复吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let sendPar = { videoId: item.id.toString(), lecturerDeleted: '0' }
        setReplayStatus(sendPar).then(() => {
          this.initPlayBackData()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    },
    repRelease(item) {
      // 发布 下架

      this.$confirm(
        `${
          item.shelfStatus === 0
            ? '下架后，该直播回放将对学员不可见，您确定要上架吗？'
            : '上架后，学员将会在直播中看到该回放，您确定要上架吗？'
        }`,
        '提醒',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        let sendPar = { videoId: item.id.toString(), shelfStatus: item.shelfStatus === 0 ? 1 : 0 }
        setReplayStatus(sendPar).then(() => {
          this.initPlayBackData()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    },
    repDownload(url) {
      if (!url) {
        this.$message.error('视频路径不存在')
        return
      }
      // 下载
      let x = new XMLHttpRequest()
      x.open('GET', url, true)
      x.responseType = 'blob'
      x.onprogress = function() {}
      x.onload = function() {
        let url = window.URL.createObjectURL(x.response)
        let a = document.createElement('a')
        a.href = url
        a.download = '' //可以填写默认的下载名称
        a.click()
      }
      x.send()
    },
    repDelete(item) {
      // 删除  0:管理员删除 1：讲师删除
      this.$confirm(
        `${
          this.identityType === 0
            ? '您确定要删除该直播回放吗?'
            : '该直播回放已发布，删除后学员将不可见，您确定要删除该直播回放吗？'
        }`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          let sendPar = {
            videoId: item.id.toString(),
            [`${this.identityType ? 'lecturerDeleted' : 'isDeleted'}`]: '1'
          }
          setReplayStatus(sendPar).then(() => {
            this.initPlayBackData()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        })
        .catch(() => {})
    },
    repOffShelf(item) {
      // 下架
      let sendPar = { videoId: item.id.toString(), shelfStatus: '1' }
      setReplayStatus(sendPar).then(() => {
        this.initPlayBackData()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    initPlayBackData() {
      // 初始化直播回放列表
      liveReplayList(this.PBLParmas).then((res) => {
        let { data, totalNum, totalPage } = res.result
        this.playBackListData = data
        this.PBLPageObj.totalNum = totalNum
        this.PBLPageObj.totalPage = totalPage
        this.identityType = res.identityType
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
    },
    formatNumber(num) {
      num = Number(num)
      if (num == 0) {
        return 0
      } else if (num >= 1 && num < 10000) {
        return num
      } else {
        return (num / 10000).toFixed(2) + '万'
      }
    },
    gotoPlayBack() {
      this.$router.push({ path: '/live/playBackList' })
    }
  }
}
</script>
<style scoped lang="scss">
.crumbs {
  overflow: hidden;
  margin: 0 0 20px 0;
  .back-btn {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 30px;
    height: 29px;
    i {
      font-size: 18px;
      color: #8c9195;
      margin-right: 3px;
      font-weight: 600;
    }
  }
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
  .header__play {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 48px;
    height: 48px;
    background: rgba(0, 11, 21, 0.45);
    border-radius: 100%;
    margin-left: -24px;
    margin-top: -24px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    cursor: pointer;
    .play-icon {
      width: 0;
      height: 0;
      margin-left: 8px;
      border-top: 10px solid transparent;
      border-left: 20px solid #ffffff;
      border-bottom: 10px solid transparent;
    }
  }
  .playback {
    background: #ecebeb;
    position: absolute;
    right: 0;
    top: 0;
    font-size: 12px;
    padding: 5px 10px;
  }
  .amount-play {
    font-size: 12px;
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}
.PBLS .img {
  position: relative;
  width: 220px;
  cursor: pointer;
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
