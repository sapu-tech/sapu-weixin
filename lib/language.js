'use strict';

const request = require('superagent-promise')(require('superagent'), Promise)
const moment = require('moment-timezone')
const i18nRaw = require('../i18n')
const view = require('./view')
require('string-format-js')

const {baseURL} = require('../config')

let language = async (args, userId, userLang) => i18nRaw(userLang)['language_help']

language.set = async (args, userId, userLang) => {
  const i18n = i18nRaw(userLang)

  if (args.length == 0)
    return i18n['language_help']

  let lang = Number(args[0])
  if (!Number.isFinite(lang))
    lang = 0

  let {body} = await request
      .post(baseURL + '/user/'+  userId)
      .send({userLang: lang})

  return i18n[body.success ? 'language_set' : 'language_set_failed']
}

module.exports = language