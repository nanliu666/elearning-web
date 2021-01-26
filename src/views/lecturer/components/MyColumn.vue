<template>
  <div>
    <div class="issue_l">
      <div class="issue_l_tree">
        <el-input
          v-model="filterText"
          placeholder="分类名称"
          suffix-icon="el-icon-search"
          maxlength="32"
        >
        </el-input>

        <!-- <div class="ungrouped">
              未分类
            </div> -->

        <el-tree
          ref="tree"
          :data="data"
          node-key="id"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          :props="props"
          lazy
          :load="loadNode"
          class="tree"
          :default-expanded-keys="expandedKeysData"
          @node-click="treeClickNode"
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
          >
            <span
              v-show="!isEdit || data.id !== isEditId"
            >{{ node.label }}&nbsp;{{ `(${data.count || 0})` }}</span>
            <span
              v-show="isEdit && data.id === isEditId"
              class="tree_input"
            >
              <el-input
                v-model="dataAddCatalog.input"
                placeholder="请输入分类名称"
                maxlength="20"
              ></el-input>
              <el-button
                type="text"
                @click="isaddCatalog(data)"
              >确认</el-button>&nbsp;
              <span @click="isEditFn(data)"> 取消</span>
              <!-- <span @click="isEdit = false"> 取消</span> -->
            </span>
            <span>
              <!-- 编辑&删除 -->
              <el-dropdown
                v-show="data.label !== '未分类'"
                trigger="hover"
                style="color: #a0a8ae;"
                class="right-content"
                @command="handleCommandSide($event, data)"
              >
                <span class="el-dropdown-link more-column">
                  <i class="el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-show="data.btnshow"
                    command="add"
                  >
                    新增分类
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-show="!data.btnshow"
                    command="move"
                  >
                    移动
                  </el-dropdown-item>
                  <el-dropdown-item command="edit">
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item command="del">
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </span>
        </el-tree>

        <div
          v-show="isShowinput"
          class="isShowinput"
        >
          <el-input
            id="/lecturer/lecturer"
            v-model="dataAddCatalog.input"
            class="isShowinput_input"
            placeholder="请输入分组名称"
            maxlength="20"
          ></el-input>
          <span
            class="isShowinput_yes"
            @click="isaddCatalog(data)"
          >确认</span>
          <span
            class="isShowinput_no"
            @click="isShowinputFn"
          > 取消</span>
          <!-- <span @click="isShowinput = false"> 取消</span> -->
        </div>
        <div
          v-p="ADD_LECTURER_GROUNP"
          class="btn_bottom_box"
        >
          <div
            v-show="!isShowinput"
            class="btn_bottom"
          >
            <a
              class="btn1"
              href="#/lecturer/lecturer"
              @click="adddata"
            >
              <i class="el-icon-plus btn_icon"></i> 新建分组</a>
            <!-- <span class="btn2">新建分类</span> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 移动选择框 -->
    <el-dialog
      title="收货地址"
      :visible.sync="dialogFormVisible"
      :modal-append-to-body="false"
    >
      <el-form :model="form">
        <el-form-item
          label="分类名称"
          label-width="120px"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
            maxlength="32"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="上级分类组"
          label-width="120px"
        >
          <el-select
            v-model="form.region"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in data"
              v-show="item.label !== '未分类'"
              :key="index"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="ismove"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import {
//   listTeacherCategory,
//   addCatalog,
//   deleteTeacherCatalog,
//   move,
//   editTeacherCatalog
// } from '@/api/lecturer/lecturer'
import { ADD_LECTURER_GROUNP } from '@/const/privileges'
export default {
  props: {
    columnInterface: {
      type: Object,
      default: () => {
        return {
          listTeacherCategory: Promise.reject(), //查询讲师分类列表
          addCatalog: Promise.reject(), //新增分组/分类
          deleteTeacherCatalog: Promise.reject(), //删除分组/分类
          move: Promise.reject(), //移动
          editTeacherCatalog: Promise.reject() //编辑
        }
      }
    }
  },
  data() {
    return {
      // 侧栏数据
      filterText: '',
      data: [],
      props: {
        lazy: true,
        isLeaf: (data, node) => {
          if (node.level === 2 || data.label == '未分类') {
            return true
          }
        }
      },
      expandedKeysData: [], //是否展开
      dataAddCatalog: { input: '' }, //输入框
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        optionData: ''
      },
      inputAddMark: false,
      addSonInputData: '',
      compileNewly: '',
      isShowinput: false, //显示分组——输入框
      isEdit: false, //显示分类——输入框
      isEditId: '', //显示分类——输入框id
      btnshow: 'false' //新增分类&移动
    }
  },
  computed: {
    ADD_LECTURER_GROUNP: () => ADD_LECTURER_GROUNP
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.islistTeacherCategory()
  },
  activated() {
    this.islistTeacherCategory()
  },
  methods: {
    // tree
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 树数据懒加载
    async loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region' }])
      }
      if (node.level > 1) return resolve([])

      let res = await this.columnInterface.listTeacherCategory({ parentId: node.data.id })
      let filterArr = res.son.map((item) => {
        return {
          id: item.idStr,
          parent_id: item.parentStr,
          label: item.name,
          btnshow: 0,
          count: item.count
        }
      })

      node.data.children = filterArr
      resolve(filterArr)

      if (this.inputAddMark) {
        this.inputAddMark = false
        this.addSonInput(this.addSonInputData)
      }
    },
    //   tree节点点击 返回ID拿右侧list
    treeClickNode(data) {
      this.clickId = data.id
      // if (data.num === 1) {
      // }
      //   拿右侧list
      this.$emit('treeClick', data.id)
    },
    // 新增分组/分类&编辑
    isaddCatalog(node) {
      if (this.compileNewly == 1) {
        // 编辑
        let params = {
          id: '',
          name: ''
        }
        params.id = node.id
        params.name = this.dataAddCatalog.input
        if (params.name.trim() == '') {
          this.$message({
            message: '名称不能为空',
            type: 'warning'
          })
          return
        }
        // 做一个判断二级否有重名的
        let ifReturn = false
        this.data.map((item) => {
          if (item.id == node.parent_id) {
            item.children.map((item) => {
              if (item.label == params.name) {
                this.$message({
                  message: '该名称已存在，请重新编辑',
                  type: 'warning'
                })
                ifReturn = true
                return
              }
            })
          }
        })
        // 做一个判断一级否有重名的
        if (node.btnshow) {
          this.data.map((item) => {
            if (item.label == params.name) {
              this.$message({
                message: '该名称已存在，请重新编辑',
                type: 'warning'
              })
              ifReturn = true
              return
            }
          })
        }

        if (ifReturn) return
        this.columnInterface.editTeacherCatalog(params).then(() => {
          this.islistTeacherCategory()
          this.isEdit = false
          this.dataAddCatalog.input = ''
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        })
      } else {
        // 新增
        let params = {
          // creatorId: '', //	分组id	query	false
          name: '', //	名称	query	false
          parentId: '' //	类id	query	false
        }
        if (node) {
          params.id = node.myid
          // params.parentId = node.parentId
        }
        params.name = this.dataAddCatalog.input
        if (params.name.trim() == '') {
          this.$message({
            message: '名称不能为空',
            type: 'warning'
          })
          return
        }
        this.columnInterface.addCatalog(params).then(() => {
          this.islistTeacherCategory()
          this.isShowinput = false
          this.dataAddCatalog.input = ''
          this.$message({
            message: '新增成功',
            type: 'success'
          })
        })
      }
    },
    // 输入框取消按钮
    isShowinputFn() {
      this.isShowinput = false
      this.dataAddCatalog.input = ''
    },
    isEditFn(data) {
      this.isEdit = false
      this.dataAddCatalog.input = ''
      this.expandedKeysData = []
      this.expandedKeysData.push(data.myid)
      this.islistTeacherCategory()
    },
    // 增删改查
    handleCommandSide($event, data) {
      //   编辑
      if ($event === 'edit') {
        this.isEdit = true
        this.isEditId = data.id
        this.compileNewly = 1
        this.dataAddCatalog.input = data.label
      }
      //   新增
      if ($event === 'add') {
        this.addSonInputData = data
        // 展开
        this.expandedKeysData = []
        this.expandedKeysData.push(data.id)
        this.inputAddMark = true
        this.addSonInput(data)
      }
      //移动
      if ($event === 'move') {
        this.dialogFormVisible = true
        this.form.name = data.label
        this.form.optionData = data
      }
      // 删除
      if ($event === 'del') {
        if (data.count) {
          this.$message({
            message: `您选择的${data.btnshow ? '分组' : '分类'}下存在数据，请调整后再删除！`,
            type: 'error'
          })
          return
        }

        this.$confirm(`确定要删除选中的${data.btnshow ? '分组' : '分类'}么?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.iddeleteTeacherCatalog(data)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    // 底部btn
    adddata() {
      this.isShowinput = true
    },
    // 移动
    ismove() {
      this.dialogFormVisible = false
      this.form
      let params = {
        id: '', //讲师所属分类ID
        parentId: '' //讲师所属分组ID
      }
      params.id = this.form.optionData.id
      params.parentId = this.form.region
      this.columnInterface.move(params).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.islistTeacherCategory()
      })
    },
    // 新增子类输入框
    addSonInput(data) {
      this.compileNewly = 0
      let i = this.data.indexOf(data)
      let idNum = Math.floor(Math.random() * 10000)
      if (i == '-1') return
      this.data[i].children.push({
        label: '- -',
        btnshow: 0,
        id: idNum,
        myid: data.id
      })
      this.isEdit = true
      this.isEditId = idNum
    },
    // 查询讲师分类列表
    islistTeacherCategory(id) {
      let params = {}
      if (id) {
        params = {
          test: '123',
          parentId: '' // 父ID
        }
        params.parentId = id
      } else {
        params = {
          test: '123'
        }
      }
      return this.columnInterface.listTeacherCategory(params).then((res) => {
        this.data = []
        res.group.forEach((item) => {
          let i = {
            id: 1,
            label: '一级 1',
            btnshow: 1,
            children: [],
            num: 1,
            count: 0
          }
          i.id = item.idStr
          i.label = item.name
          i.btnshow = 1
          i.children = []
          i.count = item.count
          this.data.push(i)
        })
        this.data.forEach((item) => {
          let filterArr = res.son.filter((list) => list.parentStr == item.id) || []
          filterArr = filterArr.map((item) => {
            return {
              id: item.idStr,
              parent_id: item.parentStr,
              label: item.name,
              btnshow: 0,
              count: item.count
            }
          })
          filterArr.length > 0 ? (item.children = filterArr) : ''
        })

        this.clickId = this.data[0].id
        // 右侧list
        // this.islistTeacher(this.data[0].id)
      })
    },
    // 删除分组/分类
    iddeleteTeacherCatalog(data) {
      this.columnInterface.deleteTeacherCatalog({ id: data.id }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.islistTeacherCategory()
        this.expandedKeysData = []
        if (data.parent_id) this.expandedKeysData.push(data.parent_id)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.issue_l {
  position: relative;
  width: 100%;
  border-right: 1px solid #ccc;
  height: 680px;
  .issue_l_tree {
    padding: 20px;
    // padding: 0 25px;
    width: 100%;
    height: 100%;
    padding-bottom: 200px;
    overflow: auto;
    // &::-webkit-scrollbar {
    //   display: none;
    // }
    /deep/.el-input {
      margin-bottom: 15px;
    }
    .ungrouped {
      color: #606266;
      margin: 0 0 5px 22px;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .btn_bottom_box {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    .btn_bottom {
      position: relative;
      bottom: 0;
      left: 0;
      height: 50px;
      width: 100%;
      border-top: 1px solid #ccc;
      .btn1 {
        display: block;
        background-color: #fff;
        cursor: pointer;
        line-height: 50px;
        height: 100%;
        width: 100%;
        text-align: center;
        color: #1677ff;
      }
    }
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;

  // /deep/ .el-icon-more {
  //   transform: rotate(-90deg);
  // }
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
.tree_input {
  width: 60%;
  font-size: 14px;

  /deep/ input {
    height: 25px;
    margin-left: -15px;
  }
}
/deep/ .el-tree-node__content {
  margin-top: 10px;
}
.btn_icon {
  font-weight: 700;
}
.isShowinput {
  margin-top: 5px;
  display: flex;
  line-height: 35px;
  .isShowinput_input {
    width: 65%;
  }

  .isShowinput_yes {
    color: #2092fb;
    padding: 0 12px;
    cursor: pointer;
  }
  .isShowinput_no {
    cursor: pointer;
  }
  /deep/ input {
    height: 25px;
  }
}
</style>
