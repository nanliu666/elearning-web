<template>
  <div
    v-loading="loading"
    class="diyHomePc"
  >
    <div class="operation">
      <div class="left">
        <el-form
          ref="diyFormRef"
          :rules="formRules"
          :model="formData"
          label-width="100px"
        >
          <el-form-item
            prop="name"
            label="方案名称："
          >
            <el-input
              v-model="formData.name"
              type="text"
              size="small"
              placeholder="请输方案名称"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <el-button
          v-p="DIY_EDIT_RELEASE_PC"
          type="primary"
          size="small"
          @click="releaseFn"
        >
          发布
        </el-button>
        <el-button
          v-p="DIY_EDIT_SAVE_PC"
          type="primary"
          size="small"
          @click="saveTempFn"
        >
          保存
        </el-button>
        <el-button
          size="small"
          @click="goBack"
        >
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
      <div
        :class="['banner', activeClassKey === 'banner' ? 'activeClass' : '']"
        @click="checkFn($event, item, 'banner')"
      >
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
                @click="checkFn($event, item, 'right')"
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
              v-show="activeClassKey !== 'banner'"
              class="iconshanchu iconfont"
              @click="deleteModule"
            ></span>
            <span
              v-show="activeClassKey === 'banner'"
              class="iconshezhi iconfont"
              @click="confingFn"
            ></span>
          </div>
        </div>
      </div>
    </div>
    <div class="addModule">
      <h3>添加栏目</h3>
      <div class="addModule2">
        <span>左侧栏目：</span>
        <ul>
          <li
            v-for="item in baseContetArrL"
            :key="item.id"
            @click="addTempFn(item, 'left')"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="addModule2">
        <span>右侧栏目：</span>
        <ul>
          <li
            v-for="item in baseContetArrR"
            :key="item.id"
            @click="addTempFn(item, 'right')"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { postSaveTemp, putReleaseTemp, putUpdataTemp, getDetailTemp } from '@/api/diy/diy'
