'use strict'

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const moment = require('moment-timezone')
const Reservation = mongoose.model('Reservation')
const {production} = require('../config')
const {errorPromise, errorPromiseWithContent, successHandler, errorHandler, dateQueryBuilder} = require('../lib/utils')

// get all reservations
router.get('/', (req, res, next) => {
  Reservation.find()
  .then(reservations => successHandler(res, {reservations}))
  .catch(errorHandler(res))
})

// get a reservation
router.get('/:reservationId', (req, res, next) => {
  let {reservationId} = req.params
  Reservation.findOne({reservationId})
  .then(reservation => {
    if (reservation) {
      successHandler(res, {reservation})
    } else {
      return errorPromise(2)
    }
  })
  .catch(errorHandler(res))
})

// get reservations by {month, date}
router.get('/:month/:date', (req, res, next) => {
  let {month, date} = req.params

  let today = moment().startOf('day')
  let thisYearDate = moment(today).month(month - 1).date(date),
    nextYearDate = moment(today).add({years: 1}).month(month - 1).date(date)

  let d = thisYearDate
  if (today > thisYearDate)
    d = nextYearDate

  let nd = moment(d).add({days: 1})
  let p = {startTime: {$gte: d.toDate(), $lt: nd.toDate()}}

  Reservation.find(p)
  .then(reservations => {successHandler(res, {reservations})})
  .catch(errorHandler(res))
})

// get a reservation by {month, date, inDayId}
router.get('/:month/:date/:inDayId', (req, res, next) => {
  let {month, date, inDayId} = req.params

  let today = moment().startOf('day')
  let thisYearDate = moment(today).month(month - 1).date(date),
    nextYearDate = moment(today).add({years: 1}).month(month - 1).date(date)

  let d = thisYearDate
  if (today > thisYearDate)
    d = nextYearDate

  let nd = moment(d).add({days: 1})
  let p = {startTime: {$gte: d.toDate(), $lt: nd.toDate()}, inDayId: inDayId}

  Reservation.findOne(p)
  .then(reservation => {
    if (reservation) {
      successHandler(res, {reservation})
    } else {
      return errorPromise(2)
    }
  })
  .catch(errorHandler(res))
})

// add a reservation
// return {reservation}
router.post('/', (req, res, next) => {
  let {userId, userName, startTime, endTime, place} = req.body

  Reservation.find({startTime: {$lt: endTime}, endTime: {$gt: startTime}})
  .then(reservations => {
    if (reservations && reservations.length > 0) {
      return errorPromiseWithContent(1,
        reservations.map(reservation => {
          return reservation.userId
      }))
    } else {
      return Reservation.make({userId, userName, startTime, endTime, place})
    }
  })
  .then(reservation => successHandler(res, {reservation}))
  .catch(errorHandler(res))
})

// delete an reservation
router.delete('/:userId/:reservationId', (req, res, next) => {
  let {userId, reservationId} = req.params
  reservationId = parseInt(reservationId)

  Reservation.findOne({reservationId: reservationId})
  .then(reservation => {
    if (reservation) {
      if (reservation.userId == userId)
        reservation.remove()
          .then(reservation => {successHandler(res, {reservation})})
          .catch(errorHandler(res))
      else
        return errorPromise(5)
    }
    else
      return errorPromise(2)
  })
  .catch(errorHandler(res))
})

module.exports = router
