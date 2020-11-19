<template>
  <div class="NewsManage">
    <page-header title="新闻管理">
      <template #rightMenu>
        <el-button
          type="primary"
          size="medium"
          @click="() => handlePublishBtnClick()"
        >
          新建公告
        </el-button>
      </template>
    </page-header>
    <div class="tabsNav flex flex-flow flex-justify-between flexcenter">
      <div class="tabsNav-tabs flex flex-flow flex-justify-between">
        <div
          :class="[activeName === 'Published' ? 'tabsNav-tabs-active' : '']"
          @click="activeName = 'Published'"
        >
          已发布（{{ Published_number }}）
        </div>
        <div
          :class="[activeName === 'Draft' ? 'tabsNav-tabs-active' : '']"
          @click="activeName = 'Draft'"
        >
          草稿箱（{{ Draft_number }}）
        </div>
      </div>
      <div class="flex-flow flex">
        <div>
          <el-select
            v-model="form.ENUMS_STATUS[activeName].publishColumn"
            class="tabsNav-select"
            placeholder="请选择"
            @change="handleChange"
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.dictValue"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div>
          <el-input
            v-model="form.ENUMS_STATUS[activeName].name"
            placeholder="输入公告编号或标题搜索"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="changeInput"
            ></i>
          </el-input>
        </div>
      </div>
    </div>
    <el-row
      class="container__grid"
      :gutter="8"
    >
      <el-col class="container__grid--main">
        <new-table
          v-show="activeName === ENUMS_STATUS.Published"
          ref="Published"
          :status="ENUMS_STATUS.Published"
          :number.sync="Published_number"
          :search="form.ENUMS_STATUS.Published"
          :type-list="typeList"
        ></new-table>
        <new-table
          v-show="activeName === ENUMS_STATUS.Draft"
          ref="Draft"
          :type-list="typeList"
          :status="ENUMS_STATUS.Draft"
          :number.sync="Draft_number"
          :search="form.ENUMS_STATUS.Draft"
        ></new-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import newTable from './components/newTable'

const ENUMS_STATUS = {
  Published: 'Published',
  Draft: 'Draft'
}

// 全部/新闻中心/系统消息
export default {
  name: 'NewsManage',
  components: {
    newTable
  },

  data() {
    return {
      ENUMS_STATUS,
      activeName: 'Published',
      typeList: [],
      newsType: '',
      Published_number: 0,
      Draft_number: 0,
      form: {
        ENUMS_STATUS: {
          Published: {
            name: '',
            publishColumn: ''
          },
          Draft: {
            name: '',
            publishColumn: ''
          }
        }
      }
    }
  },

  watch: {
    'searchParams.categoryId'() {
      this.handleSearch(this.searchParams)
    }
  },
  mounted() {
    this.$store.dispatch('CommonDict', 'NewsNotice').then((res) => {
      this.typeList = [{ dictValue: '全部', id: '' }, ...res]
    })
  },
  methods: {
    changeInput() {
      this.handleChange()
    },
    handleChange() {
      if (this.activeName === this.ENUMS_STATUS['Published']) {
        this.$nextTick(() => {
          this.$refs[this.ENUMS_STATUS['Published']].handleSearch()
        })
      } else {
        this.$nextTick(() => {
          this.$refs[this.ENUMS_STATUS['Draft']].handleSearch()
        })
      }
    },
    handlePublishBtnClick() {
      this.$router.push({
        path: '/newsCenter/newsEdit'
      })
    }
  }
}
</script>

<style lang="sass" scoped>
$color_active: #368AFA
$color_danger: #ff6464
$color_icon: #757C85
$color_hover: #207EFA

.NewsManage
  height: 100%
  .table__link
    color: $color_active
    &:hover
      cursor: pointer
      color: $color_hover
  .status-span
      padding: 4px
      /*border-radius: 2px*/
  .basic-container--block
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
  .container__grid
    height: 0
    min-height: calc(100% - 92px)
    &--aside,&--main
      height: 100%
    &--aside
      width: 250px
    &--main
      width: calc(100%)
  .table__handler
    i
      color: $color_icon
    i.font__color--active
      color: $color_active
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




.tabsNav
  min-height: 50px
  width: calc(100% - 2px)
  background: #fff
  padding: 0px 20px
  border-bottom: 1px solid #DCDFE6
  margin: 0 1px
  box-sizing: border-box
  &-tabs
   line-height: 50px
   font-size: 14px
   div
    margin: 0px 10px
    cursor: pointer
   &-active
     border-bottom: 2px solid $color_active
  &-select
   width: 140px
   margin-right: 20px
.icon
  line-height: 34px
</style>
