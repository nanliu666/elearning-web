<template>
  <el-select
    ref="selector"
    v-loadmore="() => _remoteMethod()"
    class="el-lazy-select"
    no-data-text="无数据"
    remote
    :value="value"
    :filterable="filterable"
    :remote-method="_remoteMethod"
    :loading="searchLoading"
    :multiple="multiple"
    :clearable="clearable"
    :placeholder="placeholder"
    :disabled="disabled"
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
      v-if="noMore"
      class="tips-text"
    >
      没有更多了
    </div>
    <div
      v-if="!optionList.length"
      class="tips-text"
    >
      无数据
    </div>
  </el-select>
</template>

<script>
const INITIAL_QUERY_PROPS = {
  page: 'pageNo',
  size: 'pageSize',
  search: 'search'
}
export default {
  name: 'LazySelect',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
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
        return JSON.parse(JSON.stringify(INITIAL_QUERY_PROPS))
      }
    },
    responseProps: {
      type: Object,
      default() {
        return {
          data: 'data',
          total: 'totalNum'
        }
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
    initOptions: {
      type: Array,
      default() {
        return []
      }
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
    optionList: {
      get() {
        const searchValue = this.query[this.queryProps.search]
        const initialData = this.initOptions.filter((option) => option[this.props.value])
        if (this.optionData.length) {
          return searchValue
            ? this.optionData
            : _.uniqBy(initialData.concat(this.optionData), this.props.value)
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
    Object.assign(this.queryProps, INITIAL_QUERY_PROPS)
    this.query[this.queryProps.size] = this.querySize
  },
  methods: {
    handleVisible(visible) {
      if (visible) {
        this._remoteMethod('')
      }
    },
    _remoteMethod(search) {
      const query = this.query
      const hasSearch = !!search || search === ''
      if (!this.hasInitData) {
        this.query[this.queryProps.size] = 200
        this.hasInitData = true
      } else {
        this.query[this.queryProps.size] = this.querySize
      }

      let loading
      if (hasSearch) {
        loading = 'searchLoading'
        query[this.queryProps.page] = 1
        query[this.queryProps.search] = search
      } else {
        if (this.noMore) return
        loading = 'loadLoading'
        query[this.queryProps.page]++
      }
      this[loading] = true
      if (hasSearch) {
        this.optionData = []
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
          this.optionData = _.uniqBy(this.optionData.concat(data), this.props.value)
          if (this.dataFilter) {
            this.optionData = this.optionData.filter(this.dataFilter)
          }
          this.noMore = query[this.queryProps.page] * query[this.queryProps.size] >= total
          this[loading] = false
        })
        .catch(() => {
          query[this.queryProps.page]--
        })
    },
    handleChange(value) {
      this.$emit('change', value)
      if (!value || !this.optionList.find((option) => option[this.props.value] === value)) return
      let data, label
      if (Array.isArray(value)) {
        data = this.optionList.filter((option) => value.indexOf(option[this.props.value]) > -1)
        label = data.map((item) => item[this.props.label])
      } else {
        data = this.optionList.find((option) => option[this.props.value] === value)
        label = data[this.props.label]
      }
      this.$emit('getLabel', label)
      this.$emit('getSelected', data)
    }
  }
}
</script>
<style lang="scss">
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