export default {
  name: 'DiyHomePc',
  components: {
    draggable
  },
  data() {
    return {
      loading: false,
      activeClassKey: '',
      tempId: '', // 模板id
      moduleType: '', // 模块类型，判断是左边还是右边或者是头部banner
      // diyInfor: {
      //   name: ''
      // },
      formData: {
        orgId: '',
        name: '',
        device: 1,
        item: ''
      },
      editStyle: {
        top: '0',
        left: 0
      },
      formRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
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
        // { id: 'diyPcL1', name: '我的任务' },
        // { id: 'diyPcL2', name: '最新直播' },
        // { id: 'diyPcL3', name: '热门课程' },
        // { id: 'diyPcL4', name: '培训中心' },
        // { id: 'diyPcL5', name: '新闻中心' }
      ],
      contetArrR: [
        // { id: 'diyPcR1', name: '个人信息' },
        // { id: 'diyPcR2', name: '学习中的课程' },
        // { id: 'diyPcR3', name: '月度积分排行榜' },
        // { id: 'diyPcR4', name: '月度学时排行榜' }
      ]
    }
  },
  mounted() {
    // this.formData.orgId = this.$route.query.orgId
    // if (this.$route.query.id) {
    //   this.initData()
    // }
  },
  activated() {
    this.formData.orgId = this.$route.query.orgId
    if (this.$route.query.id) {
      this.initData()
    }
  },
  deactivated() {
    this.tempId = ''
    let newData = {
      orgId: '',
      name: '',
      device: 1,
      item: ''
    }
    this.formData = { ...newData }
  },
  methods: {
    initData() {
      // 编辑时初始化数据
      this.loading = true
      this.tempId = this.$route.query.id
      let sendData = {}
      sendData.id = this.tempId
      getDetailTemp(sendData).then((res) => {
        this.loading = false
        this.formData = { ...res }
        let itemObj = JSON.parse(res.item)
        this.contetArrL = itemObj.content
        this.contetArrR = itemObj.side
      })
    },
    checkFn(event, item, moduleType) {
      // 选中模块时触发
      if (item) {
        this.activeClassKey = item.id
      }
      if (moduleType === 'banner') {
        this.activeClassKey = 'banner'
      }
      this.moduleType = moduleType
      this.editStyle.top = event.target.offsetTop
      this.editStyle.left = event.target.offsetLeft + event.target.offsetWidth + 10
    },
    moveFn() {
      // 移动模块时触发
      this.activeClassKey = ''
      this.moduleType = ''
    },
    deleteModule() {
      if (this.moduleType === 'left') {
        // 删除左侧模板
        this.contetArrL.splice(
          this.contetArrL.findIndex((e) => e.id === this.activeClassKey),
          1
        )
      } else if (this.moduleType === 'right') {
        // 删除右侧模板
        this.contetArrR.splice(
          this.contetArrR.findIndex((e) => e.id === this.activeClassKey),
          1
        )
      }
      this.activeClassKey = ''
      this.moduleType = ''
    },
    confingFn() {
      // 跳转设置banner
      this.$router.push({
        path: '/diy/bannerPc',
        query: { orgId: this.formData.orgId }
      })
    },
    addTempFn(item, type) {
      // 添加模板
      if (type === 'left') {
        // 添加左侧模板
        let isRepetition = this.contetArrL.some((val) => {
          return val.id === item.id
        })
        if (isRepetition) {
          this.$message.error('不能重复添加')
        } else {
          this.contetArrL.push(item)
        }
      } else if (type === 'right') {
        // 添加右侧模板
        let isRepetition = this.contetArrR.some((val) => {
          return val.id === item.id
        })
        if (isRepetition) {
          this.$message.error('不能重复添加')
        } else {
          this.contetArrR.push(item)
        }
      }
    },
    saveTempFn() {
      // 新增模板时保存
      this.$refs['diyFormRef'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.tempId && this.tempId.length > 0) {
            this.updataTempFn()
            return
          }
          let sendData = {}
          sendData = _.clone(this.formData)
          let items = {}
          items.content = this.contetArrL
          items.side = this.contetArrR
          sendData.item = JSON.stringify(items)
          postSaveTemp(sendData).then((res) => {
            this.loading = false
            this.tempId = res
            this.$message.success('保存成功')
          })
        } else {
          this.loading = false
        }
      })
    },
    updataTempFn() {
      // 修改模板
      this.loading = true
      let sendData = {}
      sendData = _.clone(this.formData)
      sendData.id = this.tempId
      let items = {}
      items.content = this.contetArrL
      items.side = this.contetArrR
      sendData.item = JSON.stringify(items)
      putUpdataTemp(sendData).then(() => {
        this.loading = false
        this.$message.success('保存成功')
      })
    },
    releaseFn() {
      // 发布
      this.loading = true
      if (this.tempId && this.tempId.length > 0) {
        let sendData = {}
        sendData.id = this.tempId
        putReleaseTemp(sendData).then(() => {
          this.loading = false
          this.$message.success('发布成功')
        })
      } else {
        this.$message.error('请先保存')
      }
    },
    goBack() {
      // 返回
      this.$router.push({ path: '/diy/diyHomePc' })
    }
  }
}
</script>
<style lang="scss" scoped>
.diyHomePc {
  width: 1500px;
}
.operation {
  box-sizing: border-box;
  width: 1360px;
  padding: 20px 20px 0px 20px;
}
.operation .left {
  float: left;
}
.operation .right {
  float: right;
  padding-top: 5px;
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
  width: 916px;
}
.contet .contetR {
  flex: 1;
}
.contet .edit1 {
  position: absolute;
  z-index: 2000;
}

.contet .edit2 span {
  color: #333;
  font-size: 22px;
  cursor: pointer;
}
.addModule {
  padding: 30px 0 50px 80px;
}
.addModule h3 {
  margin: 0 0 20px 0;
}
.addModule .addModule2::after {
  content: '';
  display: block;
  clear: both;
  margin-bottom: 20px;
}
.addModule span {
  float: left;
}
.addModule ul {
  float: left;
}
.addModule li {
  float: left;
  cursor: pointer;
  color: #333;
  border: 1px solid #666;
  padding: 5px 20px;
  margin: 0 20px 0 0;
  border-radius: 4px;
}
</style>
