<template>
  <!--https://github.com/SNFocus/approvalFlow源码地址-->
  <div
    v-loading="loading"
    class="page"
  >
    <header class="page__header">
      <div class="page-actions">
        <div
          style="border-right: 1px solid #c5c5c5; cursor: pointer"
          @click="exit"
        >
          <i class="el-icon-arrow-left" /> 返回
        </div>
        <div>{{ Title }} <span style="color: transparent">11</span></div>
      </div>
      <div class="step-tab">
        <div
          v-for="(item, index) in steps"
          :key="index"
          class="step"
          :class="[
            activeStep == item.key ? 'active' : '',
            { disable: formKey && item.key === 'formDesign' }
          ]"
          @click="changeSteps(item)"
        >
          <span class="step-index">
            <i
              class="iconfont"
              :class="[item.icon]"
            />
          </span>
          {{ item.label }}
        </div>
        <div
          class="ghost-step step"
          :style="{ transform: translateX }"
        />
      </div>
      <div class="button-group-box">
        <el-button
          class="publish-btn"
          size="medium"
          type="primary"
          @click="toPublish"
        >
          发布
        </el-button>
      </div>
    </header>
    <section class="page__content">
      <BasicSetting
        v-show="activeStep === 'basicSetting'"
        ref="basicSetting"
        :conf="mockData.basicSetting"
        tab-name="basicSetting"
        @jump="jumpStep"
        @initiatorChange="onInitiatorChange"
      />

      <Process
        v-show="activeStep === 'processDesign'"
        ref="processDesign"
        :conf="mockData.processData"
        tab-name="processDesign"
        @startNodeChange="onStartChange"
      />
    </section>
  </div>
</template>

<script>
import Process from './components/Process/Process'
import BasicSetting from './components/BasicSetting/BasicSetting'
import { Base64 } from 'js-base64'
import { getApprProcess, postApprProcess, putApprProcess } from '@/api/processDesign/basicSetting'
import { mapGetters } from 'vuex'
import mockData from './mockData'

