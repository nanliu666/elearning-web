<template>
  <div class="Menu fill">
    <page-header
      title="权限配置"
      show-back
    >
      <el-button
        slot="rightMenu"
        size="medium"
        type="primary"
        @click="handleMenuAddBtnClick"
      >
        新增权限
      </el-button>
    </page-header>

    <basic-container block>
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="后台系统菜单"
          name="webPermission"
        >
          <web-permission
            ref="permission"
            :client-id="clientId"
          />
        </el-tab-pane>
        <el-tab-pane
          v-if="false"
          label="Mobile端权限"
          name="mobilePermission"
        />
      </el-tabs>
    </basic-container>
    <roleLimits
      v-if="configVisible"
      :visible.sync="configVisible"
      :client-id="clientId"
      @setConfig="setVisible"
    />
  </div>
</template>

<script>
// import { getRoleList, getCate, getPositions, delRole } from '../../api/system/role'
import webPermission from './components/webPermission'
import roleLimits from './components/roleLimits'
export default {
  components: {
    webPermission,
    roleLimits
  },
  data() {
    return {
      activeName: 'webPermission',
      clientId: 'Admin',
      configVisible: false
    }
  },
  methods: {
    handleMenuAddBtnClick() {
      // console.log('新增所有权限')
      this.configVisible = !this.configVisible
    },
    handleClick() {
      this.clientId = this.activeName == 'webPermission' ? 'Admin' : 'OAMobile'
    },
    setVisible() {
      this.configVisible = !this.configVisible
      this.$refs.permission.refreshTableData()
    }
  }
}
</script>

<style lang="sass" scoped>
$color_icon: #A0A8AE

.basic-container--block
  height: calc(100% - 92px)
  min-height: calc(100% - 92px)
.operations
  align-items: center
  display: flex
  justify-content: space-between
  &__column--item
    height: 25px
  &__column--visible
    height: 200px
    overflow: scroll
  &__btns
    align-items: center
    display: flex
    height: 24px
    justify-content: flex-start
  &__btns--item
    margin: 0
    margin-right: 4px
    padding: 0
    height: 24px
    width: 24px
    line-height: 24px
    &:last-child
      margin: 0
    // margin-bottom: 8px
    // margin-right: 8px
  .iconfont
    color: $color_icon
    font-weight: bold
    font-size: 16px

.Menu
  // 添加一个分隔号 "｜"
  .table__handler
    display: flex
    justify-content: flex-end
    > .el-button--text
      text-align: center
      padding: 0 8px
      margin-left: 0px
      position: relative
      &:not(:last-child)::after
        background-color: #e3e7e9
        content: ''
        height: 10px
        position: absolute
        right: 0
        top: 50%
        transform: translateY(-50%)
        width: 1px
</style>
