'use strict';

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
    userId: {type: String, required: true, index: {unique: true}},
    userName: {type: String, required: true}
})

UserSchema.statics.make = function(doc) {
    return this.create(doc)
}

mongoose.model('User', UserSchema)
