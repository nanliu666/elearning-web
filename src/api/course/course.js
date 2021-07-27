import { get, post, put, del } from '@/router/axios'
/**
 * del, get, post, put
 * 创建课程数据导出接口
 * @param {Object} params - 参数
 * */
export const getCourseList = (params) => get('/api/manage/v1/course/getCourse', params)
/**
 * @param {Object} params - 参数
 * */
export const exportCourseList = (params) =>
  get('/api/manage/v1/course/getCourseList/export', params, { responseType: 'blob' })

/**
 * 删除课程内容接口
 * @param {Object} contentId - 参数
 * */
export const delCourseContent = (params) => get('/api/manage/v1/course/delCourseContent', params)
/**
 * 删除课程接口
 * @param {Object} courseId - 参数
 * */
export const delCourseInfo = (params) => post('/api/manage/v1/course/delCourseInfo', params)
/**
 * 查询课程信息列表
 * @param {Object} courseId - 参数
 * */
export const getCourseListData = (params) => get('/api/manage/v1/course/getCourseList', params)
/**
 * 导出课程信息列表
 * @param {Object} courseId - 参数
 * */
export const exportCourseListData = (params) =>
  post('/api/manage/v1/teacher/listTeacher/export', params, { responseType: 'blob' })

/**
 * 新增课程
 * @param {Object} courseId - 参数
 * */
export const addCourse = (params) => post('/api/manage/v1/course/addCourse', params)
/**
 * 编辑课程
 * @param {Object} courseId - 参数
 * */
export const editCourseInfo = (params) => put('/api/manage/v1/course/editCourseInfo', params)
/**
 * 课程目录查询
 * @param {Object} courseId - 参数
 * */
export const getCatalog = (params) => get('/manage/v1/course/getCatalog', params)
/**
 * 新增课程目录
 * @param {Object} courseId - 参数
 * */
export const addCatalog = (params) => post('/api/manage/v1/course/addCatalog', params)
/**
 * 删除课程目录
 * @param {Object} courseId - 参数
 * */
export const delCatalag = (params) => del('/api/manage/v1/course/delCatalog', params)

/**
 * 编辑课程目录
 * @param {Object} courseId - 参数
 * */
export const editCatalog = (params) => put('/api/manage/v1/course/editCatalog', params)
/**
 * 停用&启用
 * @param {Object} courseId - 参数
 * */
export const updateStatus = (params) => put('/api/manage/v1/course/updateStatus', params)
/**
 * 确认某个课程目录id下是否有课程信息
 * @param {Object} courseId - 参数
 * */
export const getCourseByCatalogId = (params) =>
  get('/api/manage/v1/course/getCourseByCatalogId', params)
/**
 * 创建人信息列表
 * @param {Object} courseId - 参数
 * */
export const catalogUserList = (params) => get('/api/manage/v1/course/catalogUserList', params)
/**
 * 课程目录--修改排序
 * @param {Object} params - 参数
 * */
export const updateCatalogSort = (params) => put('/api/manage/v1/course/updateCatalogSort', params)
/**
 * 上下架操作
 * @param {Object} params - 参数
 * */
export const putawayOperate = (params) => put('/api/manage/v1/course/putawayOperate', params)
/**
 * 置顶、取消置顶操作操作
 * @param {Object} params - 参数
 * */
export const updateCourseTop = (params) => put('/api/manage/v1/course/updateCourseTop', params)
/**
 * 移动课程
 * @param {Object} params - 参数
 * */
export const moveCourse = (params) => put('/api/manage/v1/course/moveCourse', params)
/**
 * 创建课程--标签信息
 * @param {Object} params - 参数
 * */
export const getCourseTags = (params) => get('/api/manage/v1/course/getCourseTags', params)
/**
 * 查询单个课程信息  // 编辑页面的数据前
 * @param {Object} params - 参数
 * */
export const getCourse = (params) => get('/api/manage/v1/course/getCourse', params)
/**
 * 查询单个课程信息  // 编辑页面的数据前
 * @param {Object} params - 参数
 * */
export const getCourseContents = (params) => get('/api/manage/v1/course/getCourseContents', params)
/**
 *  查询讲师列表
 * @param {Object} params - 参数
 * */
export const listTeacher = (params) => get('/api/manage/v1/teacher/listTeacherComboBox', params)
/**
 *  学习详情
 * @param {Object} params - 参数
 * */
export const getCourseStudyDetail = (params) =>
  get('/api/manage/v1/course/getCourseStudyDetail', params)
/**
 *  学习人员列表
 * @param {Object} params - 参数
 * */
export const getStudyList = (params) => get('/api/manage/v1/course/getStudyList', params)
/**
 *  课程管理--创建人信息下拉框
 * @param {Object} params - 参数
 * */
export const getCourseInfoUserList = (params) =>
  get('/api/manage/v1/course/getCourseInfoUserList', params)
/**
 *  查询课程作业列表
 * @param {Object} params - 参数
 * */
export const listCourseJob = (params) => get('api/manage/v1/course/listCourseJob', params)
/**
 *  查询用户心得体会列表
 * @param {Object} params - 参数
 * */
export const courseFeelListByUserId = (params) =>
  get('api/manage/v1/course/courseFeelListByUserId', params)
/**
 *  导出学习人员列表
 * @param {Object} params.courseId - 课程Id
 * */
export const exportStudyList = (params) =>
  get('api/manage/v1/course/exportStudyList', params, { responseType: 'blob' })
/**
 *  学员提交作业或讲师提交评改
 * @param {Object} params.courseId        课程id
 * @param {Object} params.fileCategory    文件归类：用户提交的附件user、还是讲师评改的附件teacher
 * @param {Object} params.fileName        文件名称，包括扩展名
 * @param {Object} params.filePath        文件所在路径
 * @param {Object} params.fileSize        文件大小
 * @param {Object} params.id              对应FileInfoList里的Id，有则回传，没有则传空
 * @param {Object} params.jobId           对应课程作业Id
 * @param {Object} params.userId          学员id
 **/
export const saveCourseLinkedStudentOrTeacher = (params) =>
  post('api/manage/v1/web/coursecenter/coursework/saveCourseLinkedStudentOrTeacher', params)
/**
 *  批量压缩成zip下载
 * @param {Object} params.filePath        多个文件路径url的数组
 * @param {Object} params.fileName        每个文件对应的名称数组
 * @param {Object} params.zipComment      zip包名称
 **/
export const zip = (params) => get('/api/common/oss/download/zip', params)

// 课程分类查询
export const classList = (params) => get('/api/manage/v1/course/getCatalog', params)
// 课程编号唯一查询
export const id = (params) => get('/api/manage/v1/course/hasRepeatCourseNo', params)

// 查询课程评价
export const courseEvaluation = (params) =>
  get('/api/manage/v1/web/course/getCourseScopeList', params)
// 获取课程内容
export const getCourseRecord = (params) => get('/api/manage/v1/web/course/getCourseRecord', params)
// 查询课程是否关联培训
export const verifyCourseCanDelete = (params) =>
  post('/api/manage/v1/course/verifyCourseCanDelete', params)

//批量上传课程
export const importCourse = (params) => post('/api/manage/v1/course/import', params)

//错误文件下载
export const exportErrFileCourse = (params) =>
  get('/api/manage/v1/course/exportErrFile', params, { responseType: 'blob' })

//下载模板
export const exportDownloadTemplate = (params) =>
  get('/api/manage/v1/course/downloadTemplate', params, { responseType: 'blob' })

//批量同步课程
export const syncCourses = (params) => get('/api/manage/v1/course/syncCourses', params)
