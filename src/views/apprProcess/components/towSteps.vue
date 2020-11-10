<template>
  <div>
    <div class="newApprove">
      <el-steps
        direction="vertical"
        align-center
        :active="progress.length"
      >
        <el-step
          v-for="(item, index) in progress"
          :key="index"
        >
          <!-- 自定义图标 -->
          <template
            slot="icon"
            class="icon"
          >
            <!--                <div class="icon active" />-->
            <div>
              <div class="img-box">
                <el-avatar :src="item.avatarUrl || circleUrl" />
              </div>
            </div>
          </template>
          <!-- 自定义标题 -->
          <template slot="title">
            <div class="title">
              <div>
                <span v-if="item.nodeId === 'start'">
                  {{ item.name || '发起申请' }}
                </span>
                <span v-else>
                  {{ item.nodeName || '' }}
                </span>
                <span style="margin:0 12px;display: inline-block">{{ item.approveTime }}</span>
                <span
                  v-if="
                    (item.nodeId !== 'start' && item.type !== 'copy' && item.result) ||
                      item.hasOwnProperty('result')
                  "
                  :class="[item.result, !item.result ? 'result' : '']"
                >
                  {{ item | result }}
                </span>
                <!--                <span v-else  class="start">-->
                <!--                      发起-->
                <!--                    </span>-->
              </div>
              <div>
                <span
                  v-if="!item.user"
                  class="userName"
                >
                  <span v-if="!item.nodeId.includes('parallelGateway_')">
                    {{ item.userName || ' ' }}
                  </span>
                  <span v-else>
                    需全部并行审批完成后才可继续流转
                  </span>
                </span>
                <span
                  v-else
                  class="tip"
                >
                  <span
                    v-if="
                      item.nodeType === 'and' ||
                        (item.properties && item.properties.counterSign === true)
                    "
                  >
                    需所有审批人同意
                  </span>
                  <span
                    v-if="
                      item.nodeType === 'or' ||
                        (item.properties && item.properties.counterSign === false)
                    "
                    class="tip"
                  >
                    一人同意即可
                  </span>
                </span>
              </div>
            </div>
          </template>
          <!-- 自定义内容 -->
          <div slot="description">
            <div class="content">
              <div v-if="item.nodeId.includes('parallelGateway_')">
                <div
                  v-for="(it, i) in item.apparUserLine"
                  :key="i + 'zz'"
                  class="tow"
                >
                  <tow-Steps :progress.sync="it" />
                </div>
              </div>
              <div v-else>
                <div v-if="item.user">
                  <div
                    v-for="(it, i) in item.user"
                    :key="i + 'cc'"
                    class="infouser"
                  >
                    <div
                      v-if="
                        (item.hasOwnProperty('result') && it.hasOwnProperty('result')) ||
                          !item.hasOwnProperty('result')
                      "
                      class="infoImg"
                    >
                      <el-avatar :src="it.avatarUrl || circleUrl" />
                      <div class="status">
                        <div>
                          {{ it.userName }} <span class="time">{{ it.approveTime }}</span>
                        </div>
                        <div
                          v-if="(item.result && it.nodeName) || item.hasOwnProperty('result')"
                          :class="[it.result, !it.result ? 'result' : '']"
                        >
                          {{ it | result }}
                        </div>
                        <div
                          v-if="it.remark"
                          class="remark"
                        >
                          <span>审批意见：</span><span style="white-space: pre"> {{ it.remark }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="item.remark && !item.user">
                  审批意见：<span style="white-space: pre">{{ item | content }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
import towSteps from './towSteps'
export default {
  name: 'Steps',
  components: {
    towSteps
  },
  filters: {
    content(data) {
      if (data.result !== 'Return') {
        return data.remark
      } else {
        return data.remark ? data.remark.split('|')[0] : ''
      }
    },
    result(data) {
      let result = {
        Pass: '审批同意',
        Reject: '审批拒绝',
        Cancel: '审批已撤回',
        Return: ''
      }
      if (data.result === 'Return') {
        result.Return = data.remark ? data.remark.split('|')[1] : ''
      }
      return result[data.result] || '审批中'
    }
  },
  props: {
    progress: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  watch: {
    progress: {
      handler() {
        if (this.progress.length > 1) {
          this.andnode(this.progress, 1)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    andnode(progressList, i) {
      if (progressList[i - 1].nodeId === progressList[i].nodeId) {
        !progressList[i].user && (progressList[i].user = [])
        !progressList[i].resultList && (progressList[i].resultList = [])
        if (progressList[i].user) {
          progressList[i].user.push(progressList[i])
          progressList[i].resultList.push(progressList[i].result)
          if (progressList[i - 1].user && progressList[i - 1].user.length > 1) {
            progressList[i].resultList.concat(progressList[i - 1].result)
            progressList[i].user = progressList[i].user.concat(progressList[i - 1].user)
          } else {
            progressList[i].resultList.push(progressList[i - 1].result)
            progressList[i].user.push(progressList[i - 1])
          }
        }
        progressList[i].result = progressList[i].resultList.includes('Reject')
          ? 'Reject'
          : progressList[i].resultList.includes('Return')
          ? 'Return'
          : ''
        progressList.splice(i - 1, 1)
        i -= 1
      }
      if (progressList.length - 1 > i) {
        this.andnode(progressList, i + 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.newApprove {
  padding: 20px 18px;
  padding-bottom: 0px;
  background: rgba(247, 248, 250, 1);
  .result {
    color: #6aafff !important;
  }

  .Pass {
    color: #7ad683 !important;
  }
  .start {
    color: #7ad683 !important;
  }

  .Reject {
    color: #ff8b8a !important;
  }
  .Return {
    color: #ff8b8a !important;
  }

  .Cancel {
    color: #ff8b8a !important;
  }
  .title {
    position: relative;
    top: -12px;
    color: #333;
    margin-left: 12px;
    .userName {
      font-size: 14px;
    }
  }
  .content {
    min-height: 60px;
    color: #333;
    margin-left: 12px;
    padding-bottom: 10px;
  }
  .el-avatar {
    height: 48px !important;
    width: 48px !important;
  }
}
.tow {
  margin-bottom: 15px;
}
.tip {
  font-size: 12px;
  color: #999;
}
/deep/.el-step.is-vertical .el-step__title {
  padding-bottom: 0px;
}
.infouser {
  padding-bottom: 10px;
  .infoImg {
    display: flex;
    display: -webkit-flex;
    display: -ms-flex;
    display: -moz-box;
    flex-flow: row nowrap;
    font-size: 14px;
    .status {
      margin-left: 15px;
      line-height: 24px;
      .time {
        margin-left: 10px;
      }
    }
  }
  .remark {
  }
}
/deep/.el-step .el-step__line {
  display: inline-block;
}
</style>
