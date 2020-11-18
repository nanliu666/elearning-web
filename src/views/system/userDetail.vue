<template>
  <div class="user">
    <page-header
      title="用户详情"
      show-back
    >
    </page-header>
    <div class="user-header">
      <div class="user-info">
        <div class="user-info__avatar">
          <img
            v-if="userData.avatarUrl"
            :src="userData.avatarUrl"
          />
          <i
            v-else
            class="icon-usercircle avatar"
          />
        </div>
        <div class="user-info__content">
          <div class="user-info__row">
            <span class="user-info__name">
              {{ userData.name }}
            </span>
            {{ userData.workNo ? `(${userData.workNo})` : '' }}
            <el-tag
              class="user-info__tag"
              :type="userData.userStatus === '1' ? '' : 'danger'"
            >
              {{ userData.userStatus === '1' ? '正常' : '冻结' }}
            </el-tag>
          </div>
          <div class="user-info__row">
            {{ (userData.sex === 0 ? '女' : '男') || '--' }}
            <span class="user-info__divider">|</span> {{ userData.birthDate || '--' }}
            <span class="user-info__divider">|</span>
            {{ _.map(userData.roles, 'roleName').join('/') }}
          </div>
          <div class="user-info__row">
            <span
              class="user-info__column"
            ><i class="el-icon-mobile" />{{ userData.phonenum || '暂无' }}</span>
            <span
              class="user-info__column"
            ><i class="el-icon-message" />{{ userData.email || '暂无' }}</span>
          </div>
        </div>
      </div>
      <div class="user-control">
        <el-button
          type="primary"
          size="medium"
          @click="handleEditRole()"
        >
          角色设置
        </el-button>
        <el-button
          style="margin-right:8px;"
          size="medium"
          @click="handleReset()"
        >
          密码重置
        </el-button>
        <el-dropdown @command="(command) => handleCommand(command)">
          <el-button
            size="medium"
            style="margin-left: 10px"
            class="el-dropdown-link"
          >
            更多<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="edit">
              编辑
            </el-dropdown-item>
            <el-dropdown-item
              v-if="userData.userStatus === '1'"
              command="suspend"
            >
              冻结
            </el-dropdown-item>
            <el-dropdown-item
              v-if="userData.userStatus === '2'"
              command="unsuspend"
            >
              解冻
            </el-dropdown-item>
            <el-dropdown-item command="delete">
              删除
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <basic-container block>
      <el-tabs>
        <el-tab-pane
          class="user-detail"
          label="详细信息"
        >
          <div
            v-for="item in columns"
            :key="item.prop"
            class="user-detail__item"
          >
            <div class="user-detail__label">
              {{ item.label }}
            </div>
            <div class="user-detail__value">
              <span>{{
                (item.formatter ? item.formatter(userData) : userData[item.prop]) || '--'
              }}</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="附件"
          class="user-attachment"
        >
          <div
            v-for="(item, index) in userData.attachment"
            :key="index"
            class="user-attachment__item"
          >
            <div class="user-attachment__img">
              <img :src="item.url" />
              <div class="user-attachment__cover">
                <div class="user-attachment__cover--column">
                  <span @click="viewPicture(item)">
                    <i class="el-icon-view"></i>
                    预览
                  </span>
                </div>
                <div class="user-attachment__cover--column">
                  <span>
                    <a
                      :href="item.url"
                      :download="item.name"
                      target="_blank"
                    >
                      <i class="el-icon-download"></i>
                      下载
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div class="user-attachment__text">
              {{ item.name }}
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
    <image-viewer
      :visible.sync="viewing"
      :url-list="viewingUrls"
    />
    <user-role-edit
      ref="userRoleEdit"
      :visible.sync="editVisible"
      :user="userData"
      @after-submit="getData"
    />
  </div>
</template>

