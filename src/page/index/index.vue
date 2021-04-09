<template>
  <div
    class="avue-contail"
    :class="{ 'avue--collapse': isCollapse }"
  >
    <div class="avue-layout">
      <div
        v-if="!isFullscreen"
        class="avue-left"
      >
        <!-- 左侧导航栏 -->
        <sidebar />
      </div>
      <div :class="['avue-main', { 'avue-main--fullscreen avue-main--notag': isFullscreen }]">
        <div
          v-if="!noHeader"
          class="avue-header"
          :class="{ 'header-shadow': isFullscreen }"
        >
          <!-- 顶部导航栏 -->
          <top ref="top" />
        </div>
        <!-- 顶部标签卡 -->
        <tags v-if="!(isFullscreen || noHeader)" />
        <transition name="fade-scale">
          <search
            v-show="isSearch"
            class="avue-view"
          />
        </transition>
        <!-- 主体视图层 -->
        <div
          v-show="!isSearch"
          id="avue-view"
        >
          <keep-alive v-if="$route.meta.$keepAlive">
            <router-view
              :key="$route.fullPath"
              class="avue-view"
            />
          </keep-alive>
          <router-view
            v-else
            :key="$route.fullPath"
            class="avue-view"
          />
        </div>
        <div id="avue-footer">
          <!-- v2.0.0_20210330_Release &nbsp;&nbsp;&nbsp; 备案号：苏ICP备19010525号-2 -->
          <div class="footer">
            <span>v2.1.0_20210410_Release &nbsp; &nbsp; &nbsp;</span>
            <span class="policeLogo"><img
              src="../../../public/img/policeLogo.png"
              alt=""
            /></span>
            <span><a
              href="https://ythzxfw.miit.gov.cn"
              target="_blank"
            >
              备案号：苏ICP备19010525号-2
            </a></span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="avue-shade"
      @click="showCollapse"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tags from './tags'
import search from './search'
import top from './top/'
import sidebar from './sidebar/'
import admin from '@/util/admin'
import { validatenull } from '@/util/validate'
import { calcDate } from '@/util/date.js'
import { getStore } from '@/util/store.js'

export default {
  name: 'Index',
  components: {
    top,
    tags,
    search,
    sidebar
  },
  provide() {
    return {
      index: this
    }
  },
  props: [],
  data() {
    return {
      //搜索控制
      isSearch: false,
      //刷新token锁
      refreshLock: false,
      //刷新token的时间
      refreshTime: ''
    }
  },
  computed: {
    ...mapGetters(['isMenu', 'isLock', 'isCollapse', 'website', 'menu']),
    isFullscreen() {
      return this.$route.meta.fullscreen
    },
    noHeader() {
      return this.$route.meta.noHeader
    }
  },
  created() {
    //实时检测刷新token
    // this.refreshToken()
  },
  mounted() {
    this.init()
  },
  methods: {
    showCollapse() {
      this.$store.commit('SET_COLLAPSE')
    },
    // 初始化
    init() {
      this.$store.commit('SET_SCREEN', admin.getScreen())
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit('SET_SCREEN', admin.getScreen())
        }, 0)
      }
      this.$store.dispatch('FlowRoutes').then(() => {})
    },
    //打开菜单
    openMenu(item = {}) {
      this.$store.dispatch('SetMenu', item)
      let path = this.getFirstPath(item.children, 0, true)
      if (this.$route.path !== path) {
        this.$router.push({
          path
        })
      }
    },
    getFirstPath(children, index = 0) {
      if (
        children[index].menuType !== 'Dir' &&
        children[index].path &&
        children[index].isShow != 0
      ) {
        return children[index].path
      }
      if (children[0].children.length > 0) {
        return this.getFirstPath(children[0].children)
      } else {
        return this.getFirstPath(children, index + 1)
      }
    },
    // 定时检测token
    refreshToken() {
      this.refreshTime = setInterval(() => {
        const token =
          getStore({
            name: 'token',
            debug: true
          }) || {}
        const date = calcDate(token.datetime, new Date().getTime())
        if (validatenull(date)) return
        if (date.seconds >= this.website.tokenTime && !this.refreshLock) {
          this.refreshLock = true
          this.$store
            .dispatch('refreshToken')
            .then(() => {
              this.refreshLock = false
            })
            .catch(() => {
              this.refreshLock = false
            })
        }
      }, 10000)
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  text-align: center;
  // height: 40px;
  // line-height: 40px;
  // opacity: 0.25;
  width: 100%;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #000b15;
  display: flex;
  justify-content: center;
  // span {
  //   opacity: 0.25;
  // }
  .policeLogo {
    margin-right: 10px;
    opacity: 1;
    // img {
    //   margin-top: 10px;
    // }
  }
}
</style>
