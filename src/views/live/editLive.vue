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
          @click="changeTable(1)"
        >
          <i class="el-icon-video-camera"></i> 直播信息
        </div>
        <div
          :class="{ sign: headIndex === 2 }"
          class="schedule2"
          @click="changeTable(2)"
        >
          <i class="el-icon-document-copy"></i> 关联讲师及课程
        </div>
        <div
          :class="{ sign: headIndex === 3 }"
          class="schedule3"
          @click="changeTable(3)"
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
          @click="liveNextTable(headIndex)"
        >
          下一步
        </el-button>
        <el-button
          v-if="isRelease === '0'"
          size="mini"
          class="backward"
          type="default"
          @click="submit_live_data(2)"
        >
          存草稿
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
          ref="basicForm"
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
                  v-model.trim="basicForm.title"
                  maxlength="32"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="所属分类"
                prop="liveClassification_value"
              >
                <el-select
                  ref="setliveClassificationValue"
                  v-model="basicForm.liveClassification_value"
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
                prop="select_liveStatus_value"
              >
                <el-select
                  v-model="basicForm.select_liveStatus_value"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in select_liveStatus"
                    :key="item.value"
                    :disabled="isRelease === '1' && item.value === 2 ? true : false"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="连麦数量"
                prop="select_linkNumber_value"
              >
                <el-tooltip placement="top">
                  <div
                    slot="content"
                    style="width: 300px"
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
                    style="color: #606266"
                  >
                    <i class="el-icon-question"></i>
                  </el-button>
                </el-tooltip>
                <el-select
                  v-model="basicForm.select_linkNumber_value"
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
            <el-col :span="12">
              <el-form-item label="知识体系">
                <tree-selector
                  v-model="basicForm.knowledgeSystemId"
                  style="width: 100%;"
                  class="selector"
                  :options="knowledgeTree"
                  placeholder="请选择"
                  :props="{
                    value: 'id',
                    label: 'name',
                    children: 'children'
                  }"
                  :filterable="true"
                  @focus="getKnowledgeList"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="直播场景"
                required
                class="live_scene"
              >
                <el-tooltip
                  v-if="isEdit"
                  class="item"
                  effect="dark"
                  content="直播场景不允许修改"
                  placement="left"
                >
                  <el-row :gutter="20">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="适用于：PPT+视频教学，多人音视频互动（选择后不可更改）"
                      placement="top"
                    >
                      <el-col :span="5">
                        <div
                          :style="{ pointerEvents: isEdit ? 'none' : '' }"
                          @click="toggle_scene = 'ppt'"
                        >
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
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="适用于：活动拍摄，屏幕共享直播（选择后不可更改）"
                      placement="top"
                    >
                      <el-col :span="5">
                        <div
                          :style="{ pointerEvents: isEdit ? 'none' : '' }"
                          @click="toggle_scene = 'topclass'"
                        >
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
                    </el-tooltip>
                  </el-row>
                </el-tooltip>
                <el-row
                  v-else
                  :gutter="20"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="适用于：PPT+视频教学，多人音视频互动（选择后不可更改）"
                    placement="top"
                  >
                    <el-col :span="5">
                      <div
                        :style="{ pointerEvents: isEdit ? 'none' : '' }"
                        @click="toggle_scene = 'ppt'"
                      >
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
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="适用于：活动拍摄，屏幕共享直播（选择后不可更改）"
                    placement="top"
                  >
                    <el-col :span="5">
                      <div
                        :style="{ pointerEvents: isEdit ? 'none' : '' }"
                        @click="toggle_scene = 'topclass'"
                      >
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
                  </el-tooltip>
                </el-row>
              </el-form-item>
            </el-col>

            <!-- <el-col :span="24">
              <el-form-item
                label="课程封面"
                class="live_upload_img"
                 prop="imageUrl"
              >
                <common-upload
                  v-model="basicForm.imageUrl"
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
                    v-if="basicForm.imageUrl[0]"
                    :src="basicForm.imageUrl[basicForm.imageUrl.length - 1].url"
                    class="avatar"
                  />
                </common-upload>
              </el-form-item>
            </el-col>  -->
            <el-col :span="10">
              <el-form-item
                class="live_upload_img"
                label="课程封面"
                prop="imageUrl"
              >
                <common-upload
                  v-model="basicForm.imageUrl"
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
                    v-if="basicForm.imageUrl[0]"
                    :src="basicForm.imageUrl[basicForm.imageUrl.length - 1].url"
                    class="avatar"
                  />
                </common-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <!--</el-form> -->

          <h3>
            <span style="margin-right: 10px">直播预告</span>
            <el-tooltip placement="top">
              <div
                slot="content"
                style="width: 300px"
              >
                <p>实际开播时间由讲师控制，该预告作用为前台展示</p>
              </div>
              <el-button
                type="text"
                style="color: #606266"
              >
                <i class="el-icon-question"></i>
              </el-button>
            </el-tooltip>
          </h3>
          <!-- <el-form
          ref="ruleForm"
          :model="ruleForm"
        > -->
          <el-row class="block_label">
            <el-col :span="12">
              <el-form-item
                label="直播方式"
                prop="select_mode_value"
              >
                <el-select
                  v-model="basicForm.select_mode_value"
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
              v-show="basicForm.select_mode_value == 'cycle'"
              :span="12"
            >
              <el-form-item
                label="循环日期"
                prop="loopTime"
              >
                <el-date-picker
                  v-model="basicForm.loopTime"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  :clearable="false"
                  style="width: 22vw"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row
            v-show="basicForm.select_mode_value == 'single'"
            class="block_label"
          >
            <el-col :span="12">
              <el-form-item
                label="开播时间"
                prop="start_time"
              >
                <el-date-picker
                  v-model="basicForm.start_time"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="结束时间"
                prop="end_time"
              >
                <el-date-picker
                  v-model="basicForm.end_time"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row
            v-show="basicForm.select_mode_value == 'cycle'"
            class="block_label"
          >
            <el-col :span="12">
              <el-form-item
                label="循环周期"
                prop="select_loopCycle_value"
              >
                <el-select
                  v-model="basicForm.select_loopCycle_value"
                  placeholder="请选择"
                  @change="toggle_loopCycle(basicForm.select_loopCycle_value)"
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
                prop="select_mode_time_value"
              >
                <el-select
                  v-model="basicForm.select_mode_time_value"
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
          <el-row v-if="basicForm.select_mode_value !== 'single'">
            <el-col :span="24">
              <el-form-item
                label="直播设置"
                required
                prop="table_liveTime_str"
              >
                <el-button
                  type="text"
                  style="float: right"
                  @click="add_table_liveTime(basicForm.table_liveTime)"
                >
                  添加直播
                </el-button>
                <el-table
                  :data="basicForm.table_liveTime"
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
                        @click="delete_table_liveTime(basicForm.table_liveTime, scope.$index)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
          <!--  </el-form> -->
          <h3>直播详情</h3>
          <!--  <el-form
          ref="ruleForm"
          :model="ruleForm"
        > -->
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="直播介绍"
                prop="introduction"
                required
                class="lvie_details"
              >
                <tinymce
                  v-model.trim="basicForm.introduction"
                  :init="{ height: 100 }"
                />
                <div class="limitWords">
                  {{ limitWords }}字
                </div>
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
          <h3 style="float: left">
            讲师设置
            <el-tooltip
              class="item"
              effect="dark"
              content="最多只能添加两个嘉宾、两个助教"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
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
          style="width: 100%; margin-bottom: 50px"
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
                @change="add_teacherList(scope.row.nameList_value, scope.row.type, scope.$index)"
              >
                <el-option
                  v-for="(item, i) in getList(scope.row.type)"
                  :key="i"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <!-- <el-table-column
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
          </el-table-column> -->
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
          <h3 style="float: left">
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
        <section class="section__class">
          <div class="header">
            <span class="header--title">考试安排</span>
            <el-button
              size="mini"
              @click="handleEditExamine(null)"
            >
              添加考试
            </el-button>
          </div>
          <common-table
            :config="examine.config"
            :columns="examine.columns"
            :data="examine.data"
          >
            <template #examTime="{row}">
              {{ row.examTime[0] }} 至 {{ row.examTime[1] }}
            </template>
            <template #reckonTimeValue="{row}">
              {{ !row.reckonTime ? '不计时' : row.reckonTimeValue }}
            </template>
            <template #handler="{row}">
              <el-button
                type="text"
                @click="handleEditExamine(row)"
              >
                修改
              </el-button>
              <el-button
                type="text"
                @click="handleDeleteExamine(row)"
              >
                删除
              </el-button>
            </template>
          </common-table>
        </section>
      </div>
      <div
        v-show="headIndex === 3"
        class="tabs3"
      >
        <el-form
          ref="formLiveTypeForm"
          :model="formLiveTypeForm"
          :rules="rules"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="关联方式">
                <div style="clear: both">
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
                style="color: rgba(0, 11, 21, 0.85)"
              >
                学员总数：
              </p>
              <p
                v-show="radio_connectionMode == 'all'"
                style="color: rgba(0, 11, 21, 0.25)"
              >
                学员登录平台即可观看，链接分享给任意人员可以进行观看。
              </p>
              <p
                v-show="radio_connectionMode == 'code'"
                style="color: rgba(0, 11, 21, 0.25)"
              >
                学员登录平台即可观看，链接分享给其他人员需要使用验证码。
              </p>
              <div v-show="radio_connectionMode == 'all'">
                <div>
                  <span style="margin-right: 20px">是否需要审批</span>
                  <el-switch v-model="isApprove" />
                </div>
                <div
                  v-if="isApprove"
                  style="margin-top: 20px"
                >
                  <div style="margin-bottom: 10px">
                    报名截止日期
                  </div>
                  <el-date-picker
                    v-model="signupDeadline"
                    type="date"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </div>
                <div>
                  <span style="margin-right: 20px">是否需要登记</span>
                  <el-switch v-model="isRegister" />
                </div>
                <div
                  v-if="isRegister"
                  style="margin-top: 20px"
                >
                  <el-col :span="24">
                    <el-form-item :label="'登记观看'">
                      <!-- <el-button
                        v-if="table_registerNum.length"
                        type="text"
                        @click="delRegisterNum()"
                      >
                        批量删除
                      </el-button> -->

                      <el-button
                        type="text"
                        style="float: right"
                        @click="addRegisterNum(1)"
                      >
                        添加信息
                      </el-button>
                      <el-table
                        ref="table_relatedStudents"
                        :data="table_registerNum"
                        stripe
                        style="width: 100%"
                        @selection-change="registerNumSelectionChange"
                      >
                        >
                        <!-- <el-table-column
                          type="selection"
                          width="55"
                        ></el-table-column> -->
                        <el-table-column
                          prop="type"
                          label="信息类型"
                        >
                          <template slot-scope="scope">
                            <el-select
                              v-model="scope.row.type"
                              placeholder="请选择"
                            >
                              <el-option
                                v-for="item in registerTypeArr"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              >
                              </el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="name"
                          label="信息标题"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.name"
                              placeholder="请输入内容"
                            ></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          class="placeholder"
                          prop="department"
                          label="信息描述"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.placeholder"
                              placeholder="请输入内容"
                            ></el-input>
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
                              @click="delRegisterNum(scope.$index + 1, 1)"
                            >
                              删除
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </el-col>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row
            v-show="radio_connectionMode == 'code'"
            :gutter="20"
            class=""
          >
            <!-- <el-col :span="12">
              <el-form-item
                label="欢迎标题"
                prop="title"
              >
                <el-input
                  v-model.trim="formLiveTypeForm.title"
                  maxlength="32"
                ></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="10">
              <el-form-item
                label="验证码"
                prop="code"
              >
                <el-input
                  v-model.trim="formLiveTypeForm.code"
                  maxlength="32"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item
                label="提示文案"
                prop="tips"
              >
                <el-input
                  v-model.trim="formLiveTypeForm.tips"
                  maxlength="20"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item
                label="欢迎标题"
                prop="title"
              >
                <el-input
                  v-model.trim="formLiveTypeForm.title"
                  maxlength="32"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div>
                <span style="margin-right: 20px">是否需要登记</span>
                <el-switch v-model="isRegisterCode" />
              </div>
              <div
                v-if="isRegisterCode"
                style="margin-top: 20px"
              >
                <el-col :span="24">
                  <el-form-item :label="'登记观看'">
                    <!-- <el-button
                        v-if="table_registerNum.length"
                        type="text"
                        @click="delRegisterNum()"
                      >
                        批量删除
                      </el-button> -->

                    <el-button
                      type="text"
                      style="float: right"
                      @click="addRegisterNum(2)"
                    >
                      添加信息
                    </el-button>
                    <el-table
                      ref="table_relatedStudents"
                      :data="table_registerNumCode"
                      stripe
                      style="width: 100%"
                      @selection-change="registerNumSelectionChange"
                    >
                      >
                      <!-- <el-table-column
                          type="selection"
                          width="55"
                        ></el-table-column> -->
                      <el-table-column
                        prop="type"
                        label="信息类型"
                      >
                        <template slot-scope="scope">
                          <el-select
                            v-model="scope.row.type"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="item in registerTypeArr"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            >
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="信息标题"
                      >
                        <template slot-scope="scope">
                          <el-input
                            v-model="scope.row.name"
                            placeholder="请输入内容"
                          ></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column
                        class="placeholder"
                        prop="department"
                        label="信息描述"
                      >
                        <template slot-scope="scope">
                          <el-input
                            v-model="scope.row.placeholder"
                            placeholder="请输入内容"
                          ></el-input>
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
                            @click="delRegisterNum(scope.$index + 1, 2)"
                          >
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
              </div>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item
                label="提示文案"
                prop="tips"
              >
                <el-input
                  v-model.trim="formLiveTypeForm.tips"
                  maxlength="32"
                ></el-input>
              </el-form-item>
            </el-col> -->

            <!-- <el-col :span="24">
              <el-form-item
                label="公众号二维码"
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
            </el-col> -->
          </el-row>

          <el-row v-show="radio_connectionMode == 'direct'">
            <el-col :span="24">
              <el-form-item :label="'关联学员：' + totalNum + '人（仅关联学员可以观看）'">
                <el-button
                  v-if="multipleSelection.length"
                  type="text"
                  @click="delete_batchTableStudent()"
                >
                  批量删除
                </el-button>

                <el-button
                  type="text"
                  style="float: right"
                  @click="showDialog_add_student()"
                >
                  添加学员
                </el-button>
                <el-table
                  ref="table_relatedStudents"
                  :data="table_relatedStudents"
                  stripe
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                >
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
                    class="depmetSpan"
                    prop="department"
                    label="所在部门"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.department || '-' }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="phone"
                    label="手机号码"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.phone || '-' }}
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
                        @click="delete_table_relatedStudents(table_relatedStudents, scope.$index)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>

            <el-col class="paginationDiv">
              <!-- :current-page.sync="StudentsPage.totalNo" -->
              <el-pagination
                layout="total,prev,pager,next,sizes,jumper"
                :total="totalNum"
                :current-page="StudentsPage.currentPage"
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
                  v-model="organizationUserVal"
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
                    slot-scope="{ data }"
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
                <el-input
                  v-model="otherUserVal"
                  placeholder="请输入用户名称或手机搜索"
                ></el-input>
                <div
                  v-loading="treeLoading"
                  class="other-user"
                >
                  <el-tree
                    ref="otherUserTree"
                    :data="otherUser"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false"
                    @check="select_organizationUser"
                  >
                    <span
                      slot-scope="{ data }"
                      class="custom-tree-node"
                    >
                      <span>{{ data.name }}({{ data.phoneNum }})</span>
                    </span>
                  </el-tree>
                </div>
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
      <edit-examine-drawer
        ref="examineRef"
        :visible.sync="examine.drawerVisible"
        :examine="examine.editingRecord"
        entry-c-name="直播"
        @submit="examineSubmit"
      />
    </div>
  </div>
