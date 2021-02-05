<template>
  <div class="edit_live">
    <!-- 头部 -->
    <div class="head">
      <i
        class="el-icon-arrow-left icon"
        @click="tocourseDraft"
      ></i>
      <div class="schedule">
        <div
          :class="{ sign: headIndex === 1 }"
          class="schedule1"
          @click="headIndex = 1"
        >
          <i class="el-icon-video-camera"></i> 直播信息
        </div>
        <div
          :class="{ sign: headIndex === 2 }"
          class="schedule2"
          @click="headIndex = 2"
        >
          <i class="el-icon-document-copy"></i> 关联讲师及课程
        </div>
        <div
          :class="{ sign: headIndex === 3 }"
          class="schedule3"
          @click="headIndex = 3"
        >
          <i class="el-icon-document-remove"></i> 观看条件
        </div>
      </div>
      <div class="forwardBackward">
        <el-button
          v-show="headIndex !== 1"
          size="mini"
          class="forward"
          @click="headIndex--"
        >
          上一步
        </el-button>
        <el-button
          v-show="headIndex !== 3"
          size="mini"
          class="backward"
          type="primary"
          @click="headIndex++"
        >
          下一步
        </el-button>
        <el-button
          v-show="headIndex === 3"
          size="mini"
          class="backward"
          type="primary"
          @click="submit_live_data()"
        >
          完成
        </el-button>
      </div>
    </div>
    <!-- 表单 -->
    <div class="content">
      <!-- 直播信息 -->
      <div
        v-show="headIndex === 1"
        class="tabs1"
      >
        <h3>基本信息</h3>
        <el-form
          :model="basicForm"
          :rules="basicFormRules"
        >
          <el-row class="block_label">
            <el-col :span="12">
              <el-form-item
                label="直播标题"
                prop="title"
              >
                <el-input
                  v-model="basicForm.title"
                  maxlength="32"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="所属分类"
                required
              >
                <el-select
                  ref="ref_liveClassification"
                  v-model="liveClassification_value"
                  popper-class="select_liveClassification"
                  placeholder="请选择"
                >
                  <el-option
                    :label="liveClassification_option.label"
                    :value="liveClassification_option.value"
                  >
                    <el-tree
                      :expand-on-click-node="false"
                      :data="liveClassification"
                      :props="liveClassification_props"
                      @node-click="liveClassification_nodeClick"
                    ></el-tree>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="直播状态"
                required
              >
                <el-select
                  v-model="select_liveStatus_value"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in select_liveStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="连麦数量"
                required
              >
                <el-tooltip placement="top">
                  <div
                    slot="content"
                    style="width:300px;"
                  >
                    <p>注意：需配合使用3.6以上版本客户端使用</p>
                    <p>连麦计费规则：</p>
                    <p>1V1-6：0.045元/分钟,1V7-16：0.135元/分钟</p>
                    <p>举例说明：</p>
                    <p>
                      您创建一个1v6直播，
                      直播60分钟，连麦计费单价为0.045元/分钟/人，如果所有角色（助教，嘉宾，观众均记为一个连麦者）都上课连麦满时，那么整场直播结算为：6人*60分钟*0.045元/人/分钟=16.2元
                    </p>
                    <p>
                      如果您创建的是1v7直播，但是实际同时连麦人数只有6人，在计算单价也会按照实际连麦人数（1v6
                      为0.045元/分钟）计算
                    </p>
                  </div>
                  <el-button
                    type="text"
                    style="color:#606266;"
                  >
                    <i class="el-icon-question"></i>
                  </el-button>
                </el-tooltip>
                <el-select
                  v-model="select_linkNumber_value"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in select_linkNumber"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item
                label="直播场景"
                required
                class="live_scene"
              >
                <el-row :gutter="20">
                  <el-col :span="5">
                    <div @click="toggle_scene = 'ppt'">
                      <img
                        v-show="toggle_scene == 'ppt'"
                        src="../../assets/images/live/live_act_screen.png"
                      />
                      <img
                        v-show="toggle_scene == 'topclass'"
                        src="../../assets/images/live/live_screen.png"
                      />
                      <p>云课堂</p>
                      <p>(三分屏)</p>
                    </div>
                  </el-col>
                  <el-col :span="5">
                    <div @click="toggle_scene = 'topclass'">
                      <img
                        v-show="toggle_scene == 'topclass'"
                        src="../../assets/images/live/live_act_vedio.png"
                      />
                      <img
                        v-show="toggle_scene == 'ppt'"
                        src="../../assets/images/live/live_vedio.png"
                      />
                      <p>直播助手</p>
                      <p>(纯视频)</p>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="课程封面"
                required
                class="live_upload_img"
              >
                <common-upload
                  v-model="ruleForm.imageUrl"
                  class="upload-demo"
                  drag
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :multiple="false"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    <div>将文件拖到此处，或<em>点击上传</em><br /></div>
                    <div
                      slot="tip"
                      class="el-upload__tip"
                    >
                      只能上传jpg/jpeg/png文件，且不超过10MB
                    </div>
                  </div>
                  <img
                    v-if="ruleForm.imageUrl[0]"
                    :src="ruleForm.imageUrl[ruleForm.imageUrl.length - 1].url"
                    class="avatar"
                  />
                </common-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <h3>
          <span style="margin-right: 10px;">直播预告</span>
          <el-tooltip placement="top">
            <div
              slot="content"
              style="width:300px;"
            >
              <p>实际开播时间由讲师控制，该预告作用为前台展示</p>
            </div>
            <el-button
              type="text"
              style="color:#606266;"
            >
              <i class="el-icon-question"></i>
            </el-button>
          </el-tooltip>
        </h3>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
        >
          <el-row class="block_label">
            <el-col :span="12">
              <el-form-item
                label="直播方式"
                required
              >
                <el-select
                  v-model="select_mode_value"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in select_mode"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col
              v-show="select_mode_value == 'cycle'"
              :span="12"
            >
              <el-form-item
                label="循环日期"
                required
              >
                <el-date-picker
                  v-model="loopTime"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  :clearable="false"
                  style="width: 20vw;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row
            v-show="select_mode_value == 'single'"
            class="block_label"
          >
            <el-col :span="12">
              <el-form-item
                label="开播时间"
                required
              >
                <el-date-picker
                  v-model="start_time"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="结束时间"
                required
              >
                <el-date-picker
                  v-model="end_time"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row
            v-show="select_mode_value == 'cycle'"
            class="block_label"
          >
            <el-col :span="12">
              <el-form-item
                label="循环周期"
                required
              >
                <el-select
                  v-model="select_loopCycle_value"
                  placeholder="请选择"
                  @change="toggle_loopCycle(select_loopCycle_value)"
                >
                  <el-option
                    v-for="item in select_loopCycle"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="直播日期"
                required
              >
                <el-select
                  v-model="select_mode_time_value"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择直播日期"
                >
                  <el-option
                    v-for="item in select_mode_time"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="select_mode_value !== 'single'">
            <el-col :span="24">
              <el-form-item
                label="直播设置"
                required
              >
                <el-button
                  type="text"
                  style="float:right;"
                  @click="add_table_liveTime(table_liveTime)"
                >
                  添加直播
                </el-button>
                <el-table
                  :data="table_liveTime"
                  stripe
                  style="width: 100%"
                >
                  <el-table-column
                    type="index"
                    width="100"
                    label="序号"
                  ></el-table-column>
                  <el-table-column label="开播时间">
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.start_time"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                      ></el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column label="结束时间">
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.end_time"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                      ></el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    fixed="right"
                    width="100px"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        size="small"
                        @click="delete_table_liveTime(table_liveTime, scope.$index)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <h3>直播详情</h3>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="直播介绍"
                prop="introduction"
                required
                class="lvie_details"
              >
                <tinymce
                  v-model="ruleForm.introduction"
                  :init="{ height: 100 }"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 关联讲师及课程 -->
      <div
        v-show="headIndex === 2"
        class="tabs2"
      >
        <div class="table_header">
          <h3 style="float:left;">
            讲师设置
          </h3>
          <el-button
            :disabled="teacherSetButton.guestButton"
            size="mini"
            @click="add_table_teacherSet_guest(2)"
          >
            添加嘉宾
          </el-button>
          <el-button
            :disabled="teacherSetButton.assistantButton"
            size="mini"
            @click="add_table_teacherSet_guest(3)"
          >
            添加助教
          </el-button>
        </div>
        <el-table
          :data="table_teacherSet"
          stripe
          style="width: 100%;margin-bottom:50px;"
        >
          <el-table-column label="名称">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.nameList_value"
                filterable
                remote
                :remote-method="query_teacherList"
                size="small"
                placeholder="请选择"
                @focus="get_teacherType(scope.row.type)"
                @change="
                  add_teacherList(scope.row.nameList_value, teachingTeacherList, scope.$index)
                "
              >
                <el-option
                  v-for="item in teachingTeacherList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="头衔"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.identity"
                maxlength="32"
                placeholder="请输入"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column width="100px"></el-table-column>
          <el-table-column label="角色">
            <template slot-scope="scope">
              {{ scope.row.role }}{{ scope.row.num }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100px"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.$index"
                type="text"
                size="small"
                @click="delete_table_teacherSet(table_teacherSet, scope.$index, scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="table_header">
          <h3 style="float:left;">
            关联课程
          </h3>
          <el-button
            size="mini"
            @click="show_relatedCourses_form('add')"
          >
            添加课程
          </el-button>
        </div>
        <el-table
          :data="table_relatedCourses"
          stripe
          style="width: 100%"
        >
          <el-table-column
            type="index"
            :index="table_relatedCourses_indexMethod"
            label="序号"
            width="100px;"
          >
          </el-table-column>
          <el-table-column
            prop="courseName"
            label="课程名称"
            width="200px;"
          >
          </el-table-column>
          <el-table-column
            prop="teacherName"
            label="讲师"
          ></el-table-column>
          <el-table-column
            label="操作"
            width="100px"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delete_table_relatedCourses(table_relatedCourses, scope.$index)"
              >
                删除
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="show_relatedCourses_form('edit', scope.row, scope.$index)"
              >
                修改
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div
        v-show="headIndex === 3"
        class="tabs3"
      >
        <el-form
          ref="ruleForm"
          :model="ruleForm"
           :rules="rules"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="关联方式">
                <div style="clear: both;">
                  <el-radio
                    v-model="radio_connectionMode"
                    label="all"
                  >
                    所有人可见
                  </el-radio>
                  <el-radio
                    v-model="radio_connectionMode"
                    label="code"
                  >
                    验证码观看
                  </el-radio>
                  <el-radio
                    v-model="radio_connectionMode"
                    label="direct"
                  >
                    关联学员
                  </el-radio>
                </div>
              </el-form-item>
              <p
                v-show="radio_connectionMode != 'direct'"
                style="color:rgba(0,11,21,0.85)"
              >
                学员总数：
              </p>
              <p
                v-show="radio_connectionMode == 'all'"
                style="color:rgba(0,11,21,0.25);"
              >
                学员登录平台即可观看，链接分享给任意人员可以进行观看。
              </p>
              <p
                v-show="radio_connectionMode == 'code'"
                style="color:rgba(0,11,21,0.25);"
              >
                学员登录平即可观看，链接分享给其他人员需要使用验证码。
              </p>
            </el-col>
          </el-row>
          <el-row
            v-show="radio_connectionMode == 'code'"
            class="block_label"
          >
            <el-col :span="12">
              <el-form-item
                label="欢迎标题"
                required
                 prop="title"
              >
                <el-input
                  v-model="formLiveTypeForm.title"
                  maxlength="32"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="验证码"
                required
                 prop="code"
              >
                <el-input
                  v-model="formLiveTypeForm.code"
                  maxlength="32"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="提示文案"
                required
                 prop="tips"
              >
                <el-input
                  v-model="formLiveTypeForm.tips"
                  maxlength="32"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item
                label="公众号二维码"
                required
                class="live_upload_img"
              >
                <common-upload
                  v-model="formLiveTypeForm.imgUrl"
                  class="upload-demo"
                  drag
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :multiple="false"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    <div>将文件拖到此处，或<em>点击上传</em><br /></div>
                    <div
                      slot="tip"
                      class="el-upload__tip"
                    >
                      只能上传jpg/jpeg/png文件，且不超过10MB
                    </div>
                  </div>
                  <img
                    v-if="formLiveTypeForm.imgUrl[0]"
                    :src="formLiveTypeForm.imgUrl[formLiveTypeForm.imgUrl.length - 1].url"
                    class="avatar"
                  />
                </common-upload>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-show="radio_connectionMode == 'direct'">
            <el-col :span="24">
              <el-form-item
                :label="'关联学员：' + table_relatedStudents.length + '人（仅关联学员可以观看）'"
              >
                <el-button
                  type="text"
                  @click="delete_batchTableStudent()"
                >
                  批量删除
                </el-button>

                <el-button
                  type="text"
                  style="float:right;"
                  @click="showDialog_add_student()"
                >
                  添加学员
                </el-button>
                <el-table
                  ref="table_relatedStudents"
                  :data="table_relatedStudents"
                  stripe
                  style="width: 100%"
                >
                  <el-table-column
                    type="selection"
                    width="55"
                  ></el-table-column>
                  <el-table-column
                    prop="userCode"
                    label="用户编号"
                  ></el-table-column>
                  <el-table-column
                    prop="name"
                    label="姓名"
                  ></el-table-column>
                  <el-table-column
                    prop="department"
                    label="所在部门"
                  ></el-table-column>
                  <el-table-column
                    prop="phone"
                    label="手机号码"
                  ></el-table-column>
                  <el-table-column
                    label="操作"
                    fixed="right"
                    width="100px"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        size="small"
                        @click="delete_table_relatedStudents(table_relatedStudents, scope.$index)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>

            <el-col
              :span="6"
              :offset="14"
            >
              <!-- :current-page.sync="StudentsPage.totalNo" -->
              <el-pagination
                layout="total,prev,pager,next,sizes,jumper"
                :total="dialogSelectStudent.length"
                :page-size.sync="StudentsPage.pageSize"
                @current-change="toggle_StudentsPage"
                @size-change="toggle_StudentsPageSize"
              >
                <span class="pageSizeInput">
                  <el-input class="pageSizeBorder"></el-input>条/页</span>
              </el-pagination>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-dialog
        :title="dialog_relatedCourses_type.title"
        custom-class="dialogCourse"
        :visible.sync="dialog_relatedCourses_form"
        append-to-body
        width="400px"
      >
        <el-form>
          <el-form-item
            label="讲师"
            required
          >
            <el-select
              v-model="add_relatedCourses_form.teacherVal"
              placeholder="请选择讲师"
              @change="query_liveCurriculum(add_relatedCourses_form.teacherVal)"
            >
              <el-option
                v-for="(item, index) in add_relatedCourses_form.teacher"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="直播课程"
            required
          >
            <el-select
              v-model="add_relatedCourses_form.coursesVal"
              placeholder="直播课程"
            >
              <el-option
                v-for="(item, index) in add_relatedCourses_form.courses"
                :key="index"
                :label="item.courseName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialog_relatedCourses_form = false">
            取 消
          </el-button>
          <el-button
            type="primary"
            @click="add_table_relatedCourses()"
          >
            确 定
          </el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="人员添加"
        custom-class=" dialogAddStudent"
        :visible.sync="dialog_add_student"
        append-to-body
        width="800px"
      >
        <el-row class="content_box">
          <el-col :span="12">
            <p class="selectNumber">
              未选：0人
            </p>
            <el-tabs
              v-model="activeName"
              stretch
              @tab-click="handleClick"
            >
              <el-tab-pane
                label="组织架构"
                name="first"
              >
                <el-input
                  placeholder="搜索组织或用户名称"
                  suffix-icon="el-icon-search"
                ></el-input>
                <el-tree
                  ref="organizationUserTree"
                  :data="organizationUser"
                  show-checkbox
                  :expand-on-click-node="false"
                  lazy
                  node-key="id"
                  :load="load_organizationUser"
                  :props="{ isLeaf: 'leaf' }"
                  @check="select_organizationUser"
                >
                  <span
                    slot-scope="{ node, data }"
                    class="custom-tree-node"
                  >
                    <span>{{ data.name }}</span>
                    <span v-show="data.phoneNum">({{ data.phoneNum }})</span>
                  </span>
                </el-tree>
              </el-tab-pane>
              <el-tab-pane
                label="其他人员"
                name="second"
                suffix-icon="el-icon-search"
              >
                <el-input placeholder="请输入用户名称或手机搜索"></el-input>
                <el-tree
                  :data="otherUser"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                  :expand-on-click-node="false"
                  @check="select_organizationUser"
                >
                  <span
                    slot-scope="{ node, data }"
                    class="custom-tree-node"
                  >
                    <span>{{ data.name }}({{ data.phoneNum }})</span>
                  </span>
                </el-tree>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="12">
            <p class="selectNumber">
              已选：{{ dialogSelectStudent.length }}人
            </p>
            <div class="select_student">
              <p
                v-for="(item, index) in dialogSelectStudent"
                :key="index"
              >
                <el-tag
                  closable
                  type="info"
                  @close="delete_dialog_selectStudent(dialogSelectStudent, index, item.id)"
                >
                  {{ item.name }}({{ item.phone }})
                </el-tag>
              </p>
            </div>
          </el-col>
        </el-row>

        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="medium "
            type="primary"
            @click="add_associateStudents(dialogSelectStudent, table_relatedStudents)"
          >
            确 定
          </el-button>
          <el-button
            size="medium "
            @click="dialog_add_student = false"
          >
            取 消
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  postAddLive,
  postEditLive,
  // getStudentList,
  getcategoryTree,
  getQueryTeacher,
  getQueryAssistant,
  getQueryCurriculum,
  getOrganizationUser,
  getOtherUser,
  getUsersByOrgId,
  getLiveDetails
} from '@/api/live/editLive'

