<template>
  <div class="questionnaire-arrange">
    <div class="header">
      <el-row
        type="flex"
        justify="space-between"
      >
        <el-col :span="7">
          <el-button
            icon="el-icon-arrow-left"
            type="text"
            style="margin-left: 5px; font-size: 15px;"
            class="colorGrey"
            @click="$router.back()"
          >
            返回
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-row
            type="flex"
            justify="center"
          >
            <el-col style="text-align: center;">
              <el-button
                icon="el-icon-edit-outline"
                type="text"
                style="font-size: 15px;"
                :class="{ colorGrey: step == 2 }"
                @click="handleStepChange(1)"
              >
                基本信息
              </el-button>
            </el-col>
            <el-col style="text-align: center;">
              <el-button
                icon="el-icon-setting"
                type="text"
                style="font-size: 15px;"
                :class="{ colorGrey: step == 1 }"
                @click="handleStepChange(2)"
              >
                添加人员
              </el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="7">
          <el-row style="text-align: right">
            <el-button
              v-show="step == 2"
              size="medium"
              @click="handleStepChange(1)"
            >
              上一步
            </el-button>
            <!-- <el-button
              v-show="step == 2"
              type="default"
              size="medium"
              :loading="publishLoading1"
              @click="publish(1)"
            >
              存草稿
            </el-button> -->
            <el-button
              v-show="step == 2"
              type="primary"
              size="medium"
              :loading="publishLoading0"
              @click="publish(0)"
            >
              发布
            </el-button>
            <el-button
              v-show="step == 1"
              type="primary"
              size="medium"
              @click="handleStepChange(2)"
            >
              下一步
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <div class="body">
      <el-form
        v-show="step == 1"
        ref="form"
        :model="form"
        :rules="rules"
        class="form"
        label-position="top"
      >
        <el-form-item
          label="问卷安排名称"
          prop="planName"
          class="half-form-item"
          style="margin-right: 160px;"
        >
          <el-input
            v-model="form.planName"
            placeholder="请输入"
            clearable=""
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="categoryId"
          class="half-form-item category-form-item"
        >
          <div
            slot="label"
            class="category-header"
          >
            <span class="label-name">所在分类</span>

            <el-button
              type="text"
              @click.native="toCategory"
            >
              分类管理
            </el-button>
          </div>
          <tree-selector
            style="width: 100%;"
            class="selector"
            :options="selectorData"
            placeholder="请选择所在分类"
            :props="seletorProps"
            :value="form.categoryId"
            @change="handleTreeSelectChange"
            @getValue="(id) => (form.categoryId = id)"
          />
        </el-form-item>

        <el-form-item
          label="关联问卷"
          prop="subjectId"
          class="half-form-item"
          style="margin-right: 160px;"
        >
          <el-select
            v-model="form.subjectId"
            v-el-select-loadmore="loadmoreSubject"
            :disabled="!!form.id"
            placeholder="请选择"
            style="width: 100%;"
            @change="handleSubjectChange"
          >
            <el-option
              v-for="item in subjectOptions"
              :key="item.id"
              :label="item.asqName"
              :value="item.id"
            >
            </el-option>
            <div
              v-if="subjectLoading"
              style="color: #9c9c9c; line-height: 34px;text-align: center;"
            >
              加载中...
            </div>
            <div
              v-if="noMoreSubject && !subjectLoading"
              style="color: #9c9c9c;line-height: 34px;text-align: center;"
            >
              没有更多了
            </div>
          </el-select>
        </el-form-item>
        <el-form-item
          label="问卷积分"
          prop="asqScore"
          class="half-form-item"
        >
          <el-input-number
            v-model="form.asqScore"
            :precision="1"
            :step="0.5"
            :min="0"
            type="number"
            controls-position="right"
            style="width: 100%;"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          class="half-form-item"
          label="发布时间"
          prop="publishTime"
        >
          <el-date-picker
            v-model="dateValue"
            style="width: 100%;"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            start-placeholder="开始日期"
            end-placeholder="截止日期"
          />
        </el-form-item>
      </el-form>

      <div
        v-show="step == 2"
        class="person-table"
      >
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
          <el-button
            size="medium"
            type="primary"
            @click="userPickerVisible = true"
          >
            添加人员
          </el-button>
        </div>

        <el-table
          :data="currentPersonList"
          align="center"
          header-align="center"
          row-key="userId"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            :selectable="selectEnable"
            reserve-selection
            type="selection"
            width="55"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
          >
          </el-table-column>

          <el-table-column
            prop="phoneNum"
            label="手机号码"
          >
          </el-table-column>

          <el-table-column
            prop="orgName"
            label="所属组织"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.orgName || '--' }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="deleteBtnVisible(scope.row)"
                size="mini"
                type="text"
                @click="handleDeletePerson(scope.row)"
              >
                删除
              </el-button>
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
      select-type="Org,OuterUser"
      @input="handleSelectPerson"
    />

    <el-dialog
      :visible.sync="dialogVisible"
      class="finally-dialog"
      :show-close="false"
      destroy-on-close
      width="550px"
      @close="confirm"
    >
      <div
        slot="title"
        class="dialog-title"
      >
        问卷链接
        <!-- 问卷链接和二维码 -->
      </div>
      <div class="dialog-content">
        <!-- <div class="code-wrapper">
          <div
            ref="code"
            class="code"
          ></div>
        </div> -->

        <div class="content-r">
          <div class="url">
            <el-input
              v-model="href"
              placeholder="请输入内容"
              readonly
            >
              <el-button
                slot="append"
                type="primary"
                @click="handleCopy"
              >
                复制
              </el-button>
            </el-input>
          </div>
          <!-- <el-button
            class="downlod-btn"
            size="medium"
            type="default"
            @click="handleCodeDownload"
          >
            下载二维码
          </el-button> -->
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          size="medium"
          @click="dialogVisible = false"
        >我知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { orgOrPositionToPerson } from '@/util/middleWare'
