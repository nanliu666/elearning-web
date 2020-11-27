<template>
  <el-dialog
    title="请选择审批人"
    class="user-picker"
    :visible="visible"
    width="800px"
    append-to-body
    :before-close="close"
  >
    <div class="content-wr">
      <div class="left">
        <div
          v-for="item in optionList"
          :key="item.userId"
          class="option-item"
        >
          <el-checkbox
            :value="getChecked(item)"
            @change="handleCheck(item)"
          />
          <span @click="handleCheck(item)">{{ item.name }}({{ item.workNo }})</span>
        </div>
      </div>
      <div class="divider" />
      <div class="selected-container">
        <div class="header">
          <div>已选中</div>
          <el-button
            type="text"
            @click="clear()"
          >
            清空
          </el-button>
        </div>
        <div class="selected-list">
          <div
            v-for="item in selected"
            :key="item.userId"
            class="list-item"
          >
            <div class="head">
              <div class="avatar">
                <img
                  v-if="item.avatarUrl"
                  :src="item.avatarUrl"
                />
                <i
                  v-else
                  class="el-icon-user"
                />
              </div>
              <div class="name">
                {{ item.name }}
              </div>
            </div>
            <i
              class="el-icon-close  close"
              @click="handleCheck(item)"
            />
          </div>
        </div>
      </div>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="medium"
        @click="close"
      >取 消</el-button>
      <el-button
        size="medium"
        type="primary"
        @click="handleSubmit"
      >
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'UserPicker',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    optionList: {
      type: Array,
      default: () => []
    },
    callback: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      selected: [],
      visible: false
    }
  },
  methods: {
    close() {
      this.clear()
      this.visible = false
    },
    clear() {
      this.selected = []
    },
    getChecked(item) {
      return _.some(this.selected, (i) => i.userId === item.userId)
    },
    handleCheck(item) {
      if (this.getChecked(item)) {
        this.selected = _.filter(this.selected, (i) => i.userId !== item.userId)
      } else {
        if (this.multiple) {
          this.selected = _.uniqBy([...this.selected, item], 'userId')
        } else {
          this.selected = [item]
        }
      }
    },
    init(selected) {
      this.selected = selected.slice()
    },
    handleSubmit() {
      if (this.callback) {
        this.callback(this.selected)
      } else {
        this.$emit('submit', this.selected)
      }
      this.close()
    }
  }
}
</script>
<style lang="scss">
.user-picker {
  .el-dialog__body {
    padding: 24px;
  }
  .content-wr {
    display: flex;
    border: 1px solid #efefef;
    padding: 0 24px;
    height: 450px;
    .left {
      width: 55%;
      box-sizing: border-box;
      padding: 14px 0;
      overflow: auto;
      .option-item {
        display: flex;
        align-items: center;
        line-height: 32px;
        cursor: pointer;
        .el-checkbox {
          margin-right: 10px;
        }
      }
    }
    .divider {
      width: 1px;
      background: #e3e7e9;
      margin: 0 24px;
    }
    .selected-container {
      flex: 1;
      padding: 14px 0;
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .selected-list {
        margin-top: 16px;
        overflow: auto;
        .list-item {
          display: flex;
          height: 32px;
          align-items: center;
          justify-content: space-between;
          border-radius: 4px;
          margin-bottom: 16px;
          padding-right: 12px;
          .head {
            display: flex;
            line-height: 32px;
          }
          .avatar {
            height: 32px;
            width: 32px;
            text-align: center;
            background: $primaryColor;
            border-radius: 50%;
            margin-right: 8px;
            img {
              border-radius: 50%;
              width: 100%;
              height: 100%;
            }
            i {
              font-size: 16px;
              line-height: 32px;
              color: white;
            }
          }
          .close {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
