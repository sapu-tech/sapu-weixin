'use strict'

const xml2js = require('xml2js-es6-promise')

module.exports = {
  async receive(buf) {
    let json = await xml2js(buf)
    let data = json.xml
    console.log("    <= " + data.Content[0])
  },

  send(msg, name) {
    console.log("    " + name + " => " + msg.content)
    return `<xml>
      <ToUserName><![CDATA[${msg.toUserName}]]></ToUserName>
      <FromUserName><![CDATA[${msg.fromUserName}]]></FromUserName>
      <CreateTime>${Math.round(new Date().getTime() / 1000)}</CreateTime>
      <MsgType><![CDATA[${msg.msgType}]]></MsgType>
      <Content><![CDATA[${msg.content}]]></Content>
      <MsgId>6328225816737123944</MsgId>
      </xml>`
  }
}