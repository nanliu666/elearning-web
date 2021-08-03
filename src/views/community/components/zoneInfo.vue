<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
    >
      <el-row
        type="flex"
        justify="center"
      >
        <el-col :span="10">
          <el-form-item
            label="专区名称"
            prop="name"
          >
            <el-input
              v-model="form.name"
              placeholder="请输入"
              maxlength="30"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" />
        <el-col :span="10">
          <el-form-item
            label="专区发帖规则"
            prop="postRule"
          >
            <el-select
              v-model="form.postRule"
              placeholder="请选择"
            >
              <el-option
                :value="0"
                label="自动通过"
              ></el-option>
              <el-option
                :value="1"
                label="人工审核"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col :span="10">
          <el-form-item
            label="专区头像"
            prop="headImg"
          >
            <common-upload
              class="upload-demo"
              drag
              :multiple="false"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              @getValue="zonelogoSuc"
            >
              <i class="iconfont iconimage_icon_export"></i>
              <p class="upload">
                <span> 点击或者拖拽附件到此区域</span>
                <span>
                  上传的图片格式要求jpg、jpeg、bmp、png， 大小不超过10M，推荐比例150*150
                </span>
              </p>
              <img
                v-if="form.headImg"
                :src="form.headImg"
                class="avatar"
              />
            </common-upload>
          </el-form-item>
        </el-col>
        <el-col :span="2" />
        <el-col :span="10">
          <el-form-item
            label="专区封面"
            prop="coverPic"
          >
            <common-upload
              class="upload-demo"
              drag
              :multiple="false"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              @getValue="coverSuc"
            >
              <i class="iconfont iconimage_icon_export"></i>
              <p class="upload">
                <span style="font-size: 16px; padding: 0 40px"> 点击或者拖拽附件到此区域</span>
                <span style="font-size:12px;padding;0 30px;">
                  上传的图片格式要求jpg、jpeg、bmp、png， 大小不超过10M，推荐比例比例1200*160
                </span>
              </p>
              <img
                v-if="form.coverPic"
                :src="form.coverPic"
                class="avatar"
              />
            </common-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col :span="22">
          <el-form-item
            label="专区介绍"
            prop="introduce"
          >
            <el-input
              v-model="form.introduce"
              maxlength="200"
              type="textarea"
              placeholder="请输入"
              :rows="4"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col :span="10">
          <el-form-item prop="managerId">
            <template #label>
              <span style="padding-right: 7px">专区管理员</span>
              <el-tooltip
                effect="dark"
                placement="top-start"
              >
                <div slot="content">
                  专区管理员默认可以看到专区，无论是否在关联人员中
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>

            <el-select
              v-model="form.managerId"
              v-loadmore="loadMore"
              popper-class="zone_el_select"
              multiple
              placeholder="请选择"
              filterable
              remote
              :remote-method="remoteMethod"
              @visible-change="visibleChange"
            >
              <el-option
                v-for="item in managerOptions"
                :key="item.userId"
                :label="item.name"
                :value="item.userId"
              >
              </el-option>

              <el-option
                v-show="valve"
                value="1"
                class="loading"
              >
                <i class="el-icon-loading"></i>加载中
              </el-option>
              <el-option
                v-show="noData"
                value="1"
                class="ending"
              >
                {{ managerOptions.length === 0 ? '无数据' : '到底了' }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" />
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getOrgTreeSearch } from '@/api/community/zone'
export default {
  name: 'ZoneInfo',
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload')
  },
  props: {
    form: {
      required: true,
      type: Object
    },
    rules: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      managerOptions: [],
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        orgId: 0,
        search: ''
      },
      valve: false,
      noData: false
    }
  },
  watch: {
    'form.managerList'(val) {
      val.forEach((item) => {
        this.managerOptions.push({
          name: item.bizName,
          userId: item.bizId
        })
      })
    }
  },
  created() {
    this.getAdminList()
  },
  methods: {
    visibleChange(show) {
      if (show && this.queryParams.search) {
        this.queryParams.search = ''
        this.getAdminList()
      }
    },
    loadMore() {
      if (this.valve || this.noData) return
      this.valve = true
      this.queryParams.pageNo += 20
      this.getAdminList()
    },
    async getAdminList() {
      const res = await getOrgTreeSearch(this.queryParams)
      this.managerOptions.push(...res.data)
      this.managerOptions = _.unionBy(this.managerOptions, 'userId')
      this.valve = false
      if (res.data.length === 0) return (this.noData = true)
      else this.noData = false
    },
    remoteMethod(v) {
      this.queryParams.search = v.trim()
      this.queryParams.pageSize = 20
      this.queryParams.pageNo = 1
      this.managerOptions = []
      this.getAdminList()
    },
    // 图片上传前格式校验
    beforeAvatarUpload(file) {
      const regx = /^.*\.(jpg|jpeg|bmp|png)$/
      const isLt10M = file.size / 1024 / 1024 <= 10
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!')
        return false
      }
      if (!regx.test(file.name.toLowerCase())) {
        this.$message.error('上传图片只支持jpg、jpeg、bmp、png文件')
        return false
      }
    },
    // 上传成功后的回调
    coverSuc(file) {
      this.form.coverPic = file[0].fileUrl
      this.$refs.form.validateField('coverPic')
    },
    zonelogoSuc(file) {
      this.form.headImg = file[0].fileUrl
      this.$refs.form.validateField('headImg')
    },
    // 表单验证
    validateForm() {
      return this.$refs.form.validate()
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-demo {
  padding-right: 10px;
  position: relative;
  .upload {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .avatar {
    position: absolute;
    top: 0;
    left: 0;
  }
}
.avatar {
  width: 380px;
  height: 178px;
}
/deep/.el-select {
  width: 350px;
}
/deep/.el-form-item__label {
  float: none;
}
/deep/.el-upload__tip {
  line-height: normal;
}
/deep/ .el-upload-dragger {
  border: 1px solid #d9dbdc;
  border-radius: 4px;
  width: 380px;
  height: 178px;
  padding-top: 36px;
  i {
    font-size: 32px;
  }
  p {
    margin-top: 8px;
  }
}

.upload {
  line-height: normal;
  span:first-of-type {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.65);
    letter-spacing: 0;
    text-align: center;
    line-height: 22px;
  }
  span:last-of-type {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: rgba(0, 11, 21, 0.25);
    text-align: center;
    line-height: 18px;
    padding: 0 71px;
  }
}
</style>
<style lang="scss">
.zone_el_select {
  .el-select-dropdown__wrap.el-scrollbar__wrap {
    height: 100%;
    overflow-y: auto;
    margin-right: 0 !important;
  }
  .el-scrollbar__bar.is-vertical {
    display: none;
  }
  /*定义滚动条样式（高宽及背景）*/
  ::-webkit-scrollbar {
    width: 7px;
  }
  /*定义滑块 样式*/
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    height: 50px;
    background-color: #ccc;
  }
  .loading {
    text-align: center;
    color: #ccc;
    pointer-events: none;
    i {
      margin-right: 10px;
    }
  }
  .ending {
    text-align: center;
    color: #ccc;
    pointer-events: none;
  }
}
</style>
