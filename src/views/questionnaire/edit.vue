<template>
  <div class="edit-questionnaire">
    <div class="header" @click="$router.back()">
      <i class="el-icon-arrow-left"> </i>
      <span class="title">创建问卷</span>
    </div>

    <div class="body">

      <div class="basic-info">
        <div class="block-header">
          <div class="block-header">
            <div class="title">基本信息</div>
          </div>
        </div>
      
        <el-form :model="form" :rules="rules" ref="form" class="form" label-position="top">
            <el-form-item label="问卷名称" prop="name" class="half-form-item" style="margin-right: 10%;">
                <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="问卷类别" prop="category" class="half-form-item">
              <tree-selector
              style="width: 100%;"
                class="selector"
                :options="selectorData"
                placeholder="请选择组织"
                :props="seletorProps"
                @getValue="(categoryId) => form.id = categoryId"
              />
            </el-form-item>

            <el-form-item label="问卷简介" prop="intro">
              <el-input type="textarea" v-model="form.desc" placeholder="请输入

"></el-input>
            </el-form-item>
        </el-form>
      </div>

      <div class="topic-table">
        <div class="block-header">
          <div class="title">问卷题目 <span style="font-size: 14px;">(数量：3个)</span></div>
          <el-button class="button" size="medium" type="primary"  @click="handleDrawerVisible(true)">添加题目</el-button>
        </div>
        <el-table :data="topicTable" height="462px">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column prop="date" label="题干"></el-table-column>
          <el-table-column prop="date" label="题目类型"></el-table-column>
          <el-table-column prop="date" label="是否必填"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleDrawerVisible(true, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        </el-table>
      </div>

      <el-row style="margin: 12px auto;" type="flex" justify="center">
        <el-button type="primary" size="medium">完成</el-button>
        <el-button size="medium">取消</el-button>
      </el-row>
    </div>
    <transition name="fade">
      <div class="drawer-cover" @click="handleDrawerVisible(false)" v-show="drawerVisible"></div>
    </transition>
    <transition name="draw">
        <div class="topic-drawer" v-show="drawerVisible">
        <div class="drawer-header">
          <div class="drawer-title">添加题目</div>
          <i class="el-icon-close drawer-close-btn" @click="drawerVisible = false"></i>
        </div>

        <el-form label-position="top" label-width="80px" :model="topicForm" :rules="topicRules">
          <el-form-item label="题干" prop="topic">
            <el-input v-model="topicForm.topic" type="textarea" placeholder="请输入"  maxlength="200" show-word-limit></el-input>
          </el-form-item>
          <el-form-item prop="type" class="drawer-topic-type">
            <template slot="label">
              <div class="drawer-topic-type-label">
                <div>题目类型</div>
                  <el-checkbox>必填</el-checkbox>            
              </div>
            </template>
            <el-select v-model="topicForm.type" style="width: 100%" placeholder="请选择">
            <el-option
                v-for="item in [{label: '问答题', value: '1'}, {label: '单选题', value: '2'}, {label: '多选题', value: '3'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="option-container">
          <div class="option-title">
            <span style="color: red; margin-right: 5px;">*</span>
            <span style="font-size:14px;color:rgba(0,11,21,0.65); margin-right: 5px;">选项</span>
            <el-popover
                transition="none"
                trigger="click"
              >
                <i
                  slot="reference"
                  class="el-icon-question"
                  style="cursor: pointer;"
                ></i>
                <template slot>
                  <div>
                    <span>1.最多添加15个选项（包含“其他”选项)</span><br /><br />
                    <span>2.每项最多150个字</span>
                  </div>
                </template>
              </el-popover>
          </div>
          <div class="option-list">
            <draggable
              v-model="optionList"
              :animation="200"
            >
              <transition-group>
                  <div class="option-item" v-for="(option, index) in optionList" :key="index">
                    <i class="icon-drag"></i>
                    <el-input v-model="option.input" placeholder="请输入内容" class="option-input"></el-input>
                    <i class="option-delete-btn el-icon-close" @click="deleteOption(option)"></i>
                  </div>
              </transition-group>
            </draggable>
          </div>
          <div class="add-option-btn" @click="addOption">
            <i class="el-icon-plus"></i>
            <span class="add-option-text">添加选项</span>
          </div>

          <el-button type="text" class="other-option-btn">添加其他选项</el-button>

          <div class="other-option-container">
            <div class="other-option-item">
              最少可选
              <el-select class="selector" v-model="otherMinValue" placeholder="请选择">
                <el-option
                  v-for="item in otherOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              项
            </div>
            <div class="other-option-item">
              最多可选
              <el-select class="selector" v-model="otherMaxValue" placeholder="请选择">
                <el-option
                  v-for="item in ['不限'].concat(otherOptions)"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              项
            </div>
          </div>

        </div>


      <div class="drawer-footer">
          <el-row type="flex" justify="center" style="margin-top: 24px;">
            <el-button type="primary" @click="handleTopicSave">保存</el-button>
            <el-button @click="handleDrawerVisible(false)">取消</el-button>
          </el-row>
      </div>
    </div>
    </transition>

  </div>
