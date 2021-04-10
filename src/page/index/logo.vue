<template>
  <div
    class="avue-logo"
    @click="goWork"
  >
    <!-- <img :src="JSON.parse(tenantContent).logo || logo" /> -->
    <!-- <img src="../../assets/images/logo_white.png" /> -->
    <img
      v-if="envVar === 'zehui' && orgId === '5263'"
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
    />
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
    envVar() {
      let envC = process.env
      return envC.VUE_APP_ENV
    },
    orgId() {
      let userInfo = getStore({ name: 'userInfo' })
      return userInfo.org_id
    },
    ...mapGetters(['website', 'keyCollapse', 'tenantContent'])
  },
  created() {},
  methods: {
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

  img {
    // display: block;
    max-width: 100%;
    // max-height: 50px;
  }
}
</style>
