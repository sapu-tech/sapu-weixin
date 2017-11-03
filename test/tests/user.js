'use strict'

const should = require('should')
const request = require("supertest")
const testData = require('../../config').test
const app = require('../../app')
require('datejs')

describe('A user', function() {

  let user = testData.users[0], newUserName = testData.users[1].userName

  it('should not be found at the first place', async function() {
    let {body} = await request(app)
      .get('/user/' + user.userId)
      .expect(200)
    body.should.have.property('success')
    body.success.should.be.equal(false)
  })

  it('should be able to be created', async function() {
    let {body} = await request(app)
      .post('/user/' + user.userId)
      .send(user)
      .expect(200)
    body.should.have.property('success')
    body.success.should.be.equal(true)
    body.should.have.property('user')
    body.user.should.be.Object()
    body.user.should.have.property('userId')
    body.user.userId.should.be.equal(user.userId)
    body.user.should.have.property('userName')
    body.user.userName.should.be.equal(user.userName)
  })

  it('should get that userName', async function() {
    let {body} = await request(app)
      .get('/user/' + user.userId)
      .expect(200)
    body.should.have.property('success')
    body.success.should.be.equal(true)
    body.should.have.property('user')
    body.user.should.have.property('userName')
    body.user.userName.should.be.equal(user.userName)
  })

  it('should be able to change name', async function() {
    let newUser = Object.assign({}, user)
    newUser.userName = newUserName

    let {body} = await request(app)
      .post('/user/' + user.userId)
      .send(newUser)
      .expect(200)
    body.should.have.property('success')
    body.success.should.be.equal(true)
    body.should.have.property('user')
    body.user.should.be.Object()
    body.user.should.have.property('userId')
    body.user.userId.should.be.equal(newUser.userId)
    body.user.should.have.property('userName')
    body.user.userName.should.be.equal(newUser.userName)
  })

  it('should be the new userName', async function() {
    let {body} = await request(app)
      .get('/user/' + user.userId)
      .expect(200)
    body.should.have.property('success')
    body.success.should.be.equal(true)
    body.should.have.property('user')
    body.user.should.have.property('userName')
    body.user.userName.should.be.equal(newUserName)
  })

  it('should reject blank userName', async function() {
    let newUser = Object.assign({}, user)
    newUser.userName = ""

    let {body} = await request(app)
      .post('/user/' + user.userId)
      .send(newUser)
      .expect(200)
    body.should.have.property('success')
    body.success.should.be.equal(false)
    body.should.have.property('code')
    body.code.should.be.equal(4)
  })
})