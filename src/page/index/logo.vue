<template>
  <div
    class="avue-logo"
    @click="goWork"
  >
    <!-- <img :src="JSON.parse(tenantContent).logo || logo" /> -->
    <!-- <img src="../../assets/images/logo_white.png" /> -->
    <!-- <img
      v-if="envVar === 'zehui' && isOrgIdE"
      src="../../assets/images/logoEWhite.png"
    />
    <img
      v-else-if="envVar === 'xugong'"
      src="../../assets/images/logoWhite.png"
    />
    <img
      v-else-if="envVar === 'zehui'"
      src="../../assets/images/logoZeHuiWhite.png"
    />
    <img
      v-else
      src="../../assets/images/logo_white_yb.png"
    /> -->
    <img :src="logoImg" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getStore } from '@/util/store'
export default {
  name: 'Logo',
  data() {
    return {}
  },
  computed: {
    logoImg() {
      let logoBaseInfor =
        (this.diyInfor && this.diyInfor.logo && this.diyInfor.logo.length > 0 && this.diyInfor) ||
        getStore({ name: 'diyInfor' })
      let logoImg = logoBaseInfor.logo && logoBaseInfor.logo.BackgroundUrl
      return logoImg
    },
    envVar() {
      let envC = process.env
      return envC.VUE_APP_ENV
    },
    isOrgIdE() {
      return _.includes(this.orgIdsD, '5263')
    },
    // orgId() {
    //   let userInfo = getStore({ name: 'userInfo' })
    //   return userInfo.org_id
    // },
    ...mapGetters(['website', 'keyCollapse', 'tenantContent', 'orgIds', 'diyInfor'])
  },
  created() {
    this.isOrgIdEFn()
  },
  methods: {
    isOrgIdEFn() {
      // 判断是否是挖机组织
      // 获取用户的组织id（包括当前和当前以上的），存放在localstore，vuex
      let orgIdsVuex = this.orgIds
      this.orgIdsD = orgIdsVuex || getStore({ name: 'orgIds' })
    },
    goWork() {
      this.$router.replace({ path: '/wel' })
    }
  }
}
</script>

<style lang="scss">
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-active {
  transition: opacity 2.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.avue-logo {
  cursor: pointer;
  font-size: 20px;
  text-align: center;
  padding: 20px 0 !important;
  img {
    // display: block;
    // max-width: 100%;
    // max-height: 50px;
    height: 40px;
    width: 180px;
  }
}
</style>