</template>

<script>
import TreeSelector from '@/components/tree-selector'
import { queryCategoryOrgList } from '@/api/resource/classroom'
import draggable from 'vuedraggable'

export default {
  name: 'edit-questionnaire',
  components: {
    TreeSelector,
    draggable
  },
  data() {
    return {
      otherMinValue: '',
      otherMaxValue: '',
      drawerVisible: false,
      form: {
        name: '',
        category: '',
        intro: ''
      },
      seletorProps: {
        value: 'orgId',
        label: 'orgName',
        children: 'children'
      },
      topicForm: {
        topic: '',
        type: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入问卷名称', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
      },
      topicRules: {
        topic: [
          { required: true, message: '请输入题干', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ],
      },
      selectorData: [],
      topicTable: [],
      optionList: [],
      otherOptions: ['2', '3', '4', '5', '6', '7', '8', '9', '10']
    }
  },
  methods: {
    handleDrawerVisible(visible, edit) {
      this.drawerVisible = visible
    },
    addOption() {
      this.optionList.push({
        input: ''
      })
    },
    handleTopicSave() {},
    handleTopicReset() {},
    handleEdit() {

    },
    deleteOption(_option) {
      this.optionList.splice(this.optionList.indexOf(_option), 1)
    },
    handleDelete(item) {

    },
    getCategoryData() {
      queryCategoryOrgList({ source: 'questionnaire' }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss">
.edit-questionnaire {
  .el-form--label-top .el-form-item__label {
    padding: 0;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .drawer-topic-type {
    .el-form-item__label {
      display: flex;
    }
    .drawer-topic-type-label {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

</style>
<style lang="scss" scoped>
.edit-questionnaire {
  cursor: default;
  .header {
    width: fit-content;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 29px 0 21px;
    i {
      color: #8c9195;
      font-size: 16px;
    }
    .title {
      font-family: PingFangSC-Medium;
      font-size: 22px;
      color: rgba(0, 11, 21, 0.85);
      margin-left: 8px;
    }
  }

  .body {
    background: #FFFFFF;
    box-shadow: 0 2px 12px 0 rgba(0,61,112,0.08);
    box-sizing: border-box;
    margin-bottom: 20px;
    padding: 24px;
    .block-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      .title {
        font-size: 18px;
        color: rgba(0, 11, 21, 0.85);
      }
    }
    .half-form-item {
      display: inline-block;
      width: 45%;
    }
  }
  .drawer-cover {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.45);
    z-index: 100;
  }
  .topic-drawer {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    width: 500px;
    padding: 0 24px;
    background-color: #fff;
    z-index: 111;

    .drawer-header {
      display: flex;
      height: 76px;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      border-bottom: 1px solid #EBECED;
      margin-bottom: 24px;
      .drawer-title {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: rgba(0,11,21,0.85);
        letter-spacing: 0;
        line-height: 28px;
      }
      .drawer-close-btn {
        cursor: pointer;
        font-size: 20px;
      }
    }
    .option-container {
      .option-title {
        margin-bottom: 8px;
      }
      .option-list {
        .option-item {
          display: flex;
          align-items: center;
          height: 36px;
          margin-bottom: 24px;
          .icon-drag {
            color: rgba(0,11,21,0.65);
            cursor: move;
            font-size: 12px;
          }
          .option-input {
            margin: 0 15px;
          }
          .el-icon-close {
            color: rgba(0,11,21,0.65);
            cursor: pointer;
          }
        }
      }
      .add-option-btn {
        margin: auto;
        height: 36px;
        line-height: 36px;
        box-sizing: border-box;
        cursor: pointer;
        border: 1px dashed #D9DBDC;
        text-align: center;
        color: #01AAFC;
        border-radius: 3px;
        .el-icon-plus {
          font-size: 16px;
          margin-right: 8px;
        }
        .add-option-text {
          font-size: 14px;
        }
      }
      .other-option-btn {
        margin: 16px 0;
      }
      .other-option-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .other-option-item {
          display: flex;
          align-items: center;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0,11,21,0.65);
          letter-spacing: 0;
          line-height: 22px;
          .selector {
            width: 100px;
            margin: 0 8px;
          }
        }
      }
    }
    .drawer-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 90px;
      width: 100%;
      border-top: 1px solid #EBECED;
      box-sizing: border-box;
    }
  }

  .draw-enter-active, .draw-leave-active {
    transition: transform .3s;
  }
  .draw-enter, .draw-leave-to {
    transform: translateX(-100%);
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .draw-enter, .draw-leave-to {
    transform: translateX(100%);
  }

}
</style>