import nodeConfig from './config.js'

// const isEmpty = data => data === null || data === undefined || data === ''
const isEmptyArray = (data) => (Array.isArray(data) ? data.length === 0 : true)

export class NodeUtils {
  static globalID = 10000
  /**
   * 获取最大的节点ID 转换成10进制
   * @param {*} data - 整个流程数据
   */
  static getMaxNodeId(data) {
    let max = data.nodeId
    const loop = (node) => {
      if (!node) return
      max < node.nodeId && (max = node.nodeId)
      node.childNode && loop(node.childNode)
      Array.isArray(node.conditionNodes) && node.conditionNodes.forEach((c) => loop(c))
    }
    loop(data)
    const chars = 'ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz0123456789'
    const len = chars.length
    return max.split('').reduce((sum, c, i) => {
      return sum + chars.indexOf(c) * Math.pow(len, i)
    }, 0)
  }
  /**
   * 根据自增数生成64进制id
   * @returns 64进制id字符串
   */
  static idGenerator() {
    let qutient = ++this.globalID
    const chars = 'ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz0123456789'
    const charArr = chars.split('')
    const radix = chars.length
    const res = []
    do {
      let mod = qutient % radix
      qutient = (qutient - mod) / radix
      res.push(charArr[mod])
    } while (qutient)
    // eslint-disable-next-line
    this.fit(res)
    // eslint-disable-next-line
    let allNode = JSON.parse(localStorage.getItem('allNode'))
    let node = res.join('')
    if (allNode && allNode.length > 2 && allNode.includes(node)) {
      return this.idGenerator()
    } else {
      return res.join('')
    }
  }
  static getAllNode() {}
  static fit(data) {
    if (!isNaN(parseInt(data[0]))) {
      let s = data.shift()
      data.push(s)
      this.fit(data)
    }
  }
  /**
   * 判断节点类型
   * @param {Node} node - 节点数据
   * @returns Boolean
   */
  static isConditionNode(node) {
    return node && node.type === 'condition'
  }
  static isParallelNode(node) {
    return node && node.type === 'parallel'
  }
  static isCopyNode(node) {
    return node && node.type === 'copy'
  }
  static isStartNode(node) {
    return node && node.type === 'start'
  }
  static isApproverNode(node) {
    return node && node.type === 'approver'
  }
  /**
   * 创建指定节点
   * @param { String } type - 节点类型
   * @param { Object } previousNodeId - 父节点id
   * @returns { Object } 节点数据
   */
  static createNode(type, previousNodeId) {
    let res = JSON.parse(JSON.stringify(nodeConfig[type]))
    res.nodeId = this.idGenerator()
    res.prevId = previousNodeId
    return res
  }
  /**
   * 获取第一个分支并行审批id
   * @param { String } processData - 流程图全部数据
   */
  static getFisrtParallelBranchId(processData, previousNode) {
    if (processData.parallelNodes) {
      processData.parallelNodes.map((d) => {
        d.getFisrtParallelBranchId = processData.nodeId
        this.getFisrtParallelBranchId(d, processData)
      })
    } else if (processData.conditionNodes) {
      previousNode &&
        previousNode.getFisrtParallelBranchId &&
        (processData.getFisrtParallelBranchId = previousNode.getFisrtParallelBranchId)
      processData.conditionNodes.map((d) => {
        this.getFisrtParallelBranchId(d, processData)
      })
    } else {
      previousNode &&
        previousNode.getFisrtParallelBranchId &&
        (processData.getFisrtParallelBranchId = previousNode.getFisrtParallelBranchId)
    }
    processData.childNode && this.getFisrtParallelBranchId(processData.childNode, processData)
  }
  /**
   * 获取指定节点的父节点（前一个节点）
   * @param { String } prevId - 父节点id
   * @param { Object } processData - 流程图全部数据
   * @returns { Object } 父节点
   */
  static getPreviousNode(prevId, processData) {
    if (processData.nodeId === prevId) return processData
    if (processData.childNode) {
      let r1 = this.getPreviousNode(prevId, processData.childNode)
      if (r1) {
        return r1
      }
    }
    if (processData.conditionNodes) {
      for (let c of processData.conditionNodes) {
        let r2 = this.getPreviousNode(prevId, c)
        if (r2) {
          return r2
        }
      }
    }
    if (processData.parallelNodes) {
      for (let c of processData.parallelNodes) {
        let r2 = this.getPreviousNode(prevId, c)
        if (r2) {
          return r2
        }
      }
    }
  }
  /**
   * 删除节点
   * @param { Object  } nodeData - 被删除节点的数据
   * @param { Object  } processData - 流程图的所有节点数据
   */
  static deleteNode(nodeData, processData, checkEmpty = true) {
    let prevNode = this.getPreviousNode(nodeData.prevId, processData)
    //如果只剩一个节点  不允许删除
    if(prevNode.type === 'start') return

    if (checkEmpty && prevNode.type === 'empty') {
      if (this.isConditionNode(nodeData)) {
        this.deleteNode(prevNode, processData)
      } else {
        if (isEmptyArray(prevNode.conditionNodes)) {
          this.deleteNode(prevNode, processData)
        }
        this.deleteNode(nodeData, processData, false)
      }
      // this.deleteNode( prevNode, processData )
      // !this.isConditionNode(nodeData) && this.deleteNode(nodeData, processData)
      return
    }
    let concatChild = (prev, delNode) => {
      prev.childNode = delNode.childNode
      isEmptyArray(prev.conditionNodes) && (prev.conditionNodes = delNode.conditionNodes)
      isEmptyArray(prev.parallelNodes) && (prev.conditionNodes = delNode.parallelNodes)
      prev.childNode && (prev.childNode.prevId = prev.nodeId)
      prev.conditionNodes && prev.conditionNodes.forEach((c) => (c.prevId = prev.nodeId))
      prev.parallelNodes && prev.parallelNodes.forEach((c) => (c.prevId = prev.nodeId))
    }
    if (this.isConditionNode(nodeData)) {
      let cons = prevNode.conditionNodes
      let index = cons.findIndex((c) => c.nodeId === nodeData.nodeId)
      if (cons.length > 2) {
        cons.splice(index, 1)
      } else {
        let anotherCon = cons[+!index]
        delete prevNode.conditionNodes
        if (prevNode.childNode) {
          let endNode = anotherCon
          while (endNode.childNode) {
            endNode = endNode.childNode
          }
          endNode.childNode = prevNode.childNode
          endNode.childNode.prevId = endNode.nodeId
        }
        concatChild(prevNode, anotherCon)
      }
      // 重新编排优先级
      cons.forEach((c, i) => (c.properties.priority = i))
      return
    }
    concatChild(prevNode, nodeData)
  }
  // TODO:
  // static copyNode ( nodeData, processData ) {
  //   let prevNode = this.getPreviousNode( nodeData.prevId, processData )
  //   let index = prevNode.conditionNodes.findIndex( c => c.nodeId === nodeData.nodeId )

