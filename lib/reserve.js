'use strict';

const request = require('superagent-promise')(require('superagent'), Promise)
const moment = require('moment-timezone')
const i18n = require('../i18n')
const {replyBuilder, replyFBuilder} = require('./utils')
const username = require('./username')
const view = require('./view')
require('string-format-js')

const {baseURL} = require('../config')

let reserve = replyFBuilder(i18n['reserve_help'])

reserve.list = args => {
  if (args.length < 2)
    return request
      .get(baseURL + '/reservation/')
      .then(({body}) => {return view.showList(body.reservations)})
  else {
    let [month, date] = args
    return request
      .get(baseURL + '/reservation/' + month + '/' + date)
      .then(({body}) => {return view.showOneDayList(body.reservations, month, date)})
  }
}

reserve.all = args => {
  return request
    .get(baseURL + '/reservation/')
    .then(({body}) => {return view.showFullList(body.reservations)})
}

let getDemical = str => {
  let x = Number(str), n = parseInt(x)
  return (x - n) || 0
}

reserve.new = (args, userId) => {
  // Assign arguments
  let [month, date, startHour, endHour, place] = args
  month = parseInt(month) - 1
  date = parseInt(date)
  let startMinute = parseInt(getDemical(startHour) * 2) * 30,
    endMinute = parseInt(getDemical(endHour) * 2) * 30
  startHour = parseInt(startHour) || 0
  endHour = parseInt(endHour) || 0

  // Check arguments
  let todayMoment = moment().startOf('day'),
    startMoment = moment(todayMoment).hour(startHour).minute(startMinute),
    endMoment = moment(todayMoment).hour(endHour).minute(endMinute),
    tomorrowMoment = moment(todayMoment).add({days: 1})

  let perm = todayMoment.isBefore(startMoment)
              && startMoment.isBefore(endMoment)
              && endMoment.isBefore(tomorrowMoment)
  if (!perm)
    return replyBuilder(i18n['reserve_new_argument_error'])

  // Pick the right date
  let today = moment().startOf('day'),
    thisYearDate = moment(today).month(month).date(date),
    nextYearDate = moment(today).add({years: 1}).month(month).date(date),
    d = thisYearDate

  if (today > thisYearDate)
    d = nextYearDate

  let startTime = moment(d).hour(startHour).minute(startMinute),
    endTime = moment(d).hour(endHour).minute(endMinute)
  let data = {
    userId: userId,
    startTime : startTime,
    endTime: endTime,
    place: place
  }
  return username.get(userId)
    .then(userName => {
      if (userName == "") {
        //Notify the user to set name
        return i18n['reserve_new_set_name_notice']
      } else {
        data.userName = userName
        return request
          .post(baseURL + '/reservation/')
          .send(data)
          .then(function({body}) {
            if (body.success)
              return i18n['reserve_new_id'].format(body.reservation.inDayId)
            else
              return username.getByArrayPure(body.content)
                .then(users => {
                  let userStr = users.reduce((str, user) => {return str + user.userName + " "}, "")
                  return replyBuilder(i18n['reserve_new_failed'].format(userStr))
                })
          })
      }
    })
}

reserve.delete = (args, userId) => {
  let [month, date, inDayId] = args

  month = parseInt(month)
  date = parseInt(date)

  let p = Number.isFinite(month) && Number.isFinite(date)
  if (!p) return replyBuilder(i18n['arguments_error'])

  return request
    .get(baseURL + '/reservation/' + month + '/' + date + '/' + inDayId)
    .then(({body}) => {
      if (body.success)
        return request
          .del(baseURL + '/reservation/' + userId + '/' + body.reservation.reservationId)
          .then(({body}) => {
            if (body.success)
              return i18n['reserve_delete_id'].format(month, date, inDayId)
            else
              return i18n['reserve_delete_failed'].format(month, date, inDayId, i18n['reserve_delete_forbidden'])
          })
      else
        return i18n['reserve_delete_failed'].format(month, date, inDayId, i18n['reserve_delete_no_found'])
    })
}

module.exports = reserve
