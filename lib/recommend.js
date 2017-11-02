'use strict'

const i18n = require('../i18n')
const {replyBuilder, replyFBuilder} = require('./utils')
const library = require('../resource/library')
const musicAPI = require('music-api')

const messageBuilder = ({name, desc}, url) => {
  return [{
    msgType : "music",
    title : name,
    description : desc,
    musicUrl : url,
    HQMusicUrl : url,
    funcFlag : 0
  }]
}

const failmsgBuilder = () => {
  return {
    msgType : "text",
    content : "一时找不到这个曲子的链接……再试试看？",
    funcFlag : 0
  }
}

const randomPick = () => {
  let n = library.length
  return library[Math.floor(Math.random() * n)]
}

async function core() {
  let song = randomPick()
  let {success, url} = await musicAPI.getSong(song.vendor, {id: String(song.id)})
  if (success) {
    return messageBuilder(song, url)
  } else {
    return failmsgBuiler()
  }
}

module.exports = () => {
  return core()
}