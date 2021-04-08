<template>
  <div class="diyHomePc">
    <div class="operation">
      <div class="left">
        <el-form
          ref="diyFormRef"
          :model="diyInfor"
          label-width="80px"
        >
          <el-form-item label="名称：">
            <el-input
              v-model="diyInfor.name"
              type="text"
              size="small"
              placeholder="请输名称"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <el-button
          type="primary"
          size="small"
        >
          发布
        </el-button>
        <el-button
          type="primary"
          size="small"
        >
          保存
        </el-button>
        <el-button size="small">
          返回
        </el-button>
      </div>
    </div>
    <div class="page">
      <div class="menu">
        <img
          src="/img/diyPc1.jpg"
          alt=""
        />
      </div>
      <div class="banner">
        <img
          src="/img/diyPc2.jpg"
          alt=""
        />
      </div>
      <div class="contet">
        <div class="contetL">
          <draggable
            v-model="contetArrL"
            group="a"
            animation="300"
            drag-class="dragClass"
            ghost-class="ghostClass"
            chosen-class="chosenClass"
            @start="moveFn"
          >
            <transition-group>
              <div
                v-for="item in contetArrL"
                :key="item.id"
                :class="['contetItem', activeClassKey === item.id ? 'activeClass' : '']"
                @click="checkFn($event, item, 'left')"
              >
                <img
                  :src="`/img/${item.id}.jpg`"
                  alt=""
                />
              </div>
            </transition-group>
          </draggable>
        </div>
        <div class="contetR">
          <draggable
            v-model="contetArrR"
            group="b"
            animation="300"
            drag-class="dragClass"
            ghost-class="ghostClass"
            chosen-class="chosenClass"
          >
            <transition-group>
              <div
                v-for="item in contetArrR"
                :key="item.id"
                :class="['contetItem', activeClassKey === item.id ? 'activeClass' : '']"
                @click="checkFn($event, item, 'left')"
              >
                <img
                  :src="`/img/${item.id}.jpg`"
                  alt=""
                />
              </div>
            </transition-group>
          </draggable>
        </div>
        <div
          v-show="activeClassKey"
          class="edit1"
          :style="`top:${editStyle.top}px;left:${editStyle.left}px`"
        >
          <div class="edit2">
            <span
              class="iconimage_icon_delete iconfont"
              @click="deleteModule"
            ></span>
          </div>
        </div>
      </div>
    </div>
    <div class="addModule">
      <h3>添加栏目</h3>
      <span>左侧栏目</span>
      <ul>
        <li
          v-for="item in baseContetArrL"
          :key="item.id"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div></div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  name: 'DiyHomePc',
  components: {
    draggable
  },
  data() {
    return {
      activeClassKey: '',
      moduleType: '', // 模块类型，判断是左边还是右边或者是头部banner
      diyInfor: {
        name: ''
      },
      editStyle: {
        top: '0',
        left: 0
      },
      baseContetArrL: [
        { id: 'diyPcL1', name: '我的任务' },
        { id: 'diyPcL2', name: '最新直播' },
        { id: 'diyPcL3', name: '热门课程' },
        { id: 'diyPcL4', name: '培训中心' },
        { id: 'diyPcL5', name: '新闻中心' }
      ],
      baseContetArrR: [
        { id: 'diyPcR1', name: '个人信息' },
        { id: 'diyPcR2', name: '学习中的课程' },
        { id: 'diyPcR3', name: '月度积分排行榜' },
        { id: 'diyPcR4', name: '月度学时排行榜' }
      ],
      contetArrL: [
        { id: 'diyPcL1', name: '我的任务' },
        { id: 'diyPcL2', name: '最新直播' },
        { id: 'diyPcL3', name: '热门课程' },
        { id: 'diyPcL4', name: '培训中心' },
        { id: 'diyPcL5', name: '新闻中心' }
      ],
      contetArrR: [
        { id: 'diyPcR1', name: '个人信息' },
        { id: 'diyPcR2', name: '学习中的课程' },
        { id: 'diyPcR3', name: '月度积分排行榜' },
        { id: 'diyPcR4', name: '月度学时排行榜' }
      ]
    }
  },
  methods: {
    checkFn(event, item, moduleType) {
      // 选中模块时触发
      console.log('event', event)
      if (item) {
        this.activeClassKey = item.id
      }
      this.moduleType = moduleType
      this.editStyle.top = event.target.offsetTop
      this.editStyle.left = event.target.offsetLeft + event.target.offsetWidth
      console.log('item', item)
    },
    moveFn(event) {
      // 移动模块时触发
      this.activeClassKey = ''
      this.moduleType = ''
      console.log('event', event)
    },
    deleteModule() {
      if (this.moduleType === 'left') {
        this.contetArrL.splice(
          this.contetArrL.findIndex((e) => e.id === this.activeClassKey),
          1
        )
      } else if (this.moduleType === 'right') {
        this.contetArrR.splice(
          this.contetArrR.findIndex((e) => e.id === this.activeClassKey),
          1
        )
      }
      this.activeClassKey = ''
      this.moduleType = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.operation {
  padding: 15px 20px 20px 20px;
}
.operation .left {
  float: left;
}
.operation .right {
  float: right;
}
.operation::after {
  content: '';
  display: block;
  clear: both;
}
.page {
  width: 1360px;
  text-align: center;
  background: #fafafa;
  position: relative;
}
.page .activeClass {
  border: #f00 solid 1px;
}

.page .menu {
}
.contet {
  display: flex;
  width: 1200px;
  margin: auto;
  padding-top: 50px;
}
.contet .contetItem {
  cursor: pointer;
}
.contet .contetL {
  width: 916;
}
.contet .contetR {
  flex: 1;
}
.contet .edit1 {
  position: absolute;
}
.contet .edit2 {
}
.contet .edit2 span {
  color: #333;
  font-size: 24px;
  cursor: pointer;
}
.addModule {
}
</style>
