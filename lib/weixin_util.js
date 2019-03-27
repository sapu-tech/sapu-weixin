'use strict';

const request = require('superagent')
const {production} = require('../config')
const weixin = production ? require('../config').weixin : require('../config').weixin_debug
require('datejs')

let getAccessTokenClosure = () => {
  let token = null, expireTime = new Date()

  return () => {
    if (token != null && (new Date).isBefore(expireTime.addMinutes(-10))) {
      return new Promise((res, rej) => {res(token)})
    } else {
      //refresh token
      return request
        .get("https://api.weixin.qq.com/cgi-bin/token")
        .query({
          grant_type: weixin.grant_type,
          appid: weixin.appid,
          secret: weixin.secret,
        })
        .then(({body}) => {
          console.log(body)
          token = body.access_token
          expireTime = (new Date).addSeconds(parseInt(body.expires_in))
          return token
        })
    }
  }
}

module.exports.weixinUtil = {
  getAccessToken: getAccessTokenClosure(),

  getUserName: (access_token, userId) => {
    return request
      .get('https://api.weixin.qq.com/cgi-bin/user/info')
      .query({
        access_token: access_token,
        openid: userId,
        lang: 'zh_CN'
      })
      .then(({body}) => {
        console.log(body)
        return body.nickname
      })
  }
}