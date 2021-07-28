<script>
import CascaderNode from './node.vue'
import Locale from 'element-ui/src/mixins/locale'
import { generateId } from 'element-ui/src/utils/util'
import scrollbar from './scrollbar'
export default {
  name: 'ElCascaderMenu',

  components: {
    CascaderNode,
    scrollbar
  },
  mixins: [Locale],
  provide() {
    return {
      menu: this
    }
  },
  inject: ['panel', 'cascader'],

  props: {
    nodes: {
      type: Array,
      required: true
    },
    index: Number
  },

  data() {
    return {
      activeNode: null,
      hoverTimer: null,
      id: generateId(),
      loading: false,
      noMore: false,
      loadQuery: {}
    }
  },
  computed: {
    isEmpty() {
      return !this.nodes.length
    },
    menuId() {
      return `cascader-menu-${this.id}-${this.index}`
    }
  },
  created() {
    const props = this.panel.config.loadProps
    Object.keys(props).forEach((k) => {
      const { key, value } = props[k]
      this.loadQuery[key] = value
    })
  },

  methods: {
    updateScrollbar() {
      this.$refs.scrollbar.update()
    },
    handleLoadMore() {
      if (this.loading || this.noMore || !this.panel.config.moreLoad) return
      this.loading = true
      this.$nextTick(() => {
        this.updateScrollbar()
      })
      const { store, config } = this.panel
      const {
        page: { key: pageKey }
      } = config.loadProps
      const resolve = (data = []) => {
        store.appendNodes(data)
        this.loading = false
        this.noMore = !data.length || data.length < this.loadQuery.pageSize
        this.$nextTick(() => {
          this.updateScrollbar()
        })
      }
      this.loadQuery[pageKey]++
      config.moreLoad({ ...this.loadQuery }, resolve)
    },
    handleExpand(e) {
      this.activeNode = e.target
    },
    handleMouseMove(e) {
      const { activeNode, hoverTimer } = this
      const { hoverZone } = this.$refs

      if (!activeNode || !hoverZone) return

      if (activeNode.contains(e.target)) {
        clearTimeout(hoverTimer)

        const { left } = this.$el.getBoundingClientRect()
        const startX = e.clientX - left
        const { offsetWidth, offsetHeight } = this.$el
        const top = activeNode.offsetTop
        const bottom = top + activeNode.offsetHeight

        hoverZone.innerHTML = `
          <path style="pointer-events: auto;" fill="transparent" d="M${startX} ${top} L${offsetWidth} 0 V${top} Z" />
          <path style="pointer-events: auto;" fill="transparent" d="M${startX} ${bottom} L${offsetWidth} ${offsetHeight} V${bottom} Z" />
        `
      } else if (!hoverTimer) {
        this.hoverTimer = setTimeout(this.clearHoverZone, this.panel.config.hoverThreshold)
      }
    },
    clearHoverZone() {
      const { hoverZone } = this.$refs
      if (!hoverZone) return
      hoverZone.innerHTML = ''
    },

    renderEmptyText(h) {
      return <div class="el-cascader-menu__empty-text">{this.t('el.cascader.noData')}</div>
    },
    renderNodeList(h) {
      const { menuId } = this
      const { isHoverMenu } = this.panel
      const events = { on: {} }

      if (isHoverMenu) {
        events.on.expand = this.handleExpand
      }

      const nodes = this.nodes.map((node, index) => {
        const { hasChildren } = node
        return (
          <cascader-node
            key={node.uid}
            node={node}
            node-id={`${menuId}-${index}`}
            aria-haspopup={hasChildren}
            aria-owns={hasChildren ? menuId : null}
            {...events}
          ></cascader-node>
        )
      })

      return [
        ...nodes,
        isHoverMenu ? <svg ref="hoverZone" class="el-cascader-menu__hover-zone"></svg> : null
      ]
    }
  },

  render(h) {
    const { isEmpty, menuId, loading, noMore } = this
    const events = { nativeOn: {}, on: { load: this.handleLoadMore } }

    // optimize hover to expand experience (#8010)
    if (this.panel.isHoverMenu) {
      events.nativeOn.mousemove = this.handleMouseMove
      // events.nativeOn.mouseleave = this.clearHoverZone;
    }
    const nodeList = this.renderNodeList(h)
    return (
      <scrollbar
        ref="scrollbar"
        role="menu"
        id={menuId}
        tag="ul"
        class="el-cascader-menu"
        wrap-class="el-cascader-menu__wrap"
        view-class={{
          'el-cascader-menu__list': true,
          'is-empty': isEmpty
        }}
        {...events}
      >
        {isEmpty
          ? this.renderEmptyText(h)
          : nodeList.concat(
              loading ? (
                <li role="menuitem" class="el-cascader-node" style="text-align: center;">
                  <i style="margin: auto;" class="el-icon-loading"></i>
                </li>
              ) : noMore ? (
                <li
                  role="menuitem"
                  className="el-cascader-node"
                  style="text-align: center; line-height: 34px; font-size: 13px; color: #9e9e9e;"
                >
                  没有更多了
                </li>
              ) : (
                ''
              )
            )}
      </scrollbar>
    )
  }
}
</script>
