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
      if (this.optionData.length) return this.optionData
      if (!this.hasInitData) {
        this._remoteMethod('').then(() => {
          this.handleChange(this.value)
        })
        this.hasInitData = true
      }
      return []
    }
  },
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
        if (this.shouldInitData) {
          this.query[this.pageSizeKey] = 200
        }
        this._remoteMethod('')
      }
    },
    _remoteMethod(search) {
      if (this.loadLoading || this.searchLoading) return
      const query = this.query
      const hasSearch = !!search || search === ''
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
      console.log(loading)
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
          this.noMore = this.optionData.length * query[this.pageKey] > totalNum
        })
        .catch(() => {
          query[this.pageKey]--
        })
        .finally(() => {
          this[loading] = false
          this.query[this.pageSizeKey] = this.querySize
        })
    },
    handleChange(value) {
      this.$emit('change', value)
      if (!value) return
      let data, label
      if (Array.isArray(value)) {
        data = this.optionData.filter((option) => value.indexOf(option[this.props.value]) > -1)
        label = data.map((item) => item[this.props.label])
      } else {
        data = this.optionData.find((option) => option[this.props.value] === value)
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
