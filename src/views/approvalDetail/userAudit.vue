<template>
  <div>
    <div class="details_course_detailed">
      <div class="details_course_detailed_top">
        <div class="details_course_detailed_r">
             <el-table
              :data="userData"
              style="width: 100%">
              <el-table-column
                prop="workNo"
                label="编号"
                width="180">
              </el-table-column>
              <el-table-column
                prop="name"
                label="姓名"
                width="180">
              </el-table-column>
              <el-table-column
                prop="sex"
                label="性别">
                <template slot-scope="scope">
                    <span>{{scope.row.sex==0?'女':'男'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="position"
                label="岗位">
              </el-table-column>
              <el-table-column
                prop="orgName"
                label="组织">
              </el-table-column>
              <el-table-column
                prop="phonenum"
                label="手机号">
              </el-table-column>
              <el-table-column
                prop="userEmail"
                label="邮箱">
              </el-table-column>
              <el-table-column
                prop="birthDate"
                label="出生日期">
              </el-table-column>
            </el-table>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import TextOverTooltip from '../course/components/TextOverTooltip'
import { getuserApprDetail } from '@/api/user'
export default {
  name: 'CourseDetail',
  components: {
    TextOverTooltip
  },
  props: {
    applyDetail: {
      type: Object,
      default:()=>{}
    }
  },
  data() {
    return {
      // 课程详情
      userData: [],
      pitch: 1
    }
  },
  watch: {
    applyDetail() {
      this.getUserInfo()
    }
  },
  mounted() {
    // 获取课程详情
    this.$nextTick(() => {
      if (this.applyDetail.formId) {
        this.getUserInfo()
      }
    })
  },
  methods: {
    // 获取课程信息
    async getUserInfo() {
      this.userData = await getuserApprDetail({ bizId: this.applyDetail.formId })
    },
    setPitch(i) {
      this.pitch = i
    }
  }
}
</script>
<style scoped lang="scss">

</style>
