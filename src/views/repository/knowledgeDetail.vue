<template>
  <div>
    <page-header
      title="学习情况"
      show-back
    />
    <basic-container block>
      <div class="details-container">
        <div class="details-top">
          <div class="top-title">
            <span class="title-text">{{ konwledgeDetail.title }}</span>
            <span class="title-status">{{ konwledgeDetail.status | statusFilterer }}</span>
          </div>
          <ul class="details-ul">
            <li class="details-li">
              <span class="li-label">创建人：</span>
              <span class="li-value">{{ konwledgeDetail.createPerson }}</span>
            </li>
            <li class="details-li">
              <span class="li-label">更新时间：</span>
              <span class="li-value">{{ konwledgeDetail.updateTime }}</span>
            </li>
            <li class="details-li">
              <span class="li-label">所在目录：</span>
              <span class="li-value">{{ konwledgeDetail.whereIn }}</span>
            </li>
            <li class="details-li">
              <span class="li-label">提供人：</span>
              <span class="li-value">{{ konwledgeDetail.providePeople }}</span>
            </li>
            <li class="details-li">
              <span class="li-label">上传模式：</span>
              <span class="li-value">{{ konwledgeDetail.uploadType }}</span>
            </li>
          </ul>
        </div>
        <div class="details-bottom">
          <li class="bottom-li">
            <div class="bottom-li-title">
              查看人数
            </div>
            <div class="bottom-li-value">
              {{ konwledgeDetail.view }}
            </div>
          </li>
          <li class="bottom-li">
            <div class="bottom-li-title">
              收藏人数
            </div>
            <div class="bottom-li-value">
              {{ konwledgeDetail.start }}
            </div>
          </li>
          <li class="bottom-li">
            <div class="bottom-li-title">
              评论人数
            </div>
            <div class="bottom-li-value">
              {{ konwledgeDetail.comment }}
            </div>
          </li>
          <li class="bottom-li">
            <div class="bottom-li-title">
              下载人数
            </div>
            <div class="bottom-li-value">
              {{ konwledgeDetail.download }}
            </div>
          </li>
        </div>
      </div>
    </basic-container>
  </div>
</template>

<script>
export default {
  filters: {
    statusFilterer(data) {
      return data
    }
  },
  data() {
    return {
      konwledgeDetail: {
        title: 'Java函数式编程',
        status: '已上架',
        createPerson: '张勋',
        updateTime: '2020-10-10 12:21:10',
        whereIn: ' Java技能课程/Java高级培训',
        providePeople: '张勋',
        uploadType: '本地文件',
        view: 25,
        start: 86,
        comment: 55,
        download: 78
      }
    }
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="scss">
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
      }
      .bottom-li-value {
      }
    }
  }
}
</style>
