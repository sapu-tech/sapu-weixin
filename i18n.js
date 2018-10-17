const glob = require('glob'),
  path = require('path')

let i18ns = {}

// for (let langFile of glob.sync(path.posix.resolve('locales/**/*.js'))) {
//   let lang = path.basename(langFile, '.js')
//   i18ns[lang] = require(langFile)
// }

const supportedLang = ['zh-cn', 'en', 'coder']
for (let lang of supportedLang)
  i18ns[lang] = require(`./locales/${lang}.js`)

let selector = lang => {
  if (!Number.isFinite(lang))
    lang = 0
  if (lang < 0)
    lang = 0
  if (lang >= supportedLang.length)
    lang = supportedLang.length - 1

  return i18ns[supportedLang[lang]]
}

selector.default = 0

module.exports = selector