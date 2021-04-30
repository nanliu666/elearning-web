<template>
  <div class="fill">
    <page-header
      title="课程申请"
      show-back
      :back="goBack"
    />
    <basic-container block>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xl="16"
          :lg="16"
          :md="18"
          :sm="20"
          :xs="22"
        >
          <common-form
            ref="form"
            :model="formData"
            :columns="columns"
          >
            <!-- <template slot="title1">
              <h3>基本信息</h3>
            </template>
            <template slot="title2">
              <h3>详细信息</h3>
            </template>
            <template slot="attachments">
              <common-upload
                v-model="uploadFileList"
                multiple
                :before-upload="beforeUpload"
                :limit="5"
                :on-exceed="onUploadExceed"
                :file-list="uploadFileList"
              >
                <div
                  slot="tip"
                  class="upload__tip"
                >
                  支持上传png、jpg、jpeg格式文件，单个文件大小＜5MB，最多5个文件
                </div>
                <template #default>
                  <el-button
                    size="medium"
                    :class="{ 'is-disabled': uploadFileList.length >= 5 }"
                    @click="handleUpload($event)"
                  >
                    上传
                  </el-button>
                  <ul
                    class="upload__files"
                    @click="handleUpload($event)"
                  >
                    <li
                      v-for="(item, index) in uploadFileList"
                      :key="index"
                    >
                      {{ item.localName }}
                      <i
                        class="el-icon-close"
                        @click.stop="handleRemoveAttachment(index)"
                      ></i>
                    </li>
                  </ul>
                </template>
              </common-upload>
            </template> -->
          </common-form>
          <div class="page-bottom">
            <el-button
              type="primary"
              size="medium"
              @click="handleSubmit('submit')"
            >
              提交
            </el-button>
            <el-button
              size="medium"
              @click="handleSubmit('cancel')"
            >
              取消
            </el-button>
          </div>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
// createUser, createNewWorkNo, editUser
import { checkUserInfo, createUser } from '@/api/personnel/roster'
import CommonForm from '@/components/common-form/commonForm.vue'
var checkPhonenum = (rule, value, callback) => {
  if (this.id) {
    callback()
    return
  }
  checkUserInfo({ phonenum: value })
    .then(() => {
      callback()
    })
    .catch(() => {
      callback(new Error('该手机号已存在'))
    })
}
const FORM_TABLE = [
  {
    prop: 'depart',
    itemType: 'select',
    label: '申请部门',
    required: true,
    rules: [{ required: true, message: '请选择申请部分', trigger: 'change' }],
    options: [
      { value: '选项1', label: '黄金糕' },
      { value: '选项2', label: '双皮奶' },
      { value: '选项3', label: '龙须面' }
    ]
  },
  {
    prop: 'courseNumber',
    itemType: 'select',
    label: '课程编号',
    offset: 4,
    required: true,
    rules: [{ required: true, message: '请选择课程编号', trigger: 'change' }],
    options: [
      { value: '选项1', label: '黄金糕' },
      { value: '选项2', label: '双皮奶' },
      { value: '选项3', label: '龙须面' }
    ]
  },
  {
    prop: 'courseName',
    itemType: 'select',
    label: '课程名称',
    rules: [{ required: true, message: '请选择课时名称', trigger: 'change' }],
    options: [
      { value: '选项1', label: '黄金糕' },
      { value: '选项2', label: '双皮奶' },
      { value: '选项3', label: '龙须面' }
    ]
  },
  {
    prop: 'courseIns',
    itemType: 'select',
    label: '课程讲师',
    offset: 4,
    required: true,
    rules: [{ required: true, message: '请选择课程讲师', trigger: 'change' }],
    options: [
      { value: '选项1', label: '黄金糕' },
      { value: '选项2', label: '双皮奶' },
      { value: '选项3', label: '龙须面' }
    ]
  },
  {
    prop: 'courseCate',
    itemType: 'select',
    label: '课程分类',
    required: true,
    rules: [{ required: true, message: '请选择课程分类', trigger: 'change' }],
    options: [
      { value: '选项1', label: '黄金糕' },
      { value: '选项2', label: '双皮奶' },
      { value: '选项3', label: '龙须面' }
    ]
  },
  {
    prop: 'allCourse',
    itemType: 'input',
    offset: 4,
    maxlength: 12,
    label: '总课时'
  },
  {
    prop: 'totolDollar',
    itemType: 'input',
    label: '总课酬',
    maxlength: 12
  },
  {
    prop: 'trainingObj',
    itemType: 'select',
    label: '培训对象',
    offset: 4,
    required: true,
    rules: [{ required: true, message: '请选择培训对象', trigger: 'change' }],
    options: [
      { value: '选项1', label: '黄金糕' },
      { value: '选项2', label: '双皮奶' },
      { value: '选项3', label: '龙须面' }
    ]
  },
  {
    prop: 'trainingTime',
    itemType: 'datePicker',
    label: '培训时间',
    pickerOptions: {
      disabledDate(time) {
        return time.getTime() > Date.now()
      }
    }
  },
  {
    prop: 'trainingSite',
    itemType: 'input',
    label: '培训地点',
    offset: 4,
    rules: [{ required: true, message: '请输入培训地点', trigger: 'blur' }]
  },

  {
    prop: 'trainingNum',
    itemType: 'inputNumber',
    label: '培训人数',
    min: 1,
    max: 1000,
    precision: 0,
    step: 1,
    required: true
  },
  {
    prop: 'trainObjectives',
    itemType: 'input',
    label: '培训目标',
    offset: 4,
    rules: [{ required: true, message: '请输入', trigger: 'blur' }]
  },
  {
    prop: 'proManager',
    itemType: 'select',
    label: '项目经理',
    rules: [{ required: true, message: '请输入邮箱', trigger: 'change' }],
    options: [
      { value: '选项1', label: '黄金糕' },
      { value: '选项2', label: '双皮奶' },
      { value: '选项3', label: '龙须面' }
    ]
  },
  {
    prop: 'phonenum',
    itemType: 'input',
    label: '联系方式',
    maxlength: 11,
    offset: 4,
    props: {
      onlyNumber: true
    },
    required: true,
    rules: [
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      { pattern: /^1[3456789]\d{9}$/, message: '手机号码不合法', trigger: 'blur' },
      { validator: checkPhonenum, trigger: 'blur' }
    ]
  }
]

