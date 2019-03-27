'use strict';

const {dateQueryBuilder} = require('./utils')

module.exports.getNewReservationId = async (model, startTime, userId) => {
  let reservations = await model.find({userId}, 'reservationId')
  let id1 = 0
  for (let {reservationId} of reservations) {
    if (id1 <= reservationId) id1 = reservationId + 1
  }

  reservations = await model.find(dateQueryBuilder(startTime), 'inDayId')
  let id2 = 0
  for (let {inDayId} of reservations) {
    if (id2 <= inDayId) id2 = inDayId + 1
  }

  return [id1, id2]
}
