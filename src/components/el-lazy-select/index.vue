<template>
  <el-select
    ref="selector"
    v-loadmore="() => _remoteMethod()"
    class="el-lazy-select"
    remote
    :value="value"
    :filterable="filterable"
    :remote-method="_remoteMethod"
    :multiple="multiple"
    :clearable="clearable"
    :placeholder="placeholder"
    :disabled="disabled"
    :loading="searchLoading"
    @visible-change="handleVisible"
    @change="handleChange"
  >
    <el-option
      v-for="(option, index) in optionList"
      :key="index"
      :label="props.formatter ? props.formatter(option) : option[props.label]"
      :value="option[props.value]"
    />
    <div
      v-if="loadLoading"
      class="tips-text"
    >
      <i class="el-icon-loading" />
    </div>
    <div
      v-if="noMore && optionList.length && !loadLoading"
      class="tips-text"
    >
      没有更多了
    </div>

    <el-option
      v-if="emptyTipsVisible"
      value=""
    >
      <span
        :style="emptyStyle"
        class="empty-tips"
      >{{emptyText}}</span>
    </el-option>
  </el-select>
</template>

<script>
const INITIAL_QUERY_PROPS = {
  page: 'pageNo',
  size: 'pageSize',
  search: 'search'
}
const INITIAL_RESPONSE_PROPS = {
  data: 'data',
  total: 'totalNum'
}
const uniqueObjArray = (array, key) => {
  const map = {}
  return array.filter((obj) => !map[obj[key]] && (map[obj[key]] = true))
}
export default {
  name: 'LazySelect',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    emptyText: {
      type: String,
      default: '无数据'
    },
    dataFilter: null,
    props: {
      type: Object,
      default() {
        return {
          value: 'id',
          label: 'name'
        }
      }
    },
    queryProps: {
      type: Object,
      default() {
        return INITIAL_QUERY_PROPS
      }
    },
    responseProps: {
      type: Object,
      default() {
        return INITIAL_RESPONSE_PROPS
      }
    },
    value: {
      type: [String, Array],
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    remoteMethod: {
      type: Function,
      default: Promise.resolve
    },
    disabled: {
      type: Boolean,
      default: false
    },
    querySize: {
      type: Number,
      default: 20
    },
    initialOptions: {
      type: Array,
      default() {
        return []
      }
    },
    visibleChangeDisabled: {
      type: Boolean,
      default:false
    }
  },
  data() {
    return {
      loadLoading: false,
      searchLoading: false,
      noMore: false,
      optionData: [],
      query: {},
      hasInitData: false
    }
  },
  computed: {
    emptyStyle() {
      return {
        position: 'relative',
        bottom: '1px',
        'font-size': '13px',
        color: '#9c9c9c',
        'font-weight': 'normal',
        'text-align': 'center',
        'text-indent': '-20px',
        'background-color': '#fff',
        cursor: 'default',
        display: 'inline-block',
        width: 'calc(100% + 60px)',
        'margin-left': '-20px'
      }
    },
    emptyTipsVisible() {
      return !this.optionList.length && !this.loadLoading && !this.searchLoading
    },
    optionList: {
      get() {
        const searchValue = this.query[this.queryProps.search]
        const initialData = this.initialOptions.filter((option) => option[this.props.value])
        if (this.optionData.length) {
          return searchValue
            ? this.optionData
            : uniqueObjArray(initialData.concat(this.optionData), this.props.value)
        }
        if (!this.hasInitData) {
          // eslint-disable-next-line vue/no-async-in-computed-properties
          this._remoteMethod('').then(() => {
            this.handleChange(this.value)
          })
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.hasInitData = true
        }
        return searchValue ? [] : initialData
      }
    }
  },
  created() {
    this.mergeConfig(this.queryProps, INITIAL_QUERY_PROPS)
    this.mergeConfig(this.responseProps, INITIAL_RESPONSE_PROPS)
    this.query[this.queryProps.size] = this.querySize
  },
  methods: {
    $updateData() {
      this._remoteMethod('')
    },
    mergeConfig(config, defaultConfig) {
      Object.keys(defaultConfig).forEach((key) => {
        if (!config[key]) {
          config[key] = defaultConfig[key]
        }
      })
    },
    handleVisible(visible) {
      if (visible && !this.visibleChangeDisabled) {
        this._remoteMethod('')
      }
    },
    _remoteMethod(search) {
      if (this.searchLoading || this.loadLoading) return
      const query = this.query
      let loading
      const { size: sizeKey, page: pageKey, search: searchKey } = this.queryProps
      if (search || search === '') {
        query[pageKey] = 1
        query[searchKey] = search
        this.optionData = []
        loading = 'searchLoading'
      } else {
        if (this.noMore) return
        query[pageKey]++
        loading = 'loadLoading'
      }
      this[loading] = true
      if (!this.hasInitData) {
        query[sizeKey] = 200
        this.hasInitData = true
      } else {
        query[sizeKey] = this.querySize
      }

      return this.remoteMethod(query)
        .then((res) => {
          let data = [],
            total = 0
          if (Array.isArray(res)) {
            data = res
          } else {
            const { data: dataKey, total: totalKey } = this.responseProps
            data = res[dataKey]
            total = res[totalKey]
          }
          if (search || search === '' && !data.length) {
            this.$emit('no-data')
          }
          this.optionData = uniqueObjArray(this.optionData.concat(data), this.props.value)
          if (this.dataFilter && typeof this.dataFilter === 'function') {
            this.optionData = this.optionData.filter(this.dataFilter)
          }
          this.noMore = query[pageKey] * query[sizeKey] >= total
          this[loading] = false
        })
        .catch(() => {
          query[pageKey]--
        })
    },
    handleChange(value) {
      const { value: valueKey, label: labelKey } = this.props
      this.$emit('change', value)
      if (!value || !this.optionList.find((option) => option[valueKey] === value)) return
      let data, label
      if (Array.isArray(value)) {
        data = this.optionList.filter((option) => value.indexOf(option[valueKey]) > -1)
        label = data.map((item) => item[labelKey])
      } else {
        data = this.optionList.find((option) => option[valueKey] === value)
        label = data[labelKey]
      }
      this.$emit('getLabel', label)
      this.$emit('getSelected', data)
    }
  },
}
</script>
<style lang="scss">
.empty-tips {
  font-size: 13px !important;
  color: #9c9c9c;
  font-weight: normal;
  text-align: center;
  text-indent: 20px;
  background-color: #fff;
  cursor: default;
  display: inline-block;
  width: calc(100% + 60px);
  margin-left: -20px;
  &:hover {
    background-color: #ffffff;
  }
}

.el-select-dropdown__wrap {
  overflow: scroll !important;
  max-height: 274px !important;
}
</style>
<style lang="scss" scoped>
.el-select-dropdown__wrap {
  overflow: auto !important;
  max-height: 274px !important;
}
.tips-text {
  padding: 12px 0;
  text-align: center;
  color: rgb(156, 156, 156);
}
.el-select {
  width: 100%;
}
</style>
