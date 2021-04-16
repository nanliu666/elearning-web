<template>
  <div class="questionnaire-arrange">
    <div class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="7">
          <el-button icon="el-icon-arrow-left" type="text" style="margin-left: 5px; font-size: 15px;" class="colorGrey" @click="$router.back()" >返回</el-button>
        </el-col>
        <el-col :span="4">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center;"><el-button icon="el-icon-edit-outline" type="text" style="font-size: 15px;" :class="{colorGrey: step == 2}" @click="handleStepChange(1)">基本信息</el-button></el-col>
            <el-col style="text-align: center;"><el-button icon="el-icon-setting" type="text" style="font-size: 15px;"  :class="{colorGrey: step == 1}" @click="handleStepChange(2)">添加人员</el-button></el-col>
          </el-row>
        </el-col>
        <el-col :span="7">
          <el-row style="text-align: right">
            <el-button v-show="step == '2'" @click="handleStepChange(1)" size="medium">上一步</el-button>
            <el-button type="primary" v-show="step == 2" size="medium" @click="publish" :loading="publishLoading">发布</el-button>
            <el-button type="primary" v-show="step == 1" @click="handleStepChange(2)" size="medium">下一步</el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <div class="body">
        <el-form :model="form" :rules="rules" ref="form" class="form" label-position="top" v-show="step == 1">
            <el-form-item label="问卷安排名称" prop="planName" class="half-form-item" style="margin-right: 10%;">
              <el-input v-model="form.planName" placeholder="请输入" clearable=""></el-input>
            </el-form-item>
            <el-form-item label="所在分类" prop="categoryId" class="half-form-item">
              <tree-selector
                style="width: 100%;"
                class="selector"
                :options="selectorData"
                placeholder="请选择所在分类"
                :props="seletorProps"
                :value="form.categoryId"
                @change="handleTreeSelectChange"
              />
            </el-form-item>

            <el-form-item label="发布时间" prop="publishTime" class="half-form-item" style="margin-right: 10%;">
              <el-date-picker
                  style="width: 100%;"
                  v-model="form.publishTime"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptionsStart"
                  @change="publishTimeChange"
                  placeholder="发布时间" />
            </el-form-item>
            <el-form-item label="截止时间" prop="endTime" class="half-form-item">
              <el-date-picker
                  style="width: 100%;"
                  v-model="form.endTime"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptionsEnd"
                  @change="endTimeChange"
                  placeholder="截止时间" />
            </el-form-item>

            <el-form-item label="关联问卷" prop="subjectId" class="half-form-item" style="margin-right: 10%;">
                <el-select v-model="form.subjectId" placeholder="请选择" style="width: 100%;" v-el-select-loadmore="loadmoreSubject" :loading="subjectLoading" @change="handleSubjectChange">
                  <el-option
                    v-for="item in subjectOptions"
                    :key="item.id"
                    :label="item.asqName"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="问卷积分" prop="asqScore" class="half-form-item">
              <el-input-number :min="0" type="number" controls-position="right" style="width: 100%;" placeholder="请输入" v-model="form.asqScore"/>
            </el-form-item>
        </el-form>

        <div class="person-table" v-show="step == 2">
          <div class="table-header">
          <div>
            <div v-if="multipleSelection.length">
              <span>{{ `已选中${multipleSelection.length}项` }}</span>
              <span
                style="
                  display: inline-block;
                  width: 1px;
                  height: 1em;
                  margin: 0 8px;
                  vertical-align: middle;
                  background-color: #dcdfe6;
                "
              ></span>
              <el-button
                type="text"
                style="padding: 0"
                @click="() => handleDeletePerson()"
              >
                批量删除
              </el-button>
            </div>

          </div>
            <el-button size="medium" type="primary" @click="userPickerVisible = true">添加人员</el-button>
          </div>

          <el-table @selection-change="handleSelectionChange" :data="currentPersonList" align="center" header-align="center">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名">
            </el-table-column>
            
            <el-table-column
              prop="phonenum"
              label="手机号码">
            </el-table-column>

            <el-table-column
              prop="department"
              label="所属组织">
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDeletePerson(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
            
          <pagination
            :total="personList.length"
            :page.sync="page.pageNo"
            :limit.sync="page.pageSize"
          ></pagination>

        </div>
    </div>

    <user-picker
      :value="personList"
      :visible.sync="userPickerVisible"
      @input="handleSelectPerson"
    />

    <el-dialog
      :visible.sync="dialogVisible"
      class="finally-dialog"
      :show-close="false"
      destroy-on-close
      @close="confirm"
      width="550px">
      <div slot="title" class="dialog-title">问卷链接和二维码</div>
      <div class="dialog-content">
        <div class="code-wrapper">
          <div class="code" ref="code"></div>
        </div>

        <div class="content-r">
          <div class="url">
            <el-input placeholder="请输入内容" v-model="href" readonly>
              <el-button slot="append" type="primary">复制</el-button>
            </el-input>
          </div>
          <el-button class="downlod-btn" size="medium" type="default" @click="handleCodeDownload">下载二维码</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="dialogVisible = false">我知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryCategoryOrgList } from '@/api/resource/classroom'
