<template>
  <div
    ref="reference"
    v-clickoutside="() => toggleDropDownVisible(false)"
    :class="['el-cascader', realSize && `el-cascader--${realSize}`, { 'is-disabled': isDisabled }]"
    @mouseenter="inputHover = true"
    @mouseleave="inputHover = false"
    @click="() => toggleDropDownVisible(readonly ? undefined : true)"
    @keydown="handleKeyDown"
  >
    <el-input
      ref="input"
      v-model="inputValue"
      :size="realSize"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="isDisabled"
      :validate-event="false"
      :class="{ 'is-focus': dropDownVisible }"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
    >
      <template slot="suffix">
        <i
          v-if="clearBtnVisible"
          key="clear"
          class="el-input__icon el-icon-circle-close"
          @click.stop="handleClear"
        ></i>
        <i
          v-else
          key="arrow-down"
          :class="['el-input__icon', 'el-icon-arrow-down', dropDownVisible && 'is-reverse']"
          @click.stop="toggleDropDownVisible()"
        ></i>
      </template>
    </el-input>

    <transition
      name="el-zoom-in-top"
      @after-leave="handleDropdownLeave"
    >
      <div
        v-show="dropDownVisible"
        ref="popper"
        :class="['el-popper', 'el-cascader__dropdown', popperClass, 'lazy-dropdown']"
      >
        <cascader-panel
          ref="panel"
          v-model="checkedValue"
          :options="options"
          :props="config"
          :border="false"
          :render-label="$scopedSlots.default"
          @expand-change="handleExpandChange"
          @close="toggleDropDownVisible(false)"
        ></cascader-panel>
      </div>
    </transition>
  </div>
</template>

<script>
import Popper from 'element-ui/src/utils/vue-popper'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import Emitter from 'element-ui/src/mixins/emitter'
import Locale from 'element-ui/src/mixins/locale'
import Migrating from 'element-ui/src/mixins/migrating'
import cascaderPanel from './panel'
import AriaUtils from 'element-ui/src/utils/aria-utils'
import { t } from 'element-ui/src/locale'
import { isEqual, isEmpty, kebabCase } from 'element-ui/src/utils/util'
import { isUndefined } from 'element-ui/src/utils/types'
import { isDef } from 'element-ui/src/utils/shared'
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'
import debounce from 'throttle-debounce/debounce'

const { keys: KeyCode } = AriaUtils
const MigratingProps = {
  expandTrigger: {
    newProp: 'expandTrigger',
    type: String
  },
  changeOnSelect: {
    newProp: 'checkStrictly',
    type: Boolean
  },
  hoverThreshold: {
    newProp: 'hoverThreshold',
    type: Number
  }
}

const PopperMixin = {
  props: {
    placement: {
      type: String,
      default: 'bottom-start'
    },
    appendToBody: Popper.props.appendToBody,
    visibleArrow: {
      type: Boolean,
      default: true
    },
    arrowOffset: Popper.props.arrowOffset,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: Popper.props.popperOptions
  },
  methods: Popper.methods,
  data: Popper.data,
  beforeDestroy: Popper.beforeDestroy
}

const InputSizeMap = {
  medium: 36,
  small: 32,
  mini: 28
}

