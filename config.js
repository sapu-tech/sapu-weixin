const production = process.env.NODE_ENV === 'production'
const dbname = production ? 'sapu' : 'test'
const baseURL = `http://localhost:${process.env.PORT || '3000'}`
const {weixin, weixin_debug} = require('./secret')

module.exports = {
  production,
  db: `mongodb://localhost/${dbname}`,
  baseURL,

  test: {
    db: 'mongodb://localhost/test',
    baseURL: `http://localhost:${process.env.port || '3000'}`,
    userId: '1500000000',
    msg: {
      toUserName: 'gh_0b791a19de95',
      fromUserName: '',
      msgType: 'text',
      content: '',
      funcFlag: 0
    },
    users: [{userId: '1500000000', userName: "Owen"}, {userId: '1700000000', userName: "Newbie"}],
    token: "asdfasdf"
  },

  errors: {
    0: "Unknown Error",
    1: "Time Conflict",
    2: "Reservation Not Found",
    3: "User Not Found",
    4: "UserName Cannot Be Blank",
    5: "Deleting other's Reservation Forbidden"
  },

  places: {
    0: "B241",
    1: "B255"
  },

  weixin,
  weixin_debug
}