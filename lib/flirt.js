'use strict';

const request = require('superagent-promise')(require('superagent'), Promise)
const i18n = require('../i18n')
const {username} = require('./username')

module.exports = async () => {
  let reply = i18n.flirt[Math.floor(Math.random() * i18n.flirt.length)]
  return reply
}