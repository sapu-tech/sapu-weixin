'use strict';

const request = require('superagent')
const i18nRaw = require('../i18n')
const reserve = require('./reserve')
const flirt = require('./flirt')
const info = require('./info')
const recommend = require('./recommend')
const username = require('./username')
const language = require('./language')
require('datejs')

const {baseURL} = require('../config')

let root = async (args, userId, userLang) => {
  /*if (Math.random() > 0.3)
    return Promise.resolve(i18n['root_help'])
  else
    return flirt()*/
  const i18n = i18nRaw(userLang)

  return i18n['root_help']
}
root.reserve = reserve
root.setname = username.setname
root.flirt = flirt
root.info = info
root.recommend = recommend
root.language = language

const getLang = async userId => {
  let {body} = await request.get(baseURL + '/user/' + userId)
  return body.success ? body.user.userLang : i18nRaw.default
}

module.exports = async (msg, userId) => {
  let args = msg.split(' '), userLang = await getLang(userId)
  const i18n = i18nRaw(userLang)

  let command = root
  while (true) {
    if (args.length == 0) {
      return command([], userId)
    }
    // Check if args[0] is a subcommand
    let subcommand = command[i18n.commands[args[0]]]
    //console.log(command, subcommand, args)
    if (subcommand == undefined) {
      // Cannot find the subcommand; pass args to command
      return command(args, userId, userLang)
    } else {
      // Found subcommand
      command = subcommand
      args.shift()
    }
  }
}