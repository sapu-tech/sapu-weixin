'use strict'

const should = require('should')
const request = require('supertest')
// const app = require('../../app')
const {baseURL, userId, msg, token, users} = require('../../config').test
const {receive, send} = require('../testutil')
require('datejs')

require('../../app')
const mongoose = require('mongoose')

before(async function() {
  await mongoose.connection.dropDatabase()
})

const reg = /<Content><\!\[CDATA\[.*\]\]/s
const prefix = '<Content><![CDATA['
let r = (message, user) => async function() {
  msg.content = message
  msg.fromUserName = user
  let body = await request(baseURL)
    .post('/')
    .type('xml')
    .send(send(msg, user))
    .expect(200)
  // await receive(body.text)
  // console.log(body.text)
  const reply = body.text.match(reg)[0]
  console.log(reply.substr(prefix.length, reply.length-2-prefix.length))
}

let _it = (descprition, command) => it(descprition, r(command, users[0].userName))
let _it_with_user = (descprition, command, user) => it(descprition, r(command, user.userName))

let thisMonth = ((new Date()).getMonth() + 2) % 12 - 1
let next1Month = ((new Date()).getMonth() + 3) % 12 - 1
let next2Month = ((new Date()).getMonth() + 4) % 12 - 1
const next3Date = (new Date()).getDate() + 3;

describe('Basic test', function() {
  _it(
    'should get no reservations at the moment.',
    '预约 列表'
  )

  _it(
    'should be unable to add a reservation.',
    `预约 新增 ${thisMonth} ${next3Date} 18 20 0`
  )

  _it(
    'should be able to set name.',
    '我是 xDroid'
  )

  _it(
    'should be able to add a reservation by now.',
    `预约 新增 ${thisMonth} ${next3Date} 18 20 0`
  )

  _it(
    'should be unable to add a reservation with time conflict.',
    `预约 新增 ${thisMonth} ${next3Date} 19 21 0`
  )

  _it(
    'should be unable to add a reservation on today.',
    `预约 新增 ${thisMonth} ${next3Date-3} 19 21 0`
  )

  _it(
    'should be unable to add a reservation on yesterday.',
    `预约 新增 ${thisMonth} ${next3Date-4} 19 21 0`
  )

  _it(
    'should be unable to add a reservation on the next day next week.',
    `预约 新增 ${thisMonth} ${next3Date+5} 19 21 0`
  )
})

describe('Change name test', () => {
  _it(
    'should be able to set to another name.',
    '我是 xDroid2'
  )

  _it(
    'should get the reservation list, with another name.',
    '预约 列表'
  )
})

describe('Delete reservation test', () => {
  _it(
    'should be able to delete the previous reservation',
    `预约 删除 ${thisMonth} ${next3Date} 0`
  )

  _it(
    'should be unable to delete the previous reservation again',
    `预约 删除 ${thisMonth} ${next3Date} 0`
  )

  _it(
    'should get no reservations',
    '预约 列表'
  )
})

describe('Two user test', function() {
  _it(
    'should get no reservations at the moment.',
    '预约 列表'
  )

  _it_with_user(
    'should be able to add one by users[0].',
    `预约 新增 ${thisMonth} ${next3Date} 18 20 0`,
    users[0]
  ) // inDayId: 0

  _it(
    'and check.',
    '预约 列表'
  )

  _it_with_user(
    'should be able to set name for users[1].',
    '我是 另一个用户',
    users[1]
  )

  _it_with_user(
    'should be unable to add one with time conflict by another user.',
    `预约 新增 ${thisMonth} ${next3Date} 17 19 0`,
    users[1]
  )

  _it_with_user(
    'should be able to add one with no time conflict by another user.',
    `预约 新增 ${thisMonth} ${next3Date+1} 18 20 0`,
    users[1]
  ) // inDayId: 0

  _it(
    'and check.',
    '预约 列表'
  )

  _it_with_user(
    'should be unable to delete reservation added by another user.',
    `预约 删除 ${thisMonth} ${next3Date+1} 0`,
    users[0]
  )

  _it_with_user(
    'the same as above.',
    `预约 删除 ${thisMonth} ${next3Date} 0`,
    users[1]
  )

  _it_with_user(
    'should be able to delete his own record.',
    `预约 删除 ${thisMonth} ${next3Date} 0`,
    users[0]
  )

  _it_with_user(
    'the same as above.',
    `预约 删除 ${thisMonth} ${next3Date+1} 0`,
    users[1]
  )

  _it(
    'check.',
    '预约 列表'
  )
})

