<template>
  <div class="arrange">
    <page-header title="问卷安排">
      <el-button
        slot="rightMenu"
        type="primary"
        size="medium"
        @click="handleEdit"
      >
        创建问卷安排
      </el-button>
    </page-header>

    <div class="body">
      <div class="filter-container">
        <div class="operate-wrapper">
          <div class="operate-left">
            <div class="input-wrapper">
              <el-input
                v-model="queryForm.planName"
                clearable
                size="medium"
                placeholder="输入问卷安排名称搜索"
                suffix-icon="el-icon-search"
              ></el-input>
            </div>

            <el-popover
              v-model="queryFormVisible"
              :offset="900"
              placement="bottom"
              transition="false"
              width="1327"
            >
              <el-form
                ref="queryForm"
                :rules="queryFormRules"
                label-position="left"
                :inline="true"
                :model="queryForm"
                class="filter-form"
                label-width="80px"
                style="padding: 24px"
              >
                <el-form-item
                  label="状态"
                  style="margin-right: 50px;"
                >
                  <el-select
                    v-model="queryForm.status"
                    clearable
                    placeholder="请选择"
                    style="width: 217px;"
                  >
                    <el-option
                      label="进行中"
                      value="2"
                    ></el-option>
                    <el-option
                      label="未开始"
                      value="1"
                    ></el-option>
                    <el-option
                      label="已过期"
                      value="3"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="所在分类"
                  style="margin-right: 50px;"
                >
                  <tree-selector
                    style="width: 217px;"
                    class="selector"
                    :options="selectorData"
                    placeholder="请选择所在分类"
                    :props="seletorProps"
                    :value="queryForm.categoryId"
                    @getValue="(id) => (queryForm.categoryId = id)"
                  />
                </el-form-item>

                <el-form-item
                  label="关联问卷"
                  prop="subjectName"
                  style="margin-right: 0"
                >
                  <el-select
                    v-model="queryForm.subjectName"
                    v-el-select-loadmore="loadmoreSubject"
                    style="width: 457px;"
                    clearable
                    filterable
                    remote
                    reserve-keyword
                    :loading="remoteLoading"
                    placeholder="请输入"
                    :remote-method="(query) => remoteMethod(query)"
                    @focus="() => remoteMethod('')"
                  >
                    <el-option
                      v-for="item in subjectOptions"
                      :key="item.id"
                      :label="item.asqName"
                      :value="item.asqName"
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
                  style="margin-right: 50px;"
                  label="发布时间"
                  prop="publishTime"
                >
                  <el-date-picker
                    v-model="dateValue"
                    style="width: 564px"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm"
                    start-placeholder="开始日期"
                    end-placeholder="截止日期"
                  />
                </el-form-item>

                <el-form-item label="回收数量">
                  <el-form-item
                    prop="minBackCount"
                    style="margin-right: 0"
                  >
                    <el-input
                      v-model.number="queryForm.minBackCount"
                      oninput="this.value = this.value.replace(/[^\d.]/g,'');"
                      clearable
                      placeholder="最小值"
                      style="width: 220px"
                    />
                  </el-form-item>
                  <span style="display: inline-block; margin: 0 5px;">~</span>
                  <el-form-item prop="maxBackCount">
                    <el-input
                      v-model.number="queryForm.maxBackCount"
                      oninput="this.value = this.value.replace(/[^\d.]/g,'');"
                      clearable
                      placeholder="最大值"
                      style="width: 220px"
                    />
                  </el-form-item>
                </el-form-item>

                <div style="text-align: right; margin-right: 75px">
                  <el-button
                    type="primary"
                    size="medium"
                    :disabled="loading"
                    @click.native="handleSearch"
                  >
                    搜索
                  </el-button>
                  <el-button
                    size="medium"
                    @click="resetQueryForm"
                  >
                    重置
                  </el-button>
                </div>
              </el-form>
              <el-button
                slot="reference"
                size="medium"
                icon="icon-basics-filter-outlined"
                :disabled="loading"
              >
                筛选
              </el-button>
            </el-popover>
          </div>

          <div class="operate-right">
            <div class="fresh-wrap">
              <div
                class="fresh-btn"
                :style="{ cursor: loading ? 'not-allowed' : 'pointer' }"
                @click="resetFormAndGetList"
              >
                <i
                  class="el-icon-refresh-right"
                  style="margin-right: 2px"
                ></i>刷新
              </div>
            </div>
            <el-dropdown
              :hide-on-click="false"
              trigger="click"
            >
              <i class="el-icon-setting set-btn"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(val, key) in columns"
                  :key="key"
                >
                  <el-checkbox v-model="columns[key]">
                    {{ key }}
                  </el-checkbox>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>

      <div class="table-container">
        <div
          v-if="multipleSelection.length"
          style="margin-bottom: 8px"
        >
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
            :loading="multipleDelLoading"
            @click="() => handleDelete()"
          >
            批量删除
          </el-button>
        </div>

        <el-table
          ref="table"
          v-loading="loading"
          :data="data"
          height="50vh"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column
            type="selection"
            width="55"
          /> -->
          <el-table-column
            v-if="columns['编号']"
            fixed="left"
            align="center"
            prop="planCode"
            label="编号"
            width="180"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['问卷安排名称']"
            align="left"
            min-width="180"
            prop="planName"
            :show-overflow-tooltip="true"
            label="问卷安排名称"
          >
            <template slot-scope="scope">
              <div
                class="column-title"
                style="color: #01aafc; cursor: pointer;"
                @click="toDetail(scope.row)"
              >
                {{ scope.row.planName }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-if="columns['状态']"
            align="center"
            prop="status"
            :show-overflow-tooltip="true"
            label="状态"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.status == 1 ? '未开始' : scope.row.status == 2 ? '进行中' : '已过期' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columns['所在分类']"
            align="center"
            :show-overflow-tooltip="true"
            prop="categoryFullName"
            label="所在分类"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['回收数量']"
            align="center"
            :show-overflow-tooltip="true"
            prop="backCount"
            label="回收数量"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['关联问卷']"
            align="center"
            :show-overflow-tooltip="true"
            prop="subjectName"
            label="关联问卷"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['发布时间']"
            align="center"
            :show-overflow-tooltip="true"
            prop="publishTime"
            label="发布时间"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['截止时间']"
            align="center"
            :show-overflow-tooltip="true"
            prop="endTime"
            label="截止时间"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['创建时间']"
            align="center"
            :show-overflow-tooltip="true"
            prop="createTime"
            label="创建时间"
          >
          </el-table-column>

          <el-table-column
            prop="operate"
            align="center"
            label="操作"
            fixed="right"
            width="180"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                :loading="scope.row.deleteLoading"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>

              <el-dropdown
                trigger="click"
                style="margin-left: 10px;"
              >
                <el-button
                  type="text"
                  size="small"
                >
                  更多<i class="el-icon-arrow-more"></i>
                </el-button>

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :disabled="shouldbeDisabled(scope.row)"
                    @click.native="
                      handleStatusChange(
                        scope.row.id,
                        scope.row.status == 2 ? 1 : 2,
                        scope.row.planName
                      )
                    "
                  >
                    {{ scope.row.status == 1 ? '开始' : '暂停' }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    :disabled="scope.row.status !== 2 || scope.row.option == 0"
                    @click.native="handleStatusChange(scope.row.id, 3)"
                  >
                    结束
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="toDetail(scope.row, true)">
                    选项分布
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="page-container">
        <pagination
          :total="total"
          :page="queryForm.pageNo"
          :limit="queryForm.pageSize"
          @pagination="pagination"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/common-pagination'
import {
  queryQuestionnaireList,
  questionnaireList,
  deleteQuestionnaire,
  end,
  suspend,
  start
} from '@/api/questionnaire'
import { queryCategoryOrgList } from '@/api/resource/classroom'
import TreeSelector from '@/components/tree-selector'

export default {
  name: 'Management',
  components: {
    Pagination,
    TreeSelector
  },
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

  data() {
    var minBackCountValidate = (_, value, callback) => {
      const maxBackCount = this.queryForm.maxBackCount
      if (maxBackCount != '' && maxBackCount <= value) {
        callback(new Error('最小值不得大于或等于最大值'))
      } else {
        this.$refs.queryForm.clearValidate()

        callback()
      }
    }
    var maxBackCountValidate = (_, value, callback) => {
      const minBackCount = this.queryForm.minBackCount
      if (minBackCount != '' && minBackCount >= value) {
        callback(new Error('最大值不得小于或等于最小值'))
      } else {
        this.$refs.queryForm.clearValidate()

        callback()
      }
    }
    return {
      subjectLoading: false,
      remoteLoading: false,
      subjectOptions: [],
      noMoreSubject: false,
      queryFormVisible: false,
      columns: {
        编号: true,
        问卷安排名称: true,
        状态: true,
        所在分类: true,
        回收数量: true,
        关联问卷: true,
        发布时间: true,
        截止时间: true,
        创建时间: true
      },
      initForm: {
        pageNo: 1,
        pageSize: 10,
        categoryId: '',
        subjectName: '',
        publishTime: '',
        endTime: '',
        minBackCount: '',
        maxBackCount: '',
        status: ''
      },
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        categoryId: '',
        subjectName: '',
        publishTime: '',
        endTime: '',
        minBackCount: '',
        maxBackCount: '',
        status: ''
      },
      loading: false,
      multipleDelLoading: false,
      data: [],
      multipleSelection: [],
      total: 0,
      selectorData: [],
      seletorProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      queryFormRules: {
        minBackCount: [{ type: 'number', validator: minBackCountValidate, trigger: 'blur' }],
        maxBackCount: [{ type: 'number', validator: maxBackCountValidate, trigger: 'blur' }]
      },
      pickerOptionsStart: {},
      pickerOptionsEnd: {},
      subjectQuery: {
        currentPage: 1,
        size: 20,
        asqName: ''
      }
    }
  },
  computed: {
    dateValue: {
      get: function() {
        const { publishTime, endTime } = this.queryForm
        return [publishTime, endTime]
      },
      set: function([publishTime, endTime]) {
        Object.assign(this.queryForm, { publishTime, endTime })
      }
    }
  },
  watch: {
    columns: {
      handler() {
        this.$nextTick(() => {
          this.$refs.table.doLayout()
          this.$refs.table.$forceUpdate()
        })
      },
      deep: true
    },
    'queryForm.planName': _.debounce(function() {
      this.resetPageAndGetList()
    }, 1000)
  },
  activated() {
    this.getData()
  },
  methods: {
    loadmoreSubject() {
      if (this.subjectLoading) return
      this.subjectQuery.currentPage++
      this.remoteMethod(true)
    },

    remoteMethod(query) {
      this.subjectLoading = true
      if (typeof query != 'boolean') {
        this.subjectQuery.asqName = query
        this.subjectQuery.currentPage = 1
        this.subjectOptions = []
        this.remoteLoading = true
      }
      questionnaireList(this.subjectQuery)
        .then((res) => {
          const { list = [] } = res
          if (typeof query != 'boolean') {
            this.noMoreSubject = true
          } else {
            this.noMoreSubject = !list.length
          }
          this.subjectOptions = this.subjectOptions.concat(list)
        })
        .finally(() => {
          this.subjectLoading = false
          this.remoteLoading = false
        })
    },
    resetQueryForm() {
      this.queryForm = { ...this.initForm, planName: this.queryForm.planName }
      this.$refs.queryForm.clearValidate()
    },
    handleSearch() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.resetPageAndGetList()
        }
      })
    },
    shouldbeDisabled(item) {
      const { option } = item
      if (option == 0) return true
      if (item.status == 1) {
        return option != 1
      } else {
        return option != 2
      }
    },
    async handleStatusChange(id, status, name) {
      let result
      let api
      switch (status) {
        case 1:
          api = suspend
          result = await this.confirmSuspend(name)
          break
        case 2:
          api = start
          result = await this.confirmStart()
          break
        case 3:
          api = end
          result = await this.confirmFinish()
      }
      if (!result) return
      api({ id }).then(() => {
        this.$message.success('操作成功')
        this.getList()
      })
    },
    confirmFinish() {
      return this.$confirm('结束后，问卷将结束投放，并停止统计，确定要结束吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {})
    },
    confirmSuspend(name) {
      return this.$confirm(
        `暂停期间，问卷链接关闭，问卷不回收数据。确定要暂停回收问卷《${name}》吗？`,
        '提醒',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(() => {})
    },
    confirmStart() {
      return this.$confirm('该问卷将会继续投放，确认开始吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {})
    },
    publishTimeChange() {
      // 限制开始时间
      this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
        disabledDate: (time) => {
          if (this.queryForm.publishTime) {
            const publishTime = new Date(this.queryForm.publishTime)
            return time.getTime() < publishTime.getTime() && time.getDate() != publishTime.getDate()
          }
        }
      })
    },
    endTimeChange() {
      // 限制结束时间
      this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
        disabledDate: (time) => {
          if (this.queryForm.endTime) {
            const endTime = new Date(this.queryForm.endTime)
            return time.getTime() > endTime.getTime() && time.getDate() != endTime.getDate()
          }
        }
      })
    },
    resetPageAndGetList() {
      this.queryForm.pageNo = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    toDetail(item, toTab2) {
      const query = {
        id: item.id
      }
      if (toTab2) query.toTab2 = true
      this.$router.push({
        path: '/questionnaire/arrange/detail',
        query
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleEdit(edit) {
      const query = {}
      if (!(edit instanceof MouseEvent)) {
        Object.keys(edit).forEach((key) => {
          query[key] = edit[key]
        })
      }
      this.$router.push({
        path: '/questionnaire-arrange',
        query
      })
    },
    handleDelete(target) {
      if (target.status == 2) {
        this.$alert('你选择的问卷安排正在进行中，不能进行删除操作！', '提醒', {
          confirmButtonText: '确认',
          type: 'warning'
        })
        return
      }
      const message = target ? '您确定删除选中的问卷安排吗？' : '您确定要批量删除选中的问卷安排吗？'
      this.$confirm(message, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = target ? [target] : this.multipleSelection

          ids = ids.map((item) => item.id).join('')
          if (target) {
            target.deleteLoading = true
          } else {
            this.multipleDelLoading = true
          }
          deleteQuestionnaire({ ids })
            .then(() => {
              this.$message.success('删除成功')
            })
            .finally(() => {
              if (target) {
                target.deleteLoading = false
              } else {
                this.multipleDelLoading = false
              }
            })
        })
        .catch(() => {})
    },
    getData() {
      this.getList()

      queryCategoryOrgList({ source: 'questionnaire' }).then((res) => {
        this.selectorData = res
      })
    },
    getList() {
      if (this.loading) return
      this.loading = true
      queryQuestionnaireList(this.queryForm)
        .then((res) => {
          const { totalNum = 0, data = [] } = res
          this.total = totalNum
          this.data = data
        })
        .finally(() => (this.loading = false))
    },
    resetFormAndGetList() {
      this.queryForm = { ...this.initForm }
      this.getList()
    },
    pagination({ page, limit }) {
      this.queryForm.pageNo = page
      this.queryForm.pageSize = limit
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.filter-form {
  .el-form-item__label {
    text-align: center;
  }
  .el-form--inline .el-form-item {
    margin-right: 50px !important;
  }
}
.arrange {
  .column-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-form-item {
    margin-right: 20px;
  }
  .el-form--inline .el-form-item {
    margin-right: 22px !important;
  }
  .operate-wrapper .operate-left .input-wrapper {
    .el-input__inner {
      height: 34px;
      line-height: 34px;
    }
  }
  .icon-basics-filter-outlined {
    font-size: 14px;
  }
}
</style>
<style lang="scss" scoped>
.arrange {
  .body {
    background-color: #fff;
    padding: 24px;
    margin-bottom: 24px;

    .filter-container {
      .operate-wrapper {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        .operate-left {
          display: flex;
          align-items: center;
          .input-wrapper {
            width: 202px;
            margin-right: 10px;
          }
          .filter-btn {
            width: 85px;
          }
        }
        .operate-right {
          display: flex;
          align-items: center;
          height: 36px;
          margin-right: 10px;
          color: #a0a8ae;
          .fresh-wrap {
            padding-right: 10px;
            border-right: 1px solid #a0a8ae;
            .fresh-btn {
              cursor: pointer;
            }
          }
          .set-btn {
            cursor: pointer;
            margin-left: 10px;
            margin-top: 2px;
          }
        }
      }
    }
    .table-container {
    }
  }
}
</style>
