var express = require('express');
var router = express.Router();
var weixin = require('weixin-api');
const interpretor = require('../lib/interpretor')

const send = msg => {
  weixin.sendMsg(msg)
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
  console.log("textMsg received")
  console.log(JSON.stringify(msg))

  interpretor(msg.content, msg.fromUserName)
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
    .catch(err => {
      console.error(err)
      let resMsg = {
        fromUserName : msg.toUserName,
        toUserName : msg.fromUserName,
        msgType : "text",
        content : "Error......",
        funcFlag : 0
      }

      send(resMsg)
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
