<template>
  <div class="exam-info">
    <BasicSetting />
  </div>
</template>

<script>
import BasicSetting from './infoComponents/basicInfo'
export default {
  name: 'ExamInfo',
  components: {
    BasicSetting
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
