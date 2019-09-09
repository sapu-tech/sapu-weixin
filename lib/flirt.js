'use strict';

const i18nRaw = require('../i18n')

module.exports = async (args, userId, userLang) => {
  const source = i18nRaw(userLang).flirt
  let reply = source[Math.floor(Math.random() * source.length)]
  return reply
}