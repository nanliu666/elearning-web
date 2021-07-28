<template>
  <div class="learningSituation">
    <!-- 面包屑 -->
    <page-header
      title="学习情况"
      show-back
      :back="goBack"
    />
    <!-- 顶部信息 -->
    <basic-container>
      <el-row
        v-loading="userLoading"
        class="header-info"
      >
        <el-col style="font-size: 18px; font-weight: bold">
          {{ userInfo.nickname }}的学习情况
        </el-col>
        <el-col :span="6">
          用户编号：{{ userInfo.usercode }}
        </el-col>
        <el-col :span="8">
          所属部门：{{ userInfo.dept }}
        </el-col>
        <el-col :span="10">
          学习状态：{{ studyStatusTemp[userInfo.status] }}
        </el-col>
        <el-col>
          岗位晋升路线：
          {{ wayLearnName }}
        </el-col>
      </el-row>
    </basic-container>
    <!-- 晋升路线 -->
    <basic-container
      v-loading="loading"
      block
      style="margin-top: 20px"
    >
      <el-row
        type="flex"
        justify="space-between"
        style="align-items: center; background: #eaebec; padding: 0 14px"
      >
        <div>晋升路线(默认)</div>
        <div>
          <el-row>
            <el-col>
              <el-dropdown
                trigger="click"
                @command="dropRoute"
              >
                <el-button type="text">
                  切换晋升路线
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item, index) in switchRoutesTemp"
                    :key="index"
                    :class="{
                      'studyMap-dropdown-menu-item-selected':
                        item.fullUserRoutePositionId == dropMenuSelected
                    }"
                    :command="{
                      fullUserRoute: item.fullUserRoute,
                      fullUserRoutePositionId: item.fullUserRoutePositionId
                    }"
                  >
                    {{ item.fullUserRoute }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </div>
      </el-row>
      <el-row class="routerRadio">
        <div style="padding: 10px 50px 0">
          <el-radio-group
            v-model="routerId"
            @change="changePosition"
          >
            <el-radio
              v-for="(item, index) in routerRadioTemp"
              :key="index"
              :label="item.value"
            >
              <div
                :class="{ 'is-active': routerId == item.value }"
                class="router-box"
              >
                {{ item.label
                }}<span
                  v-if="index != routerRadioTemp.length - 1"
                  class="line"
                >——</span>
              </div>
            </el-radio>
          </el-radio-group>
        </div>
        <el-divider></el-divider>
      </el-row>
      <!-- 学习途径 -->
      <div class="learning-container">
        <div class="title">
          学习途径<span class="degree">岗位整体胜任度{{ overallCompetency }}%</span>
        </div>
        <!-- 学习途径表格 -->
        <el-table
          :data="abilityTemp"
          :show-header="false"
          class="outside-table"
          row-class-name="tableRowClassName"
          stripe
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table
                :data="props.row.item"
                :show-header="false"
                class="inside-table"
              >
                <el-table-column
                  show-overflow-tooltip
                  prop="routeName"
                >
                  <template slot-scope="scope">
                    {{ `【${routerTypeTemp[scope.row.routeType]}】${scope.row.routeName}` }}
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="status"
                  width="120"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.routeType == '5' && scope.row.status == '3'"
                      type="text"
                      style="margin-right: 10px"
                      @click="downLoadFile(scope.row)"
                    >
                      下载
                    </el-button>
                    <span>{{ studyStatusTemp[scope.row.status] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ `${scope.row.name}(${scope.row.levelName})` }}
            </template>
          </el-table-column>
          <el-table-column
            prop="completeRate"
            width="120"
          >
            <template slot-scope="scope">
              {{ `完成度${scope.row.completeRate || 0}%` }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </basic-container>
  </div>
</template>

<script>
import {
  getUserSituation,
  switchRoutes,
  getWayLearn,
  getMaterialReport
} from '@/api/studyMap/studyMap'
import { downLoadFile } from '@/util/util'
export default {
  name: 'LearningSituation',
  data() {
    return {
      userLoading: false,
      studyStatusTemp: {
        0: '未开始',
        1: '进行中',
        2: '未完成',
        3: '已完成'
      },
      userId: '', // 用户ID
      userInfo: {}, // 用户学习情况
      routerId: '',
      // 1-课程,2-考试,3-培训,4-直播,5-能力提升材料
      routerTypeTemp: {
        1: '课程',
        2: '考试',
        3: '培训',
        4: '直播',
        5: '能力提升材料'
      },
      routerRadioTemp: [],
      abilityTemp: [],
      switchRoutesTemp: [],
      loading: false,
      dropMenuSelected: '', // 下拉菜单高亮
      overallCompetency: 0
    }
  },
  computed: {
    wayLearnName() {
      let name = this.routerRadioTemp.map((v) => v.label)
      return name.join('——')
    }
  },
  watch: {
    $route: {
      handler() {
        this.userId = this.$route.query.userId
      },
      immediate: true,
      deep: true
    }
  },
  async activated() {
    await this.initUserSituation()
    this.initWayLearn(this.userInfo.positionId)
    this.initSwitchRoutes()
  },
  methods: {
    goBack() {
      this.$router.back(-1)
    },
    // 获取用户学习概况
    async initUserSituation() {
      this.userLoading = true
      this.loading = true
      await getUserSituation({ userId: this.userId })
        .then((res) => {
          this.userInfo = res
          this.userInfo.fullUserRoute = this.userInfo.fullUserRoute.replace(/,/g, '——')
          let fullUserRouteTemp = this.userInfo.fullUserRoute.split('——'),
            fullUserRoutePositionIdTemp = this.userInfo.fullUserRoutePositionId.split(',')
          fullUserRouteTemp.map((v, i) => {
            this.routerRadioTemp.push({
              value: fullUserRoutePositionIdTemp[i],
              label: v
            })
          })
          this.dropMenuSelected = this.userInfo.fullUserRoutePositionId
        })
        .finally(() => {
          this.userLoading = false
        })
    },
    // 切换晋升路线
    async initSwitchRoutes() {
      await switchRoutes({ userId: this.userId }).then((res) => {
        this.switchRoutesTemp = res
        this.switchRoutesTemp.forEach((v) => {
          v.fullUserRoute = v.fullUserRoute.replace(/,/g, '——')
        })
      })
    },
    // 初始化学习途径
    async initWayLearn(positionId) {
      let params = {
        positionId: positionId,
        userId: this.userInfo.userId
      }
      this.loading = true
      await getWayLearn(params)
        .then((res) => {
          this.overallCompetency = res.competence
          this.abilityTemp = res.ability
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 切换岗位
    changePosition(val) {
      this.initWayLearn(val)
    },
    // 切换路线下拉菜单回调
    dropRoute(val) {
      // 如果下拉点击的是当前晋升路线，则无操作
      if (this.dropMenuSelected != val.fullUserRoutePositionId) {
        this.routerRadioTemp = []
        let fullUserRouteTemp = val.fullUserRoute.split('——'),
          fullUserRoutePositionIdTemp = val.fullUserRoutePositionId.split(',')
        fullUserRouteTemp.map((v, i) => {
          this.routerRadioTemp.push({
            value: fullUserRoutePositionIdTemp[i],
            label: v
          })
        })
        this.dropMenuSelected = val.fullUserRoutePositionId
        this.initWayLearn(this.userInfo.positionId)
      }
    },
    // 下载能力材料
    async downLoadFile(row) {
      await getMaterialReport({ ablrId: row.ablrId }).then((res) => {
        downLoadFile(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.learningSituation {
  .header-info {
    /deep/ .el-col {
      margin-bottom: 12px;
    }
  }
  .basic-container--block {
    /deep/ .el-card__body {
      padding: 0;
    }
    .routerRadio {
      /deep/ .el-radio {
        margin-right: 28px;
        .el-radio__input {
          display: none;
        }
        .el-radio__label {
          padding-left: 0;
        }
        .router-box {
          position: relative;
          padding: 10px 5px;
          border: 1px solid transparent;
          border-radius: 5px;
          &.is-active {
            border-color: #01aafc;
          }
        }
        .line {
          position: absolute;
          right: -29px;
          color: #333333;
        }
      }
    }
    .learning-container {
      padding: 10px 60px 50px;
      .title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .degree {
        color: #339900;
        font-size: 14px;
        margin-left: 30px;
      }
    }
  }
  /deep/ .el-table__expanded-cell {
    padding: 0;
  }
  /deep/ .inside-table tr:last-child td {
    border-bottom: none;
  }
  /deep/ .inside-table td:first-child {
    padding-left: 18px;
  }
  /deep/ .inside-table tr td .cell {
    padding-left: 10px;
  }
  /deep/ .tableRowClassName {
    background: rgba(247, 248, 250, 1);
    td:last-child {
      color: #339900;
    }
  }
}
.studyMap-dropdown-menu-item-selected {
  background-color: #e6f7ff;
  color: #34bbfd;
}
</style>
