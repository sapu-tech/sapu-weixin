'use strict';

const util = require('util')
const exec = util.promisify(require('child_process').exec)
const i18n = require('../i18n')
require('string-format-js')

module.exports = async (args, userId, userLang) => {
  const {stdout:git_log_stdout, } = await exec('git log --oneline | head -n 1')
  const {stdout:git_url_stdout, } = await exec('git remote show origin -n | grep Fetch')
  return i18n(userLang).version.log.format(git_log_stdout.trim(), git_url_stdout.trim())
}