<template>
  <div>
    <div
      class="select-area"
      @click="visible = true"
    >
      <div
        v-if="userList.length === 0"
        style="margin-left:15px;color:rgb(117, 124, 128)"
      >
        点击选择人员
      </div>
      <template v-else>
        <el-tag
          v-for="user in trainObjectsList"
          :key="user.bizId"
          class="tag"
          size="medium"
          closable
          @close="handleRemove(user)"
        >
          {{ user.bizName || user.name }}
        </el-tag>
        <el-tag
          v-if="userList.length > 3"
          class="tag"
          size="medium"
        >
          ······
        </el-tag>
      </template>
    </div>
    <user-picker
      v-model="userList"
      :visible.sync="visible"
      :is-only-person="true"
      :select-type="selectType"
      :title="title"
    ></user-picker>
  </div>
</template>

<script>
import userPicker from '@/components/user-picker/userPicker'
import elFormEmitter from '@/mixins/elFormEmitter'

export default {
  name: 'TrainingSelectUser',
  components: {
    userPicker
  },
  mixins: [elFormEmitter],

  props: {
    selectType: {
      type: String,
      default: () => {
        return 'Org,OuterUser'
      }
    },
    title: {
      type: String,
      default: () => {
        return '培训对象'
      }
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      visible: false,
      userList: []
    }
  },
  computed: {
    trainObjectsList() {
      if (this.userList.length > 3) {
        let list = this.userList.slice(0, 3)
        return list
      } else {
        return this.userList
      }
    }
  },
  watch: {
    value: {
      handler(data) {
        if (data) {
          this.userList = data
        }
      }
    },
    userList: {
      handler(data) {
        this.$nextTick(() => {
          this.$emit('input', data)
          this.dispatch('ElFormItem', 'el.form.change')
        })
      },
      deep: true
    }
  },
  methods: {
    handleRemove(user) {
      this.userList = _.filter(this.userList, (u) => u !== user)
    }
  }
}
</script>

<style lang="scss" scoped>
.select-area {
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  cursor: pointer;
  height: 35px;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  overflow: hidden;
}
.tag {
  margin-left: 5px;
  position: relative;
  top: -1px;

  /*line-height: 35px;*/
}
</style>
