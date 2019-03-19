'use strict';

const request = require('superagent-promise')(require('superagent'), Promise)
const moment = require('moment-timezone')
const i18nRaw = require('../i18n')
const username = require('./username')
const view = require('./view')
require('string-format-js')

const {baseURL} = require('../config')

let reserve = async (args, userId, userLang) => i18nRaw(userLang)['reserve_help']

reserve.list = async (args, userId, userLang) => {
  if (args.length < 2) {
    let {body} = await request.get(baseURL + '/reservation/')
    return view.showList(body.reservations, userLang)
  }
  else {
    let [month, date] = args
    let {body} = await request.get(baseURL + '/reservation/' + month + '/' + date)
    return view.showOneDayList(body.reservations, month, date, userLang)
  }
}

reserve.all = async (args, userId, userLang) => {
  let {body} = await request.get(baseURL + '/reservation/')
  return view.showFullList(body.reservations, userLang)
}

let getDemical = str => {
  let x = Number(str), n = parseInt(x)
  return (x - n) || 0
}

reserve.new = async (args, userId, userLang) => {
  const i18n = i18nRaw(userLang)

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
    return i18n['reserve_new_argument_error']

  // Pick the right date
  let today = moment().startOf('day'),
    thisYearDate = moment(today).month(month).date(date),
    nextMonthDate = moment(today).month(month).add({months: 1}).date(date),
    nextYearDate = moment(today).add({years: 1}).month(month).date(date),
    d = thisYearDate

  if (today > thisYearDate)
    d = nextYearDate

  if (d > nextMonthDate)
    return i18n['reserve_new_too_far_soon_error']

  const nextWeekDate = moment(today).add({days: 7})
  console.log(`today ${today.format()}`)
  console.log(`d ${d.format()}`)
  console.log(`nextWeekDate ${nextWeekDate.format()}`)
  if (today >= d)
    return i18n['reserve_time_out_of_period_not_today']
  if (nextWeekDate < d)
    return i18n['reserve_time_out_of_period_not_a_week_later']

  let startTime = moment(d).hour(startHour).minute(startMinute),
    endTime = moment(d).hour(endHour).minute(endMinute)
  let data = {
    userId: userId,
    startTime : startTime,
    endTime: endTime,
    place: place
  }
  let userName = await username.get(userId)
  if (userName == "") {
    //Notify the user to set name
    return i18n['reserve_new_set_name_notice']
  } else {
    data.userName = userName
    let {body} = await request
      .post(baseURL + '/reservation/')
      .send(data)

    if (body.success)
      return i18n['reserve_new_id'].format(body.reservation.inDayId)
    else {
      let users = await username.getByArrayPure(body.content)
      let userStr = users.map(user => user.userName).join(' ')
      return i18n['reserve_new_failed'].format(userStr)
    }
  }
}

reserve.delete = async (args, userId, userLang) => {
  const i18n = i18nRaw(userLang)

  let [month, date, inDayId] = args

  month = parseInt(month)
  date = parseInt(date)

  let p = Number.isFinite(month) && Number.isFinite(date)
  if (!p) return i18n['arguments_error']

  let {body} = await request.get(baseURL + '/reservation/' + month + '/' + date + '/' + inDayId)
  if (body.success) {
    let {body: body_} = await request.del(baseURL + '/reservation/' + userId + '/' + body.reservation.reservationId)
    if (body_.success)
      return i18n['reserve_delete_id'].format(month, date, inDayId)
    else
      return i18n['reserve_delete_failed'].format(month, date, inDayId, i18n['reserve_delete_forbidden'])
  }
  else
    return i18n['reserve_delete_failed'].format(month, date, inDayId, i18n['reserve_delete_no_found'])
}

module.exports = reserve
