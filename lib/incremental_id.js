'use strict'

const {dateQueryBuilder} = require('./utils')

module.exports.getNewReservationId = (model, startTime) => {
  return Promise.all([
    model.find('reservationId').then(reservations => {
      let id = 0
      for (let {reservationId} of reservations) {
        if (id <= reservationId) id = reservationId + 1
      }
      return id
    }),

    model.find(dateQueryBuilder(startTime), 'inDayId').then(reservations => {
      let id = 0
      for (let {inDayId} of reservations) {
        if (id <= inDayId) id = inDayId + 1
      }
      return id
    })
  ])
}
