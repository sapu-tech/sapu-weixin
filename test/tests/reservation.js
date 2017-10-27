'use strict'

const should = require('should')
const request = require('supertest-as-promised')(Promise)
const testData = require('../../config').test
const app = require('../../app')
require('datejs')

describe('Upload and check reservation', function() {

  let user = testData.users[0], data = {
    userId: user.userId,
    userName: user.userName,
    startTime: new Date,
    endTime: (new Date).addHours(2),
    place: 0
  }

  let reservationId

  it('should accept a valid reservation', async function() {
    let {body} = await request(app)
      .post('/reservation/')
      .send(data)
      .expect(200)
    body.should.have.property('success')
    body.success.should.be.equal(true)
    let {reservation} = body
    reservation.should.have.property('reservationId')
    reservationId = reservation.reservationId
  })

  it('should get that reservation', async function() {
    let {body} = await request(app)
      .get('/reservation/' + reservationId)
      .expect(200)
    body.should.have.property('success')
    body.success.should.be.equal(true)
    body.should.have.property('reservation')
    let {reservation} = body
    reservation.should.be.Object()
    reservation.should.have.property('userName')
    reservation.userName.should.be.equal(data.userName)
    reservation.should.have.property('startTime')
    reservation.should.have.property('endTime')
    reservation.should.have.property('place')
    reservation.place.should.be.equal(data.place)
    reservation.should.have.property('reservationId')
    reservation.reservationId.should.be.equal(reservationId)
  })

  it('should reject an reservation with time conflict', async function() {
    let conflictData = {
      userId: testData.users[0].userId,
      userName: testData.users[0].userName,
      startTime: (new Date).addHours(1),
      endTime: (new Date).addHours(3),
      place: 0
    }

    let {body} = await request(app)
      .post('/reservation/')
      .send(conflictData)
      .expect(200)
    body.should.have.property('success')
    body.success.should.be.equal(false)
    body.should.have.property('code')
    body.code.should.be.equal(1)
  })

  let newreservationId

  it('should be able to upload another reservation', async function() {
    let newData = Object.assign({}, data, {
      startTime: (new Date).addHours(4),
      endTime: (new Date).addHours(6)
    })
    let {body} = await request(app)
      .post('/reservation/')
      .send(newData)
      .expect(200)
    body.should.have.property('success')
    body.success.should.be.equal(true)
    let {reservation} = body
    reservation.should.have.property('reservationId')
    newreservationId = reservation.reservationId
    newreservationId.should.not.be.equal(reservationId)
  })

  it('should get two reservations at this time', async function() {
    let {body} = await request(app)
      .get('/reservation/')
      .expect(200)
    body.should.have.property('success')
    body.success.should.be.equal(true)
    body.should.have.property('reservations')
    body.reservations.should.be.Array()
    body.reservations.should.have.size(2)
  })

  it('should be able to upload another reservation of a different place', async function() {
    let newData = Object.assign({}, data, {
      startTime: (new Date).addHours(1),
      endTime: (new Date).addHours(5),
      place: 1
    })
    let {body} = await request(app)
      .post('/reservation/')
      .send(newData)
      .expect(200)
    body.should.have.property('success')
    body.success.should.be.equal(true)
    let {reservation} = body
    reservation.should.have.property('reservationId')
    newreservationId = reservation.reservationId
    newreservationId.should.not.be.equal(reservationId)
  })

  it('should be able to delete the first reservation', async function() {
    let {body} = await request(app)
      .delete(`/reservation/${user.userId}/${reservationId}`)
      .expect(200)
    body.should.have.property('success')
    body.success.should.be.equal(true)
    body.should.have.property('reservation')
  })

  it('should get two reservations at this time', async function() {
    let {body} = await request(app)
      .get('/reservation/')
      .expect(200)
    body.should.have.property('success')
    body.success.should.be.equal(true)
    body.should.have.property('reservations')
    body.reservations.should.be.Array()
    body.reservations.should.have.size(2)
  })
})

describe('If given invalid data', function() {

  it('should handle a reservation that does not exist', async function() {
    let {body} = await request(app)
      .get('/reservation/-1')
      .expect(200)
    body.should.have.property('success')
    body.success.should.be.equal(false)
    body.should.have.property('code')
    body.code.should.be.equal(2)
  })
})