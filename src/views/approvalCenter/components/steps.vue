<template>
  <div>
    <div :class="['newApprove', isParallel ? 'is-parallel' : '']">
      <el-steps
        direction="vertical"
        align-center
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
                <el-avatar
                  :src="
                    item.avatarUrl ||
                      (_.size(item.userList) === 1 && _.get(item, 'userList[0].avatarUrl')) ||
                      circleUrl
                  "
                />
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
                  {{ item.label || item.properties.title }}
                </span>
                <span style="margin:0 12px;display: inline-block">{{ item.approveTime }}</span>
                <span v-if="item.type !== 'copy'">
                  <span
                    v-if="item.nodeId !== 'start'"
                    :class="[item.result, !item.result ? 'result' : '']"
                  >
                    {{ item | result }}
                  </span>
                  <span
                    v-else
                    class="start"
                  >
                    <span
                      v-if="item.result === 'Cancel'"
                      class="Cancel"
                    >审批已撤回</span>
                    <span v-else>发起</span>
                  </span>
                </span>
              </div>
              <div>
                <span class="userName">
                  <span v-if="!item.parallelLines && _.size(item.userList) === 1">
                    {{
                      item.userName ||
                        (_.size(item.userList) === 1 && _.get(item, 'userList[0].name')) ||
                        ' '
                    }}
                  </span>
                  <span v-if="item.parallelLines">
                    需全部并行审批完成后才可继续流转
                  </span>
                </span>
                <span class="tip">
                  <span
                    v-if="
                      (item.nodeType === 'and' || _.get(item, 'properties.counterSign') == true) &&
                        _.size(item.userList) > 1
                    "
                  >
                    需所有审批人同意
                  </span>
                  <span
                    v-if="item.nodeType === 'or' || _.get(item, 'properties.counterSign') == false"
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
              <div v-if="item.parallelLines">
                <div
                  v-for="(it, i) in item.parallelLines"
                  :key="i + 'ii'"
                  class="tow"
                >
                  <steps
                    v-show="it"
                    :progress.sync="it"
                    :is-parallel="true"
                  />
                </div>
              </div>
              <div v-else>
                <div v-if="_.size(item.userList) > 1">
                  <div
                    v-for="(it, i) in item.userList"
                    :key="i"
                    class="infouser"
                  >
                    <div class="infoImg">
                      <el-avatar :src="it.avatarUrl || circleUrl" />
                      <div class="status">
                        <div>
                          {{ it.userName || it.name || '' }}
                          <span class="time">{{ it.approveTime }}</span>
                        </div>
                        <div
                          v-if="item.type !== 'copy'"
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
                <div v-if="item.remark && !item.userList">
                  审批意见： <span style="white-space: pre">{{ item | content }}</span>
                </div>
                <div v-if="!item.remark && _.get(item, 'userList[0].remark')">
                  审批意见：
                  <span style="white-space: pre">{{ item.userList[0].remark | content }}</span>
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
// import towSteps from './towSteps'

export default {
  name: 'Steps',
  // components: {
  //   towSteps
  // },
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
        Return: '审批已退回'
      }
      if (data.result === 'Return') {
        result.Return = data.remark ? data.remark.split('|')[1] : ''
        // console.log(data.remark.split('|')[1])
      }
      // 如果data.result 字段没有定义，则不返回状态，为空则返回审批中
      return _.isString(data.result) ? result[data.result] || '审批中' : ''
    }
  },
  props: {
    progress: {
      type: Array,
      default: function() {
        return []
      }
    },
    isParallel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.newApprove {
  padding: 20px 40px;
  &.is-parallel {
    padding-bottom: 0px;
    background: rgba(247, 248, 250, 1);
  }
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
    padding-bottom: 20px;
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

/deep/ .el-step.is-vertical .el-step__title {
  padding-bottom: 0px;
}

/deep/ .el-step__description {
  padding-right: 0px;
}
.el-step:last-of-type {
  .content {
    min-height: 0;
  }
}
.infouser {
  padding-bottom: 10px;

  .infoImg {
    background: rgba(247, 248, 250, 1);
    padding-left: 6px;
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
/deep/.el-step:last-of-type .el-step__line {
  display: block;
}
/deep/.el-step:last-child > .el-step__head > .el-step__line {
  display: none;
}
</style>
