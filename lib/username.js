'use strict';

const request = require('superagent-promise')(require('superagent'), Promise)
const i18n = require('../i18n')
const {replyBuilder} = require('./utils')
const {baseURL} = require('../config')

let username

module.exports = username = {
  get: userId => {
    return request
      .get(baseURL + '/user/' + userId)
      .then(({body}) => {
        if (body.success) {
          return body.user.userName
        } else {
          return ""
        }
      })
  },

  //will return a Promise, giving the object of {userId: userName}
  getByArray: userIds => {
    if (!Array.isArray(userIds) || userIds.length <= 0) return new Promise((res, rej) => {res({})})
    return request
      .get(baseURL + '/user')
      .query({userIds: userIds})
      .then(({body}) => {
        return body.users.reduce((set, user) => {set[user.userId] = user.userName; return set}, {})
      })
  },

  getByArrayPure: userIds => {
    if (!Array.isArray(userIds) || userIds.length <= 0) return new Promise((res, rej) => {res({})})
    return request
      .get(baseURL + '/user')
      .query({userIds: userIds})
      .then(({body}) => {
        return body.users
      })
  },

  setname: (args, userId) => {
    return request
      .post(baseURL + "/user/" + userId)
      .send({userId, userName: args[0]})
      .then(({body}) => {
        if (body.success)
          return i18n['username_set_name_to'].format(args[0])
        else
          return i18n['username_not_blank']
      })
  }
}