<template>
  <div class="exam-info">
    <BasicSetting />
    <Permission />
  </div>
</template>

<script>
import BasicSetting from './infoComponents/basicInfo'
import Permission from './infoComponents/permission'

export default {
  name: 'ExamInfo',
  components: {
    BasicSetting,
    Permission
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.exam-info {
  background-color: #fff;
  padding: 20px 60px;
  margin-bottom: 30px;
}
</style>
