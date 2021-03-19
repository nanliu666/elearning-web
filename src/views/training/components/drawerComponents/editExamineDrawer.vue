<template>
  <el-drawer
    :title="title"
    :visible.sync="innnerVisible"
    size="524px"
    append-to-body
    custom-class="examineDrawer"
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
      <div class="form__box">
        <basicSetting
          v-show="currentIndex === 0"
          ref="basicSettingRef"
          :entry-c-name="entryCName"
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
          style="height: 100%;"
        />
      </div>
      <div class="footer">
        <div class="footer-inner">
          注：{{
            entryCName
          }}发布后，本条考试信息数据将会同步至【考评管理】，可在考试安排和成绩管理查到对应信息
        </div>
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
import basicSetting from '../examineComponents/basicSetting'
import testEnvironment from '../examineComponents/testEnvironment'
import examineePermissions from '../examineComponents/examineePermissions'
import evaluationStrategy from '../examineComponents/evaluationStrategy'
import achievementPublish from '../examineComponents/achievementPublish'
import { createUniqueID } from '@/util/util'
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
    entryCName: { type: String, default: '培训' },
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      editType: 'add',
      currentIndex: 0,
      title: '添加考试',
      navList,
      model: {
        operationType: 'Add'
      }
    }
  },
  computed: {
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
    visible(value) {
      if (value) {
        if (!_.isEmpty(this.examine)) {
          this.assignmentInEdit()
        } else {
          this.clearInAdd()
        }
      }
    }
  },
  methods: {
    assignmentInEdit() {
      this.title = '编辑考试'
      this.editType = 'edit'
      this.model.operationType = this.examine.operationType
      this.$nextTick(() => {
        this.$refs.basicSettingRef.model = this.getNavModel(this.$refs.basicSettingRef.model)
        this.$refs.testEnvironmentRef.model = this.getNavModel(this.$refs.testEnvironmentRef.model)
        this.$refs.examineePermissionsRef.model = this.getNavModel(
          this.$refs.examineePermissionsRef.model
        )
        this.$refs.evaluationStrategyRef.model = this.getNavModel(
          this.$refs.evaluationStrategyRef.model
        )
      })
    },
    clearInAdd() {
      // 新增的时候重置数据
      this.editType = 'add'
      this.$refs.basicSettingRef && this.$refs.basicSettingRef.$refs.form.resetFields()
      this.$refs.testEnvironmentRef && this.$refs.testEnvironmentRef.resetFields()
      this.$refs.examineePermissionsRef && this.$refs.examineePermissionsRef.resetFields()
      this.$refs.evaluationStrategyRef && this.$refs.evaluationStrategyRef.resetFields()
    },
    // 获取每个nav的值
    getNavModel(currentRef) {
      return _.chain(this.examine)
        .pick(_.keys(currentRef))
        .value()
    },
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
      const achievementPublishData = this.$refs.achievementPublishRef.model
      const examineData = {
        ...this.model,
        ...basicSettingData,
        ...testEnvironmentData,
        ...examinePermissionsData,
        ...evaluationStrategyData,
        ...achievementPublishData
      }
      examineData.id = this.editType === 'add' ? createUniqueID() : this.examine.id
      this.$refs.basicSettingRef.$refs.form
        .validate()
        .then(() => {
          this.$emit('submit', examineData, this.editType)
          this.close()
        })
        .catch(() => {
          this.currentIndex = 0
        })
    }
  }
}
</script>

<style lang="scss">
.examineDrawer {
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

  .form__box {
    flex: 1;
    padding: 0 30px;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 208px);
  }
  .footer {
    display: flex;
    padding: 20px 10px;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #f5f5f7;
    .footer-inner {
      font-size: 12px;
      color: #cccccc;
      width: 70%;
    }
    /deep/ .el-checkbox__label {
      font-size: 12px;
    }
  }
}
</style>
