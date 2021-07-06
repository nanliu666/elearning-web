<template>
  <el-select
    ref="selector"
    v-loadmore="() => _remoteMethod()"
    class="lazy-select"
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
      :style="`width:${optionsWidth}px;`"
      :label="option[props.label]"
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
        return {}
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
    },
    optionsWidth: {
      type: [Number, String],
      default: 'auto'
    }
  },
  data() {
    return {
      loadLoading: false,
      searchLoading: false,
      noMore: false,
      optionData: [],
      query: {},
      pageKey: 'pageNo',
      pageSizeKey: 'pageSize',
      searchKey: 'search',
      hasInitData: false
    }
  },
  computed: {
    optionList() {
      const searchValue = this.query[this.searchKey]
      if (this.optionData.length) {
        const list = searchValue
          ? this.optionData
          : _.uniqBy(this.initOptions.concat(this.optionData), this.props.value)
        return list
      }
      if (!this.hasInitData) {
        // eslint-disable-next-line vue/no-async-in-computed-properties
        this._remoteMethod('').then(() => {
          this.handleChange(this.value)
        })
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.hasInitData = true
      }
      return searchValue ? [] : this.initOptions
    }
  },
  watch: {},
  created() {
    const queryProps = this.queryProps

    this.pageKey = queryProps.hasOwnProperty('page') ? queryProps['page'] : 'pageNo'

    this.pageSizeKey = queryProps.hasOwnProperty('size') ? queryProps['size'] : 'pageSize'

    this.searchKey = queryProps.hasOwnProperty('search') ? queryProps['search'] : 'search'

    this.query[this.pageSizeKey] = this.querySize
  },
  methods: {
    handleVisible(visible) {
      if (visible) {
        this._remoteMethod('')
      }
    },
    _remoteMethod(search) {
      if (this.loadLoading || this.searchLoading) return
      const query = this.query
      const hasSearch = !!search || search === ''
      if (!this.hasInitData) {
        this.query[this.pageSizeKey] = this.querySize //500
        this.hasInitData = false
      }

      let loading
      if (hasSearch) {
        loading = 'searchLoading'
        query[this.pageKey] = 1
        query[this.searchKey] = search
      } else {
        if (this.noMore) return
        loading = 'loadLoading'
        query[this.pageKey]++
      }
      this[loading] = true
      if (hasSearch) {
        this.optionData = []
      }
      return this.remoteMethod(query)
        .then((res) => {
          let data = [],
            totalNum = 0
          if (Array.isArray(res)) {
            data = res
          } else if (typeof res === 'object') {
            data = res.data || res.list
            if (typeof res.totalNum === 'number') {
              totalNum = res.totalNum
            }
          }
          this.optionData = this.optionData.concat(data)
          if (this.dataFilter) {
            this.optionData = this.optionData.filter(this.dataFilter)
          }
          this.noMore = this.optionData.length >= totalNum
          this[loading] = false
        })
        .catch(() => {
          query[this.pageKey]--
        })
        .finally(() => {
          this.query[this.pageSizeKey] = this.querySize
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

<style lang="scss" scoped>
.tips-text {
  padding: 12px 0;
  text-align: center;
  color: rgb(156, 156, 156);
}
.el-select {
  width: 100%;
}
</style>
