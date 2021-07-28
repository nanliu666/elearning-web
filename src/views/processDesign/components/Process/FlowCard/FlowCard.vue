<script>
/* eslint-disable no-unused-vars */
import { NodeUtils } from './util.js'
const isCondition = (data) => data.type === 'condition'
const notEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0
const hasBranch = (data) => notEmptyArray(data.conditionNodes)
const stopPro = (ev) => ev.stopPropagation()

// 卡片渲染函数
function createNormalCard(ctx, conf, h) {
  const classList = ['flow-path-card']
  const afterTrue = (isTrue, name) => (isTrue && classList.push(name), isTrue)
  const isStartNode = afterTrue(NodeUtils.isStartNode(conf), 'start-node')
  // 审批人
  const isApprNode = afterTrue(NodeUtils.isApproverNode(conf), 'approver')
  // 抄送人
  const isCopyNode = afterTrue(NodeUtils.isCopyNode(conf), 'copy')
  return (
    <section class={classList.join(' ')} onClick={this.eventLancher.bind(ctx, 'edit', conf)}>
      <header class="header">
        <div class="title-box" style="height: 100%;width:180px;">
          {isApprNode && (
            <i class="iconfont iconshenpi" style="font-size:12px;color:white;margin-right:8px;"></i>
          )}
          {isCopyNode && (
            <i class="el-icon-s-promotion" style="font-size:12px;color:white;margin-right:8px;"></i>
          )}
          <span class="title-text">{conf.properties.title}</span>
          {!isStartNode && (
            <input
              vModel_trim={conf.properties.title}
              class="title-input"
              style="margin-top:6px;"
              onClick={stopPro}
            />
          )}
        </div>
        <div class="actions" style="margin-right:8px;">
          <i
            class="el-icon-close icon"
            onClick={this.eventLancher.bind(ctx, 'deleteNode', conf, ctx.data)}
          ></i>
        </div>
      </header>
      <div class="body">
        <span class="text">{conf.content}</span>
        <div class="icon-wrapper right right_other">
          <i class="el-icon-arrow-right icon right-arrow"></i>
        </div>
      </div>
    </section>
  )
}
// arg = ctx, data, h
// 不同类型设置不同
const createFunc = (...arg) => createNormalCard.call(arg[0], ...arg)
let nodes = {
  approver: createFunc,
  copy: createFunc,
  empty: (_) => ''
}

// 节点添加按钮
function addNodeButton(ctx, data, h, isBranch = false) {
  // 只有非条件节点和条件分支树下面的那个按钮 才能添加新分支树
  let couldAddBranch = !hasBranch(data) || isBranch
  let isEmpty = data.type === 'empty'
  if (isEmpty && !isBranch) {
    return ''
  }
  return (
    <div class="add-node-btn-box flex  justify-center">
      <div class="add-node-btn">
        <el-popover placement="right" trigger="click" width="200">
          <div class="condition-box">
            <div>
              <div
                class="condition-icon"
                onClick={ctx.eventLancher.bind(ctx, 'addApprovalNode', data, isBranch)}
              >
                <i class="iconfont icon-approval-Seal-bicolor"></i>
              </div>
              审批人
            </div>

            <div>
              <div
                class="condition-icon"
                onClick={ctx.eventLancher.bind(ctx, 'addCopyNode', data, isBranch)}
              >
                <i class="icon-CC-bicolor iconfont" style="vertical-align: middle;"></i>
              </div>
              抄送人
            </div>
          </div>
          <button class="btn" type="button" slot="reference">
            <i class="el-icon-plus icons"></i>
          </button>
        </el-popover>
      </div>
    </div>
  )
}

// 主要渲染函数
function NodeFactory(ctx, data, h) {
  if (!data) return
  const showErrorTip = ctx.verifyMode && NodeUtils.checkNode(data) === false
  let res = [],
    selfNode
  if (NodeUtils.isStartNode(data)) {
    selfNode = (
      <div class="node-wrap">
        <section class="start-node">发起申请</section>
        {addNodeButton.call(ctx, ctx, data, h)}
      </div>
    )
  } else {
    selfNode = (
      <div class="node-wrap">
        <div class={`node-wrap-box ${data.type} ${showErrorTip ? 'error' : ''}`}>
          <el-tooltip content="未设置条件" placement="top" effect="dark">
            <div class="error-tip" onClick={this.eventLancher.bind(ctx, 'edit', data)}>
              !!!
            </div>
          </el-tooltip>
          {nodes[data.type].call(ctx, ctx, data, h)}
          {addNodeButton.call(ctx, ctx, data, h)}
        </div>
      </div>
    )
  }

  res.push(selfNode)
  data.childNode && res.push(NodeFactory.call(ctx, ctx, data.childNode, h))
  return res
}

function addEndNode(h) {
  return <section class="end-node">流程结束</section>
}
export default {
  props: {
    data: { type: Object, required: true },
    // 点击发布时需要校验节点数据完整性 此时打开校验模式
    verifyMode: { type: Boolean, default: true }
  },
  watch: {},
  methods: {
    /**
     *事件触发器 统筹本组件所有事件并转发到父组件中
     * @param { Object } 包含event（事件名）和args（事件参数）两个参数
     */
    eventLancher(event, ...args) {
      // args.slice(0,-1) vue 会注入MouseEvent到最后一个参数 去除事件对象
      let param = { event, args: args.slice(0, -1) }
      this.$emit('emits', param)
    }
  },
  render(h) {
    return (
      <div style="display: inline-flex; flex-direction: column; align-items: center;">
        {this.data && NodeFactory.call(this, this, this.data, h)}
        {addEndNode(h)}
      </div>
    )
  }
}
</script>

<style lang="stylus" scoped>
@import 'index.styl';
</style>
<style>
.flow-container .node-wrap:first-of-type .el-popover__reference {display: none;}
</style>