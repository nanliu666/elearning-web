<template>
  <div class="page">
    <img src="../../../public/img/666.png" alt="" class="img">
    <div class="content">
      <div class="title">您好，您的平台使用权限已到期，请及时联系商务代表续费！</div>
      <div class="desc">
        续费后能继续使用平台，并且保留原有数据。
      </div>
      <div class="desc">
        深圳易宝软件有限公司
      </div>
    </div>
     <div class="actions">
        <router-link :to="{ path: '/' }">
          <el-button type="primary">
            返回首页
          </el-button>
        </router-link>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Error404'
}
</script>
<style lang="scss" scoped>
@import './style.scss';
.page{
    display: flex;
    height: 100%;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    .img{
        width: 460px;
        height: 350px;
        margin: 0 auto;
    }
    .content{
        width: 100%;
        text-align: center;
        margin-top: 24px;
        .title{
            font-size: 18px;
            color: rgba(0,11,21,0.85);
            letter-spacing: 0;
            text-align: center;
            line-height: 28px;
            font-weight: 600;
        }
        .desc{
            margin-top: 8px;
            margin-bottom: 32px;
            font-size: 14px;
            color: rgba(0,11,21,0.45);
        }
    }
    .actions{
        margin: 0 auto;
    }
}
</style>
