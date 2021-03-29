<template>
  <div class="footer-container">
    {{ copy }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MgFooter',
  data() {
    return {
      copy: ''
    }
  },
  computed: {
    ...mapGetters(['tenantContent'])
  },
  created() {
    this.copy =
      (this.tenantContent && JSON.parse(this.tenantContent).copyright) ||
      'v2.0.0_20210330_Release  备案号：苏ICP备19010525号-2'
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.footer-container {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}
</style>
