<template>
  <div class="avue-sidebar">
    <logo style="text-align: center;padding: 20px 0;" />
    <el-scrollbar style="height:calc(100% - 104px)">
      <div
        v-if="validatenull(menu) && validatenull(menu.children)"
        class="avue-sidebar--tip"
      >
        没有发现菜单
      </div>
      <!-- <div class="side-img">
        <img
          src="../../../assets/images/sidebar.png"
          alt="sidebar"
        />
      </div> -->
      <el-menu
        unique-opened
        mode="vertical"
        :show-timeout="200"
        :collapse="keyCollapse"
      >
        <sidebar-item
          v-for="item in menu"
          :key="item.menuId"
          :item="item"
          :props="website.menu.props"
          :screen="screen"
          :collapse="keyCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import logo from '../logo'
import sidebarItem from './sidebarItem'
import { validatenull } from '@/util/validate'

export default {
  name: 'Sidebar',
  components: { sidebarItem, logo },
  inject: ['index'],
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['website', 'menu', 'tag', 'keyCollapse', 'screen'])
  },
  watch: {
    menu: {
      handler(val) {
        if (val.length <= 0) {
          this.$store.dispatch('GetUserPrivilege', this.$store.getters.userId).then(() => {})
        }
      },
      deep: true
    }
  },
  created() {
    // this.index.openMenu(this.menuId)
  },
  mounted() {},
  methods: {
    validatenull(...args) {
      return validatenull(...args)
    }
  }
}
</script>
<style lang="scss" scoped>
.side-img {
  text-align: center;
  padding: 24px 0;
  img {
    width: auto;
    height: 96px;
  }
}
</style>
