<template>
  <div class="learningApproaches">
    <el-dialog
      :visible="visible"
      width="800px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @close="handleClose"
    >
      <!-- 头部插槽 -->
      <div
        slot="title"
        class="dialogTitle"
      >
        添加学习途径
        <el-tooltip
          effect="dark"
          content="每个能力等级最多可添加30个学习途径"
          placement="top"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
        <el-divider></el-divider>
      </div>
      <!-- 表单内容 -->
      <el-form
        ref="commonForm"
        :model="commonForm"
        :rules="commonRules"
        label-position="top"
      >
        <el-row>
          <!-- 选择学习途径类型 -->
          <el-col>
            <el-form-item
              label="选择学习途径类型"
              prop="learningApproachesType"
            >
              <el-select
                v-model="commonForm.learningApproachesType"
                placeholder="请选择学习途径类型"
                style="width: 305px"
                @change="changeType"
              >
                <el-option
                  v-for="(item, index) in learningApproachesOpt"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 关联课程 -->
          <template v-if="commonForm.learningApproachesType === 1">
            <el-col :span="8">
              <el-form-item label="关联课程">
                <el-input
                  v-model="associatedForm.courseName"
                  placeholder="输入课程名称搜索"
                  suffix-icon="el-icon-search"
                  style="width: 305px"
                  clearable
                  @input="relatedSearch"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              :offset="4"
            >
              <el-form-item label="课程分类">
                <el-tree-select
                  :select-params="treeSeleteConfig.selectParams"
                  :tree-params="treeSeleteConfig.treeParams"
                  @select-clear="catalogTreeSearch"
                  @node-click="catalogTreeSearch"
                ></el-tree-select>
              </el-form-item>
            </el-col>
          </template>
          <!-- 关联考试 -->
          <template v-if="commonForm.learningApproachesType === 2">
            <el-col :span="8">
              <el-form-item label="关联考试">
                <el-input
                  v-model="associatedForm.examName"
                  placeholder="输入考试名称搜索"
                  suffix-icon="el-icon-search"
                  style="width: 305px"
                  clearable
                  @input="relatedSearch"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              :offset="4"
            >
              <el-form-item label="考试分类">
                <el-tree-select
                  :select-params="treeSeleteConfig.selectParams"
                  :tree-params="treeSeleteConfig.treeParams"
                  @select-clear="examTreeSearch"
                  @node-click="examTreeSearch"
                ></el-tree-select>
              </el-form-item>
            </el-col>
          </template>
          <!-- 关联培训 -->
          <template v-if="commonForm.learningApproachesType === 3">
            <el-col :span="8">
              <el-form-item label="关联培训">
                <el-input
                  v-model="associatedForm.trainName"
                  placeholder="输入培训名称搜索"
                  suffix-icon="el-icon-search"
                  style="width: 305px"
                  clearable
                  @input="relatedSearch"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              :offset="4"
            >
              <el-form-item label="培训分类">
                <el-tree-select
                  :select-params="treeSeleteConfig.selectParams"
                  :tree-params="treeSeleteConfig.treeParams"
                  @select-clear="trainTreeSearch"
                  @node-click="trainTreeSearch"
                ></el-tree-select>
              </el-form-item>
            </el-col>
          </template>
          <!-- 关联直播 -->
          <template v-if="commonForm.learningApproachesType === 4">
            <el-col :span="8">
              <el-form-item label="关联直播">
                <el-input
                  v-model="associatedForm.liveName"
                  placeholder="输入直播标题或编号搜索"
                  suffix-icon="el-icon-search"
                  style="width: 305px"
                  clearable
                  @input="relatedSearch"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              :offset="4"
            >
              <el-form-item label="直播分类">
                <el-tree-select
                  :select-params="treeSeleteConfig.selectParams"
                  :tree-params="treeSeleteConfig.treeParams"
                  @select-clear="liveTreeSearch"
                  @node-click="liveTreeSearch"
                ></el-tree-select>
              </el-form-item>
            </el-col>
          </template>
          <!-- 关联能力提升材料 -->
          <template v-if="commonForm.learningApproachesType === 5">
            <el-col :span="24">
              <el-form-item
                label="能力提升材料名称"
                prop="materialName"
              >
                <el-input
                  v-model="commonForm.materialName"
                  style="width: 305px"
                  clearable
                  maxlength="32"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="能力提升材料描述"
                prop="materialDesc"
              >
                <el-input
                  v-model="commonForm.materialDesc"
                  clearable
                  type="textarea"
                  :rows="4"
                  maxlength="200"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
      <template v-if="commonForm.learningApproachesType && commonForm.learningApproachesType !== 5">
        <!-- 关联表格 -->
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="tableData"
          :row-key="commonForm.learningApproachesType === 4 ? 'liveId' : 'id'"
          @select="handleSelectionChange"
          @select-all="allSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            :selectable="checkStatus"
            :reserve-selection="true"
          ></el-table-column>
          <!-- 关联课程 -->
          <template v-if="commonForm.learningApproachesType === 1">
            <el-table-column
              :key="1"
              label="课程名称"
              prop="courseName"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              :key="2"
              label="讲师"
              prop="teacherName"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              :key="3"
              label="所在类目"
              prop="catalogName"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          <!-- 关联考试 -->
          <template v-if="commonForm.learningApproachesType === 2">
            <el-table-column
              :key="4"
              label="考试名称"
              prop="examName"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              :key="5"
              label="考试方式"
              prop="examPattern"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{
                  {
                    general: '普通考试',
                    offline: '线下考试'
                  }[scope.row.examPattern]
                }}
              </template>
            </el-table-column>
            <el-table-column
              :key="6"
              label="所在分类"
              prop="category"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.category || '未分类' }}
              </template>
            </el-table-column>
          </template>
          <!-- 关联培训 -->
          <template v-if="commonForm.learningApproachesType === 3">
            <el-table-column
              :key="7"
              label="培训名称"
              prop="trainName"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              :key="8"
              label="培训方式"
              prop="trainWay"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{
                  {
                    1: '在线',
                    2: '面授',
                    3: '混合',
                    11: '非脱产培训',
                    12: '脱产培训',
                    13: '业余培训'
                  }[scope.row.trainWay]
                }}
              </template>
            </el-table-column>
            <el-table-column
              :key="9"
              label="培训类型"
              prop="trainScope"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{
                  {
                    inside: '内训',
                    outer: '外训'
                  }[scope.row.trainScope]
                }}
              </template>
            </el-table-column>
            <el-table-column
              :key="10"
              label="所在分类"
              prop="categoryName"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.categoryName || '--' }}
              </template>
            </el-table-column>
          </template>
          <!-- 关联直播 -->
          <template v-if="commonForm.learningApproachesType === 4">
            <el-table-column
              :key="11"
              label="直播编号"
              prop="liveNo"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              :key="12"
              label="直播标题"
              prop="channelName"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              :key="13"
              label="所属分类"
              prop="categoryName"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              :key="14"
              label="包含课程"
              prop="courses"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
        </el-table>
        <!-- 分页 -->
        <div class="page">
          <el-pagination
            :current-page.sync="pageConfig.currentPage"
            :page-size="pageConfig.pageSize"
            layout="total, prev, pager, next"
            :total="pageConfig.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </template>
      <!-- 暂无数据 -->
      <div
        v-if="!commonForm.learningApproachesType"
        class="empty-block"
      >
        <img
          src="@/assets/images/nodata.png"
          class="empty-img"
        />
        <div class="nodata">
          暂无数据
        </div>
      </div>
      <!-- 底部插槽 -->
      <div slot="footer">
        <el-divider></el-divider>
        <el-button
          size="medium"
          @click="handleClose"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="medium"
          @click="handleConfirm"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCourseListData } from '@/api/course/course' // 课程列表
