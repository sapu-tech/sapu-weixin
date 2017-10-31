'use strict'

const i18n = require('../i18n')
const {replyBuilder, replyFBuilder} = require('./utils')
const library = require('../resource/library')

const messageBuilder = music => {
  return [
    // {
    //   msgType: "text",
    //   content: "Here are some interesting music!",
    //   funcFlag: 0
    // },
    {
      msgType : "music",
      title : music.title,
      description : music.description,
      musicUrl : music.url,
      HQMusicUrl : music.url,
      funcFlag : 0
    }
  ]
}

const randomPick = () => {
  let n = library.length
  return library[Math.floor(Math.random() * n)]
}

module.exports = () => {
  return Promise.resolve(messageBuilder(randomPick()))
}