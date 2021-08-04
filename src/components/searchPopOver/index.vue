<template>
  <div>
    <el-form
      :inline="true"
      class="require-form"
      @submit.native.prevent
    >
      <el-form-item
        v-for="(item, index) in requireOptions"
        :key="`${item.field}${index}`"
        :label="item.label"
        :class="[item.type === 'treeSelect' ? 'treeSelect' : '', 'require-form-item']"
      >
        <el-input
          v-if="item.type === 'input'"
          v-model="item.data"
          :type="item.config && item.config.type ? item.config.type : 'text'"
          :placeholder="item.config.placeholder || '请输入' + item.label"
          class="elInput"
          :maxlength="item.config && item.config.maxlength"
          :suffix-icon="item.config && item.config['suffix-icon']"
          clearable
          @input="search(item)"
        />
        <el-select
          v-if="item.type === 'select'"
          v-model="item.data"
          v-loadmore="() => item.loadMoreFun && item.loadMoreFun(item)"
          :placeholder="'请选择'"
          :multiple="item.config && item.config.multiple"
          :collapse-tags="item.config && item.config.multiple"
          :filterable="item.config && item.config.filterable"
          @visible-change="item.firstLoad && item.firstLoad($event, item)"
          @change="change"
        >
          <template v-if="item.config && item.config.group">
            <el-option-group
              v-for="(group, i) in item.options"
              :key="`${group.label}${i}`"
              :label="group.label"
            >
              <el-option
                v-for="(it, c) in group.options"
                :key="`${it.value}${c}`"
                :label="it[_.get(item, 'config.optionLabel', 'label')]"
                :value="it[_.get(item, 'config.optionValue', 'value')]"
              />
            </el-option-group>
          </template>
          <template v-else>
            <el-option
              v-for="(it, x) in item.options"
              :key="`${it[_.get(item, 'config.optionValue', 'value')]}${x}`"
              :label="it[_.get(item, 'config.optionLabel', 'label')]"
              :value="it[_.get(item, 'config.optionValue', 'value')]"
            />
          </template>
          <div
            v-show="item.loadMoreFun ? item.loading : false"
            class="addressLoading"
            style="text-align: center"
          >
            <i class="el-icon-loading" />
          </div>
          <div
            v-show="item.noMore"
            style="text-align: center; font-size: 14px; color: #606266"
          >
            没有更多了
          </div>
        </el-select>
        <el-time-select
          v-if="item.type === 'timeSelect'"
          v-model="item.data"
          placeholder="选择时间"
          @change="change"
        />
        <el-time-picker
          v-if="item.type === 'timePicker'"
          v-model="item.data"
          placeholder="选择时间"
          @change="change"
        />
        <!--        <el-cascader-->
        <!--          v-if="item.type === 'cascader'"-->
        <!--          v-model="item.data"-->
        <!--          :options="item.options"-->
        <!--          :props="item.props"-->
        <!--        />-->
        <el-date-picker
          v-if="item.type === 'dataPicker'"
          v-model="item.data"
          :type="item.config && item.config.type ? item.config.type : 'date'"
          :value-format="
            item.config && item.config['value-format'] ? item.config['value-format'] : 'yyyy-MM-dd'
          "
          :range-separator="
            item.config && item.config.rangeSeparator ? item.config.rangeSeparator : '-'
          "
          :default-time="item.config && item.config['default-time']"
          :picker-options="item.config ? item.config.disabledDate : {}"
          placeholder="结束时间"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          style="width: 198px"
          :unlink-panels="true"
          @change="change"
        />
        <num-interval
          v-if="item.type === 'numInterval'"
          v-model="item.data"
        />
        <el-tree-select
          v-if="item.type === 'treeSelect'"
          :ref="item.field"
          v-model="item.data"
          :popover-class="item.config.fas"
          :styles="item.styles"
          :select-params="item.config.selectParams"
          :tree-params="item.config.treeParams"
          @change="change"
        />
        <el-tree-select-new
          v-if="item.type === 'treeSelectNew'"
          :ref="item.field"
          v-model="item.data"
          :popover-class="item.config.fas"
          :styles="item.styles"
          :select-params="item.config.selectParams"
          :tree-params="item.config.treeParams"
          @change="change"
          @clearHandle="clearHandle"
        />
        <slot
          v-if="item.type === 'slot'"
          :name="item.field"
        />
        <!-- <tree-select
          v-if="item.type === 'treeSelect'"
          v-model="item.data"
          :option="item.options"
          :is-search="false"
          :is-single="item.isSingle || false"
          @change="change"
        />-->

        <lazy-load-cascader
          v-if="item.type === 'lazycascader'"
          ref="lazycascader"
          v-model="item.data"
          filterable
          :disabled="item.disabled"
          :placeholder="item.placeholder"
          :filter-method="item.filterMethod"
          :filter-props="item.filterProps"
          :options="item.options"
          :props="item.props"
          clearable
          @change="(data) => handleLazyCascaderChange(item, data)"
        >
        </lazy-load-cascader>
      </el-form-item>
      <el-form-item
        v-if="popoverOptions.length > 0"
        class="require-form-item"
      >
        <el-popover
          v-model="popoverShow"
          placement="bottom"
          trigger="click"
          :popper-class="popoverClass"
        >
          <div>
            <el-form
              size="small"
              class="popover-form"
              label-position="top"
            >
              <el-row
                justify="start"
                :gutter="24"
              >
                <el-col
                  v-for="(item, j) in popoverOptions"
                  :key="`${item.field}${j}`"
                  :span="8"
                >
                  <el-form-item :label="item.label">
                    <lazy-load-cascader
                      v-if="item.type === 'lazycascader'"
                      ref="lazycascader"
                      v-model="item.data"
                      filterable
                      :disabled="item.disabled"
                      :placeholder="item.placeholder"
                      :filter-method="item.filterMethod"
                      :filter-props="item.filterProps"
                      :options="item.options"
                      :props="item.props"
                      clearable
                      @change="(data) => handleLazyCascaderChange(item, data)"
                    >
                    </lazy-load-cascader>

                    <el-input
                      v-if="item.type === 'input'"
                      v-model="item.data"
                      :type="item.config && item.config.type ? item.config.type : 'text'"
                      :placeholder="
                        (item.config && item.config.placeholder) || '请输入' + item.label
                      "
                      :maxlength="item.config && item.config.maxlength"
                      :suffix-icon="item.config && item.config['suffix-icon']"
                      class="elInput"
                    />

                    <el-select
                      v-if="item.type === 'select'"
                      v-model="item.data"
                      v-loadmore="() => item.loadMoreFun && item.loadMoreFun(item)"
                      :placeholder="'请选择'"
                      :multiple="item.config && item.config.multiple"
                      :collapse-tags="item.config && item.config.multiple"
                      :filterable="item.config && item.config.filterable"
                      @visible-change="item.firstLoad && item.firstLoad($event, item)"
                    >
                      <template v-if="item.config && item.config.group">
                        <el-option-group
                          v-for="(group, k) in item.options"
                          :key="`${group.label}${k}`"
                          :label="group.label"
                        >
                          <el-option
                            v-for="(it, z) in group.options"
                            :key="`${it.value}${z}`"
                            :label="it[_.get(item, 'config.optionLabel', 'label')]"
                            :value="it[_.get(item, 'config.optionValue', 'value')]"
                          />
                        </el-option-group>
                      </template>
                      <template v-else>
                        <el-option
                          v-for="(it, l) in item.options"
                          :key="`${it[_.get(item, 'config.optionValue', 'value')]}${l}`"
                          :label="it[_.get(item, 'config.optionLabel', 'label')]"
                          :value="it[_.get(item, 'config.optionValue', 'value')]"
                        />
                      </template>
                      <div
                        v-show="item.loadMoreFun ? item.loading : false"
                        class="addressLoading"
                        style="text-align: center"
                      >
                        <i class="el-icon-loading" />
                      </div>
                      <div
                        v-show="item.noMore"
                        style="text-align: center; font-size: 14px; color: #606266"
                      >
                        没有更多了
                      </div>
                    </el-select>
                    <el-time-select
                      v-if="item.type === 'timeSelect'"
                      v-model="item.data"
                      placeholder="选择时间"
                    />
                    <el-time-picker
                      v-if="item.type === 'timePicker'"
                      v-model="item.data"
                      placeholder="选择时间"
                    />
                    <el-cascader
                      v-if="item.type === 'cascader'"
                      v-model="item.data"
                      :options="item.options"
                      :props="item.props"
                    />
                    <el-date-picker
                      v-if="item.type === 'dataPicker'"
                      v-model="item.data"
                      :value-format="
                        item.config && item.config['value-format']
                          ? item.config['value-format']
                          : 'yyyy-MM-dd'
                      "
                      :range-separator="
                        item.config && item.config.rangeSeparator ? item.config.rangeSeparator : '-'
                      "
                      :default-time="item.config && item.config['default-time']"
                      :type="item.config && item.config.type ? item.config.type : 'date'"
                      :picker-options="item.config ? item.config.disabledDate : {}"
                      :placeholder="
                        item.config && item.config.placeholder
                          ? item.config.placeholder
                          : '结束时间'
                      "
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      :unlink-panels="true"
                    />
                    <num-interval
                      v-if="item.type === 'numInterval'"
                      v-model="item.data"
                      :max-placeholder="item.maxPlaceholder || '最大值'"
                      :min-placeholder="item.minPlaceholder || '最小值'"
                    />
                    <el-tree-select
                      v-if="item.type === 'treeSelect'"
                      :ref="item.field"
                      v-model="item.data"
                      :popover-class="item.config.fas"
                      :styles="item.styles"
                      :select-params="item.config.selectParams"
                      :tree-params="item.config.treeParams"
                    />
                    <el-tree-select-new
                      v-if="item.type === 'treeSelectNew'"
                      :ref="item.field"
                      v-model="item.data"
                      :popover-class="item.config.fas"
                      :styles="item.styles"
                      :select-params="item.config.selectParams"
                      :tree-params="item.config.treeParams"
                      @clearHandle="clearHandle"
                    />
                    <lazy-select
                      v-if="item.type === 'lazySelect'"
                      :ref="item.field"
                      v-model="item.data"
                      :load="item.load"
                      :option-list.sync="item.optionList"
                      :placeholder="item.placeholder"
                      :option-props="item.optionProps"
                      :searchable="item.searchable"
                    />
                    <slot
                      v-if="item.type === 'slot'"
                      :name="item.field"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="popOver-footer">
              <el-button
                type="primary"
                size="medium"
                @click="submitSearch"
              >
                搜索
              </el-button>
              <el-button
                size="medium"
                @click="resetForm"
              >
                重置
              </el-button>
            </div>
          </div>
          <el-button
            slot="reference"
            size="medium"
            icon="icon-basics-filter-outlined"
            class="select-btn"
          >
            筛选
          </el-button>
        </el-popover>
        <slot v-if="hasSlotRight" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import NumInterval from '../numInterval/numInterval'
