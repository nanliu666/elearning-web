<template>
  <div class="diyHomePc">
    <div class="operation">
      <div class="left">
        <el-form
          ref="diyFormRef"
          :rules="formRules"
          :model="formData"
          label-width="80px"
        >
          <el-form-item
            prop="name"
            label="名称："
          >
            <el-input
              v-model="formData.name"
              type="text"
              size="small"
              placeholder="请输名称"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <el-button
          v-p="DIY_EDIT_RELEASE_MB"
          type="primary"
          size="small"
          @click="releaseFn"
        >
          发布
        </el-button>
        <el-button
          v-p="DIY_EDIT_SAVE_MB"
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
      <div>
        <img
          src="/img/diyMbH.jpg"
          alt=""
        />
      </div>
      <div
        :class="['banner', activeClassKey === 'banner' ? 'activeClass' : '']"
        @click="checkFn($event, item, 'banner')"
      >
        <img
          src="/img/diyMbBanner.jpg"
          alt=""
        />
      </div>
      <div class="menu">
        <img
          src="/img/diyMbMenu.jpg"
          alt=""
        />
      </div>
      <div class="contet">
        <div class="contetL">
          <draggable
            v-model="contetArr"
            group="a"
            animation="300"
            drag-class="dragClass"
            ghost-class="ghostClass"
            chosen-class="chosenClass"
            @start="moveFn"
          >
            <transition-group>
              <div
                v-for="item in contetArr"
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
      <div>
        <img
          src="/img/diyMbBottom.jpg"
          alt=""
        />
      </div>
    </div>
    <div class="addModule">
      <h3>添加栏目：</h3>
      <div class="addModule2">
        <ul>
          <li
            v-for="item in baseContetArr"
            :key="item.id"
            @click="addTempFn(item, 'content')"
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
import { DIY_EDIT_RELEASE_MB, DIY_EDIT_SAVE_MB } from '@/const/privileges'
export default {
  name: 'DiyHomePc',
  components: {
    draggable
  },
  data() {
    return {
      activeClassKey: '',
      tempId: '', // 模板id
      moduleType: '', // 模块类型，判断是左边还是右边或者是头部banner
      // diyInfor: {
      //   name: ''
      // },
      formData: {
        orgId: '',
        name: '',
        device: 0,
        item: ''
      },
      editStyle: {
        top: '0',
        left: 0
      },
      formRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      baseContetArr: [
        { id: 'diyMb1', name: '我的任务' },
        { id: 'diyMb2', name: '最新直播' },
        { id: 'diyMb3', name: '热门课程' },
        { id: 'diyMb4', name: '培训中心' },
        { id: 'diyMb5', name: '月度排行榜' },
        { id: 'diyMb6', name: '新闻资讯' }
      ],
      contetArr: [
        // { id: 'diyPcL1', name: '我的任务' },
        // { id: 'diyPcL2', name: '最新直播' },
        // { id: 'diyPcL3', name: '热门课程' },
        // { id: 'diyPcL4', name: '培训中心' },
        // { id: 'diyPcL5', name: '新闻中心' }
      ]
    }
  },
  computed: {
    DIY_EDIT_RELEASE_MB: () => DIY_EDIT_RELEASE_MB,
    DIY_EDIT_SAVE_MB: () => DIY_EDIT_SAVE_MB
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
      device: 0,
      item: ''
    }
    this.formData = { ...newData }
  },
  methods: {
    initData() {
      // 编辑时初始化数据
      this.tempId = this.$route.query.id
      let sendData = {}
      sendData.id = this.tempId
      getDetailTemp(sendData).then((res) => {
        this.formData = { ...res }
        let itemObj = JSON.parse(res.item)
        this.contetArr = itemObj.content
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
        this.contetArr.splice(
          this.contetArr.findIndex((e) => e.id === this.activeClassKey),
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
        path: '/diy/bannerMobile',
        query: { orgId: this.formData.orgId }
      })
    },
    addTempFn(item, type) {
      // 添加模板
      if (type === 'content') {
        // 添加左侧模板
        let isRepetition = this.contetArr.some((val) => {
          return val.id === item.id
        })
        if (isRepetition) {
          this.$message.error('不能重复添加')
        } else {
          this.contetArr.push(item)
        }
      }
    },
    saveTempFn() {
      // 新增模板时保存
      this.$refs['diyFormRef'].validate((valid) => {
        if (valid) {
          if (this.tempId && this.tempId.length > 0) {
            this.updataTempFn()
            return
          }
          let sendData = {}
          sendData = _.clone(this.formData)
          let items = {}
          items.content = this.contetArr
          sendData.item = JSON.stringify(items)
          postSaveTemp(sendData).then((res) => {
            this.tempId = res
            this.$message.success('保存成功')
          })
        }
      })
    },
    updataTempFn() {
      // 修改模板
      let sendData = {}
      sendData = _.clone(this.formData)
      sendData.id = this.tempId
      let items = {}
      items.content = this.contetArr
      sendData.item = JSON.stringify(items)
      putUpdataTemp(sendData).then(() => {
        this.$message.success('保存成功')
      })
    },
    releaseFn() {
      // 发布
      if (this.tempId && this.tempId.length > 0) {
        let sendData = {}
        sendData.id = this.tempId
        putReleaseTemp(sendData).then(() => {
          this.$message.success('发布成功')
        })
      } else {
        this.$message.error('请先保存')
      }
    },
    goBack() {
      // 返回
      this.$router.push({ path: '/diy/diyHomeMobile' })
    }
  }
}
</script>
<style lang="scss" scoped>
.diyHomePc {
  text-align: center;
}
.operation {
  box-sizing: border-box;
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
  margin: auto;
  width: 502px;
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
  width: 720px;
  margin: auto;
  padding-top: 50px;
}
.contet .contetItem {
  cursor: pointer;
}
.contet .contetL {
}
.contet .contetR {
  flex: 1;
}
.contet .edit1 {
  position: absolute;
  z-index: 2000;
}
.contet .edit2 {
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
  text-align: left;
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
