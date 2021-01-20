<template>
  <div class="edit_live">
    <!-- 头部 -->
    <div class="head">
      <!-- <i class="el-icon-arrow-left icon" @click="tocourseDraft"></i>返回 -->
      <div class="schedule">
        <div
          :class="{ sign: headIndex === 1 }"
          class="schedule1"
          @click="headIndex = 1"
        >
          <i class="el-icon-info"></i> 直播信息
        </div>
        <div
          :class="{ sign: headIndex === 2 }"
          class="schedule2"
          @click="headIndex = 2"
        >
          <i class="el-icon-s-marketing"></i> 关联讲师及课程
        </div>
        <div
          :class="{ sign: headIndex === 3 }"
          class="schedule3"
          @click="headIndex = 3"
        >
          <i class="el-icon-s-tools"></i> 观看条件
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
        <el-form :model="basicForm">
          <el-row class="block_label">
            <el-col :span="12">
              <el-form-item
                label="直播标题"
                required
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
                  v-model="value"
                  popper-class="select_liveClassification"
                  placeholder="请选择"
                >
                  <el-option>
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
                    <div @click="toggle_scene = 1">
                      <img
                        v-show="toggle_scene == 1"
                        src="../../assets/images/live/live_act_screen.png"
                      />
                      <img
                        v-show="toggle_scene == 2"
                        src="../../assets/images/live/live_screen.png"
                      />
                      <p>云课堂</p>
                      <p>(三分屏)</p>
                    </div>
                  </el-col>
                  <el-col :span="5">
                    <div @click="toggle_scene = 2">
                      <img
                        v-show="toggle_scene == 2"
                        src="../../assets/images/live/live_act_vedio.png"
                      />
                      <img
                        v-show="toggle_scene == 1"
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
              v-show="select_mode_value == 3"
              :span="12"
            >
              <el-form-item
                label="循环日期"
                required
              >
                <el-date-picker
                  v-model="loopTime"
                  type="datetime"
                  placeholder="选择日期时间"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row
            v-show="select_mode_value == 1"
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
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row
            v-show="select_mode_value == 3"
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
          <el-row v-show="select_mode_value !== 1">
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
                      ></el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column label="结束时间">
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.end_time"
                        type="datetime"
                        placeholder="选择日期时间"
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
                prop="name"
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
            size="mini"
            @click="add_table_teacherSet_guest(2)"
          >
            添加嘉宾
          </el-button>
          <el-button
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
                size="small"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in scope.row.nameList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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
                @click="delete_table_teacherSet(table_teacherSet, scope.$index, scope.row.type)"
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
            @click="show_relatedCourses_form(table_teacherSet, 'add')"
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
            prop="coursesCode"
            label="课程编号"
            width="200px;"
          >
          </el-table-column>
          <el-table-column
            prop="coursesName"
            label="课程名称"
            width="200px;"
          >
          </el-table-column>
          <el-table-column
            prop="teacher"
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
                @click="edit_table_relatedCourses(scope.row, scope.$index, 'edit')"
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
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="关联方式">
                <div style="clear: both;">
                  <el-radio
                    v-model="radio_connectionMode"
                    label="1"
                  >
                    所有人可见
                  </el-radio>
                  <el-radio
                    v-model="radio_connectionMode"
                    label="2"
                  >
                    验证码观看
                  </el-radio>
                  <el-radio
                    v-model="radio_connectionMode"
                    label="3"
                  >
                    关联学员
                  </el-radio>
                </div>
              </el-form-item>
              <p
                v-show="radio_connectionMode != 3"
                style="color:rgba(0,11,21,0.85)"
              >
                学员总数：
              </p>
              <p
                v-show="radio_connectionMode == 1"
                style="color:rgba(0,11,21,0.25);"
              >
                学员登录平台即可观看，链接分享给任意人员可以进行观看。
              </p>
              <p
                v-show="radio_connectionMode == 2"
                style="color:rgba(0,11,21,0.25);"
              >
                学员登录平即可观看，链接分享给其他人员需要使用验证码。
              </p>
            </el-col>
          </el-row>
          <el-row
            v-show="radio_connectionMode == 2"
            class="block_label"
          >
            <el-col :span="12">
              <el-form-item
                label="欢迎标题"
                required
              >
                <el-input
                  v-model="ruleForm.name"
                  maxlength="32"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="验证码"
                required
              >
                <el-input
                  v-model="ruleForm.name"
                  maxlength="32"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="提示文案"
                required
              >
                <el-input
                  v-model="ruleForm.name"
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

          <el-row v-show="radio_connectionMode == 3">
            <el-col :span="24">
              <el-form-item label="关联学员：58人（仅关联学员可以观看）">
                <el-button
                  type="text"
                  style="float:right;"
                  @click="dialog_add_student = true"
                >
                  添加学员
                </el-button>
                <el-table
                  :data="table_relatedStudents"
                  stripe
                  style="width: 100%"
                >
                  <el-table-column
                    type="no"
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
              v-model="add_relatedCourses_form_value"
              placeholder="请选择讲师"
            >
              <el-option
                v-for="item in add_relatedCourses_form.teacher"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="直播课程"
            required
          >
            <el-select
              v-model="add_relatedCourses_form.courses"
              placeholder="直播课程"
            >
              <el-option
                label="区域一"
                value="shanghai"
              ></el-option>
              <el-option
                label="区域二"
                value="beijing"
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
                  :data="props"
                  show-checkbox
                ></el-tree>
              </el-tab-pane>
              <el-tab-pane
                label="其他人员"
                name="second"
                suffix-icon="el-icon-search"
              >
                <el-input placeholder="请输入用户名称或手机搜索"></el-input>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="12">
            <p class="selectNumber">
              已选：{{ dialogSelectStudent.length }}人
            </p>
            <div>
              <p
                v-for="(item, index) in dialogSelectStudent"
                :key="index"
              >
                <el-tag
                  closable
                  type="info"
                  @close="delete_dialog_selectStudent(dialogSelectStudent, index)"
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
            @click="dialog_add_student = false"
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
import { postAddLive, getcategoryTree } from '@/api/live/editLive'

