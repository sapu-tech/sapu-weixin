'use strict';

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const {errorPromise, successHandler, errorHandler, ReservationError} = require('../lib/utils')
const {production} = require('../config')

// get the name of a user
router.get('/:userId', (req, res, next) => {
  let {userId} = req.params
  User.findOne({userId})
  .then(user => {
    if (user) {
      successHandler(res, {user})
    } else {
      return errorPromise(3)
    }
  })
  .catch(errorHandler(res))
})

// get the name of some users
router.get('/', (req, res, next) => {
  let {userIds} = req.query
  User.find({userId: {$in: userIds}})
  .then(users => {
    successHandler(res, {users})
  })
  .catch(errorHandler(res))
})

// add/change the name of the user
// return {userId: userId, userName: userName}
router.post('/:userId', (req, res, next) => {
  let {userId} = req.params
  let {userName} = req.body

  if (userName == undefined || userName == "") {
    res.json(new ReservationError(4))
    return
  }

  User.findOneAndUpdate({userId}, {userName: userName}, {new: true, upsert: true})
  .then(user => successHandler(res, {user}))
  .catch(errorHandler(res))
})

module.exports = router
