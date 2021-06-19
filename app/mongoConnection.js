const {devEnvironment, mongo} = require('./config')

const mongoose = require('mongoose')

async function init(){
    await mongoose.connect( devEnvironment ? mongo.mongoDevelopmentUrl : mongo.mongoProductionUrl, mongo.options)
}

init();
module.exports = mongoose;