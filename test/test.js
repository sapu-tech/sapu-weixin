require('../app')
const mongoose = require('mongoose')

before(async function() {
  await mongoose.connection.dropDatabase()
})

require('./tests/user')
require('./tests/reservation')

after(async function() {
  mongoose.connection.close()
})