export default {
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload')
  },
  data() {
    return {
      headIndex: 1, //步骤切换
      ruleForm: {
        imageUrl: [{}], // 图片
        introduction: '' // 富文本
      },

      /** tabs 1 的提交数据 */
      basicForm: {
        //基本信息表单
        title: '' // 直播标题
      },
      basicFormRules: {
        title: [{ required: true, message: '请输入直播标题', trigger: ['blur', 'change'] }]
      },

      liveClassification: [],
      liveClassification_value: '',
      liveClassification_option: {
        label: '',
        value: ''
      },
      liveClassification_props: {
        label: 'name',
        children: 'children'
      },
      toggle_scene: 'ppt', // 直播场景切换
      select_liveStatus_value: 1, //当前选择的状态
      select_liveStatus: [
        // 直播状态
        {
          value: 1,
          label: '正常'
        },
        {
          value: 2,
          label: '禁用'
        }
      ],
      select_linkNumber_value: '', // 当前选择的数量
      select_linkNumber: [
        // 连麦数量
        {
          value: 6,
          label: '1v1~6'
        },
        {
          value: 16,
          label: '1v7~16'
        }
      ],
      select_mode_value: 'single', // 当前选择的方式
      select_mode: [
        //直播方式
        {
          value: 'single',
          label: '单次直播'
        },
        {
          value: 'plural',
          label: '多次直播'
        },
        {
          value: 'cycle',
          label: '循环直播'
        }
      ],
      start_time: '', // 单次直播开始时间
      end_time: '', // 单次直播结束时间
      table_liveTime: [
        // 直播设置时间段
        {
          start_time: '',
          end_time: ''
        }
      ],
      select_mode_time_value: [], // 选择的直播日期
      select_mode_time: [], // 直播日期
      loopTime: [], // 循环日期
      select_loopCycle_value: '',
      select_loopCycle: [
        // 循环周期
        {
          value: 'day',
          label: '按天循环'
        },

        {
          value: 'week',
          label: '按周循环'
        },
        {
          value: 'month',
          label: '按月循环'
        }
      ],

      /** tabs 2 的提交数据 */
      table_teacherSet: [
        // 讲师设置
        {
          identity: '主讲师',
          nameList_value: '',
          role: '主讲师',
          type: 1 //1=主讲，2=助教，3=嘉宾
        }
      ],
      // 控制讲师设置两个button的启用
      teacherSetButton: {
        assistantButton: false,
        guestButton: false
      },
      // 要搜索的讲师类型
      index_teacherType: 1,
      teachingTeacherList: [],
      table_relatedCourses: [], // 关联课程表格数据
      dialog_relatedCourses_form: false,
      dialog_relatedCourses_type: {
        // 弹出框的标题设置
        title: '添加直播课程',
        type: 'edit',
        row: {}
      },
      //   添加课程弹窗表单数据
      add_relatedCourses_form: {
        teacherVal: '',
        teacher: [],
        coursesVal: '',
        courses: []
      },

      /** tabs 3 的提交数据 */
      radio_connectionMode: 'all', // 关联方式
      activeName: 'first',
      dialog_add_student: false,
      organizationUser: [],
      otherUser: [],
      dialogSelectStudent: [],
      table_relatedStudents: [],
      formLiveTypeForm: {
        title: '',
        code: '',
        tips: '',
        imgUrl: [{}]
      },
      rules: {
        baseTitle: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        title: [{ required: true, message: '请输入欢迎标题', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        tips: [{ required: true, message: '请输入提示文案', trigger: 'blur' }],
      },
      StudentsPage: {
        pageSize: 10
      }
    }
  },
  activated(){
     this.isgetcategoryTree();
  },
  created() {
    // 通过查看id是否存在判断是否是编辑
    if (this.$route.query.id) {
      this.setLiveDetails(this.$route.query.id)
    }
    //   获取直播分类
    getcategoryTree({
      source: 'live'
    }).then((res) => {
      this.liveClassification = res
    })
    // 获取其他用户
    getOtherUser({
      categoryId: '',
      pageNo: 1,
      pageSize: 99999
    }).then((res) => {
      this.otherUser = res.data

      this.otherUser.forEach((item) => {
        item.phoneNum = item.phonenum
        item.userCode = item.workNo
        item.id = item.userId
        item.type = 'user'
      })
    })
  },
  methods: {

     isgetcategoryTree() {
      getcategoryTree({
           source: 'live'
      }).then((res) => {
        this.liveClassification = res
      })
    },
    // 返回按钮返回上一页
    tocourseDraft() {
      this.$router.go(-1)
    },
    beforeAvatarUpload(file) {
      const regx = /^.*\.(jpg|jpeg|png)$/
      const isLt10M = file.size / 1024 / 1024 < 5

      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传图片只支持jpg|jpeg|png文件')
        return false
      }
      return true
    },
    // 多次直播和循环直播添加多个时间段
    add_table_liveTime(table) {
      table.push({
        start_time: '',
        end_time: ''
      })
    },
    // 多次直播和循环直播删除时间段
    delete_table_liveTime(arr, index) {
      arr.splice(index, 1)
    },
    // 切换循环周期
    toggle_loopCycle(val) {
      this.select_mode_time_value = []
      switch (val) {
        case 'day':
          this.select_mode_time = [
            {
              value: 1,
              label: '每天'
            }
          ]
          break
        case 'week':
          this.select_mode_time = [
            {
              value: 1,
              label: '周一'
            },
            {
              value: 2,
              label: '周二'
            },
            {
              value: 3,
              label: '周三'
            },
            {
              value: 4,
              label: '周四'
            },
            {
              value: 5,
              label: '周五'
            },
            {
              value: 6,
              label: '周六'
            },
            {
              value: 7,
              label: '周日'
            }
          ]
          break
        case 'month':
          this.select_mode_time = []
          for (var i = 0; i <= 30; i++) {
            this.select_mode_time.push({
              value: i + 1,
              label: i + 1 + '号'
            })
          }
          break
      }
    },
    // 为讲师设置中添加助教或者嘉宾 type==2 为嘉宾，type==3为助教
    add_table_teacherSet_guest(type) {
      var typeNum = this.get_table_teacherSet_typeNumber(this.table_teacherSet, type)
      switch (type) {
        case 2:
          if (typeNum < 2) {
            this.table_teacherSet.push({
              identity: '嘉宾',
              nameList_value: '',
              role: '嘉宾',
              num: typeNum + 1,
              type: 2
            })
          }

          if (typeNum == 1) {
            this.teacherSetButton.guestButton = true
          }

          break
        case 3:
          if (typeNum < 2) {
            this.table_teacherSet.push({
              identity: '助教',
              nameList_value: '',
              role: '助教',
              num: typeNum + 1,
              type: 3
            })
          }

          if (typeNum == 1) {
            this.teacherSetButton.assistantButton = true
          }

          break
      }
    },
    // 判断当前添加助教和嘉宾数量是否超过两个
    // 返回当前数量
    get_table_teacherSet_typeNumber(tables, type) {
      var arr = []
      tables.forEach((item) => {
        if (item.type == type) {
          arr.push(item)
        }
      })
      return arr.length
    },
    delete_table_teacherSet(arr, index, row) {
      arr.splice(index, 1)
      // 同时在关联课程中的教师列表删除该教师
      this.add_relatedCourses_form.teacher.splice(index, 1)
      arr.forEach((item) => {
        if (item.num == 2 && item.type == row.type) {
          if (row.type == 2) {
            this.teacherSetButton.guestButton = false
          } else {
            this.teacherSetButton.assistantButton = false
          }
          item.num--
        }
      })
    },
    // 关联课程序号处理小于10前置加0
    table_relatedCourses_indexMethod(index) {
      if (index < 9) {
        return '0' + (index + 1)
      } else {
        return index + 1
      }
    },
    // 关联课程弹出窗口根据类型判断 add or edit
    show_relatedCourses_form(type, row) {
      if (type == 'edit') {
        this.dialog_relatedCourses_type = {
          title: '修改直播课程',
          type: 'edit',
          row: row
        }
      } else {
        if (this.add_relatedCourses_form.teacher.length == 0) {
          this.$message({
            message: '请先完成讲师设置。',
            type: 'warning'
          })
          return false
        }
        this.dialog_relatedCourses_type = {
          title: '添加直播课',
          type: 'add'
        }
      }
      this.dialog_relatedCourses_form = true
    },
    showDialog_add_student() {
      this.dialog_add_student = true
    },
    // 关联学员表格批量删除
    delete_batchTableStudent() {
      this.$confirm('您确定要批量删除所选人员吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var index = ''
        this.$refs.table_relatedStudents.selection.forEach((item) => {
          index = this.table_relatedStudents.findIndex((rowItem) => rowItem.id == item.id)
          this.table_relatedStudents.splice(index, 1)
        })
      })
    },
    // 关联学员表格的分页跳转
    toggle_StudentsPage(page) {
      this.table_relatedStudents = []
      this.dialogSelectStudent.forEach((item, index) => {
        if (
          index >= this.StudentsPage.pageSize * (page - 1) &&
          index < this.StudentsPage.pageSize * page
        ) {
          this.table_relatedStudents.push({
            userCode: item.userCode,
            name: item.name,
            department: item.department,
            phone: item.phone,
            id: item.id
          })
        }
      })
    },
    toggle_StudentsPageSize(size) {
      this.StudentsPage.pageSize = size
    },
    // 获取讲师表格中每一行所选的嘉宾或教师组合为一个select
    get_table_teacherSet_teacher(table) {
      var arr = []
      var obj = {}
      table.forEach((item) => {
        obj = item.nameList.find((res) => {
          return res.value == item.nameList_value
        })
        arr.push(obj)
      })
      return arr
    },
    delete_table_relatedCourses(arr, index) {
      arr.splice(index, 1)
    },
    // 查看当前讲师直播课程
    query_liveCurriculum(id) {
      getQueryCurriculum({
        courseType: 3,
        pageSize: 1000,
        teacherId: id,
        pageNo: 1,
        isPutaway: 1,
        status: 1
      }).then((res) => {
        this.add_relatedCourses_form.courses = res.data
      })
    },
    // 添加/修改课程
    add_table_relatedCourses() {
      if (this.dialog_relatedCourses_type.type == 'add') {
        var data = {
          teacherName: '',
          teacherId: '',
          courseName: '',
          courseId: ''
        }

        var obj = this.add_relatedCourses_form.teacher.find((res) => {
          return res.id == this.add_relatedCourses_form.teacherVal
        })
        data.teacherId = obj.id
        data.teacherName = obj.name

        obj = this.add_relatedCourses_form.courses.find((res) => {
          return res.id == this.add_relatedCourses_form.coursesVal
        })

        data.courseId = obj.id
        data.courseName = obj.courseName

        this.table_relatedCourses.push(data)
      } else if (this.dialog_relatedCourses_type.type == 'edit') {
        obj = this.add_relatedCourses_form.teacher.find((res) => {
          return res.id == this.add_relatedCourses_form.teacherVal
        })
        this.dialog_relatedCourses_type.row.teacherId = obj.id
        this.dialog_relatedCourses_type.row.teacherName = obj.name

        obj = this.add_relatedCourses_form.courses.find((res) => {
          return res.id == this.add_relatedCourses_form.coursesVal
        })
        this.dialog_relatedCourses_type.row.courseId = obj.id
        this.dialog_relatedCourses_type.row.courseName = obj.courseName
      }
      this.dialog_relatedCourses_form = false
    },
    get_teacherType(type) {
      this.index_teacherType = type
      if (type == 1 && this.teachingTeacherList != []) {
        getQueryTeacher().then((res) => {
          this.teachingTeacherList = res
        })
      } else if (type != 1 && this.teachingTeacherList != []) {
        getQueryAssistant().then((res) => {
          this.teachingTeacherList = res
        })
      }
    },
    // 将讲师设置中所选的教师添加到教师列表供关联课程使用
    add_teacherList(val, list, index) {
      var data = list.find((item) => {
        return item.id == val
      })
      if (this.add_relatedCourses_form.teacher.length > index) {
        this.add_relatedCourses_form.teacher[index] = data
      } else {
        this.add_relatedCourses_form.teacher.push(data)
      }
    },
    // 查询教师列表
    query_teacherList(query) {
      switch (this.index_teacherType) {
        case 1:
          getQueryTeacher({
            name: query
          }).then((res) => {
            this.teachingTeacherList = res
          })
          break
        case 2:
          getQueryAssistant({
            name: query
          }).then((res) => {
            this.teachingTeacherList = res
          })
          break
        case 3:
          getQueryAssistant({
            name: query
          }).then((res) => {
            this.teachingTeacherList = res
          })
          break
      }
    },
    handleClick() {},

    delete_dialog_selectStudent(arr, index) {
      arr.splice(index, 1)
    },
    delete_table_relatedStudents(arr, index) {
      this.$confirm('您确定要删除该人员吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        arr.splice(index, 1)
      })
    },
    // 添加关联学员
    add_associateStudents() {
      // 获取第一页的数据
      this.toggle_StudentsPage(1)
      this.dialog_add_student = false
    },
    load_organizationUser(node, resolve) {
      if (node.level === 0) {
        getOrganizationUser({
          parentId: 1
        }).then((res) => {
          res.users.forEach((item) => {
            item.type = 'user'
            item.leaf = true
            item.id = item.userId
            res.orgs.push(item)
          })
          this.organizationUser = res.orgs
        })
      } else {
        if (node.data.type != 'user') {
          getOrganizationUser({
            parentId: node.data.id
          }).then((res) => {
            res.users.forEach((item) => {
              item.type = 'user'
              item.leaf = true
              item.id = item.userId
              res.orgs.push(item)
            })
            resolve(res.orgs)
          })
        } else {
          return resolve([])
        }
      }
    },
    // 将选中的组织或学员添加到已选中列表
    select_organizationUser(data, node) {
      if (node.checkedKeys.indexOf(data.id) != -1) {
        if (data.type == 'user') {
          this.dialogSelectStudent.push({
            name: data.name,
            phone: data.phoneNum,
            userCode: data.workNo,
            id: data.userId
          })
        } else {
          getUsersByOrgId({ orgId: data.id }).then((res) => {
            res.forEach((resitem) => {
              var index = this.dialogSelectStudent.findIndex((item) => item.id == resitem.id)
              if (index == -1) {
                this.dialogSelectStudent.push({
                  name: resitem.name,
                  phone: resitem.phonenum,
                  userCode: resitem.workNo,
                  id: resitem.id
                })
              }
            })
          })
        }
      } else {
        if (data.type == 'user') {
          var index = this.dialogSelectStudent.findIndex((item) => item.id == data.userId)
          this.dialogSelectStudent.splice(index, 1)
        } else {
          getUsersByOrgId({ orgId: data.id }).then((res) => {
            res.forEach((resitem) => {
              var index = this.dialogSelectStudent.findIndex((item) => item.id == resitem.id)
              this.dialogSelectStudent.splice(index, 1)
            })
          })
        }
      }
    },
    // 在所属分类中点击树状菜单，将值赋值到option
    liveClassification_nodeClick(data) {
      this.liveClassification_option.label = data.name
      this.liveClassification_option.value = data.idStr
      this.liveClassification_value = data.idStr
      this.$refs.ref_liveClassification.blur()
    },
    // 提交直播信息
    submit_live_data() {
      var data = {
        batchDeclare: this.select_mode_value, // 直播方式 single：单次；plural：多次；cycle：循环
        categoryId: this.liveClassification_value, // 所属分类
        channelName: this.basicForm.title, // 直播标题
        linkMicLimit: this.select_linkNumber_value, //  最大连麦数量
        isUsed: this.select_liveStatus_value, // 直播状态
        remark: _.escape(this.ruleForm.introduction), // 直播介绍
        scene: this.toggle_scene, // 直播场景
        lecturerId: this.table_teacherSet[0].nameList_value, //  主讲师设置
        coverImageUrl: this.ruleForm.imageUrl[this.ruleForm.imageUrl.length - 1].url // 直播封面图
      }

      // 提交关联课程数据
      if (this.table_relatedCourses.length > 0) {
        data.courses = []
        this.table_relatedCourses.forEach((item) => {
          data.courses.push(item.courseId)
        })
      }
      // 直播方式，如果为多次或循环直播添加其他字段
      if (data.batchDeclare == 'cycle') {
        data.cycleInfo = {
          cycleDateRange: this.loopTime[0] + '~' + this.loopTime[1],
          cycleMode: this.select_loopCycle_value,
          cycleTime: this.select_mode_time_value.toString()
        }
      }
      if (data.batchDeclare == 'single') {
        data.liveBatch = []
        data.liveBatch.push({
          startTime: this.start_time,
          endTime: this.end_time
        })
      } else {
        data.liveBatch = []
        this.table_liveTime.forEach((item) => {
          if (item.id) {
            data.liveBatch.push({
              id: item.id,
              startTime: item.start_time,
              endTime: item.end_time
            })
          } else {
            data.liveBatch.push({
              startTime: item.start_time,
              endTime: item.end_time
            })
          }
        })
      }

      // 观众授权方式。直接授权:direct，验证码授权:code, 默认为空表示所有人可见
      switch (this.radio_connectionMode) {
        case 'all':
          data.authType = ''
          break
        case 'direct':
          data.authType = this.radio_connectionMode
          // 提交关联学员数据
          if (this.table_relatedStudents.length) {
            data.userAndOrgIds = {
              users: []
            }
            this.table_relatedStudents.forEach((item) => {
              data.userAndOrgIds.users.push(item.id)
            })
          }
          break
        case 'code':
          data.authType = this.radio_connectionMode
          data.codeLinkInfo = {
            //当authType=code时，需要此参数，其他不需要
            welcomeTitle: this.formLiveTypeForm.title,
            captcha: this.formLiveTypeForm.code,
            notice: this.formLiveTypeForm.tips,
            QRCodeUrl: this.formLiveTypeForm.imgUrl[this.formLiveTypeForm.imgUrl.length - 1].url
          }
          break
      }

      if (this.$route.query.id) {
        data.liveId = this.$route.query.id
        postEditLive(data).then(() => {
          this.$router.push({ path: '/live/liveList' })
        })
      } else {
        postAddLive(data).then(() => {
          this.$router.push({ path: '/live/liveList' })
        })
      }
    },
    setLiveDetails(id) {
      // getStudentList({
      //   liveId: id,
      //   pageNo: 1,
      //   pageSize: 1000
      // }).then(res=>{
      //   console.log(res)
      // })
      getLiveDetails({
        liveId: id
      }).then((res) => {
        (this.basicForm.title = res.channelName),
          (this.liveClassification_option.label = res.categoryName)
        this.liveClassification_option.value = res.categoryId
        this.liveClassification_value = res.categoryId
        this.select_liveStatus_value = res.isUsed
        this.select_linkNumber_value = res.linkMicLimit
        this.toggle_scene = res.scene
        this.ruleForm.imageUrl[0].url = res.coverImageUrl
        this.ruleForm.introduction = _.unescape(res.remark)
        this.select_mode_value = res.batchDeclare
        this.teachingTeacherList = [
          {
            name: res.lecturerName,
            id: res.lecturerId
          }
        ]

        this.add_relatedCourses_form.teacher.push({
          name: res.lecturerName,
          id: res.lecturerId
        })

        this.table_teacherSet[0].nameList_value = res.lecturerId
        this.table_relatedCourses = res.courses

        // 直播设置
        switch (this.select_mode_value) {
          case 'single':
            this.start_time = res.liveBatch[0].startTime
            this.end_time = res.liveBatch[0].endTime
            break
          case 'plural':
            this.table_liveTime = []
            res.liveBatch.forEach((item) => {
              this.table_liveTime.push({
                id: item.id,
                start_time: item.startTime,
                end_time: item.endTime
              })
            })
            break
          case 'cycle':
            var loopTimeArr = res.cycleInfo.cycleDateRange.split('~')
            this.loopTime.push(loopTimeArr[0])
            this.loopTime.push(loopTimeArr[1])
            this.select_loopCycle_value = res.cycleInfo.cycleMode
            this.toggle_loopCycle(this.select_loopCycle_value)
            var arr = res.cycleInfo.cycleTime.split(',')
            arr.forEach((item) => {
              this.select_mode_time_value.push(parseInt(item))
            })
            this.table_liveTime = []
            res.liveBatch.forEach((item) => {
              this.table_liveTime.push({
                id: item.id,
                start_time: item.startTime,
                end_time: item.endTime
              })
            })

            break
        }

        switch (res.authType) {
          case '':
            this.radio_connectionMode = 'all'
            break
          case 'direct':
            this.radio_connectionMode = 'direct'
            break
          case 'code':
            this.radio_connectionMode = 'code'
            this.formLiveTypeForm.title = res.codeLinkInfo.welcomeTitle
            this.formLiveTypeForm.code = res.codeLinkInfo.captcha
            this.formLiveTypeForm.tips = res.codeLinkInfo.notice
            // this.formLiveTypeForm.imgUrl[0].url = res.codeLinkInfo.QRCodeUrl
            break
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit_live {
  color: #666666;
  width: 100%;
  margin: 0;
  padding: 0;
  // 头部
  .head {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: #fff;
    height: 60px;
    width: 100%;
    border-top: 1px solid #d7d7d7;
    border-bottom: 1px solid #d7d7d7;
    box-shadow: 0px 2px 13px -6px #666666;
    .btns {
      margin-top: 8px;
      margin-right: 25px;
      position: absolute;
      top: 10px;
      right: 0;
      display: flex;
    }
    .schedule {
      margin: 0 auto;
      width: 60%;
      display: flex;
      justify-content: space-around;
      .schedule1,
      .schedule2,
      .schedule3 {
        cursor: pointer;
      }
    }

    .icon {
      font-size: 28px;
      margin-left: 30px;
      position: absolute;
      top: 15px;
      left: 20px;
      cursor: pointer;
    }
  }
  // 基本信息样式
  .content {
    box-sizing: border-box;
    margin: 20px auto;
    background-color: #fff;
    width: 80%;
    padding: 10vh 10vw;
    .block_label {
      /deep/.el-input {
        width: 20vw;
      }
    }
  }
}

.sign {
  color: #3d7fff;
}
.live_scene,
.lvie_details,
.live_upload_img {
  /deep/ label {
    float: initial;
  }
  img {
    width: 100%;
  }
  p {
    text-align: center;
    margin: 0;
    line-height: 25px;
  }
}
.upload-demo {
  position: relative;
  .avatar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
}
.live_upload_img {
  /deep/.el-upload__tip {
    line-height: 0;
  }
}
.table_header {
  text-align: right;
  margin: 15px 0;
}
.forwardBackward {
  padding-right: 15px;
  width: 180px;
  text-align: right;
}

.dialogCourse {
  .el-select {
    width: 100%;
  }
}
.dialogAddStudent {
  .content_box {
    border: 1px #ccc solid;
    border-radius: 3px;
    > div:first-child {
      border-right: 1px #ccc solid;
      .el-input {
        width: 90%;
        display: block;
        margin: auto;
      }
    }
    .el-tabs {
      height: 500px;
      .el-tree {
        margin-top: 8px;
        margin-left: 15px;
        overflow-y: scroll;
        height: 410px;
      }
    }
    .selectNumber {
      padding: 0 0 15px 30px;
      margin-bottom: 0;
      border-bottom: 1px #ccc solid;
    }
    > div:last-child {
      > div {
        padding-left: 20px;
        overflow-y: scroll;
        height: 500px;
      }
    }
  }
}

.select_liveClassification {
  .el-select-dropdown__item {
    height: auto;
    background: transparent;
  }
}
</style>
