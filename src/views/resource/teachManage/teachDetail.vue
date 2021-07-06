<template>
  <div class="fill">
    <page-header
      title="导师详情"
      show-back
      :back="goBack"
    />
    <!--信息详情-->
    <basic-container top>
      <TeachInfo
        :teach-info="teachInfo"
        @on-del-teach="delTeach"
      ></TeachInfo>
    </basic-container>
    <!--内容区域-->
    <basic-container block>
      <el-tabs
        v-model="activeName"
        @tab-click="handleSelect"
      >
        <el-tab-pane
          label="徒弟列表"
          name="discipleList"
        >
          <DiscipleList
            v-if="activeName === 'discipleList'"
            :teach-id="teachId"
          />
        </el-tab-pane>
        <el-tab-pane
          label="导师评语"
          name="evalua"
        >
          <Evalua
            v-if="activeName === 'evalua'"
            :teach-info="teachInfo"
          />
        </el-tab-pane>
        <el-tab-pane
          label="工作经历"
          name="workItem"
        >
          <template
            v-if="activeName === 'workItem'"
            :teachId="teachId"
          >
            <template v-if="workArray.length > 0">
              <WorkItem
                v-for="(item, idx) in workArray"
                :key="idx"
                :is-show-btn="false"
                :work-num="idx"
                :item-data="item"
              />
            </template>
            <template v-else>
              <div class="empty-Data">
                <div>
                  <img
                    src="../../../assets/images/nodata.png"
                    alt=""
                  />
                  <div class="empty-Data-text">
                    暂未添加工作经历
                  </div>
                </div>
              </div>
            </template>
          </template>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import styles from '@/styles/variables.scss'
import { tutorDetail, queryExperienceList } from '@/api/resource/teach'
import TeachInfo from './components/teachInfo'
import DiscipleList from './components/discipleList' //徒弟列表
import Evalua from './components/evalua' //导师评语
import WorkItem from './components/workItem' //工作经历
export default {
  name: 'TeachDetail',
  components: {
    TeachInfo,
    DiscipleList,
    Evalua,
    WorkItem
  },
  data() {
    return {
      activeName: 'discipleList',
      activeColor: styles.primaryColor,
      teachInfo: {},
      teachId: '',
      workArray: []
    }
  },
  watch: {},
  mounted() {
    const id = this.$route.query.id
    this.teachId = id
    this.getDetail(id)
  },
  methods: {
    goBack() {
      this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
      this.$router.back(-1)
    },
    getDetail(id) {
      tutorDetail({ id }).then((res) => {
        res.idStr = id
        this.teachInfo = res
      })
    },
    //获取工作经历列表
    getExperienceList() {
      queryExperienceList({ id: this.teachInfo.idStr }).then((res) => {
        const data = res.map((item) => {
          return {
            workUnit: item.workUnit,
            workStartTime: item.workStartTime,
            workEndTime: item.workEndTime,
            jobName: item.jobName,
            witness: item.witness,
            witnessPhone: item.witnessPhone,
            workContent: item.workContent,
            workTime: item.workTime || [item.workStartTime, item.workEndTime]
          }
        })
        this.workArray = data || []
      })
    },
    //删除导师
    delTeach() {
      this.goBack()
    },
    handleSelect() {
      if (this.activeName === 'workItem') {
        this.getExperienceList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: calc(55vh);
  min-height: calc(55vh);
  margin-top: 16px;
}
.empty-Data {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  .empty-Data-text {
    text-align: center;
  }
}
</style>