<script>
import { getStaffBasicInfo } from '@/api/personalInfo'
import { modifyUserStatus, resetPwd, delUser } from '@/api/system/user'
import ImageViewer from '@/components/image-viewer/ImageViewer'
export default {
  name: 'UserDetail',
  components: {
    // 员工角色编辑
    userRoleEdit: () => import('./components/userRoleEdit'),
    ImageViewer
  },
  data() {
    return {
      loading: false,
      viewing: false,
      viewingUrls: [],
      editVisible: false,
      userData: {
        attachment: []
      },
      columns: [
        {
          label: '所在部门',
          prop: 'orgName'
        },
        {
          label: '直接领导',
          prop: 'leaderName'
        },
        {
          label: '岗位',
          prop: 'position'
        },
        {
          label: '职级',
          prop: 'job'
        },
        {
          label: '职务',
          prop: 'job1'
        },
        {
          label: '职称',
          prop: 'job2'
        },
        {
          label: '入职日期',
          prop: 'entryDate'
        },
        {
          label: '允许IP范围',
          prop: 'IP'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    }
  },

  computed: {
    userId() {
      return this.$route.query.userId
    }
  },
  watch: {},
  mounted() {},
  activated() {
    this.getData()
  },
  methods: {
    getData() {
      if (!this.userId) {
        return
      }
      getStaffBasicInfo({ userId: this.userId }).then((res) => {
        this.userData = res
      })
    },
    viewPicture(item) {
      this.viewingUrls = [item.url]
      this.viewing = true
    },
    handleEditRole() {
      this.$refs['userRoleEdit'].init(this.userData)
    },
    handleReset() {
      this.$confirm('确定将选择账号密码重置为123456?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.resetPwd(this.userData.userId)
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
    },
    resetPwd(ids) {
      resetPwd(ids).then(() => {
        this.getData()
      })
    },
    handleCommand(command) {
      switch (command) {
        case 'suspend':
          this.modifyUserStatus(this.userData.userId, '2')
          break
        case 'unsuspend':
          this.modifyUserStatus(this.userData.userId, '1')
          break
        case 'edit':
          this.$router.push({ path: '/system/editUser', query: { userId: this.userData.userId } })
          break
        case 'delete':
          this.handleDeleteUser()
          break
      }
    },
    modifyUserStatus(userId, status) {
      let msg = ''
      if (status === '2') {
        msg = '您确定要冻结该用户吗？\n冻结后，该用户将不能登录系统'
      } else {
        msg = '您确定要解冻该用户吗？'
      }
      this.$confirm(msg, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => modifyUserStatus(userId, status))
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getData()
        })
    },
    handleDeleteUser() {
      this.$confirm('您确定要删除该用户吗？\n删除后将不能恢复', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => delUser({ userId: this.userData.userId }))
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.goBack()
        })
    },
    goBack() {
      this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  height: 100%;
}
.user-header {
  display: flex;
  justify-content: space-between;
  background: #fff;
  margin-bottom: 20px;
  padding: 24px;
  .user-info {
    width: 50%;
    padding-top: 0;
    display: flex;
    &__tag {
      height: 24px;
      line-height: 24px;
      margin-top: 5px;
      margin-left: 30px;
    }
    &__avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      i {
        font-size: 62px;
        color: #e3e7e9;
      }
    }
    &__content {
    }
    &__row {
      line-height: 34px;

      i {
        font-size: 16px;
        margin-right: 6px;
      }
    }
    &__column {
      margin-right: 12px;
    }
    &__name {
      font-weight: bold;
      font-size: 18px;
    }
    &__divider {
      margin: 0 12px;
      color: #e3e7e9;
    }
  }
}
.basic-container--block {
  height: calc(100% - 171px - 92px);
  min-height: calc(100% - 171px - 92px);
}
.user-detail {
  display: flex;
  flex-wrap: wrap;
  padding-top: 20px;
  &__item {
    width: 50%;
    display: flex;
    align-items: center;
    padding: 10px 0;
  }
  &__label {
    width: 50%;
    text-align: right;
    padding-right: 10px;
  }
  &__value {
    width: 50%;
    text-align: left;
    padding-left: 10px;
  }
}
.user-attachment {
  &__cover {
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: #0006;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  &__cover--column {
    flex: 1;
    color: #fff;
    text-align: center;
    span {
      cursor: pointer;
      a {
        color: #fff;
      }
    }
  }

  &__item {
    margin: 20px;
    border-radius: 4px;
    width: 190px;
    height: 124px;
    &:hover {
      .user-attachment__cover {
        display: flex;
      }
    }
  }
  &__img {
    width: 190px;
    height: 88px;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
    }
  }

  &__text {
    border: 1px solid #e3e7e9;
    border-top: none;
    height: 36px;
    line-height: 34px;
    padding-left: 6px;
    background-color: #fbfdff;
    border-radius: 0px 0px 6px 6px;
  }
}
</style>
