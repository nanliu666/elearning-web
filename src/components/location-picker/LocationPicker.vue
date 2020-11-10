<template>
  <div class="location-picker">
    <el-cascader
      v-model="locations"
      class="location-picker__cascader"
      :options="provinceAndCityData"
      placeholder="请选择地址"
    />
    <el-input
      v-model="form.details"
      class="location-picker__input"
      placeholder="(选填)请输入详细地址"
    />
  </div>
</template>

<script>
import provinceAndCityData from '@/const/provinceAndCityData'

export default {
  name: 'LocationPicker',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        location: '',
        details: ''
      },
      locations: []
    }
  },

  computed: {
    provinceAndCityData: () => provinceAndCityData
  },

  watch: {
    locations(locations) {
      const location = _.last(locations)
      this.form.location = location || ''
    },
    'form.location'(location) {
      if (_.isEmpty(location)) {
        this.locations = []
        return
      }
      this.$emit('input', _.clone(this.form))
      let locations = []
      const findCode = (codeMaps, paths, target) => {
        _.each(codeMaps, (item) => {
          if (item.value === target) {
            paths.push(item)
            locations = paths
            return false
          } else if (!_.isEmpty(item.children)) {
            findCode(item.children, _.concat(paths, item), target)
          }
        })
      }
      findCode(provinceAndCityData, [], location)
      this.locations = _.map(locations, ({ value }) => value)
    },
    'form.details'() {
      this.$emit('input', _.clone(this.form))
    },
    value: {
      deep: true,
      immediate: true,
      handler(value) {
        this.form = _.clone(value)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.location-picker
  &__cascader
    width: 100%
  &__input
    margin-top: .5rem
</style>
