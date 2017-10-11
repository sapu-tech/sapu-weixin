'use strict';

const request = require('superagent-promise')(require('superagent'), Promise)
const i18n = require('../i18n')
const {replyBuilder, replyFBuilder} = require('./utils')
const username = require('./username')
const view = require('./view')
require('string-format-js')

const {baseURL} = require('../config')

let info = args => {
  if (args.length < 1) {
    let reply = [i18n['info_help']]
    let instructions = i18n['info_helps']
    for (let index in instructions) {
      reply.push(index + ' ' + instructions[index])
    }
    return replyBuilder(reply.join('\n'))
  } else {
    let i = args[0]
    let reply = i18n['info_contents'][i]
    if (reply) {
      return replyBuilder(reply)
    } else {
      return replyBuilder(i18n['info_not_found'].format(i))
    }
  }
}

module.exports = info
