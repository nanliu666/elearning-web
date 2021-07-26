<template>
  <div class="screen">
    <div class="left">
      <div class=" department">
        <search-popover
          ref="searchPopover"
          :require-options="paramsList.requireOptions"
          :popover-options="paramsList.popoverOptions"
          @submit="departmentSelect"
        >
          <div slot="isMerge">
            <el-checkbox v-model="isMerge">
              合并同一用户
            </el-checkbox>
          </div>
        </search-popover>
      </div>
      <div
        v-show="$slots.frist"
        class="inputSlot"
      >
        <slot name="frist"></slot>
      </div>
      <div
        v-show="$slots.second"
        class="inputSlot"
      >
        <slot name="second"></slot>
      </div>
    </div>
    <div class="right">
      <div class="btn">
        <template v-if="isQueryDisabled">
          <el-button
            v-show="noQuery"
            type="defalut"
            :disabled="noQuery"
            @click="query"
          >
            查询
          </el-button>
          <el-button
            v-show="!noQuery"
            type="primary"
            @click="query"
          >
            查询
          </el-button>
        </template>
        <template v-else>
          <el-button
            type="primary"
            @click="query"
          >
            查询
          </el-button>
        </template>
        <el-button @click="reset">
          重置
        </el-button>
      </div>
      <div class="showCoulnm">
        <el-popover
          placement="bottom"
          min-width="40"
          trigger="click"
          style="margin-left:10px"
        >
          <el-checkbox-group
            v-model="showColumnsVisible"
            style="display: flex; flex-direction: column"
            @change="showColunmsChange"
          >
            <el-checkbox
              v-for="item in columnsVisibleFilter"
              :key="item.prop"
              :label="item.prop"
              :disabled="item.isDisabled"
              class="originColumn"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
          <div
            slot="reference"
            class="settiongColunm"
          >
            <i class="el-icon-s-tools"></i>
            <span>列项显示</span>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
// import { commonParams } from './paramsConfig'
// import { getOrgTreeSimple } from '@/api/org/org'
import { getorganizationNew } from '@/api/org/org'
import SearchPopover from '@/components/searchPopOver/index'
function loadSelectTreeFn(node, resolve) {
  //  懒加载下拉树数据
  let params = { parentId: node.data && node.data.id ? node.data.id : '0' }
  getorganizationNew(params).then((res) => {
    resolve(res)
  })
}
const commonParams = {
  type: 'treeSelectNew',
  field: 'orgId',
  label: '部门',
  data: '',
  config: {
    selectParams: {
      placeholder: '请输入内容',
      multiple: false
    },
    treeParams: {
      data: [],
      'check-strictly': true,
      'default-expand-all': false,
      'expand-on-click-node': false,
      clickParent: true,
      load: loadSelectTreeFn,
      lazy: true,
      filterable: false,
      props: {
        isLeaf: (data) => {
          return !data.hasChildren
        },
        children: 'children',
        label: 'orgName',
        disabled: 'disabled',
        value: 'orgId'
      }
    }
  }
}
let timeOut = null
export default {
  components: { SearchPopover },
  props: {
    params: {
      type: Array,
      default: () => []
    },
    columnsVisibleFilter: {
      type: Array,
      default: () => []
    },
    columnsVisible: {
      type: Array,
      default: () => []
    },
    queryData: {
      //查询条件
      type: Object,
      default: () => {}
    },
    isQueryDisabled: {
      //无查询条件时候是否禁止查询
      type: Boolean,
      default: false
    },
    disabledDate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      paramsList: {},
      showColumnsVisible: [],
      noQuery: false,
      isMerge: false,
      orgOption: ''
    }
  },
  watch: {
    // columnsVisible:{
    //   handler(val){
    //     this.showColumnsVisible=val;
    //   },
    //   deep:true,
    // }
    queryData: {
      handler(val) {
        this.isLoadData(val)
      },
      deep: true
    }
  },
  mounted() {
    this.showColumnsVisible = this.columnsVisible
    const dataPicker = [
      {
        type: 'dataPicker',
        field: 'startTime,endTime',
        data: [],
        label: '时间',
        config: {
          rangeSeparator: '~',
          type: 'daterange'
        }
      }
    ]
    this.$set(this, 'paramsList', {
      requireOptions: [commonParams, ...dataPicker, ...this.params]
    })
    this.isLoadData(this.queryData)
  },
  methods: {
    //判断是否加载数据
    isLoadData(val) {
      if (val) {
        const value = Object.values(val)
        this.noQuery = value.some((i) => i == '')
      }
    },
    //获取树
    // getOrgTree() {
    //   getOrgTreeSimple({ parentOrgId: 0 }).then((res) => {
    //     this.treeOptions = res
    //     let orgId = _.find(this.paramsList.requireOptions, { field: 'orgId' })
    //     orgId.config.treeParams.data = res
    //   })
    // },
    departmentSelect(val) {
      this.$emit('dateChange', [val.startTime, val.endTime] || [])
      this.$emit('paramsChange', val)
    },
    query() {
      if (timeOut !== null) {
        clearInterval(timeOut)
      }
      timeOut = setTimeout(() => {
        this.$emit('changeQuery', true, 'clickQuery')
      }, 260)
    },
    reset() {
      this.isMerge = false
      _.forEach(this.paramsList.requireOptions, (x) => {
        x.data = ''
      })
      this.departmentSelect({})
      this.$emit('resetQuery')
    },
    showColunmsChange(val) {
      this.$emit('showColunmsChange', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.originColumn {
  height: 25px;
  margin-right: 10px;
}
.screen {
  display: flex;
  margin-bottom: 6px;
  .settiongColunm {
    cursor: pointer;
    i {
      margin-right: 4px;
    }
  }
  .inputSlot {
    display: flex;
    align-items: center;
    margin: 0 16px 10px 0;
    padding-top: 4px;
    > span {
      margin-right: 12px;
    }
    > div {
      flex: 1;
    }
  }
  .left {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    & > div {
      display: flex;
      align-items: center;
    }
  }
  .right {
    flex-shrink: 0;
    margin-left: 35px;
    display: flex;
    flex-direction: column;

    .btn {
      display: flex;
      flex-shrink: 0;
      align-items: center;
    }
    .showCoulnm {
      margin: 24px 0 10px;
      display: flex;
      align-items: center;
      color: #a0a8ae;
      justify-content: flex-end;
    }
  }
  ::v-deep .btn button.el-button {
    width: 88px;
    height: 33px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ::v-deep i.el-input__icon.el-range__icon.el-icon-date {
    position: absolute;
    top: 0;
    right: 0;
  }
  ::v-deep .el-form--inline .el-form-item {
    margin-right: 24px;
  }
  ::v-deep .require-form .el-form-item {
    margin-bottom: 10px;
    padding: 0 !important;
  }
  ::v-deep input.el-input__inner,
  ::v-deep.el-date-editor--daterange,
  input.el-input__inner {
    width: 250px !important;
  }
}
</style>
