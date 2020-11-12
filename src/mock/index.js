/* eslint-disable no-unused-vars */
import Mock from 'mockjs'
import apprProcess from './modules/apprProcess'
import dict from './modules/dict'
import entry from './modules/entry'
import grade from './modules/grade'
import interview from './modules/interview'
import leave from './modules/leave'
import mailList from './modules/mailList'
import menu from './modules/menu'
import menus from './modules/menus'
import msg from './modules/msg'
import newsCenter from './modules/newsCenter'
import noticeCenter from './modules/noticeCenter'
import oauth from './modules/oauth'
import org from './modules/org'
import person from './modules/person'
import personalInfo from './modules/personalInfo'

import position from './modules/position'
import process from './modules/process'
import remind from './modules/remind'
import role from './modules/role'
import schedule from './modules/schedule'
import selectPerson from './modules/selectPerson'
import system from './modules/system'
import taskcenter from './modules/taskcenter'
import todo from './modules/todo'
import transction from './modules/transction'
import user from './modules/user'
/**
 * @param {boolean} enable 全局启用mock
 * @returns {void}
 */
export default (enable) => {
  if (!enable) return
  /**
   * 模拟数据mock
   *
   * mock是否开启模拟数据拦截
   */

  const options = { mock: false }
  // 设置500毫秒的时延长
  Mock.setup({
    timeout: 500
  })
  menu({ mock: true })
  newsCenter(options)
  noticeCenter(options)
  user(options)

  apprProcess(options)
  apprProcess(options)

  interview(options)

  selectPerson(options)
  position(options)
  grade(options)
  menus(options)

  system(options)

  oauth(options)

  dict(options)

  role(options)

  personalInfo(options)

  org(options)
  transction(options)

  person(options.mock)
  leave(options)

  todo(options)
  msg(options)
  todo(options)
  entry(options)
  taskcenter(options)
  schedule(options)
  remind(options)

  process(options)

  mailList(options)
}