export default {
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload')
  },
  data() {
    const generateData = (_) => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        })
      }
      return data
    }
    return {
      headIndex: 1, //步骤切换

      ruleForm: {
        imageUrl: [{}] // 图片
      },

      /** tabs 1 的提交数据 */
      basicForm: {
        //基本信息表单
        title: '' // 直播标题
      },

      liveClassification: [
        {
          // 所属分类
          name: '一级 1',
          id: '1',
          children: [
            {
              name: '二级 1-1',
              id: '1',
              children: [
                {
                  name: '三级 1-1-1',
                  id: '1'
                }
              ]
            }
          ]
        }
      ],
      liveClassification_props: {
        label: 'name',
        children: 'children'
      },
      toggle_scene: 1, // 直播场景切换
      select_liveStatus_value: 1, //当前选择的状态
      select_liveStatus: [
        // 直播状态
        {
          value: 1,
          label: '禁用'
        },
        {
          value: 2,
          label: '正常'
        }
      ],
      select_linkNumber_value: 1, // 当前选择的数量
      select_linkNumber: [
        // 连麦数量
        {
          value: 1,
          label: '1v1~6'
        },
        {
          value: 2,
          label: '1v7~16'
        }
      ],
      select_mode_value: 1, // 当前选择的方式
      select_mode: [
        //直播方式
        {
          value: 1,
          label: '单次直播'
        },
        {
          value: 2,
          label: '多次直播'
        },
        {
          value: 3,
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
      select_mode_time_value: '', // 选择的直播日期
      select_mode_time: [], // 直播日期
      loopTime: '', // 循环日期
      select_loopCycle_value: '',
      select_loopCycle: [
        // 循环周期
        {
          value: 1,
          label: '按天循环'
        },

        {
          value: 2,
          label: '按周循环'
        },
        {
          value: 3,
          label: '按月循环'
        }
      ],

      /** tabs 2 的提交数据 */
      table_teacherSet: [
        // 讲师设置
        {
          identity: '主讲师',
          nameList_value: 1,
          nameList: [
            {
              value: 1,
              label: '李老师'
            }
          ],
          role: '主讲师',
          type: 1
        }
      ],
      table_relatedCourses: [
        // 关联课程
        {
          coursesCode: '5544899644',
          coursesName: '语文',
          teacher: '李老师',
          teacherId: 1
        },
        {
          coursesCode: '5544899644',
          coursesName: '语文',
          teacher: '李老师',
          teacherId: 1
        }
      ],
      dialog_relatedCourses_form: false,
      dialog_relatedCourses_type: {
        // 弹出框的标题设置
        title: '添加直播课程',
        type: 'edit',
        row: {}
      },
      add_relatedCourses_form_value: 1,
      add_relatedCourses_form: {
        teacher: [
          {
            value: 1,
            label: ''
          }
        ],
        courses: [
          {
            value: 1,
            label: '语文'
          }
        ]
      },

      /** tabs 3 的提交数据 */
      radio_connectionMode: '1',
      activeName: 'first',
      dialog_add_student: false,
      props: [
        {
          label: '广州分公司',
          children: [
            {
              label: '市场部',
              children: [
                {
                  label: '杨超越'
                }
              ]
            }
          ]
        }
      ],
      dialogSelectStudent: [
        {
          id: 1,
          name: '杨超越',
          userCode: '321321',
          department: '研发部',
          phone: '13589654263'
        },
        {
          id: 2,
          name: '杨超越1',
          userCode: '321321',
          department: '研发部',
          phone: '13589654263'
        }
      ],
      table_relatedStudents: [
        {
          no: 1,
          userCode: '321321',
          name: '何宇非',
          department: '研发部',
          phone: '18718571732'
        }
      ]
    }
  },
  created() {
    getcategoryTree({
      source: 'live'
    }).then((res) => {
      this.liveClassification = res
    })
  },
  methods: {
    beforeAvatarUpload(file) {
      const regx = /^.*\.(jpg|jpeg|png)$/
      const isLt10M = file.size / 1024 / 1024 < 5

      if (!isLt10M) {
        this.$message.error('上传课件大小不能超过 10MB!')
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
      this.select_mode_time_value = ''
      switch (val) {
        case 1:
          this.select_mode_time = [
            {
              value: 1,
              label: '每天'
            }
          ]
          break
        case 2:
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
        case 3:
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
          if (typeNum == 2) {
            this.$message.error('最多只能添加2位嘉宾')
          } else {
            this.table_teacherSet.push({
              identity: '嘉宾',
              nameList_value: 1,
              nameList: [
                {
                  value: 1,
                  label: '赵老师'
                }
              ],
              role: '嘉宾',
              num: typeNum + 1,
              type: 2
            })
          }
          break
        case 3:
          if (typeNum == 2) {
            this.$message.error('最多只能添加2位助教')
          } else {
            this.table_teacherSet.push({
              identity: '助教',
              nameList_value: 1,
              nameList: [
                {
                  value: 1,
                  label: '王老师'
                }
              ],
              role: '助教',
              num: typeNum + 1,
              type: 3
            })
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
    delete_table_teacherSet(arr, index, type) {
      arr.splice(index, 1)
      arr.forEach((item) => {
        if (item.num == 2) {
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
    show_relatedCourses_form(table_teacherSet) {
      this.add_relatedCourses_form.teacher = this.get_table_teacherSet_teacher(table_teacherSet)
      this.dialog_relatedCourses_type = {
        title: '添加直播课',
        type: 'add'
      }
      this.dialog_relatedCourses_form = true
    },
    delete_table_relatedCourses(arr, index) {
      arr.splice(index, 1)
    },
    edit_table_relatedCourses(row, index) {
      this.dialog_relatedCourses_type = {
        title: '修改直播课程',
        type: 'edit',
        row: row
      }
      this.dialog_relatedCourses_form = true
    },
    // 获取讲师设置所选教师
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
    add_table_relatedCourses() {
      if (this.dialog_relatedCourses_type.type == 'add') {
        this.table_relatedCourses.push({
          coursesCode: '5544899644',
          coursesName: '语文',
          teacher: '李老师',
          teacherId: 1
        })
      } else if (this.dialog_relatedCourses_type.type == 'edit') {
        this.dialog_relatedCourses_type.row.teacher = this.add_relatedCourses_form_value
      }
      this.dialog_relatedCourses_form = false
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },

    handleClick() {},
    // 树形控件
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region1' }, { name: 'region2' }])
      }
      if (node.level > 3) return resolve([])

      var hasChild
      if (node.data.name === 'region1') {
        hasChild = true
      } else if (node.data.name === 'region2') {
        hasChild = false
      } else {
        hasChild = Math.random() > 0.5
      }

      setTimeout(() => {
        var data
        if (hasChild) {
          data = [
            {
              name: 'zone' + this.count++
            },
            {
              name: 'zone' + this.count++
            }
          ]
        } else {
          data = []
        }

        resolve(data)
      }, 500)
    },
    delete_dialog_selectStudent(arr, index) {
      arr.splice(index, 1)
    },
    delete_table_relatedStudents(arr, index) {
      arr.splice(index, 1)
    },
    submit_live_data() {
      postAddLive({
        authType: '',
        codeLinkInfo: {
          welcomeTitle: '',
          captcha: '',
          notice: '',
          batchDeclare: '' // 直播方式 single：单次；plural：多次；cycle：循环
        }
      }).then(() => {})
    },
    //
    liveClassification_nodeClick(data) {}
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
    // .tabs1, .tabs3 {
    // 	/deep/.el-input {
    // 		width: 20vw;
    // 	}
    // }
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
