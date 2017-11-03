'use strict';

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const {successHandler, ReservationError, asyncMiddleware} = require('../lib/utils')
const {production} = require('../config')

// get the name of a user
router.get('/:userId', asyncMiddleware(async (req, res, next) => {
  let {userId} = req.params
  let user = await User.findOne({userId})
  if (user) {
    successHandler(res, {user})
  } else {
    throw new ReservationError(3)
  }
}))

// get the name of some users
router.get('/', asyncMiddleware(async (req, res, next) => {
  let {userIds} = req.query
  let users = await User.find({userId: {$in: userIds}})
  successHandler(res, {users})
}))

// add/change the name of the user
// return {userId: userId, userName: userName}
router.post('/:userId', asyncMiddleware(async (req, res, next) => {
  let {userId} = req.params
  let {userName} = req.body

  if (userName === undefined || userName == "") {
    throw new ReservationError(4)
  }

  let user = await User.findOneAndUpdate({userId}, {userName: userName}, {new: true, upsert: true})
  successHandler(res, {user})
}))

module.exports = router
