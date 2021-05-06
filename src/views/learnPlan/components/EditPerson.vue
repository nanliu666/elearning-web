<template>
  <!-- 人员信息 页面 -->
  <basic-container
    block
    class="basicContainer"
  >
    <div style="text-align: right">
      <el-button
        type="primary"
        size="medium"
        @click="handleAddUser"
      >
        添加人员
      </el-button>
    </div>

    <common-table
      ref="table"
      class="commonTable"
      :columns="tableColumns"
      :config="tableConfig"
      :data="currentList"
    >
      <template
        slot="orgName"
        slot-scope="{ row }"
      >
        <div>
          {{ row.orgName || '-' }}
        </div>
      </template>
      <template
        slot="phoneNum"
        slot-scope="{ row }"
      >
        <div>
          {{ row.phoneNum || '-' }}
        </div>
      </template>
      <template #multiSelectMenu="{ selection }">
        <el-button
          style="margin-bottom: 0"
          type="text"
          @click="handleMultiDelete(selection)"
        >
          批量删除
        </el-button>
      </template>

      <template #oparetion="{ row }">
        <el-button
          size="medium"
          type="text"
          @click="handleDelete(row)"
        >
          删除
        </el-button>
      </template>
    </common-table>

    <div class="page-container">
      <pagination
        :total="userList.length"
        :page.sync="page.pageNo"
        :limit.sync="page.pageSize"
        @pagination="pagination"
      ></pagination>
    </div>

    <user-picker
      select-type="Org,OuterUser,Position,Group"
      :value="userList"
      :visible.sync="userPicking"
      @input="handleSelect"
    />
  </basic-container>
</template>

<script>
import UserPicker from '@/components/user-picker/userPicker'
import Pagination from '@/components/common-pagination'
import { orgOrPositionToPerson } from '@/util/middleWare'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '序号',
    prop: 'index',
    type: 'index'
  },
  {
    label: '姓名',
    prop: 'name',
    width: 300
  },
  {
    label: '所在部门',
    prop: 'orgName',
    minWidth: 100,
    slot: true
  },
  {
    label: '手机号码',
    slot: true,
    prop: 'phoneNum',
    minWidth: 100
  },
  {
    label: '操作',
    slot: true,
    prop: 'oparetion',
    minWidth: 100
  }
]
const TABLE_CONFIG = {
  // enablePagination: true,

  showIndexColumn: false,

  enableMultiSelect: true,
  rowKey: 'userId',
  showHandler: false
}
const TABLE_PAGE_CONFIG = {}

export default {
  name: 'EditPerson',
  components: {
    UserPicker,
    Pagination
  },
  props: {
    planId: {
      type: String,
      default: null
    },
    userList: {
      type: Array,
      default: () => []
    },
    selectedList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      userPicking: false,
      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      page: {
        pageSize: 10,
        pageNo: 1
      },
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false,
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },
  computed: {
    currentList() {
      const { pageSize: size, pageNo: no } = this.page
      return this.userList.slice(size * (no - 1), size * no)
    }
  },
  methods: {
    pagination() {},
    handleAddUser() {
      this.userPicking = true
    },
    async handleSelect(userList) {
      orgOrPositionToPerson(_.cloneDeep(userList)).then((res) => {
        this.$emit('update:user-list', res)
      })
    },
    handleDelete(row) {
      this.$confirm('你确定要删除该人员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit(
            'update:user-list',
            _.filter(this.userList, (user) => user.userId !== row.userId)
          )
          this.$message.success('删除成功')
        })
        .catch(() => {})
    },
    handleMultiDelete(selection) {
      this.$confirm('你确定要批量删除所选人员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let selectedIdMap = _.reduce(
            selection,
            (pre, cur) => {
              pre[cur.userId] = 1
              return pre
            },
            {}
          )
          this.userList = _.reject(this.userList, (user) => selectedIdMap[user.userId])
          this.$emit('update:user-list', this.userList)
          this.$message.success('删除成功')
          this.$refs.table.clearSelection()
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.requiredSchedule {
  .basicContainer {
    position: relative;
    .line {
      position: absolute;
      left: 335px;
      top: 0;
      height: 100%;
      width: 1px;
      background-color: rgba(0, 11, 21, 0.25);
    }
  }
}
.clearfix:after {
  content: '';
  display: block;
  clear: both;
}
</style>