const beforeUnload = function(e) {
  var confirmationMessage = '离开网站可能会丢失您编辑得内容'
  ;(e || window.event).returnValue = confirmationMessage // Gecko and Trident
  return confirmationMessage // Gecko and WebKit
}
const notEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0
const hasBranch = (data) => notEmptyArray(data.conditionNodes)
const hasParallelBranch = (data) => notEmptyArray(data.parallelNodes)
export default {
  name: 'ProcessDesign',
  components: {
    Process,
    BasicSetting
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      Title: this.title,
      base: [],
      lineList: [],
      condition: [],
      endNode: [],
      prevData: '', // 一进入暂存数据原先的
      mockData: _.cloneDeep(mockData), // 可选择诸如 $route.param，Ajax获取数据等方式自行注入
      activeStep: 'basicSetting', // 激活的步骤面板
      processMap: {},

      baseJson: '',
      formKey: null,
      steps: [
        {
          label: '基础设置',
          key: 'basicSetting',
          icon: 'icon-approval-info-outlined'
        },
        {
          label: '流程设计',
          key: 'processDesign',
          icon: 'icon-approval-flow-outlined'
        }
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    window.addEventListener('beforeunload', beforeUnload)
    next()
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('beforeunload', beforeUnload)
    next()
  },
  computed: {
    translateX() {
      return `translateX(${this.steps.findIndex((t) => t.key === this.activeStep) * 100}%)`
    },
    processId() {
      return _.get(this.$route.query, 'processId', null)
    },
    ...mapGetters(['userId'])
  },
  created() {
    if (this.processId) {
      this.initData()
    }
  },
  activated() {},
  methods: {
    initData() {
      const { processId } = this
      getApprProcess({ processId }).then((res) => {
        this.Title = res.processName
        this.mockData = JSON.parse(Base64.decode(res.baseJson))

        this.mockData.basicSetting.categoryId = res.categoryId
      })
    },
    jumpStep(data) {
      this.activeStep = data
    },
    changeSteps(item) {
      this.activeStep = item.key
    },

    /**
     * @author guanfenda
     * @desc 发布事件
     *
     * */
    toPublish() {
      const getCmpData = (name) => this.$refs[name].getData()
      // basicSetting  formDesign processDesign 返回的是Promise 因为要做校验
      // advancedSetting返回的就是值
      const p1 = getCmpData('basicSetting')
      const p3 = getCmpData('processDesign')
      Promise.all([p1, p3])
        .then((res) => {
          const param = {
            basicSetting: this.mockData.basicSetting,
            processData: res[1].formData
          }
          // 处理发布
          this.sendToServer(param)
        })
        .catch((err) => {
          err.target && (this.activeStep = err.target)
          err.msg && this.$message.warning(err.msg)
        })
    },
    /**
     * author guanfenda
     * @decs 处理数据，提交给后台
     *
     * */
    sendToServer(param) {
      // 修改后的parma内的表单设计、流程设计
      // 1表示需要发布新版本， 0表示不需要发布新版
      const { processId, userId } = this
      const processData = _.cloneDeep(param.processData)
      this.base = []
      this.lineList = [] //节点线
      this.condition = [] //条件节点
      this.processMap = {}
      this.endNode = [] //最后节点线
      this.lineEnd(processData)
      this.recursion(processData, param.processData)
      let item = {
        id: 'end',
        name: '结束',
        type: 'end'
      }
      this.base.push(item)
      this.base = [...this.base, ...this.lineList, ...this.condition, ...this.endNode]
      let {
        processName,
        remark,
        categoryId,
        tip,
        isOpinion,
        approverDistinct,
        icon
      } = param.basicSetting
      //处理发起人节点转成后台processVisible属性
      let processVisible = this.getProcessVisible(param.basicSetting.processVisible)

      let config = {
        icon,
        processName,
        remark,
        processVisible,
        tip,
        approverDistinct,
        categoryId,
        isOpinion: isOpinion ? 1 : 0
      }

      //处理空节点导致的连线。
      this.filterEemty(param)
      // 新建流程，添加userId入参
      let fixParams = {
        processId,
        userId,
        processData: this.base,
        processMap: this.processMap,
        baseJson: Base64.encode(JSON.stringify(param)),
        newVersion: 0,
        ...config
      }

      // 修改接口判断条件：当存在processId未修改接口，否则为新增审批接口
      const ApprProcess = processId ? putApprProcess : postApprProcess

      this.loading = true
      ApprProcess(fixParams)
        .then(() => {
          this.$message.success('提交成功')
          setTimeout(() => {
            this.$router.push({
              path: '/apprProcess/approvalList'
            })
          }, 1000)
        })
        .finally(() => {
          this.loading = false
        })
    },
    /**
     * @author guanfenda
     * @desc 处理发起人范围 转成，ProcessVisible属性
     * @param {object} items 业务架构组织或用户
     * @returns {Array<any>} 将处理好的发起人信息返回
     */
    getProcessVisible(items) {
      if (_.size(items)) {
        return _.map(items, (item) => _.pick(item, ['type', 'bizId', 'bizName']))
      } else {
        return [{ type: 'All' }]
      }
    },

    /**
     * @author guanfenda
     * @desc 处理前端数据的空节点导致的连线问题处理掉
     * @params param 引用类型
     * */
    filterEemty(param) {
      let emptyList = []
      this.base.map((it) => {
        if (it.type === 'empty') {
          emptyList.push(it)
        }
      })

      let emptyRelation = []
      if (emptyList.length > 0) {
        emptyList.map((it) => {
          if (param.processData.childNode) {
            it.prevId =
              param.processData.childNode.nodeId === it.id
                ? param.processData.childNode.prevId
                : this.prevId_(param.processData, it.id)
          }
          this.base.map((item) => {
            if (it.id === item.source || it.id === item.target) {
              emptyRelation.push(item)
            }
          })
        })
        emptyRelation.map((it) => {
          if (it.source)
            emptyList.map((item) => {
              if (it.source == item.id) {
                it.source = item.prevId
              }
              if (it.target === item.id) {
                if (it.source.indexOf('parallelGateway') > -1) {
                  it.target = it.hasBranch + item.id
                } else {
                  it.target = 'gateway_' + item.id
                }
              }
            })
        })
      }
    },
    prevId_(data, id) {
      let priv = []
      this.prevId(data, id, priv)
      return priv[0]
    },
    prevId(data, id, priv) {
      if (data.nodeId === id) {
        priv.push('gateway_' + data.prevId)
      } else {
        if (hasBranch(data)) {
          data.conditionNodes.map((d) => {
            this.prevId(d, id, priv)
          })
        }
        data.childNode && this.prevId(data.childNode, id, priv)
      }
    },
    /**
     * @author guanfenda
     * @desc 处理结束节点问题
     * */
    lineEnd(data) {
      let endChild = this.childNode(data)
      if (data.nodeId !== endChild.nodeId && !hasBranch(endChild) && !hasParallelBranch(endChild)) {
        // 结束ID=当前ID && 结束节点无条件 && 当前节点无条件

        let line = {
          type: 'flow',
          id: endChild.nodeId + 'end',
          name: '',
          source: endChild.nodeId,
          target: 'end'
        }
        this.endNode.push(line)
      } else if (hasBranch(endChild)) {
        endChild.conditionNodes.map((it) => {
          this.lineEnd(it)
        })
      }
    },
    /**
     * @author guanfenda
     * 前端转后端格式函数
     * */
    // recursion(data, origin, conditionNextNodeId_) {
    recursion(data, origin) {
      let type = {
        //类型
        start: 'start', //开始节点
        approver: 'task', //审批人节点,
        parallel: 'task',
        copy: 'ccTask', // 发送人节点
        condition: 'flow', //条件节点
        empty: 'empty'
      }
      let item = {
        // 处理节点（重新定义节点）
        type: type[data.type], // flow, start, end, task, ccTask, gateway 类型
        id: data.nodeId,
        name: data.properties.title // 非必填
      }
      // 开始节点
      this.startNode(data, item)
      //抄送人
      this.copyNode(data, item)
      //审批人
      this.ApprovalNode(data, item, origin)
      //条件
      // this.conditionNode(data, origin, conditionNextNodeId_)
      //有前节点且前节点不为no_flow,且节点类型不能为条件节点（带有条件节点，他的子节点不在这么算进去）
      this.evenLine(data, item)
      // 过滤节点不能为条件节点,因为在处理条件节点是会处理。这里就过滤条件
      this.addBaseNode(data, item)
      data.childNode && this.recursion(data.childNode, origin.childNode) //有子节点，递归节点
    },
    /**
     * @author guafenda
     * @desc 除去条件节点其他节点
     * @params item 引用类型
     * */
    addBaseNode(data, item) {
      if (data.type !== 'condition') {
        //过滤节点不能为条件节点,因为在处理条件节点是会处理。这里就过滤条件
        this.base.push(item)
      }
    },
    /**
     * @author guanfenda
     *@desc 除去条件节点其他节点的连线
     * @params data 引用类型
     * */
    evenLine(data) {
      if (
        data.prevId &&
        data.prevId !== 'no_flow' &&
        data.type !== 'condition' &&
        data.type !== 'start' &&
        data.type !== 'parallel'
      ) {
        //有前节点且前节点不为no_flow,且节点类型不能为条件节点（带有条件节点，他的子节点不在这么算进去）
        let items = {
          //节点线
          type: 'flow', // flow, start, end, task, ccTask, gateway
          id: data.prevId + data.nodeId,
          name: data.properties.title, // 非必填
          source: data.prevId,
          target: data.nodeId
        }
        this.lineList.push(items)
      }
    },
    /**
     * @author guanfenda
     * @desc 处理开始节点转换成后台需要节点
     * @params data，item 引用类型
     *
     * */
    startNode(data, item) {
      if (data.type === 'start') {
        //开始节点
        item.initiator = 'initiator'
        // item.id = 'start'
      }
    },
    /**
     * @author guanfenda
     * @desc 处理抄送人节点转换成后台格式
     * @params data item 引用类型
     * */
    copyNode(data, item) {
      if (data.type === 'copy') {
        //抄送人节点
        item.assignee = 'copyUser_' + data.properties.attribute
      }
    },
    /**
     *  @author guanfenda
     *  @desc 处理审批人节点转换成后台需要节点
     *  @params data,item,origin 引用类型
     * */
    ApprovalNode(data, item, origin) {
      if (data.type === 'approver' || data.type === 'parallel') {
        //审批指定职位·指定岗位，上级领导，标签
        let list = Object.keys(data.properties.infoForm || [])
        if (list.includes(`${data.properties.assigneeType}Id`)) {
          item.assignee = '${' + `${data.properties.assigneeType}_` + data.nodeId + '_id}'
          this.processMap[`${data.properties.assigneeType}_` + data.nodeId + '_id'] = ''
          origin.variable = `${data.properties.assigneeType}_` + data.nodeId + '_id'
        } else if (
          ['competentBusiness', 'departmentHeads'].includes(data.properties.assigneeType)
        ) {
          // 处理部门领导与业务主管的变量
          const VARIABLE_NAME = `${data.properties.assigneeType}_${data.nodeId}_level`
          item.assignee = '${' + VARIABLE_NAME + '}'
          this.processMap[VARIABLE_NAME] = ''
          origin.variable = VARIABLE_NAME
        } else if (data.properties.assigneeType === 'user') {
          //指定成员人，
          item.assignee = 'taskUser_' + data.properties.attribute
          let length = data.content.split(',').length
          if (length > 1) {
            origin.variable = 'optional_' + data.nodeId //这个前端发起用的变量
            item.assignee = '${taskUser_' + data.nodeId + '}'
            item.completion = data.properties.counterSign ? '1' : '0' //0 或签，1会签
            item.element = 'taskUser_' + data.nodeId
            item.collection = 'optional_' + data.nodeId
          }
        } else if (data.properties.assigneeType === 'optional') {
          // 发起人自选
          item.assignee = '${optional_' + data.nodeId + '_id}'
          if (!data.properties.optionalMultiUser) {
            //
            origin.variable = 'optional_' + data.nodeId + '_id' //这个前端发起用的变量
            this.processMap['optional_' + data.nodeId + '_id'] = '' // 后端对应前端变量
          } else if (data.properties.optionalMultiUser) {
            origin.variable = 'optional_' + data.nodeId //这个前端发起用的变量
            item.collection = 'optional_' + data.nodeId //后台接收前端变量
            item.completion = data.properties.counterSign ? '1' : '0' //0 或签，1会签
            // item.assignee = '${optional_' + data.nodeId + '_id}' // assignee 和 element 后端 处理循环用得到、
            item.element = 'optional_' + data.nodeId + '_id' //会签或签 assignee 和 element 后端 处理循环用得到//这是个集合，后台for循环
            this.processMap['optional_' + data.nodeId] = ''
          }
        } else if (
          ['multiCompetentBusiness', 'multiDepartmentHeads'].includes(data.properties.assigneeType)
        ) {
          // 处理多级审批人节点，将其处理为会签（且额外添加 sequential属性标记-true）
          origin.variable = item.collection = `${data.properties.assigneeType}_${data.nodeId}`
          item.completion = '1'
          item.element = `${item.collection}_id`
          item.sequential = true
          item.assignee = `\${${item.element}}`
          this.processMap[item.collection] = ''
        } else {
          item.assignee = 'taskUser_' + data.properties.attribute //
        }
      }
    },

    /**
     * @author guanfenda
     * 获取最后一个节点
     * */
    childNode(data, fisrtBranchData, condition) {
      !condition &&
        fisrtBranchData &&
        (data.fisrtParallelBanchNodeId =
          fisrtBranchData.fisrtParallelBanchNodeId || fisrtBranchData.nodeId)
      condition &&
        fisrtBranchData &&
        fisrtBranchData.childNode &&
        (data.fisrtBanchNodeId =
          fisrtBranchData.fisrtBanchNodeId || fisrtBranchData.childNode.nodeId)
      if (data.childNode) {
        return this.childNode(data.childNode, fisrtBranchData, condition)
      } else {
        return data
      }
    },
    exit() {
      this.$confirm('离开此页面您得修改将会丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push({
            path: '/apprProcess/approvalList'
          })
        })
        .catch(() => {})
    },
    /**
     * 同步基础设置发起人和流程节点发起人
     */
    onInitiatorChange(val, labels) {
      const processCmp = this.$refs.processDesign
      const startNode = processCmp.processData // 修复取值错误（data ==> processData）
      startNode.properties.initiator = val
      startNode.content = labels || '所有人'
      processCmp.forceUpdate()
    },
    /**
     * 监听 流程节点发起人改变 并同步到基础设置 发起人数据
     */
    onStartChange(node) {
      const basicSetting = this.$refs.basicSetting
      basicSetting.formData.initiator = node.properties.initiator
    }
  }
}
</script>
<style lang="stylus" scoped>
$header-height = 54px;
.page {
  width: 100vw;
  height: 100vh;
  padding-top: $header-height;
  box-sizing: border-box;

  .page__header {
    width: 100%;
    height: $header-height;
    flex-center()
    justify-content: space-between;
    box-sizing: border-box;
    /*color: white;*/
    /*background: #3296fa;*/
    background: #fff;
    color: #757C85;
    font-size: 14px;
    position: fixed;
    top: 0;

    .page-actions {
      height: 100%;
      text-align: center;
      line-height: $header-height;

      > div {
        height: 100%;
        padding-left: 20px;
        padding-right: 20px;
        display: inline-block;
      }

      i {
        font-size: 22px;
        vertical-align: middle;
      }
    }

    .step-tab {
      display: flex;
      justify-content: center;
      height: 100%;
      position: relative;

      > .step {
        width: 140px;
        font-size: 16px;
        line-height: $header-height;
        text-align: center;
        cursor: pointer;
        position: relative;

        &.ghost-step {
          position: absolute;
          height: $header-height;
          left: 0;
          z-index: -1;
          /*background: #4483f2;*/
          background: #fff;
          transition: transform .5s;

          &::after {
            content: '';
            border-width: 6px 6px 6px;
            border-style: solid;
            border-color: transparent transparent white;
            position: absolute;
            bottom: 0;
            left: 50%;
            margin-left: -6px;
          }
        }

        &.active {
          font-size: 16px;
          color: #202940;
          border-bottom: 2px solid $primaryColor;
        }

        &.active > .step-index {
          background: white;
          color: #202940;
        }

        &.disable {
          opacity: 0.5
        }

        > .step-index {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 1px solid #fff;
          border-radius: 8px;
          line-height: 18px;
          text-align: center;
          box-sizing: border-box;
        }
      }
    }
  }

  .page__content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    background #f5f5f7;
    padding-top: 15px;
  }
}

.publish-btn {
  margin: 0 15px;
}
</style>
