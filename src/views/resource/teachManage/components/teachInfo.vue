<template>
  <div class="teach-Info">
    <div class="teach-head">
      <el-avatar
        :size="56"
        :src="teachInfo.userPic || circleUrl"
      ></el-avatar>
    </div>
    <div class="teach-intro">
      <el-row :gutter="20">
        <el-col>
          <div class="teach-intro-name">
            {{ teachInfo.tutorName
            }}<span>{{ teachInfo.workNo ? '（' + teachInfo.workNo + '）' : '' }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <label class="work-label">性别：</label>
          <span class="work-content">{{ teachInfo.sex == '0' ? '女' : '男' }}</span>
        </el-col>
        <el-col :span="6">
          <label class="work-label">出生日期：</label>
          <span class="work-content">{{ teachInfo.birthDate || '--' }}</span>
        </el-col>
        <el-col :span="6">
          <label class="work-label">所在部门：</label>
          <span class="work-content">{{ teachInfo.orgName || '--' }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <label class="work-label">岗位：</label>
          <span class="work-content">{{ teachInfo.positionName || '--' }}</span>
        </el-col>
        <el-col :span="6">
          <label class="work-label">职称：</label>
          <span class="work-content">{{ teachInfo.professionalName || '--' }}</span>
        </el-col>
        <el-col :span="6">
          <label class="work-label">本岗位工作年限：</label>
          <span class="work-content">{{ teachInfo.workYear || '--' }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <label class="work-label">上年度绩效：</label>
          <span class="work-content">{{ teachInfo.lastYearPerformance || '--' }}</span>
        </el-col>
        <el-col :span="6">
          <label class="work-label">毕业院校：</label>
          <span class="work-content">{{ teachInfo.graduateSchool || '--' }}</span>
        </el-col>
        <el-col :span="6">
          <label class="work-label">专业：</label>
          <span class="work-content">{{ teachInfo.major || '--' }}</span>
        </el-col>
        <el-col :span="6">
          <label class="work-label">学历：</label>
          <span class="work-content">{{ teachInfo.qualification || '--' }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="teach-btn">
      <el-button
        v-p="TEACH_EDIT"
        size="small"
        @click="handleEdit"
      >
        编辑
      </el-button>
      <el-button
        v-p="TEACH_DEL"
        size="small"
        @click="handleDel"
      >
        删除
      </el-button>
    </div>
  </div>
</template>

<script>
import { deleteTutor } from '@/api/resource/teach'
import { TEACH_EDIT, TEACH_DEL } from '@/const/privileges'
export default {
  name: 'TeachInfo',
  components: {},
  props: {
    teachInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  computed: {
    TEACH_EDIT: () => TEACH_EDIT,
    TEACH_DEL: () => TEACH_DEL
  },
  methods: {
    handleEdit() {
      this.$router.push({
        path: '/resource/teachManage/teachNew',
        query: {
          operation: 'edit',
          id: this.teachInfo.idStr
        }
      })
    },
    handleDel() {
      this.$confirm('确定要删除该导师吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteTutor({ ids: this.teachInfo.idStr }).then(() => {
            this.$message.success('删除成功')
            this.$emit('on-del-teach')
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.teach-Info {
  display: flex;
  position: relative;
  .teach-head {
    margin-top: 10px;
  }
  /deep/.el-col {
    display: flex;
    margin-bottom: 16px;
  }
  .work-label {
    color: #aaa;
  }
  .work-content {
    flex: 1;
    word-break: break-all;
  }
  .teach-intro {
    flex: 1;
    margin: 0 20px;
    .teach-intro-name {
      font-size: 20px;
      font-weight: 600;
      span {
        color: #aaa;
        font-size: 16px;
        font-weight: normal;
      }
    }
  }
  .teach-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
