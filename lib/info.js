'use strict';

const i18n = require('../i18n')
const username = require('./username')
require('string-format-js')

let info = async args => {
  if (args.length < 1) {
    let reply = [i18n['info_help']]
    let instructions = i18n['info_helps']
    for (let index in instructions) {
      reply.push(index + ' ' + instructions[index])
    }
    return reply.join('\n')
  } else {
    let i = args[0]
    let reply = i18n['info_contents'][i]
    if (reply) {
      return reply
    } else {
      return i18n['info_not_found'].format(i)
    }
  }
}

module.exports = info