import { queryCategoryOrgList } from '@/api/resource/classroom'
import TreeSelector from '@/components/tree-selector'
import UserPicker from '@/components/user-picker/userPicker2'
import Pagination from '@/components/common-pagination'
// eslint-disable-next-line no-unused-vars
import { save, update, saveQuery, querySubject, saveAsqUrl } from '@/api/questionnaire'
// eslint-disable-next-line no-unused-vars
import QRCode from 'qrcodejs2'
// eslint-disable-next-line no-unused-vars
const CODE_HEIGHT = 86
// eslint-disable-next-line no-unused-vars
const CODE_WIDTH = 86
const CODE_NAME = '问卷二维码'

export default {
  name: 'QuestionnaireArrange',

  directives: {
    'el-select-loadmore': {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', () => {
          /**
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           */
          const condition =
            SELECTWRAP_DOM.scrollHeight - SELECTWRAP_DOM.scrollTop <= SELECTWRAP_DOM.clientHeight
          if (condition) {
            binding.value()
          }
        })
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
      step: 1,
      selectorData: [],
      subjectOptions: [],
      pickerOptionsStart: {},
      pickerOptionsEnd: {},
      getSubjectParams: {
        pageSize: 600,
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
        publishTime: [{ required: true, message: '请选择发布时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择截止时间', trigger: 'change' }],
        categoryId: [{ required: true, message: '请选择所在分类', trigger: 'change' }],
        subjectId: [{ required: true, message: '请选择关联问卷', trigger: 'change' }]
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
      publishLoading1: false,
      publishLoading0: false,
      subjectLoading: false,
      noMoreSubject: false,
      hisPersonList: []
    }
  },
  computed: {
    currentPersonList() {
      const { pageSize: size, pageNo: no } = this.page
      return this.personList.slice(size * (no - 1), size * no)
    },
    dateValue: {
      get: function() {
        const { publishTime, endTime } = this.form
        return [publishTime, endTime]
      },
      set: function([publishTime, endTime]) {
        Object.assign(this.form, { publishTime, endTime })
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        // 生成二维码
        // this.$nextTick(() => {
        //   const qrcode = (this.qrcode = new QRCode(this.$refs.code, {
        //     width: CODE_WIDTH,
        //     height: CODE_HEIGHT
        //   }))
        //   qrcode.makeCode(this.href)
        // })
      }
    }
  },
  created() {
    this.id = this.$route.query.id
    if (this.$route.query.status == 2) {
      this.step = 2
    }
    this.getCategoryData()
    this.initData()
  },
  mounted() {
    this.$refs.form.resetFields()
  },
  methods: {
    deleteBtnVisible(row) {
      const status = this.$route.query.status
      if (status == 2) {
        return !this.hisPersonList.find((person) => person.userId === row.userId)
      } else {
        return true
      }
    },
    selectEnable(row) {
      if (this.$route.query.status != 2) return true
      if (this.hisPersonList.some((person) => person.userId === row.userId)) {
        return false
      } else {
        return true // 不禁用
      }
    },
    toCategory() {
      const routeData = this.$router.resolve({
        path: '/questionnaire/catalog'
      })
      window.open(routeData.href, '_blank')
    },
    handleCopy() {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.value = this.href
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      this.$message.success('已复制')
    },
    confirm() {
      this.$router.back()
    },
    handleSubjectChange(val) {
      const subject = this.subjectOptions.find((s) => s.id == val)
      this.form.subjectName = subject.asqName
    },
    publishTimeChange() {
      // 限制开始时间
      this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
        disabledDate: (time) => {
          if (this.form.publishTime) {
            let date = this.form.publishTime + ''
            date = date.split(' ')
            let [year, month, day] = date[0].split('-')
            year = +year
            month = month - 1
            day = +day
            let [hour, minute] = date[1].split(':')
            hour = +hour
            minute = +minute
            let publishTime = new Date(year, month, day, hour, minute)
            return time.getTime() < publishTime.getTime() && time.getDate() != publishTime.getDate()
          }
        }
      })
    },
    endTimeChange() {
      // 限制结束时间
      this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
        disabledDate: (time) => {
          if (this.form.endTime) {
            let date = this.form.endTime + ''
            date = date.split(' ')
            let [year, month, day] = date[0].split('-')
            year = +year
            month = month - 1
            day = +day
            let [hour, minute] = date[1].split(':')
            hour = +hour
            minute = +minute
            let endTime = new Date(year, month, day, hour, minute)
            return time.getTime() < endTime.getTime() && time.getDate() != endTime.getDate()
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
    publish(type) {
      if (!this.personList.length) {
        this.$message.error('至少添加一个人员')
        return
      }
      let api
      let tenantId = 'learn'
      try {
        tenantId = JSON.parse(localStorage.getItem('elearning-tenantId'))
        tenantId = tenantId.content
      } catch (e) {
        tenantId = 'learn'
      }
      const date = new Date()
      const $data = {
        tenantId,
        // eslint-disable-next-line no-useless-escape
        planCode: date.toISOString().replace(/\-|T|\:|\.|Z/g, '')
      }
      if (this.id) {
        api = update
        $data.id = this.id
      } else {
        api = save
        $data.asqUrl = ''
        $data.type = type
      }

      Object.assign($data, this.form)
      $data.publishTime = $data.publishTime + ':00'
      $data.endTime = $data.endTime + ':00'
      $data.users = this.personList.map((person) => {
        const { userId, name, phoneNum, orgName = '' } = person
        return {
          userId,
          userName: name,
          userPhone: phoneNum,
          userDeptStr: orgName
        }
      })
      this['publishLoading' + type] = true
      api($data)
        .then(() => {
          this.$message.success('操作成功')
          this.$router.back()
          // if (!this.id) {
          //   this.href = window.location.origin + '/#/questionnaire/preview?id=' + res
          //   saveAsqUrl({ id: res, asqUrl: this.href }).then(() => {
          //     this.dialogVisible = true
          //   })
          // } else {
          //   this.$message.success('操作成功')
          //   this.$router.back()
          // }
        })
        .finally(() => {
          this['publishLoading' + type] = false
        })
    },
    initData() {
      if (this.id) {
        saveQuery({ id: this.id }).then((res) => {
          const { users = [] } = res
          this.personList = users.map((user) => {
            const { userName, userPhone, userDeptStr, userId } = user
            return {
              name: userName,
              phoneNum: userPhone,
              orgName: userDeptStr,
              userId: userId + ''
            }
          })
          this.hisPersonList = JSON.parse(JSON.stringify(this.personList))
          delete res.users
          Object.assign(this.form, res)
        })
      }
      this.querySubject()
    },
    loadmoreSubject() {
      if (this.subjectLoading || this.noMoreSubject) return
      this.getSubjectParams.pageNo++
      this.querySubject()
    },
    querySubject() {
      this.subjectLoading = true
      querySubject(this.getSubjectParams)
        .then((res) => {
          const { data = [] } = res
          this.noMoreSubject = !data.length
          this.subjectOptions = this.subjectOptions.concat(data)
          this.$forceUpdate()
        })
        .finally(() => {
          this.subjectLoading = false
        })
    },
    handleStepChange(step) {
      if (this.$route.query.status == 2) return
      if (this.step == 1) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.step = step
          }
        })
        return
      }
      this.step = step
    },
    handleSelectPerson(list) {
      if (this.$route.query.status == 2) {
        this.personList = _.uniqBy(list.concat(this.hisPersonList), 'userId')
      } else {
        orgOrPositionToPerson(_.cloneDeep(list)).then((res) => {
          this.personList = res
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDeletePerson(target) {
      let message = ''
      if (target) {
        message = '您确定要删除该人员吗？'
      } else {
        message = '您确定要批量删除所选人员吗？'
      }
      this.$confirm(message, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const list = this.personList
          if (target) {
            list.splice(
              list.findIndex((person) => person.id === target.id),
              1
            )
            return
          }
          this.personList = list.filter((person) => this.multipleSelection.indexOf(person) < 0)
        })
        .catch(() => {})
    },
    getCategoryData() {
      queryCategoryOrgList({ source: 'questionnaire' }).then((res) => {
        this.selectorData = res
      })
    }
  }
}
</script>
<style lang="scss">
.questionnaire-arrange {
  .options-loading-tips {
    color: #9c9c9c;
    line-height: 34px;
    text-align: center;
  }
  .el-form--label-top .el-form-item__label {
    padding: 0;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .category-form-item {
    .el-form-item__label {
      display: flex;
      align-items: center;
      width: 100%;
      .category-header {
        height: 0;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
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
  background-color: #fafafa;
  height: 100vh;
  overflow-y: scroll;
  .header {
    box-sizing: border-box;
    flex: 0 0 56px;
    padding: 0 24px;
    height: 56px;
    line-height: 56px;
    width: 100%;
    background: #ffffff;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.04), 0 8px 16px 4px rgba(0, 0, 0, 0.04);
  }
  .body {
    flex: 1;
    background-color: #fff;
    margin: 15px auto 25px;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    padding: 35px 120px;
    width: 1300px;
    .half-form-item {
      display: inline-block;
      width: 450px;
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
    color: rgba(0, 11, 21, 0.65);
  }

  .finally-dialog {
    padding: 25px;
    .dialog-title {
      height: 68px;
      line-height: 68px;
      font-size: 18px;
      color: rgba(0, 11, 21, 0.85);
      border-bottom: 1px solid #ebeced;
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
          border: 1px solid #d9dbdc;
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
