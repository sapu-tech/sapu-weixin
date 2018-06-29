'use strict'

const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const weixin = require('weixin-api')
const mongoose = require('mongoose')
const glob = require('glob')
const moment = require('moment-timezone')

const routes = require('./routes/index')
const config = require('./config')

var app = express()

moment.tz.setDefault("Asia/Shanghai")

// mongoose
mongoose.Promise = Promise
mongoose.connect(config.db, {useMongoClient: true}, error => {
  if (error) {
    throw error
  }
})

// models for mongoose
for (let model of glob.sync(path.posix.resolve('models/**/*.js'))) {
  require(model)
}

// weixin
weixin.token = config.weixin.token

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)
for (let router of ['reservation', 'user']) {
  app.use(`/${router}`, require(`./routes/${router}`))
}

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

/// error handlers
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: config.production ? {} : err
  })
})

module.exports = app
