<template>
  <div class="qn-detail">
    <div
      class="header"
      @click="$router.back()"
    >
      <i class="el-icon-arrow-left"> </i>
      <span class="title">问卷安排详情</span>
    </div>

    <div class="pane">
      <div class="pane-header">
        <div class="pane-header-l">
          <span class="title">{{ data.planName }}</span>
          <span
            class="status"
            :class="{ doing: data.status == 2, will: data.status == 1, done: data.status == 3 }"
          >{{ getStatusName(data.status) }}</span>
        </div>
        <div class="pane-header-r">
          <el-button
            type="primary"
            :loading="btn1Loading"
            :disabled="shouldbeDisabled"
            size="mini"
            @click="handleStatusChange(data.status == 2 ? 1 : 2)"
          >
            {{ data.status == 2 ? '暂停' : '开始' }}
          </el-button>
          <el-button
            type="default"
            :loading="btn2Loading"
            size="mini"
            :disabled="data.status !== 2 || data.option == 0"
            @click="handleStatusChange(3)"
          >
            结束
          </el-button>
          <el-button
            type="default"
            size="mini"
            @click="handleEdit"
          >
            编辑
          </el-button>
          <el-button
            type="default"
            size="mini"
            :loading="btn3Loading"
            @click="handleDelete"
          >
            删除
          </el-button>
        </div>
      </div>

      <div class="pane-body">
        <div class="pane-body-list">
          <div class="pane-body-item">
            <div class="name">
              所在分类：
            </div>
            <div class="content">
              {{ data.category }}
            </div>
          </div>
          <div class="pane-body-item">
            <div class="name">
              有效期：
            </div>
            <div class="content">
              {{ data.publishTime }}～{{ data.endTime }}
            </div>
          </div>
          <div class="pane-body-item">
            <div class="name">
              关联问卷：
            </div>
            <div class="content">
              {{ data.subjectName
              }}<el-button
                type="text"
                style="margin-left: 12px; margin-top: 2px;"
                @click="toPreview"
              >
                查看关联问卷
              </el-button>
            </div>
          </div>
          <div class="pane-body-item">
            <div class="name">
              问卷学分：
            </div>
            <div class="content">
              {{ data.asqScore }}分
            </div>
          </div>
        </div>
        <div class="pane-code">
          <div
            v-if="showCode"
            ref="code"
            class="code-img"
          ></div>
          <div class="code-text">
            扫码查看<el-button
              type="text"
              style="margin-left: 5px"
              @click="handleCopy"
            >
              复制链接
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="tab-wrapper">
      <el-tabs v-model="activeComponent">
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.component"
          :label="tab.label"
          :name="tab.component"
        >
          <component
            :is="tab.component"
            :id="id"
            :should-resize-chart="activeComponent == 'Distribution'"
          ></component>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { Situation, Distribution } from './tabs'
import { queryPlanDetail, end, suspend, start, deleteQuestionnaire } from '@/api/questionnaire'
import QRCode from 'qrcodejs2'
const CODE_HEIGHT = 112
const CODE_WIDTH = 112