  // }
  /**
   * 添加审计节点（普通节点 approver）
   * @param { Object } data - 目标节点数据，在该数据节点之后添加审计节点
   * @param { Object } isBranchAction - 目标节点数据，是否是条件分支
   * @param { Object } newChildNode - 传入的新的节点 用户操作均为空  删除操作/添加抄送人 会传入该参数 以模拟添加节点
   */
  static addApprovalNode(data, isBranchAction, newChildNode = undefined) {
    let oldChildNode = data.childNode
    newChildNode = newChildNode || this.createNode('approver', data.nodeId)

    data.childNode = newChildNode
    if (oldChildNode) {
      newChildNode.childNode = oldChildNode
      oldChildNode.prevId = newChildNode.nodeId
    }
    let conditionNodes = data.conditionNodes
    if (Array.isArray(conditionNodes) && !isBranchAction && conditionNodes.length) {
      newChildNode.conditionNodes = conditionNodes.map((c) => {
        c.prevId = newChildNode.nodeId
        return c
      })
      delete data.conditionNodes
    }

    let parallelNodes = data.parallelNodes
    if (Array.isArray(parallelNodes) && !isBranchAction && parallelNodes.length) {
      newChildNode.parallelNodes = parallelNodes.map((c) => {
        c.prevId = newChildNode.nodeId
        return c
      })
      delete data.parallelNodes
    }
    if (oldChildNode && oldChildNode.type === 'empty') {
      this.deleteNode(oldChildNode, data)
    }
  }
  /**
   * 添加空节点
   * @param { Object } data - 空节点的父级节点
   * @return { Object } emptyNode - 空节点数据
   */
  static addEmptyNode(data) {
    let emptyNode = this.createNode('empty', data.nodeId)
    this.addApprovalNode(data, true, emptyNode)
    return emptyNode
  }

