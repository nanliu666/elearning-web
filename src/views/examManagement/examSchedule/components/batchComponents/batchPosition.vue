<template>
  <div class="position__container common__container">
    <div class="title__box">
      <div class="title__left">
        <div class="left">
          <span>岗位：</span>
          <span>{{ _.size(pagePositionList) }}个</span>
        </div>
        <div class="right">
          <span>人数：</span>
          <span>{{ _.sum(_.map(pagePositionList, 'workNum')) }}人</span>
        </div>
      </div>
      <div class="title__right">
        <el-button
          v-if="batchLiData.hasDelete"
          type="text"
          @click="positionPickerVisible = true"
        >
          添加岗位
        </el-button>
      </div>
    </div>
    <div v-if="!_.isEmpty(currentPositionList)">
      <ul class="tag__ul">
        <li
          v-for="item in currentPositionList"
          :key="item.positionId"
          class="tag__li"
        >
          <div>
            <span>
              <span>（</span>
              <span>{{ item.workNum }}</span>
              <span>人</span>
              <span>）</span>
            </span>
            <span>{{ item.positionName }}</span>
          </div>
          <i
            v-if="batchLiData.hasDelete"
            class="el-icon-close"
            @click="handleDelete"
          />
        </li>
      </ul>
      <pagination
        v-if="_.size(pagePositionList) > 10"
        :total="_.size(pagePositionList)"
        :page.sync="orgPage.pageNo"
        :limit.sync="orgPage.pageSize"
      />
    </div>
    <com-empty
      v-else
      text="暂无岗位"
    />
    <!-- 选岗位弹窗 -->
    <common-picker
      v-model="positionList"
      dialog-title="添加岗位"
      header-title="请选择岗位"
      :visible.sync="positionPickerVisible"
      :options="POSITION_OPTIONS"
      :props="POSITION_PROPS"
      :selected-style="POSITION_STYLE"
      :reserve="false"
    />
  </div>
</template>
<script>
import { POSITION_OPTIONS, POSITION_PROPS, POSITION_STYLE } from './personConfig'
export default {
  name: 'BatchPosition',
  inject: ['batchLiData'],
  components: {
    CommonPicker: () => import('@/components/common-picker'),
    Pagination: () => import('@/components/common-pagination'),
    ComEmpty: () => import('@/components/common-empty/empty')
  },
  props: {
    positionData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      positionPage: {
        pageNo: 1,
        pageSize: 10
      },
      positionPickerVisible: false // 是否展示选岗位
    }
  },
  computed: {
    // 实际部门数据
    positionList: {
      get() {
        return this.positionData
      },
      set(val) {
        this.$emit('update:positionData', val)
      }
    },
    // 用来页面的搜索后的数据展示
    pagePositionList() {
      let tempList = []
      const searchName = _.get(this.batchLiData, 'search')
      const positionIdsList = _.get(this.batchLiData, 'positionIdsList')
      if (searchName) {
        // 过滤剩下搜索出来的id的结果
        _.each(this.positionList, (item) => {
          _.each(positionIdsList, (deep) => {
            if (item.id === deep) {
              tempList.push(item)
            }
          })
        })
      } else {
        tempList = this.positionList
      }
      return tempList
    },
    // 页面展示的部门数据
    currentPositionList() {
      const { pageSize, pageNo } = this.positionPage
      return this.pagePositionList.slice(pageSize * (pageNo - 1), pageSize * pageNo)
    },
    POSITION_OPTIONS: () => POSITION_OPTIONS,
    POSITION_PROPS: () => POSITION_PROPS,
    POSITION_STYLE: () => POSITION_STYLE
  },
  created() {},
  methods: {
    handleDelete(pos) {
      const index = _.findIndex(this.positionList, (item) => item.positionId === pos.positionId)
      this.positionList.splice(index, 1)
    }
  }
}
</script>
<style scoped lang="scss">
@import './person.scss';
</style>
