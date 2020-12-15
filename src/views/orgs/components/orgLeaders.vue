<template>
  <div class="org-leaders">
    <div
      v-for="(val, key) in leaderArr"
      :key="key"
    >
      <el-col :span="4">
        {{ val['title'] || '负责人' }}
      </el-col>
      <el-col :span="20">
        {{ val['leaderName'] }}
      </el-col>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrgLeaders',
  props: {
    leaders: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      levalTitle: {
        '1': '负责人',
        '2': '二级负责人',
        '3': '三级负责人',
        '4': '四级负责人',
        '5': '五级负责人',
        '6': '六级负责人',
        '7': '七级负责人',
        '8': '八级负责人',
        '9': '九级负责人',
        '10': '十级负责人'
      }
    }
  },
  computed: {
    leaderArr() {
      if (this.leaders.length) {
        let leaderCopyArr = JSON.parse(JSON.stringify(this.leaders))
        let tmpObj = {}
        for (let i = 0; leaderCopyArr[i]; i++) {
          let level = leaderCopyArr[i].level
          let leaderName = leaderCopyArr[i].userId ? leaderCopyArr[i].userName : '空缺'
          let title = this.levalTitle[level]
          if (!tmpObj[level]) tmpObj[level] = {}
          if (!tmpObj[level].title) tmpObj[level] = { title }
          if (tmpObj[level]['leaderName']) {
            tmpObj[level]['leaderName'] = tmpObj[level]['leaderName'] + '，' + leaderName
          } else {
            tmpObj[level]['leaderName'] = leaderName
          }
        }
        return tmpObj
      } else {
        return { '1': { title: this.levalTitle[1], leaderName: '暂无' } }
      }
    }
  }
}
</script>

<style scoped="scoped">
.org-leaders .el-col {
  margin-bottom: 20px;
}
.org-leaders .el-col-4 {
  color: #999999;
}
</style>
