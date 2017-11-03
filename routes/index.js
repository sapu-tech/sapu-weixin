var express = require('express');
var router = express.Router();
var weixin = require('weixin-api');
const interpretor = require('../lib/interpretor')
const {production} = require('../config')

const send = (reply, incoming) => {
  reply.fromUserName = incoming.toUserName
  reply.toUserName = incoming.fromUserName
  weixin.sendMsg(reply)
}

const sendWrapper = (reply, incoming) => {
  let resMsg = {
    msgType : "text",
    content : reply,
    funcFlag : 0
  }

  send(resMsg, incoming)
}

const sender = (replies, incoming) => {
  if (Array.isArray(replies)) {
    replies.map(reply => {
      send(reply, incoming)
    })
  } else 
    sendWrapper(replies, incoming)
}

// 接入验证
router.get('/', (req, res) => {
  if (weixin.checkSignature(req)) {
    res.status(200).send(req.query.echostr)
  } else {
    res.status(200).send('fail')
  }
})

weixin.textMsg(function(msg) {
  if (!production)
    console.log(`Message : ${JSON.stringify(msg)}`)

  interpretor(msg.content, msg.fromUserName)
    .then(reply => {
      if (!production)
        console.log(`Reply : ${JSON.stringify(reply)}`)

      sender(reply, msg)
    })
    .catch(e => {
      if (!production)
        console.error(e)
      
      sender("Error...", msg)
    })
    .catch(console.error)
})

router.post('/', weixin.loop.bind(weixin))

module.exports = router