export default {
  name: 'ElCascader',

  directives: { Clickoutside },
  components: {
    cascaderPanel
  },

  mixins: [PopperMixin, Emitter, Locale, Migrating],
  provide() {
    return {
      cascader: this
    }
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },

  props: {
    readonly: Boolean,
    value: {},
    options: Array,
    props: Object,
    size: String,
    placeholder: {
      type: String,
      default: () => t('el.cascader.placeholder')
    },
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    filterMethod: Function,
    separator: {
      type: String,
      default: ' / '
    },
    showAllLevels: {
      type: Boolean,
      default: true
    },
    collapseTags: Boolean,
    debounce: {
      type: Number,
      default: 300
    },
    popperClass: String
  },

  data() {
    return {
      dropDownVisible: false,
      checkedValue: this.value || null,
      inputHover: false,
      inputValue: null,
      presentText: null,
      checkedNodes: [],
      filtering: false,
      suggestions: [],
      inputInitialHeight: 0,
      pressDeleteCount: 0,
      loading: false,
      noMore: false
    }
  },

  computed: {
    realSize() {
      const _elFormItemSize = (this.elFormItem || {}).elFormItemSize
      return this.size || _elFormItemSize || (this.$ELEMENT || {}).size
    },
    tagSize() {
      return ['small', 'mini'].indexOf(this.realSize) > -1 ? 'mini' : 'small'
    },
    isDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    },
    config() {
      const config = this.props || {}
      const { $attrs } = this

      Object.keys(MigratingProps).forEach((oldProp) => {
        const { newProp, type } = MigratingProps[oldProp]
        let oldValue = $attrs[oldProp] || $attrs[kebabCase(oldProp)]
        if (isDef(oldProp) && !isDef(config[newProp])) {
          if (type === Boolean && oldValue === '') {
            oldValue = true
          }
          config[newProp] = oldValue
        }
      })

      return config
    },
    leafOnly() {
      return !this.config.checkStrictly
    },
    clearBtnVisible() {
      if (!this.clearable || this.isDisabled || !this.inputHover) {
        return false
      }

      return !!this.presentText
    },
    panel() {
      return this.$refs.panel
    }
  },

  watch: {
    inputValue(val) {
      if (!val) {
        this.filterHandler()
      }
    },
    disabled() {
      this.computePresentContent()
    },
    value(val) {
      if (!isEqual(val, this.checkedValue)) {
        this.checkedValue = val
        this.computePresentContent()
      }
    },
    checkedValue(val) {
      const { value, dropDownVisible } = this
      const { multiple } = this.config
      if (!isEqual(val, value) || isUndefined(value)) {
        this.computePresentContent()
        // hide dropdown when single mode
        if (!multiple && dropDownVisible) {
          this.toggleDropDownVisible(false)
        }
        this.$emit('input', val)
        this.$emit('change', val)
        this.dispatch('ElFormItem', 'el.form.change', [val])
      }
    },
    options: {
      handler: function() {
        this.$nextTick(this.computePresentContent)
      },
      deep: true
    },
    presentText(val) {
      this.inputValue = val
    },
    filtering() {
      this.$nextTick(this.updatePopper)
    }
  },

  mounted() {
    const { input } = this.$refs
    if (input && input.$el) {
      this.inputInitialHeight = input.$el.offsetHeight || InputSizeMap[this.realSize] || 40
    }

    if (!isEmpty(this.value)) {
      this.computePresentContent()
    }

    this.filterHandler = debounce(this.debounce, () => {
      const { inputValue } = this
      this.filterMethod(inputValue)
    })

    addResizeListener(this.$el, this.updateStyle)
  },
  beforeDestroy() {
    removeResizeListener(this.$el, this.updateStyle)
  },

  methods: {
    toggleDropDownVisible(visible) {
      if (this.isDisabled) return
      const { dropDownVisible } = this
      const { input } = this.$refs
      visible = isDef(visible) ? visible : !dropDownVisible
      if (visible !== dropDownVisible) {
        this.dropDownVisible = visible
        if (visible) {
          this.$nextTick(() => {
            this.updatePopper()
            this.panel.scrollIntoView()
          })
        }
        input.$refs.input.setAttribute('aria-expanded', visible)
        this.$emit('visible-change', visible)
      }
    },
    handleDropdownLeave() {
      this.filtering = false
      this.inputValue = this.presentText
    },
    handleKeyDown(event) {
      switch (event.keyCode) {
        case KeyCode.enter:
          this.toggleDropDownVisible()
          break
        case KeyCode.down:
          this.toggleDropDownVisible(true)
          this.focusFirstNode()
          event.preventDefault()
          break
        case KeyCode.esc:
        case KeyCode.tab:
          this.toggleDropDownVisible(false)
          break
      }
    },
    handleFocus(e) {
      this.$emit('focus', e)
    },
    handleBlur(e) {
      this.$emit('blur', e)
    },
    handleInput(val, event) {
      !this.dropDownVisible && this.toggleDropDownVisible(true)

      if ((event && event.isComposing) || !this.filterable) return
      this.filterHandler()
    },
    handleClear() {
      this.presentText = ''
      this.panel.clearCheckedNodes()
      // this.filterHandler()
    },
    handleExpandChange(value) {
      this.$nextTick(this.updatePopper.bind(this))
      this.$emit('expand-change', value)
      this.$emit('active-item-change', value) // Deprecated
      this.$emit('change', value)
    },
    focusFirstNode() {
      this.$nextTick(() => {
        const { filtering } = this
        const { popper } = this.$refs
        const firstMenu = popper.querySelector('.el-cascader-menu')
        const firstNode = firstMenu.querySelector('.el-cascader-node[tabindex="-1"]')

        if (firstNode) {
          firstNode.focus()
          !filtering && firstNode.click()
        }
      })
    },
    computePresentContent() {
      // nextTick is required, because checked nodes may not change right now
      this.$nextTick(() => {
        this.computePresentText()
      })
    },
    computePresentText() {
      const { checkedValue, config } = this
      if (!isEmpty(checkedValue)) {
        let node = this.panel.getNodeByValue(checkedValue)
        if (node && (config.checkStrictly || node.isLeaf)) {
          this.presentText = node.getText(this.showAllLevels, this.separator)
          return
        }
      }
      this.presentText = null
    },
    updateStyle() {
      const { $el, inputInitialHeight } = this
      if (this.$isServer || !$el) return

      const { suggestionPanel } = this.$refs
      const inputInner = $el.querySelector('.el-input__inner')

      if (!inputInner) return

      const tags = $el.querySelector('.el-cascader__tags')
      let suggestionPanelEl = null

      if (suggestionPanel && (suggestionPanelEl = suggestionPanel.$el)) {
        const suggestionList = suggestionPanelEl.querySelector('.el-cascader__suggestion-list')
        suggestionList.style.minWidth = inputInner.offsetWidth + 'px'
      }

      if (tags) {
        const { offsetHeight } = tags
        const height = Math.max(offsetHeight + 6, inputInitialHeight) + 'px'
        inputInner.style.height = height
        this.updatePopper()
      }
    },

    /**
     * public methods
     */
    getCheckedNodes(leafOnly) {
      return this.panel.getCheckedNodes(leafOnly)
    }
  }
}
</script>

<style>
.lazy-dropdown {
  z-index: 1111111 !important;
}
</style>
