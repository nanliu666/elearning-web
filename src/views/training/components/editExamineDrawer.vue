<template>
  <el-drawer
    :title="title"
    :visible.sync="innnerVisible"
    size="524px"
  >
    <div class="wrapper">
      <ul class="nav-ul">
        <li
          v-for="(item, index) in navList"
          :key="index"
          class="nav-li"
          :class="{ 'active-nav': currentIndex === index }"
          @click="navChange(index)"
        >
          {{ item }}
        </li>
      </ul>
      <div class="form">
        <basicSetting
          v-show="currentIndex === 0"
          ref="basicSettingRef"
        />
        <testEnvironment
          v-show="currentIndex === 1"
          ref="testEnvironmentRef"
        />
        <examineePermissions
          v-show="currentIndex === 2"
          ref="examineePermissionsRef"
        />
        <evaluationStrategy
          v-show="currentIndex === 3"
          ref="evaluationStrategyRef"
        />
        <achievementPublish
          v-show="currentIndex === 4"
          ref="achievementPublishRef"
        />
      </div>
      <div class="footer">
        <el-checkbox
          v-model="isSyncChecked"
          :disabled="syncDisabled"
        >
          本条考试信息数据同步至【考试管理】
        </el-checkbox>
        <div>
          <el-button
            type="primary"
            size="medium"
            @click="submit"
          >
            保存
          </el-button>
          <el-button
            size="medium"
            @click="close"
          >
            取消
          </el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
const navList = ['基本设置', '考场环境', '考生权限', '评卷策略', '成绩发布']
import basicSetting from './examineComponents/basicSetting'
import testEnvironment from './examineComponents/testEnvironment'
import examineePermissions from './examineComponents/examineePermissions'
import evaluationStrategy from './examineComponents/evaluationStrategy'
import achievementPublish from './examineComponents/achievementPublish'
export default {
  name: 'EditExamineDrawer',
  components: {
    basicSetting,
    testEnvironment,
    examineePermissions,
    evaluationStrategy,
    achievementPublish
  },
  props: {
    examine: { type: Object, default: null },
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      isSyncChecked: false,
      currentIndex: 0,
      title: '添加考试',
      navList
    }
  },
  computed: {
    // 在首次创建或编辑时是可编辑的，一旦勾选，保存后若再次编辑，则不能撤销勾
    // 编辑模式，并且有值不可编辑
    syncDisabled() {
      return this.examine && this.isSyncChecked ? true : false
    },
    innnerVisible: {
      get: function() {
        return this.visible
      },
      set: function(value) {
        this.$emit('update:visible', value)
      }
    }
  },
  watch: {
    visible: {
      handler: function(val) {
        if (val) {
          // console.log('val==', this.examine)
          if (!_.isEmpty(this.examine)) {
            // this.model = _.cloneDeep(this.examine)
            this.title = '编辑考试'
          } else {
            // this.$refs.form && this.$refs.form.resetFields()
          }
        }
      }
    }
  },
  methods: {
    navChange(index) {
      this.currentIndex = index
    },
    close() {
      this.innnerVisible = false
    },
    submit() {
      const basicSettingData = this.$refs.basicSettingRef.model
      const testEnvironmentData = this.$refs.testEnvironmentRef.model
      const examinePermissionsData = this.$refs.examineePermissionsRef.model
      const evaluationStrategyData = this.$refs.evaluationStrategyRef.model
      const achievementPublishData = this.$refs.achievementPublishRef.formData
      const examineData = {
        ...basicSettingData,
        ...testEnvironmentData,
        ...examinePermissionsData,
        ...evaluationStrategyData,
        ...achievementPublishData,
        ...{ isSyncExam: this.isSyncChecked ? 1 : 0 }
      }
      // console.log('testData==', examineData)
      this.$refs.basicSettingRef.$refs.form.validate().then(() => {
        this.$emit('submit', examineData)
        this.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .nav-ul {
    margin: 0 30px 20px;
    display: flex;
    justify-content: space-between;
    border: 1px solid #c7cbd1;
    .nav-li {
      flex: 1;
      height: 100%;
      width: calc(100% / 5);
      padding: 4px 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 1px solid #c7cbd1;
      cursor: pointer;
      &:last-child {
        border-right: 0;
      }
    }
    .active-nav {
      background-color: #437bfd;
      color: #ffffff;
    }
  }
}
.form {
  flex: 1;
  padding: 0 30px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 300px;
  /*height: calc(100% - 400px);*/
}

.footer {
  display: flex;
  padding: 20px 10px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f5f5f7;
  /deep/ .el-checkbox__label {
    font-size: 12px;
  }
}
</style>
