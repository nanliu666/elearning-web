<template>
  <div class="knowledge">
    <page-header title="知识体系管理">
      <el-button
        slot="rightMenu"
        v-p="ADD_KNOWLEDGE"
        type="primary"
        size="medium"
        @click="() => handleUpdate()"
      >
        创建知识体系
      </el-button>
    </page-header>

    <div class="body">
      <div class="filter-container">
        <div class="operate-wrapper">
          <div class="operate-left">
            <div class="input-wrapper">
              <el-input
                v-model="query.name"
                clearable
                size="medium"
                placeholder="输入知识体系名称进行搜索"
                suffix-icon="el-icon-search"
                :maxlength="32"
              ></el-input>
            </div>
          </div>

          <div class="operate-right">
            <el-dropdown
              :hide-on-click="false"
              trigger="click"
            >
              <el-button
                type="text"
                icon="el-icon-setting"
                class="set-btn"
              >
                列项显示
              </el-button>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(_, key) in columns"
                  :key="key"
                >
                  <el-checkbox v-model="columns[key]">
                    {{ key }}
                  </el-checkbox>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>

      <div class="table-container">
        <el-table
          ref="table"
          v-loading="loading"
          :data="data"
          row-key="id"
          height="60vh"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column
            fixed="left"
            align="left"
            width="45"
          />
          <el-table-column
            v-if="columns['知识体系名称']"
            fixed="left"
            align="left"
            :show-overflow-tooltip="true"
            prop="name"
            label="知识体系名称"
            width="180"
          >
            <template slot-scope="scope">
              <div
                class="column-title"
                style="color: #01aafc; cursor: pointer;"
                @click="toDetail(scope.row)"
              >
                {{ scope.row.name }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-if="columns['描述']"
            align="left"
            :show-overflow-tooltip="true"
            label="描述"
            min-width="180"
          >
            <template slot-scope="scope">
              <div class="column-title">
                {{ scope.row.description || '--' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="columns['创建时间']"
            sortable
            align="left"
            :show-overflow-tooltip="true"
            prop="updateTime"
            label="创建时间"
            min-width="180"
          >
          </el-table-column>
          <el-table-column
            v-if="columns['创建人']"
            align="left"
            :show-overflow-tooltip="true"
            prop="creatorName"
            label="创建人"
            min-width="180"
          >
          </el-table-column>
          <el-table-column
            align="left"
            label="操作"
            fixed="right"
            width="180"
          >
            <template slot-scope="scope">
              <el-button
                v-p="EDIT_KNOWLEDGE"
                type="text"
                size="medium"
                @click="handleUpdate(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                v-p="DELETE_KNOWLEDGE"
                type="text"
                size="medium"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
              <el-button
                v-p="CHILD_KNOWLEDGE"
                type="text"
                size="medium"
                @click="handleAddChild(scope.row)"
              >
                新增子级
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <el-form
        ref="form"
        :model="form"
        label-position="top"
        :rules="formRules"
      >
        <el-form-item
          label="知识体系名称"
          prop="name"
          min-width="180"
        >
          <el-input
            v-model="form.name"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          label="上级知识体系"
          prop="parentId"
        >
          <tree-selector
            v-model="form.parentId"
            style="width: 100%;"
            :options="treeData"
            placeholder="请选择所在分类"
            :props="selectorProps"
          />
        </el-form-item>

        <el-form-item
          label="描述"
          prop="description"
        >
          <el-input
            v-model="form.description"
            placeholder="请输入"
            type="textarea"
            :rows="3"
            :maxlength="200"
            clearable
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="confirmLoading"
          @click="handleUpdateConfirm"
        >完 成</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryTree, addCategory, deleteCategory, editCategory } from '@/api/live'
import TreeSelector from '@/components/tree-selector'
import { ADD_KNOWLEDGE, EDIT_KNOWLEDGE, DELETE_KNOWLEDGE, CHILD_KNOWLEDGE } from '@/const/knowledge'
const ORIGIN_FORM = {
  id: '',
  name: '',
  parentId: '',
  description: ''
}
const ORIGIN_QUERY = {
  name: '',
  source: 'knowledgeSystem'
}
export default {
  name: 'Knowledge',
  components: {
    TreeSelector
  },
  data() {
    return {
      dialogTitle: '',
      selectorProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      treeData: [],
      columns: {
        知识体系名称: true,
        描述: true,
        创建人: true,
        创建时间: true
      },
      query: { ...ORIGIN_QUERY },
      form: { ...ORIGIN_FORM },
      formRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入知识体系名称' }]
      },
      loading: false,
      dialogVisible: false,
      confirmLoading: false,
      data: []
    }
  },
  computed: {
    ADD_KNOWLEDGE: () => ADD_KNOWLEDGE,
    EDIT_KNOWLEDGE: () => EDIT_KNOWLEDGE,
    DELETE_KNOWLEDGE: () => DELETE_KNOWLEDGE,
    CHILD_KNOWLEDGE: () => CHILD_KNOWLEDGE
  },
  watch: {
    columns: {
      handler() {
        this.$nextTick(() => {
          this.$refs.table.doLayout()
          this.$refs.table.$forceUpdate()
        })
      },
      deep: true
    },
    'query.name': _.debounce(function() {
      this.getList()
    }, 1000)
  },
  activated() {
    this.getCategoryData()
    // this.getList()
    this.data = [
      {
        id: '123',
        name: '体系名称·1',
        description:
          '体系化的提高部门之间体系化的提高部门之间体系化的提高部门之间体系化的提高部门之间体系化的提高部门之间体系化的提高部门之间体系化的提高部门之间体系化的提高部门之间',
        creatorName: '创建人1223',
        updateTime: '2020-12-15',
        children: [
          {
            id: '456',
            name: '体系名称·1的child',
            description: '体系名称描述体系名称描述体系名称描述体系名称描述体系名称描述',
            creatorName: '创建人12231221323',
            updateTime: '2020-12-15'
          }
        ]
      }
    ]
  },
  methods: {
    getCategoryData() {
      getCategoryTree({ source: 'knowledgeSystem', addFlag: '1' }).then((res) => {
        this.treeData = res
      })
    },
    handleAddChild({ parentId }) {
      this.form = { ...ORIGIN_FORM, parentId }
      this.dialogVisible = true
    },
    toDetail(item) {
      this.$router.push({
        path: '/knowledge/detail',
        query: {
          id: item.idStr
        }
      })
    },
    handleUpdate(item) {
      if (item) {
        const { idStr: id, name, parentId } = item
        Object.assign(this.form, { id, name, parentId })
      } else {
        this.form = { ...ORIGIN_FORM }
      }
      this.dialogVisible = true
    },
    handleUpdateConfirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        const api = this.form.id ? editCategory : addCategory
        this.confirmLoading = true
        api(this.form)
          .then((res) => {
            const { resMsg } = res
            if (typeof res === 'boolean') {
              this.$message.success('新建成功')
              this.dialogVisible = false
              this.getList()
            } else {
              this.$message.error(resMsg)
            }
          })
          .finally(() => {
            this.confirmLoading = false
          })
      })
    },
    beforeDelete(id) {
      return new Promise((resolve, reject) => {})
    },
    async handleDelete(target) {
      const id = target.id
      target.delLoading = true
      const result = await this.beforeDelete(id)
      const message = result
        ? `#${target.name}#下有关联内容，确定要删除吗？删除之后所关联的相关内容不再包含此知识体系。？`
        : '您确定要删除选中的知识体系吗？'
      this.$confirm(message, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteCategory({ id }).then(() => {
            this.$message.success('操作成功')
            this.getList()
          })
        })
        .catch(() => {})
    },
    getList() {
      if (this.loading) return
      this.loading = true
      getCategoryTree(this.query)
        .then((res = []) => {
          this.data = res
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss">
.knowledge {
  .column-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-table th.gutter {
    display: table-cell !important;
  }

  .el-table colgroup.gutter {
    display: table-cell !important;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .el-form-item {
    margin-right: 20px;
  }
  .operate-wrapper .operate-left .input-wrapper {
    .el-input__inner {
      height: 34px;
      line-height: 34px;
    }
  }
  .icon-basics-filter-outlined {
    font-size: 14px;
  }

  .filter-form {
    .el-form-item__label {
      text-align: center;
    }
  }
}
</style>
<style lang="scss" scoped>
.knowledge {
  .body {
    background-color: #fff;
    padding: 24px;
    margin-bottom: 24px;
    .filter-container {
      .operate-wrapper {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        .operate-left {
          display: flex;
          align-items: center;
          .input-wrapper {
            width: 235px;
            margin-right: 10px;
          }
          .filter-btn {
            width: 85px;
          }
        }
        .operate-right {
          display: flex;
          align-items: center;
          height: 36px;
          margin-right: 10px;
          color: #a0a8ae;
          .fresh-wrap {
            padding-right: 10px;
            border-right: 1px solid #a0a8ae;
            .fresh-btn {
              cursor: pointer;
            }
          }
          .set-btn {
            cursor: pointer;
            margin-left: 10px;
            margin-top: 2px;
          }
        }
      }
    }
    .table-container {
    }
  }
}
</style>