import { getCatalog } from '@/api/course/course' //课程分类
import { getLiveList } from '@/api/live/liveList' //直播列表
import { getcategoryTree } from '@/api/live/editLive' // 直播分类
import { getCategoryList } from '@/api/examManage/category' // 考试分类
import { getArrangeList } from '@/api/examManage/schedule' // 考试列表
import { getScheduleList } from '@/api/training/training' // 培训列表
import { getTrainCategoryTree } from '@/api/studyMap/studyMap' // 培训树状分类
export default {
  name: 'LearningApproaches',
  components: {
    elTreeSelect: () => import('@/components/elTreeSelect/elTreeSelect')
  },
  data() {
    return {
      visible: false,
      //   公共表单
      commonForm: {
        learningApproachesType: '',
        materialName: '',
        materialDesc: ''
      },
      commonRules: {
        learningApproachesType: [
          { required: true, message: '请选择学习途径类型', trigger: 'change' }
        ],
        materialName: [
          { required: true, message: '请输入能力提升材料名称', trigger: 'blur' },
          { min: 1, max: 32, message: '能力提升材料名称不能超过32个字符', trigger: 'blur' }
        ],
        materialDesc: [
          { required: true, message: '请输入能力提升材料描述', trigger: 'blur' },
          { min: 1, max: 200, message: '能力提升材料描述不能超过200个字符', trigger: 'blur' }
        ]
      },
      //   选择学习途径类型
      //   1-课程,2-考试,3-培训,4-直播,5-能力提升材料
      learningApproachesOpt: [
        {
          value: 1,
          label: '课程'
        },
        {
          value: 4,
          label: '直播课程'
        },
        {
          value: 3,
          label: '培训'
        },
        {
          value: 2,
          label: '考试'
        },
        {
          value: 5,
          label: '能力提升材料'
        }
      ],
      //   分页配置
      pageConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      //   关联表单
      associatedForm: {
        courseName: '', //   课程名称
        courseClassificationName: '', //   课程分类
        liveName: '', // 直播标题
        liveCategoryId: '', // 直播分类
        examName: '', // 考试名称
        examCategoryId: '', // 考试分类
        trainName: '', // 培训名称
        trainCategoryId: '' // 培训分类
      },
      //  共用一个table数据
      tableData: [],
      //   多选数据
      multipleSelection: [],
      //   获取该条能力等级的id和学习途径条数
      levelId: {},
      //   直播分类
      treeSeleteConfig: {
        selectParams: {
          placeholder: '请选择分类',
          multiple: false,
          clearable: true
        },
        treeParams: {
          'check-strictly': true,
          'default-expand-all': false,
          'expand-on-click-node': false,
          clickParent: true,
          data: [],
          filterable: false,
          props: {
            children: 'children',
            label: 'name',
            disabled: 'disabled',
            value: 'id'
          }
        }
      },
      fatherData: []
    }
  },
  methods: {
    // 关闭模态框
    handleClose() {
      this.visible = false
      this.pageConfig.currentPage = 1
      this.$nextTick(() => {
        this.$refs.commonForm.resetFields()
      })
    },
    // 切换分页
    handleSizeChange(val) {
      this.pageConfig.pageSize = val
      this.commonType()
    },
    handleCurrentChange(val) {
      this.pageConfig.currentPage = val
      this.commonType()
    },
    // 分页数据回显
    echo() {
      let _this = this
      if (!_this.multipleSelection.length || !_this.tableData.length) return
      _this.$nextTick(() => {
        _this.tableData.forEach((row) => {
          for (let i = 0; i < _this.multipleSelection.length; i++) {
            if (
              row[this.commonForm.learningApproachesType === 4 ? 'liveId' : 'id'] ==
              _this.multipleSelection[i][
                this.commonForm.learningApproachesType === 4 ? 'liveId' : 'id'
              ]
            ) {
              _this.$refs.multipleTable.toggleRowSelection(row, true)
            }
          }
        })
      })
    },
    // 过滤已选择的数据
    filterExitData() {
      this.echo()
      if (!this.fatherData || !this.fatherData.length) return
      for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.fatherData.length; j++) {
          if (
            this.commonForm.learningApproachesType == this.fatherData[j].routeType &&
            this.tableData[i][this.commonForm.learningApproachesType === 4 ? 'liveId' : 'id'] ==
              this.fatherData[j].bizId
          ) {
            this.tableData.splice(i, 1)
          }
        }
      }
    },
    //判断是否禁用
    checkStatus(row) {
      console.log(row)
      console.log(this.fatherData)
      if (
        this.fatherData.some((el) => {
          return el.bizId === row[this.commonForm.learningApproachesType === 4 ? 'liveId' : 'id']
        })
      ) {
        return false
      } else {
        return true
      }
    },
    // 选择学习途径类型
    async changeType(val) {
      this.commonForm.learningApproachesType = val
      this.pageConfig.currentPage = 1
      this.associatedForm = {}
      this.multipleSelection = []
      this.$nextTick(async () => {
        await this.commonType()
      })
    },
    // 公共方法
    async commonType() {
      switch (this.commonForm.learningApproachesType) {
        //   1-课程,2-考试,3-培训,4-直播,5-能力提升材料
        case 1:
          await this.getCourseData()
          // 获取全部课程
          await getCatalog().then((res) => {
            this.treeSeleteConfig.treeParams.data = res
          })
          break
        case 2:
          await this.getArrangeList()
          // 获取考试分类
          await getCategoryList({ type: 1 }).then((res) => {
            this.treeSeleteConfig.treeParams.data = res
            // 加一个考试分类
            this.treeSeleteConfig.treeParams.data.unshift({
              id: '-1',
              name: '未分类',
              hasChildren: false
            })
          })
          break
        case 3:
          await this.getScheduleList()
          //   获取培训分类
          await getTrainCategoryTree().then((res) => {
            this.treeSeleteConfig.treeParams.data = res
          })
          break
        case 4:
          await this.getLiveList()
          // 获取直播分类
          await getcategoryTree({
            source: 'live'
          }).then((res) => {
            this.treeSeleteConfig.treeParams.data = res
          })
      }
      //   this.filterExitData()
    },
    // 获取课程列表
    async getCourseData() {
      this.loading = true
      // 分页获取数据
      await getCourseListData({
        pageNo: this.pageConfig.currentPage,
        pageSize: this.pageConfig.pageSize,
        courseName: this.associatedForm.courseName,
        catalogId: this.associatedForm.courseClassificationName,
        status: 1,
        courseType: 1,
        electiveType: 1
      })
        .then((res) => {
          this.tableData = res.data
          this.pageConfig.total = res.totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取直播列表
    async getLiveList() {
      this.loading = true
      let params = {
        pageNo: this.pageConfig.currentPage,
        pageSize: this.pageConfig.pageSize,
        titleOrNo: this.associatedForm.liveName,
        categoryId: this.associatedForm.liveCategoryId
      }
      await getLiveList(params)
        .then((res) => {
          this.tableData = res.data
          this.pageConfig.total = res.totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取考试列表
    async getArrangeList() {
      this.loading = true
      let params = {
        pageNo: this.pageConfig.currentPage,
        pageSize: this.pageConfig.pageSize,
        examName: this.associatedForm.examName,
        categoryId: this.associatedForm.examCategoryId,
        type: 0,
        examType: 'CurrencyExam'
      }
      await getArrangeList(params)
        .then((res) => {
          this.tableData = res.data
          this.pageConfig.total = res.totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取培训列表
    async getScheduleList() {
      this.loading = true
      let params = {
        pageNo: this.pageConfig.currentPage,
        pageSize: this.pageConfig.pageSize,
        trainName: this.associatedForm.trainName,
        categoryId: this.associatedForm.trainCategoryId,
        type: 0
      }
      await getScheduleList(params)
        .then((res) => {
          this.tableData = res.data
          this.pageConfig.total = res.totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 关联课程搜索
    relatedSearch: _.debounce(function(val) {
      this.pageConfig.currentPage = 1
      switch (this.commonForm.learningApproachesType) {
        //   1-课程,2-考试,3-培训,4-直播,5-能力提升材料
        case 1:
          this.associatedForm.courseName = val
          this.getCourseData()
          break
        case 2:
          this.associatedForm.examName = val
          this.getArrangeList()
          break
        case 3:
          this.associatedForm.trainName = val
          this.getScheduleList()
          break
        case 4:
          this.associatedForm.liveName = val
          this.getLiveList()
          break
      }
    }, 500),
    // 选择课程分类
    async catalogTreeSearch(data) {
      this.associatedForm.courseClassificationName = data ? data.id : ''
      await this.getCourseData()
      //   this.filterExitData()
    },
    // 直播分类搜索
    async liveTreeSearch(data) {
      this.associatedForm.liveCategoryId = data ? data.id : ''
      await this.getLiveList()
      //   this.filterExitData()
    },
    // 考试分类搜索
    async examTreeSearch(data) {
      this.associatedForm.examCategoryId = data ? data.id : ''
      await this.getArrangeList()
      //   this.filterExitData()
    },
    // 培训分类搜索
    async trainTreeSearch(data) {
      this.associatedForm.trainCategoryId = data ? data.id : ''
      await this.getScheduleList()
      //   this.filterExitData()
    },
    // 多选表格数据
    handleSelectionChange(selection, row) {
      let _this = this
      // true就是选中，0或者false是取消选中
      let selected = selection && selection.indexOf(row) !== -1
      if (!selected) {
        for (let i = 0; i < _this.multipleSelection.length; i++) {
          if (_this.multipleSelection[i].id == row.id) {
            _this.multipleSelection.splice(i, 1)
            break
          }
        }
      } else {
        _this.multipleSelection.push(row)
      }
      // 如果学习途径达到30条，则不能再添加
      if (_this.multipleSelection.length + _this.levelId.len > 30) {
        _this.$message.warning('您已经添加了30条学习途径，不能再继续添加')
        _this.multipleSelection.splice(_this.multipleSelection.indexOf(row), 1)
        _this.$nextTick(() => {
          _this.$refs.multipleTable.toggleRowSelection(row, false)
        })
      }
    },
    // 勾选全选框触发
    allSelectionChange(selection) {
      let _this = this,
        total = 0
      // selection有长度则是全选，否则取消全选
      if (selection.length) {
        //     // 如果学习途径达到30条，则不能再添加
        selection.forEach((row) => {
          if (_this.multipleSelection.indexOf(row) !== -1) {
            total++
          }
        })
        if (selection.length + _this.multipleSelection.length + _this.levelId.len - total > 30) {
          _this.$message.warning('全选已经超过了30条学习途径，不能全选，请重新选择!')
          _this.$refs.multipleTable.toggleAllSelection()
          return
        }
        //   将勾选的数据添加到multipleSelection
        selection.forEach((row) => {
          if (_this.multipleSelection.indexOf(row) === -1) {
            _this.multipleSelection.push(row)
          }
        })
      } else {
        // 如果是取消勾选，并把当前页数据存在的在multipleSelection中去掉
        _this.tableData.forEach((row) => {
          if (_this.multipleSelection.indexOf(row) !== -1) {
            _this.multipleSelection.splice(_this.multipleSelection.indexOf(row), 1)
          }
        })
      }
    },
    // 确定按钮
    handleConfirm() {
      let _this = this
      _this.$refs.commonForm.validate((valid) => {
        if (!valid) return
        // 判断是否是能力提升材料,1-课程,2-考试,3-培训,4-直播,5-能力提升材料
        let tempData = [],
          routeNameTemp = {
            2: 'examName',
            3: 'trainName',
            4: 'channelName'
          }
        if (_this.commonForm.learningApproachesType === 5) {
          // 判断能力提升材料名称是否重复
          for (let i = 0; i < _this.fatherData.length; i++) {
            if (
              _this.fatherData[i].routeType === 5 &&
              _this.fatherData[i].routeName == _this.commonForm.materialName
            ) {
              _this.$message.warning('能力提升材料名称不能重复!')
              return
            }
          }

          tempData.push({
            routeName: _this.commonForm.materialName,
            routeType: _this.commonForm.learningApproachesType,
            material: _this.commonForm.materialDesc,
            bizId: ''
          })
        } else {
          if (!_this.multipleSelection.length) {
            _this.$message.warning('您还未选择学习途径!')
            return
          }
          tempData = _this.multipleSelection.map((v) => {
            return {
              routeName: v[routeNameTemp[_this.commonForm.learningApproachesType] || 'courseName'],
              routeType: _this.commonForm.learningApproachesType,
              bizId: v[this.commonForm.learningApproachesType === 4 ? 'liveId' : 'id']
            }
          })
        }
        _this.$emit('levelRouter', tempData, _this.levelId.id)
        this.handleClose()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.learningApproaches {
  .dialogTitle {
    font-size: 20px;
  }
  /deep/ .el-dialog__body {
    padding: 0 20px;
  }
  /deep/ .el-form--label-top .el-form-item__label {
    padding-bottom: 0;
  }
  /deep/ .el-tree-select-input {
    width: 100%;
  }
  .page {
    margin-top: 20px;
    text-align: right;
  }
  .empty-block {
    text-align: center;
    .empty-img {
      width: 100px;
    }
  }
}
</style>
