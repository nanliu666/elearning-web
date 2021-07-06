<template>
  <div class="competition-add">
    <basic-container>
      <el-form>
        <div class="item">
          <el-form-item label="闯关竞赛名称">
            <el-input
              v-model="form.name"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <template #label>
              <div class="label">
                <span>分类</span>
                <el-button type="text">
                  分类管理
                </el-button>
              </div>
            </template>
            <el-select
              v-model="form.categoryId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in categorys"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="有限期限">
            <el-date-picker
              v-model="date"
              type="datetimerange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="挑战模式">
            <el-radio-group v-model="form.raceType">
              <el-radio label="0">
                逐关解锁
              </el-radio>
              <el-radio label="1">
                一站到底
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="答题时长">
            <el-radio-group v-model="form.timeStrategy">
              <el-radio label="0">
                不记时
              </el-radio>
              <el-radio label="1">
                逐题计时
              </el-radio>
              <el-radio label="2">
                逐关计时
              </el-radio>
              <el-radio label="3">
                整竞赛计时
              </el-radio>
            </el-radio-group>
            <span>每关限时<input
              v-model="defaultValue.timeStrategy"
              type="text"
            />分钟</span>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="逐题计时方式">
            <el-radio-group v-model="form.timeStrategyByQues">
              <el-radio label="0">
                按试题原设置时间
              </el-radio>
              <el-radio label="1">
                重新设置时间
              </el-radio>
            </el-radio-group>
            <span>每题限时<input
              v-model="defaultValue.timeStrategyByQues"
              type="text"
            />分钟</span>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="计入积分">
            <el-radio-group v-model="form.integralStrategy">
              <el-radio label="0">
                逐关计入,每关<input
                  v-model="defaultValue.integralOnce"
                  type="text"
                />积分
              </el-radio>
              <el-radio
                label="1"
              >
                全通关计入<input
                  v-model="defaultValue.integralAll"
                  type="text"
                />积分
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="答题次数">
            <el-radio-group v-model="form.joinStrategy">
              <el-radio label="0">
                不限次数
              </el-radio>
              <el-radio label="1">
                每日限制<input
                  v-model="defaultValue"
                  type="text"
                />次
              </el-radio>
              <el-radio
                label="2"
              >
                参加总次数限制<input
                  v-model="defaultValue"
                  type="text"
                />次
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="通关条件">
            <el-radio-group v-model="form">
              <el-radio label="0">
                答题错误
              </el-radio>
              <el-radio label="1">
                按答对提数,答对<input
                  v-model="defaultValue"
                  type="text"
                />通关
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="是否显示通关答案">
            <el-radio-group v-model="form">
              <el-radio label="0">
                不显示答案
              </el-radio>
              <el-radio label="1">
                答完即显示答案
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
    </basic-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: [],
      categorys: [],
      defaultValue: {
        timeStrategy: '1',
        timeStrategyByQues: '1',
        integralOnce: '1',
        integralAll: '1',
        joinTimesDay: '1'
      },
      form: {
        name: '',
        categoryId: '',
        timeStrategy: '',
        timeStrategyByQues: '',
        integralStrategy: '',
        joinStrategy: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.competition-add {
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20%;
    &:nth-of-type(-n + 2) ::v-deep.el-form-item__content {
      width: 380px;
    }
  }
  ::v-deep .el-form-item {
    input.el-input__inner {
      height: 36px;
    }
    .el-date-editor.el-range-editor.el-input__inner.el-date-editor--datetimerange {
      width: 100%;
      height: 36px;
    }
    .el-select {
      width: 100%;
    }
  }
  ::v-deep label.el-form-item__label {
    width: 100%;
    text-align: left;
    padding: 0;
  }
  .label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    ::v-deep button.el-button.el-button--text {
      padding: 0;
    }
  }
}
</style>
