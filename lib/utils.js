'use strict'

const moment = require('moment-timezone')

const {errors, production} = require('../config')

class ReservationError {
  constructor(code, content) {
    this.success = false
    this.code = code
    this.message = errors[code]
    this.content = content || ""
  }
}

const unknownError = new ReservationError(0)

module.exports = {
  ReservationError,

  successHandler(res, data) {
    data.success = true
    res.json(data)
  },

  dateQueryBuilder: startTime => {
    let date = moment(startTime).startOf('day'),
      nextDate = moment(date).add(1, 'days')
    return {startTime: {$gte: date.toDate(), $lt: nextDate.toDate()}}
  }, 

  asyncMiddleware: fn => (req, res, next) => {
    fn(req, res, next)
    .catch(error => {
      if (error instanceof ReservationError) {
        res.json(error)
      } else {
        res.status(500)
        if (production) {
          res.json(unknownError)
        } else {
          console.error(error)
          res.json(error)
        }
      }
    })
  }
}