import ElTreeSelect from '../elTreeSelect/elTreeSelect'
import elTreeSelectNew from '@/components/tree-selectorNew/index.vue'
import lazyLoadCascader from '@/components/lazy-load-cascader'
import _ from 'lodash'
export default {
  name: 'SearchPopOver',
  components: {
    lazyLoadCascader,
    NumInterval,
    ElTreeSelect,
    elTreeSelectNew,
    LazySelect: () => import('@/components/lazy-select/lazySelect')
  },
  props: {
    // TODO待优化：为解决预订教室弹窗的popover样式，暂时只想到这个解决方案
    isCustomPopoverClass: {
      type: Boolean,
      default: false
    },
    // 定制筛选按钮右侧文字
    hasSlotRight: {
      type: Boolean,
      default: false
    },
    // 筛选弹窗外部
    requireOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 筛选内部
    popoverOptions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      tags: [],
      popoverShow: false
    }
  },
  computed: {
    popoverClass() {
      return this.isCustomPopoverClass ? 'cusrtom__class' : 'popover-class'
    }
  },
  watch: {
    requireOptions: {
      handler(newVal) {
        newVal.forEach((item) => {
          if (item.type === 'treeSelect') {
            this.$refs[item.field] &&
              this.$refs[item.field][0].treeDataUpdateFun(item.config.treeParams.data)
          }
        })
      },
      deep: true
    },
    popoverOptions: {
      handler(newVal) {
        newVal.forEach((item) => {
          if (item.type === 'treeSelect') {
            this.$refs[item.field] &&
              this.$refs[item.field][0].treeDataUpdateFun(item.config.treeParams.data)
          }
        })
      },
      deep: true
    },
    $route() {
      this.popoverShow = false
    }
  },
  methods: {
    handleLazyCascaderChange(item, data) {
      item.data = Array.isArray(data) ? (data.length ? data[data.length - 1] : '') : data
    },
    dataChange() {
      this.submitSearch()
    },
    clearHandle() {
      this.$emit('submit', this.produceSearchParams())
    },
    // 筛选已有值的options
    screenValueArr(arr) {
      this.requireOptions.forEach((item) => {
        // items.forEach((item, idx) => {
        if (item.data) {
          if (Array.isArray(item.data) && item.data.length === 0) return
          if (item.type === 'numInterval') {
            if (!(item.data.min && item.data.max)) return
            arr.push(item)
          } else {
            arr.push(item)
          }
        }
        // })
      })
      this.popoverOptions.forEach((item) => {
        // items.forEach((item, idx) => {
        if (item.data) {
          if (Array.isArray(item.data) && item.data.length === 0) return
          if (item.type === 'numInterval') {
            if (!(item.data.min && item.data.max)) return
            arr.push(item)
          } else {
            arr.push(item)
          }
        }
        // })
      })
    },
    treeDataUpdateFun(data, refKey) {
      this.$refs[refKey][0].treeDataUpdateFun(data)
    },
    // 触发搜索，往外提交已选参数
    submitSearch() {
      this.$emit('submit', this.produceSearchParams())
      this.popoverShow = false
    },
    search: _.debounce(function(obj) {
      if (obj.data.match(/^[ ]+$/)) return
      this.submitSearch()
    }, 500),
    change() {
      this.submitSearch()
    },
    // 生成搜索参数
    produceSearchParams() {
      let params = {}
      let tagsArr = [...this.requireOptions, ...this.popoverOptions]
      // 筛选出有值的选项
      // this.screenValueArr(tagsArr)
      tagsArr.forEach((item) => {
        if (item.type === 'input' || item.type === 'timeSelect' || item.type === 'timePicker') {
          params[item.field] = item.data
        } else if (item.type === 'numInterval') {
          params[item.field.split(',')[0]] = item.data ? item.data.min : null
          params[item.field.split(',')[1]] = item.data ? item.data.max : null
        } else if (item.type === 'treeSelect' || item.type === 'select') {
          if (
            (item.type === 'select' && item.config && item.config.multiple) ||
            (item.type === 'treeSelect' && _.get(item, 'config.selectParams.multiple'))
          ) {
            params[item.field] = item.data
          } else {
            params[item.field] = item.data
          }
        } else if (item.type === 'cascader') {
          // params[item.field] = item.data[item.data.length - 1]
          item.field.split(',').forEach((it, idx) => {
            params[it] = item.data[idx]
          })
        } else if (
          item.type === 'dataPicker' &&
          item.config &&
          item.config.type.indexOf('range') > -1
        ) {
          item.field.split(',').forEach((it, idx) => {
            params[it] = item.data ? item.data[idx] : null
          })
        } else if (item.type === 'lazycascader') {
          params[item.field] = Array.isArray(item.data)
            ? item.data.length
              ? item.data[item.data.length - 1]
              : ''
            : item.data
        } else {
          params[item.field] = item.data
        }
      })
      return params
    },
    resetForm() {
      this.popoverOptions.forEach((item) => {
        if (item.type === 'numInterval') {
          item.data = { min: '', max: '' }
        } else if (
          (item.type === 'treeSelect' && _.get(item, 'config.selectParams.multiple')) ||
          (item.config && item.config.type && item.config.type.indexOf('range') > -1) ||
          (item.type === 'select' && _.get(item, 'config.multiple'))
        ) {
          item.data = []
        } else {
          item.data = ''
        }

        if (item.type === 'lazycascader') {
          item.data = ''
        }
      })
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss">
.cusrtom__class {
  left: 40% !important;
  right: 0;
}
.popover-class {
  left: calc(16.5vw + 32px) !important;
  right: 32px;
}
</style>

<style lang="scss" scoped>
/deep/ .require-form-item {
  margin-bottom: 0;
}
.popOver-footer {
  margin: 0 auto;
  text-align: right;
}
.require-form {
  .el-form-item {
    padding-right: 6px;
  }
}
// .popover-form {
//   .el-form-item {
//     padding-right: 24px;
//     &:last-of-type {
//       padding-right: 0;
//     }
//   }
// }

// /deep/ .el-form-item__label {
//   line-height: 30px;
// }
/deep/ .treeSelect {
  .el-form-item__content {
    min-width: 198px;
  }
}

/deep/ .el-form-item__content {
  .el-select,
  .el-date-editor,
  .el-cascader {
    width: 100%;
  }
}
/deep/ .el-form-item__label {
  font-family: 'PingFangSC-Medium';
  font-size: 14px;
  color: #202940;
}
.el-col-8 {
  min-width: 280px;
  margin-bottom: 16px;
  height: 72px;
}
/deep/ .el-input__icon.el-icon-search {
  cursor: pointer;
}

/deep/ .icon-basics-filter-outlined {
  font-size: 14px;
}
</style>
