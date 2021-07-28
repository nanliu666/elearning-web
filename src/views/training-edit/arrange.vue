<template>
  <div class="training-edit-arrange">
    <div
      v-if="form.trainWay == 2 || form.trainWay == 3"
      class="table-wrapper"
    >
      <div class="table-header">
        <div class="table-header-title">
          <div class="name">
            线下日程
          </div>
          <div
            v-if="form.trainOfflineTodo.length"
            class="info"
          >
            共{{ form.trainOfflineTodo.length }}项 共{{ offlineTodoTime }}课时
          </div>
        </div>
        <div class="table-header-r">
          <div style="margin-right: 40px;">
            <span style="padding-right: 5px;">开启签到功能</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="启用签到功能后，学员每一节线下课程/活动都需要扫描二维码进行签到"
              placement="top-start"
              style="margin-right: 10px;"
            >
              <i class="el-icon-warning" />
            </el-tooltip>
            <el-switch
              v-model="form.signIn"
              :disabled="!form.trainOfflineTodo.length"
            ></el-switch>
          </div>

          <el-button
            type="primary"
            size="medium"
            class="button"
            @click="() => handleOfflineEdit()"
          >
            添加线下日程
          </el-button>
        </div>
      </div>
      <el-collapse v-if="offlineTable.length">
        <el-collapse-item
          v-for="(table, index) in offlineTable"
          :key="index"
          :title="
            '第' + (index + 1) + '天 ' + (table.todoDate.indexOf('empty') < 0 ? table.todoDate : '')
          "
          :name="table.todoDate"
        >
          <el-table
            :data="table.expand"
            :show-header="false"
          >
            <el-table-column
              min-width="220"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div>
                  {{ scope.row.todoTime.join(' ~ ') }}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              min-width="220"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{
                  scope.row.type == 1
                    ? '【面授课程】' + scope.row.courseName
                    : '【活动】' + scope.row.theme
                }}
              </template>
            </el-table-column>

            <el-table-column
              prop="lecturerName"
              min-width="180"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>

            <el-table-column
              prop="classroomName"
              min-width="180"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>

            <el-table-column
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="medium"
                  type="text"
                  :disabled="shouldBeDisabled(scope.row)"
                  @click="handleOfflineEdit(scope.row.$id)"
                >
                  修改
                </el-button>
                <el-button
                  size="medium"
                  type="text"
                  :disabled="shouldBeDisabled(scope.row)"
                  @click="handleOfflineDelete(table.todoDate, scope.row.todoTime)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>

      <div
        v-else
        style="text-align: center; color: #718199; line-height: 63px; border-top: 1px solid rgb(240 240 240); border-bottom: 1px solid rgb(240 240 240)"
      >
        无数据
      </div>
    </div>

    <div
      v-if="form.trainWay == 1 || form.trainWay == 3"
      class="table-wrapper"
    >
      <div class="table-header">
        <div class="table-header-title">
          <div class="name">
            在线课程
          </div>
          <div
            v-if="form.trainOnlineCourse.length"
            class="info"
          >
            共{{ form.trainOnlineCourse.length }}项 共{{ onlineTodoTime }}课时
          </div>
        </div>
        <el-button
          type="primary"
          size="medium"
          class="button"
          @click="() => handleOnlineEdit()"
        >
          添加在线课程
        </el-button>
      </div>
      <el-table :data="form.trainOnlineCourse">
        <el-table-column
          props="classTime"
          label="上课日期"
          width="270"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.classTime.join(' ~ ') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="courseName"
          width="180"
          show-overflow-tooltip=""
          label="关联课程"
        ></el-table-column>
        <el-table-column
          prop="lecturerName"
          label="讲师"
        >
          <template slot-scope="scope">
            {{ scope.row.lecturerName || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="studyType"
          label="修读类型"
        >
          <template slot-scope="scope">
            {{ scope.row.studyType == 0 ? '必修' : '选修' }}
          </template>
        </el-table-column>
        <el-table-column
          props="date"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              :disabled="shouldBeDisabled(scope.row)"
              @click="handleOnlineEdit(scope.row)"
            >
              修改
            </el-button>
            <el-button
              type="text"
              size="medium"
              :disabled="shouldBeDisabled(scope.row)"
              @click="handleOnlineDelete(scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="table-wrapper">
      <div class="table-header">
        <div class="table-header-title">
          <div class="name">
            考试安排
          </div>
          <div
            v-if="form.trainExam.length"
            class="info"
          >
            共{{ form.trainExam.length }}项
          </div>
        </div>
        <el-button
          type="primary"
          size="medium"
          class="button"
          @click="() => handleExamEdit()"
        >
          添加考试
        </el-button>
      </div>
      <el-table :data="form.trainExam">
        <el-table-column
          props="examTime"
          label="考试时间"
          width="320"
          show-overflow-tooltip=""
        >
          <template slot-scope="scope">
            {{ scope.row.examTime.join(' 至 ') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="examName"
          label="考试名称"
        ></el-table-column>
        <el-table-column label="考试时长（分钟）">
          <template slot-scope="scope">
            {{ scope.row.reckonTime ? scope.row.reckonTimeValue : '不计时' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              :disabled="shouldBeDisabled(scope.row)"
              @click="handleExamEdit(scope.row)"
            >
              修改
            </el-button>
            <el-button
              type="text"
              size="medium"
              :disabled="shouldBeDisabled(scope.row)"
              @click="handleExamDelete(scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      title="添加线下日程"
      :visible.sync="offlineDialogVisible"
      size="550px"
      destroy-on-close
    >
      <div class="drawer-container">
        <div class="drawer-body">
          <div class="drawer-content">
            <el-form
              ref="offlineForm"
              label-position="top"
              size="medium"
              :rules="offlineFormRules"
              :model="offlineForm"
              class="offline-form"
            >
              <el-form-item
                label="类型"
                prop="type"
              >
                <el-radio-group v-model="offlineForm.type">
                  <el-radio :label="1">
                    面授课程
                  </el-radio>
                  <el-radio :label="2">
                    活动
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                prop="todoDate"
                :label="offlineForm.type == 1 ? '授课日期' : '活动日期'"
              >
                <el-date-picker
                  v-model="offlineForm.todoDate"
                  :picker-options="datePickerOptions"
                  clearable
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :placeholder="'请选择' + (offlineForm.type == 1 ? '授课日期' : '活动日期')"
                ></el-date-picker>
              </el-form-item>
              <el-form-item
                prop="todoTime"
                :label="offlineForm.type == 1 ? '授课时间' : '活动时间'"
              >
                <el-time-picker
                  v-model="offlineForm.todoTime"
                  clearable
                  is-range
                  range-separator="至"
                  value-format="HH:mm"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                >
                </el-time-picker>
              </el-form-item>
              <el-form-item
                class="slot-form-item"
                prop="classroomId"
              >
                <div
                  slot="label"
                  class="slot-item-header"
                >
                  <span class="label-name">{{
                    offlineForm.type == 1 ? '授课教室' : '活动教室'
                  }}</span>
                  <el-button
                    style="padding: 0;"
                    type="text"
                    :disabled="!offlineForm.todoDate"
                    @click.native="classroomDialogVisible = true"
                  >
                    预定情况
                  </el-button>
                </div>
                <lazy-select
                  v-model="offlineForm.classroomId"
                  :remote-method="getBookList"
                  :query-props="{ search: 'roomName' }"
                  :props="{ value: 'id', label: 'roomName' }"
                  :initial-options="offlineForm.classRoomOptions"
                  @getSelected="
                    (data) => {
                      offlineForm.classroomName = data.roomName
                    }
                  "
                />
              </el-form-item>
              <el-form-item
                v-if="offlineForm.type == 1"
                label="关联课程"
                prop="course"
              >
                <lazy-select
                  v-model="offlineForm.course"
                  :data-filter="(data) => data.status == 1"
                  :remote-method="getOfflineCourseList"
                  :query-props="{ search: 'courseName' }"
                  :props="{ value: 'id', label: 'courseName' }"
                  @getSelected="(data) => handleCourseSelected(data, 'offlineForm')"
                />
              </el-form-item>
              <el-form-item
                v-else
                label="活动主题"
                prop="theme"
              >
                <el-input
                  v-model="offlineForm.theme"
                  :maxlength="32"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-if="offlineForm.type == 1"
                label="讲师"
              >
                <el-input
                  v-model="offlineForm.lecturerName"
                  :maxlength="32"
                  disabled
                  placeholder="请选择"
                ></el-input>
              </el-form-item>

              <el-form-item
                v-else
                label="主持人"
                prop="lecturerId"
              >
                <lazy-select
                  v-model="offlineForm.lecturerId"
                  :remote-method="getUserList"
                  :props="{ value: 'userId', label: 'name' }"
                  @getLabel="(label) => (offlineForm.lecturerName = label)"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <span
          slot="footer"
          class="drawer-footer"
          style="display: block; text-align: center;"
        >
          <el-button @click="offlineDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleOfflineConfirm"
          >确定</el-button>
        </span>
      </div>
    </el-drawer>

    <el-drawer
      title="添加在线课程"
      :visible.sync="onlineDialogVisible"
      size="550px"
      destroy-on-close
    >
      <div class="drawer-container">
        <div class="drawer-body">
          <div class="drawer-content">
            <el-form
              ref="onlineForm"
              label-position="top"
              size="medium"
              :rules="onlineFormRules"
              :model="onlineForm"
            >
              <el-form-item
                label="上课日期"
                prop="classTime"
              >
                <el-date-picker
                  v-model="onlineForm.classTime"
                  :default-time="['00:00:00', '23:59:59']"
                  type="daterange"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="截止日期"
                  :picker-options="datePickerOptions"
                />
              </el-form-item>
              <el-form-item
                label="关联课程"
                prop="course"
              >
                <lazy-select
                  v-model="onlineForm.course"
                  :remote-method="getOnlineCourseList"
                  :query-props="{ search: 'courseName' }"
                  :props="{ value: 'id', label: 'courseName' }"
                  :initial-options="onlineForm.initialOptions"
                  @getSelected="(data) => handleCourseSelected(data, 'onlineForm')"
                />
              </el-form-item>

              <el-form-item label="讲师">
                <el-input
                  v-model="onlineForm.lecturerName"
                  :maxlength="32"
                  disabled
                  placeholder="请选择"
                ></el-input>
              </el-form-item>

              <el-form-item label="修读类型">
                <el-radio-group v-model="onlineForm.studyType">
                  <el-radio :label="0">
                    必修
                  </el-radio>
                  <el-radio :label="1">
                    选修
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <span
          slot="footer"
          class="drawer-footer"
          style="display: block; text-align: right;"
        >
          <el-button @click="onlineDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleOnlineConfirm"
          >确定</el-button>
        </span>
      </div>
    </el-drawer>

    <el-drawer
      title="添加考试"
      :visible.sync="examDialogVisible"
      destroy-on-close
      direction="rtl"
      size="550px"
      @close="examDialogTag = 'base'"
    >
      <div class="drawer-container">
        <el-radio-group
          v-model="examDialogTag"
          size="medium"
          class="drawer-header"
        >
          <el-radio-button label="base">
            基本设置
          </el-radio-button>
          <el-radio-button label="env">
            考场环境
          </el-radio-button>
          <el-radio-button label="auth">
            考生权限
          </el-radio-button>
          <el-radio-button label="strategy">
            评卷策略
          </el-radio-button>
          <el-radio-button label="score">
            成绩发布
          </el-radio-button>
        </el-radio-group>

        <div class="drawer-body">
          <div class="drawer-content">
            <el-form
              ref="examForm"
              label-position="top"
              :model="examForm"
              size="medium"
              :rules="examFormRules"
            >
              <div v-show="examDialogTag === 'base'">
                <el-form-item
                  label="考试日期"
                  prop="examTime"
                >
                  <el-date-picker
                    v-model="examForm.examTime"
                    :default-time="['00:00:00', '23:59:59']"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="datePickerOptions"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item
                  label="考试名称"
                  prop="examName"
                >
                  <el-input
                    v-model="examForm.examName"
                    :maxlength="32"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>

                <el-form-item
                  label="关联用卷"
                  prop="testPaper"
                >
                  <lazy-select
                    v-model="examForm.testPaper"
                    :remote-method="getExamList"
                    :initial-options="examForm.examOptions"
                  >
                  </lazy-select>
                </el-form-item>

                <el-form-item
                  label="评卷人"
                  prop="reviewer"
                >
                  <lazy-select
                    v-model="examForm.reviewer"
                    multiple
                    :remote-method="getUserList"
                    :props="{ value: 'userId', label: 'name' }"
                  >
                  </lazy-select>
                </el-form-item>

                <el-form-item
                  label="答题模式"
                  prop="answerMode"
                >
                  <el-radio-group v-model="examForm.answerMode">
                    <el-radio :label="1">
                      整卷模式
                    </el-radio>
                    <el-radio :label="2">
                      逐题考试
                    </el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item
                  label="考试时长"
                  prop="reckonTime"
                >
                  <el-radio-group v-model="examForm.reckonTime">
                    <el-radio :label="false">
                      不计时
                    </el-radio>
                    <el-radio :label="true">
                      限制时长
                      <el-input
                        v-model.number="examForm.reckonTimeValue"
                        :maxlength="32"
                        placeholder="请输入"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        :disabled="!examForm.reckonTime"
                        style="width: 75px !important; margin: 0 5px;"
                      ></el-input>分钟
                    </el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item
                  label="参加次数"
                  prop="joinNum"
                >
                  <el-radio-group v-model="examForm.joinNum">
                    <el-radio :label="false">
                      不限次数
                    </el-radio>
                    <el-radio :label="true">
                      限制次数
                      <el-input
                        v-model.number="examForm.joinNumValue"
                        :maxlength="32"
                        placeholder="请输入"
                        :disabled="!examForm.joinNum"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        style="width: 75px !important; margin: 0 5px;"
                      ></el-input>次
                    </el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item
                  label="考试时间策略"
                  prop="strategy"
                >
                  <el-radio-group v-model="examForm.strategy">
                    <el-radio
                      :label="0"
                      style="margin-bottom: 22px;"
                    >
                      允许进入考试的时间
                    </el-radio>
                    <el-radio :label="1">
                      允许参考时间（到结束时间，会自动提交。）
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>

              <div v-show="examDialogTag === 'env'">
                <div class="switch-wrapper">
                  <div class="switch-label">
                    迟到后禁止考试
                  </div>
                  <el-switch v-model="examForm.lateBanExam" />
                </div>
                <div
                  v-show="examForm.lateBanExam"
                  class="switch-hidden-wrapper"
                >
                  迟到<el-input
                    v-model.number="examForm.lateBanExamValue"
                    :maxlength="32"
                    type="text"
                    style="width: 75px !important; margin: 0 5px;"
                    placeholder="请输入"
                    onkeyup="value=value.replace(/[^\d]/g,'')"
                  ></el-input>分钟禁止参见考试
                </div>
                <div class="switch-wrapper">
                  <div class="switch-label">
                    答卷时间过少禁止交卷
                  </div>
                  <el-switch v-model="examForm.answerBanExam">
                  </el-switch>
                </div>
              </div>

              <div v-show="examDialogTag === 'auth'">
                <div class="switch-wrapper">
                  <div class="switch-label">
                    允许考生查看本机资料(开卷考试)
                  </div>
                  <el-switch v-model="examForm.isDecoil"></el-switch>
                </div>

                <div class="switch-wrapper">
                  <div class="switch-label">
                    允许考生查看成绩
                  </div>
                  <el-switch v-model="examForm.openResults"></el-switch>
                </div>

                <div
                  v-show="examForm.openResults"
                  class="switch-hidden-wrapper"
                >
                  考生<el-input
                    v-model.number="examForm.openResultsValue"
                    :maxlength="32"
                    onkeyup="value=value.replace(/[^\d]/g,'')"
                    style="width: 75px !important; margin: 0 5px;"
                    placeholder="请输入"
                  ></el-input>天内可以查看成绩（0代表永久）
                </div>
                <div class="switch-wrapper">
                  <div class="switch-label">
                    允许考生查看答卷
                  </div>
                  <el-switch v-model="examForm.openAnswerSheet" />
                </div>

                <div class="switch-wrapper">
                  <div class="switch-label">
                    允许考生查看标准答案
                  </div>
                  <el-switch v-model="examForm.publicAnswers" />
                </div>
              </div>

              <div v-show="examDialogTag === 'strategy'">
                <div class="switch-wrapper">
                  <div class="switch-label">
                    评卷限定最高得分
                  </div>
                  <el-switch v-model="examForm.scopeLimit" />
                </div>
                <div
                  v-show="examForm.scopeLimit"
                  class="switch-hidden-wrapper"
                >
                  最高得分为<el-input
                    v-model.number="examForm.scopeLimitValue"
                    :maxlength="32"
                    onkeyup="value=value.replace(/[^\d]/g,'')"
                    style="width: 75px !important; margin: 0 5px;"
                    placeholder="请输入"
                  ></el-input>分
                </div>
                <div class="switch-wrapper">
                  <div class="switch-label">
                    手工评卷是否显示客观题
                  </div>
                  <el-switch v-model="examForm.objectiveQuestions" />
                </div>

                <div class="switch-wrapper">
                  <div class="switch-label">
                    判断题答对得分，不答或答错扣分
                  </div>
                  <el-switch v-model="examForm.decideItem" />
                </div>

                <el-form-item
                  label="多选题"
                  style="margin-top: 22px;"
                >
                  <el-radio-group
                    v-model="examForm.multipleChoice"
                    style="margin-top: 22px;"
                  >
                    <el-radio
                      :label="0"
                      class="block-radio"
                    >
                      完全正确得分
                    </el-radio>
                    客观题指单选题、多选题、判断题、单选测评题、多选测评题。
                    <el-radio
                      :label="1"
                      class="block-radio"
                    >
                      按正确选项个数计分
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>

              <div v-show="examDialogTag === 'score'">
                <div class="switch-wrapper">
                  <div class="switch-label">
                    自动评定是否通过
                  </div>
                  <el-switch v-model="examForm.autoEvaluate"></el-switch>
                </div>

                <el-form-item
                  v-show="examForm.autoEvaluate"
                  label="通过条件"
                  style="margin-top: 22px;"
                  prop="passType"
                >
                  <el-radio-group v-model="examForm.passType">
                    <el-radio :label="1">
                      按成绩<span
                        v-show="examForm.passType === 1"
                        style="margin-left: 15px;"
                      >成绩不低于<el-input
                        v-model="examForm.passScope"
                        :maxlength="32"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        style="width: 75px !important; margin: 0 5px;"
                        placeholder="请输入"
                      ></el-input>分</span>
                    </el-radio>
                    <el-radio :label="2">
                      按得分率<span
                        v-show="examForm.passType === 2"
                        style="margin-left: 15px;"
                      >得分率不低于<el-input
                        v-model="examForm.passPercentage"
                        :maxlength="32"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        style="width: 75px !important; margin: 0 5px;"
                        placeholder="请输入"
                      ></el-input>%</span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item
                  label="发布规则"
                  prop="publishType"
                  style="margin-top: 22px;"
                >
                  <el-radio-group
                    v-model="examForm.publishType"
                    style="margin-top: 22px;"
                  >
                    <el-radio
                      class="block-radio"
                      :label="1"
                    >
                      系统即时发布
                    </el-radio>
                    <el-radio
                      class="block-radio"
                      :label="2"
                    >
                      系统自动发布
                    </el-radio>
                    <el-radio
                      class="block-radio"
                      :label="3"
                    >
                      手工发布
                    </el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item
                  v-show="examForm.publishType == 2"
                  label="定时发布时间"
                  prop="fixedTime"
                >
                  <el-date-picker
                    v-model="examForm.fixedTime"
                    :picker-options="fixTimePickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    :clearable="false"
                    placeholder="请选择定时发布时间"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>

        <span
          slot="footer"
          class="drawer-footer"
        >
          <div class="footer-info">
            注：培训发布后，本条考试信息数据将会同步至【考评管理】，可在考试安排和成绩管理查到对应信息
          </div>
          <div class="footer-btn">
            <el-button @click="examDialogVisible = false">取消</el-button>
            <el-button
              type="primary"
              @click="handleExamConfirm"
            >确定</el-button>
          </div>
        </span>
      </div>
    </el-drawer>

    <el-dialog
      title="预定情况"
      :visible.sync="classroomDialogVisible"
    >
      <div class="classroom-dialog">
        <div class="header">
          <el-form
            :model="classroomQuery"
            inline
          >
            <el-form-item style="margin-right: 12px; margin-bottom: 0;">
              <el-input
                v-model="classroomQuery.roomName"
                :maxlength="32"
                placeholder="教室名称"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item style="margin-right: 12px; margin-bottom: 0;">
              <el-input
                v-model="classroomQuery.roomAddr"
                :maxlength="32"
                placeholder="教室地址"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 0;">
              <el-button
                type="primary"
                size="medium"
                :disabled="classroomLoading"
                @click.native="getClassroomList"
              >
                搜索
              </el-button>
              <el-button
                size="medium"
                @click.native="Object.assign(classroomQuery, { roomName: '', roomAddr: '' })"
              >
                重置
              </el-button>
            </el-form-item>
          </el-form>
          <div class="type">
            <span class="type-item">授课时间</span>
            <span class="type-item">已占用</span>
          </div>
        </div>
        <el-table
          v-loading="classroomLoading"
          :data="classroomData"
          height="450"
          border
        >
          <el-table-column
            label="教室名称"
            fixed="left"
            prop="roomName"
            min-width="130"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            label="容纳人数"
            fixed="left"
            prop="maxCapacity"
            min-width="100"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            label="投影仪"
            fixed="left"
            prop="hasProjector"
            min-width="70"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.hasProjector ? '有' : '没有' }}
            </template>
          </el-table-column>

          <el-table-column
            v-for="time in timeList"
            :key="time"
            :label="time"
            align="center"
          >
            <template slot-scope="scope">
              <div
                class="status-square"
                :class="{
                  red: scope.row.reservedTodoTime.some((todoTime) => {
                    const [start, end] = todoTime.split('-')
                    return time >= start && time <= end
                  })
                }"
              >
                {{ time }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer">
        <pagination
          :total="classroomTotal"
          :page="classroomQuery.pageNo"
          :limit="classroomQuery.pageSize"
          @pagination="classroomPagination"
        ></pagination>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getBookList } from '@/api/train/train'
import { getExamList } from '@/api/examManage/schedule'
import Pagination from '@/components/common-pagination'
import lazySelect from '@/components/el-lazy-select'
import { getCourseListData } from '@/api/course/course'
import { getOrgUserList } from '@/api/system/user'

export default {
  name: 'TrainingEditArrange',
  components: {
    Pagination,
    lazySelect
  },
  props: {
    isUnderwayEdit: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      datePickerOptions: {},
      activeName: '0',
      timeList: [],
      offlineFormRules: {
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        todoDate: [{ required: true, message: '请选择授课日期', trigger: 'change' }],
        todoTime: [{ required: true, message: '请选择授课时间', trigger: 'change' }],
        classroomId: [{ required: true, message: '请选择授课教室', trigger: 'change' }],
        course: [{ required: true, message: '请选择关联课程', trigger: 'change' }],
        theme: [{ required: true, message: '请输入活动主题', trigger: 'blur' }]
      },
      onlineFormRules: {
        classTime: [{ required: true, message: '请选择学习日期', trigger: 'change' }],
        course: [{ required: true, message: '请选择关联课程', trigger: 'change' }]
      },
      examFormRules: {
        examTime: [{ required: true, message: '请选择考试日期', trigger: 'change' }],
        examName: [{ required: true, message: '请输入考试名称', trigger: 'blur' }],
        testPaper: [{ required: true, message: '请选择关联用卷', trigger: 'change' }],
        reviewer: [{ required: true, message: '请选择评卷人', trigger: 'change' }],
        passType: [{ required: true }],
        publishType: [{ required: true }],
        fixedTime: [{ required: true, message: '请选择发布日期', trigger: 'change' }]
      },
      classroomLoading: false,
      offlineDialogVisible: false,
      offlineForm: {},
      onlineDialogVisible: false,
      onlineForm: {},
      examDialogVisible: false,
      examForm: {},
      classroomDialogVisible: false,
      examDialogTag: 'base',
      classroomData: [],
      classroomQuery: {
        roomName: '',
        roomAddr: '',
        todoDate: '',
        pageNo: 1,
        pageSize: 10
      },
      classroomTotal: 0,
      fixTimePickerOptions: {}
    }
  },
  computed: {
    offlineTodoTime() {
      const list = this.form.trainOfflineTodo
      let hours = 0
      list.forEach((item) => {
        let [start, end] = item.todoTime
        start = start.split(':').slice(0, 2)
        end = end.split(':').slice(0, 2)
        start = start[0] * 3600000 + start[1] * 60000
        end = end[0] * 3600000 + end[1] * 60000
        let hour = (end - start) / 3600000
        hour = hour.toFixed(1)
        hours += Number(hour)
      })
      return hours
    },
    onlineTodoTime() {
      const list = this.form.trainOnlineCourse
      let hours = 0
      list.forEach((item) => {
        let { period } = item
        hours += +period
      })
      hours = (hours / 60 / 60).toFixed(1)
      return hours
    },

    offlineFormType() {
      return this.offlineForm.type
    },
    offlineFormDate() {
      return this.offlineForm.todoDate
    },
    offlineFormTime() {
      return this.offlineForm.todoTime
    },
    offlineTable() {
      const data = this.form.trainOfflineTodo
      const table = []
      data.forEach((item) => {
        const {
          todoDate,
          todoTime,
          type,
          lecturerName,
          lecturerId,
          courseName,
          course,
          classroomId,
          classroomName,
          theme,
          $additional = false,
          $id
        } = item
        const row = table.find((row) => row.todoDate === todoDate)
        const rowData = {
          todoDate,
          todoTime,
          type,
          lecturerName,
          courseName,
          course,
          lecturerId,
          classroomId,
          classroomName,
          theme,
          $additional,
          $id
        }

        if (!row) {
          table.push({
            todoDate,
            expand: [rowData]
          })
        } else {
          row.expand.push(rowData)
        }
      })

      table.sort((a, b) => {
        return new Date(a.todoDate) - new Date(b.todoDate)
      })
      return table
    }
  },
  watch: {
    offlineFormType() {
      this.offlineForm.lecturerId = ''
      this.offlineForm.lecturerName = ''
      this.clearFormValidate('offlineForm')
    },
    offlineFormDate(todoDate) {
      Object.assign(this.classroomQuery, { todoDate })
      this.getClassroomList()
      if (!todoDate) return
      this.$nextTick(() => {
        this.$refs.offlineForm.validateField('todoTime')
      })
    },
    'form.trainOfflineTodo': {
      handler(list) {
        this.form.signIn = !!list.length
      }
    },
    async examDialogTag(tag, oldTag) {
      if (tag !== 'base' && oldTag == 'base' && tag !== oldTag) {
        const valid = await this.formValidate('examForm')
        if (!valid) {
          this.examDialogTag = 'base'
        }
      }
    }
  },
  created() {
    const h = 23
    let i = 6
    while (i < h) {
      const hour = (i + '').padStart(2, '0')
      this.timeList.push(hour + ':00', hour + ':30')
      i++
    }
    const form = this.form
    const list = form.trainOfflineTodo
    const that = this
    this.offlineFormRules.todoTime.push(
      {
        trigger: 'change',
        validator: (_, value, callback) => {
          if (
            list.some(function(form) {
              if (form === that.offlineForm._target) {
                return false
              }
              let start1 = that.offlineFormDate.replace(/^(.+\s)(.+)$/g, '$1')
              start1 = start1 + ' ' + value[0]
              let end1 = that.offlineFormDate.replace(/^(.+\s)(.+)$/g, '$1')
              end1 = end1 + ' ' + value[1]
              let start2 = form.todoDate.replace(/^(.+\s)(.+)$/g, '$1')
              start2 = start2 + ' ' + form.todoTime[0]
              let end2 = form.todoDate.replace(/^(.+\s)(.+)$/g, '$1')
              end2 = end2 + ' ' + form.todoTime[1]
              const begin = [start1, start2].sort()
              const end = [end1, end2].sort()
              for (let index = 1; index < begin.length; index++) {
                if (begin[index] <= end[index - 1]) {
                  return true
                }
              }
              return false
            })
          ) {
            return callback(new Error('您所选的时段与现存的时段存在重叠时段，请重新选择'))
          }
          return callback()
        }
      },
      {
        trigger: 'change',
        validator: (_, value, callback) => {
          let start1 = that.offlineFormDate + ' : ' + value[0]
          let end1 = that.offlineFormDate + ' : ' + value[1]
          let start2 = this.form.trainTime[0]
          let end2 = this.form.trainTime[1]
          start1 = new Date(start1)
          end1 = new Date(end1)
          start2 = new Date(start2)
          end2 = new Date(end2)
          const result = start1 < start2 || start1 > end2 || end1 > end2 || end1 < start2
          if (result) {
            return callback(new Error('所选时间段不能大于培训时间'))
          }
          return callback()
        }
      }
    )

    this.datePickerOptions = {
      disabledDate(_date) {
        const [startTime, endTime] = form.trainTime
        const date = new Date(_date)
        const start = new Date(startTime)
        const end = new Date(endTime)

        const condition = date < start || date > end

        if (that.isUnderwayEdit) {
          let now = new Date()
          return condition || (date < now && date.toDateString() !== now.toDateString())
        }
        return condition
      }
    }

    this.fixTimePickerOptions = {
      disabledDate(date) {
        const [startTime, endTime] = that.examForm.examTime
        return new Date(date) < new Date(startTime) || new Date(date) > new Date(endTime)
      }
    }
  },
  methods: {
    shouldBeDisabled(data) {
      if (!this.isUnderwayEdit) return false
      return !data.$additional
    },
    validate() {
      return new Promise((resolve) => {
        const { trainOfflineTodo, trainOnlineCourse, trainExam } = this.form
        let check
        if (
          trainOfflineTodo.some((todo) => {
            if (!todo.todoDate) {
              check = todo
              return true
            }
            return false
          })
        ) {
          const name = check.type === 1 ? '(面授课程)' + check.courseName : '(活动)' + check.theme
          resolve(`线下课程【${name}】授课时间未填，请检查`)
        }
        if (
          trainOnlineCourse.some((course) => {
            if (!course.classTime.length) {
              check = course
              return true
            }
            return false
          })
        ) {
          resolve(`线上课程【${check.courseName}】授课时间未填，请检查`)
        }
        if (
          trainExam.some((exam) => {
            if (!exam.examTime.length) {
              check = exam
              return true
            }
            return false
          })
        ) {
          resolve(`考试安排【${check.examName}】考试时间未填，请检查`)
        }
        resolve(true)
      })
    },
    handleCourseSelected(data, formName) {
      const { courseName, teacherName, teacherId, period } = data
      Object.assign(this[formName], {
        courseName,
        lecturerName: teacherName,
        lecturerId: teacherId,
        period
      })
    },
    getExamList(params) {
      return getExamList(Object.assign(params, { status: 'normal' }))
    },
    handleOfflineDelete(todoDate, todoTime) {
      const index = this.form.trainOfflineTodo.findIndex(
        (item) => item.todoDate === todoDate && item.todoTime.join('') === todoTime.join('')
      )
      this.form.trainOfflineTodo.splice(index, 1)
    },
    getBookList(params) {
      function checkTime(time) {
        if (time < '06:00') return '06:00'
        if (time > '23:00') return '23:00'
      }
      let [startTime = '06:00', endTime = '23:00'] = this.offlineForm.todoTime
      startTime =
        checkTime(startTime) ||
        startTime
          .split(':')
          .slice(0, 2)
          .join(':')
      endTime =
        checkTime(endTime) ||
        endTime
          .split(':')
          .slice(0, 2)
          .join(':')
      delete params.undefined
      return getBookList(
        Object.assign(params, { startTime, endTime, todoDate: this.offlineForm.todoDate })
      )
    },
    handleOnlineDelete(index) {
      this.form.trainOnlineCourse.splice(index, 1)
    },
    handleExamDelete(index) {
      this.confirm('你确定要删除该考试安排吗？').then(() => {
        this.form.trainExam.splice(index, 1)
      })
    },
    confirm(message) {
      return new Promise((resolve) => {
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            resolve()
          })
          .catch(() => {})
      })
    },
    formValidate(formName) {
      return new Promise((resolve) => {
        this.$refs[formName].validate((valid) => {
          resolve(valid)
        })
      })
    },
    clearFormValidate(formName) {
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    },
    getOfflineCourseList(params) {
      return getCourseListData(Object.assign(params, { courseType: 2, isPutaway: 1, status: 1 }))
    },
    getOnlineCourseList(params) {
      return getCourseListData(Object.assign(params, { courseType: 1, isPutaway: 1, status: 1 }))
    },
    async handleOfflineConfirm() {
      const valid = await this.formValidate('offlineForm')
      if (!valid) return
      const list = this.form.trainOfflineTodo
      const form = this.offlineForm
      if (!form.$id) {
        form.$id = list.length + ''
      }
      if (this.isUnderwayEdit) {
        form.$additional = true
      }
      if (form._target) {
        const target = form._target
        delete form._target
        Object.assign(target, { ...form })
      } else {
        list.push({ ...form })
      }
      this.offlineDialogVisible = false
    },
    async handleOnlineConfirm() {
      const valid = await this.formValidate('onlineForm')
      if (!valid) return
      const form = this.onlineForm
      if (this.isUnderwayEdit) {
        form.$additional = true
      }
      if (form._target) {
        const target = form._target
        delete form._target
        Object.assign(target, JSON.parse(JSON.stringify(form)))
      } else {
        this.form.trainOnlineCourse.push(JSON.parse(JSON.stringify(form)))
      }
      this.onlineDialogVisible = false
    },
    async handleExamConfirm() {
      const valid = await this.formValidate('examForm')
      if (!valid) return
      const form = this.examForm

      if (this.isUnderwayEdit) {
        form.$additional = true
      }
      if (form._target) {
        const target = form._target
        delete form._target
        Object.assign(target, JSON.parse(JSON.stringify(form)))
      } else {
        this.form.trainExam.push(form)
      }
      this.examDialogVisible = false
    },
    getUserList(params) {
      return getOrgUserList(Object.assign(params, { orgId: 0 }))
    },
    classroomPagination({ page, limit }) {
      Object.assign(this.classroomQuery, { pageSize: limit, pageNo: page })
      this.getClassroomList()
    },
    handleExamEdit(target) {
      if (target) {
        this.examForm = JSON.parse(JSON.stringify(target))
        this.examForm._target = target
        // const { examName, testPaper } = target
        // const form = this.examForm
        // form.examOptions = [
        //   {
        //     id: testPaper,
        //     name: examName
        //   }
        // ]
      } else {
        this.examForm = {
          examTime: '',
          examPattern: '',
          examName: '',
          testPaper: '',
          reviewer: '',
          reckonTime: false,
          joinNum: false,
          reckonTimeValue: 60,
          joinNumValue: 3,
          answerMode: 1,
          strategy: 0,
          integral: false,
          integralValue: 2,
          publishTime: false,
          publishTimeValue: 10,
          isLimitIp: false,
          isShuffle: false,
          createAnswers: false,
          lateBanExam: false,
          lateBanExamValue: 15,
          answerBanExam: false,
          answerBanExamValue: 30,
          preCreate: true,
          preCreateValue: 10,
          isHold: false,
          isDecoil: false,
          openResults: true,
          openResultsValue: 0,
          openAnswerSheet: true,
          selfMarking: false,
          publicAnswers: true,
          scopeLimit: false,
          modifyAnswer: false,
          modifyLimit: false,
          objectiveQuestions: false,
          decideItem: false,
          passType: 1,
          passScope: 60,
          passPercentage: '',
          scopeLimitValue: 100,
          multipleChoice: 0,
          publishType: 1,
          fixedTime: '',
          multipleChoiceValue: '',
          autoEvaluate: true
        }
        const date = new Date()
        this.examForm.fixedTime = date
          .toISOString()
          .replace('T', ' ')
          .split('.')[0]
      }
      this.examDialogVisible = true
    },
    handleOnlineEdit(target) {
      if (target) {
        const form = (this.onlineForm = JSON.parse(JSON.stringify(target)))
        form._target = target
        form.initialOptions = [
          {
            courseName: target.courseName,
            id: target.course
          }
        ]
      } else {
        this.onlineForm = {
          period: 0,
          classTime: [],
          courseId: '',
          lecturerId: '',
          courseName: '',
          lecturerName: '',
          studyType: 0
        }
      }
      this.onlineDialogVisible = true
      this.clearFormValidate('onlineForm')
    },
    handleOfflineEdit($id) {
      if ($id) {
        const target = this.form.trainOfflineTodo.find((item) => {
          return $id === item.$id
        })
        const form = (this.offlineForm = JSON.parse(JSON.stringify(target)))
        const { classroomName, classroomId } = form
        form.classRoomOptions = [
          {
            id: classroomId,
            roomName: classroomName
          }
        ]
        form._target = target
      } else {
        this.offlineForm = {
          type: 1,
          todoTime: ['06:00', '23:00'],
          todoDate: '',
          course: '',
          courseName: '',
          theme: '',
          classroomName: '',
          lecturerName: '',
          lecturerId: '',
          classroomId: ''
        }
      }

      this.offlineDialogVisible = true
      this.clearFormValidate('offlineForm')
    },
    getClassroomList() {
      this.classroomLoading = true
      getBookList(this.classroomQuery)
        .then((res) => {
          const { data = [], totalNum = 0 } = res
          this.classroomData = data
          this.classroomTotal = totalNum
        })
        .finally(() => {
          this.classroomLoading = false
        })
    }
  }
}
</script>
<style lang="scss">
.training-edit-arrange {
  .small-input {
    width: 65px;
    margin: 0 5px;
  }
  // .el-collapse-item__wrap {
  //   border-bottom: none;
  // }
  .el-collapse-item__header {
    background-color: #f7f8fa;
    padding: 0 12px;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
    .el-table td {
      border-bottom: none;
    }
    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      display: none;
    }
  }
  .el-collapse-item:last-child {
    margin-bottom: -2px;
  }
  .el-dialog__body {
    padding: 30px;
  }
  .el-drawer__body {
    height: 0;
  }
  .slot-form-item {
    .el-form-item__label {
      display: flex;
      align-items: center;
      width: 100%;
      .slot-item-header {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  .block-radio {
    display: block;
    margin-bottom: 26px;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100% !important;
  }

  .el-table__expanded-cell {
    padding: 0 !important;
    border-bottom: 0 !important;
  }
  .classroom-dialog {
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      .filter-wrapper {
        display: flex;
        align-items: center;
        .el-input {
          width: 290px !important;
          margin-right: 12px;
        }
      }
      .type {
        display: flex;
        align-items: center;
        margin-right: 7px;
        .type-item {
          &::before {
            display: inline-block;
            content: ' ';
            vertical-align: middle;
            margin-bottom: 4px;
            width: 12px;
            height: 12px;
            margin-right: 6px;
            border-radius: 100%;
            background-color: #f97272;
          }
          &:first-child {
            margin-right: 16px;
            &::before {
              background-color: #c1e9c8;
            }
          }
        }
      }
    }
    .status-square {
      user-select: none;
      width: calc(100% + 20px);
      margin-left: -10px;
      color: transparent;
      background-color: #c1e9c8;
      &.red {
        background-color: #f97272;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.training-edit-arrange {
  .switch-wrapper {
    width: 100%;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    padding: 20px 0;
    justify-content: space-between;
    .switch-label {
      color: #666666;
      font-size: 16px;
    }
  }
  .switch-hidden-wrapper {
    height: 100px;
    line-height: 100px;
    width: 100%;
    color: #666666;
    border-bottom: 1px solid #f0f0f0;
    user-select: none;
    .el-input {
      width: 65px;
      margin: 0 5px;
    }
  }
  .table-wrapper {
    margin-top: 50px;
    &:first-child {
      margin-top: 0;
    }
    .table-header {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      .table-header-r {
        display: flex;
        align-items: center;
      }
      .table-header-title {
        display: flex;
        align-items: flex-end;
        color: #333;
        .name {
          position: relative;
          font-size: 18px;
          margin-right: 8px;
          font-family: '微软雅黑';
          // &::before {
          //   position: absolute;
          //   content: ' ';
          //   display: block;
          //   top: 5px;
          //   left: 0;
          //   height: 15px;
          //   width: 3px;
          //   background-color: #409eff;
          // }
        }
        .info {
          font-size: 12px;
          margin-bottom: 1px;
        }
      }
      .button {
      }
    }
  }

  .drawer-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    .drawer-header {
      padding: 0 20px;
    }
    .drawer-body {
      flex: 1;
      height: 0;
      .drawer-content {
        height: 100%;
        padding: 20px;
        overflow-y: scroll;
      }
    }
    .drawer-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 17px;
      border-top: 1px solid #ccc;
      .footer-info {
        text-align: left;
        flex: 1;
        margin-right: 12px;
        font-size: 12px;
        color: #cccccc;
      }
    }
  }
}
</style>