  static addCopyNode(data, isBranchAction) {
    // 复用addApprovalNode  因为抄送人和审批人基本一致
    this.addApprovalNode(data, isBranchAction, this.createNode('copy', data.nodeId))
  }
  /**
   * 添加条件节点 condition 通过点击添加条件进入该操作
   * @param { Object } data - 目标节点所在分支数据，在该分支最后添加条件节点
   */
  static appendConditionNode(data) {
    const conditions = data.conditionNodes
    let node = this.createNode('condition', data.nodeId)
    let defaultNodeIndex = conditions.findIndex((node) => node.properties.isDefault)
    node.properties.priority = conditions.length
    if (defaultNodeIndex > -1) {
      conditions.splice(-1, 0, node) // 插在倒数第二个
      //更新优先级
      node.properties.priority = conditions.length - 2
      conditions[conditions.length - 1].properties.priority = conditions.length - 1
    } else {
      conditions.push(node)
    }
    this.setDefaultCondition(node, data)
  }
  /**
   * 添加条件分支 branch
   * @param { Object } data - 目标节点所在节点数据，在该节点最后添加分支节点
   */
  static appendBranch(data, isBottomBtnOfBranch) {
    // isBottomBtnOfBranch 用户点击的是分支树下面的按钮
    let nodeData = data
    // 由于conditionNodes是数组 不能添加下级分支 故在两个分支树之间添加一个不会显示的正常节点 兼容此种情况
    if (
      (Array.isArray(data.conditionNodes) && data.conditionNodes.length) ||
      (Array.isArray(data.parallelNodes) && data.parallelNodes.length)
    ) {
      if (isBottomBtnOfBranch) {
        // 添加一个模拟用的空白节点并返回这个节点，作为新分支的父节点
        nodeData = this.addEmptyNode(nodeData, true)
      } else {
        let emptyNode = this.addEmptyNode(nodeData, true)
        emptyNode.conditionNodes = nodeData.conditionNodes
        emptyNode.conditionNodes.forEach((n) => {
          n.prevId = emptyNode.nodeId
        })
      }
    }
    let conditionNodes = [
      this.createNode('condition', nodeData.nodeId),
      this.createNode('condition', nodeData.nodeId)
    ].map((c, i) => {
      c.properties.title += i + 1
      c.properties.priority = i
      if (i == 1) {
        c.properties.isDefault = true
        c.content = '其他情况进入此流程'
      }

      return c
    })
    nodeData.conditionNodes = conditionNodes
  }
  /**
   * 重设节点优先级（条件节点）
   * @param {Node} cnode - 当前节点
   * @param {Number} oldPriority - 替换前的优先级（在数组中的顺序）
   * @param {Node} processData - 整个流程图节点数据
   */
  static resortPrioByCNode(cnode, oldPriority, processData) {
    // 当前节点为默认节点 取消修改优先级
    if (cnode.properties.isDefault) {
      cnode.properties.priority = oldPriority
      return
    }
    let prevNode = this.getPreviousNode(cnode.prevId, processData)
    let newPriority = cnode.properties.priority
    // 替换节点为默认节点 取消修改优先级
    if (prevNode.conditionNodes[newPriority].properties.isDefault) {
      cnode.properties.priority = oldPriority
      return
    }
    let delNode = prevNode.conditionNodes.splice(newPriority, 1, cnode)[0]
    delNode.properties.priority = oldPriority
    prevNode.conditionNodes[oldPriority] = delNode
  }

