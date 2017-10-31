var express = require('express');
var router = express.Router();
var weixin = require('weixin-api');
const interpretor = require('../lib/interpretor')
const {production} = require('../config')

const send = (old, n) => {
  n.fromUserName = old.toUserName,
  n.toUserName = old.fromUserName,
  weixin.sendMsg(n)
}

const sendWrapper = (msg, reply) => {
  let resMsg = {
    msgType : "text",
    content : reply,
    funcFlag : 0
  }

  send(msg, resMsg)
}

// 接入验证
router.get('/', function(req, res) {
  if (weixin.checkSignature(req)) {
    res.status(200).send(req.query.echostr)
  } else {
    res.status(200).send('fail')
  }
});

// 监听文本消息
weixin.textMsg(function(msg) {
  if (!production) {
    console.log("textMsg received")
    console.log(JSON.stringify(msg))
  }

  interpretor(msg.content, msg.fromUserName)
    .then(reply => {
      if (!production) {
        console.log('\nReplies : \n' + reply + '\n')
      }

      if (Array.isArray(reply)) {
        for (let r of reply) {
          send(msg, r)
        }
      } else {
        sendWrapper(msg, reply)
      }
    })
    .catch(err => {
      if (!production) {
        console.error(err)
      }
      sendWrapper(msg, "Error...")
    })
})

// 监听文本消息
weixin.eventMsg(function(msg) {
  console.log("eventMsg received")
  console.log(JSON.stringify(msg))

  interpretor('help', msg.fromUserName)
    .then(reply => {
      console.log('\nReplies : \n' + reply + '\n')

      let resMsg = {
        fromUserName : msg.toUserName,
        toUserName : msg.fromUserName,
        msgType : "text",
        content : reply,
        funcFlag : 0
      }

      send(resMsg)
    })
    .catch(err => {console.log(err)})
})

router.post('/', function(req, res) {
  weixin.loop(req, res)
})

module.exports = router