import TreeSelector from '@/components/tree-selector'
import UserPicker from '@/components/user-picker/userPicker2'
import Pagination from '@/components/common-pagination'
import { save, update, saveQuery, querySubject } from '@/api/questionnaire'
import QRCode from 'qrcodejs2'
const CODE_HEIGHT = 86
const CODE_WIDTH = 86
const CODE_NAME = '问卷二维码'

export default {
  name: 'questionnaire-arrange',

  directives: {
    'el-select-loadmore': {
        bind(el, binding) {
            // 获取element-ui定义好的scroll盒子
            const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
            SELECTWRAP_DOM.addEventListener('scroll', function () {
                /**
                * scrollHeight 获取元素内容高度(只读)
                * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
                * clientHeight 读取元素的可见高度(只读)
                * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
                * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
                */
                const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
                if (condition) {
                  binding.value();
                }
            });
        }
    }
  },
  components: {
    TreeSelector,
    UserPicker,
    Pagination
  },
  data() {
    return {
      step: '1',
      selectorData: [],
      subjectOptions: [],
      pickerOptionsStart: {},
      pickerOptionsEnd: {},
      getSubjectParams: {
        pageSize: 10,
        pageNo: 1
      },
      seletorProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      form: {
        planName: '',
        categoryId: '',
        publishTime: '',
        endTime: '',
        categoryName: '',
        subjectId: '',
        asqScore: ''
      },
      rules: {
        planName: [
          { required: true, message: '请输入问卷名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        publishTime: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择截止时间', trigger: 'change' }
        ],
        categoryId: [
          { required: true, message: '请选择所在分类', trigger: 'change' }
        ],
        subjectId: [
          { required: true, message: '请选择关联问卷', trigger: 'change' }
        ],
      },
      options: [],
      multipleSelection: [],
      page: {
        pageNo: 1,
        pageSize: 10
      },
      personList: [],
      userPickerVisible: false,
      href: '',
      dialogVisible: false,
      publishLoading: false,
      subjectLoading: false,
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getCategoryData()
    this.initData()
  },
  destroyed() {},
  computed: {
    currentPersonList() {
      const { pageSize: size, pageNo: no } = this.page
      return this.personList.slice(size * (no - 1), size * no)
    }
  },
  methods: {
    confirm() {
      this.$router.back()
    },
    handleSubjectChange(val) {
      const subject = this.subjectOptions.find(s => s.id == val)
      this.form.subjectName = subject.asqName
    },
    publishTimeChange() { // 限制开始时间
      this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
        disabledDate: (time) => {
          if (this.form.publishTime) {
            const publishTime = new Date(this.form.publishTime)
            return time.getTime() < publishTime.getTime()
          }
        }
      })
    },
    endTimeChange() { // 限制结束时间
      this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
        disabledDate: (time) => {
          if (this.form.endTime) {
            const endTime = new Date(this.form.endTime)
            return time.getTime() > endTime.getTime()
          }
        }
      })
    },  
    handleTreeSelectChange(data) {
      const { label, value } = data
      this.form.categoryName = label
      this.form.categoryId = value
    },
    handleCodeDownload() {
      var canvas = this.qrcode._el.children[0]
      var data = canvas.toDataURL().replace('image/png', 'image/octet-stream;') //获取二维码值，并修改响应头部。
      var saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      saveLink.href = data
      saveLink.download = `${CODE_NAME}.png`
      var event = document.createEvent('MouseEvents')
      event.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      )
      saveLink.dispatchEvent(event)
    },
    publish() {
      let api
      let tenantId = 'learn'
      try {
         tenantId = JSON.parse(localStorage.getItem('elearning-tenantId'))
         tenantId = tenantId.content
      } catch (e) {
      }
      const date = new Date()
      const $data = {
        tenantId,
        planCode: date.toISOString().replace(/\-|T|\:|\.|Z/g, ''),
      }
      if (this.id) {
        api = update
        $data.id = this.id
      } else {
        api = save
        $data.asqUrl = ''
      }

      Object.assign($data, this.form)
      $data.publishTime = $data.publishTime + ' 00:00:00'
      $data.endTime = $data.endTime + ' 00:00:00'
      $data.users = this.personList.map(person => {
        const { userId, name, phonenum, department = '' } = person
        return {
          userId,
          userName: name,
          userPhone: phonenum,
          userDeptStr: department
        } 
      })
      this.publishLoading = true
      api($data).then((res) => {
        if (!this.id) {
          this.href = window.location.origin + '/questionnaire/arrange?id='  + res
          this.dialogVisible = true
        } else {
          this.$message.success('操作成功')
          this.$router.back()
        }
      }).finally(() => {
        this.publishLoading = false
      })
    },
    initData() {
      if (this.id) {
        saveQuery({ id: this.id }).then(res => {
          const { users = [] } = res
          this.personList = users.map(user => {
            const { userName, userPhone, userDeptStr } = user
            return {
              name: userName,
              phonenum: userPhone,
              department: userDeptStr
            }
          })
          delete res.users
          Object.assign(this.form, res)
        })
      }
      this.querySubject()
    },
    loadmoreSubject() {
      this.getSubjectParams.pageSize++
      this.querySubject()
    },
    querySubject() {
      this.subjectLoading = true
       querySubject(this.getSubjectParams).then(res => {
         const { data = [] } = res
        this.subjectOptions = data
      }).finally(() => {
        this.subjectLoading = false
      })
    },
    handleStepChange(step) {
      if (this.step == 1) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.step = step;
          }
        })
        return
      }
      this.step = step
    },
    handleSelectPerson(list) {
      this.personList = list
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDeletePerson(target) {
      const list = this.personList
      if (target) {
        list.splice(list.findIndex(person => person.id === target.id), 1)
        return
      }
      this.personList = list.filter((person) => this.multipleSelection.indexOf(person) < 0)
    },
    getCategoryData() {
      queryCategoryOrgList({ source: 'questionnaire' }).then(res => {
        this.selectorData = res
      })
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.$nextTick(() => {
          const qrcode = this.qrcode = new QRCode(this.$refs.code, {
            width: CODE_WIDTH,
            height: CODE_HEIGHT
          })
          qrcode.makeCode(this.href)
        })
      }
    }
  }
}
</script>
<style lang="scss">
.questionnaire-arrange {
  .el-form--label-top .el-form-item__label {
    padding: 0;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .el-dialog__footer {
    text-align: center;
  }
}

</style>
<style lang="scss" scoped>
.questionnaire-arrange {
  display: flex;
  flex-direction: column;
  background-color: #FAFAFA;
  height: 100vh;
  overflow-y: scroll;
  .header {
    box-sizing: border-box;
    flex: 0 0 56px;
    padding: 0 24px;
    height: 56px;
    line-height: 56px;
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0 4px 4px 0 rgba(0,0,0,0.04), 0 8px 16px 4px rgba(0,0,0,0.04);
  }
  .body {
    flex: 1;
    background-color: #fff;
    margin: 15px 300px 25px;
    box-shadow: 0 2px 12px 0 rgba(0,61,112,0.08);
    border-radius: 4px;
    padding: 35px 120px;
    .half-form-item {
      display: inline-block;
      width: 45%;
    }

    .person-table {
      .table-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-bottom: 16px;
      }
    }
  }
  .colorGrey {
    color: rgba(0,11,21,0.65);
  }

  .finally-dialog {
    padding: 25px;
    .dialog-title {
      height: 68px;
      line-height: 68px;
      font-size: 18px;
      color: rgba(0,11,21,0.85);
      border-bottom: 1px solid #EBECED;
    }
    .dialog-content {
      display: flex;
      align-items: center;
      .code-wrapper {
        flex: 0 0 96px;
        width: 96px;
        height: 96px;
        margin-right: 24px;
        .code {
          padding: 5px;
          box-sizing: border-box;
          border: 1px solid #D9DBDC;
        }
      }
      .content-r {
        flex: 1;
        .url {
          margin-bottom: 24px;
        }
      }
    }
  }
}
</style>