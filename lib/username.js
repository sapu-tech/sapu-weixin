'use strict';

const request = require('superagent-promise')(require('superagent'), Promise)
const i18nRaw = require('../i18n')
const {baseURL} = require('../config')

module.exports = {
  get: async userId => {
    let {body} = await request.get(baseURL + '/user/' + userId)
    return body.success ? body.user.userName : ""
  },

  //will return an object of {userId: userName}
  getByArray: async userIds => {
    if (!Array.isArray(userIds) || userIds.length <= 0) return {}
    let {body} = await request
      .get(baseURL + '/user')
      .query({userIds: userIds})

    return body.users.reduce((set, user) => {set[user.userId] = user.userName; return set}, {})
  },

  getByArrayPure: async userIds => {
    if (!Array.isArray(userIds) || userIds.length <= 0) return {}
    let {body} = await request
      .get(baseURL + '/user')
      .query({userIds: userIds})
    
    return body.users
  },

  setname: async (args, userId, userLang) => {
    const i18n = i18nRaw(userLang)

    let {body} = await request
      .post(baseURL + "/user/" + userId)
      .send({userName: args[0]})

    return body.success ? i18n['username_set_name_to'].format(args[0]) : i18n['username_not_blank']
  }
}