describe('Conflict reservation Test', () => {
  _it_with_user(
    'should be able to add a reservation at first.',
    `预约 新增 ${thisMonth} ${next3Date} 12 14 0`,
    users[0]
  ) // inDayId: 0
  
  _it_with_user(
    'should be able to add another reservation.',
    `预约 新增 ${thisMonth} ${next3Date} 15 17 0`,
    users[0]
  ) // inDayId: 1
  
  _it_with_user(
    'some more...',
    `预约 新增 ${thisMonth} ${next3Date} 18 20 0`,
    users[1]
  ) // inDayId: 2
  
  _it_with_user(
    'but reject a greddy user.',
    `预约 新增 ${thisMonth} ${next3Date} 11 15 0`,
    users[0]
  )
  
  _it_with_user(
    'and also this one.',
    `预约 新增 ${thisMonth} ${next3Date} 12 21 0`,
    users[1]
  )
  
  _it_with_user(
    'cleaning reservations.',
    `预约 删除 ${thisMonth} ${next3Date} 0`,
    users[0]
  )
  
  _it_with_user(
    '..',
    `预约 删除 ${thisMonth} ${next3Date} 1`,
    users[0]
  )
  
  _it_with_user(
    '...',
    `预约 删除 ${thisMonth} ${next3Date} 2`,
    users[1]
  )
  
  _it(
    'check.',
    '预约 列表'
  )
})

describe('Conflict reservation Test', () => {

  _it_with_user(
    'should not be able to add one reservation that is a month later.',
    `预约 新增 ${next2Month} 29 12 14 0`,
    users[0]
  ) // inDayId: 0
  
  _it(
    'check.',
    '预约 列表'
  )
})

describe('Reserve list Test', () => {
  _it(
    'should be able to set name.',
    '我是 xDroid'
  )

  _it(
    `${thisMonth}/${next3Date} 12.5-14.5.`,
    `预约 新增 ${thisMonth} ${next3Date} 12.5 14.5 0`
  ) // inDayId: 0
  
  _it(
    `${thisMonth}/${next3Date+1} 10-13.`,
    `预约 新增 ${thisMonth} ${next3Date+1} 10 13 0`
  ) // inDayId: 0
  
  _it(
    `${thisMonth}/${next3Date} 14-17.`,
    `预约 新增 ${thisMonth} ${next3Date} 14 17 0`
  ) // rejected!
  
  _it(
    `${thisMonth}/${next3Date} 18-20.`,
    `预约 新增 ${thisMonth} ${next3Date} 18 20 0`
  ) // inDayId: 2
  
  _it(
    `${thisMonth}/${next3Date} 6-9.`,
    `预约 新增 ${thisMonth} ${next3Date} 6 9 0`
  ) // inDayId: 3
  
  _it(
    `${thisMonth}/${next3Date+1} 12-14.`,
    `预约 新增 ${thisMonth} ${next3Date+1} 12 14 0`
  ) // inDayId: 4
  
  _it(
    `${next1Month}/${next3Date} 21-23.`,
    `预约 新增 ${next1Month} ${next3Date} 21 23 0`
  ) // inDayId: 5
  
  _it(
    'check.',
    '预约 列表'
  )
  
  _it(
    'check twice.',
    `预约 列表 ${thisMonth} ${next3Date}`
  )
  
  _it(
    'check all.',
    '预约 全部'
  )
})

describe('Info Test', () => {
  _it(
    'Basic info request.',
    '信息'
  )
})


describe('Flirt Test', () => {
  _it(
    'Basic flirt request.',
    '你好'
  )
})

describe('Version Test', () => {
  _it(
    'Basic version request.',
    '版本'
  )
})

describe('Language Test', () => {
  _it(
    'Default language.',
    '语言'
  )

  _it(
    'Change language, but in the wrong way.',
    '语言 设置'
  )

  _it(
    'Change language in the right way.',
    '语言 设置 2'
  )

  _it(
    'should get no reservations at the moment.',
    'r l'
  )

  _it(
    'just test.',
    `r n ${thisMonth} ${next3Date} 17 19 0`
  )

  _it(
    'check.',
    'r l'
  )

  _it(
    'more tests.',
    `r d ${thisMonth} ${next3Date} 0`
  )

  _it(
    'Change language again.',
    'lang set 1'
  )

  _it(
    'Change the language once again.',
    'language set 0'
  )
})

after(async function() {
  mongoose.connection.close()
})