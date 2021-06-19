const configurations = require('./config')
const mongoClientForRoomModel = require('./models/roomModel')
const currentEnvironment = configurations.devEnvironment ? configurations.development : configurations.production
const express = require('express')
const bodyParser = require('body-parser')
const roomService = require('./routes/roomRoute')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(roomService)

app.get('/about-service', function (request, response) {
    return response.send('Hello Yalla Dardasha  / service-name : ' + configurations.serviceName + ', service-description : ' + configurations.serviceDescription);
})

app.get('/reset-service', async function (request, response) {
    await mongoClientForRoomModel.remove({})
    return response.json('mongo db removed')
})

app.get('/all', async function (request, response) {
    mongoClientForRoomModel.find({}, function (err, users) {
        return response.send(users);
    });
})


app.listen(currentEnvironment.port, function () {
    console.log(`application running in ${currentEnvironment.url}`);
});