export default {
  components: {
    Situation,
    Distribution
  },
  data() {
    return {
      activeComponent: 'Situation',
      tabs: [
        {
          component: 'Situation',
          label: '完成情况'
        },
        {
          component: 'Distribution',
          label: '选项分布'
        }
      ],
      data: {},
      btn1Loading: false,
      btn2Loading: false,
      btn3Loading: false,
      id: '',
      qrcode: '',
      showCode: false
    }
  },
  computed: {
    shouldbeDisabled() {
      const { option } = this.data
      if (option == 0) return true
      if (this.data.status == 1) {
        return option != 1
      } else {
        return option != 2
      }
    }
  },
  activated() {
    const { id, toTab2 } = this.$route.query
    if (toTab2) {
      this.activeComponent = 'Distribution'
    }
    this.id = id
    this.queryPlanDetail()
  },
  deactivated() {
    this.showCode = false
  },
  methods: {
    handleCopy() {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.value = this.data.asqUrl
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      this.$message.success('已复制')
    },
    handleEdit() {
      const params = {}
      Object.keys(this.data).forEach((key) => {
        params[key] = this.data[key]
      })
      this.$router.push({
        name: 'questionnaire-arrange',
        params
      })
    },
    handleDelete() {
      this.$confirm('您确定删除选中的问卷安排吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.btn3Loading = true
          deleteQuestionnaire({ ids: [this.data.id] })
            .then(() => {
              this.$message.success('操作成功')
              this.$router.back()
            })
            .finally(() => (this.btn3Loading = false))
        })
        .catch(() => {})
    },
    async handleStatusChange(status) {
      if (status === 3) {
        const result = await this.confirmFinish()
        if (!result) return
      }
      let api, loading
      switch (status) {
        case 1:
          api = suspend
          loading = 'btn1Loading'
          break
        case 2:
          api = start
          loading = 'btn1Loading'
          break
        case 3:
          api = end
          loading = 'btn2Loading'
      }
      this[loading] = true
      api({ id: this.id })
        .then(() => {
          this.$message.success('操作成功')
          this.data.status = status
          this.showCode = false
          this.queryPlanDetail()
        })
        .finally(() => {
          this[loading] = false
        })
    },
    confirmFinish() {
      return this.$confirm('是否结束该问卷安排?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {})
    },
    toPreview() {
      const id = this.data.subjectId
      this.$router.push({
        path: '/questionnaire/preview',
        query: {
          id
        }
      })
    },
    getStatusName(status) {
      switch (status) {
        case 1:
          return '未开始'
        case 2:
          return '进行中'
        case 3:
          return '已结束'
        default:
          return '草稿'
      }
    },
    queryPlanDetail() {
      queryPlanDetail({ id: this.id }).then((res) => {
        this.showCode = true
        this.data = res
        this.$nextTick(() => {
          this.qrcode = new QRCode(this.$refs.code, {
            width: CODE_WIDTH,
            height: CODE_HEIGHT
          })
          this.qrcode.makeCode(this.data.asqUrl)
        })
      })
    }
  }
}
</script>

<style lang="scss">
.qn-detail {
  .el-form-item {
    margin-right: 20px;
  }
  .operate-wrapper .operate-left .input-wrapper {
    .el-input__inner {
      height: 34px;
      line-height: 34px;
    }
  }
  .icon-basics-filter-outlined {
    font-size: 14px;
  }

  .filter-form {
    .el-form-item__label {
      text-align: center;
    }
  }
}
</style>

<style lang="scss" scoped>
.qn-detail {
  cursor: default;
  .header {
    width: fit-content;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 29px 0 21px;
    i {
      color: #8c9195;
      font-size: 16px;
    }
    .title {
      font-family: PingFangSC-Medium;
      font-size: 22px;
      color: rgba(0, 11, 21, 0.85);
      margin-left: 8px;
    }
  }
  .pane {
    padding: 28px 24px 42px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    .pane-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      .pane-header-l {
        display: flex;
        align-items: center;
        height: 22px;
        .title {
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: rgba(0, 11, 21, 0.85);
          margin-right: 16px;
        }
        .status {
          width: 52px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: 12px;
          border-radius: 4px;
          margin-top: 3px;
          &.will {
            color: #00b061;
            background-color: #e7ffee;
          }
          &.doing {
            color: #fcba00;
            background-color: #fffce6;
          }
          &.done {
            color: #01aafc;
            background-color: #e7fbff;
          }
        }
      }
    }
    .pane-body {
      position: relative;
      .pane-body-list {
        margin-right: 130px;
        .pane-body-item {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          .name {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.45);
            flex: 0 0 70px;
          }
          .content {
            font-size: 14px;
            color: rgba(0, 11, 21, 0.85);
          }
        }
      }
      .pane-code {
        position: absolute;
        top: 23px;
        right: 5px;
        .code-img {
          width: 112px;
          height: 112px;
        }
        .code-text {
          font-size: 12px;
          color: rgba(0, 11, 21, 0.85);
        }
      }
    }
  }
  .tab-wrapper {
    margin-top: 12px;
    margin-bottom: 24px;
    background-color: #fff;
    padding: 24px;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
  }
}
</style>
