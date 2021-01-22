// 课程管理页面的鉴权
export const ADD_COURSE = '/course/courseDraft/add' //新增
export const TOP_COURSE = '/course/courseDraft/top' //置顶/取消置顶
export const EDIT_COURSE = '/course/courseDraft/edit' //编辑
export const DELETE_COURSE = '/course/courseDraft/delete' //删除
export const MOVE_COURSE = '/course/courseDraft/move' // 移动
export const PUTAWAY_COURSE = '/course/courseDraft/putaway' // 上架/下架
// 课程中心的分类管理的鉴权
export const ADD_COURSE_CATALOG = '/course/catalog/add' // 新增
export const STOP_COURSE_CATALOG = '/course/catalog/stop' // 停用/启用
export const AUTH_COURSE_CATALOG = '/course/catalog/author' // 权限配置
export const EDIT_COURSE_CATALOG = '/course/catalog/edit' // 编辑
export const DELETE_COURSE_CATALOG = '/course/catalog/delete' // 删除
export const ADD_GROUNP_COURSE_CATALOG = '/course/catalog/addNewGroup' // 新增分组
// 培训中心的分类管理的鉴权
export const ADD_TRAIN = '/training/trainingArrange/add' // 新增培训
export const ADD_GROUNP_TRAIN = '/training/trainingArrange/addGroup' // 新增分组
export const DELETE_TRAIN = '/training/trainingArrange/delete' // 删除
export const EDIT_TRAIN = '/training/trainingArrange/edit' //编辑
export const NEXT_TRAIN = '/training/trainingArrange/next' // 开办下一期
export const END_TRAIN = '/training/trainingArrange/end' // 结办
// 知识库的分类管理的鉴权
export const ADD_REP_CATALOG = '/repository/catalogManagement/add' // 新增分类
export const STOP_REP_CATALOG = '/repository/catalogManagement/stop' // 停用分类
export const AUTH_REP_CATALOG = '/repository/catalogManagement/author' // 权限配置
export const EDIT_REP_CATALOG = '/repository/catalogManagement/edit' // 编辑分类
export const DELETE_REP_CATALOG = '/repository/catalogManagement/delete' // 删除分类
export const ADD_CHILD_REP_CATALOG = '/repository/catalogManagement/addNewChild' // 新建子分类
// 知识库的知识管理的鉴权
export const ADD_REP = '/repository/knowledgeManagement/add' // 创建资源
export const TOP_REP = '/repository/knowledgeManagement/top' // 置顶/取消置顶
export const PUTAWAY_REP = '/repository/knowledgeManagement/putaway' // 上架/下架
export const EDIT_REP = '/repository/knowledgeManagement/edit' // 编辑
export const DELETE_REP = '/repository/knowledgeManagement/delete' // 删除
export const MOVE_REP = '/repository/knowledgeManagement/move' // 移动
export const VIEW_REP = '/repository/knowledgeManagement/view' // 查看
// 考评管理的分类管理的鉴权
export const ADD_EXAM_CATALOG = '/examManagement/category/management/add' // 新建分类
export const STOP_EXAM_CATALOG = '/examManagement/category/management/stop' // 停用
export const AUTH_EXAM_CATALOG = '/examManagement/category/management/author' // 权限配置
export const EDIT_EXAM_CATALOG = '/examManagement/category/management/edit' // 编辑
export const DELETE_EXAM_CATALOG = '/examManagement/category/management/delete' // 删除
export const ADD_GROUNP_EXAM_CATALOG = '/examManagement/category/management/addNewChild' // 新建子分类
// 考评管理的题库管理的鉴权
export const DELETE_QUSTION = '/examManagement/question/questionList/delete' // 删除
export const EDIT_QUSTION = '/examManagement/question/questionList/edit' // 编辑
export const ADD_QUSTION = '/examManagement/question/questionList/add' // 新增
// 考评管理的试卷管理的鉴权
export const COPY_TESTPAPER = '/examManagement/testPaper/testPaper/copy' // 复制
export const ADD_TESTPAPER = '/examManagement/testPaper/testPaper/add' // 创建试卷
export const DELETE_TESTPAPER = '/examManagement/testPaper/testPaper/delete' // 删除
export const EDIT_TESTPAPER = '/examManagement/testPaper/testPaper/edit' // 编辑
// 考评管理的考试安排的鉴权
export const ADD_EXAM = '/examManagement/examSchedule/list/add' // 创建考试
export const EDIT_EXAM = '/examManagement/examSchedule/list/edit' // 编辑
export const DELETE_EXAM = '/examManagement/examSchedule/list/delete' // 删除
export const COPY_EXAM = '/examManagement/examSchedule/list/copy' // 复制
// 考评管理的手工评卷的鉴权
export const BY_PERSON = '/examManagement/mark/MarkList/byPerson' // 逐人评卷
export const BY_QUESTION = '/examManagement/mark/MarkList/byQuestion' // 逐题评卷
// 考评管理的成绩管理的鉴权
export const VIEW_GRADE = '/examManagement/grade/achievement/view' // 查看考生成绩
// 必修课程安排的鉴权
export const ADD_REQUIRED = '/learnPlan/CoursePlanList/add' // 新建必修课程安排
export const EDIT_REQUIRED = '/learnPlan/CoursePlanList/edit' // 编辑
export const DELETE_REQUIRED = '/learnPlan/CoursePlanList/delete' // 删除
export const VIEW_REQUIRED = '/learnPlan/CoursePlanList/view' // 查看完成率
export const ADD_GROUP_REQUIRED = '/learnPlan/CoursePlanList/addGroup' // 新建分组
export const STOP_REQUIRED = '/learnPlan/CoursePlanList/stop' // 结办
// 选修课程安排的鉴权
export const VIEW_ELECTIVE = '/learnPlan/ElectivePlanList/view' // 查看
export const DELETE_ELECTIVE = '/learnPlan/ElectivePlanList/delete' // 删除
// 学分规则管理的鉴权
export const DELETE_CREDIT = '/creditManagement/creditRule/delete' // 删除
export const EDIT_CREDIT = '/creditManagement/creditRule/edit' // 编辑
export const STOP_CREDIT = '/creditManagement/creditRule/stop' // 停用
export const ADD_CREDIT = '/creditManagement/creditRule/add' // 新建规则
// 学分规则管理的鉴权
export const STOP_SYSTEM_RULE = '/creditManagement/systemRule/stop' // 停用
// 学分明细的鉴权
export const VIEW_CREDIT = '/creditManagement/credit/view' // 查看详情
// 讲师管理的鉴权
export const ADD_LECTURER = '/lecturer/lecturer/add' // 添加讲师
export const STOP_LECTURER = '/lecturer/lecturer/stop' // 停用
export const EDIT_LECTURER = '/lecturer/lecturer/edit' // 编辑
export const DELETE_LECTURER = '/lecturer/lecturer/delete' // 删除
export const ADD_LECTURER_GROUNP = '/lecturer/lecturer/addNewGroup' // 新建分组
// 讲师管理的鉴权
export const ADD_CERTIFICATE = '/certificate/certificateManage/add' // 新建模板
export const STOP_CERTIFICATE = '/certificate/certificateManage/stop' // 新建模板
export const PREVIEW_CERTIFICATE = '/certificate/certificateManage/preview' // 新建模板
export const DELETE_CERTIFICATE = '/certificate/certificateManage/delete' // 新建模板
// 证书发放明细的鉴权
export const EXPORT_CERTIFICATE = '/certificate/certificateDetail/export' // 导出Excel
// 组织管理的鉴权
export const ADD_ORG = '/orgs/orgManagement/add' // 新建组织
export const ADD_ORG_CHILD = '/orgs/orgManagement/addChild' // 新建子组织
export const EDIT_ORG = '/orgs/orgManagement/edit' // 编辑
export const DELETE_ORG = '/orgs/orgManagement/delete' // 删除
// 用户管理的鉴权
export const ADD_USER = '/system/user/add' // 新建用户
export const SETTING_USER = '/system/user/setting' // 角色设置
export const RESET_USER = '/system/user/resetPassword' // 密码重置
export const EDIT_USER = '/system/user/edit' // 编辑
export const END_USER = '/system/user/end' // 冻结
export const DELETE_USER = '/system/user/delete' // 删除
// 菜单管理的鉴权
export const STOP_MENU = '/system/menu/stop' // 启用/停用
// 新闻管理的鉴权
export const ADD_NEWS = '/system/newsCenter/newsManage/add' // 新建公告
export const DELETE_NEWS = '/system/newsCenter/newsManage/delete' // 删除
export const EDIT_NEWS = '/system/newsCenter/newsManage/edit' // 删除
export const TOP_NEWS = '/system/newsCenter/newsManage/top' // 置顶
// 角色管理的鉴权
export const ADD_ROLE = '/system/role/add' // 新建角色
export const VIEW_ROLE = '/system/role/view' // 查看用户
export const EDIT_ROLE = '/system/role/edit' // 编辑
export const DELETE_ROLE = '/system/role/delete' // 删除
export const AUTH_ROLE = '/system/role/author' // 删除
export const ADD_ROLE_CATALOG = '/system/role/addCatalog' // 删除
// TODO: 待补充权限配置页面、查看用户鉴权
// TODO: 待补充测试环境的鉴权配置
