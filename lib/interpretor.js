'use strict';

const i18n = require('../i18n')
const reserve = require('./reserve')
const flirt = require('./flirt')
const info = require('./info')
const username = require('./username')
const {replyBuilder, replyFBuilder} = require('./utils')
require('datejs')

let root = () => {
  /*if (Math.random() > 0.3)
    return Promise.resolve(i18n['root_help'])
  else
    return flirt()*/
  return Promise.resolve(i18n['root_help'])
}
root.reserve = reserve
root.setname = username.setname
root.flirt = flirt
root.info = info

//console.log(root)

module.exports = (msg, userId) => {
  let args = msg.split(' ')

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
      return command(args, userId)
    } else {
      // Found subcommand
      command = subcommand
      args.shift()
    }
  }
}