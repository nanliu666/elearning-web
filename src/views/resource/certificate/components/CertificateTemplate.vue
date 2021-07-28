<template>
  <div class="CertificateComponents">
    <div class="Certificate">
      <!-- {{CertificateData}} -->
      <img
        class="bg"
        :src="CertificateData.backUrl"
      /><img />
      <div class="logo">
        <img
          class="log_img"
          :src="CertificateData.logoUrl"
        /> <img />
      </div>
      <div class="certificateNo">
        编号：{{ CertificateData.certificateNo }}
      </div>

      <div class="title">
        {{ CertificateData.name }}
      </div>
      <div class="name_text">
        <span class="_name">{{ CertificateData.stuName || '张三' }}<span>同志： </span> </span>
        <pre>{{ CertificateData.text }} </pre>
      </div>

      <div class="awardAgency">
        <div class="name">
          {{ CertificateData.awardAgency }}
        </div>
        <div class="grantTime">
          {{ itmeHandle(CertificateData.createTime && CertificateData.createTime.substr(0, 10)) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['CertificateData'],
  methods: {
    itmeHandle(i) {
      let tm = i.split(' ')
      return this.number2Chinese(tm[0])
    },
    number2Chinese(str) {
      let chinese = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
      let numStr = str.replace(/[^0-9]+/g, '')
      let year = chinese[numStr[0]] + chinese[numStr[1]] + chinese[numStr[2]] + chinese[numStr[3]]
      let month = numStr[4] === '0' ? chinese[numStr[5]] : chinese[10] + chinese[numStr[5]]
      let day = ''
      if (numStr[6] === '0') {
        day = chinese[numStr[7]]
      } else if (numStr[6] === '1') {
        if (numStr[7] === '0') {
          day = chinese[10]
        } else {
          day = chinese[10] + chinese[numStr[7]]
        }
      } else if (numStr[6] === '2' || numStr[6] === '3') {
        if (numStr[7] === '0') {
          day = chinese[numStr[6]] + chinese[10]
        } else {
          day = chinese[numStr[6]] + chinese[10] + chinese[numStr[7]]
        }
      }
      return year + '年' + month + '月' + day + '日'
    }
  }
}
</script>

<style lang="scss" scoped>
.CertificateComponents {
  .Certificate {
    width: 1000px;
    height: 706px;
    background-color: rgba(121, 121, 121, 0.137);
    position: relative;
    .bg {
      position: relative;
      top: 0;
      left: 0;
      width: 1000px;
      height: 706px;
    }
    .logo {
      position: absolute;
      top: 94px;
      left: 128px;
      width: 124px;
      height: 68px;
      .log_img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
      }
      // background-color: rgba(121, 121, 121, 0.39);
    }
    .certificateNo {
      position: absolute;
      top: 94px;
      right: 128px;
      height: 68px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #444b53;
      letter-spacing: 0;
      text-align: right;
      line-height: 68px;
      font-weight: 400;
    }
    .title {
      position: absolute;
      top: 193px;
      left: 50%;
      transform: translateX(-50%);
      width: 624px;
      height: 112px;
      opacity: 0.85;
      font-family: MicrosoftYaHei-Bold;
      font-size: 40px;
      color: #000b15;
      letter-spacing: 0;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .name_text {
      position: absolute;
      top: 329px;
      left: 50%;
      transform: translateX(-50%);
      width: 744px;
      height: 181px;
      opacity: 0.85;
      font-family: MicrosoftYaHei;
      font-size: 16px;
      color: #000b15;
      letter-spacing: 0;
      line-height: 32px;
      font-weight: 400;
      ._name {
        opacity: 0.85;
        font-family: MicrosoftYaHei-Bold;
        font-size: 20px;
        color: #000b15;
        letter-spacing: 0;
        line-height: 30px;
        font-weight: bold;
        span {
          margin-left: 16px;
        }
      }
    }
    .awardAgency {
      position: absolute;
      bottom: 120px;
      right: 128px;

      opacity: 0.85;
      font-family: MicrosoftYaHei-Bold;
      font-size: 16px;
      color: #000b15;
      letter-spacing: 0;
      text-align: center;
      font-weight: bold;
      .grantTime {
        margin-top: 4px;
      }
    }
  }
}
</style>
