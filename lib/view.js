'use strict';

const moment = require('moment-timezone')
const _ = require('lodash')

const username = require('./username')
const i18n = require('../i18n')
require('datejs')

const places = require('../config').places

let previewDays = 10

let showOneDayListCore = (reservations, userIdName, month, date)=> {
  if (reservations.length == 0) return i18n['view_no_reservations']
  reservations.sort((r1, r2) => {return (r1.inDayId - r2.inDayId)})

  return [i18n['view_subtitle'].format(month, date)]
    .concat(reservations.map(reservation => {
      return i18n['view_reservation'].format(
        reservation.inDayId,
        userIdName[reservation.userId],
        moment(reservation.startTime).format('YYYY-MM-DD'),
        moment(reservation.startTime).format('HH:mm'),
        moment(reservation.endTime).format('HH:mm'),
        places[reservation.place]
      )
    })).join('\n')
}
let getUserName = (reservations, c) => {
  return username.getByArray(reservations.map(reservation => {return reservation.userId})).then(c)
}

module.exports = {
  showList: reservations => {
    return getUserName(reservations, userIdName => {
      let today = moment().startOf('day'), ddl = moment().startOf('day').add(previewDays, 'd')
      reservations = reservations.filter(reservation => {
        return moment(reservation.startTime).isBetween(today, ddl)
      })

      if (reservations.length == 0) return i18n['view_short_no_reservations']

      reservations.sort((r1, r2) => {
        let diff = (moment(r1.startTime).startOf('day')).diff(moment(r2.startTime).startOf('day'))
        return (diff == 0) ? (r1.inDayId - r2.inDayId) : diff
      })

      let reservationG = _.groupBy(reservations, reservation => {
        return moment(reservation.startTime).startOf('day').toDate()
      })

      let r = [i18n['view_reservations_followed_below']]
      for (let g in reservationG) {
        let gDate = moment(g)
        r.push('')
        r.push(showOneDayListCore(reservationG[g], userIdName, gDate.month() + 1, gDate.date()))
      }

      return r.join('\n')
    })
  },

  showFullList: reservations => {
    return getUserName(reservations, userIdName => {
      if (reservations.length == 0) return i18n['view_no_reservations']

      reservations.sort((r1, r2) => {
        let diff = (moment(r1.startTime).startOf('day')).diff(moment(r2.startTime).startOf('day'))
        return (diff == 0) ? (r1.inDayId - r2.inDayId) : diff
      })

      let reservationG = _.groupBy(reservations, reservation => {
        return moment(reservation.startTime).startOf('day').format()
      })

      let r = [i18n['view_reservations_followed_below']]
      for (let g in reservationG) {
        let gDate = moment(g)
        r.push('')
        r.push(showOneDayListCore(reservationG[g], userIdName, gDate.month() + 1, gDate.date()))
      }

      return r.join('\n')
    })
  },

  showOneDayList: (reservations, month, date) => {
    /*let today = moment().startOf('day'), ddl = moment().startOf('day').add(previewDays, 'd')
    reservations = reservations.filter(reservation => {
      return moment(reservation.startTime).isBetween(today, ddl)
    })*/
    return getUserName(reservations,
      userIdName => {return showOneDayListCore(reservations, userIdName, month, date)}
    )
  }
}
