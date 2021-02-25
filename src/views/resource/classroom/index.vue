<template>
  <div class="classroom__container">
    <el-card class="nav__card">
      <el-menu
        :default-active="activeIndex"
        :active-text-color="activeColor"
        class="classroom__menu"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          分类管理
        </el-menu-item>
        <el-menu-item index="2">
          教室列表
        </el-menu-item>
        <el-menu-item index="3">
          教室预定
        </el-menu-item>
      </el-menu>
    </el-card>
    <classroom-classify v-show="activeIndex === '1'" />
    <classroom-list v-show="activeIndex === '2'" />
  </div>
</template>
<script>
import styles from '@/styles/variables.scss'
import ClassroomClassify from './classify'
import ClassroomList from './list'
export default {
  name: '',
  components: {
    ClassroomClassify,
    ClassroomList
  },
  data() {
    return {
      activeColor: styles.primaryColor,
      activeIndex: '2'
    }
  },
  created() {},
  methods: {
    handleSelect(key) {
      this.activeIndex = key
      if (key === '3') {
        this.$message.error('开发中...')
      }
    }
  }
}
</script>
<style scoped lang="scss">
.classroom__container {
  margin: 20px 0;
  .nav__card {
    margin-bottom: 20px;
    /deep/ .el-card__body {
      padding-bottom: 0;
      padding-top: 0;
    }
  }
}
</style>
