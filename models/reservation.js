'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {getNewReservationId} = require('../lib/incremental_id')

const ReservationSchema = new Schema({
    reservationId: {type: Number, min: 0, required: true},
    inDayId: {type: Number, min: 0, required: true},
    userId: {type: String, required: true},
    userName: {type: String, required: true},
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    place: {type: Number, min: 0, max: 1, required: true}
})

ReservationSchema.statics.make = async function(doc) {
    let {userId, userName, startTime, endTime, place} = doc

    let [reservationId, inDayId] = await getNewReservationId(this, startTime)
    return this.create({
        reservationId,
        inDayId,
        userId,
        userName,
        startTime,
        endTime,
        place
    })
}

mongoose.model('Reservation', ReservationSchema)
