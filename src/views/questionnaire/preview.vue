<template>
  <div class="preview">
    <div class="header" @click="$router.back()">
      <i class="el-icon-arrow-left"> </i>
      <span class="title">预览问卷</span>
    </div>

    <div class="paper-container">
      <div class="paper-side">
        <div class="side-item active">电脑预览</div>
        <div class="side-item">手机预览</div>
      </div>
      <div class="paper-wrapper">
        <el-scrollbar>
          <div>
            <div class="paper-header-area">
              <div class="paper-title">大学生就业意向调查</div>
              <div class="paper-intro">为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，我们非常重视每位用户的宝贵意见，期待您的参与！现在我们就马上开始吧！</div>
            </div>

            <div class="paper-topic">
              <div class="topic-item" v-for="(item, index) in data" :key="item.id">
                <div class="topic-type">{{getTypeName(item, index)}}</div>
                <div class="topic-title">{{index + 1}}.<span style="display: inline-block; margin-right: 5px; color: red;" v-if="item.require">*</span>{{item.title}}</div>
                <div class="topic-content">
                  <el-input v-if="item.type == '1'" v-model="item._input"></el-input>

                  <el-radio-group v-else-if="item.type == '2'" v-model="item._radio">
                    <el-radio :label="topic" v-for="(topic, index) in item.content" :key="index"></el-radio>
                  </el-radio-group>

                 <el-checkbox-group v-model="item._checkbox" v-if="item.type == '3'">
                    <el-checkbox :label="topic" v-for="(topic, index) in item.content" :key="index">{{topic}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>

            </div>
          </div>
        </el-scrollbar>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'preview',
  data() {
    return {
      data: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.data = [{
        require: true,
        type: '1',
        title: '你的专业是',
        content: ''
      },{
        require: false,
        type: '2',
        title: '你的性别',
        content: ['男', '女'],
        _radio: '男'
      },{
        require: false,
        type: '3',
        title: '你的兴趣',
        content: ['乒乓球', '羽毛球', '网游', '爬山', '足球'],
        _checkbox: ['乒乓球']
      }]
    },
    getTypeName(item, index) {
      let result = index + 1
      switch(item.type) {
        case '1':
          result += '、简答题'
          break
        case '2':
          result += '、单选题'
          break
        case '3':
          result += '、多选题'
          break
        default:
          break
      }
      return result
    },
  }
}
</script>

<style lang="scss">
  .preview {
    .topic-content {
      margin-left: 12px;
      .el-radio, .el-checkbox {
        display: block;
        line-height: 22px;
        margin-bottom: 0;
        &:not(:first-child) {
          margin-top: 16px;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
.preview {
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
  .paper-container {
    display: flex;
    height: 100%;
    background: #FFFFFF;
    box-shadow: 0 2px 12px 0 rgba(0,61,112,0.08);
    box-sizing: border-box;
    margin-bottom: 20px;
    .paper-side {
      width: 160px;
      border-right: 1px solid #EBECED;
      height: 100%;
      padding-top: 64px;
      .side-item {
        width: 100%;
        height: 42px;
        line-height: 42px;
        text-align: center;
        font-size: 14px;
        color: rgba(0,11,21,0.85);
        box-sizing: border-box;
        &.active {
          cursor: pointer;
          background-color: #F0FAFE;
          border-left: 2px solid  #01AAFC;
        }
      }
    }
    .paper-wrapper {
      flex: 1;
      margin: 40px;
      overflow-y: auto;
      .paper-header-area {
        width: 100%;
        text-align: center;
        .paper-title {
          font-size: 18px;
          color: rgba(0,11,21,0.85);
          font-weight: bold;
        }
        .paper-intro {
          font-size: 12px;
          color: rgba(0,11,21,0.45);
          max-width: 800px;
          margin: 16px auto 0;
        }
      }
      .paper-topic {
        .topic-item {
          font-size: 14px;
          max-width: 452px;
          margin-top: 40px;
          .topic-type {
            font-family: emoji;
            font-size: 14px;
            color: #000B15;
            line-height: 24px;
            margin-bottom: 24px;
            font-weight: bold;
          }
          .topic-title {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0,11,21,0.65);
            letter-spacing: 0;
            line-height: 22px;
            margin-bottom: 8px;
          }
        }
      }
    }
  }
}
</style>