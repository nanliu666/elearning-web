<template>
  <div class="demo-test">
    <div
      class="select-area"
      @click="visible = true"
    >
      <div v-if="users.length === 0">
        点击选择人员
      </div>
      <template v-else>
        <el-tag
          v-for="user in users"
          :key="user.bizId"
          closable
          @close="handleRemove(user)"
        >
          {{ user.bizName }}
        </el-tag>
      </template>
    </div>
    <user-picker
      v-model="users"
      :visible.sync="visible"
    ></user-picker>
  </div>
</template>

<script>
import UserPicker from '@/components/user-picker/userPicker'
export default {
  name: 'DemoTest',
  components: { UserPicker },
  data() {
    return {
      users: [],
      visible: false
    }
  },
  methods: {
    handleRemove(user) {
      this.users = _.filter(this.users, (u) => u !== user)
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-test {
  .select-area {
    border: 1px solid #f2f2f5;
    padding: 20px;
    background-color: #fff;
    text-align: center;
    cursor: pointer;
    .el-tag {
      margin-right: 8px;
      margin-bottom: 2px;
    }
  }
}
</style>
