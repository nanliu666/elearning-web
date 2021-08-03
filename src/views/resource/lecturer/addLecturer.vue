<template>
  <div class="addLecturer">
    <div
      class="addLecturer_head"
      @click="toLecturer"
    >
      <i class="el-icon-arrow-left"></i>
      {{ $route.query.id ? '编辑讲师' : '创建讲师' }}
    </div>
    <div class="addLecturer_content">
      <div class="addLecturer_content_title">
        基础信息
      </div>

      <!-- 表单区域 -->
      <div class="addLecturer_form">
        <el-form
          id="ruleForm"
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          class="demo-ruleForm"
        >
          <!-- 第一行 -->
          <el-row>
            <el-form-item
              label="讲师类型"
              prop="teacherType"
            >
              <el-radio-group
                v-model="ruleForm.teacherType"
                @change="activeType"
              >
                <el-radio label="0">
                  内部讲师
                </el-radio>
                <el-radio label="1">
                  外部讲师
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <!-- 第二行 -->
          <el-row>
            <el-col :span="10">
              <el-form-item
                v-if="ruleForm.teacherType === '0'"
                label="讲师姓名"
                prop="userId"
              >
                <el-select
                  v-model="ruleForm.userId"
                  v-loadmore="loadMore"
                  placeholder="请选择"
                  filterable
                  remote
                  :remote-method="remoteMethod"
                  popper-class="lecturer_el_select"
                  @visible-change="visibleChange"
                >
                  <el-option
                    v-for="item in Teacherlist"
                    :key="item.userId"
                    :label="item.name"
                    :value="item.userId"
                  ></el-option>
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
                    {{ Teacherlist.length === 0 ? '无数据' : '到底了' }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-else
                label="讲师姓名"
                prop="userName"
              >
                <el-input
                  v-model="ruleForm.userName"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
            </el-col>
            <el-col :span="10">
              <el-form-item
                v-if="ruleForm.teacherType === '0'"
                label="性别"
              >
                <el-radio-group
                  v-model="ruleForm.sex"
                  :disabled="ruleForm.teacherType === '0'"
                >
                  <el-radio label="0">
                    女
                  </el-radio>
                  <el-radio label="1">
                    男
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-else-if="ruleForm.teacherType !== '0'"
                prop="sex"
                label="性别"
              >
                <el-radio-group
                  v-model="ruleForm.sex"
                  :disabled="ruleForm.teacherType === '0'"
                >
                  <el-radio label="0">
                    女
                  </el-radio>
                  <el-radio label="1">
                    男
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第三行 -->
          <el-row v-if="ruleForm.teacherType === '0'">
            <el-col :span="10">
              <el-form-item label="所在部门">
                <el-input
                  v-model="ruleForm.orgName"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
            <el-col :span="10">
              <el-form-item label="岗位">
                <el-input
                  v-model="ruleForm.positionName"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第四行 -->
          <el-row>
            <el-col :span="10">
              <el-form-item
                v-show="ruleForm.teacherType === '0'"
                label="联系方式"
              >
                <el-input
                  v-model="ruleForm.phoneNo"
                  maxlength="11"
                  :disabled="ruleForm.teacherType === '0'"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-show="ruleForm.teacherType !== '0'"
                label="联系方式"
                prop="phoneNo"
              >
                <el-input
                  v-model="ruleForm.phoneNo"
                  maxlength="11"
                  :disabled="ruleForm.teacherType === '0'"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
            <el-col :span="10">
              <el-form-item
                label="聘用类型"
                prop="type"
              >
                <el-select v-model="ruleForm.type">
                  <el-option
                    v-for="(item, index) in type"
                    :key="index"
                    :value="index + 1"
                    :label="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第五行 -->
          <el-row>
            <el-col :span="10">
              <el-form-item
                label="讲师聘期"
                prop="date"
              >
                <el-date-picker
                  v-model="ruleForm.date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
            <el-col :span="10">
              <el-form-item
                label="专业分类"
                prop="professionalCata"
              >
                <el-select v-model="ruleForm.professionalCata">
                  <el-option
                    v-for="(item, index) in professionalCata"
                    :key="index"
                    :value="`0${index + 1}`"
                    :label="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第六行 -->
          <el-row>
            <el-col :span="10">
              <el-form-item
                label="讲师等级"
                prop="teacherLevel"
              >
                <el-select v-model="ruleForm.teacherLevel">
                  <el-option
                    v-for="(item, index) in teacherLevelOption"
                    :key="index"
                    :value="`0${index}`"
                    :label="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
            <el-col :span="10">
              <el-form-item label="授课课时费">
                <el-input-number
                  v-model="ruleForm.courseCost"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  placeholder="请输入金额"
                  :max="999999"
                />
                <span class="yen">&yen;</span>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第七行 -->
          <el-row>
            <el-col :span="10">
              <el-form-item label="讲师职称">
                <el-select v-model="ruleForm.teacherTitle">
                  <el-option
                    v-for="(item, index) in teacherTitleOption"
                    :key="index"
                    :label="item"
                    :value="`0${index + 1}`"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
            <el-col :span="10">
              <el-form-item
                label="所属分类"
                prop="categoryId"
              >
                <span
                  class="categoryId"
                  @click="toClass"
                >分类管理</span>
                <el-select
                  v-model="ruleForm.categoryId"
                  :multiple-limit="10"
                  placeholder="请选择"
                >
                  <el-option
                    style="height: auto; padding: 0"
                    :value="ruleForm.categoryId"
                    :label="parentOrgIdLabel"
                  >
                    <el-tree
                      ref="orgTree"
                      :data="data"
                      node-key="id"
                      :props="{
                        children: 'children',
                        label: 'name'
                      }"
                      @node-click="handleOrgNodeClick"
                    />
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第八行 -->
          <el-row>
            <el-col :span="10">
              <el-form-item
                label="聘书编号"
                filterable
                @input.native="inputCard"
              >
                <el-select v-model="ruleForm.certNo">
                  <el-option
                    v-for="(item, index) in certNo"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
            <el-col :span="10">
              <el-form-item label="擅长领域">
                <div class="skilledField">
                  <el-tag
                    v-for="(tag, index) in ruleForm.skilledField"
                    :key="index"
                    closable
                    :disable-transitions="false"
                    @close="removeTabs(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                  <div class="add">
                    <el-input
                      v-if="inputVisible"
                      ref="saveTagInput"
                      v-model="inputValue"
                      class="input-new-tag"
                      size="small"
                      autofocus
                      maxlength="10"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button
                      :disabled="ruleForm.skilledField.length >= 5"
                      size="medium"
                      @click="addSkilledField"
                    >
                      +&nbsp;&nbsp;&nbsp;添加
                    </el-button>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="是否推荐">
                <el-switch
                  v-model="ruleForm.isRecommend"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第九行 -->
          <el-row>
            <el-col :span="10">
              <el-form-item label="讲师照片">
                <common-upload
                  class="upload-demo"
                  drag
                  :multiple="false"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  @getValue="onSuccess"
                >
                  <i class="el-icon-upload"></i>
                  <p class="upload">
                    <span style="font-size: 16px; padding: 0 40px"> 点击或者拖拽附件到此区域</span>
                    <span style="font-size:12px;padding;0 30px;">
                      上传的图片格式要求jpg、jpeg、bmp、png， 大小不超过5M</span>
                  </p>
                  <img
                    v-if="ruleForm.attachments[0].fileUrl"
                    :src="ruleForm.attachments[0].fileUrl"
                    class="avatar"
                  />
                </common-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="editorTitle">
            <el-form-item
              label="详细介绍"
              prop="introduction"
            >
              <tinymce v-model="ruleForm.introduction" />
              <span
                v-if="!ruleForm.introduction"
                class="introduction"
              >可为讲师添加教育经验、获奖情况、专业特长等详细介绍</span>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="bottom_btns">
      <el-button
        type="primary"
        size="medium"
        @click="isAddTeacher(1)"
      >
        完成
      </el-button>
      <el-button
        size="medium"
        @click="isAddTeacher(0)"
      >
        完成并继续添加
      </el-button>
    </div>
  </div>
