<template>
  <div class="roletree">
    <div
      v-if="showSearch"
      class="search-input"
    >
      <el-input
        v-model="searchInput"
        size="medium"
        placeholder="输入分类名称搜索"
        clearable
        suffix-icon="el-icon-search"
      />
    </div>
    <el-scrollbar class="scroll-item">
      <el-tree
        ref="tree"
        :data="treeList || []"
        :node-key="props.id"
        class="tree_"
        highlight-current
        :default-expanded-keys="[currentId]"
        :default-checked-keys="[currentId]"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      >
        <template slot-scope="{ node, data }">
          <div
            class="custom-tree-node"
            @click.prevent="onClickNode(node, data)"
          >
            <span class="label-name-box">
              <i
                v-if="node.level === 1 && showFolder"
                class="el-icon-folder"
                style="margin-right: 5px;"
              />
              <el-tooltip
                class="item"
                effect="dark"
                :content="data[props.label]"
                placement="top-start"
                :disabled="_.size(_.trim(data[props.label])) < 10"
              >
                <span class="label-name ellipsis">
                  <span>{{ data[props.label] }}</span>
                </span>
              </el-tooltip>
              <span>{{ `(${data.roleNum})` }}</span>
            </span>
            <el-dropdown
              v-if="showMore && !data.isDefault"
              class="right-content"
              trigger="hover"
              @command="handleCommand($event, node, data)"
            >
              <span
                class="el-dropdown-link more-column"
                @click.stop=""
              >
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit">
                  编辑
                </el-dropdown-item>
                <el-dropdown-item command="del">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'AsideTree',
  props: {
    groupId: {
      type: String,
      default: ''
    },
    showMore: {
      type: Boolean,
      default: true
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    treeList: {
      type: Array,
      default: () => []
    },
    currentId: {
      type: [String, Number],
      default: ''
    },
    showFolder: {
      type: Boolean,
      default: true
    },
    props: {
      type: Object,
      default: () => {
        return {
          label: 'label',
          id: 'id'
        }
      }
    }
  },
  data() {
    return {
      searchInput: '',
      cateId: ''
    }
  },
  watch: {
    currentId: {
      handler(newVal, oldVal) {
        if (newVal && !oldVal) {
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(newVal)
          })
        }
      },
      deep: true
    },
    searchInput(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    /**
     * @author guanfenda
     * @desc 节点选中
     *
     * */
    handleNodeClick(data) {
      if (!data.roleNum) {
        this.cateId = data.cateId
        this.$emit('update:groupId', this.cateId)
      }
    },
    filterNode(value, data) {
      return data[this.props.label].indexOf(value) !== -1
    },
    onClickNode(node, data) {
      // if (node.level > 1)
      this.$emit('reload', data)
      // }
    },
    handleCommand(command, node, data) {
      this.$emit(command, node, data)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .is-checked {
  background-color: #f2f5f7;
}
.roletree {
  height: 100%;

  /*min-height: 100px;*/
}

.search-input {
  margin-bottom: 10px;
}

.scroll-item {
  height: 500px;
  overflow: hidden;
  overflow-y: auto;
}

.tree_ {
}

.custom-tree-node {
  margin-left: -20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  width: 92%;
  .label-name-box {
    display: flex;
    align-items: center;
    flex: 1;
    .label-name {
      width: 150px;
      display: inline;
      white-space: nowrap;
      // min-width: 50px;
    }
  }
  .right-content {
    display: none;
  }

  &:hover {
    .right-content {
      display: inline-block;
    }
  }

  .more-column {
    display: inline-block;
    transform: rotate(90deg);
    -ms-transform: rotate(90deg); /* IE 9 */
    -moz-transform: rotate(90deg); /* Firefox */
    -webkit-transform: rotate(90deg); /* Safari 和 Chrome */
    -o-transform: rotate(90deg);
  }
}

.active {
  background-color: #f0f7ff !important;
}
/deep/.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #edf5ff;
}
</style>
