<template>
  <div class="main-container">
    <!-- 管理晋升路线 -->
    <div
      v-show="controller"
      class="managementPromotionRoute"
    >
      <!-- 面包屑 -->
      <page-header
        title="管理晋升路线"
        show-back
        :back="goBack"
      />
      <basic-container block>
        <el-row
          type="flex"
          justify="space-between"
          style="align-items: center"
        >
          <div class="header-title">
            当前岗位 {{ positionInfo.name }}
          </div>
          <el-button
            v-p="POST_PROMOTION_ADD_ROUTE"
            type="text"
            @click="addRouter"
          >
            添加晋升路线
          </el-button>
        </el-row>
        <!-- 晋升路线列表 -->
        <el-row v-loading="loading">
          <el-col class="grid-content">
            <div class="grid-content-tip">
              晋升路线1（默认）
            </div>
            <div class="grid-content-line">
              {{ defaultRoute.fullRoute }}
            </div>
          </el-col>
          <template v-if="promotionRoute.length">
            <el-col
              v-for="(item, index) in promotionRoute"
              :key="index"
              class="grid-content"
            >
              <el-row
                type="flex"
                justify="space-between"
                style="align-items: center"
              >
                <div class="grid-content-tip">
                  晋升路线{{ index + 2 }}
                </div>
                <div class="hanlderOpe">
                  <!-- <el-button
                    type="text"
                    @click="editRoute(item)"
                  >
                    编辑
                  </el-button> -->
                  <el-button
                    type="text"
                    @click="deleteRoute(item)"
                  >
                    删除
                  </el-button>
                </div>
              </el-row>
              <div class="grid-content-line">
                {{ item.fullRoute }}
              </div>
            </el-col>
          </template>
        </el-row>
      </basic-container>
    </div>
    <!-- 添加晋升路线 -->
    <add-promotion-route
      v-show="!controller"
      ref="addPromotionRoute"
      @initRouter="initRouter"
    ></add-promotion-route>
  </div>
</template>

<script>
import addPromotionRoute from './components/addPromotionRoute'
import { getPromotionRoute, deletePromotionRoute } from '@/api/studyMap/studyMap'
import { POST_PROMOTION_ADD_ROUTE } from '@/const/privileges'
export default {
  name: 'ManagementPromotionRoute',
  components: {
    addPromotionRoute
  },
  data() {
    return {
      controller: true,
      loading: false,
      positionInfo: {}, // 岗位信息
      defaultRoute: {}, // 默认路线
      promotionRoute: [] // 晋升路线
    }
  },
  computed: {
    POST_PROMOTION_ADD_ROUTE: () => POST_PROMOTION_ADD_ROUTE
  },
  watch: {
    $route: {
      handler() {
        this.positionInfo = this.$route.query
      },
      immediate: true,
      deep: true
    }
  },
  activated() {
    this.initPromotionRoute()
  },
  methods: {
    goBack() {
      this.$router.back(-1)
    },
    // 添加晋升路线
    addRouter() {
      this.$refs.addPromotionRoute.positionInfo = this.positionInfo
      this.$refs.addPromotionRoute.initJobsList()
      this.$refs.addPromotionRoute.initRouter()
      this.controller = false
    },
    // 获取晋升路线
    async initPromotionRoute() {
      this.loading = true
      await getPromotionRoute({ positionId: this.positionInfo.positionId })
        .then((res) => {
          for (let i = 0; i < res.length; i++) {
            if (res[i].isDefualt === 1) {
              this.defaultRoute = res[i]
              res.splice(i, 1)
              break
            }
          }
          this.promotionRoute = res
          this.defaultRoute.fullRoute = this.defaultRoute.fullRoute.replace(/,/g, '——')
          this.promotionRoute.forEach((v) => {
            v.fullRoute = v.fullRoute.replace(/,/g, '——')
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 添加晋升路线后的回调
    initRouter() {
      this.controller = true
      this.initPromotionRoute()
    },
    // 编辑路线
    editRoute(data) {
      let parentIds = data.fullRoutePositionId.split(',')
      this.$refs.addPromotionRoute.idEditRouter = true
      this.$refs.addPromotionRoute.positionInfo = this.positionInfo
      this.$refs.addPromotionRoute.positionId = parentIds[1]
      this.$refs.addPromotionRoute.initJobsList()
      this.$refs.addPromotionRoute.editRouter(parentIds[1])
      this.controller = false
    },
    // 删除路线
    deleteRoute(data) {
      this.$confirm('您确定要删除该条晋升路线吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deletePromotionRoute({ ids: data.routeId }).then(() => {
          this.$message.success('删除成功!')
          this.initPromotionRoute()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-container {
  height: 100%;
  .managementPromotionRoute {
    height: 100%;
    .basic-container--block {
      height: calc(100% - 92px);
      min-height: calc(100% - 92px);
    }
    .header-title {
      font-size: 16px;
    }
    .grid-content {
      background-color: rgba(247, 248, 250, 1);
      padding: 18px;
      margin-bottom: 12px;
      &-tip {
        color: #999999;
      }
      &-line {
        margin-top: 10px;
      }
      /deep/ .el-button {
        padding: 0;
      }
    }
  }
}
</style>
