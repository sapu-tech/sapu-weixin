'use strict';

const request = require('superagent-promise')(require('superagent'), Promise)
const i18n = require('../i18n')
const {replyBuilder, replyFBuilder} = require('./utils')
const {username} = require('./username')

module.exports = () => {
  let reply = i18n.flirt[Math.floor(Math.random() * i18n.flirt.length)]
  return Promise.resolve(reply)
}