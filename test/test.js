// connect to database
require('../app')
const mongoose = require('mongoose')
//const {user} = require('../config').test
//const User = mongoose.model('User')

before(async function() {
  await mongoose.connection.dropDatabase()
  //await User.create(user)
})

// require('./tests/user')
// require('./tests/reservation')
require('./tests/weixin')