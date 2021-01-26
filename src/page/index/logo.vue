<template>
  <div
    class="avue-logo"
    @click="goWork"
  >
    <!-- <img :src="JSON.parse(tenantContent).logo || logo" /> -->
    <img src="../../assets/images/logo_white.png" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Logo',
  data() {
    return {}
  },
  computed: {
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
