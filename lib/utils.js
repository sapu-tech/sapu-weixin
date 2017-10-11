'use strict'

const moment = require('moment-timezone')

const {errors, production} = require('../config')

class ReservationError {
  constructor(code) {
    this.success = false
    this.code = code
    this.message = errors[code]
  }
}

const unknownError = new ReservationError(0)

module.exports = {
  ReservationError,

  errorPromise(code) {
    return Promise.reject(new ReservationError(code))
  },

  errorPromiseWithContent(code, content) {
    let err = new ReservationError(code)
    err.content = content
    return Promise.reject(err)
  },

  successHandler(res, data) {
    data.success = true
    res.json(data)
  },

  errorHandler: res => error => {
    if (!production || error instanceof ReservationError) {
      res.json(error)
    } else {
      res.json(unknownError)
    }
  },

  replyBuilder: reply => {
    return Promise.resolve(reply)
  },

  replyFBuilder: reply => args => {
    return Promise.resolve(reply)
  },

  dateQueryBuilder: startTime => {
    let date = moment(startTime).startOf('day'),
      nextDate = moment(date).add(1, 'days')
    return {startTime: {$gte: date.toDate(), $lt: nextDate.toDate()}}
  }
}
