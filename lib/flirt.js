'use strict';

const request = require('superagent-promise')(require('superagent'), Promise)
const i18nRaw = require('../i18n')
const {username} = require('./username')

module.exports = async (args, userId, userLang) => {
  const source = i18nRaw(userLang).flirt
  let reply = source[Math.floor(Math.random() * source.length)]
  return reply
}