const glob = require('glob'),
  path = require('path')

let i18ns = {}

for (let langFile of glob.sync(path.posix.resolve('locales/**/*.js'))) {
  let lang = path.basename(langFile, '.js')
  i18ns[lang] = require(langFile)
}

module.exports = i18ns['zh-cn']