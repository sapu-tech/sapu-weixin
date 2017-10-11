'use strict'

const should = require('should')
const request = require('supertest-as-promised')(Promise)
// const app = require('../../app')
const {baseURL, userId, msg, token, users} = require('../../config').test
const {receive, send} = require('../testutil')
require('datejs')

let r = (message, user) => async function() {
  msg.content = message
  msg.fromUserName = user
  let body = await request(baseURL)
    .post('/')
    .type('xml')
    .send(send(msg))
    .expect(200)
  //await receive(body.text)
  console.log(body.text)
}

let _it = (descprition, command) => it(descprition, r(command, users[0].userName))
let _it_with_user = (descprition, command, user) => it(descprition, r(command, user.Name))

describe('Basic test', function() {
  _it(
    'should get no reservations at the moment.',
    '预约 列表'
  )

  _it(
    'should be unable to add a reservation.',
    '预约 新增 10 8 18 20 0'
  )

  _it(
    'should be able to set name.',
    '我是 xDroid'
  )

  _it(
    'should be able to add a reservation by now.',
    '预约 新增 10 8 18 20 0'
  )

  _it(
    'should be unable to add a reservation with time conflict.',
    '预约 新增 10 8 19 21 0'
  )
})/*

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
    '预约 删除 10 8 0'
  )

  _it(
    'should be unable to delete the previous reservation again',
    '预约 删除 10 8 0'
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
    '预约 新增 10 8 18 20 0',
    users[0]
  ) // inDayId: 0

  _it(
    'and check.',
    '预约 列表'
  )

  _it_with_user(
    'should be unable to set name for users[1].',
    '我是 另一个用户',
    users[1]
  )

  _it_with_user(
    'should be unable to add one with time conflict by another user.',
    '预约 新增 10 8 17 19 0',
    users[1]
  )

  _it_with_user(
    'should be able to add one with no time conflict by another user.',
    '预约 新增 10 9 18 20 0',
    users[1]
  ) // inDayId: 0

  _it_with_user(
    'should be unable to delete reservation added by another user.',
    '预约 删除 10 9 0',
    users[0]
  )

  _it_with_user(
    'the same as above.',
    '预约 删除 10 8 0',
    users[1]
  )

  _it_with_user(
    'should be able to delete his own record.',
    '预约 删除 10 8 0',
    users[0]
  )

  _it_with_user(
    'the same as above.',
    '预约 删除 10 9 0',
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
    '预约 新增 10 8 12 14 0',
    users[0]
  ) // inDayId: 0
  
  _it_with_user(
    'should be able to add another reservation.',
    '预约 新增 10 8 15 17 0',
    users[0]
  ) // inDayId: 1
  
  _it_with_user(
    'some more...',
    '预约 新增 10 8 18 20 0',
    users[1]
  ) // inDayId: 2
  
  _it_with_user(
    'but reject a greddy user.',
    '预约 新增 10 8 11 15 0',
    users[0]
  )
  
  _it_with_user(
    'and also this one.',
    '预约 新增 10 8 12 21 0',
    users[1]
  )
  
  _it_with_user(
    'cleaning reservations.',
    '预约 删除 10 8 0',
    users[0]
  )
  
  _it_with_user(
    '..',
    '预约 删除 10 8 1',
    users[0]
  )
  
  _it_with_user(
    '...',
    '预约 删除 10 8 2',
    users[1]
  )
  
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
    '10/8 12.5-14.5.',
    '预约 新增 10 8 12.5 14.5 0'
  ) // inDayId: 0
  
  _it(
    '10/7 10-13.',
    '预约 新增 10 7 10 13 0'
  ) // inDayId: 1
  
  _it(
    '10/8 14-17.',
    '预约 新增 10 8 14 17 0'
  ) // rejected!
  
  _it(
    '10/9 18-20.',
    '预约 新增 10 9 18 20 0'
  ) // inDayId: 2
  
  _it(
    '10/7 6-9.',
    '预约 新增 10 7 6 9 0'
  ) // inDayId: 3
  
  _it(
    '10/10 12-14.',
    '预约 新增 10 10 12 14 0'
  ) // inDayId: 4
  
  _it(
    '11/8 21-23.',
    '预约 新增 11 8 21 23 0'
  ) // inDayId: 5
  
  _it(
    'check.',
    '预约 列表'
  )
  
  _it(
    'check twice.',
    '预约 列表 10 8'
  )
  
  _it(
    'check all.',
    '预约 全部'
  )
})*/

/*
describe('Info Test', () => {
  _it(
    'Basic info request.',
    '信息'
  )
})
*/