import {
  ADD_EXAM_CATALOG,
  STOP_EXAM_CATALOG,
  AUTH_EXAM_CATALOG,
  EDIT_EXAM_CATALOG,
  DELETE_EXAM_CATALOG,
  ADD_GROUNP_EXAM_CATALOG
} from '@/const/privileges'
import { mapGetters } from 'vuex'
export default {
  name: 'CatelogManager',
  components: { CommonForm },
  data() {
    // var checkPhonenum = (rule, value, callback) => {
    //   if (this.id) {
    //     callback()
    //     return
    //   }
    //   checkUserInfo({ phonenum: value })
    //     .then(() => {
    //       callback()
    //     })
    //     .catch(() => {
    //       callback(new Error('该手机号已存在'))
    //     })
    // }
    // var checkEmail = (rule, value, callback) => {
    //   if (this.id) {
    //     callback()
    //     return
    //   }
    //   checkUserInfo({ email: value })
    //     .then(() => {
    //       callback()
    //     })
    //     .catch(() => {
    //       callback(new Error('该邮箱已存在'))
    //     })
    // }
    return {
      columns: FORM_TABLE,
      formData: {
        depart: '', //申请部门
        courseNumber: '', //课程编号
        courseName: '', //课程名称
        courseIns: '', //课程讲师
        courseCate: '', //课程分类
        allCourse: '', //总课时
        totolDollar: '', //总课酬
        trainingObj: '', //培训对象
        trainingTime: '', //培训时间
        trainingSite: '', //培训地点
        trainingNum: '', //培训人数
        trainObjectives: '', //培训目标
        proManager: '', //项目经理
        phonenum: '' //联系方式
      }
    }
  },
  computed: {
    ADD_EXAM_CATALOG: () => ADD_EXAM_CATALOG,
    STOP_EXAM_CATALOG: () => STOP_EXAM_CATALOG,
    AUTH_EXAM_CATALOG: () => AUTH_EXAM_CATALOG,
    EDIT_EXAM_CATALOG: () => EDIT_EXAM_CATALOG,
    DELETE_EXAM_CATALOG: () => DELETE_EXAM_CATALOG,
    ADD_GROUNP_EXAM_CATALOG: () => ADD_GROUNP_EXAM_CATALOG,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([
          STOP_EXAM_CATALOG,
          AUTH_EXAM_CATALOG,
          EDIT_EXAM_CATALOG,
          DELETE_EXAM_CATALOG,
          ADD_GROUNP_EXAM_CATALOG
        ])
      },
      deep: true
    }
  },
  activated() {},
  methods: {
    goBack() {
      this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
      this.$refs.form.clearValidate()
      this.$router.back(-1)
    },
    async handleSubmit(key) {
      if (key == 'submit') {
        await this.onSubmit()
      }
      this.goBack()
    },
    async onSubmit() {
      try {
        await this.$refs.form.validate()
      } catch (error) {
        this.$message.error('请完善信息')
        throw error
      }
      //entryUser: this.userId
      const params = { ...this.formData }
      this.loading = true
      let func = createUser
      try {
        await func(params)
        this.$message.success('创建成功')
        this.loading = false
        Object.assign(this.$data.form, this.$options.data().form)
      } catch (error) {
        this.loading = false
        throw error
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
  .el-menu {
    margin-bottom: 20px;
    margin-top: -10px;
  }
  /deep/ .el-menu--horizontal {
    border-bottom: 1px solid #cccccc !important;
  }
}
.originColumn {
  height: 25px;
}
.transitionBox {
  position: relative;
  height: 50px;
}

.searchBox {
  // position: absolute;
  // width: 100%;
  i {
    color: #a0a8ae;
    font-size: 18px;
  }
  .search-sort-box {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 10px;
    cursor: pointer;
    .sort-text {
      color: #a0a8ae;
      margin-left: 6px;
      font-size: 14px;
    }
    &::before {
      position: absolute;
      content: '';
      top: 3px;
      right: 0px;
      width: 0.5px;
      height: 80%;
      background-color: #a0a8ae;
    }
  }
  .table-search {
    display: flex;
    align-items: center;
    .search-list {
      flex: 1;
    }
  }
  .refresh-text {
    padding-left: 6px;
    display: inline-block;
    height: 18px;
    color: #a0a8ae;
  }
}

.search-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .upload-date {
    margin-right: 16px;
  }
  /deep/.require-form .el-form-item {
    padding: 0;
    margin: 0;
  }
}
</style>