</template>

<script>
import {
  postAddLiveDraft,
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
  getLiveDetails,
  getStudentByLiveId,
  getKnowledgeList
} from '@/api/live/editLive'
import TreeSelector from '@/components/tree-selector'
import EditExamineDrawer from '@/views/training/components/drawerComponents/editExamineDrawer'
import moment from 'moment'
const NODE_TYPE = {
  All: 'All',
  Org: 'Org',
  User: 'User'
}
const TestColumns = [
  { prop: 'examTime', label: '考试时间', slot: true, minWidth: 220 },
  { prop: 'examName', label: '考试名称', minWidth: 100 },
  { prop: 'reckonTimeValue', minWidth: 120, slot: true, label: '考试时间(分钟)' }
]
const TestConfig = {
  showHandler: true,
  handlerColumn: { label: '操作', width: 100 }
}
export default {
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload'),
    EditExamineDrawer,
    TreeSelector
  },
  data() {
    return {
      isRelease: '0',
      knowledgeSystemLabel: '',
      knowledgeTree: [],
      signupDeadline: '',
      isApprove: false,
      isRegister: false,
      isRegisterCode: false,
      examine: {
        config: TestConfig,
        columns: TestColumns,
        drawerVisible: false,
        editingRecord: {},
        data: []
      },
      multipleSelection: [],
      oldOrgUserData: [],
      totalNum: 0,
      otherUserVal: '',
      organizationUserVal: '',
      headIndex: 1, //步骤切换
      // ruleForm: {
      //   imageUrl: [{}], // 图片
      //   introduction: '' // 富文本
      // },

      /** tabs 1 的提交数据 */

      basicForm: {
        //基本信息表单
        title: '', // 直播标题
        liveClassification_value: '',
        select_liveStatus_value: '',
        select_linkNumber_value: '',
        select_mode_value: 'single', // 当前选择的方式
        introduction: '',
        imageUrl: [],
        start_time: '', // 单次直播开始时间
        end_time: '', // 单次直播结束时间
        table_liveTime: [
          {
            start_time: '',
            end_time: ''
          }
        ],
        knowledgeSystemId: '',
        select_loopCycle_value: '',
        loopTime: [],
        select_mode_time_value: [],
        table_liveTime_str: []
      },
      basicFormRules: {
        title: [{ required: true, message: '请输入直播标题', trigger: ['blur', 'change'] }],
        liveClassification_value: [
          { required: true, message: '请选择所属分类', trigger: ['blur', 'change'] }
        ],
        select_liveStatus_value: [
          { required: true, message: '请选择直播状态', trigger: ['blur', 'change'] }
        ],
        select_linkNumber_value: [
          { required: true, message: '请选择连麦数', trigger: ['blur', 'change'] }
        ],
        select_mode_value: [
          { required: true, message: '请选择直播方式', trigger: ['blur', 'change'] }
        ],
        introduction: [
          { required: true, message: '请输入直播介绍', trigger: ['blur', 'change'] },
          { max: 5000, message: '直播介绍最多不能超过5000字', trigger: ['blur', 'change'] }
        ],
        imageUrl: [
          { type: 'array', required: true, message: '请选择课程封面', trigger: ['blur', 'change'] }
        ],
        start_time: [{ required: true, message: '请选择开播时间', trigger: ['blur', 'change'] }],
        end_time: [{ required: true, message: '请选择结束时间', trigger: ['blur', 'change'] }],

        select_loopCycle_value: [
          { required: true, message: '请选择循环周期', trigger: ['blur', 'change'] }
        ],
        select_mode_time_value: [
          { required: true, message: '请选择直播日期', trigger: ['blur', 'change'] }
        ],
        loopTime: [{ required: true, message: '请选择循环日期', trigger: ['blur', 'change'] }],
        table_liveTime_str: [{ required: true, message: '请选择时间', trigger: ['blur', 'change'] }]
      },

      liveClassification: [],
      //  liveClassification_value: '',
      liveClassification_option: {
        label: '',
        value: ''
      },
      liveClassification_props: {
        label: 'name',
        children: 'children'
      },
      toggle_scene: 'ppt', // 直播场景切换
      //  select_liveStatus_value: 1, //当前选择的状态
      select_liveStatus: [
        // 直播状态
        {
          value: 1,
          label: '正常'
        },
        {
          value: 0,
          label: '禁用'
        },
        {
          value: 2,
          label: '草稿'
        }
      ],
      // select_linkNumber_value: '', // 当前选择的数量
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
      // select_mode_value: 'single', // 当前选择的方式
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
      // start_time: '', // 单次直播开始时间
      //  end_time: '', // 单次直播结束时间
      table_liveTime: [
        // 直播设置时间段
        {
          start_time: '',
          end_time: ''
        }
      ],
      //   select_mode_time_value: [], // 选择的直播日期
      select_mode_time: [], // 直播日期
      // loopTime: [], // 循环日期
      //  select_loopCycle_value: '',
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
      table_registerNumCode: [], //登记观看人数
      table_registerNum: [], //登记观看人数
      registerNumSelection: [], //批量选择的等级观看人数
      registerTypeArr: [
        {
          value: 'name',
          label: '用户名称'
        },
        {
          value: 'mobile',
          label: '手机号码'
        },
        {
          value: 'text',
          label: '文本'
        },
        {
          value: 'number',
          label: '数字'
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
      teachingTeacherList: [], //嘉宾助教列表
      teacherlist: [], //讲师列表
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
        imgUrl: [
          { type: 'array', required: true, message: '请选择课程封面', trigger: ['blur', 'change'] }
        ]
      },
      StudentsPage: {
        pageSize: 10,
        currentPage: 1
      },
      treeOtherUser: {
        pageNo: 1,
        pageSize: 99999
      },
      treeLoading: false,
      isEdit: false
    }
  },
  computed: {
    limitWords() {
      return this.basicForm.introduction.length
    }
  },
  watch: {
    // 在组织架构下使用查询参数
    organizationUserVal: _.debounce(function() {
      this.loading = true

      this.valChange(1)
    }, 500),

    //其他人员
    otherUserVal: _.debounce(function() {
      this.loading = true
      this.valChange(2)
    }, 500),
    'basicForm.liveClassification_value': {
      handler() {
        //选择完成  隐藏选项
        this.$refs.setliveClassificationValue.blur()
      },
      immediate: false,
      deep: true
    },
    'basicForm.imageUrl': {
      handler() {
        this.$nextTick(() => {
          if (this.basicForm.imageUrl.length) {
            this.$refs.basicForm.validateField('imageUrl', () => {})
          }
        })
      },
      immediate: false,
      deep: true
    },
    'basicForm.table_liveTime': {
      handler(newval) {
        let str = newval.reduce((pre, cur) => {
          if (cur.start_time && cur.end_time) {
            pre += 1
          }
          return pre
        }, 0)
        this.basicForm.table_liveTime_str = str === newval.length ? '1' : null
      },
      immediate: false,
      deep: true
    }
  },
  //   activated() {
  //    // this.isgetcategoryTree()
  //     //this.getStudentInfoList();
  //  },

  created() {
    // 通过查看id是否存在判断是否是编辑
    if (this.$route.query.id) {
      this.setLiveDetails(this.$route.query.id)
      this.getStudentInfoList()
      this.isEdit = true
    }
    //获取知识体系
    this.getKnowledgeList()
    //修改tab  标题
    this.$store.commit('SET_TAG_LABEL', `${this.$route.query.id ? '编辑直播' : '创建直播'}`)
    //   获取直播分类
    getcategoryTree({
      source: 'live'
    }).then((res) => {
      res.forEach((item) => {
        if (item.status === 1) {
          this.liveClassification.push(item)
        }
      })
    })

    // 获取其他用户
    getOtherUser({
      categoryId: '',
      pageNo: this.treeOtherUser.pageNo,
      pageSize: this.treeOtherUser.pageSize
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

  beforeRouteLeave(to, from, next) {
    from.meta.$keepAlive = false // 禁用页面缓存
    next()
  },
  methods: {
    //get 知识体系
    getKnowledgeList() {
      getKnowledgeList({ name: '' }).then((res) => {
        this.knowledgeTree = res
      })
    },
    //批量选择登记观看信息callback
    registerNumSelectionChange(arr) {
      this.registerNumSelection = arr
    },
    //添加登记观看信息
    addRegisterNum(type) {
      let k = type == 1 ? 'table_registerNum' : 'table_registerNumCode'
      if (this[k].length >= 5) {
        this.$message({
          type: 'info',
          message: '最多添加5条'
        })
        return
      }
      this[k].push({
        type: '',
        name: '',
        placeholder: ''
      })
    },
    //删除登记观看信息
    delRegisterNum(index, type) {
      if (index) {
        let k = type == 1 ? 'table_registerNum' : 'table_registerNumCode'
        this[k].splice(index - 1, 1)
      }
    },
    getList(type) {
      return type === 1 ? this.teacherlist : this.teachingTeacherList
    },
    // 删除考试安排
    handleDeleteExamine(row) {
      let index = _.findIndex(this.examine.data, (item) => item.id === row.id)
      this.examine.data.splice(index, 1)
      this.$message.success('删除成功！')
    },
    // 新增与编辑考试
    handleEditExamine(row) {
      this.examine.editingRecord = row
      this.examine.drawerVisible = true
    },
    // 考试安排提交后
    examineSubmit(data, type) {
      if (type == 'add') {
        this.examine.data.push(data)
      } else {
        let index = _.findIndex(this.examine.data, (item) => {
          return item.id === data.id
        })
        this.$set(this.examine.data, index, data)
      }
    },
    // 数据处理中间函数
    thruHandler(arr) {
      // disabled: ({ type }) => !(this.org || _.eq(type, PROCESS_TYPE.User)),
      if (!this.org) {
        // 不可以选择组织的时候将disable所有的type不为user类型的项
        arr = _.map(arr, (item) =>
          _.assign(
            {
              disabled: !_.eq(item.type, NODE_TYPE.User)
            },
            item
          )
        )
      }

      return arr
    },
    getStudentInfoList() {
      getStudentByLiveId({
        liveId: this.$route.query.id,
        pageNo: 1,
        pageSize: 9999999
      }).then((res) => {
        res.data.forEach((item) => {
          let studentData = {}
          studentData.phone = item.phoneNum
          studentData.userCode = item.userNo
          studentData.department = item.orgName
          studentData.name = item.userName
          studentData.id = item.userId
          if (this.table_relatedStudents.length < 10) {
            this.table_relatedStudents.push(studentData)
          }
          this.dialogSelectStudent.push(studentData)
        })
        this.totalNum = res.totalNum
        this.totalPage = res.totalPage
      })
    },
    async changeTable(index) {
      if (index > this.headIndex) {
        let num = 1
        while (num < index) {
          await this.liveNextTable(num)
          console.log(num, this.headIndex, index)
          if (num < this.headIndex) {
            num++
          } else {
            num = 5
          }
        }
      } else {
        this.headIndex = index
      }
    },
    //直播信息填写 下一步校验
    liveNextTable(type) {
      let base = [
        'title',
        'liveClassification_value',
        'select_liveStatus_value',
        'select_linkNumber_value',
        'introduction',
        'imageUrl'
      ]
      let spationArr = []
      switch (this.basicForm.select_mode_value) {
        case 'single':
          spationArr = ['start_time', 'end_time']
          break
        case 'plural':
          spationArr = ['table_liveTime_str']
          break
        case 'cycle':
          spationArr = [
            'table_liveTime_str',
            'select_loopCycle_value',
            'loopTime',
            'select_mode_time_value'
          ]
          break
      }
      let formName = type == 1 ? 'basicForm' : type == 2 ? '' : 'formLiveTypeForm'
      if (!formName) {
        if (
          this.table_teacherSet.filter((x) => x.nameList_value).length ===
          this.table_teacherSet.length
        ) {
          if (this.headIndex < 3) {
            this.headIndex += 1
          }
        } else {
          this.headIndex = 2
          this.$message({
            message: '请完善讲师设置',
            type: 'error'
          })
        }
        return false
      }
      let resLength = 0,
        resArr = [...base, ...spationArr]
      this.$refs[formName].validateField(resArr, (errmsg) => {
        if (!errmsg) {
          resLength += 1
          if (resLength === resArr.length) {
            this.headIndex += 1
          }
        } else {
          if (errmsg == this.basicFormRules.introduction[1].message) {
            this.$message({
              message: '直播介绍最多不能超过5000字',
              type: 'error'
            })
          }

          return false
        }
      })
    },
    valChange(type) {
      if (type == 1) {
        let params = this.organizationUserVal
          ? { search: this.organizationUserVal }
          : { parentId: 0 }
        getOrganizationUser(params).then((res) => {
          res.users.forEach((item) => {
            item.type = 'user'
            item.leaf = true
            item.id = item.userId
            res.orgs.push(item)
          })

          this.organizationUser = res.orgs
        })
      } else {
        // 获取其他用户
        getOtherUser({
          search: this.otherUserVal,
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
      }
    },
    isgetcategoryTree() {
      getcategoryTree({
        source: 'live'
      }).then((res) => {
        res.forEach((item) => {
          if (item.status === 1) {
            this.liveClassification.push(item)
          }
        })
      })
    },
    // 返回按钮返回上一页
    tocourseDraft() {
      this.initData()
      this.$router.go(-1)
    },
    beforeAvatarUpload(file) {
      const regx = /^.*\.(jpg|jpeg|png)$/
      const isLt10M = file.size / 1024 / 1024 < 10

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
      if (arr.length == 0) {
        this.basicForm.table_liveTime_str = null
      }
    },
    // 切换循环周期
    toggle_loopCycle(val) {
      this.basicForm.select_mode_time_value = []
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
          if (this.get_table_teacherSet_typeNumber(this.table_teacherSet, type) >= 2) {
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
          if (this.get_table_teacherSet_typeNumber(this.table_teacherSet, type) >= 2) {
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
        if (item.type == row.type) {
          let currentTypeNum = arr.filter((x) => x.type === row.type)
          if (row.type === 2) {
            this.teacherSetButton.guestButton = currentTypeNum.length < 2 ? false : true
          } else {
            this.teacherSetButton.assistantButton = currentTypeNum.length < 2 ? false : true
          }
          if (item.num >= 2) {
            item.num--
          }
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
      let self = this
      this.$confirm('您确定要批量删除所选人员吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // var index = ''
        self.$refs.table_relatedStudents.selection.forEach((item) => {
          self.dialogSelectStudent.some((x, idx, arr) => {
            if (x.id === item.id) {
              arr.splice(idx, 1)
              return true
            }
          })
          self.$refs.otherUserTree ? self.$refs.otherUserTree.setChecked(item.id, false) : ''
        })
        this.toggle_StudentsPage(1)
      })
    },
    // 关联学员表格的分页跳转
    toggle_StudentsPage(page) {
      //添加学员
      this.table_relatedStudents = []
      if (this.dialogSelectStudent.length >= 0) {
        this.totalNum = this.dialogSelectStudent.length
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
        this.StudentsPage.currentPage = page
      } else {
        //编辑入口
        getStudentByLiveId({
          liveId: this.$route.query.id,
          pageNo: page,
          pageSize: this.StudentsPage.pageSize
        }).then((res) => {
          res.data.forEach((item) => {
            let studentData = {}
            ;(studentData.phone = item.phoneNum),
              (studentData.userCode = item.userNo),
              (studentData.department = item.orgName),
              (studentData.name = item.userName)
            this.table_relatedStudents.push(studentData)
          })
          this.totalNum = res.totalNum
          this.totalPage = res.totalPage
        })
      }
    },
    toggle_StudentsPageSize(size) {
      this.StudentsPage.pageSize = size
      this.toggle_StudentsPage(1)
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
    concatPerson() {
      //由于没有查全部的人员，导致显示嘉宾助教显示id,,所以将已经选择过得嘉宾助教添加到获取的助教嘉宾列表
      return this.table_teacherSet.reduce((pre, cur) => {
        let x = this.teachingTeacherList.filter((y) => y.id === cur.nameList_value)
        if (x) {
          pre.push(x)
        }
        return pre
      }, [])
    },
    get_teacherType(type) {
      this.index_teacherType = type
      if (type == 1 && this.teachingTeacherList != []) {
        getQueryTeacher({
          pageSize: 10,
          pageNo: 1
        }).then((res) => {
          this.teacherlist = res
        })
      } else if (type != 1 && this.teachingTeacherList != []) {
        getQueryAssistant({
          pageSize: 10,
          pageNo: 1
        }).then((res) => {
          //将已经选择的人员添加进去  并去重
          res = _.uniqBy([...res, ...this.concatPerson()].flat(Infinity), 'id')
          //已经选择过的  不能被选择
          this.table_teacherSet.forEach((item) => {
            if (item.nameList_value) {
              res.some((x) => {
                if (x.id === item.nameList_value) {
                  x.disabled = true
                  return true
                }
              })
            }
          })
          this.teachingTeacherList = res
        })
      }
    },
    // 将讲师设置中所选的教师添加到教师列表供关联课程使用
    add_teacherList(val, type, index) {
      let list = type == 1 ? this.teacherlist : this.teachingTeacherList
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
            this.teacherlist = res
          })
          break
        case 2:
          getQueryAssistant({
            name: query
          }).then((res) => {
            //  this.teachingTeacherList = res
            res = _.uniqBy([...res, ...this.concatPerson()].flat(Infinity), 'id')
            //已经选择过的  输入置灰
            this.table_teacherSet.forEach((item) => {
              if (item.nameList_value) {
                res.some((x) => {
                  if (x.id === item.nameList_value) {
                    x.disabled = true
                    return true
                  }
                })
              }
            })
            this.teachingTeacherList = res
          })
          break
        case 3:
          getQueryAssistant({
            name: query
          }).then((res) => {
            res = _.uniqBy([...res, ...this.concatPerson()].flat(Infinity), 'id')
            // this.teachingTeacherList = res
            //已经选择过的  输入置灰
            this.table_teacherSet.forEach((item) => {
              if (item.nameList_value) {
                res.some((x) => {
                  if (x.id === item.nameList_value) {
                    x.disabled = true
                    return true
                  }
                })
              }
            })
            this.teachingTeacherList = res
          })
          break
      }
    },
    handleClick() {},

    delete_dialog_selectStudent(arr, index, id) {
      this.$refs.otherUserTree.setChecked(id, false)
      arr.splice(index, 1)
    },
    delete_table_relatedStudents(arr, index) {
      this.$confirm('您确定要删除该人员吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogSelectStudent.some((item, idx, list) => {
          if (item.id === arr[index].id) {
            list.splice(idx, 1)
            return true
          }
        })
        this.toggle_StudentsPage(1)
      })
    },

    // 添加关联学员
    add_associateStudents() {
      // 获取第一页的数据
      this.toggle_StudentsPage(1)
      this.dialog_add_student = false
      this.$refs.organizationUserTree.setCheckedKeys([])
    },
    load_organizationUser(node, resolve) {
      if (node.level === 0) {
        getOrganizationUser({
          parentId: 0
        }).then((res) => {
          res.users.forEach((item) => {
            item.type = 'user'
            item.leaf = true
            item.id = item.userId
            item.name = item.orgName
            //res.orgs.push(item)
          })

          this.organizationUser = res.orgs
          this.oldOrgUserData = res.orgs
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
          for (let i = 0; i < this.dialogSelectStudent.length; i++) {
            if (this.dialogSelectStudent[i].id == data.id) {
              this.$message({
                showClose: true,
                message: '此人员已存在',
                type: 'error'
              })
              return false
            }
          }
          this.dialogSelectStudent.push({
            department: data.orgName,
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
                  department: resitem.orgFullName,
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
      this.basicForm.liveClassification_value = data.idStr
      //  this.$refs.ref_liveClassification.blur()
    },
    //直播存草稿时，liveBatch  如果为空 传入空数组，不然接口报错
    dealLiveBatchParams(data) {
      let { liveBatch } = data
      let str = liveBatch.reduce((pre, cur) => {
        pre += `${cur.startTime}${cur.endTime}`
        return pre
      }, '')
      if (!str) {
        data.liveBatch = []
      }
      return data
    },
    //处理是否需要登记观看信息数据
    dealRegisterNum(data = []) {
      if (data.length <= 0) return []
      return data.reduce((pre, cur) => {
        cur.options = ''
        pre.push(cur)
        return pre
      }, [])
    },
    // 提交直播信息

    submit_live_data(type) {
      let otherData = []
      let slef = this

      this.table_teacherSet.forEach(function(item) {
        if (item.type === 2 || item.type === 3) {
          let teacher = {}
          slef.teachingTeacherList.forEach(function(currentValue) {
            if (currentValue.id == item.nameList_value) {
              teacher.nickName = currentValue.name
            }
          })
          // (teacher.userActor = item.identity),
          ;(teacher.roleName =
            item.identity === '嘉宾' ? 'Guest' : item.identity === '助教' ? 'Assistant' : ''),
            (teacher.userId = item.nameList_value)
          otherData.push(teacher)
        }
      })

      var data = {
        batchDeclare: this.basicForm.select_mode_value, // 直播方式 single：单次；plural：多次；cycle：循环
        categoryId: this.basicForm.liveClassification_value, // 所属分类
        channelName: this.basicForm.title, // 直播标题
        linkMicLimit: this.basicForm.select_linkNumber_value, //  最大连麦数量
        isUsed: type ? type : this.basicForm.select_liveStatus_value, // 直播状态
        remark: _.escape(this.basicForm.introduction), // 直播介绍
        scene: this.toggle_scene, // 直播场景
        lecturerId: this.table_teacherSet[0].nameList_value, //  主讲师设置
        otherTeachers: otherData,
        coverImageUrl:
          this.basicForm.imageUrl.length > 0
            ? this.basicForm.imageUrl[this.basicForm.imageUrl.length - 1].url
            : '', // 直播封面图
        liveExamList: this.examine.data,
        isApprove: this.isApprove,
        signupDeadline: this.signupDeadline
          ? moment(this.signupDeadline).format('YYYY-MM-DD HH:mm:ss')
          : '',
        knowledgeSystemId: this.basicForm.knowledgeSystemId || ''
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
          cycleDateRange: this.basicForm.loopTime[0] + '~' + this.basicForm.loopTime[1],
          cycleMode: this.basicForm.select_loopCycle_value,
          cycleTime: this.basicForm.select_mode_time_value.toString()
        }
      }
      if (data.batchDeclare == 'single') {
        data.liveBatch = []
        data.liveBatch.push({
          startTime: this.basicForm.start_time,
          endTime: this.basicForm.end_time
        })
      } else {
        data.liveBatch = []
        this.basicForm.table_liveTime.forEach((item) => {
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
          //处理登记信息
          if (this.isRegister && this.table_registerNum.length <= 0) {
            this.$message({
              type: 'info',
              message: '请填写登记观看信息'
            })
            return
          }
          data.isCollectUser = this.isRegister ? 'Y' : 'N'
          data.infoFieldREQS = this.dealRegisterNum(this.table_registerNum)
          break
        case 'direct':
          data.authType = this.radio_connectionMode
          // 提交关联学员数据
          if (this.dialogSelectStudent.length) {
            data.userAndOrgIds = {
              users: []
            }
            this.dialogSelectStudent.forEach((item) => {
              data.userAndOrgIds.users.push(item.id)
            })
            this.totalNum = data.userAndOrgIds.users.length
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
          //处理登记信息
          if (this.isRegister && this.table_registerNum.length <= 0) {
            this.$message({
              type: 'info',
              message: '请填写登记观看信息'
            })
            return
          }
          data.isCollectUser = this.isRegisterCode ? 'Y' : 'N'
          data.infoFieldREQS = this.dealRegisterNum(this.table_registerNumCode)
          break
      }
      console.log(data)

      if (this.radio_connectionMode === 'code') {
        //校验第三步是否填写
        this.$refs['formLiveTypeForm'].validate((valid) => {
          if (valid) {
            if (this.$route.query.id) {
              data.liveId = this.$route.query.id
              if (type) {
                data = this.dealLiveBatchParams(data)
                postAddLiveDraft(data).then(() => {
                  this.initData()
                  this.$router.push({ path: '/live/liveList' })
                })
              } else {
                postEditLive(data).then(() => {
                  this.initData()
                  this.$router.push({ path: '/live/liveList' })
                })
              }
            } else {
              if (type) {
                data = this.dealLiveBatchParams(data)
                postAddLiveDraft(data).then(() => {
                  this.initData()
                  this.$router.push({ path: '/live/liveList' })
                })
              } else {
                postAddLive(data).then(() => {
                  this.initData()
                  this.$router.push({ path: '/live/liveList' })
                })
              }
            }
          } else {
            return false
          }
        })
      } else {
        if (this.$route.query.id) {
          data.liveId = this.$route.query.id
          if (type) {
            data = this.dealLiveBatchParams(data)
            postAddLiveDraft(data).then(() => {
              this.initData()
              this.$router.push({ path: '/live/liveList' })
            })
          } else {
            postEditLive(data).then(() => {
              this.initData()
              this.$router.push({ path: '/live/liveList' })
            })
          }
        } else {
          if (type) {
            data = this.dealLiveBatchParams(data)
            postAddLiveDraft(data).then(() => {
              this.initData()
              this.$router.push({ path: '/live/liveList' })
            })
          } else {
            postAddLive(data).then(() => {
              this.initData()
              this.$router.push({ path: '/live/liveList' })
            })
          }
        }
      }
    },
    initData() {
      this.headIndex = 1
    },
    setLiveDetails(id) {
      getLiveDetails({
        liveId: id
      }).then((res) => {
        this.isRelease = res.isRelease
        this.liveClassification_option.label = res.categoryName
        this.basicForm.title = res.channelName
        this.liveClassification_option.value = res.categoryId
        this.basicForm.liveClassification_value = res.categoryId
        this.basicForm.select_liveStatus_value = res.isUsed
        this.basicForm.select_linkNumber_value = res.linkMicLimit
        this.basicForm.knowledgeSystemId = res.knowledgeSystemId
        this.knowledgeSystemLabel = res.knowledgeSystemFullName
        this.toggle_scene = res.scene
        this.examine.data = res.examList
        this.isApprove = res.isApprove
        this.signupDeadline = res.signupDeadline
        let imgArr = []
        if (res.coverImageUrl) {
          imgArr.push({
            url: res.coverImageUrl
          })
        }

        this.basicForm.imageUrl = imgArr
        this.basicForm.introduction = _.unescape(res.remark)
        this.basicForm.select_mode_value = res.batchDeclare
        this.teacherlist = [
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
        // getQueryAssistant({
        //   pageSize:10,
        //   pageNo:1
        // }).then((res) => {
        //   this.teachingTeacherList = res
        // })
        let self = this
        res.otherTeachers.forEach(function(item) {
          let teacherVaue = {}
          if (item.roleName == 'Guest') {
            (teacherVaue.identity = '嘉宾'), (teacherVaue.nameList_value = item.userId)
            //teacherVaue.role= '嘉宾',
            let arr_jb = self.table_teacherSet.filter((x) => x.type == 2)
            ;(teacherVaue.num = '嘉宾' + (arr_jb.length + 1)), (teacherVaue.type = 2)
          }
          if (item.roleName == 'Assistant') {
            (teacherVaue.identity = '助教'), (teacherVaue.nameList_value = item.userId)
            //teacherVaue.role= '助教',
            let arr_zj = self.table_teacherSet.filter((x) => x.type == 3)
            ;(teacherVaue.num = '助教' + (arr_zj.length + 1)), (teacherVaue.type = 3)
          }
          self.table_teacherSet.push(teacherVaue)
          self.teachingTeacherList.push({
            name: item.nickName,
            id: item.userId
          })
        })

        this.table_relatedCourses = res.courses

        // 直播设置
        switch (this.basicForm.select_mode_value) {
          case 'single':
            this.basicForm.start_time = res.liveBatch.length > 0 ? res.liveBatch[0].startTime : ''
            this.basicForm.end_time = res.liveBatch.length > 0 ? res.liveBatch[0].endTime : ''
            break
          case 'plural':
            this.basicForm.table_liveTime = []
            res.liveBatch.forEach((item) => {
              this.basicForm.table_liveTime.push({
                id: item.id,
                start_time: item.startTime,
                end_time: item.endTime
              })
            })
            break
          case 'cycle':
            var loopTimeArr = res.cycleInfo.cycleDateRange.split('~')
            this.basicForm.loopTime.push(loopTimeArr[0])
            this.basicForm.loopTime.push(loopTimeArr[1])
            this.basicForm.select_loopCycle_value = res.cycleInfo.cycleMode
            this.toggle_loopCycle(this.basicForm.select_loopCycle_value)
            var arr = res.cycleInfo.cycleTime.split(',')
            arr.forEach((item) => {
              this.basicForm.select_mode_time_value.push(parseInt(item))
            })
            this.basicForm.table_liveTime = []
            res.liveBatch.forEach((item) => {
              this.basicForm.table_liveTime.push({
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
            //如果存在登记观看  显示
            if (res.infoFeilds) {
              this.isRegister = res.isCollectUser === 'Y' ? true : false
              this.table_registerNum = this.isRegister ? JSON.parse(res.infoFeilds) : []
            }
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

            //如果存在登记观看  显示
            if (res.infoFeilds) {
              this.isRegisterCode = res.isCollectUser === 'Y' ? true : false
              this.table_registerNumCode = this.isRegisterCode ? JSON.parse(res.infoFeilds) : []
            }
            break
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
    // 外部人员滚动加载
    // async treeLoad() {
    //   this.treeLoading = true
    //   this.treeOtherUser.pageNo++
    //   await getOtherUser({
    //     categoryId: '',
    //     pageNo: this.treeOtherUser.pageNo,
    //     pageSize: this.treeOtherUser.pageSize
    //   })
    //     .then((res) => {
    //       this.otherUser = [...this.otherUser, ...res.data]
    //       this.otherUser.forEach((item) => {
    //         item.phoneNum = item.phonenum
    //         item.userCode = item.workNo
    //         item.id = item.userId
    //         item.type = 'user'
    //       })
    //     })
    //     .finally(() => {
    //       this.treeLoading = false
    //     })
    // }
  }
}
</script>

<style lang="scss" scoped>
.section__class {
  margin-top: 50px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    margin-bottom: 8px;
    font-size: 16px;
  }
}
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
  /deep/ .tox .tox-statusbar__text-container {
    display: none;
  }
  .limitWords {
    position: relative;
    float: right;
    margin: -29px 20px 0 0;
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
  // width: 180px;
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
.paginationDiv {
  text-align: right;
}
</style>
