<template>
  <div class="avue-top">
    <!-- <div class="top-bar__title">
      <div
        v-if="showMenu"
        class="top-bar__item top-bar__item--show"
      >
        <top-menu ref="topMenu" />
      </div>
    </div> -->
    <div class="top-bar__right">
      <el-tooltip
        v-if="showLock"
        effect="dark"
        content="锁屏"
        placement="bottom"
      >
        <div class="top-bar__item">
          <top-lock />
        </div>
      </el-tooltip>
      <el-tooltip
        v-if="showFullScren"
        effect="dark"
        :content="isFullScren ? '退出全屏' : '全屏'"
        placement="bottom"
      >
        <div class="top-bar__item">
          <i
            :class="isFullScren ? 'icon-tuichuquanping' : 'icon-quanping'"
            @click="handleScreen"
          />
        </div>
      </el-tooltip>

      <el-dropdown>
        <span class="el-dropdown-link">
          <img
            v-if="userInfo && userInfo.avatar_url"
            class="top-bar__img"
            :src="userInfo.avatar_url"
          />
          <i
            v-else
            class="icon-usercircle top-bar__usericon"
          />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <div @click="showUserCenter">
              个人中心
            </div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div @click="toFront()">
              用户前台
            </div>
          </el-dropdown-item>
          <el-dropdown-item
            divided
            @click.native="logout"
          >
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { resetRouter } from '@/router/router'
import { mapGetters, mapState } from 'vuex'
import { fullscreenToggel, listenfullscreen } from '@/util/util'
import { getStore } from '@/util/store.js'
import topLock from './top-lock'
import { frontBaseUrl } from '@/config/env'
export default {
  name: 'Top',
  components: {
    topLock
  },
  filters: {},
  data() {
    return {}
  },
  computed: {
    ...mapState({
      showDebug: (state) => state.common.showDebug,
      showTheme: (state) => state.common.showTheme,
      showLock: (state) => state.common.showLock,
      showFullScren: (state) => state.common.showFullScren,
      showCollapse: (state) => state.common.showCollapse,
      showSearch: (state) => state.common.showSearch,
      showMenu: (state) => state.common.showMenu,
      showColor: (state) => state.common.showColor
    }),
    ...mapGetters([
      'userInfo',
      'isFullScren',
      'tagWel',
      'tagList',
      'isCollapse',
      'tag',
      'logsLen',
      'logsFlag'
    ])
  },
  created() {},
  mounted() {
    listenfullscreen(this.setScreen)
  },
  methods: {
    toFront() {
      let tid = getStore({
        name: 'token'
      })
      window.location.href = `${frontBaseUrl}/#/home?tid=${tid}`
    },
    showUserCenter() {
      this.$router.push('/info/securitySetting')
    },
    handleScreen() {
      fullscreenToggel()
    },
    setCollapse() {
      this.$store.commit('SET_COLLAPSE')
    },
    setScreen() {
      this.$store.commit('SET_FULLSCREN')
    },
    logout() {
      this.$confirm('退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          resetRouter()
          this.$router.push({ path: '/login' })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.top-bar__usericon {
  margin: 0 10px;
  cursor: pointer;
}
</style>
