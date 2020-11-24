<template>
  <div class="editArrangement">
    <section class="schedule">
      <div class="header">
        <span class="header--title">线下日程</span>
        <el-button
          type="primary"
          size="medium"
        >
          添加线下日程
        </el-button>
      </div>
      <el-collapse
        v-model="activeName"
        accordion
      >
        <el-collapse-item
          name="1"
          title="第1天 2020-10-10"
        >
          <common-table
            :config="ScheduleConfig"
            :columns="ScheduleColumn"
            :data="scheduleData"
          >
            <template #handler="{row}">
              <el-button
                type="text"
                @click="handleEdit(row)"
              >
                修改
              </el-button>
              <el-button
                type="text"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </template>
          </common-table>
        </el-collapse-item>
      </el-collapse>
    </section>
    <section class="courses">
      <div class="header">
        <span class="header--title">在线课程</span>
        <el-button
          type="primary"
          size="medium"
        >
          添加在线课程
        </el-button>
      </div>
      <common-table
        :config="CoursesConfig"
        :columns="CoursesColumn"
        :data="coursesData"
      >
        <template #handler="{row}">
          <el-button
            type="text"
            @click="handleEdit(row)"
          >
            修改
          </el-button>
          <el-button
            type="text"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </common-table>
    </section>
    <section class="test">
      <div class="header">
        <span class="header--title">考试安排</span>
        <el-button
          type="primary"
          size="medium"
        >
          添加考试
        </el-button>
      </div>
      <common-table
        :config="TestConfig"
        :columns="TestColumn"
        :data="testData"
      >
        <template #handler="{row}">
          <el-button
            type="text"
            @click="handleEdit(row)"
          >
            修改
          </el-button>
          <el-button
            type="text"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </common-table>
    </section>
  </div>
</template>

<script>
const ScheduleColumn = [
  {
    prop: 'time'
  },
  {
    prop: 'title'
  },
  {
    prop: 'teacher'
  },
  {
    prop: 'location'
  }
]
const ScheduleConfig = {
  showHeader: false,
  showHandler: true,
  handlerColumn: { label: '操作', width: 150 }
}
const CoursesColumn = [
  {
    prop: 'date',
    label: '上课日期'
  },
  {
    prop: 'courses',
    label: '关联课程'
  },
  {
    prop: 'teacher',
    label: '讲师'
  },
  { prop: 'type', label: '修读类型' }
]
const CoursesConfig = {
  showHandler: true,
  handlerColumn: { label: '操作', width: 150 }
}
const TestColumn = [
  { prop: 'date', label: '考试日期' },
  { prop: 'tests', label: '关联考试' },
  { prop: 'time', label: '考试时间(分钟)' }
]
const TestConfig = {
  showHandler: true,
  handlerColumn: { label: '操作', width: 150 }
}
export default {
  name: 'EditArrangement',
  data() {
    return {
      activeName: '1',
      ScheduleConfig,
      ScheduleColumn,
      scheduleData: [
        {
          time: '8:00 ~ 10:00',
          title: '[面授课程]论程序员的自我修养',
          teacher: '讲师：马云',
          location: '地点：马赛'
        }
      ],
      CoursesConfig,
      CoursesColumn,
      coursesData: [
        {
          date: '2020-10-10 ~ 2020-10-11',
          courses: 'Java中级讲义',
          teacher: '李绅',
          type: '必修'
        }
      ],
      TestConfig,
      TestColumn,
      testData: [
        {
          date: '2020-10-10 ~ 2020-10-11',
          tests: 'Java编程考试',
          time: '不限时长'
        }
      ]
    }
  },
  methods: {
    // eslint-disable-next-line
    handleEdit(row) {
      // console.log(row)
    },
    // eslint-disable-next-line
    handleDelete(row) {
      // console.log(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.editArrangement {
  background-color: #fff;
  padding: 20px;
  height: calc(100% - 30px);
  section {
    margin-bottom: 30px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      margin-bottom: 8px;
      font-size: 16px;
    }
  }
}
</style>
