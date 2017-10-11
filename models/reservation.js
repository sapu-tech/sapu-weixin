'use strict';

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var {getNewReservationId} = require('../lib/incremental_id')

var ReservationSchema = new Schema({
    reservationId: {type: Number, min: 0, required: true},
    inDayId: {type: Number, min: 0, required: true},
    userId: {type: String, required: true},
    userName: {type: String, required: true},
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    place: {type: Number, min: 0, max: 1, required: true}
})

ReservationSchema.statics.make = function(doc) {
    let {userId, userName, startTime, endTime, place} = doc

    return getNewReservationId(this, startTime).then(([reservationId, inDayId]) => {
        return this.create({
            reservationId,
            inDayId,
            userId,
            userName,
            startTime,
            endTime,
            place
        })
    })
}

mongoose.model('Reservation', ReservationSchema)
