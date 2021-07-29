<template>
  <div class="footer-container">
    <!-- {{ copy }} -->
    <span>{{version}} &nbsp; &nbsp; &nbsp;</span>
    <span
      style="opacity: 1;"
      class="policeLogo"
    ><img
      src="../../../public/img/policeLogo.png"
      alt=""
    /></span>
    <span><a
      href="https://ythzxfw.miit.gov.cn"
      target="_blank"
    > {{num}} </a></span>
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
      'v2.0.1_20210401_Release  备案号：苏ICP备19010525号-2'
      this.copy = this.copy.replace(/\s+/g,' ')
      this.version = this.copy.split(' ')[0]
      this.num = this.copy.split(' ')[1]
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.footer-container {
  // width: 100vw;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // font-size: 12px;

  text-align: center;
  height: 40px;
  line-height: 40px;
  // opacity: 0.25;
  width: 100vw;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #000b15;
  display: flex;
  justify-content: center;
  span {
    // opacity: 0.25;
  }
  .policeLogo {
    margin-right: 10px;
    opacity: 1;
    img {
      margin-top: 10px;
    }
  }
}
</style>
