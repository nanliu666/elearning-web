<template>
  <div class="CertificateComponents">
    <div class="Certificate">
      <img
        v-if="CertificateData.backUrl"
        class="bg"
        :src="CertificateData.backUrl"
      /><img />
      <img
        v-if="CertificateData.logoUrl"
        class="logo"
        :src="CertificateData.logoUrl"
      /> <img />
      <div class="title">
        {{ CertificateData.name }}
      </div>
      <div class="name_text">
        &nbsp; &nbsp;
        <span class="_name">{{ CertificateData.stuName }}</span>{{ CertificateData.text }}
      </div>

      <div class="awardAgency">
        <div class="name">
          {{ CertificateData.awardAgency }}
        </div>
        <div class="certificateNo">
          证书编号：{{ CertificateData.certificateNo }}
        </div>
        <div class="grantTime">
          发证日期：{{ CertificateData.createTime && CertificateData.createTime.substr(0, 10) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['CertificateData']
}
</script>

<style lang="scss" scoped>
.CertificateComponents {
  .Certificate {
    width: 890px;
    height: 636px;
    background-color: rgba(121, 121, 121, 0.137);
    // margin: 0 auto;
    position: relative;
    .bg {
      position: relative;
      top: 0;
      left: 0;
      width: 890px;
      height: 636px;
    }
    .logo {
      position: absolute;
      top: 98px;
      left: 120px;
      width: 138px;
      height: 30px;
      background-color: rgba(121, 121, 121, 0.39);
    }
    .title {
      position: absolute;
      top: 174px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      width: 80%;
      opacity: 0.85;
      font-family: PingFangSC-Semibold;
      font-size: 52px;
      color: #242d36;
      letter-spacing: 0;
      text-align: center;
      font-weight: 600;
      word-break: break-all;
    }
    .name_text {
      position: absolute;
      top: 318.5px;
      left: 50%;
      transform: translateX(-50%);
      word-break: break-all;
      width: 650px;
      opacity: 0.65;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #000b15;
      letter-spacing: 0;
      line-height: 30px;
      font-weight: 400;
      ._name {
        opacity: 0.65;
        font-family: PingFangSC-Semibold;
        font-size: 18px;
        color: #000b15;
        letter-spacing: 0;
        text-align: center;
        font-weight: 600;
      }
    }
    .awardAgency {
      position: absolute;
      top: 472px;
      left: 611px;
      line-height: normal;
      .name {
        opacity: 0.65;
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #000b15;
        letter-spacing: 0;
        font-weight: 600;
      }
      .certificateNo,
      .grantTime {
        opacity: 0.65;
        font-family: PingFangSC-Regular;
        font-size: 10px;
        color: #000b15;
        letter-spacing: 0;
        font-weight: 400;
      }
    }
  }
}
</style>
