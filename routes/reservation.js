'use strict'

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const moment = require('moment-timezone')
const Reservation = mongoose.model('Reservation')
const {production} = require('../config')
const {successHandler, dateQueryBuilder, asyncMiddleware, ReservationError} = require('../lib/utils')

// get all reservations
router.get('/', asyncMiddleware(async (req, res, next) => {
  let reservations = await Reservation.find()
  successHandler(res, {reservations})
}))

// get a reservation
router.get('/:reservationId', asyncMiddleware(async (req, res, next) => {
  let {reservationId} = req.params
  let reservation = await Reservation.findOne({reservationId})
  
  if (reservation) {
    successHandler(res, {reservation})
  } else {
    throw new ReservationError(2)
  }
}))

// get reservations by {month, date}
router.get('/:month/:date', asyncMiddleware(async (req, res, next) => {
  let {month, date} = req.params

  let today = moment().startOf('day')
  let thisYearDate = moment(today).month(month - 1).date(date),
    nextYearDate = moment(today).add({years: 1}).month(month - 1).date(date)

  let d = thisYearDate
  if (today > thisYearDate)
    d = nextYearDate

  let nd = moment(d).add({days: 1})
  let p = {startTime: {$gte: d.toDate(), $lt: nd.toDate()}}

  let reservations = await Reservation.find(p)
  successHandler(res, {reservations})
}))

// get a reservation by {month, date, inDayId}
router.get('/:month/:date/:inDayId', asyncMiddleware(async (req, res, next) => {
  let {month, date, inDayId} = req.params

  let today = moment().startOf('day')
  let thisYearDate = moment(today).month(month - 1).date(date),
    nextYearDate = moment(today).add({years: 1}).month(month - 1).date(date)

  let d = thisYearDate
  if (today > thisYearDate)
    d = nextYearDate

  let nd = moment(d).add({days: 1})
  let p = {startTime: {$gte: d.toDate(), $lt: nd.toDate()}, inDayId: inDayId}

  let reservation = await Reservation.findOne(p)
  
  if (reservation) {
    successHandler(res, {reservation})
  } else {
    throw new ReservationError(2)
  }
}))

// add a reservation
// return {reservation}
router.post('/', asyncMiddleware(async (req, res, next) => {
  let {userId, userName, startTime, endTime, place} = req.body

  let reservations = await Reservation.find({startTime: {$lt: endTime}, endTime: {$gt: startTime}, place})

  if (reservations && reservations.length > 0) {
    throw new ReservationError(1, reservations.map(reservation => reservation.userId))
  } else {
    let reservation = await Reservation.make({userId, userName, startTime, endTime, place})
    successHandler(res, {reservation})
  }
}))

// delete an reservation
router.delete('/:userId/:reservationId', asyncMiddleware(async (req, res, next) => {
  let {userId, reservationId} = req.params
  reservationId = parseInt(reservationId)

  let reservation = await Reservation.findOne({userId, reservationId})
  if (reservation) {
    console.log(reservation)
    console.log(userId)
    if (reservation.userId == userId) {
      reservation = reservation.remove()
      successHandler(res, {reservation})
    }
    else
      throw new ReservationError(5)
  }
  else
    throw new ReservationError(2)
}))

module.exports = router
