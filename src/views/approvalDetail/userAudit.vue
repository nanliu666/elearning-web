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
                prop="email"
                label="邮箱">
              </el-table-column>
              <el-table-column
                prop="birthDate"
                label="出生日期">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="50">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
        </div>
      </div>

    </div>
    <el-dialog
      title="修改详情"
      :visible.sync="dialogVisible"
      width="50%">
      <div class="dialog">
        <div class="type">操作类型：{{getOperatetype(userOldData)}}</div>
        <div v-for="(val,key,index) in userKeyData" :key="index">
          <div :class="{'red':getDifference(key),'item':true}">
            <span class="label">{{val}}:</span>
            <span class="value">{{valFilter(1,key)}}</span>
            <span class="isdiff">{{getDifference(key)?'=====>':'======'}}</span>
            <span class="value">{{valFilter(2,key)}}</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TextOverTooltip from '../course/components/TextOverTooltip'
import { getuserApprDetail, getUserOldInfo } from '@/api/user'
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
      pitch: 1,
      dialogVisible:false,
      userOldData:{},
      currentRowData:{},
      userKeyData:{
        'name': "姓名",
        'sex': '性别',
        'phonenum': "手机号码",
        'birthDate':'出生日期',
        'email': "邮箱",
        'idNo': "身份证号",
        'entryDate': "入职日期",
        'position': "岗位",
        'roleName': "角色",
        'orgName': "组织",
        'post': "职务",
        'positionTitle': "职称",
        'postLevel': "职级",
        'leaderName': "直接领导",
        'userRemark':'备注'
      }
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
    valFilter(type,key){
      let data = type===1?this.userOldData:this.currentRowData
      if(key==='sex'){
        return data[key]? (data[key]=== '1' ? '男':'女') : ''
      }
      return data[key] || ''
    },
    getOperatetype(data){
      return {'update':'修改数据','add':'新增数据','delete':'删除','import':'导入','updateDept':'修改部门','register':'注册'}[this.currentRowData.operateType]
    },
    getDifference(key){
      return this.userOldData[key] !== this.currentRowData[key]
    },
    async handleClick(obj){
      this.dialogVisible = true
      obj.sex
      this.currentRowData = obj

      await getUserOldInfo({userId:obj.userId}).then(res=>{
        this.userOldData = res
      })
    },
    //获取旧的信息

    // 获取信息
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
.dialog{
  .type{
    margin-bottom: 20px;
  }
  .red{
    color: red;
  }
  .item{
    display: flex;
    line-height: 25px;
     .label{
      width: 60px;
      display: inline-block;
      text-align: right;
      margin-right: 20px;
    }
    .isdiff{
      width: 60px;
    }
    .value{
      flex:1
    }
  }
}
</style>