</template>

<script>
import { addTeacher, queryTeacherlist, getTeacher, cardNum } from '@/api/lecturer/lecturer'
import { queryCategoryOrgList } from '@/api/resource/classroom'

export default {
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload')
  },
  data() {
    return {
      parentOrgIdLabel: '',
      props: {
        value: 'id',
        label: 'name',
        isLeaf: (data, node) => {
          if (node.level === 2 || data.label == '未分类') {
            return true
          }
        }
      },
      //创建失败保存讲师介绍
      text: '',
      ruleFormClone: null,
      Teacherlist: [], //讲师的数据
      data: [], //分类列表
      checkboxVal: [],
      // 添加标签
      options: [],
      // 讲师等级选项
      teacherLevelOption: [
        '预备级',
        '助理级',
        '初级',
        '中级',
        '高级',
        '资深级',
        '专家级',
        '非讲师'
      ],
      // 讲师职称选项
      teacherTitleOption: ['助理级', '初级', '中级', '高级', '研究员级', '无'],
      //聘用形式
      type: ['内训', '外聘'],
      //专业类型
      professionalCata: ['技术类', '管理类', '营销类', '技能类'],
      //证书编号集
      certNo: [],
      // 添加擅长领域input框是否显示
      inputVisible: false,
      inputValue: '',
      // 填写课程信息
      ruleForm: {
        teacherType: '0',
        courseCost: 0,
        userId: '',
        userName: '',
        phoneNo: '',
        orgName: '',
        positionName: '',
        teacherTitle: '',
        sex: '',
        type: 1,
        professionalCata: '',
        teacherLevel: '',
        hireStartTime: '',
        hireEndTime: '',
        certNo: '',
        isRecommend: '',
        introduction: '',
        date: '',
        categoryId: '',
        skilledField: [],
        timer: null,
        attachments: [
          {
            fileUrl: ''
          }
        ]
      },
      rules: {
        teacherType: [{ required: true, message: '请选择讲师类型', trigger: 'change' }],
        userId: [{ required: true, message: '请选择讲师', trigger: 'change' }],
        userName: [{ required: true, message: '请输入讲师姓名', trigger: 'blur' }],
        phoneNo: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (
                /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
                  value
                )
              ) {
                callback()
              } else {
                callback(new Error('手机号格式错误'))
              }
            },
            trigger: 'blur'
          }
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        orgName: [{ required: true, message: '请输入部门', trigger: 'blur' }],
        positionName: [{ required: true, message: '请输入岗位', trigger: 'blur' }],
        type: [{ required: true, message: '请选择聘用类型', trigger: 'change' }],
        professionalCata: [{ required: true, message: '请选择专业类型', trigger: 'change' }],
        categoryId: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
        teacherLevel: [{ required: true, message: '请选择聘用类型', trigger: 'change' }],
        certNo: [{ type: Number, message: '证书编号只能为数字', trigger: 'blur' }],
        date: [{ required: true, message: '请选择讲师聘期', trigger: 'change' }]
      },
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        search: ''
      },
      valve: false,
      noData: false
    }
  },
  watch: {
    'ruleForm.userId': {
      handler(n) {
        this.$nextTick(() => {
          this.$refs.ruleForm.validateField('userId', () => {})
        })
        this.Teacherlist.forEach((item, index) => {
          if (item.userId == n) {
            this.ruleForm.phoneNo = this.Teacherlist[index].phonenum
            this.ruleForm.sex = this.Teacherlist[index].sex
            this.ruleForm.orgName = this.Teacherlist[index].orgName
            this.ruleForm.positionName = this.Teacherlist[index].positionName
          }
        })
        if (n) {
          cardNum({ userId: this.ruleForm.userId }).then((res) => {
            this.certNo = res
          })
        }
      }
    },

    'ruleForm.type': {
      handler() {
        this.$nextTick(() => {
          this.$refs.ruleForm.validateField('type', () => {})
        })
      },
      immediate: false
    }
  },
  async created() {
    this.ruleFormClone = _.cloneDeep(this.ruleForm)
    await this.islistTeacherCategory()
    this.isqueryTeacherlist()
    if (this.$route.query.id) {
      this.getTeacher()
    }
  },
  methods: {
    visibleChange(show) {
      if (show && this.queryParams.search) {
        this.queryParams.search = ''
        this.isqueryTeacherlist()
      }
    },
    handleOrgNodeClick(data) {
      if (data !== undefined) {
        this.ruleForm.categoryId = data.id
        this.parentOrgIdLabel = data.name
      }
    },
    onSuccess(file) {
      this.ruleForm.attachments[0].fileUrl = file[0].fileUrl
    },
    activeType(type) {
      if (this.ruleForm.teacherType) {
        this.ruleForm = _.cloneDeep(this.ruleFormClone)
        this.ruleForm.teacherType = type
      }
      this.$nextTick().then(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    remoteMethod(v) {
      this.queryParams.search = v.trim()
      this.queryParams.pageSize = 20
      this.queryParams.pageNo = 1
      this.Teacherlist = []
      this.isqueryTeacherlist()
    },
    // 获取讲师数据
    getTeacher() {
      getTeacher({ id: this.$route.query.id }).then((res) => {
        for (const key in this.ruleForm) {
          if (res.teacherInfo[key]) {
            this.ruleForm[key] = res.teacherInfo[key]
          }
        }
        this.ruleForm.introduction = _.unescape(this.ruleForm.introduction)
        res.teacherInfo.photo && (this.ruleForm.attachments[0].fileUrl = res.teacherInfo.photo)
        this.ruleForm.teacherType = '0'
        res.teacherInfo.skilledField &&
          (this.ruleForm.skilledField = this.ruleForm.skilledField.split(','))
        if (res.teacherInfo.hire_start_time) {
          this.date[0] = res.teacherInfo.hire_start_time
        }
        if (res.teacherInfo.hire_start_time) {
          this.date[1] = res.teacherInfo.hire_start_time
        }
      })
    },

    // 查询讲师分类列表
    islistTeacherCategory() {
      queryCategoryOrgList({ source: 'teacher' }).then((res) => {
        this.data = res
      })
    },
    loadMore() {
      if (this.valve || this.noData) return
      this.valve = true
      this.queryParams.pageNo += 20
      this.isqueryTeacherlist()
    },
    // 查询创建讲师的数据
    isqueryTeacherlist() {
      queryTeacherlist(this.queryParams).then((res) => {
        this.Teacherlist.push(...res.data)
        this.valve = false
        if (res.data.length === 0) return (this.noData = true)
        else this.noData = false
      })
    },
    toClass() {
      this.$router.push('/resource/lecturer/classify')
    },
    // 跳转到讲师列表
    toLecturer() {
      this.$router.push('/resource/lecturer/lecturer')
    },
    // 创建讲师
    isAddTeacher(i) {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          this.$message({
            message: '信息填写不完整',
            type: 'warning'
          })
        } else {
          this.text = this.ruleForm.introduction
          this.ruleForm.introduction = _.escape(this.ruleForm.introduction)
          this.ruleForm.hireStartTime = this.ruleForm.date[0]
          this.ruleForm.hireEndTime = this.ruleForm.date[1]
          this.ruleForm.skilledField = this.ruleForm.skilledField.join(',')
          addTeacher(this.ruleForm)
            .then(() => {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              setTimeout(() => {
                this.$refs.ruleForm.clearValidate()
              }, 100)

              if (i == 1) this.toLecturer()
              this.ruleForm = _.cloneDeep(this.ruleFormClone)
              this.parentOrgIdLabel = ''
            })
            .catch(() => {
              this.ruleForm.introduction = this.text
              this.ruleForm.skilledField = this.ruleForm.skilledField.split(',')
            })
        }
      })
    },
    inputCard(e) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.ruleForm.certNo = e.target.value
      }, 500)
    },
    // 图片校验
    beforeAvatarUpload(file) {
      const regx = /^.*\.(jpg|jpeg|bmp|png)$/
      const isLt10M = file.size / 1024 / 1024 <= 5

      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传图片只支持jpg、jpeg、bmp、png文件')
        return false
      }
      return true
    },
    // 移除擅长领域
    removeTabs(tag) {
      this.ruleForm.skilledField.splice(this.ruleForm.skilledField.indexOf(tag), 1)
      this.ruleForm.skilledField.sort((a, b) => (a.length > b.length ? 1 : -1))
    },
    // 添加擅长领域
    addSkilledField() {
      this.inputVisible = true
    },
    handleInputConfirm() {
      if (this.inputValue.trim().length === 0) {
        this.inputValue = ''
        this.inputVisible = false
        return
      }
      this.ruleForm.skilledField.push(this.inputValue)
      this.inputValue = ''
      this.inputVisible = false
      this.ruleForm.skilledField.sort((a, b) => (a.length > b.length ? 1 : -1))
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-demo {
  padding-right: 10px;
  position: relative;
  .avatar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
.addLecturer {
  .addLecturer_head {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  .addLecturer_content {
    background-color: #fff;
    padding: 50px 100px;
  }
  .addLecturer_content_title {
    color: #333;
    font-size: 18px;
    font-weight: normal;
  }
  .addLecturer_form {
    padding: 30px 15%;
  }

  .bottom_btns {
    width: 100%;
    border-top: 1px solid #ccc;
    position: fixed;
    bottom: 0;
    height: 60px;
    box-shadow: 2px 2px 5px #000;
    background-color: #fff;
    padding: 15px 35%;
    z-index: 999999;
  }
  .skilledField {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    ::v-deep span.el-tag.el-tag--light {
      flex-shrink: 0;
      margin-right: 5px;
    }
    .add {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      ::v-deep .input-new-tag.el-input.el-input--small {
        width: 100px;
        margin-right: 5px;
      }
      ::v-deep button.el-button.el-button--default.el-button--medium {
        height: 32px;
      }
    }
  }
  .upload {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .categoryId {
    position: absolute;
    top: -42px;
    right: 0;
    color: #207efa;
    cursor: pointer;
  }
}
/deep/.el-input-number {
  width: 350px;
}
/deep/.el-input-number .el-input__inner {
  text-align: left;
}
/deep/.el-form-item__label {
  width: 350px;
  text-align: left;
}
/deep/.el-form-item__label {
  float: none;
}
/deep/.el-upload__tip {
  line-height: 0;
}
/deep/.el-select {
  width: 350px;
}
/deep/.el-input {
  width: 20vw;
}
::v-deep .el-upload-dragger {
  height: 100%;
  border: 1px solid #d9d9d9;
}
::v-deep .el-range-editor.el-input__inner {
  padding: 0 10px;
  width: 380px;
  span.el-range-separator {
    padding: 0;
  }
}
.introduction {
  position: absolute;
  top: 119px;
  left: 18px;
  z-index: 99999999;
  color: #dcdcdc;
}
.editorTitle {
  position: relative;
  .introduction {
    position: absolute;
    top: 158px;
    left: 18px;
    z-index: 99999999;
    color: #dcdcdc;
  }
}
.yen {
  position: absolute;
  top: 0px;
  left: 5px;
}
::v-deep span.el-input-number__decrease.is-disabled {
  bottom: 0px;
}
::v-deep span.el-input-number__increase {
  top: 0px;
}
::v-deep .el-input-number.is-controls-right {
  width: 20vw;
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
</style>
<style lang="scss" scoped>
.lecturer_el_select {
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
}
</style>
