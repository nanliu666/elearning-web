<template>
  <div class="department__container common__container">
    <div class="title__box">
      <div class="title__left">
        <div class="left">
          <span>部门：</span>
          <span>{{ _.size(pageOrgList) }}个</span>
        </div>
        <div class="right">
          <span>人数：</span>
          <span>{{ _.sum(_.map(pageOrgList, 'workNum')) }}人</span>
        </div>
      </div>
      <div class="title__right">
        <el-button
          v-if="batchLiData.hasDelete"
          type="text"
          @click="orgPickerVisible = true"
        >
          添加部门
        </el-button>
      </div>
    </div>
    <div v-if="!_.isEmpty(currentOrgList)">
      <ul class="tag__ul">
        <li
          v-for="item in currentOrgList"
          :key="item.id"
          class="tag__li"
        >
          <div>
            <span>
              <span>（</span>
              <span>{{ item.workNum }}</span>
              <span>人</span>
              <span>）</span>
            </span>
            <span>{{ item.name || item.orgName }}</span>
          </div>
          <i
            v-if="batchLiData.hasDelete"
            class="el-icon-close"
            @click="handleDeleteOrg"
          />
        </li>
      </ul>
      <pagination
        v-if="_.size(pageOrgList) > 10"
        :total="_.size(pageOrgList)"
        :page.sync="orgPage.pageNo"
        :limit.sync="orgPage.pageSize"
      />
    </div>
    <com-empty
      v-else
      text="暂无部门"
    />
    <!-- 选部门弹窗 -->
    <common-picker
      v-model="orgList"
      dialog-title="添加部门"
      header-title="请选择部门"
      :visible.sync="orgPickerVisible"
      :options="ORG_OPTIONS"
      :props="ORG_PROPS"
      :selected-style="ORG_STYLE"
      :reserve="false"
    />
  </div>
</template>
<script>
import { ORG_OPTIONS, ORG_PROPS, ORG_STYLE } from './personConfig'
export default {
  name: 'BatchOrg',
  inject: ['batchLiData'],
  components: {
    CommonPicker: () => import('@/components/common-picker'),
    Pagination: () => import('@/components/common-pagination'),
    ComEmpty: () => import('@/components/common-empty/empty')
  },
  props: {
    orgData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      orgPickerVisible: false, //
      orgPage: {
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    // 实际部门数据
    orgList: {
      get() {
        return this.orgData
      },
      set(val) {
        this.$emit('update:orgData', val)
      }
    },
    // 用来页面的搜索后的数据展示
    pageOrgList() {
      let tempList = []
      const searchName = _.get(this.batchLiData, 'search')
      const orgIdsList = _.get(this.batchLiData, 'orgIdsList')
      if (searchName) {
        // 过滤剩下搜索出来的id的结果
        _.each(this.orgList, (item) => {
          _.each(orgIdsList, (deep) => {
            if (item.id === deep) {
              tempList.push(item)
            }
          })
        })
      } else {
        tempList = this.orgList
      }
      return tempList
    },
    // 页面展示的部门数据
    currentOrgList() {
      const { pageSize, pageNo } = this.orgPage
      return this.pageOrgList.slice(pageSize * (pageNo - 1), pageSize * pageNo)
    },
    ORG_OPTIONS: () => ORG_OPTIONS,
    ORG_PROPS: () => ORG_PROPS,
    ORG_STYLE: () => ORG_STYLE
  },
  methods: {
    handleDeleteOrg(org) {
      const index = _.findIndex(this.orgList, (item) => item.id === org.id)
      this.orgList.splice(index, 1)
    }
  }
}
</script>
<style scoped lang="scss">
@import './person.scss';
</style>
