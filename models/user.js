'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    userId: {type: String, required: true, index: {unique: true}},
    userName: {type: String, required: true}
})

UserSchema.statics.make = function(doc) {
    return this.create(doc)
}

mongoose.model('User', UserSchema)