  /**
   * 提升条件节点优先级——排序在前
   * @param { Object } data - 目标节点数据
   * @param { Object  } processData - 流程图的所有节点数据
   */
  static increasePriority(data, processData) {
    if (data.properties.isDefault) {
      // 默认节点不能修改优先级
      return
    }
    // 分支节点数据 包含该分支所有的条件节点
    let prevNode = this.getPreviousNode(data.prevId, processData)
    let branchData = prevNode.conditionNodes
    let index = branchData.findIndex((c) => c === data)
    if (index) {
      // 和前一个数组项交换位置 Array.prototype.splice会返回包含被删除的项的集合（数组）
      branchData[index - 1].properties.priority = index
      branchData[index].properties.priority = index - 1
      branchData[index - 1] = branchData.splice(index, 1, branchData[index - 1])[0]
    }
  }
  /**
   * 降低条件节点优先级——排序在后
   * @param { Object } data - 目标节点数据
   * @param { Object  } processData - 流程图的所有节点数据
   */
  static decreasePriority(data, processData) {
    // 分支节点数据 包含该分支所有的条件节点
    let prevNode = this.getPreviousNode(data.prevId, processData)
    let branchData = prevNode.conditionNodes
    let index = branchData.findIndex((c) => c.nodeId === data.nodeId)
    if (index < branchData.length - 1) {
      let lastNode = branchData[index + 1]
      if (lastNode.properties.isDefault) {
        // 默认节点不能修改优先级
        return
      }
      // 和后一个数组项交换位置 Array.prototype.splice会返回包含被删除的项的集合（数组）
      lastNode.properties.priority = index
      branchData[index].properties.priority = index + 1
      branchData[index + 1] = branchData.splice(index, 1, branchData[index + 1])[0]
    }
  }
  /**
   * 当有其他条件节点设置条件后 检查并设置最后一个节点为默认节点
   * @param {Node} cnode  - 当前节点
   * @param {Node} processData - 整个流程图节点数据或父级节点数据
   */
  static setDefaultCondition(cnode, processData) {
    const DEFAULT_TEXT = '其他情况进入此流程'
    const conditions = this.getPreviousNode(cnode.prevId, processData).conditionNodes
    const hasCondition = (node) =>
      node.properties && (node.properties.initiator || !isEmptyArray(node.properties.conditions))
    const clearDefault = (node) => {
      node.properties.isDefault = false
      node.content === DEFAULT_TEXT && (node.content = '请设置条件')
    }
    const setDefault = (node) => {
      node.properties.isDefault = true
      node.content = DEFAULT_TEXT
    }
    let count = 0

    conditions.slice(0, -1).forEach((node) => {
      count++
      clearDefault(node)
    })
    const lastNode = conditions[conditions.length - 1]
    count > 0 && !hasCondition(lastNode) ? setDefault(lastNode) : clearDefault(lastNode)
  }
  /**
   * 校验单个节点必填项完整性
   * @param {Node} node - 节点数据
   */
  static checkNode(node) {
    // 抄送人应该可以默认自选
    let valid = true
    const props = node.properties
    // this.isStartNode(node) && !props.initiator && (valid = false)
    // this.isCopyNode(node) &&
    //     node.properties.members &&
    //     node.properties.members.length === 0 &&
    //     (valid = false)
    this.isCopyNode(node) &&
      !node.properties.members &&
      // node.properties.members.length === 0 &&
      (valid = false)
    this.isConditionNode(node) &&
      !props.isDefault &&
      (!props.initiator || props.initiator.length === 0) &&
      isEmptyArray(props.conditions) &&
      (valid = false)
    const customSettings = ['user', 'optional']
    this.isApproverNode(node) &&
      customSettings.includes(props.assigneeType) &&
      isEmptyArray(props.approvers) &&
      (valid = false)

    const typeList = ['tag', 'position', 'job', 'directorLevel']
    this.isApproverNode(node) &&
      typeList.includes(props.assigneeType) &&
      !props.infoForm[`${props.assigneeType}Id`] &&
      (valid = false)
    this.isApproverNode(node) && props.assigneeType === undefined && (valid = false)

    this.isParallelNode(node) &&
      customSettings.includes(props.assigneeType) &&
      isEmptyArray(props.approvers) &&
      (valid = false)

    this.isParallelNode(node) &&
      typeList.includes(props.assigneeType) &&
      !props.infoForm[`${props.assigneeType}Id`] &&
      (valid = false)
    this.isParallelNode(node) && props.assigneeType === undefined && (valid = false)
    return valid
  }
  /**
   * 判断所有节点是否信息完整
   * @param {Node} processData - 整个流程图数据
   * @returns {Boolean}
   */
  static checkAllNode(processData) {
    let valid = true
    const loop = (node, callback, parent) => {
      !this.checkNode(node, parent) && callback()
      if (node.childNode) loop(node.childNode, callback, parent)
      if (!isEmptyArray(node.conditionNodes)) {
        node.conditionNodes.forEach((n) => loop(n, callback, node))
      }
      if (!isEmptyArray(node.parallelNodes)) {
        node.parallelNodes.forEach((n) => loop(n, callback, node))
      }
    }
    loop(processData, () => (valid = false))
    return valid
  }
  /**
   * 返回修改权限后的流程数据
   * @param {*} processData 流程数据
   * @param {*} fieldList 表单内容
   */
  static initAllOperate({ processData, fieldList }) {
    const loop = (node) => {
      let formOperatesTemp = node.properties.formOperates
      this.initCurrentOperate(fieldList, node, formOperatesTemp)
      if (!_.isEmpty(node.childNode)) loop(node.childNode)
      // 兼容条件分支
      if (!_.isEmpty(node.conditionNodes)) {
        node.conditionNodes.forEach((item) => {
          if (item.childNode) {
            loop(item.childNode)
          }
        })
      }
      // 兼容并行分支
      if (node.parallelNodes && !_.isEmpty(node.parallelNodes)) {
        node.parallelNodes.forEach((item) => {
          loop(item)
        })
      }
    }
    loop(processData)
  }
  /**
   * 初始化当前节点的权限设置
   * @param {*} fieldList 表单设计内容
   * @param {*} node 当前节点
   * @param {*} formOperatesTemp 当前节点的权限列表
   */
  static initCurrentOperate(fieldList, node, formOperatesTemp) {
    let targetList = []
    fieldList.map((item) => {
      let target = _.chain(item.__config__)
        .pick(['formId', 'label', 'required', 'proCondition'])
        .assign({
          formPrivilege: this.getPrivilege(formOperatesTemp, item.__config__.formId, node)
        })
        .value()
      targetList.push(target)
    })
    node.properties.formOperates = targetList
  }
  /**
   * 当前节点为起始节点时候，权限默认为0（可以编辑），否则为1（只读）
   * @param {*} node 当前节点
   */
  static isStartPrivilege(node) {
    return this.isStartNode(node) ? 0 : 1
  }
  /**
   * 当前存在表单权限设置，使用之前数据，否则使用是否是发起人的权限判断
   * 有值且当前为必填的条件分支时，权限为1
   * @param {*} formOperatesTemp
   * @param {*} formId
   * @param {*} node
   */
  static getPrivilege(formOperatesTemp, formId, node) {
    let currentOperate = _.filter(formOperatesTemp, (item) => {
      return item.formId === formId
    })[0]
    return _.isEmpty(currentOperate) ? this.isStartPrivilege(node) : currentOperate.formPrivilege
  }
}

/**
 * 添模拟数据
 */
export function getMockData() {
  let startNode = NodeUtils.createNode('start')
  startNode.childNode = NodeUtils.createNode('approver', startNode.nodeId)
  return startNode
}
